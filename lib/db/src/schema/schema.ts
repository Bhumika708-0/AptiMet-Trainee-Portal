import { pgTable, text, serial, integer, real, boolean, timestamp, jsonb, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// ==========================================
// 1. USERS
// ==========================================
export const usersTable = pgTable("users", {
  id: text("id").primaryKey(), // e.g. "usr_ananya_sharma"
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull().default("official"), // 'student' | 'citizen' | 'official'
  region: text("region").notNull().default("Pune, Maharashtra"),
  points: integer("points").notNull().default(0),
  accuracyRating: real("accuracy_rating").notNull().default(0.0),
  eloRating: integer("elo_rating").notNull().default(1200),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(usersTable);
export const selectUserSchema = createSelectSchema(usersTable);
export type User = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;

// ==========================================
// 2. CYCLONES
// ==========================================
export const cyclonesTable = pgTable("cyclones", {
  id: text("id").primaryKey(), // e.g. "phailin-2013", "fani-2019", "tauktae-2021"
  name: text("name").notNull(),
  seasonYear: integer("season_year").notNull(),
  status: text("status").notNull().default("dissipated"), // 'active' | 'dissipated'
  source: text("source").notNull().default("IMD"), // 'IMD' | 'NOAA' | 'manual'
  basin: text("basin").notNull().default("Bay of Bengal"),
  peakWindSpeed: integer("peak_wind_speed").notNull().default(0), // km/h
  minPressure: integer("min_pressure").notNull().default(1000), // hPa
  metadata: jsonb("metadata").$type<{
    synopticContext?: string;
    officialCall?: string;
    confidenceNote?: string;
    correctRainfallRange?: [number, number];
    satelliteDescription?: string;
    windDirection?: string;
    actualRainfall?: number;
  }>(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertCycloneSchema = createInsertSchema(cyclonesTable);
export const selectCycloneSchema = createSelectSchema(cyclonesTable);
export type Cyclone = typeof cyclonesTable.$inferSelect;
export type InsertCyclone = typeof cyclonesTable.$inferInsert;

// ==========================================
// 3. CYCLONE TRACKS (Ground-truth path data)
// ==========================================
export const cycloneTracksTable = pgTable("cyclone_tracks", {
  id: serial("id").primaryKey(),
  cycloneId: text("cyclone_id").notNull().references(() => cyclonesTable.id, { onDelete: "cascade" }),
  timestamp: text("timestamp").notNull(), // ISO string or operational date e.g. "2013-10-11T06:00:00Z"
  lat: real("lat").notNull(),
  lon: real("lon").notNull(),
  windSpeed: integer("wind_speed").notNull(), // km/h
  pressure: integer("pressure").notNull(), // hPa
  category: text("category").notNull(), // 'Depression' | 'Deep Depression' | 'Cyclonic Storm' | 'Severe' | 'Super Cyclone'
}, (t) => [
  uniqueIndex("cyclone_tracks_cyclone_timestamp_idx").on(t.cycloneId, t.timestamp),
]);

export const insertCycloneTrackSchema = createInsertSchema(cycloneTracksTable);
export const selectCycloneTrackSchema = createSelectSchema(cycloneTracksTable);
export type CycloneTrack = typeof cycloneTracksTable.$inferSelect;
export type InsertCycloneTrack = typeof cycloneTracksTable.$inferInsert;

// ==========================================
// 4. FORECASTS (User predictions)
// ==========================================
export const forecastsTable = pgTable("forecasts", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  cycloneId: text("cyclone_id").notNull().references(() => cyclonesTable.id, { onDelete: "cascade" }),
  predictedTrack: jsonb("predicted_track").$type<Array<{ lat: number; lon: number; timestamp?: string }>>(),
  predictedRainfall: integer("predicted_rainfall"), // mm / 24h
  predictedSeverity: text("predicted_severity"), // 'Moderate' | 'Severe' | 'Very severe'
  submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow().notNull(),
  confidenceScore: real("confidence_score").default(0.85),
});

export const insertForecastSchema = createInsertSchema(forecastsTable);
export const selectForecastSchema = createSelectSchema(forecastsTable);
export type Forecast = typeof forecastsTable.$inferSelect;
export type InsertForecast = typeof forecastsTable.$inferInsert;

// ==========================================
// 5. FORECAST SCORES
// ==========================================
export const forecastScoresTable = pgTable("forecast_scores", {
  id: serial("id").primaryKey(),
  forecastId: integer("forecast_id").notNull().references(() => forecastsTable.id, { onDelete: "cascade" }),
  accuracyScore: real("accuracy_score").notNull(), // 0 - 100
  trackErrorKm: real("track_error_km"),
  timingErrorHrs: real("timing_error_hrs"),
  intensityErrorKt: real("intensity_error_kt"),
  explanationNotes: text("explanation_notes"),
  computedAt: timestamp("computed_at", { withTimezone: true }).defaultNow().notNull(),
  scoringMethod: text("scoring_method").notNull().default("distance_absolute_threshold"),
});

export const insertForecastScoreSchema = createInsertSchema(forecastScoresTable);
export const selectForecastScoreSchema = createSelectSchema(forecastScoresTable);
export type ForecastScore = typeof forecastScoresTable.$inferSelect;
export type InsertForecastScore = typeof forecastScoresTable.$inferInsert;

// ==========================================
// 6. FORECAST DUELS (Head-to-head or Solo vs Record)
// ==========================================
export const duelsTable = pgTable("duels", {
  id: text("id").primaryKey(), // e.g. "duel_1740645000"
  player1Id: text("player_1_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  player2Id: text("player_2_id").references(() => usersTable.id, { onDelete: "set null" }),
  cycloneId: text("cyclone_id").notNull().references(() => cyclonesTable.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("completed"), // 'pending' | 'active' | 'completed'
  winnerId: text("winner_id").references(() => usersTable.id, { onDelete: "set null" }),
  player1Guess: jsonb("player_1_guess").$type<{ rainfall?: number; score?: number }>(),
  player2Guess: jsonb("player_2_guess").$type<{ rainfall?: number; score?: number }>(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertDuelSchema = createInsertSchema(duelsTable);
export const selectDuelSchema = createSelectSchema(duelsTable);
export type Duel = typeof duelsTable.$inferSelect;
export type InsertDuel = typeof duelsTable.$inferInsert;

// ==========================================
// 7. WARZONE SESSIONS (Cyclone War Zone Live Runs)
// ==========================================
export const warzoneSessionsTable = pgTable("warzone_sessions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  region: text("region").notNull().default("Bay of Bengal - Paradip Sector"),
  scenarioId: text("scenario_id").notNull().default("cyclone-response-01"),
  decisionsLog: jsonb("decisions_log").$type<Array<{
    type: string;
    input: unknown;
    subScore: number;
    feedback: string;
  }>>().notNull(),
  outcomeScore: integer("outcome_score").notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertWarzoneSessionSchema = createInsertSchema(warzoneSessionsTable);
export const selectWarzoneSessionSchema = createSelectSchema(warzoneSessionsTable);
export type WarzoneSession = typeof warzoneSessionsTable.$inferSelect;
export type InsertWarzoneSession = typeof warzoneSessionsTable.$inferInsert;

// ==========================================
// 8. ALERTS (Early Warning Bulletins)
// ==========================================
export const alertsTable = pgTable("alerts", {
  id: serial("id").primaryKey(),
  region: text("region").notNull(),
  severity: text("severity").notNull().default("yellow"), // 'yellow' | 'orange' | 'red'
  message: text("message").notNull(),
  source: text("source").notNull().default("IMD Regional Centre"),
  verifiedBy: text("verified_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertAlertSchema = createInsertSchema(alertsTable);
export const selectAlertSchema = createSelectSchema(alertsTable);
export type Alert = typeof alertsTable.$inferSelect;
export type InsertAlert = typeof alertsTable.$inferInsert;

// ==========================================
// 9. GROUND REPORTS (Citizen & Spotter Observations)
// ==========================================
export const groundReportsTable = pgTable("ground_reports", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  region: text("region").notNull(),
  lat: real("lat").notNull(),
  lon: real("lon").notNull(),
  category: text("category").notNull().default("damage"), // 'surge' | 'wind' | 'damage' | 'waterlogging' | 'trees' | 'general'
  description: text("description").notNull(),
  photoUrl: text("photo_url"),
  upvotes: integer("upvotes").notNull().default(0),
  verificationCount: integer("verification_count").notNull().default(0),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertGroundReportSchema = createInsertSchema(groundReportsTable);
export const selectGroundReportSchema = createSelectSchema(groundReportsTable);
export type GroundReport = typeof groundReportsTable.$inferSelect;
export type InsertGroundReport = typeof groundReportsTable.$inferInsert;

// ==========================================
// 10. COURSES & PATHWAYS
// ==========================================
export const coursesTable = pgTable("courses", {
  id: text("id").primaryKey(), // e.g. "synoptic", "numerical"
  title: text("title").notNull(),
  trainer: text("trainer").notNull(),
  role: text("role").notNull(),
  duration: text("duration").notNull(),
  level: text("level").notNull(),
  category: text("category").notNull(),
  color: text("color").notNull().default("#2f8091"),
  tags: jsonb("tags").$type<string[]>().notNull(),
  description: text("description").notNull(),
  lessons: jsonb("lessons").$type<Array<{ title: string; type: string; duration: string }>>().notNull(),
});

export const insertCourseSchema = createInsertSchema(coursesTable);
export const selectCourseSchema = createSelectSchema(coursesTable);
export type Course = typeof coursesTable.$inferSelect;
export type InsertCourse = typeof coursesTable.$inferInsert;

// ==========================================
// 11. ENROLLMENTS
// ==========================================
export const enrollmentsTable = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  courseId: text("course_id").notNull().references(() => coursesTable.id, { onDelete: "cascade" }),
  progress: integer("progress").notNull().default(0),
  completed: boolean("completed").notNull().default(false),
  enrolledAt: timestamp("enrolled_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertEnrollmentSchema = createInsertSchema(enrollmentsTable);
export const selectEnrollmentSchema = createSelectSchema(enrollmentsTable);
export type Enrollment = typeof enrollmentsTable.$inferSelect;
export type InsertEnrollment = typeof enrollmentsTable.$inferInsert;

// ==========================================
// 12. QUIZ SUBMISSIONS
// ==========================================
export const quizSubmissionsTable = pgTable("quiz_submissions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  courseId: text("course_id").notNull().references(() => coursesTable.id, { onDelete: "cascade" }),
  score: integer("score").notNull(),
  passed: boolean("passed").notNull().default(false),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertQuizSubmissionSchema = createInsertSchema(quizSubmissionsTable);
export const selectQuizSubmissionSchema = createSelectSchema(quizSubmissionsTable);
export type QuizSubmission = typeof quizSubmissionsTable.$inferSelect;
export type InsertQuizSubmission = typeof quizSubmissionsTable.$inferInsert;
