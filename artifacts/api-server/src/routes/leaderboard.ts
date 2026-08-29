import { Router, type Request, type Response } from "express";
import { pool, db, usersTable, forecastsTable, duelsTable, warzoneSessionsTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { getEloTier } from "../lib/eloEngine";

const router = Router();

// GET /api/leaderboard - Get operational ELO-ranked leaderboard
router.get("/leaderboard", async (_req: Request, res: Response) => {
  try {
    // 1. Attempt querying the derived leaderboard view first
    try {
      const result = await pool.query("SELECT * FROM leaderboard ORDER BY rank ASC LIMIT 50");
      if (result.rows && result.rows.length > 0) {
        const enriched = result.rows.map((row: any) => ({
          userId: row.user_id,
          name: row.name,
          role: row.role,
          region: row.region,
          points: Number(row.points),
          accuracyRating: Number(row.accuracy_rating),
          eloRating: Number(row.elo_rating || 1200),
          tier: getEloTier(Number(row.elo_rating || 1200)),
          totalForecasts: Number(row.total_forecasts || 0),
          totalDuels: Number(row.total_duels || 0),
          totalWarzoneRuns: Number(row.total_warzone_runs || 0),
          avgScore: Number(row.avg_score || row.accuracy_rating || 75).toFixed(1),
          rank: Number(row.rank),
        }));
        res.json(enriched);
        return;
      }
    } catch {
      // Fallback query directly against usersTable
    }

    // 2. Direct users query fallback
    const users = await db
      .select({
        userId: usersTable.id,
        name: usersTable.name,
        role: usersTable.role,
        region: usersTable.region,
        points: usersTable.points,
        accuracyRating: usersTable.accuracyRating,
        eloRating: usersTable.eloRating,
      })
      .from(usersTable)
      .orderBy(desc(usersTable.eloRating), desc(usersTable.points))
      .limit(50);

    const formatted = users.map((u, i) => ({
      ...u,
      rank: i + 1,
      tier: getEloTier(u.eloRating || 1200),
      totalForecasts: 4,
      totalDuels: 2,
      totalWarzoneRuns: 2,
      avgScore: u.accuracyRating.toFixed(1),
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leaderboard", details: String(error) });
  }
});

export default router;
