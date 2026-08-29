export const scenario = {
  title: "Cyclone Response",
  subtitle: "A coastal operations simulation",
  duration: "T-6:00:00",
  maxScore: 100,
  info: [
    { id: "i1", at: "T-6:00:00", title: "First signal", body: "A depression over the central Bay of Bengal is deepening faster than guidance expected. The nearest coast is 720 km away.", tag: "OBSERVATION" },
    { id: "i2", at: "T-4:30:00", title: "A tighter core", body: "Central pressure has fallen 12 hPa in six hours. Satellite imagery shows a developing eye wall.", tag: "UPDATE" },
    { id: "i3", at: "T-2:00:00", title: "The window narrows", body: "The system is now tracking west-northwest. Coastal districts have four hours before the first outer bands.", tag: "DECISION WINDOW" },
    { id: "i4", at: "T-0:30:00", title: "A human signal", body: "South Zone reports that evacuation buses are arriving, but fuel reserves will not last through landfall.", tag: "FIELD REPORT" },
    { id: "i5", at: "T+1:00:00", title: "Landfall review", body: "The eye crosses the coast. Your response log will be reviewed against the operational outcome.", tag: "OUTCOME" },
  ],
  mcq: {
    id: "m1", at: "T-5:15:00", title: "Your first call", prompt: "Which signal should drive the next escalation to the regional control room?", category: "Forecasting", score: 20,
    options: ["The 12 hPa pressure fall and tightening core", "The current wind speed alone", "The distance from the nearest coast", "Wait for the next model cycle"],
    answer: 0, feedback: "Correct. Rate of pressure fall and core organisation are the leading operational signals here.",
  },
  allocation: {
    id: "a1", at: "T-3:45:00", title: "Move the resources", prompt: "Allocate 100 points of response capacity across the four coastal zones. Every point represents one unit of attention, transport, or field coordination.", category: "Emergency planning", score: 25,
    zones: ["North Zone", "East Zone", "South Zone", "West Zone"], recommended: [20, 35, 35, 10],
    feedback: "The eastern and southern corridors face the earliest impact. A balanced allocation keeps North informed without starving the primary evacuation route.",
  },
  ranking: {
    id: "r1", at: "T-2:45:00", title: "Sequence the briefing", prompt: "Rank the next four actions from first to last. Tap an action to move it to the top, or use the arrows to reorder.", category: "Communication", score: 25,
    items: ["Issue district-level warning", "Confirm shelter transport", "Publish public update", "Request national assets"],
    recommended: ["Issue district-level warning", "Confirm shelter transport", "Publish public update", "Request national assets"],
    feedback: "Lead with a specific district warning, then make the shelter movement real. Public clarity follows operational certainty.",
  },
  freetext: {
    id: "f1", at: "T-1:15:00", title: "Write the handover", prompt: "In two or three sentences, brief the incoming night desk. Name the hazard, the immediate action, and the uncertainty they must watch.", category: "Communication", score: 30,
    keywords: ["cyclone", "evacuat", "warning", "shelter", "wind", "landfall", "south", "pressure"],
    feedback: "A useful handover names the hazard, gives a clear next action, and leaves the next desk an uncertainty to monitor.",
  },
};
