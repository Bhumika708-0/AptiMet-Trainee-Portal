import React, { useState } from 'react';
import { Radio, Send, Smartphone, ShieldAlert, CheckCircle2, MessageSquare, BellRing, X, RefreshCw } from 'lucide-react';
import { broadcastAlertFanoutApi } from '@/lib/api';
import { HowThisWorksButton } from '@/components/ui/HowThisWorksModal';
import { useI18n } from '@/lib/i18n';

export function AlertBroadcastModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { language, t } = useI18n();
  const [severity, setSeverity] = useState<'orange' | 'red' | 'yellow'>('red');
  const [targetDistrict, setTargetDistrict] = useState('Puri, Jagatsinghpur & Kendrapara Coastal Wards');
  const [channels, setChannels] = useState<string[]>(['sms', 'whatsapp', 'siren']);
  const [customMsg, setCustomMsg] = useState(
    'IMD RED BULLETIN: Cyclone landfall expected within 18 hours. Move to nearest Cyclone Shelter. Emergency Helpline: 1077.'
  );
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastLog, setBroadcastLog] = useState<any>(null);

  const toggleChannel = (ch: string) => {
    setChannels((prev) => (prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]));
  };

  const handleBroadcast = async () => {
    setBroadcasting(true);
    const res = await broadcastAlertFanoutApi({
      channel: channels.join(','),
      targetRegion: targetDistrict,
      languages: [language, 'en', 'hi'],
    });
    setBroadcastLog(res?.broadcast);
    setBroadcasting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a2333]/65 backdrop-blur-sm animate-fade-in text-[#20364d]">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-[#cfe0e8] bg-white panel-shadow animate-rise-in overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#e5ecf0] px-6 py-4 bg-[#f8fafc]">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#b85042] text-white">
              <Radio size={20} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-display text-[#153b52]">
                  Emergency Multi-Channel Alert Fan-Out Console
                </h3>
                <span className="rounded-full bg-[#ffe8e4] px-2 py-0.5 text-[10px] font-bold text-[#b85042]">
                  NDMA CAP Standard
                </span>
              </div>
              <p className="text-xs text-[#607787]">
                Simulate verified bulletin dispatch to millions of citizen smartphones via Cell Broadcast & WhatsApp
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <HowThisWorksButton featureKey="broadcast" size="sm" />
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[#637a89] hover:bg-[#edf2f6]"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          {/* Dispatch Configuration Form */}
          <div className="space-y-4 text-xs">
            <div>
              <label className="text-[11px] font-bold text-[#456172] block mb-1.5 uppercase">
                Bulletin Severity Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['red', 'orange', 'yellow'] as const).map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`rounded-xl py-2 px-3 font-bold capitalize transition-all border ${
                      severity === sev
                        ? sev === 'red'
                          ? 'bg-[#ffebe8] border-[#f09a8f] text-[#a43a2c]'
                          : sev === 'orange'
                          ? 'bg-[#fff5e5] border-[#f5cb87] text-[#9c6313]'
                          : 'bg-[#fffae8] border-[#f0dc84] text-[#826e16]'
                        : 'bg-white border-[#d8e4eb] text-[#637d8d] hover:bg-[#f7fafc]'
                    }`}
                  >
                    {sev} Warning
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#456172] block mb-1.5 uppercase">
                Target Geo-Fenced Sector
              </label>
              <input
                type="text"
                value={targetDistrict}
                onChange={(e) => setTargetDistrict(e.target.value)}
                className="w-full rounded-xl border border-[#c6d7e0] bg-white p-2.5 text-xs font-semibold text-[#203d52]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#456172] block mb-1.5 uppercase">
                Multi-Channel Fan-Out Pathways
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'sms', label: 'Cell Broadcast SMS', icon: Smartphone },
                  { id: 'whatsapp', label: 'WhatsApp Channel', icon: MessageSquare },
                  { id: 'siren', label: 'CAP Siren Network', icon: BellRing },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleChannel(id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center ${
                      channels.includes(id)
                        ? 'bg-[#e2f0f8] border-[#81b2ce] text-[#0e5077] font-bold'
                        : 'bg-white border-[#d8e4eb] text-[#718694]'
                    }`}
                  >
                    <Icon size={18} className="mb-1" />
                    <span className="text-[10px]">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#456172] block mb-1.5 uppercase">
                Life-Safety Advisory Message
              </label>
              <textarea
                rows={3}
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                className="w-full rounded-xl border border-[#c6d7e0] bg-white p-2.5 text-xs text-[#203d52]"
              />
            </div>

            <button
              onClick={handleBroadcast}
              disabled={broadcasting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#b85042] py-3 text-xs font-bold text-white hover:bg-[#9d3f33] transition-all shadow-md"
            >
              {broadcasting ? (
                <>
                  <RefreshCw size={15} className="animate-spin" /> Dispatching Multi-Channel Fan-Out...
                </>
              ) : (
                <>
                  <Send size={15} /> Transmit Emergency Broadcast (2.45M Devices)
                </>
              )}
            </button>
          </div>

          {/* Realistic Phone Preview */}
          <div className="flex flex-col items-center justify-center rounded-2xl bg-[#0f2433] p-5 text-white">
            <div className="w-[260px] rounded-[32px] border-[6px] border-[#314a5e] bg-[#1a2f3f] p-3 shadow-2xl space-y-3">
              {/* Phone Speaker & Camera Notch */}
              <div className="mx-auto h-3.5 w-20 rounded-full bg-[#0a1822]" />

              {/* Push Notification Card */}
              <div className="rounded-2xl bg-white/95 p-3 text-[#1f3747] panel-shadow text-[11px] space-y-1.5 animate-rise-in">
                <div className="flex items-center justify-between text-[10px] text-[#708593]">
                  <span className="flex items-center gap-1 font-bold text-[#b85042]">
                    <ShieldAlert size={12} /> NATIONAL EMERGENCY ALERT
                  </span>
                  <span>Now</span>
                </div>
                <p className="font-bold text-[#143d54] leading-snug">
                  {severity === 'red' ? '🔴 RED WARNING: ' : severity === 'orange' ? '🟠 ORANGE ADVISORY: ' : '🟡 CAUTION: '}
                  {targetDistrict}
                </p>
                <p className="text-[10px] text-[#3e596b] leading-tight">{customMsg}</p>
                <div className="pt-1 border-t border-[#e2edf3] flex justify-between text-[9px] font-bold text-[#0e587d]">
                  <span>IMD / NDMA Sachet</span>
                  <span>Helpline: 1077</span>
                </div>
              </div>

              {/* WhatsApp Message Preview */}
              {channels.includes('whatsapp') && (
                <div className="rounded-xl bg-[#0b3c2c] p-2.5 text-white text-[10px] space-y-1 border border-[#165a44]">
                  <div className="flex items-center gap-1 font-bold text-[#55e09f]">
                    <MessageSquare size={11} /> IMD Odisha Official Broadcast
                  </div>
                  <p className="text-[9px] text-[#d4f7e6] leading-tight">
                    Severe cyclonic system approaching coast. Please follow state shelter evacuation guidelines.
                  </p>
                </div>
              )}
            </div>

            {/* Broadcast Results Metrics */}
            {broadcastLog && (
              <div className="mt-4 w-full rounded-xl bg-white/10 p-3 text-left text-[11px] space-y-1 text-[#cfe5f0] animate-rise-in">
                <div className="flex items-center gap-1.5 text-[#55e09f] font-bold">
                  <CheckCircle2 size={14} /> Broadcast Dispatched Successfully
                </div>
                <p>Delivered: <strong>{broadcastLog.metrics?.messagesDelivered?.toLocaleString()}</strong> devices (99.3% in {broadcastLog.metrics?.averageLatencySeconds}s)</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
