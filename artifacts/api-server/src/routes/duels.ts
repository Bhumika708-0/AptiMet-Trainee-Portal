import { Router, type Request, type Response } from "express";
import { db, duelsTable, usersTable, cyclonesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { calculateEloUpdate, getEloTier } from "../lib/eloEngine";

const router = Router();

// GET /api/duels - List recent duels with player details & ELO tiers
router.get("/duels", async (_req: Request, res: Response) => {
  try {
    const list = await db
      .select()
      .from(duelsTable)
      .orderBy(desc(duelsTable.createdAt))
      .limit(30);

    const users = await db.select().from(usersTable);
    const userMap = new Map(users.map((u) => [u.id, u]));

    const enriched = list.map((d) => {
      const p1 = userMap.get(d.player1Id);
      const p2 = d.player2Id ? userMap.get(d.player2Id) : null;
      return {
        ...d,
        player1: p1 ? { id: p1.id, name: p1.name, elo: p1.eloRating, tier: getEloTier(p1.eloRating) } : null,
        player2: p2 ? { id: p2.id, name: p2.name, elo: p2.eloRating, tier: getEloTier(p2.eloRating) } : null,
      };
    });

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch duels", details: String(error) });
  }
});

// POST /api/duels - Create and resolve a duel with live ELO update
router.post("/duels", async (req: Request, res: Response) => {
  try {
    const {
      id = `duel_${Date.now()}`,
      player1Id = "usr_ananya_sharma",
      player2Id = "usr_rajesh_kumar",
      cycloneId = "fani-2019",
      player1Guess = { rainfall: 135, score: 92 },
      player2Guess = { rainfall: 120, score: 81 },
      status = "completed",
    } = req.body;

    // Fetch players to calculate ELO
    const p1 = await db.select().from(usersTable).where(eq(usersTable.id, player1Id)).limit(1);
    const p2 = await db.select().from(usersTable).where(eq(usersTable.id, player2Id)).limit(1);

    const score1 = Number(player1Guess?.score ?? 85);
    const score2 = Number(player2Guess?.score ?? 80);

    let winnerId: string | null = null;
    let matchOutcomeForP1 = 0.5; // Draw

    if (score1 > score2) {
      winnerId = player1Id;
      matchOutcomeForP1 = 1.0;
    } else if (score2 > score1) {
      winnerId = player2Id;
      matchOutcomeForP1 = 0.0;
    }

    let eloResult = null;
    if (p1[0] && p2[0]) {
      eloResult = calculateEloUpdate(p1[0].eloRating || 1200, p2[0].eloRating || 1200, matchOutcomeForP1);

      // Update both players' ELO and points in the DB
      await db
        .update(usersTable)
        .set({
          eloRating: eloResult.player1NewRating,
          points: p1[0].points + (winnerId === player1Id ? 50 : 15),
        })
        .where(eq(usersTable.id, player1Id));

      await db
        .update(usersTable)
        .set({
          eloRating: eloResult.player2NewRating,
          points: p2[0].points + (winnerId === player2Id ? 50 : 15),
        })
        .where(eq(usersTable.id, player2Id));
    }

    const inserted = await db
      .insert(duelsTable)
      .values({
        id,
        player1Id,
        player2Id,
        cycloneId,
        player1Guess,
        player2Guess,
        winnerId,
        status,
      })
      .returning();

    res.status(201).json({
      duel: inserted[0],
      eloResult,
      winnerId,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create duel", details: String(error) });
  }
});

export default router;
