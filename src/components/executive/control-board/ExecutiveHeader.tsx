'use client';

import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Zap,
  Sliders,
  Maximize2,
  Monitor,
  Tablet,
  Tv,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { useExecutive } from '../../../context/ExecutiveContext';
import { UserRole, WarRoomTier } from '../../../types/executive';
import { deriveLiquidityStatus } from '../../../utils/derivedRules';
import { toBanglaNumeral } from '../../../utils/formatters';

interface ExecutiveHeaderProps {
  businessName?: string;
  location?: string;
  onOpenSimulation?: () => void;
}

export const ExecutiveHeader: React.FC<ExecutiveHeaderProps> = ({
  businessName = 'M/S Popy Traders',
  location = 'Sherpur & Bogura Hub',
  onOpenSimulation,
}) => {
  const {
    state,
    setOperatingMode,
    setUserRole,
    setWarRoomTier,
    toggleWakeLock,
    toggleBanglaMode,
  } = useExecutive();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [mobileControlsOpen, setMobileControlsOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-GB', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      const dateStr = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).toUpperCase();

      setCurrentTime(state.banglaMode ? toBanglaNumeral(timeStr) : timeStr);
      setCurrentDate(dateStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [state.banglaMode]);

  const liquidity = deriveLiquidityStatus(state.bankCash, state.vaultCash, state.upcomingObligation);

  const getHealthBadge = () => {
    if (liquidity.status === 'CRITICAL' || state.cashVariance < -1000) {
      return {
        label: state.banglaMode ? '■ ঝুঁকিপূর্ণ' : '■ AT RISK',
        color: 'text-rose-700 bg-rose-50 border-rose-200',
        icon: <ShieldAlert size={12} className="text-rose-600" />,
      };
    }
    if (liquidity.status === 'WATCH' || state.cashVariance < 0 || state.dispatchDelayMinutes > 60) {
      return {
        label: state.banglaMode ? '▲ পর্যবেক্ষণ' : '▲ WATCH',
        color: 'text-amber-800 bg-amber-50 border-amber-200',
        icon: <AlertTriangle size={12} className="text-amber-600" />,
      };
    }
    return {
      label: state.banglaMode ? '● স্বাভাবিক' : '● HEALTHY',
      color: 'text-emerald-800 bg-emerald-50 border-emerald-200',
      icon: <ShieldCheck size={12} className="text-emerald-600" />,
    };
  };

  const health = getHealthBadge();

  const modeLabels: Record<string, { en: string; bn: string; phase: string }> = {
    MORNING_DISPATCH: { en: 'MORNING LAUNCH', bn: 'প্রভাতী ডেসপ্যাচ', phase: '07:00–09:00' },
    LIVE_OPS: { en: 'LIVE OPS', bn: 'লাইভ ডেলিভারি', phase: '10:00–16:00' },
    EVENING_RECON: { en: 'EVENING RECON', bn: 'সান্ধ্য রিকনসিলিয়েশন', phase: '17:00–19:30' },
    NIGHT_SETTLED: { en: 'NIGHT SETTLED', bn: 'দিন সমাপ্ত', phase: '20:00+' },
  };

  const currentMode = modeLabels[state.operatingMode] || modeLabels.LIVE_OPS;

  return (
    <header className="border-b border-[#e2e8f0] bg-white/95 backdrop-blur-md px-3 py-2 sm:px-5 sm:py-2.5 sticky top-[72px] z-20 shadow-2xs">
      <div className="mx-auto flex max-w-[1920px] items-center justify-between gap-2 sm:gap-3">
        {/* Left: Brand + Operating Location + Operational Mode */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono font-bold text-xs tracking-wider">
              dM
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-bold tracking-tight text-slate-900 uppercase font-mono">
                distroMesh
              </span>
              <span className="text-[10px] text-slate-500 font-mono hidden xs:inline">
                CONTROL BOARD
              </span>
            </div>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Business & Location Context */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-[11px] font-mono text-slate-700 font-semibold tracking-wide uppercase truncate max-w-[110px] sm:max-w-none">
              {location}
            </span>
            <span className="text-slate-400 font-mono hidden sm:inline">•</span>
            {/* Operating Mode Badge */}
            <div className="hidden sm:flex items-center gap-1.5 rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{state.banglaMode ? currentMode.bn : currentMode.en}</span>
              <span className="text-[9px] text-slate-400 hidden md:inline">({currentMode.phase})</span>
            </div>
          </div>
        </div>

        {/* Right: Health Badge + Desktop Controls + Mobile Controls Toggle Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Overall Business Health Status Badge */}
          <div className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-mono font-bold ${health.color}`}>
            {health.icon}
            <span>{health.label}</span>
          </div>

          {/* Desktop Controls (hidden on mobile, visible on lg) */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Live Telemetry Clock */}
            <div className="flex flex-col text-right font-mono">
              <span className="text-[11px] font-bold tracking-wider text-slate-900">
                {currentTime || '12:00:00'}
              </span>
              <span className="text-[9px] text-slate-500 tracking-wider">
                {currentDate || '07 OCT 2026'}
              </span>
            </div>

            <div className="h-4 w-px bg-slate-200" />

            {/* Role Perspective Selector */}
            <div className="relative">
              <select
                value={state.currentRole}
                onChange={(e) => setUserRole(e.target.value as UserRole)}
                className="rounded-lg border border-[#cbd5e1] bg-white px-2.5 py-1 text-[11px] font-mono text-slate-800 shadow-2xs focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                title="Select perspective"
              >
                <option value="Owner">{state.banglaMode ? 'মালিক / CEO' : 'Owner / CEO'}</option>
                <option value="Manager">{state.banglaMode ? 'অপারেশন ম্যানেজার' : 'Ops Manager'}</option>
                <option value="Cashier">{state.banglaMode ? 'ভল্ট ক্যাশিয়ার' : 'Vault Cashier'}</option>
                <option value="Field">{state.banglaMode ? 'ফিল্ড ভিউয়ার' : 'Field Viewer'}</option>
              </select>
            </div>

            {/* Viewport Tier Selector */}
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-[10px] font-mono">
              <button
                onClick={() => setWarRoomTier('desktop')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded transition ${
                  state.warRoomTier === 'desktop'
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Desktop balanced density"
              >
                <Monitor size={11} />
                <span>Deck</span>
              </button>
              <button
                onClick={() => setWarRoomTier('ipad')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded transition ${
                  state.warRoomTier === 'ipad'
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Touch tablet mode"
              >
                <Tablet size={11} />
                <span>Touch</span>
              </button>
              <button
                onClick={() => setWarRoomTier('wall')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded transition ${
                  state.warRoomTier === 'wall'
                    ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="55-65 inch Wall 4K Display Mode"
              >
                <Tv size={11} />
                <span>Wall 4K</span>
              </button>
            </div>

            {/* Bilingual Toggle (EN / BN) */}
            <button
              onClick={toggleBanglaMode}
              className={`rounded-lg border px-2.5 py-1 text-[11px] font-mono transition shadow-2xs ${
                state.banglaMode
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800 font-bold'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
              title="Toggle English / Bangla numerals and text"
            >
              {state.banglaMode ? 'বাংলা' : 'EN'}
            </button>

            {/* Wake Lock */}
            <button
              onClick={toggleWakeLock}
              className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-mono transition shadow-2xs ${
                state.wakeLockActive
                  ? 'border-amber-300 bg-amber-50 text-amber-800 font-bold'
                  : 'border-slate-200 bg-white text-slate-500 hover:text-slate-800'
              }`}
              title="Keep screen awake during depot operations"
            >
              <Zap size={11} className={state.wakeLockActive ? 'text-amber-600' : 'text-slate-400'} />
              <span className="hidden xl:inline">{state.wakeLockActive ? 'WakeLock ON' : 'WakeLock'}</span>
            </button>

            {/* Simulation Drawer Action */}
            {onOpenSimulation && (
              <button
                onClick={onOpenSimulation}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 text-[11px] font-mono font-medium text-slate-700 transition shadow-2xs"
                title="Open stress testing & scenario simulator"
              >
                <Sliders size={11} className="text-emerald-600" />
                <span>{state.banglaMode ? 'সিমুলেশন' : 'Simulate'}</span>
              </button>
            )}
          </div>

          {/* Mobile Controls Accordion Button (visible on mobile / < lg) */}
          <button
            onClick={() => setMobileControlsOpen(!mobileControlsOpen)}
            className="lg:hidden flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-mono font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
            aria-expanded={mobileControlsOpen}
            aria-label="Toggle executive controls tray"
          >
            <SlidersHorizontal size={12} className="text-emerald-700" />
            <span>Controls</span>
            <ChevronDown size={11} className={`transition-transform duration-200 ${mobileControlsOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Controls Tray */}
      {mobileControlsOpen && (
        <div className="lg:hidden mt-2 pt-2.5 border-t border-slate-200 flex flex-wrap items-center gap-2 font-mono text-[11px] bg-slate-50/90 p-2.5 rounded-xl border border-slate-200 shadow-xs">
          {/* Operating Mode Pill */}
          <div className="flex items-center gap-1.5 rounded border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold">{state.banglaMode ? currentMode.bn : currentMode.en}</span>
            <span className="text-[9px] text-slate-400">({currentMode.phase})</span>
          </div>

          {/* Role Perspective Selector */}
          <select
            value={state.currentRole}
            onChange={(e) => setUserRole(e.target.value as UserRole)}
            className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-800 shadow-2xs"
          >
            <option value="Owner">{state.banglaMode ? 'মালিক / CEO' : 'Owner / CEO'}</option>
            <option value="Manager">{state.banglaMode ? 'অপারেশন ম্যানেজার' : 'Ops Manager'}</option>
            <option value="Cashier">{state.banglaMode ? 'ভল্ট ক্যাশিয়ার' : 'Vault Cashier'}</option>
            <option value="Field">{state.banglaMode ? 'ফিল্ড ভিউয়ার' : 'Field Viewer'}</option>
          </select>

          {/* Viewport Tier Selector */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5 text-[10px]">
            <button
              onClick={() => setWarRoomTier('desktop')}
              className={`px-2 py-0.5 rounded transition ${state.warRoomTier === 'desktop' ? 'bg-slate-200 text-slate-900 font-bold' : 'text-slate-500'}`}
            >
              Deck
            </button>
            <button
              onClick={() => setWarRoomTier('ipad')}
              className={`px-2 py-0.5 rounded transition ${state.warRoomTier === 'ipad' ? 'bg-slate-200 text-slate-900 font-bold' : 'text-slate-500'}`}
            >
              Touch
            </button>
            <button
              onClick={() => setWarRoomTier('wall')}
              className={`px-2 py-0.5 rounded transition ${state.warRoomTier === 'wall' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-500'}`}
            >
              Wall 4K
            </button>
          </div>

          {/* Language Toggle */}
          <button
            onClick={toggleBanglaMode}
            className={`rounded-lg border px-2 py-1 text-[11px] font-bold shadow-2xs ${
              state.banglaMode ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-white text-slate-700'
            }`}
          >
            {state.banglaMode ? 'বাংলা' : 'EN'}
          </button>

          {/* Wake Lock */}
          <button
            onClick={toggleWakeLock}
            className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] shadow-2xs ${
              state.wakeLockActive ? 'border-amber-300 bg-amber-50 text-amber-800 font-bold' : 'border-slate-200 bg-white text-slate-600'
            }`}
          >
            <Zap size={11} className={state.wakeLockActive ? 'text-amber-600' : 'text-slate-400'} />
            <span>{state.wakeLockActive ? 'WakeLock ON' : 'WakeLock'}</span>
          </button>

          {/* Simulation Drawer Action */}
          {onOpenSimulation && (
            <button
              onClick={() => {
                setMobileControlsOpen(false);
                onOpenSimulation();
              }}
              className="flex items-center gap-1 rounded-lg border border-slate-300 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800 shadow-2xs transition"
            >
              <Sliders size={11} className="text-emerald-700" />
              <span>{state.banglaMode ? 'সিমুলেশন' : 'Simulate'}</span>
            </button>
          )}

          {/* Live Telemetry Clock */}
          <div className="ml-auto text-right text-[10px] text-slate-500">
            <span>{currentTime}</span> • <span>{currentDate}</span>
          </div>
        </div>
      )}
    </header>
  );
};
