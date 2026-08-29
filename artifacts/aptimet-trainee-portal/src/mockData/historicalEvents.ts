export type HistoricalEvent = {
  id: string;
  name: string;
  date: string;
  location: string;
  context: string;
  available: { pressure: number; cloud: string; wind: number; windDirection: string };
  actual: { pressure: number; wind: number; rainfall: number };
  official: { call: string; confidence: string };
  correctRange: [number, number];
};

export const historicalEvents: HistoricalEvent[] = [
  {
    id: "phailin-2013",
    name: "Cyclone Phailin (2013)",
    date: "11 October 2013 · 06:00 IST",
    location: "Bay of Bengal · 15.0°N, 86.5°E",
    context: "A deep depression is organising east of the Andhra coast. You are on the morning briefing desk.",
    available: { pressure: 986, cloud: "Dense overcast, curved bands forming", wind: 74, windDirection: "NE" },
    actual: { pressure: 940, wind: 215, rainfall: 182 },
    official: { call: "Very severe cyclonic storm", confidence: "High confidence · landfall near Gopalpur" },
    correctRange: [160, 205],
  },
  {
    id: "fani-2019",
    name: "Cyclone Fani (2019)",
    date: "30 April 2019 · 12:00 IST",
    location: "Bay of Bengal · 11.8°N, 88.1°E",
    context: "A compact circulation has tightened quickly. The next bulletin needs a rainfall range.",
    available: { pressure: 998, cloud: "Central dense overcast, loose spiral", wind: 46, windDirection: "W" },
    actual: { pressure: 932, wind: 205, rainfall: 137 },
    official: { call: "Extremely severe cyclonic storm", confidence: "High confidence · Odisha coast" },
    correctRange: [115, 155],
  },
  {
    id: "tauktae-2021",
    name: "Cyclone Tauktae (2021)",
    date: "15 May 2021 · 00:00 IST",
    location: "Arabian Sea · 12.2°N, 72.8°E",
    context: "A warm-core system is tracking north-west through an unusually warm Arabian Sea.",
    available: { pressure: 1002, cloud: "Scattered deep convection", wind: 38, windDirection: "SW" },
    actual: { pressure: 956, wind: 150, rainfall: 96 },
    official: { call: "Very severe cyclonic storm", confidence: "Moderate confidence · Gujarat coast" },
    correctRange: [80, 112],
  },
];
