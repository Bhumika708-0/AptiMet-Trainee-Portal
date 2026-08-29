import { Router, type Request, type Response } from "express";
import { db, forecastsTable, forecastScoresTable, cyclonesTable, cycloneTracksTable, usersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { evaluateForecastAccuracy } from "../lib/accuracyEngine";
import { calculateSoloForecastElo } from "../lib/eloEngine";

const router = Router();

// GET /api/forecasts - List recent forecasts with granular error breakdown
router.get("/forecasts", async (_req: Request, res: Response) => {
  try {
    const list = await db
      .select({
        id: forecastsTable.id,
        userId: forecastsTable.userId,
        cycloneId: forecastsTable.cycloneId,
        predictedRainfall: forecastsTable.predictedRainfall,
        predictedSeverity: forecastsTable.predictedSeverity,
        predictedTrack: forecastsTable.predictedTrack,
        submittedAt: forecastsTable.submittedAt,
        accuracyScore: forecastScoresTable.accuracyScore,
        trackErrorKm: forecastScoresTable.trackErrorKm,
        timingErrorHrs: forecastScoresTable.timingErrorHrs,
        intensityErrorKt: forecastScoresTable.intensityErrorKt,
        explanationNotes: forecastScoresTable.explanationNotes,
        scoringMethod: forecastScoresTable.scoringMethod,
      })
      .from(forecastsTable)
      .leftJoin(forecastScoresTable, eq(forecastsTable.id, forecastScoresTable.forecastId))
      .orderBy(desc(forecastsTable.submittedAt))
      .limit(50);

    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch forecasts", details: String(error) });
  }
});

// POST /api/forecasts - Submit a forecast and run AI Forecast Accuracy Engine
router.post("/forecasts", async (req: Request, res: Response) => {
  try {
    const {
      userId = "usr_ananya_sharma",
      cycloneId,
      predictedRainfall,
      predictedSeverity,
      predictedTrack,
      predictedPressure,
      predictedWindSpeed,
    } = req.body;

    if (!cycloneId) {
      res.status(400).json({ error: "cycloneId is required" });
      return;
    }

    // 1. Fetch cyclone ground-truth tracks & metadata
    const cyclone = await db
      .select()
      .from(cyclonesTable)
      .where(eq(cyclonesTable.id, cycloneId))
      .limit(1);

    if (!cyclone[0]) {
      res.status(404).json({ error: "Cyclone not found in meteorological catalog" });
      return;
    }

    const groundTracks = await db
      .select()
      .from(cycloneTracksTable)
      .where(eq(cycloneTracksTable.cycloneId, cycloneId));

    // 2. Insert forecast into DB
    const insertedForecast = await db
      .insert(forecastsTable)
      .values({
        userId,
        cycloneId,
        predictedRainfall: predictedRainfall !== undefined ? Number(predictedRainfall) : null,
        predictedSeverity: predictedSeverity || (Number(predictedRainfall) > 150 ? "Very severe" : "Severe"),
        predictedTrack: Array.isArray(predictedTrack) ? predictedTrack : null,
      })
      .returning();

    const forecast = insertedForecast[0];

    // 3. Run AI Forecast Accuracy Engine
    const accuracyResult = evaluateForecastAccuracy(
      Array.isArray(predictedTrack) ? predictedTrack : undefined,
      predictedRainfall !== undefined ? Number(predictedRainfall) : undefined,
      predictedPressure !== undefined ? Number(predictedPressure) : undefined,
      predictedWindSpeed !== undefined ? Number(predictedWindSpeed) : undefined,
      {
        id: cyclone[0].id,
        name: cyclone[0].name,
        actualRainfall: cyclone[0].metadata?.actualRainfall,
        peakWindSpeed: cyclone[0].peakWindSpeed,
        minPressure: cyclone[0].minPressure,
        tracks: groundTracks,
      }
    );

    // 4. Insert detailed score breakdown into forecast_scores
    const insertedScore = await db
      .insert(forecastScoresTable)
      .values({
        forecastId: forecast.id,
        accuracyScore: accuracyResult.accuracyScore,
        trackErrorKm: accuracyResult.trackErrorKm,
        timingErrorHrs: accuracyResult.timingErrorHrs,
        intensityErrorKt: accuracyResult.intensityErrorKt,
        explanationNotes: accuracyResult.explanationNotes,
        scoringMethod: accuracyResult.scoringMethod,
      })
      .returning();

    // 5. Update user Points, Accuracy Rating, and Live ELO Rating
    const user = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    let eloUpdate = { newRating: 1200, delta: 0, tier: "Trainee Observer" };
    let pointsAwarded = Math.round(accuracyResult.accuracyScore * 1.5);

    if (user[0]) {
      const currentElo = user[0].eloRating || 1200;
      eloUpdate = calculateSoloForecastElo(currentElo, accuracyResult.accuracyScore);

      const newPoints = user[0].points + pointsAwarded;
      const newAccuracy = Number(((user[0].accuracyRating * 4 + accuracyResult.accuracyScore) / 5).toFixed(1));

      await db
        .update(usersTable)
        .set({
          points: newPoints,
          accuracyRating: newAccuracy,
          eloRating: eloUpdate.newRating,
        })
        .where(eq(usersTable.id, userId));
    }

    res.status(201).json({
      forecast,
      score: insertedScore[0],
      accuracyResult,
      eloUpdate,
      pointsAwarded,
      cyclone: cyclone[0],
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to submit forecast", details: String(error) });
  }
});

export default router;
