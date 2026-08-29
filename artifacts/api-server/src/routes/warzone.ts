import { Router, type Request, type Response } from "express";
import { db, warzoneSessionsTable, usersTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";

const router = Router();

// GET /api/warzone/sessions - List recent sessions
router.get("/warzone/sessions", async (_req: Request, res: Response) => {
  try {
    const sessions = await db
      .select()
      .from(warzoneSessionsTable)
      .orderBy(desc(warzoneSessionsTable.completedAt))
      .limit(20);

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch warzone sessions", details: String(error) });
  }
});

// POST /api/warzone/session - Record completed simulation run
router.post("/warzone/session", async (req: Request, res: Response) => {
  try {
    const {
      userId = "usr_ananya_sharma",
      region = "Bay of Bengal - Paradip Sector",
      scenarioId = "cyclone-response-01",
      decisionsLog,
      outcomeScore,
    } = req.body;

    if (!decisionsLog || outcomeScore === undefined) {
      res.status(400).json({ error: "decisionsLog and outcomeScore are required" });
      return;
    }

    const inserted = await db
      .insert(warzoneSessionsTable)
      .values({
        userId,
        region,
        scenarioId,
        decisionsLog,
        outcomeScore: Number(outcomeScore),
      })
      .returning();

    // Award bonus points based on score
    const pointsAwarded = Math.round(Number(outcomeScore) * 2);
    const user = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    if (user[0]) {
      await db
        .update(usersTable)
        .set({ points: user[0].points + pointsAwarded })
        .where(eq(usersTable.id, userId));
    }

    res.status(201).json({
      session: inserted[0],
      pointsAwarded,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to save warzone session", details: String(error) });
  }
});

export default router;
