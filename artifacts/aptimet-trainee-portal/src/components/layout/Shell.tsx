import { type ReactNode, useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Activity, Bell, ChevronDown, CircleHelp,
  GraduationCap, LayoutDashboard, Library, Menu, Radar,
  Settings, Sparkles, Target, UserRound, X, Compass,
  Trophy, MapPin, Radio, Wifi, WifiOff, Globe, Satellite
} from 'lucide-react';
import { notifications } from '@/mockData/notifications';
import { useI18n, SUPPORTED_LANGUAGES, SupportedLanguage } from '@/lib/i18n';
import { useOfflineStatus, ConnectivityMode } from '@/hooks/useOfflineStatus';
import { EloLeaderboardModal } from '@/components/features/EloLeaderboardModal';
import { GroundReportsHub } from '@/components/features/GroundReportsHub';
import { AlertBroadcastModal } from '@/components/features/AlertBroadcastModal';
import { PublicDataSyncBadge } from '@/components/features/PublicDataSyncBadge';
import { HowThisWorksButton } from '@/components/ui/HowThisWorksModal';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" data-testid="link-brand">
      <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#0c4a75] text-white font-bold text-sm shadow-sm">
        <Radar size={18} />
      </div>
      <div>
        <span className="text-[16px] font-bold tracking-[-.04em] text-[#0c4a75]">AptiMet</span>
        <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-mono-ui tracking-wider text-[#617385] border-l border-[#c5d3df] pl-2">Trainee Portal</span>
      </div>
    </Link>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { language, setLanguage, t } = useI18n();
  const { mode, isOffline, isLowBandwidth, setMode } = useOfflineStatus();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadList, setUnreadList] = useState(notifications);

  // Modals state
  const [eloModalOpen, setEloModalOpen] = useState(false);
  const [groundReportsOpen, setGroundReportsOpen] = useState(false);
  const [broadcastOpen, setBroadcastOpen] = useState(false);

  const navItems = [
    { href: '/', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/catalog', label: t('courseCatalog'), icon: Library },
    { href: '/skills', label: t('skillAssessment'), icon: Radar },
    { href: '/profile', label: t('myProfile'), icon: UserRound },
  ];

  const unreadCount = unreadList.filter(n => n.unread).length;

  return (
    <div className="app-frame flex flex-col bg-[#eef2f6] text-[#20364d]">
      {/* Offline / Low-Bandwidth Banner */}
      {(isOffline || isLowBandwidth) && (
        <div className={`px-4 py-1.5 text-xs font-bold flex items-center justify-between transition-colors ${
          isOffline ? 'bg-[#b85042] text-white' : 'bg-[#d8973d] text-[#241a08]'
        }`}>
          <div className="flex items-center gap-2">
            {isOffline ? <WifiOff size={14} /> : <Wifi size={14} />}
            <span>
              {isOffline
                ? 'Offline-First Mode Active — Local Storage Cache & Simulation Engine in Use.'
                : 'Low-Bandwidth 2G Mode Active — Background asset preloading throttled.'}
            </span>
          </div>
          <button
            onClick={() => setMode('online')}
            className="underline text-[11px] font-semibold hover:opacity-80"
          >
            Switch to Online Mode
          </button>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="relative flex h-[58px] shrink-0 items-center border-b border-[#d9e1e8] bg-[#fbfcfd] px-4 md:px-7">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-1.5 rounded-md hover:bg-[#eaf0f4]"
            onClick={() => setMobileOpen(true)}
            data-testid="button-open-menu"
            aria-label="Open navigation menu"
          >
            <Menu size={21} />
          </button>
          <Logo />
        </div>

        {/* Center Quick Action Badges */}
        <div className="hidden lg:flex items-center gap-3 ml-6">
          <PublicDataSyncBadge />
        </div>

        <div className="ml-auto flex items-center gap-3">
          {/* Network Mode Switcher Dropdown */}
          <div className="flex items-center rounded-lg border border-[#d2dfdf] bg-white p-0.5 text-xs">
            <button
              onClick={() => setMode('online')}
              className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
                mode === 'online' ? 'bg-[#146b71] text-white' : 'text-[#52707b] hover:bg-[#edf4f6]'
              }`}
              title="Full online connectivity mode"
            >
              Online
            </button>
            <button
              onClick={() => setMode('low-bandwidth')}
              className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
                mode === 'low-bandwidth' ? 'bg-[#d8973d] text-white' : 'text-[#52707b] hover:bg-[#edf4f6]'
              }`}
              title="2G low-bandwidth mode"
            >
              2G
            </button>
            <button
              onClick={() => setMode('offline')}
              className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
                mode === 'offline' ? 'bg-[#b85042] text-white' : 'text-[#52707b] hover:bg-[#edf4f6]'
              }`}
              title="Simulate offline field environment"
            >
              Offline
            </button>
          </div>

          {/* Multilingual Selector */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              aria-label="Select interface language"
              className="rounded-lg border border-[#d2dfdf] bg-white px-2.5 py-1 text-xs font-bold text-[#1a4a6e] hover:bg-[#f6fafd] cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.nativeName}
                </option>
              ))}
            </select>
          </div>

          {/* Notifications Flyout */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              data-testid="button-notifications"
              className="relative p-1.5 rounded-lg text-[#124e79] hover:bg-[#eef4f8] transition-colors"
              aria-label="View notifications"
            >
              <Bell size={19} strokeWidth={1.8} />
              {unreadCount > 0 && (
                <span className="absolute 0 top-0 h-2.5 w-2.5 rounded-full bg-[#d86152] border-2 border-white" />
              )}
            </button>

            {notificationsOpen && (
              <div className="panel-shadow absolute right-0 top-10 z-50 w-[330px] overflow-hidden rounded-xl border border-[#d7e0e8] bg-white animate-rise-in">
                <div className="flex items-center justify-between border-b border-[#e1e7ed] px-4 py-3 bg-[#f9fbfc]">
                  <b className="text-sm text-[#203a52]">Notifications</b>
                  <span className="text-[11px] font-semibold text-[#64798c]">{unreadCount} unread</span>
                </div>
                <div className="divide-y divide-[#edf0f3] max-h-[360px] overflow-y-auto">
                  {unreadList.map((n) => (
                    <div key={n.id} className="p-3.5 hover:bg-[#f8fbfc] transition-colors">
                      <div className="flex justify-between items-center">
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          n.tone === 'red' ? 'bg-[#ffe0db] text-[#9a453c]' :
                          n.tone === 'blue' ? 'bg-[#e3effa] text-[#356686]' :
                          'bg-[#e9eef2] text-[#617384]'
                        }`}>
                          {n.label}
                        </span>
                        <span className="text-[10px] text-[#8a9aa8]">{n.time}</span>
                      </div>
                      <p className="mt-1.5 text-xs leading-5 text-[#4c5f70]">{n.text}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setUnreadList(unreadList.map(n => ({ ...n, unread: false })));
                    setNotificationsOpen(false);
                  }}
                  className="w-full border-t border-[#e1e7ed] py-2.5 text-xs font-bold text-[#12698c] hover:bg-[#f2f7f8] transition-colors"
                  data-testid="button-close-notifications"
                >
                  Mark all as read
                </button>
              </div>
            )}
          </div>

          {/* User Profile Badge */}
          <Link
            href="/profile"
            data-testid="link-header-profile"
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-[#eef4f8] transition-colors"
          >
            <div className="grid h-8 w-8 place-items-center rounded-full bg-[#d8e9e8] text-xs font-bold text-[#185f6b]">AS</div>
            <span className="hidden text-xs font-semibold text-[#536678] sm:block">Ananya Sharma</span>
            <ChevronDown size={14} className="text-[#8493a0]" />
          </Link>
        </div>
      </header>

      {/* Main Container with Sidebar & Content */}
      <div className="flex min-h-0 flex-1">
        <aside
          className={`${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          } sidebar-shadow fixed inset-y-0 left-0 z-40 flex w-[230px] flex-col border-r border-[#d5dee8] bg-[#f8fafc] px-3.5 py-4 transition-transform md:relative md:translate-x-0`}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#e0f0f0] text-[#18727c]">
                <GraduationCap size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-[#17476b]">Trainee Desk</div>
                <div className="text-[10px] text-[#617385]">IMD Operations</div>
              </div>
            </div>
            {mobileOpen && (
              <button
                className="md:hidden p-1 rounded-md text-[#5f7485] hover:bg-[#eaf0f4]"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <nav className="space-y-1" aria-label="Sidebar navigation">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = location === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  data-testid={`link-${label.toLowerCase().replaceAll(' ', '-')}`}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                    active ? 'bg-[#86e0df]/50 text-[#16495c] font-bold' : 'text-[#526678] hover:bg-[#e9f0f5]'
                  }`}
                >
                  <Icon size={17} strokeWidth={1.8} />
                  <span>{label}</span>
                </Link>
              );
            })}

            <div className="my-3 border-t border-[#dfe6ed]" />
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#8192a2]">
              Operational Tools
            </div>

            {/* War Room Simulator */}
            <Link
              href="/war-room"
              onClick={() => setMobileOpen(false)}
              data-testid="link-war-room"
              className="flex items-center gap-3 rounded-lg bg-[#fff3ef] px-3 py-2 text-[13px] font-medium text-[#a34f42] hover:bg-[#ffe7e0] border border-[#ffdcd4] transition-colors"
            >
              <Activity size={17} className="text-[#b85042] animate-pulse" />
              <span>{t('cycloneWarZone')}</span>
            </Link>

            {/* Forecast Duel */}
            <Link
              href="/forecast-duel"
              onClick={() => setMobileOpen(false)}
              data-testid="link-forecast-duel"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                location === '/forecast-duel' ? 'bg-[#e2f0f8] text-[#1a5b88] font-bold' : 'text-[#526678] hover:bg-[#e9f0f5]'
              }`}
            >
              <Compass size={17} />
              <span>{t('forecastDuels')}</span>
            </Link>

            {/* Live ELO Leaderboard Modal Trigger */}
            <button
              onClick={() => setEloModalOpen(true)}
              data-testid="button-open-elo-leaderboard"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-[#214b6d] hover:bg-[#eaf3f8] transition-colors text-left"
            >
              <Trophy size={17} className="text-[#1a5b88]" />
              <span>{t('leaderboard')}</span>
            </button>

            {/* Ground Reports Hub Modal Trigger */}
            <button
              onClick={() => setGroundReportsOpen(true)}
              data-testid="button-open-ground-reports"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-[#185e68] hover:bg-[#e9f5f5] transition-colors text-left"
            >
              <MapPin size={17} className="text-[#18727c]" />
              <span>{t('groundReports')}</span>
            </button>

            {/* Emergency Fanout Alert Broadcast Trigger */}
            <button
              onClick={() => setBroadcastOpen(true)}
              data-testid="button-open-alert-broadcast"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-[#9d3c2e] hover:bg-[#ffece8] transition-colors text-left"
            >
              <Radio size={17} className="text-[#b85042]" />
              <span>{t('emergencyBroadcast')}</span>
            </button>
          </nav>

          <div className="mt-auto space-y-1.5 pt-4">
            <HowThisWorksButton featureKey="accuracy" size="sm" />

            <button
              onClick={() => alert('IMD Regional Training Cell support is active. Dial 1800-180-1717 or contact duty supervisor.')}
              data-testid="button-support"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[13px] text-[#526678] hover:bg-[#e9f0f5] transition-colors"
            >
              <CircleHelp size={17} /> Support
            </button>
          </div>
        </aside>

        {mobileOpen && (
          <button
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-30 bg-[#17334d]/20 md:hidden"
            data-testid="button-overlay"
          />
        )}

        <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* Embedded Feature Modals */}
      <EloLeaderboardModal isOpen={eloModalOpen} onClose={() => setEloModalOpen(false)} />
      <GroundReportsHub isOpen={groundReportsOpen} onClose={() => setGroundReportsOpen(false)} />
      <AlertBroadcastModal isOpen={broadcastOpen} onClose={() => setBroadcastOpen(false)} />
    </div>
  );
}
