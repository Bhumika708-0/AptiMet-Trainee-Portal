import React, { useState, useEffect } from 'react';
import { Trophy, Swords, Zap, ArrowUp, ArrowDown, Shield, Users, Award, ChevronRight, X, Sparkles } from 'lucide-react';
import { fetchLeaderboardApi, fetchDuelsApi, createDuelApi, LeaderboardUser, DuelItem } from '@/lib/api';
import { HowThisWorksButton } from '@/components/ui/HowThisWorksModal';

export function EloLeaderboardModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [duels, setDuels] = useState<DuelItem[]>([]);
  const [tab, setTab] = useState<'leaderboard' | 'duels' | 'challenge'>('leaderboard');
  const [loading, setLoading] = useState(true);
  const [selectedOpponent, setSelectedOpponent] = useState<string>('usr_rajesh_kumar');
  const [duelRainfall, setDuelRainfall] = useState<number>(140);
  const [duelResult, setDuelResult] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      Promise.all([fetchLeaderboardApi(), fetchDuelsApi()])
        .then(([lData, dData]) => {
          setUsers(lData);
          setDuels(dData);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const handleLaunchDuel = async () => {
    setLoading(true);
    const opponent = users.find(u => u.userId === selectedOpponent);
    const oppGuessRainfall = Math.round(duelRainfall + (Math.random() * 24 - 12));
    const actualBenchmark = 145; // Fani benchmark
    
    const p1Score = Math.max(10, Math.round(100 - Math.abs(duelRainfall - actualBenchmark) * 1.2));
    const p2Score = Math.max(10, Math.round(100 - Math.abs(oppGuessRainfall - actualBenchmark) * 1.2));

    const result = await createDuelApi({
      player2Id: selectedOpponent,
      cycloneId: "fani-2019",
      player1Guess: { rainfall: duelRainfall, score: p1Score },
      player2Guess: { rainfall: oppGuessRainfall, score: p2Score },
    });

    setDuelResult(result);
    // Refresh leaderboard
    const updatedLeaderboard = await fetchLeaderboardApi();
    setUsers(updatedLeaderboard);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a2333]/65 backdrop-blur-sm animate-fade-in text-[#20364d]">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-[#cfe0e8] bg-white panel-shadow animate-rise-in overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#e5ecf0] px-6 py-4 bg-[#f8fafc]">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#0c4a75] text-white">
              <Trophy size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-display text-[#153b52]">
                  Live ELO Operational Leaderboard
                </h3>
                <span className="rounded-full bg-[#dcf2f1] px-2 py-0.5 text-[10px] font-bold text-[#146b71]">
                  FIDE Calibrated
                </span>
              </div>
              <p className="text-xs text-[#607787]">
                Dynamic chess-style rating reflecting real track verification & head-to-head operational calls
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <HowThisWorksButton featureKey="elo" size="sm" />
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[#637a89] hover:bg-[#edf2f6]"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#e5ecf0] px-6 text-xs font-bold bg-[#fbfcfd]">
          <button
            onClick={() => setTab('leaderboard')}
            className={`flex items-center gap-1.5 py-3 px-3 border-b-2 transition-all ${
              tab === 'leaderboard'
                ? 'border-[#0c4a75] text-[#0c4a75]'
                : 'border-transparent text-[#617787] hover:text-[#203a50]'
            }`}
          >
            <Trophy size={14} />
            <span>Global ELO Roster</span>
          </button>
          <button
            onClick={() => {
              setTab('challenge');
              setDuelResult(null);
            }}
            className={`flex items-center gap-1.5 py-3 px-3 border-b-2 transition-all ${
              tab === 'challenge'
                ? 'border-[#0c4a75] text-[#0c4a75]'
                : 'border-transparent text-[#617787] hover:text-[#203a50]'
            }`}
          >
            <Swords size={14} />
            <span>Challenge Colleague in Duel</span>
          </button>
          <button
            onClick={() => setTab('duels')}
            className={`flex items-center gap-1.5 py-3 px-3 border-b-2 transition-all ${
              tab === 'duels'
                ? 'border-[#0c4a75] text-[#0c4a75]'
                : 'border-transparent text-[#617787] hover:text-[#203a50]'
            }`}
          >
            <Zap size={14} />
            <span>Recent Duel History</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {tab === 'leaderboard' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#6a8090] uppercase tracking-wider px-3">
                <span className="w-12">Rank</span>
                <span className="flex-1">Forecaster & Regional Centre</span>
                <span className="w-24 text-center">Tier Badge</span>
                <span className="w-24 text-right">ELO Rating</span>
                <span className="w-20 text-right">Accuracy</span>
              </div>

              <div className="divide-y divide-[#edf2f5] rounded-xl border border-[#dce6ec] bg-white overflow-hidden">
                {users.map((u, i) => {
                  const isYou = u.userId === 'usr_ananya_sharma';
                  return (
                    <div
                      key={u.userId}
                      className={`flex items-center justify-between p-3.5 text-xs transition-colors ${
                        isYou ? 'bg-[#eaf4f7] font-semibold' : 'hover:bg-[#f9fbfc]'
                      }`}
                    >
                      {/* Rank */}
                      <span className="w-12 font-mono font-bold text-sm text-[#184d73]">
                        {i === 0 ? '🥇 #1' : i === 1 ? '🥈 #2' : i === 2 ? '🥉 #3' : `#${i + 1}`}
                      </span>

                      {/* Name & Region */}
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-bold text-[#1f384d]">{u.name}</span>
                          {isYou && (
                            <span className="rounded bg-[#0c4a75] px-1.5 py-0.2 text-[9px] font-bold text-white">
                              YOU
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#697d8c] truncate">{u.region} · {u.role}</p>
                      </div>

                      {/* Tier Badge */}
                      <div className="w-24 text-center">
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                          style={{
                            backgroundColor: `${u.tier?.color || '#164d78'}15`,
                            color: u.tier?.color || '#164d78',
                          }}
                        >
                          {u.tier?.badge || 'Forecaster'}
                        </span>
                      </div>

                      {/* ELO Rating */}
                      <div className="w-24 text-right">
                        <span className="font-mono text-sm font-bold text-[#134d6f]">
                          {u.eloRating}
                        </span>
                        <span className="text-[10px] text-[#6a8494] block">ELO</span>
                      </div>

                      {/* Accuracy */}
                      <div className="w-20 text-right font-mono font-semibold text-[#187578]">
                        {u.avgScore}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === 'challenge' && (
            <div className="space-y-5">
              {!duelResult ? (
                <div className="rounded-xl border border-[#d6e3ea] bg-[#f8fafc] p-5 space-y-4">
                  <div>
                    <h4 className="font-bold text-sm text-[#174768]">Initiate Synchronous Forecast Duel</h4>
                    <p className="text-xs text-[#5e7787]">
                      Compete against another duty meteorologist under identical historical satellite & radar signatures. Both player ELO ratings adjust upon outcome verification.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-[11px] font-bold text-[#456172] block mb-1.5 uppercase">
                        Select Opponent from Roster
                      </label>
                      <select
                        value={selectedOpponent}
                        onChange={(e) => setSelectedOpponent(e.target.value)}
                        className="w-full rounded-xl border border-[#c6d7e0] bg-white p-2.5 text-xs font-semibold text-[#203d52]"
                      >
                        {users.filter(u => u.userId !== 'usr_ananya_sharma').map(u => (
                          <option key={u.userId} value={u.userId}>
                            {u.name} (ELO: {u.eloRating} · {u.tier?.title || 'Forecaster'})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#456172] block mb-1.5 uppercase">
                        Historical Challenge Case
                      </label>
                      <div className="rounded-xl border border-[#c6d7e0] bg-white p-2.5 text-xs font-semibold text-[#174768]">
                        Cyclone Fani (2019) · Odisha Landfall
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#456172] block mb-1.5 uppercase">
                      Your 24-Hour District Rainfall Prediction: <span className="font-mono text-[#0e587a] text-sm">{duelRainfall} mm</span>
                    </label>
                    <input
                      type="range"
                      min="40"
                      max="240"
                      value={duelRainfall}
                      onChange={(e) => setDuelRainfall(Number(e.target.value))}
                      className="w-full accent-[#0e587a] h-2 bg-[#d2e2e8] rounded-lg cursor-pointer"
                    />
                  </div>

                  <button
                    onClick={handleLaunchDuel}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0c4a75] py-3 text-xs font-bold text-white hover:bg-[#093a5c] transition-all shadow-md"
                  >
                    <Swords size={16} />
                    <span>Lock In Prediction & Resolve Duel</span>
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl border border-[#badbce] bg-[#f0faf5] p-5 space-y-4 animate-rise-in text-xs">
                  <div className="flex items-center justify-between border-b border-[#cce8dc] pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#1d754e]">
                        Duel Outcome Verified
                      </span>
                      <h4 className="text-base font-bold text-[#144f35]">
                        {duelResult.winnerId === 'usr_ananya_sharma' ? '🎉 Victory! Operational Call Validated' : '🤝 Challenging Match Finished'}
                      </h4>
                    </div>
                    <span className="rounded-full bg-[#1b734c] px-3 py-1 text-xs font-bold text-white">
                      ELO Δ: {duelResult.eloResult?.player1Delta >= 0 ? `+${duelResult.eloResult?.player1Delta}` : duelResult.eloResult?.player1Delta} pts
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-white p-3.5 border border-[#c4e3d5]">
                      <p className="font-bold text-[#164d36]">Your Call</p>
                      <p className="font-mono text-xl font-bold text-[#0c4a75] mt-1">{duelRainfall} mm</p>
                      <p className="text-[11px] text-[#527766]">New ELO: <strong>{duelResult.eloResult?.player1NewRating || 1478}</strong></p>
                    </div>
                    <div className="rounded-xl bg-white p-3.5 border border-[#c4e3d5]">
                      <p className="font-bold text-[#164d36]">Opponent Call</p>
                      <p className="font-mono text-xl font-bold text-[#627787] mt-1">{duelRainfall + 14} mm</p>
                      <p className="text-[11px] text-[#527766]">New ELO: <strong>{duelResult.eloResult?.player2NewRating || 1630}</strong></p>
                    </div>
                  </div>

                  <button
                    onClick={() => setDuelResult(null)}
                    className="rounded-xl bg-[#176a47] px-4 py-2 text-xs font-bold text-white hover:bg-[#125337]"
                  >
                    Play Another Match
                  </button>
                </div>
              )}
            </div>
          )}

          {tab === 'duels' && (
            <div className="space-y-3">
              <div className="rounded-xl border border-[#d6e3ea] bg-white divide-y divide-[#ecf2f5] text-xs">
                {duels.length > 0 ? (
                  duels.map((d) => (
                    <div key={d.id} className="p-3.5 flex items-center justify-between hover:bg-[#f9fbfc]">
                      <div>
                        <span className="font-bold text-[#1f3c50]">{d.player1?.name || 'Ananya Sharma'} vs {d.player2?.name || 'Dr. Rajesh Kumar'}</span>
                        <p className="text-[10px] text-[#698090]">Case: {d.cycloneId} · Status: {d.status}</p>
                      </div>
                      <div className="text-right">
                        <span className="rounded bg-[#e2f0f7] px-2 py-0.5 text-[10px] font-bold text-[#1a5b88]">
                          Winner: {d.winnerId === 'usr_ananya_sharma' ? 'Ananya Sharma' : 'Dr. Rajesh Kumar'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-[#738896]">
                    No duel records in active session. Challenge a colleague to seed the duel log.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
