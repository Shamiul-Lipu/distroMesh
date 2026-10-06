'use client';

import React, { useState, useEffect } from 'react';
import { useExecutive } from '../../context/ExecutiveContext';
import {
  Clock,
  Monitor,
  Tablet,
  Sun,
  Bell,
  SlidersHorizontal
} from 'lucide-react';
import { OperatingMode } from '../../types/executive';

export const ExecutiveHeader: React.FC = () => {
  const { state, setOperatingMode, setTabletView, toggleWakeLock, openDrawer, openModal } = useExecutive();
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toTimeString().split(' ')[0]);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadAlertsCount = state.alerts.filter(a => !a.resolved).length;

  return (
    <header className="bg-[#111827] border-b border-[#374151] px-4 py-3 sticky top-0 z-30 shadow-2xl">
      <div className="flex flex-col items-stretch justify-between gap-3 xl:flex-row xl:items-center">
        {/* Left: Branding & Location */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-white font-bold text-lg shadow-lg border border-blue-400/30">
            UD
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-[#F9FAFB] font-sans">
                UNILEVER DISTRIBUTION
              </h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#1F2937] text-blue-400 border border-[#374151]">
                FMCG CONTROL ROOM
              </span>
            </div>
            <p className="text-xs font-mono text-[#9CA3AF] tracking-wider flex items-center gap-2">
              <span>SHERPUR • BOGURA</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-400">ILLUSTRATIVE DISTRIBUTOR CODE #DEMO-8894</span>
            </p>
          </div>
        </div>

        {/* Center: Mode Indicator & Emergency Banner Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Pill Dropdown / Selector */}
          <div className="flex items-center bg-[#0B0F19] rounded-lg p-1 border border-[#374151]">
            {(['MORNING', 'LIVE_OPS', 'EVENING_RECON', 'CRITICAL_RISK'] as OperatingMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setOperatingMode(mode)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-all ${
                  state.operatingMode === mode
                    ? mode === 'CRITICAL_RISK'
                      ? 'bg-red-600 text-white shadow-md shadow-red-900/50'
                      : 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                    : 'text-[#9CA3AF] hover:text-white hover:bg-[#1F2937]'
                }`}
              >
                {mode === 'CRITICAL_RISK' ? 'CRITICAL RISK' : mode.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Live Clock, Simulation Badge, Controls */}
        <div className="flex flex-wrap items-center gap-2 justify-between md:flex-nowrap md:justify-end">
          {/* Live Clock */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B0F19] border border-[#374151] rounded-lg text-emerald-400 font-mono text-sm font-bold shadow-inner">
            <Clock className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span>{currentTime || '22:45:12'}</span>
          </div>

          {/* Simulation Indicator */}
          <div className="flex items-center gap-2 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              SIMULATION
            </span>
          </div>

          {/* Wake Lock Toggle */}
          <button
            onClick={toggleWakeLock}
            title={state.wakeLockActive ? 'Screen Wake Lock Active' : 'Enable Screen Wake Lock'}
            className={`p-2 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all ${
              state.wakeLockActive
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400 shadow-md shadow-emerald-950'
                : 'bg-[#0B0F19] border-[#374151] text-gray-400 hover:text-white hover:border-gray-500'
            }`}
          >
            <Sun className={`w-4 h-4 ${state.wakeLockActive ? 'text-emerald-400 animate-spin-slow' : ''}`} />
            <span className="hidden xl:inline">{state.wakeLockActive ? 'WAKE LOCK: ON' : 'WAKE LOCK'}</span>
          </button>

          {/* Device Responsive Toggle (Desktop vs Tablet) */}
          <button
            onClick={() => setTabletView(!state.isTabletView)}
            title="Toggle CEO Desktop / Wall Display vs Tablet Mode"
            className={`p-2 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all ${
              state.isTabletView
                ? 'bg-indigo-900/50 border-indigo-500/50 text-indigo-300'
                : 'bg-[#0B0F19] border-[#374151] text-gray-400 hover:text-white'
            }`}
          >
            {state.isTabletView ? <Tablet className="w-4 h-4 text-indigo-400" /> : <Monitor className="w-4 h-4 text-blue-400" />}
            <span className="hidden xl:inline">{state.isTabletView ? 'TABLET' : 'DESKTOP'}</span>
          </button>

          {/* Simulation Drawer Button */}
          <button
            onClick={() => openDrawer('SIMULATION')}
            className="p-2 bg-[#1F2937] border border-[#374151] text-amber-400 hover:text-amber-300 hover:bg-[#374151] rounded-lg transition-all flex items-center gap-1 text-xs font-mono font-bold"
            title="Open Simulation Controls"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">SIM CONTROLS</span>
          </button>

          {/* Notifications Button */}
          <button
            onClick={() => openModal('EXCEPTIONS')}
            className="relative p-2 bg-[#0B0F19] border border-[#374151] text-gray-300 hover:text-white hover:border-gray-500 rounded-lg transition-all"
            title="Active Notifications & Exceptions"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-mono font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#111827] shadow-md">
                {unreadAlertsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
