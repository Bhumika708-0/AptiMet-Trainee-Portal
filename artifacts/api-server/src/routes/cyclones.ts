import { Router, type Request, type Response } from "express";
import { db, cyclonesTable, cycloneTracksTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { syncLivePublicCycloneData } from "../lib/publicDataService";

const router = Router();

// GET /api/cyclones - List all cyclones
router.get("/cyclones", async (_req: Request, res: Response) => {
  try {
    const cyclones = await db.select().from(cyclonesTable);
    res.json(cyclones);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cyclones", details: String(error) });
  }
});

// GET /api/cyclones/:id - Get single cyclone with track points
router.get("/cyclones/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const cyclone = await db.select().from(cyclonesTable).where(eq(cyclonesTable.id, id)).limit(1);
    if (!cyclone[0]) {
      res.status(404).json({ error: "Cyclone not found" });
      return;
    }
    const tracks = await db.select().from(cycloneTracksTable).where(eq(cycloneTracksTable.cycloneId, id));
    res.json({ ...cyclone[0], tracks });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cyclone details", details: String(error) });
  }
});

// GET /api/cyclones/:id/tracks - Get track points only
router.get("/cyclones/:id/tracks", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const tracks = await db.select().from(cycloneTracksTable).where(eq(cycloneTracksTable.cycloneId, id));
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tracks", details: String(error) });
  }
});

// POST /api/cyclones/sync-live - Public Real-Data Hook (Ingest NOAA/IMD/GDACS live stream)
router.post("/cyclones/sync-live", async (_req: Request, res: Response) => {
  try {
    const result = await syncLivePublicCycloneData();
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Sync error", details: String(error) });
  }
});

export default router;
