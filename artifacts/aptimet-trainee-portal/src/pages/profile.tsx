import { useState } from 'react';
import { Award, Check, ChevronRight, Download, Pencil, ShieldCheck, UserRound, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateProfileApi } from '@/lib/api';

function SectionHeading({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        {eyebrow && <div className="tiny-label mb-1">{eyebrow}</div>}
        <h2 className="text-[17px] font-bold tracking-[-.02em] text-[#203a52]">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function Field({
  label,
  value,
  editing,
  onChange,
  testId,
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange?: (v: string) => void;
  testId: string;
}) {
  return (
    <label className="block">
      <span className="tiny-label">{label}</span>
      {editing && onChange ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          data-testid={testId}
          className="mt-1 w-full border-b border-[#9fc1c6] bg-transparent py-1 text-sm font-semibold text-[#40576a] outline-none focus:border-[#18727c]"
        />
      ) : (
        <div data-testid={testId} className="mt-1 text-sm font-semibold text-[#40576a]">
          {value}
        </div>
      )}
    </label>
  );
}

function CertificateModal({
  onClose,
  name,
  title,
  certId,
  date,
}: {
  onClose: () => void;
  name: string;
  title: string;
  certId: string;
  date: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#19364c]/45 p-5 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl bg-white p-6 panel-shadow animate-rise-in"
      >
        <div className="flex items-center justify-between">
          <div className="tiny-label">Verified Credential Record</div>
          <button onClick={onClose} data-testid="button-close-certificate" className="p-1 rounded-lg hover:bg-[#edf2f5]">
            <X size={19} />
          </button>
        </div>

        <div className="mt-4 border-2 border-[#2a7180] bg-[#f7fbfa] p-7 text-center rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full border-8 border-[#17727c]/10" />
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-[#398b91] bg-[#e4f3f2] text-[#26747d]">
            <Award size={28} />
          </div>
          <div className="tiny-label mt-4 !text-[#3f777c]">India Meteorological Department · AptiMet</div>
          <h2 className="mt-2 text-2xl font-bold text-[#23526c]">Certificate of Competency</h2>
          <p className="mt-4 text-xs text-[#778b94]">This is to certify that</p>
          <p className="mt-1 text-xl font-bold text-[#29495e] font-display">{name}</p>
          <p className="mt-4 text-xs text-[#778b94]">has met all operational standards for</p>
          <p className="mt-1 text-base font-bold text-[#28727b]">{title}</p>
          <div className="mt-7 flex justify-between border-t border-[#dce7e5] pt-4 text-left text-[10px] text-[#72858c] font-mono">
            <span>ISSUED: {date}</span>
            <span>ID: {certId}</span>
          </div>
        </div>

        <button
          onClick={() => alert('Certificate downloaded to official trainee record.')}
          data-testid="button-download-certificate"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#075fa6] py-3 text-xs font-bold text-white hover:bg-[#064f8b] transition-colors"
        >
          <Download size={15} /> Download Official PDF Certificate
        </button>
      </div>
    </div>
  );
}

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('Ananya Sharma');
  const [email, setEmail] = useState('ananya.sharma@imd.gov.in');
  const [role, setRole] = useState('Scientific Assistant · Regional Meteorological Centre');
  const [region, setRegion] = useState('Pune, Maharashtra');
  const [previewCert, setPreviewCert] = useState<{ title: string; certId: string; date: string } | null>(null);
  const { toast } = useToast();

  return (
    <div className="mx-auto max-w-[1120px] p-5 md:p-8">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="tiny-label mb-1">IMD Official Record</div>
          <h1 className="text-[28px] font-bold tracking-[-.04em] text-[#124b78] md:text-[32px]">
            Trainee Profile & Credentials
          </h1>
          <p className="mt-1 text-sm text-[#667887]">
            Maintain your official qualifications and verified competency achievements.
          </p>
        </div>
        <button
          onClick={() => {
            if (editing) {
              updateProfileApi({ name, email, role, region });
              toast({
                title: 'Profile Updated',
                description: 'Your changes have been saved to your active training record.',
              });
            }
            setEditing(!editing);
          }}
          data-testid="button-edit-profile"
          className="flex items-center gap-2 rounded-lg border border-[#6ea8af] px-4 py-2 text-xs font-bold text-[#236c78] hover:bg-[#eff8f8] transition-colors"
        >
          {editing ? <Check size={15} /> : <Pencil size={15} />}
          {editing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6">
          {/* Identity Card */}
          <section className="rounded-2xl border border-[#d6e0e7] bg-white p-6 panel-shadow">
            <div className="flex items-center gap-4 border-b border-[#e6ecef] pb-5">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-[#d8ecec] text-xl font-bold text-[#196571]">
                AS
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#294359]">{name}</h2>
                <p className="text-xs text-[#718391]">{role}</p>
                <span className="mt-2 inline-block rounded bg-[#e7f2f4] px-2.5 py-0.5 text-[10px] font-bold text-[#28717c]">
                  Trainee Officer · Active Duty
                </span>
              </div>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" value={name} editing={editing} onChange={setName} testId="input-profile-name" />
              <Field label="Official Email" value={email} editing={editing} onChange={setEmail} testId="input-profile-email" />
              <Field label="Current Designation" value={role} editing={editing} onChange={setRole} testId="input-profile-role" />
              <Field label="Regional Centre" value={region} editing={editing} onChange={setRegion} testId="input-profile-region" />
            </div>
          </section>

          {/* Competency & Qualifications */}
          <section className="rounded-2xl border border-[#d6e0e7] bg-white p-6 panel-shadow">
            <SectionHeading title="Operational Skills & Tools" />
            <div className="mb-5 flex flex-wrap gap-2">
              {['Synoptic Forecasting', 'Numerical Weather Prediction', 'Radar Analysis', 'Climate QC', 'Python / MetPy', 'GIS & Satellite Ingestion', 'Early Warning Briefings'].map((x) => (
                <span
                  key={x}
                  className="rounded-full border border-[#b9d5d7] bg-[#eff8f8] px-3 py-1 text-xs font-semibold text-[#286b73]"
                >
                  {x}
                </span>
              ))}
            </div>
            <div className="grid gap-4 border-t border-[#e6ecef] pt-4 sm:grid-cols-2">
              <div>
                <div className="tiny-label">Highest Qualification</div>
                <p className="mt-1 text-sm font-semibold text-[#40576a]">M.Sc. Atmospheric Science</p>
              </div>
              <div>
                <div className="tiny-label">Operational Experience</div>
                <p className="mt-1 text-sm font-semibold text-[#40576a]">4 years · Regional Forecasting Operations</p>
              </div>
            </div>
          </section>
        </div>

        {/* Certificates & Verification */}
        <section className="space-y-6">
          <div className="rounded-2xl border border-[#d6e0e7] bg-white p-6 panel-shadow">
            <SectionHeading
              title="Verified Certificates"
              action={<span className="text-xs font-semibold text-[#7b8b98]">2 earned · 1 in progress</span>}
            />
            <div className="space-y-3">
              <button
                onClick={() =>
                  setPreviewCert({
                    title: 'Advanced Synoptic Meteorology',
                    certId: 'IMD-APM-SYN-7F2K9',
                    date: '14 August 2025',
                  })
                }
                data-testid="button-certificate-forecasting"
                className="flex w-full items-center gap-3.5 rounded-xl border border-[#dbe4e8] bg-[#fcfdfd] p-3.5 text-left hover:border-[#6da8ad] transition-colors"
              >
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-[#e4f1f1] text-[#1a7178]">
                  <Award size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-[#385166] truncate">Advanced Synoptic Meteorology</div>
                  <div className="mt-1 text-[11px] text-[#7b8a97]">Issued 14 Aug 2025 · Verified</div>
                </div>
                <ChevronRight size={15} className="text-[#82929d]" />
              </button>

              <button
                onClick={() =>
                  setPreviewCert({
                    title: 'Climate Data & Quality Control Essentials',
                    certId: 'IMD-APM-DQC-3A9M1',
                    date: '06 June 2025',
                  })
                }
                data-testid="button-certificate-data"
                className="flex w-full items-center gap-3.5 rounded-xl border border-[#dbe4e8] bg-[#fcfdfd] p-3.5 text-left hover:border-[#6da8ad] transition-colors"
              >
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-[#e4f1f1] text-[#1a7178]">
                  <Award size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-[#385166] truncate">Climate Data & Quality Control</div>
                  <div className="mt-1 text-[11px] text-[#7b8a97]">Issued 06 Jun 2025 · Verified</div>
                </div>
                <ChevronRight size={15} className="text-[#82929d]" />
              </button>
            </div>

            <div className="mt-6 rounded-xl bg-[#f1f7f7] border border-[#d3e5e5] p-4">
              <div className="flex gap-3">
                <ShieldCheck size={20} className="shrink-0 text-[#1e777b]" />
                <div>
                  <div className="text-xs font-bold text-[#345a68]">Official Blockchain-Verified Record</div>
                  <p className="mt-1 text-[11px] leading-5 text-[#71838d]">
                    Certifications earned through AptiMet simulation modules and pathway assessments map directly to IMD promotion benchmarks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {previewCert && (
        <CertificateModal
          onClose={() => setPreviewCert(null)}
          name={name}
          title={previewCert.title}
          certId={previewCert.certId}
          date={previewCert.date}
        />
      )}
    </div>
  );
}
