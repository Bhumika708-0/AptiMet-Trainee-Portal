import { pool } from "@workspace/db";

export async function runMigrations() {
  console.log("🚀 Starting database migration...");

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'official',
        region TEXT NOT NULL DEFAULT 'Pune, Maharashtra',
        points INTEGER NOT NULL DEFAULT 0,
        accuracy_rating REAL NOT NULL DEFAULT 0.0,
        elo_rating INTEGER NOT NULL DEFAULT 1200,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      ALTER TABLE users ADD COLUMN IF NOT EXISTS elo_rating INTEGER NOT NULL DEFAULT 1200;
    `);

    // 2. Cyclones Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS cyclones (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        season_year INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'dissipated',
        source TEXT NOT NULL DEFAULT 'IMD',
        basin TEXT NOT NULL DEFAULT 'Bay of Bengal',
        peak_wind_speed INTEGER NOT NULL DEFAULT 0,
        min_pressure INTEGER NOT NULL DEFAULT 1000,
        metadata JSONB,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 3. Cyclone Tracks Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS cyclone_tracks (
        id SERIAL PRIMARY KEY,
        cyclone_id TEXT NOT NULL REFERENCES cyclones(id) ON DELETE CASCADE,
        timestamp TEXT NOT NULL,
        lat REAL NOT NULL,
        lon REAL NOT NULL,
        wind_speed INTEGER NOT NULL,
        pressure INTEGER NOT NULL,
        category TEXT NOT NULL
      );
    `);

    // Unique index prevents duplicate track points on re-seed
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS cyclone_tracks_cyclone_timestamp_idx
        ON cyclone_tracks(cyclone_id, timestamp);
    `);

    // 4. Forecasts Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS forecasts (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        cyclone_id TEXT NOT NULL REFERENCES cyclones(id) ON DELETE CASCADE,
        predicted_track JSONB,
        predicted_rainfall INTEGER,
        predicted_severity TEXT,
        submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        confidence_score REAL DEFAULT 0.85
      );
    `);

    // 5. Forecast Scores Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS forecast_scores (
        id SERIAL PRIMARY KEY,
        forecast_id INTEGER NOT NULL REFERENCES forecasts(id) ON DELETE CASCADE,
        accuracy_score REAL NOT NULL,
        track_error_km REAL,
        timing_error_hrs REAL,
        intensity_error_kt REAL,
        explanation_notes TEXT,
        computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        scoring_method TEXT NOT NULL DEFAULT 'distance_absolute_threshold'
      );
      ALTER TABLE forecast_scores ADD COLUMN IF NOT EXISTS track_error_km REAL;
      ALTER TABLE forecast_scores ADD COLUMN IF NOT EXISTS timing_error_hrs REAL;
      ALTER TABLE forecast_scores ADD COLUMN IF NOT EXISTS intensity_error_kt REAL;
      ALTER TABLE forecast_scores ADD COLUMN IF NOT EXISTS explanation_notes TEXT;
    `);

    // 6. Duels Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS duels (
        id TEXT PRIMARY KEY,
        player_1_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        player_2_id TEXT REFERENCES users(id) ON DELETE SET NULL,
        cyclone_id TEXT NOT NULL REFERENCES cyclones(id) ON DELETE CASCADE,
        status TEXT NOT NULL DEFAULT 'completed',
        winner_id TEXT REFERENCES users(id) ON DELETE SET NULL,
        player_1_guess JSONB,
        player_2_guess JSONB,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 7. Warzone Sessions Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS warzone_sessions (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        region TEXT NOT NULL DEFAULT 'Bay of Bengal - Paradip Sector',
        scenario_id TEXT NOT NULL DEFAULT 'cyclone-response-01',
        decisions_log JSONB NOT NULL,
        outcome_score INTEGER NOT NULL,
        completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 8. Alerts Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS alerts (
        id SERIAL PRIMARY KEY,
        region TEXT NOT NULL,
        severity TEXT NOT NULL DEFAULT 'yellow',
        message TEXT NOT NULL,
        source TEXT NOT NULL DEFAULT 'IMD Regional Centre',
        verified_by TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 9. Ground Reports Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS ground_reports (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        region TEXT NOT NULL,
        lat REAL NOT NULL,
        lon REAL NOT NULL,
        category TEXT NOT NULL DEFAULT 'damage',
        description TEXT NOT NULL,
        photo_url TEXT,
        upvotes INTEGER NOT NULL DEFAULT 0,
        verification_count INTEGER NOT NULL DEFAULT 0,
        verified BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      ALTER TABLE ground_reports ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'damage';
      ALTER TABLE ground_reports ADD COLUMN IF NOT EXISTS upvotes INTEGER NOT NULL DEFAULT 0;
      ALTER TABLE ground_reports ADD COLUMN IF NOT EXISTS verification_count INTEGER NOT NULL DEFAULT 0;
    `);

    // 10. Courses Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        trainer TEXT NOT NULL,
        role TEXT NOT NULL,
        duration TEXT NOT NULL,
        level TEXT NOT NULL,
        category TEXT NOT NULL,
        color TEXT NOT NULL DEFAULT '#2f8091',
        tags JSONB NOT NULL,
        description TEXT NOT NULL,
        lessons JSONB NOT NULL
      );
    `);

    // 11. Enrollments Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS enrollments (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        progress INTEGER NOT NULL DEFAULT 0,
        completed BOOLEAN NOT NULL DEFAULT FALSE,
        enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 12. Quiz Submissions Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS quiz_submissions (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        score INTEGER NOT NULL,
        passed BOOLEAN NOT NULL DEFAULT FALSE,
        submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 13. Leaderboard VIEW (derived, not a materialized view — always fresh)
    //     DENSE_RANK orders by elo_rating DESC, then points DESC.
    await client.query(`
      CREATE OR REPLACE VIEW leaderboard AS
      SELECT
        u.id AS user_id,
        u.name,
        u.role,
        u.region,
        u.points,
        u.accuracy_rating,
        u.elo_rating,
        COUNT(DISTINCT f.id)::INT  AS total_forecasts,
        COUNT(DISTINCT d.id)::INT  AS total_duels,
        COUNT(DISTINCT w.id)::INT  AS total_warzone_runs,
        COALESCE(AVG(fs.accuracy_score), u.accuracy_rating) AS avg_score,
        DENSE_RANK() OVER (ORDER BY u.elo_rating DESC, u.points DESC) AS rank
      FROM users u
      LEFT JOIN forecasts f        ON u.id = f.user_id
      LEFT JOIN forecast_scores fs ON f.id = fs.forecast_id
      LEFT JOIN duels d            ON (u.id = d.player_1_id OR u.id = d.player_2_id)
      LEFT JOIN warzone_sessions w ON u.id = w.user_id
      GROUP BY u.id, u.name, u.role, u.region, u.points, u.accuracy_rating, u.elo_rating;
    `);

    await client.query("COMMIT");
    console.log("✅ All 12 tables + leaderboard view created (idempotent — safe to re-run).");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Migration failed, rolled back:", error);
    throw error;
  } finally {
    client.release();
  }
}

if (process.argv[1]?.endsWith("migrate.ts") || process.argv[1]?.endsWith("migrate.js")) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => { console.error(err); process.exit(1); });
}
