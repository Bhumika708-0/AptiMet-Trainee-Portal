import React, { useState, useEffect } from 'react';
import { MapPin, ThumbsUp, CheckCircle, ShieldAlert, Plus, Camera, Image as ImageIcon, RefreshCw, X } from 'lucide-react';
import { fetchGroundReportsApi, submitGroundReportApi, upvoteGroundReportApi, GroundReportItem } from '@/lib/api';
import { HowThisWorksButton } from '@/components/ui/HowThisWorksModal';

export function GroundReportsHub({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [reports, setReports] = useState<GroundReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Submit Form state
  const [newRegion, setNewRegion] = useState('Puri Coastline, Odisha');
  const [newLat, setNewLat] = useState(19.81);
  const [newLon, setNewLon] = useState(85.83);
  const [newCategory, setNewCategory] = useState('surge');
  const [newDesc, setNewDesc] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('https://images.unsplash.com/photo-1514632595-4944383f2737?w=600&auto=format&fit=crop&q=80');

  const loadReports = async () => {
    setLoading(true);
    const data = await fetchGroundReportsApi();
    setReports(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadReports();
    }
  }, [isOpen]);

  const handleUpvote = async (id: number) => {
    await upvoteGroundReportApi(id);
    setReports(prev =>
      prev.map(r =>
        r.id === id
          ? {
              ...r,
              upvotes: r.upvotes + 1,
              verificationCount: r.verificationCount + 1,
              verified: r.verificationCount + 1 >= 3 || r.verified,
            }
          : r
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim()) return;

    const created = await submitGroundReportApi({
      region: newRegion,
      lat: newLat,
      lon: newLon,
      category: newCategory,
      description: newDesc,
      photoUrl: newPhotoUrl,
    });

    if (created) {
      setReports(prev => [created, ...prev]);
      setShowSubmitModal(false);
      setNewDesc('');
    }
  };

  const filtered = filterCategory === 'all'
    ? reports
    : reports.filter(r => r.category === filterCategory);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a2333]/65 backdrop-blur-sm animate-fade-in text-[#20364d]">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-[#cfe0e8] bg-white panel-shadow animate-rise-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e5ecf0] px-6 py-4 bg-[#f8fafc]">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#146b71] text-white">
              <MapPin size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-display text-[#153b52]">
                  Crowd-Sourced Spotter & Ground Observation Hub
                </h3>
                <span className="rounded-full bg-[#dcf2f1] px-2 py-0.5 text-[10px] font-bold text-[#146b71]">
                  Citizen Science
                </span>
              </div>
              <p className="text-xs text-[#607787]">
                Geotagged situation reports from trained observers, storm spotters, and coastal citizens
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="flex items-center gap-1.5 rounded-xl bg-[#0c4a75] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#08385a] transition-all shadow-sm"
            >
              <Plus size={14} /> Submit Report
            </button>
            <HowThisWorksButton featureKey="crowdsource" size="sm" />
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[#637a89] hover:bg-[#edf2f6]"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center justify-between border-b border-[#e5ecf0] px-6 py-2.5 bg-[#fbfcfd] text-xs font-bold">
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All Reports' },
              { id: 'surge', label: '🌊 Storm Surge' },
              { id: 'wind', label: '💨 Wind & Gusts' },
              { id: 'waterlogging', label: '🌧️ Waterlogging' },
              { id: 'damage', label: '⚡ Structural Damage' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterCategory === cat.id
                    ? 'bg-[#146b71] text-white shadow-sm'
                    : 'text-[#5a7384] hover:bg-[#ebf3f7]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-[#697d8c]">
            {filtered.length} Reports Logged in Database
          </span>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(report => (
              <div
                key={report.id}
                className="rounded-2xl border border-[#d6e3ea] bg-white p-4 panel-shadow hover:border-[#86c8d4] transition-all flex flex-col justify-between"
              >
                <div>
                  {report.photoUrl && (
                    <div className="mb-3 h-32 w-full overflow-hidden rounded-xl bg-[#e4eef2]">
                      <img
                        src={report.photoUrl}
                        alt="Spotter photo"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-2">
                    <span className="flex items-center gap-1 font-mono text-[10px] uppercase font-bold text-[#145e69]">
                      <MapPin size={11} /> {report.region}
                    </span>
                    {report.verified ? (
                      <span className="flex items-center gap-1 rounded-full bg-[#dcf2f1] px-2 py-0.5 text-[9px] font-bold text-[#126b71]">
                        <CheckCircle size={10} /> Verified
                      </span>
                    ) : (
                      <span className="rounded-full bg-[#fceddf] px-2 py-0.5 text-[9px] font-bold text-[#b5601b]">
                        Pending Consensus
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-xs leading-5 text-[#2f4b5c]">{report.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#edf3f6] flex items-center justify-between text-[11px]">
                  <span className="text-[#718594] font-mono text-[10px]">
                    Lat: {report.lat.toFixed(2)}, Lon: {report.lon.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleUpvote(report.id)}
                    className="flex items-center gap-1.5 rounded-lg bg-[#eef6f9] px-2.5 py-1 font-bold text-[#12587a] hover:bg-[#d8eaf2] transition-colors"
                  >
                    <ThumbsUp size={12} />
                    <span>Confirm ({report.upvotes})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Report Sub-Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-[#0a2333]/70 backdrop-blur-sm animate-fade-in text-[#20364d]">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg rounded-2xl border border-[#cfe0e8] bg-white p-6 panel-shadow space-y-4 text-xs animate-rise-in"
          >
            <div className="flex items-center justify-between border-b border-[#e5ecf0] pb-3">
              <h4 className="font-bold text-base text-[#153b52]">Submit Citizen Ground Observation</h4>
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="p-1 text-[#627787] hover:bg-[#edf2f6] rounded-md"
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <label className="font-bold text-[#476273] block mb-1 uppercase text-[11px]">
                Coastal Sector / District Name
              </label>
              <input
                type="text"
                required
                value={newRegion}
                onChange={e => setNewRegion(e.target.value)}
                className="w-full rounded-xl border border-[#c5d8e2] p-2.5 text-xs text-[#203d52]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#476273] block mb-1 uppercase text-[11px]">
                  Hazard Category
                </label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full rounded-xl border border-[#c5d8e2] p-2.5 text-xs text-[#203d52]"
                >
                  <option value="surge">Storm Surge & Inundation</option>
                  <option value="wind">Gale Wind & Gust Damage</option>
                  <option value="waterlogging">Urban Waterlogging</option>
                  <option value="damage">Infrastructure / Electric Poles</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#476273] block mb-1 uppercase text-[11px]">
                  Estimated Coordinates
                </label>
                <div className="font-mono text-xs p-2.5 rounded-xl bg-[#f2f7f9] border border-[#d6e4ec] text-[#1a5b7d]">
                  {newLat}°N, {newLon}°E
                </div>
              </div>
            </div>

            <div>
              <label className="font-bold text-[#476273] block mb-1 uppercase text-[11px]">
                Field Observation Description
              </label>
              <textarea
                required
                rows={3}
                placeholder="Describe wind severity, water depth, sea turbulence, or local damages..."
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                className="w-full rounded-xl border border-[#c5d8e2] p-2.5 text-xs text-[#203d52]"
              />
            </div>

            <div>
              <label className="font-bold text-[#476273] block mb-1 uppercase text-[11px]">
                Observation Photo URL / Evidence
              </label>
              <input
                type="url"
                value={newPhotoUrl}
                onChange={e => setNewPhotoUrl(e.target.value)}
                className="w-full rounded-xl border border-[#c5d8e2] p-2.5 text-xs text-[#203d52]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="rounded-xl border border-[#c5d8e2] px-4 py-2 text-xs font-bold text-[#556e7e]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#146b71] px-5 py-2 text-xs font-bold text-white hover:bg-[#10565b]"
              >
                Submit & Log Geotag
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
