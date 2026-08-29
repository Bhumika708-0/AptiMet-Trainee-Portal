/**
 * Live ELO-Style Ranking Engine for Forecast Duels & Verification
 * Based on FIDE/Chess ELO rating model adapted for operational forecasting.
 */

export interface EloPlayer {
  id: string;
  rating: number;
  points: number;
}

export interface EloDuelResult {
  player1NewRating: number;
  player2NewRating: number;
  player1Delta: number;
  player2Delta: number;
  expectedScorePlayer1: number;
  expectedScorePlayer2: number;
  kFactor: number;
  tierPlayer1: string;
  tierPlayer2: string;
}

/**
 * Resolve Rank Tier from ELO
 */
export function getEloTier(elo: number): { title: string; badge: string; color: string } {
  if (elo >= 1700) {
    return { title: "Chief Synoptic Forecaster", badge: "🏆 Grandmaster", color: "#b85042" };
  } else if (elo >= 1550) {
    return { title: "Senior Cyclone Analyst", badge: "🎖️ Lead Analyst", color: "#164d78" };
  } else if (elo >= 1400) {
    return { title: "Operational Meteorologist", badge: "🌟 Senior Forecaster", color: "#197576" };
  } else if (elo >= 1250) {
    return { title: "Duty Forecaster", badge: "🔷 Forecaster", color: "#3c6f9d" };
  } else {
    return { title: "Trainee Observer", badge: "🌱 Trainee", color: "#718491" };
  }
}

/**
 * Dynamic K-Factor:
 * Higher K-factor allows new trainees to calibrate quickly; lower K-factor stabilizes established analysts.
 */
export function getKFactor(rating: number): number {
  if (rating < 1300) return 32;
  if (rating < 1600) return 24;
  return 16;
}

/**
 * Calculate expected score for player A against player B
 * E_A = 1 / (1 + 10^((R_B - R_A) / 400))
 */
export function calculateExpectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

/**
 * Process Duel Outcome and calculate new ELO ratings
 * scorePlayer1: 1 (Win), 0.5 (Draw), 0 (Loss)
 */
export function calculateEloUpdate(
  rating1: number,
  rating2: number,
  scorePlayer1: number // 1 = P1 won, 0 = P2 won, 0.5 = Tie
): EloDuelResult {
  const expected1 = calculateExpectedScore(rating1, rating2);
  const expected2 = 1 - expected1;
  const scorePlayer2 = 1 - scorePlayer1;

  const k1 = getKFactor(rating1);
  const k2 = getKFactor(rating2);

  const delta1 = Math.round(k1 * (scorePlayer1 - expected1));
  const delta2 = Math.round(k2 * (scorePlayer2 - expected2));

  const newRating1 = Math.max(800, rating1 + delta1);
  const newRating2 = Math.max(800, rating2 + delta2);

  return {
    player1NewRating: newRating1,
    player2NewRating: newRating2,
    player1Delta: delta1,
    player2Delta: delta2,
    expectedScorePlayer1: Number(expected1.toFixed(3)),
    expectedScorePlayer2: Number(expected2.toFixed(3)),
    kFactor: k1,
    tierPlayer1: getEloTier(newRating1).title,
    tierPlayer2: getEloTier(newRating2).title,
  };
}

/**
 * Solo Mode Calibration against Historical Benchmark (Climatological Model Rating = 1420)
 * Evaluates performance against historical threshold accuracy
 */
export function calculateSoloForecastElo(
  userRating: number,
  accuracyScore: number
): { newRating: number; delta: number; tier: string } {
  const benchmarkRating = 1420;
  const expected = calculateExpectedScore(userRating, benchmarkRating);
  
  // Map 0-100 accuracy to normalized score:
  // >= 85 is considered beating the benchmark (1.0)
  // 65 - 84 is a draw (0.5)
  // < 65 is underperforming the benchmark (0.0)
  let actualOutcome = 0.5;
  if (accuracyScore >= 85) actualOutcome = 1.0;
  else if (accuracyScore < 65) actualOutcome = 0.0;

  const k = getKFactor(userRating);
  const delta = Math.round(k * (actualOutcome - expected));
  const newRating = Math.max(800, userRating + delta);

  return {
    newRating,
    delta,
    tier: getEloTier(newRating).title,
  };
}
