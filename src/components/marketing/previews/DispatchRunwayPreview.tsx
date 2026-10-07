'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Zap,
  ArrowRight,
  Printer,
  Sparkles,
  MapPin,
  User,
  PackageCheck,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { DEFAULT_VEHICLE_FLEET, VehicleTelemetry } from '../../../data/fleetData';

interface DispatchRunwayPreviewProps {
  vehicles?: VehicleTelemetry[];
  autoRotateIntervalMs?: number;
  autoDemo?: boolean;
}

const CINEMATIC_EASE = [0.4, 0, 0.2, 1] as const;

export const DispatchRunwayPreview: React.FC<DispatchRunwayPreviewProps> = ({
  vehicles = DEFAULT_VEHICLE_FLEET,
  autoRotateIntervalMs = 2400,
  autoDemo = true,
}) => {
  const [fixed, setFixed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Automatic vehicle changes with NO user interaction (balanced & smooth)
  useEffect(() => {
    if (isPaused || vehicles.length === 0) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % vehicles.length);
    }, autoRotateIntervalMs);

    return () => clearInterval(timer);
  }, [vehicles.length, isPaused, autoRotateIntervalMs]);

  // Auto-demo simulation: automatically clear yard bottleneck at 1.2s
  useEffect(() => {
    if (!autoDemo) return;

    const fixTimer = setTimeout(() => {
      setFixed(true);
    }, 1200);

    return () => clearTimeout(fixTimer);
  }, [autoDemo]);

  // Ensure activeIndex is within bounds if vehicle array changes dynamically
  const safeActiveIndex = activeIndex % (vehicles.length || 1);
  const currentVehicle = vehicles[safeActiveIndex] || vehicles[0];

  // Dynamic calculations supporting ANY arbitrary number of vehicles
  const totalVehicles = vehicles.length;
  const initialStalledCount = vehicles.filter((v) => v.status === 'stalled').length;
  const stalledCount = fixed ? 0 : initialStalledCount;
  const departedCount = totalVehicles - stalledCount;

  // Stalled vs resolved metrics
  const delayMinutes = fixed ? 0 : 165;
  const departureTime = fixed ? '09:00 AM' : '11:45 AM';
  const idleLaborCost = fixed ? 0 : 4950;

  // If fixed, current vehicle is treated as on-time departed
  const isVehicleStalled = !fixed && currentVehicle?.status === 'stalled';

  return (
    <div className="w-full max-w-full rounded-xl border border-[var(--border)] bg-[#0B0F19] text-white p-3.5 sm:p-5 shadow-2xl font-mono select-none overflow-hidden relative">
      {/* Background ambient lighting */}
      <div
        className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
          fixed ? 'bg-emerald-500/10' : 'bg-rose-500/10'
        }`}
      />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Step Indicator Banner for Auto-Cycle */}
      <div className="mb-3 pb-2.5 border-b border-[#1F2937] flex items-center justify-between gap-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={fixed ? 'step-2' : 'step-1'}
            initial={{ opacity: 0, x: -8, filter: 'blur(3px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: 8, filter: 'blur(3px)' }}
            transition={{ duration: 0.22, ease: CINEMATIC_EASE }}
            className="flex items-center gap-1.5 text-[10px] font-bold"
          >
            <span className={`h-2 w-2 rounded-full ${fixed ? 'bg-emerald-400' : 'bg-rose-400'} animate-ping shrink-0`} />
            <span className={fixed ? 'text-emerald-400' : 'text-rose-400'}>
              {fixed
                ? 'STEP 2/2 · THERMAL PRINTER INSTALLED · 12/12 FLEET DEPARTED ON-TIME'
                : 'STEP 1/2 · +165M DEPARTURE STALL DETECTED · MEMO PRINTER DOWN'}
            </span>
          </motion.div>
        </AnimatePresence>
        <span className="text-[9px] text-gray-400 bg-[#111827] px-2 py-0.5 rounded border border-gray-800 shrink-0">
          ZONE 03 ACTIVE
        </span>
      </div>

      {/* Top Cockpit Header */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 pb-3 mb-3 border-b border-[#1F2937]">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-md bg-[#111827] border border-gray-800 shrink-0">
            <Truck size={14} className={fixed ? 'text-emerald-400' : 'text-amber-400'} />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold tracking-wider uppercase text-gray-200 truncate">
              Depot Yard Dispatch · {totalVehicles} Delivery Fleet
            </div>
            <div className="text-[10px] text-gray-400 font-sans truncate">
              Continuous Auto-Telemetry · Beat Departure Radar
            </div>
          </div>
        </div>

        <div
          className={`self-start xs:self-auto flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-md border shrink-0 ${
            fixed
              ? 'text-emerald-400 bg-emerald-950/40 border-emerald-900/60'
              : 'text-rose-400 bg-rose-950/40 border-rose-900/60 animate-pulse'
          }`}
        >
          <Clock size={11} />
          <span>{fixed ? 'ALL ON-TIME (09:00 AM)' : `+${delayMinutes}M GATE STALL`}</span>
        </div>
      </div>

      {/* Target vs Actual Timing Cards */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3">
        <div className="p-2.5 sm:p-3 rounded-lg bg-[#111827] border border-gray-800 min-w-0">
          <div className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-wider mb-1 truncate">
            Depot Gate Cutoff
          </div>
          <div className="text-sm sm:text-lg font-bold text-gray-200 truncate">09:00 AM</div>
          <div className="text-[9px] sm:text-[10px] text-gray-500 mt-0.5 truncate">
            {totalVehicles} vans scheduled
          </div>
        </div>

        <div
          className={`p-2.5 sm:p-3 rounded-lg border transition-colors min-w-0 ${
            fixed ? 'bg-[#111827] border-gray-800' : 'bg-[#1A1012] border-rose-900/60'
          }`}
        >
          <div className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-wider mb-1 truncate">
            Actual Departure
          </div>
          <div
            className={`text-sm sm:text-lg font-bold dm-tabular truncate ${
              fixed ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {departureTime}
          </div>
          <div
            className={`text-[9px] sm:text-[10px] font-bold mt-0.5 truncate ${
              fixed ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {fixed ? '✓ Zero delay' : `+${delayMinutes}m idle crew cost`}
          </div>
        </div>
      </div>

      {/* Flexible Dynamic Fleet Radar Strip (Supports ANY number of vehicles) */}
      <div className="p-2.5 sm:p-3 rounded-lg bg-[#111827] border border-gray-800 mb-3">
        <div className="flex items-center justify-between text-[11px] text-gray-300 font-semibold mb-2">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] sm:text-xs">Live Fleet Selector ({totalVehicles} Vans)</span>
          </div>
          <span className="text-[9px] sm:text-[10px] text-gray-400 dm-tabular">
            {fixed
              ? `${totalVehicles}/${totalVehicles} Departed`
              : `${departedCount} Departed · ${stalledCount} Stalled`}
          </span>
        </div>

        {/* Dynamic vehicle pills - adapts cleanly to any count without overflow */}
        <div className="flex flex-wrap gap-1 sm:gap-1.5">
          {vehicles.map((v, idx) => {
            const isLate = !fixed && v.status === 'stalled';
            const isActive = idx === safeActiveIndex;

            return (
              <button
                key={v.id || idx}
                onClick={() => {
                  setActiveIndex(idx);
                  setIsPaused(true);
                  // Resume autoplay after 8 seconds of inactivity
                  setTimeout(() => setIsPaused(false), 8000);
                }}
                className={`relative px-2 py-1 rounded text-[9px] sm:text-[10px] font-bold border transition-all active:scale-95 ${
                  isActive
                    ? 'ring-2 ring-[var(--accent)] ring-offset-1 ring-offset-[#0B0F19] z-10 scale-105'
                    : 'opacity-85 hover:opacity-100'
                } ${
                  isLate
                    ? 'bg-rose-950/70 text-rose-300 border-rose-800 animate-pulse'
                    : 'bg-emerald-950/50 text-emerald-300 border-emerald-800/80'
                }`}
                title={`${v.name} (${v.model}) · ${v.route}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFleetPill"
                    className="absolute inset-0 rounded border-2 border-[var(--accent)] pointer-events-none"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
                  />
                )}
                <span>{v.code || `V${idx + 1}`}</span>
              </button>
            );
          })}
        </div>

        {/* Active vehicle cycle indicator without timeline countdown bar */}
        <div className="mt-2.5 pt-2 border-t border-gray-800/80 flex items-center justify-between gap-2 text-[9px] text-gray-400">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            <span>Auto-Cycling Vehicles ({safeActiveIndex + 1}/{totalVehicles})</span>
          </div>
          <span className="text-[9px] text-emerald-400/90 font-mono">
            Radar Active
          </span>
        </div>
      </div>

      {/* Smoothly Animated Active Vehicle Spotlight Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentVehicle.id || safeActiveIndex}
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="rounded-xl border border-gray-800 bg-[#101626] p-3 sm:p-3.5 mb-3 space-y-2.5"
        >
          {/* Vehicle Identity Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-[var(--accent)] bg-[var(--accent-soft)] px-1.5 py-0.5 rounded border border-[var(--accent)]/30">
                  {currentVehicle.code || `V${safeActiveIndex + 1}`}
                </span>
                <span className="text-xs sm:text-sm font-bold text-white truncate">
                  {currentVehicle.name} · {currentVehicle.model}
                </span>
              </div>
              <div className="text-[10px] text-gray-400 font-sans truncate mt-0.5 flex items-center gap-1">
                <span>{currentVehicle.registration}</span>
                <span>•</span>
                <span className="text-gray-300">{currentVehicle.route}</span>
              </div>
            </div>

            <div
              className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${
                isVehicleStalled
                  ? 'bg-rose-950/60 text-rose-400 border-rose-800'
                  : 'bg-emerald-950/50 text-emerald-400 border-emerald-800'
              }`}
            >
              {isVehicleStalled ? 'YARD STALL (+165M)' : 'DEPARTED / EN ROUTE'}
            </div>
          </div>

          {/* Telemetry Metrics Row */}
          <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
            <div className="p-2 rounded-lg bg-[#0B0F19] border border-gray-800/80 min-w-0">
              <span className="text-[8px] sm:text-[9px] text-gray-500 uppercase block truncate">
                CREW (JSR / SR)
              </span>
              <span className="font-bold text-gray-200 truncate block mt-0.5">
                {currentVehicle.driver.split(' ')[0]} / {currentVehicle.salesRep.split(' ')[0]}
              </span>
            </div>

            <div className="p-2 rounded-lg bg-[#0B0F19] border border-gray-800/80 min-w-0">
              <span className="text-[8px] sm:text-[9px] text-gray-500 uppercase block truncate">
                GATE TIME
              </span>
              <span
                className={`font-bold truncate block mt-0.5 ${
                  isVehicleStalled ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {fixed ? '08:55 AM' : currentVehicle.departureGateTime}
              </span>
            </div>

            <div className="p-2 rounded-lg bg-[#0B0F19] border border-gray-800/80 min-w-0">
              <span className="text-[8px] sm:text-[9px] text-gray-500 uppercase block truncate">
                DELIVERED
              </span>
              <span className="font-bold text-white truncate block mt-0.5 dm-tabular">
                ৳{(currentVehicle.deliveredSales / 1000).toFixed(0)}k
              </span>
            </div>
          </div>

          {/* Drops Progress & Load Meter */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-gray-400">
              <span className="flex items-center gap-1">
                <PackageCheck size={11} className="text-blue-400" />
                <span>Retail Drops Progress</span>
              </span>
              <span className="text-gray-300 font-bold dm-tabular">
                {fixed ? currentVehicle.dropsTarget : currentVehicle.dropsCompleted} /{' '}
                {currentVehicle.dropsTarget} Shops ({Math.round(
                  ((fixed ? currentVehicle.dropsTarget : currentVehicle.dropsCompleted) /
                    currentVehicle.dropsTarget) *
                    100
                )}%)
              </span>
            </div>

            <div className="w-full h-1.5 rounded-full bg-gray-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.round(
                    ((fixed ? currentVehicle.dropsTarget : currentVehicle.dropsCompleted) /
                      currentVehicle.dropsTarget) *
                      100
                  )}%`,
                }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`h-full rounded-full ${
                  isVehicleStalled ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
              />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Root Cause Triage & Simulation Action Trigger */}
      <div
        className={`p-3 rounded-lg border transition-all ${
          fixed
            ? 'bg-emerald-950/20 border-emerald-900/60 text-emerald-300'
            : 'bg-[#18110D] border-amber-900/60 text-amber-200'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-bold truncate">
              {fixed ? (
                <>
                  <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                  <span className="truncate">Thermal Printer Upgrade Simulated</span>
                </>
              ) : (
                <>
                  <AlertTriangle size={13} className="text-amber-400 shrink-0" />
                  <span className="truncate">Root Cause: Dot-Matrix Invoice Jam</span>
                </>
              )}
            </div>
            <p className="text-[10px] sm:text-[11px] text-gray-400 font-sans leading-relaxed">
              {fixed
                ? 'Thermal printer eliminates ribbon jams. 165 minutes saved · ৳4,950 idle crew wage loss recovered.'
                : 'Billing bottleneck holding back vans in depot yard. Burn rate: ৳4,950 lost in idle crew wages today.'}
            </p>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-gray-800/80 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[9px] sm:text-[10px] text-gray-400">
            {fixed ? 'Payback: 2.8 Days' : 'Thermal Unit: ৳3,000'}
          </span>
          <button
            onClick={() => setFixed(!fixed)}
            className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold flex items-center gap-1.5 transition active:scale-95 shadow-sm ${
              fixed
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700'
                : 'bg-amber-500 hover:bg-amber-400 text-black font-bold'
            }`}
          >
            {fixed ? (
              <>
                <RotateCcw size={11} />
                <span>Reset Simulator</span>
              </>
            ) : (
              <>
                <Zap size={11} />
                <span>Simulate Hardware Fix →</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
