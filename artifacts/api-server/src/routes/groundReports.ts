import { Router, type Request, type Response } from "express";
import { db, groundReportsTable, usersTable } from "@workspace/db";
import { desc, eq, sql } from "drizzle-orm";

const router = Router();

// GET /api/ground-reports - List spotter reports
router.get("/ground-reports", async (req: Request, res: Response) => {
  try {
    const { category, verified } = req.query;
    
    let query = db
      .select({
        id: groundReportsTable.id,
        userId: groundReportsTable.userId,
        region: groundReportsTable.region,
        lat: groundReportsTable.lat,
        lon: groundReportsTable.lon,
        category: groundReportsTable.category,
        description: groundReportsTable.description,
        photoUrl: groundReportsTable.photoUrl,
        upvotes: groundReportsTable.upvotes,
        verificationCount: groundReportsTable.verificationCount,
        verified: groundReportsTable.verified,
        createdAt: groundReportsTable.createdAt,
      })
      .from(groundReportsTable)
      .orderBy(desc(groundReportsTable.createdAt))
      .limit(50);

    const reports = await query;
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch ground reports", details: String(error) });
  }
});

// POST /api/ground-reports - Submit spotter report
router.post("/ground-reports", async (req: Request, res: Response) => {
  try {
    const {
      userId = "usr_ananya_sharma",
      region,
      lat,
      lon,
      category = "damage",
      description,
      photoUrl,
    } = req.body;

    if (!region || !description || lat === undefined || lon === undefined) {
      res.status(400).json({ error: "region, description, lat, and lon are required" });
      return;
    }

    const inserted = await db
      .insert(groundReportsTable)
      .values({
        userId,
        region,
        lat: Number(lat),
        lon: Number(lon),
        category,
        description,
        photoUrl,
        upvotes: 1,
        verificationCount: 1,
        verified: false,
      })
      .returning();

    // Reward citizen reporter with points
    const user = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    if (user[0]) {
      await db
        .update(usersTable)
        .set({ points: user[0].points + 25 })
        .where(eq(usersTable.id, userId));
    }

    res.status(201).json(inserted[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to submit ground report", details: String(error) });
  }
});

// POST /api/ground-reports/:id/upvote - Upvote/confirm a citizen ground report
router.post("/ground-reports/:id/upvote", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const existing = await db.select().from(groundReportsTable).where(eq(groundReportsTable.id, id)).limit(1);
    if (!existing[0]) {
      res.status(404).json({ error: "Report not found" });
      return;
    }

    const newUpvotes = (existing[0].upvotes || 0) + 1;
    const newVerifications = (existing[0].verificationCount || 0) + 1;
    const shouldVerify = newVerifications >= 3 || existing[0].verified;

    const updated = await db
      .update(groundReportsTable)
      .set({
        upvotes: newUpvotes,
        verificationCount: newVerifications,
        verified: shouldVerify,
      })
      .where(eq(groundReportsTable.id, id))
      .returning();

    res.json({
      report: updated[0],
      verifiedNow: shouldVerify && !existing[0].verified,
      message: shouldVerify ? "Report verified by community consensus" : "Confirmation registered",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to upvote report", details: String(error) });
  }
});

// POST /api/ground-reports/:id/verify - Official validation
router.post("/ground-reports/:id/verify", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updated = await db
      .update(groundReportsTable)
      .set({ verified: true })
      .where(eq(groundReportsTable.id, id))
      .returning();

    if (!updated[0]) {
      res.status(404).json({ error: "Report not found" });
      return;
    }

    res.json({ report: updated[0], message: "Report officially validated by Duty Officer" });
  } catch (error) {
    res.status(500).json({ error: "Failed to verify report", details: String(error) });
  }
});

export default router;
