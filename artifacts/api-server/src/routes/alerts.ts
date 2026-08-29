import { Router, type Request, type Response } from "express";
import { db, alertsTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router = Router();

// GET /api/alerts - List all bulletins
router.get("/alerts", async (_req: Request, res: Response) => {
  try {
    const alerts = await db.select().from(alertsTable).orderBy(desc(alertsTable.createdAt)).limit(30);
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch alerts", details: String(error) });
  }
});

// POST /api/alerts - Issue alert
router.post("/alerts", async (req: Request, res: Response) => {
  try {
    const { region, severity = "yellow", message, source = "IMD Regional Centre", verifiedBy } = req.body;
    if (!region || !message) {
      res.status(400).json({ error: "region and message are required" });
      return;
    }
    const inserted = await db
      .insert(alertsTable)
      .values({ region, severity, message, source, verifiedBy })
      .returning();
    res.status(201).json(inserted[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to create alert", details: String(error) });
  }
});

// POST /api/alerts/broadcast - Simulate SMS & WhatsApp Emergency Fan-Out
router.post("/alerts/broadcast", async (req: Request, res: Response) => {
  try {
    const { alertId, channel = "all", targetRegion, languages = ["en", "hi", "or"] } = req.body;

    let alert = null;
    if (alertId) {
      const found = await db.select().from(alertsTable).where(desc(alertsTable.id)).limit(1);
      alert = found[0];
    }

    // Mathematical simulation of Cell Broadcast / CAP fan-out metrics
    const baseSubscribers = 2450000;
    const deliveryRate = 0.993;
    const deliveredCount = Math.round(baseSubscribers * deliveryRate);
    const latencySec = Number((Math.random() * 2.8 + 2.1).toFixed(1));

    const broadcastLog = {
      broadcastId: `cap_bcast_${Date.now()}`,
      alertId: alertId || 1,
      targetRegion: targetRegion || "Odisha & North Andhra Coastal Corridor (Districts: Puri, Jagatsinghpur, Kendrapara, Ganjam)",
      channels: channel === "all" ? ["Cell Broadcast (SMS-CB)", "WhatsApp Emergency Channel", "AIR / Doordarshan Sirens", "NDMA Sachet App"] : [channel],
      languagesDispatched: languages,
      metrics: {
        totalTargetPopulation: baseSubscribers,
        messagesDelivered: deliveredCount,
        deliverySuccessRate: "99.3%",
        averageLatencySeconds: latencySec,
        cellTowersEngaged: 342,
        activePriorityLevel: "High Priority / Life-Safety Override",
      },
      sentAt: new Date().toISOString(),
      status: "COMPLETED",
    };

    res.status(200).json({
      success: true,
      message: `Emergency alert broadcast dispatched across ${broadcastLog.channels.length} channels to ${deliveredCount.toLocaleString()} citizen devices.`,
      broadcast: broadcastLog,
    });
  } catch (error) {
    res.status(500).json({ error: "Broadcast fan-out failed", details: String(error) });
  }
});

export default router;
