import { pool, db } from "@workspace/db";
import {
  usersTable, cyclonesTable, cycloneTracksTable, forecastsTable,
  forecastScoresTable, duelsTable, warzoneSessionsTable, alertsTable,
  groundReportsTable, coursesTable, enrollmentsTable, quizSubmissionsTable
} from "@workspace/db/schema";
import { runMigrations } from "./migrate";
import { count, eq, sql } from "@workspace/db";

// ---------------------------------------------------------------------------
// Helper: check whether a table is empty
// ---------------------------------------------------------------------------
async function isEmpty(table: typeof alertsTable | typeof groundReportsTable | typeof cycloneTracksTable | typeof forecastsTable | typeof forecastScoresTable | typeof warzoneSessionsTable | typeof enrollmentsTable | typeof quizSubmissionsTable) {
  const result = await db.select({ n: count() }).from(table as any);
  return (result[0]?.n ?? 0) === 0;
}

export async function seedDatabase() {
  console.log("🌱 Running migrations before seeding...");
  await runMigrations();

  console.log("🌱 Seeding realistic operational sample data...");

  // =========================================================================
  // 1. Users — upsert (safe to re-run)
  // =========================================================================
  console.log("  → Seeding users...");
  const users = [
    {
      id: "usr_ananya_sharma",
      name: "Ananya Sharma",
      email: "ananya.sharma@imd.gov.in",
      role: "official",
      region: "Pune, Maharashtra",
      points: 1420,
      accuracyRating: 88.5,
    },
    {
      id: "usr_priya_sen",
      name: "Priya Sen",
      email: "priya.sen@met.edu.in",
      role: "student",
      region: "Kolkata, West Bengal",
      points: 980,
      accuracyRating: 82.0,
    },
    {
      id: "usr_rajesh_kumar",
      name: "Dr. Rajesh Kumar",
      email: "r.kumar@imd.gov.in",
      role: "official",
      region: "Bhubaneswar, Odisha",
      points: 1680,
      accuracyRating: 92.0,
    },
    {
      id: "usr_rahul_verma",
      name: "Rahul Verma",
      email: "rahul.v@citizennet.in",
      role: "citizen",
      region: "Mumbai, Maharashtra",
      points: 740,
      accuracyRating: 78.0,
    },
    {
      id: "usr_vikram_patil",
      name: "Vikram Patil",
      email: "v.patil@imd.gov.in",
      role: "official",
      region: "Chennai, Tamil Nadu",
      points: 1310,
      accuracyRating: 86.4,
    },
  ];

  for (const user of users) {
    await db.insert(usersTable).values(user).onConflictDoUpdate({
      target: usersTable.id,
      set: user,
    });
  }
  console.log(`     ✓ ${users.length} users upserted`);

  // =========================================================================
  // 2. Cyclones — upsert (safe to re-run)
  // =========================================================================
  console.log("  → Seeding historical and active cyclones...");
  const cyclones = [
    {
      id: "phailin-2013",
      name: "Cyclone Phailin (2013)",
      seasonYear: 2013,
      status: "dissipated",
      source: "IMD",
      basin: "Bay of Bengal",
      peakWindSpeed: 215,
      minPressure: 940,
      metadata: {
        synopticContext: "A deep depression organised east of the Andhra coast. Extremely rapid intensification into a Category 5 Super Cyclonic Storm before making landfall near Gopalpur.",
        officialCall: "Very severe cyclonic storm with extreme surge hazard",
        confidenceNote: "High confidence · Landfall near Gopalpur, Odisha",
        correctRainfallRange: [160, 205] as [number, number],
        satelliteDescription: "Dense overcast, curved bands forming tightly around eyewall",
        windDirection: "NE",
        actualRainfall: 182,
      },
    },
    {
      id: "fani-2019",
      name: "Cyclone Fani (2019)",
      seasonYear: 2019,
      status: "dissipated",
      source: "IMD",
      basin: "Bay of Bengal",
      peakWindSpeed: 205,
      minPressure: 932,
      metadata: {
        synopticContext: "A compact circulation tightened rapidly off the eastern coast, moving NNE towards Puri with extreme wind gusts exceeding 200 km/h.",
        officialCall: "Extremely severe cyclonic storm",
        confidenceNote: "High confidence · Puri and Odisha coastal corridor",
        correctRainfallRange: [115, 155] as [number, number],
        satelliteDescription: "Central dense overcast with prominent loose spiral band structures",
        windDirection: "W",
        actualRainfall: 137,
      },
    },
    {
      id: "tauktae-2021",
      name: "Cyclone Tauktae (2021)",
      seasonYear: 2021,
      status: "dissipated",
      source: "IMD",
      basin: "Arabian Sea",
      peakWindSpeed: 150,
      minPressure: 956,
      metadata: {
        synopticContext: "A warm-core system tracked north-west through an unusually warm Arabian Sea, affecting Goa, Maharashtra, and making landfall in Gujarat.",
        officialCall: "Very severe cyclonic storm",
        confidenceNote: "Moderate-to-high confidence · Saurashtra and Gujarat coast",
        correctRainfallRange: [80, 112] as [number, number],
        satelliteDescription: "Scattered deep convection organising into a ragged eye",
        windDirection: "SW",
        actualRainfall: 96,
      },
    },
    {
      id: "bob-04-2026",
      name: "Cyclone Simulation System (BOB-04)",
      seasonYear: 2026,
      status: "active",
      source: "IMD",
      basin: "Bay of Bengal",
      peakWindSpeed: 120,
      minPressure: 978,
      metadata: {
        synopticContext: "Active live training scenario tracking west-northwest towards Paradip Coast with 18-hour landfall window.",
        officialCall: "Severe cyclonic storm watch",
        confidenceNote: "Live Operational Cell Simulation",
        correctRainfallRange: [140, 200] as [number, number],
        satelliteDescription: "Convective eye wall consolidating with spiral rainbands impacting outer districts",
        windDirection: "ENE",
        actualRainfall: 165,
      },
    },
  ];

  for (const cyclone of cyclones) {
    await db.insert(cyclonesTable).values(cyclone).onConflictDoUpdate({
      target: cyclonesTable.id,
      set: cyclone,
    });
  }
  console.log(`     ✓ ${cyclones.length} cyclones upserted`);

  // =========================================================================
  // 3. Cyclone Tracks — onConflictDoNothing (unique idx: cyclone_id + timestamp)
  // =========================================================================
  console.log("  → Seeding cyclone ground-truth tracking points...");
  const tracks = [
    // ---- Phailin 2013 ----
    { cycloneId: "phailin-2013", timestamp: "2013-10-09T00:00:00Z", lat: 12.0,  lon: 93.0, windSpeed: 65,  pressure: 998, category: "Depression" },
    { cycloneId: "phailin-2013", timestamp: "2013-10-10T06:00:00Z", lat: 13.5,  lon: 89.5, windSpeed: 110, pressure: 980, category: "Cyclonic Storm" },
    { cycloneId: "phailin-2013", timestamp: "2013-10-11T06:00:00Z", lat: 15.0,  lon: 86.5, windSpeed: 160, pressure: 955, category: "Very Severe Cyclonic Storm" },
    { cycloneId: "phailin-2013", timestamp: "2013-10-12T12:00:00Z", lat: 18.2,  lon: 85.0, windSpeed: 215, pressure: 940, category: "Super Cyclonic Storm" },
    { cycloneId: "phailin-2013", timestamp: "2013-10-12T18:00:00Z", lat: 19.3,  lon: 84.9, windSpeed: 200, pressure: 945, category: "Landfall (Gopalpur)" },

    // ---- Fani 2019 ----
    { cycloneId: "fani-2019", timestamp: "2019-04-28T00:00:00Z", lat: 5.2,  lon: 88.5, windSpeed: 55,  pressure: 1000, category: "Depression" },
    { cycloneId: "fani-2019", timestamp: "2019-04-30T12:00:00Z", lat: 11.8, lon: 88.1, windSpeed: 120, pressure: 982,  category: "Severe Cyclonic Storm" },
    { cycloneId: "fani-2019", timestamp: "2019-05-02T06:00:00Z", lat: 16.5, lon: 85.2, windSpeed: 205, pressure: 932,  category: "Extremely Severe Cyclonic Storm" },
    { cycloneId: "fani-2019", timestamp: "2019-05-03T03:00:00Z", lat: 19.8, lon: 85.8, windSpeed: 185, pressure: 942,  category: "Landfall (Puri)" },

    // ---- Tauktae 2021 ----
    { cycloneId: "tauktae-2021", timestamp: "2021-05-14T06:00:00Z", lat: 10.5, lon: 73.0, windSpeed: 60,  pressure: 998, category: "Deep Depression" },
    { cycloneId: "tauktae-2021", timestamp: "2021-05-15T00:00:00Z", lat: 12.2, lon: 72.8, windSpeed: 95,  pressure: 986, category: "Cyclonic Storm" },
    { cycloneId: "tauktae-2021", timestamp: "2021-05-16T12:00:00Z", lat: 16.8, lon: 71.5, windSpeed: 140, pressure: 965, category: "Very Severe Cyclonic Storm" },
    { cycloneId: "tauktae-2021", timestamp: "2021-05-17T15:00:00Z", lat: 20.8, lon: 71.2, windSpeed: 150, pressure: 956, category: "Landfall (Saurashtra)" },

    // ---- BOB-04 2026 (active simulation — real-time-style progression) ----
    { cycloneId: "bob-04-2026", timestamp: "2026-08-25T00:00:00Z", lat: 14.0, lon: 89.5, windSpeed: 55,  pressure: 1002, category: "Depression" },
    { cycloneId: "bob-04-2026", timestamp: "2026-08-25T18:00:00Z", lat: 15.2, lon: 88.0, windSpeed: 75,  pressure: 994,  category: "Deep Depression" },
    { cycloneId: "bob-04-2026", timestamp: "2026-08-26T06:00:00Z", lat: 16.8, lon: 86.5, windSpeed: 95,  pressure: 988,  category: "Cyclonic Storm" },
    { cycloneId: "bob-04-2026", timestamp: "2026-08-26T18:00:00Z", lat: 18.5, lon: 85.2, windSpeed: 110, pressure: 982,  category: "Severe Cyclonic Storm" },
    { cycloneId: "bob-04-2026", timestamp: "2026-08-27T06:00:00Z", lat: 19.8, lon: 84.5, windSpeed: 120, pressure: 978,  category: "Severe Cyclonic Storm" },
  ];

  let trackCount = 0;
  for (const track of tracks) {
    const result = await db.insert(cycloneTracksTable).values(track).onConflictDoNothing();
    trackCount++;
  }
  console.log(`     ✓ ${tracks.length} track points seeded (duplicates skipped)`);

  // =========================================================================
  // 4. Forecasts & Scores — only insert if table is empty
  // =========================================================================
  console.log("  → Seeding sample user forecasts and accuracy scores...");
  if (await isEmpty(forecastsTable)) {
    const sampleForecast = await db.insert(forecastsTable).values({
      userId: "usr_ananya_sharma",
      cycloneId: "phailin-2013",
      predictedTrack: [{ lat: 15.2, lon: 86.3 }, { lat: 19.1, lon: 84.8 }],
      predictedRainfall: 175,
      predictedSeverity: "Very severe",
      confidenceScore: 0.9,
    }).returning({ id: forecastsTable.id });

    if (sampleForecast[0]) {
      await db.insert(forecastScoresTable).values({
        forecastId: sampleForecast[0].id,
        accuracyScore: 91.5,
        scoringMethod: "distance_absolute_threshold",
      });
    }

    // A second forecast from another user — Fani 2019
    const faniforecast = await db.insert(forecastsTable).values({
      userId: "usr_rajesh_kumar",
      cycloneId: "fani-2019",
      predictedTrack: [{ lat: 11.8, lon: 88.1 }, { lat: 19.8, lon: 85.8 }],
      predictedRainfall: 138,
      predictedSeverity: "Extremely severe",
      confidenceScore: 0.95,
    }).returning({ id: forecastsTable.id });

    if (faniforecast[0]) {
      await db.insert(forecastScoresTable).values({
        forecastId: faniforecast[0].id,
        accuracyScore: 96.0,
        scoringMethod: "distance_absolute_threshold",
      });
    }
    console.log("     ✓ 2 forecasts + scores seeded");
  } else {
    console.log("     ℹ Forecasts table already has data — skipping");
  }

  // =========================================================================
  // 5. Duels — upsert by id (TEXT PK)
  // =========================================================================
  console.log("  → Seeding forecast duel logs...");
  await db.insert(duelsTable).values({
    id: "duel_fani_2019_01",
    player1Id: "usr_ananya_sharma",
    player2Id: "usr_rajesh_kumar",
    cycloneId: "fani-2019",
    status: "completed",
    winnerId: "usr_rajesh_kumar",
    player1Guess: { rainfall: 145, score: 88 },
    player2Guess: { rainfall: 138, score: 96 },
  }).onConflictDoNothing();

  await db.insert(duelsTable).values({
    id: "duel_phailin_2013_01",
    player1Id: "usr_vikram_patil",
    player2Id: "usr_ananya_sharma",
    cycloneId: "phailin-2013",
    status: "completed",
    winnerId: "usr_ananya_sharma",
    player1Guess: { rainfall: 160, score: 81 },
    player2Guess: { rainfall: 178, score: 93 },
  }).onConflictDoNothing();
  console.log("     ✓ 2 duels seeded");

  // =========================================================================
  // 6. Warzone Sessions — only insert if table is empty
  // =========================================================================
  console.log("  → Seeding simulation warzone sessions...");
  if (await isEmpty(warzoneSessionsTable)) {
    await db.insert(warzoneSessionsTable).values({
      userId: "usr_ananya_sharma",
      region: "Bay of Bengal - Paradip Sector",
      scenarioId: "cyclone-response-01",
      decisionsLog: [
        { type: "mcq",        input: "The 12 hPa pressure fall and tightening core",                                            subScore: 20, feedback: "Correct leading operational indicator." },
        { type: "allocation", input: [20, 35, 35, 10],                                                                          subScore: 25, feedback: "Optimal corridor resource balancing." },
        { type: "ranking",    input: ["Issue district-level warning", "Confirm shelter transport", "Publish public update", "Request national assets"], subScore: 25, feedback: "SOP-aligned briefing hierarchy." },
        { type: "freetext",   input: "Cyclone approaching with rapid pressure drop. Evacuate southern sectors immediately.",    subScore: 26, feedback: "Clear hazard and uncertainty identification." },
      ],
      outcomeScore: 96,
    });

    await db.insert(warzoneSessionsTable).values({
      userId: "usr_rajesh_kumar",
      region: "Odisha Coast - Puri Sector",
      scenarioId: "cyclone-response-01",
      decisionsLog: [
        { type: "mcq",        input: "Tight vortex at 850 hPa confirms rapid intensification signal",                          subScore: 22, feedback: "Excellent — core identification with upper-air support." },
        { type: "allocation", input: [15, 40, 30, 15],                                                                          subScore: 23, feedback: "Balanced, prioritising evacuation transport." },
        { type: "ranking",    input: ["Issue district-level warning", "Request national assets", "Confirm shelter transport", "Publish public update"], subScore: 28, feedback: "Correct national co-ordination priority." },
        { type: "freetext",   input: "Rapidly deepening storm. Immediate life-safety evacuation of Zone A required.",           subScore: 27, feedback: "Clear, action-oriented risk briefing." },
      ],
      outcomeScore: 100,
    });
    console.log("     ✓ 2 warzone sessions seeded");
  } else {
    console.log("     ℹ Warzone sessions table already has data — skipping");
  }

  // =========================================================================
  // 7. Alerts — only insert if table is empty
  // =========================================================================
  console.log("  → Seeding early warning bulletins...");
  if (await isEmpty(alertsTable)) {
    const alerts = [
      {
        region: "Odisha Coastal Districts (Puri, Jagatsinghpur, Kendrapara)",
        severity: "orange",
        message: "Heavy to very heavy rainfall expected (115–200 mm) over next 24 hours. Gale winds reaching 80–90 km/h along coast.",
        source: "IMD Cyclone Warning Division, New Delhi",
        verifiedBy: "Duty Meteorologist",
      },
      {
        region: "North Coastal Andhra Pradesh",
        severity: "yellow",
        message: "Squally wind speed reaching 45–55 km/h gusting to 65 km/h. Sea condition will be rough to very rough.",
        source: "RMC Chennai",
        verifiedBy: "Area Cyclone Officer",
      },
      {
        region: "Bay of Bengal Deep Sea Corridors",
        severity: "red",
        message: "Fishermen advised not to venture into central & north Bay of Bengal. Vessels at sea advised to return to coast immediately.",
        source: "INCOIS / IMD Joint Advisory",
        verifiedBy: "Senior Scientist",
      },
      {
        region: "Gujarat Coast (Saurashtra, Kutch)",
        severity: "orange",
        message: "Storm surge of 1–2 m above astronomical tide likely near Bhavnagar. Evacuation of low-lying coastal areas underway.",
        source: "IMD Regional Meteorological Centre, Mumbai",
        verifiedBy: "Duty Meteorologist",
      },
    ];

    for (const alert of alerts) {
      await db.insert(alertsTable).values(alert);
    }
    console.log(`     ✓ ${alerts.length} alerts seeded`);
  } else {
    console.log("     ℹ Alerts table already has data — skipping");
  }

  // =========================================================================
  // 8. Ground Reports — only insert if table is empty
  // =========================================================================
  console.log("  → Seeding verified field spotter reports...");
  if (await isEmpty(groundReportsTable)) {
    const reports = [
      {
        userId: "usr_rahul_verma",
        region: "Gopalpur Coast, Ganjam",
        lat: 19.26,
        lon: 84.91,
        description: "High surf breaking over seawall. Strong gusty easterly winds estimated 60 km/h. Several fishing boats dragged onto the beach.",
        verified: true,
      },
      {
        userId: "usr_priya_sen",
        region: "Digha Coastline, West Bengal",
        lat: 21.62,
        lon: 87.51,
        description: "Intermittent heavy drizzle, cloud ceiling dropping rapidly below 500 m. Power outages in 3 coastal wards reported.",
        verified: true,
      },
      {
        userId: "usr_rahul_verma",
        region: "Puri Beach, Odisha",
        lat: 19.79,
        lon: 85.82,
        description: "Sea colour turned brown indicating high turbidity and upwelling. Abnormal low tide observed 2 hours before expected time.",
        verified: true,
      },
    ];

    for (const rep of reports) {
      await db.insert(groundReportsTable).values(rep);
    }
    console.log(`     ✓ ${reports.length} ground reports seeded`);
  } else {
    console.log("     ℹ Ground reports table already has data — skipping");
  }

  // =========================================================================
  // 9. Courses — upsert by id (TEXT PK)
  // =========================================================================
  console.log("  → Seeding official training courses...");
  const courses = [
    {
      id: "synoptic",
      title: "Advanced Synoptic Meteorology",
      trainer: "Dr. A. Sharma",
      role: "Senior Scientist, IMD",
      duration: "6h 20m",
      level: "Advanced",
      category: "Forecasting",
      color: "#2f8091",
      tags: ["Forecasting", "Analysis"],
      description: "Read the atmosphere as a connected system. This applied programme brings synoptic charts, pressure patterns and operational judgement together.",
      lessons: [
        { title: "Foundations and framing of synoptic systems", type: "reading", duration: "PDF · 12 pages" },
        { title: "Reading the operational surface and upper-air chart", type: "video", duration: "Video lecture · 18 min" },
        { title: "Case study: rapid cyclogenesis in the Bay of Bengal", type: "reading", duration: "Technical note · 8 pages" },
        { title: "Knowledge check and operational reflection", type: "reading", duration: "Interactive exercise" },
      ],
    },
    {
      id: "numerical",
      title: "Numerical Weather Prediction",
      trainer: "Prof. K. Verma",
      role: "NCMRWF Faculty",
      duration: "8h 10m",
      level: "Intermediate",
      category: "Forecasting",
      color: "#3c6f9d",
      tags: ["Forecasting", "Models"],
      description: "Build confidence interpreting model guidance and communicate uncertainty in operational forecast discussions.",
      lessons: [
        { title: "Governing primitive equations & grid parameterisation", type: "reading", duration: "PDF · 15 pages" },
        { title: "Ensemble Prediction Systems (EPS) spread & clustering", type: "video", duration: "Video lecture · 24 min" },
        { title: "Model bias correction in tropical regimes", type: "reading", duration: "Guide · 10 pages" },
      ],
    },
    {
      id: "data",
      title: "Climate Data & Quality Control",
      trainer: "Dr. R. Iyer",
      role: "Climate Services Division",
      duration: "4h 05m",
      level: "Beginner",
      category: "Data Analysis",
      color: "#719a86",
      tags: ["Data Analysis", "Climate"],
      description: "Turn observation archives into trustworthy climate insights through practical data validation workflows.",
      lessons: [
        { title: "Automated Weather Station (AWS) data pipeline", type: "video", duration: "Video lecture · 15 min" },
        { title: "Homogeneity testing & outlier detection", type: "reading", duration: "Standard Operating Procedure" },
        { title: "Gridded rainfall datasets (IMD 0.25° grid)", type: "reading", duration: "Dataset tutorial" },
      ],
    },
    {
      id: "assimilation",
      title: "Introduction to Data Assimilation",
      trainer: "Dr. M. Nair",
      role: "Atmospheric Research Unit",
      duration: "4h 00m",
      level: "Intermediate",
      category: "Data Analysis",
      color: "#698da9",
      tags: ["Data Analysis", "Models"],
      description: "A structured introduction to combining observations and model state for better forecasts.",
      lessons: [
        { title: "Variational methods (3D-Var and 4D-Var)", type: "video", duration: "Video lecture · 20 min" },
        { title: "Satellite radiance & Doppler radar ingestion", type: "reading", duration: "Technical report" },
        { title: "Kalman filtering in operational NWP", type: "reading", duration: "Reference paper" },
      ],
    },
    {
      id: "communication",
      title: "Public Weather Communication",
      trainer: "Ms. P. Rao",
      role: "Public Weather Services",
      duration: "2h 30m",
      level: "Beginner",
      category: "Communication",
      color: "#b69a70",
      tags: ["Communication", "Briefings"],
      description: "Make technical forecasts useful, clear and actionable for the communities who depend on them.",
      lessons: [
        { title: "Impact-based warning matrix (Colour codes)", type: "video", duration: "Video lecture · 14 min" },
        { title: "Framing uncertainty for disaster managers", type: "reading", duration: "Protocol checklist" },
        { title: "Media briefings during extreme weather", type: "reading", duration: "Case study" },
      ],
    },
    {
      id: "climate-risk",
      title: "Climate Risk & Impact Briefing",
      trainer: "Dr. S. Menon",
      role: "Climate Applications",
      duration: "3h 45m",
      level: "Advanced",
      category: "Climate",
      color: "#7486a4",
      tags: ["Climate", "Analysis"],
      description: "Frame climate intelligence for policy, planning and regional resilience decisions.",
      lessons: [
        { title: "CMIP6 projection interpretation for India", type: "video", duration: "Video lecture · 22 min" },
        { title: "Extreme precipitation return period calculation", type: "reading", duration: "Workbook" },
        { title: "District vulnerability mapping", type: "reading", duration: "Policy briefing" },
      ],
    },
  ];

  for (const course of courses) {
    await db.insert(coursesTable).values(course).onConflictDoUpdate({
      target: coursesTable.id,
      set: course,
    });
  }
  console.log(`     ✓ ${courses.length} courses upserted`);

  // =========================================================================
  // 10. Enrollments — only insert if table is empty
  // =========================================================================
  console.log("  → Seeding user course enrollments...");
  if (await isEmpty(enrollmentsTable)) {
    await db.insert(enrollmentsTable).values([
      { userId: "usr_ananya_sharma", courseId: "synoptic",    progress: 65, completed: false },
      { userId: "usr_ananya_sharma", courseId: "numerical",   progress: 30, completed: false },
      { userId: "usr_rajesh_kumar",  courseId: "synoptic",    progress: 100, completed: true },
      { userId: "usr_priya_sen",     courseId: "data",        progress: 50, completed: false },
    ]);
    console.log("     ✓ 4 enrollments seeded");
  } else {
    console.log("     ℹ Enrollments table already has data — skipping");
  }

  // =========================================================================
  // 11. Quiz Submissions — only insert if table is empty
  // =========================================================================
  if (await isEmpty(quizSubmissionsTable)) {
    await db.insert(quizSubmissionsTable).values([
      { userId: "usr_ananya_sharma", courseId: "synoptic",    score: 100, passed: true },
      { userId: "usr_rajesh_kumar",  courseId: "synoptic",    score: 92,  passed: true },
    ]);
    console.log("     ✓ 2 quiz submissions seeded");
  } else {
    console.log("     ℹ Quiz submissions table already has data — skipping");
  }

  // Update user points to reflect their seeded activity
  await db.update(usersTable).set({ points: 1520 }).where(eq(usersTable.id, "usr_rajesh_kumar"));

  console.log("\n🎉 Database seeded with full operational demo data!");
  console.log("   Run 'pnpm seed' again safely — all inserts are idempotent.");

  await pool.end();
}

if (process.argv[1]?.endsWith("seed.ts") || process.argv[1]?.endsWith("seed.js")) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Seeding error:", err);
      process.exit(1);
    });
}
