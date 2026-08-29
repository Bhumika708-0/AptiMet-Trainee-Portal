import { Course, courses as fallbackCourses } from "@/mockData/courses";
import { HistoricalEvent, historicalEvents as fallbackEvents } from "@/mockData/historicalEvents";

const API_BASE = "/api";

export interface LeaderboardUser {
  userId: string;
  name: string;
  role: string;
  region: string;
  points: number;
  accuracyRating: number;
  eloRating: number;
  tier: { title: string; badge: string; color: string };
  totalForecasts: number;
  totalDuels: number;
  totalWarzoneRuns: number;
  avgScore: string;
  rank: number;
}

export interface GroundReportItem {
  id: number;
  userId: string;
  region: string;
  lat: number;
  lon: number;
  category: string;
  description: string;
  photoUrl?: string;
  upvotes: number;
  verificationCount: number;
  verified: boolean;
  createdAt: string;
}

export interface AlertItem {
  id: number;
  region: string;
  severity: "yellow" | "orange" | "red";
  message: string;
  source: string;
  verifiedBy?: string;
  createdAt: string;
}

export interface DuelItem {
  id: string;
  player1Id: string;
  player2Id?: string;
  cycloneId: string;
  status: string;
  winnerId?: string;
  player1Guess?: any;
  player2Guess?: any;
  player1?: { id: string; name: string; elo: number; tier: any };
  player2?: { id: string; name: string; elo: number; tier: any };
  createdAt: string;
}

// 1. Courses
export async function fetchCourses(): Promise<Course[]> {
  try {
    const res = await fetch(`${API_BASE}/courses`);
    if (!res.ok) throw new Error("Failed to fetch from API");
    const data = await res.json();
    return data && data.length > 0 ? data : fallbackCourses;
  } catch {
    return fallbackCourses;
  }
}

export async function enrollCourseApi(courseId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/courses/${courseId}/enroll`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "usr_ananya_sharma" }),
    });
    return res.ok;
  } catch {
    return true; // client fallback
  }
}

export async function submitQuizApi(courseId: string, score: number): Promise<{ passed: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/courses/${courseId}/quiz`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "usr_ananya_sharma", score }),
    });
    if (!res.ok) throw new Error("Quiz submission failed");
    return await res.json();
  } catch {
    return { passed: score >= 75 };
  }
}

// 2. Cyclones & Historical Archives
export async function fetchHistoricalCyclones(): Promise<HistoricalEvent[]> {
  try {
    const res = await fetch(`${API_BASE}/cyclones`);
    if (!res.ok) throw new Error("Failed to fetch cyclones");
    const data = await res.json();
    if (!data || data.length === 0) return fallbackEvents;

    return data
      .filter((c: any) => c.metadata)
      .map((c: any) => ({
        id: c.id,
        name: c.name,
        date: `${c.seasonYear} · Operational Archive`,
        location: `${c.basin}`,
        context: c.metadata?.synopticContext || "Historical cyclone observation.",
        available: {
          pressure: c.minPressure || 990,
          cloud: c.metadata?.satelliteDescription || "Dense convective band",
          wind: c.peakWindSpeed ? Math.round(c.peakWindSpeed * 0.4) : 60,
          windDirection: c.metadata?.windDirection || "NE",
        },
        actual: {
          pressure: c.minPressure || 940,
          wind: c.peakWindSpeed || 200,
          rainfall: c.metadata?.actualRainfall || 150,
        },
        official: {
          call: c.metadata?.officialCall || "Severe Cyclonic Storm",
          confidence: c.metadata?.confidenceNote || "High confidence",
        },
        correctRange: c.metadata?.correctRainfallRange || [100, 160],
      }));
  } catch {
    return fallbackEvents;
  }
}

// 3. AI Forecast Accuracy & ELO Submission
export async function submitForecastApi(
  cycloneId: string,
  predictedRainfall: number,
  predictedTrack?: Array<{ lat: number; lon: number }>,
  predictedPressure?: number,
  predictedWindSpeed?: number
) {
  try {
    const res = await fetch(`${API_BASE}/forecasts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "usr_ananya_sharma",
        cycloneId,
        predictedRainfall,
        predictedSeverity: predictedRainfall > 150 ? "Very severe" : "Severe",
        predictedTrack,
        predictedPressure,
        predictedWindSpeed,
      }),
    });
    if (!res.ok) throw new Error("Failed to submit forecast");
    return await res.json();
  } catch {
    // Graceful offline mathematical fallback
    const actualRain = 140;
    const rainfallDelta = Math.abs(predictedRainfall - actualRain);
    const score = Math.max(10, Math.min(100, Math.round(100 - rainfallDelta * 1.2)));
    return {
      accuracyResult: {
        accuracyScore: score,
        trackErrorKm: 38.5,
        timingErrorHrs: 1.8,
        intensityErrorKt: 12,
        rainfallErrorMm: rainfallDelta,
        explanationNotes: `Computed in offline calibration mode. Track delta: 38.5 km.`,
      },
      eloUpdate: {
        newRating: 1218,
        delta: score >= 80 ? 18 : -8,
        tier: "Trainee Observer",
      },
      pointsAwarded: Math.round(score * 1.5),
    };
  }
}

// 4. Leaderboard (ELO & Stats)
export async function fetchLeaderboardApi(): Promise<LeaderboardUser[]> {
  try {
    const res = await fetch(`${API_BASE}/leaderboard`);
    if (!res.ok) throw new Error("Failed to fetch leaderboard");
    return await res.json();
  } catch {
    return [
      {
        userId: "usr_rajesh_kumar",
        name: "Dr. Rajesh Kumar",
        role: "official",
        region: "Bhubaneswar, Odisha",
        points: 1680,
        accuracyRating: 92.0,
        eloRating: 1645,
        tier: { title: "Senior Cyclone Analyst", badge: "🎖️ Lead Analyst", color: "#164d78" },
        totalForecasts: 18,
        totalDuels: 12,
        totalWarzoneRuns: 8,
        avgScore: "92.0",
        rank: 1,
      },
      {
        userId: "usr_ananya_sharma",
        name: "Ananya Sharma (You)",
        role: "official",
        region: "Pune, Maharashtra",
        points: 1420,
        accuracyRating: 88.5,
        eloRating: 1460,
        tier: { title: "Operational Meteorologist", badge: "🌟 Senior Forecaster", color: "#197576" },
        totalForecasts: 14,
        totalDuels: 9,
        totalWarzoneRuns: 6,
        avgScore: "88.5",
        rank: 2,
      },
      {
        userId: "usr_vikram_patil",
        name: "Vikram Patil",
        role: "official",
        region: "Chennai, Tamil Nadu",
        points: 1310,
        accuracyRating: 86.4,
        eloRating: 1390,
        tier: { title: "Duty Forecaster", badge: "🔷 Forecaster", color: "#3c6f9d" },
        totalForecasts: 10,
        totalDuels: 7,
        totalWarzoneRuns: 4,
        avgScore: "86.4",
        rank: 3,
      },
      {
        userId: "usr_priya_sen",
        name: "Priya Sen",
        role: "student",
        region: "Kolkata, West Bengal",
        points: 980,
        accuracyRating: 82.0,
        eloRating: 1290,
        tier: { title: "Duty Forecaster", badge: "🔷 Forecaster", color: "#3c6f9d" },
        totalForecasts: 8,
        totalDuels: 5,
        totalWarzoneRuns: 3,
        avgScore: "82.0",
        rank: 4,
      },
    ];
  }
}

// 5. Duels
export async function fetchDuelsApi(): Promise<DuelItem[]> {
  try {
    const res = await fetch(`${API_BASE}/duels`);
    if (!res.ok) throw new Error("Failed to fetch duels");
    return await res.json();
  } catch {
    return [];
  }
}

export async function createDuelApi(duelData: {
  player2Id: string;
  cycloneId: string;
  player1Guess: { rainfall: number; score: number };
  player2Guess: { rainfall: number; score: number };
}) {
  try {
    const res = await fetch(`${API_BASE}/duels`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        player1Id: "usr_ananya_sharma",
        ...duelData,
      }),
    });
    return await res.json();
  } catch {
    return null;
  }
}

// 6. Warzone Simulations
export async function submitWarzoneSessionApi(decisionsLog: any[], outcomeScore: number, region?: string, scenarioId?: string) {
  try {
    const res = await fetch(`${API_BASE}/warzone/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "usr_ananya_sharma",
        region: region || "Bay of Bengal - Paradip Sector",
        scenarioId: scenarioId || "cyclone-response-01",
        decisionsLog,
        outcomeScore,
      }),
    });
    if (!res.ok) throw new Error("Failed to submit warzone session");
    return await res.json();
  } catch {
    return null;
  }
}

// 7. Ground Reports (Crowdsourcing)
export async function fetchGroundReportsApi(): Promise<GroundReportItem[]> {
  try {
    const res = await fetch(`${API_BASE}/ground-reports`);
    if (!res.ok) throw new Error("Failed to fetch ground reports");
    return await res.json();
  } catch {
    return [
      {
        id: 1,
        userId: "usr_rahul_verma",
        region: "Gopalpur Coast, Ganjam, Odisha",
        lat: 19.26,
        lon: 84.91,
        category: "surge",
        description: "High surf breaking over seawall. Strong gusty easterly winds estimated 65 km/h. Sea water encroaching 30m onto promenade.",
        photoUrl: "https://images.unsplash.com/photo-1514632595-4944383f2737?w=600&auto=format&fit=crop&q=80",
        upvotes: 8,
        verificationCount: 4,
        verified: true,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 2,
        userId: "usr_priya_sen",
        region: "Digha Coastline, Purba Medinipur, WB",
        lat: 21.62,
        lon: 87.51,
        category: "wind",
        description: "Dense cloud cover with continuous squalls. 2 electric poles down near tourist hub. Police cordoning beach area.",
        photoUrl: "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=600&auto=format&fit=crop&q=80",
        upvotes: 5,
        verificationCount: 3,
        verified: true,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: 3,
        userId: "usr_rahul_verma",
        region: "Puri Beach Swargadwar, Odisha",
        lat: 19.79,
        lon: 85.82,
        category: "waterlogging",
        description: "Severe waterlogging in arterial street connecting Grand Road. Drainage pumping units deployed by municipality.",
        upvotes: 3,
        verificationCount: 2,
        verified: false,
        createdAt: new Date(Date.now() - 10800000).toISOString(),
      },
    ];
  }
}

export async function submitGroundReportApi(reportData: {
  region: string;
  lat: number;
  lon: number;
  category: string;
  description: string;
  photoUrl?: string;
}): Promise<GroundReportItem | null> {
  try {
    const res = await fetch(`${API_BASE}/ground-reports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "usr_ananya_sharma",
        ...reportData,
      }),
    });
    if (!res.ok) throw new Error("Failed to submit ground report");
    return await res.json();
  } catch {
    // Offline / fallback cache simulation
    return {
      id: Date.now(),
      userId: "usr_ananya_sharma",
      ...reportData,
      upvotes: 1,
      verificationCount: 1,
      verified: false,
      createdAt: new Date().toISOString(),
    };
  }
}

export async function upvoteGroundReportApi(reportId: number) {
  try {
    const res = await fetch(`${API_BASE}/ground-reports/${reportId}/upvote`, {
      method: "POST",
    });
    return await res.json();
  } catch {
    return { success: true, message: "Upvote stored locally in offline mode" };
  }
}

// 8. Alerts & SMS/WhatsApp Fan-Out Broadcast
export async function fetchAlertsApi(): Promise<AlertItem[]> {
  try {
    const res = await fetch(`${API_BASE}/alerts`);
    if (!res.ok) throw new Error("Failed to fetch alerts");
    return await res.json();
  } catch {
    return [
      {
        id: 1,
        region: "Odisha Coastal Districts (Puri, Jagatsinghpur, Kendrapara)",
        severity: "orange",
        message: "Heavy to very heavy rainfall expected (115–200 mm) over next 24 hours. Gale winds reaching 80–90 km/h along coast.",
        source: "IMD Cyclone Warning Division, New Delhi",
        verifiedBy: "Duty Meteorologist",
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        region: "North Coastal Andhra Pradesh",
        severity: "yellow",
        message: "Squally wind speed reaching 45–55 km/h gusting to 65 km/h. Sea condition will be rough to very rough.",
        source: "RMC Chennai",
        verifiedBy: "Area Cyclone Officer",
        createdAt: new Date().toISOString(),
      },
    ];
  }
}

export async function broadcastAlertFanoutApi(broadcastData: {
  alertId?: number;
  channel?: string;
  targetRegion?: string;
  languages?: string[];
}) {
  try {
    const res = await fetch(`${API_BASE}/alerts/broadcast`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(broadcastData),
    });
    return await res.json();
  } catch {
    return {
      success: true,
      message: "Emergency broadcast simulated offline via local CAP relay.",
      broadcast: {
        broadcastId: `cap_offline_${Date.now()}`,
        targetRegion: broadcastData.targetRegion || "Coastal Odisha & Andhra Corridor",
        channels: ["Cell Broadcast SMS", "WhatsApp Emergency Channel"],
        languagesDispatched: broadcastData.languages || ["en", "hi", "or"],
        metrics: {
          totalTargetPopulation: 2450000,
          messagesDelivered: 2432850,
          deliverySuccessRate: "99.3%",
          averageLatencySeconds: 3.4,
          cellTowersEngaged: 342,
          activePriorityLevel: "High Priority / Life-Safety Override",
        },
        sentAt: new Date().toISOString(),
        status: "COMPLETED (Simulated Offline)",
      },
    };
  }
}

// 9. Public Real-Data Live Hook
export async function syncLiveCycloneDataApi() {
  try {
    const res = await fetch(`${API_BASE}/cyclones/sync-live`, {
      method: "POST",
    });
    return await res.json();
  } catch {
    return {
      success: true,
      message: "Public data ingest fallback simulated from cached NOAA/IMD synoptic feed.",
      syncedCount: 1,
      cyclones: ["Deep Depression BOB-05 (Live Ingest)"],
    };
  }
}

export async function updateProfileApi(data: { name?: string; role?: string; region?: string; email?: string }) {
  try {
    const res = await fetch(`${API_BASE}/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "usr_ananya_sharma", ...data }),
    });
    if (!res.ok) throw new Error("Failed to update profile");
    return await res.json();
  } catch {
    return null;
  }
}
