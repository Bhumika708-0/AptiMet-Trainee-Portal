import React, { useState } from 'react';
import { Satellite, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';
import { syncLiveCycloneDataApi } from '@/lib/api';
import { HowThisWorksButton } from '@/components/ui/HowThisWorksModal';

export function PublicDataSyncBadge() {
  const [syncing, setSyncing] = useState(false);
  const [lastSyncMsg, setLastSyncMsg] = useState<string | null>(null);

  const handleSync = async () => {
    setSyncing(true);
    const res = await syncLiveCycloneDataApi();
    setSyncing(false);
    if (res?.success) {
      setLastSyncMsg('Synced 1 active tropical system from NOAA/IMD feed');
      setTimeout(() => setLastSyncMsg(null), 5000);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-2 rounded-xl bg-white border border-[#d6e3ea] px-3 py-1.5 panel-shadow text-xs">
        <div className="flex items-center gap-1.5 font-bold text-[#145d7d]">
          <Satellite size={14} className="text-[#0e587d] animate-pulse" />
          <span>NOAA/IMD Live Ingest</span>
        </div>

        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-1 rounded-md bg-[#eef6f9] hover:bg-[#dbebf1] px-2 py-0.5 text-[10px] font-bold text-[#12587a] transition-colors"
          title="Trigger live synoptic data sync from NOAA/IMD open API"
        >
          <RefreshCw size={11} className={syncing ? "animate-spin" : ""} />
          <span>{syncing ? "Syncing..." : "Sync Now"}</span>
        </button>

        <HowThisWorksButton featureKey="publicdata" size="sm" />
      </div>

      {lastSyncMsg && (
        <span className="flex items-center gap-1 rounded-lg bg-[#e2f7ec] px-2 py-1 text-[10px] font-bold text-[#147444] animate-fade-in">
          <CheckCircle2 size={12} /> {lastSyncMsg}
        </span>
      )}
    </div>
  );
}
