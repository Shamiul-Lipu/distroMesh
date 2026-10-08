'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Wallet,
  Truck,
  ShieldCheck,
  Clock,
  Layers,
  Receipt,
  CheckCircle2,
  AlertTriangle,
  Building2,
  ChevronRight,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
  PackageCheck,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { DEFAULT_VEHICLE_FLEET, VehicleTelemetry } from '../../../data/fleetData';

interface HeroCockpitPreviewProps {
  vehicles?: VehicleTelemetry[];
}

const TABS = ['pulse', 'liquidity', 'dispatch', 'settlement'] as const;
type TabType = (typeof TABS)[number];

const SMOOTH_EASE = [0.4, 0, 0.2, 1] as const;
const CINEMATIC_EASE = SMOOTH_EASE;

export const HeroCockpitPreview: React.FC<HeroCockpitPreviewProps> = ({
  vehicles = DEFAULT_VEHICLE_FLEET,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.2 });

  const [activeTab, setActiveTab] = useState<TabType>('pulse');
  const [activeVehicleIndex, setActiveVehicleIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Tab-specific automated states
  const [liquidityStaged, setLiquidityStaged] = useState(false);
  const [settlementResolved, setSettlementResolved] = useState(false);

  // Optimal section dwell time: 5.0s gives 1.5s initial scan + 3.5s for resolved metrics
  const TAB_DURATION_MS = 5000;

  // Viewport-triggered automated cycling through inner subsections (balanced & smooth)
  useEffect(() => {
    if (!isInView || isPaused) return;

    const timer = setInterval(() => {
      setActiveTab((prev) => {
        const nextIndex = (TABS.indexOf(prev) + 1) % TABS.length;
        return TABS[nextIndex];
      });
    }, TAB_DURATION_MS);

    return () => clearInterval(timer);
  }, [isInView, isPaused]);

  // Automated vehicle rotation inside fleet tab & pulse tab
  useEffect(() => {
    if (!isInView || vehicles.length === 0) return;
    const interval = setInterval(() => {
      setActiveVehicleIndex((prev) => (prev + 1) % vehicles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isInView, vehicles.length]);

  // Trigger internal tab animations/functionalities when active tab changes, with clean state resets on exit
  useEffect(() => {
    if (!isInView) return;

    if (activeTab === 'liquidity') {
      const stageTimer = setTimeout(() => setLiquidityStaged(true), 1400);
      return () => {
        clearTimeout(stageTimer);
        setLiquidityStaged(false);
      };
    }

    if (activeTab === 'settlement') {
      const resolveTimer = setTimeout(() => setSettlementResolved(true), 1400);
      return () => {
        clearTimeout(resolveTimer);
        setSettlementResolved(false);
      };
    }
  }, [activeTab, isInView]);

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
    setIsPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    // Resume auto-cycle after 8s of user inactivity
    pauseTimeoutRef.current = setTimeout(() => setIsPaused(false), 8000);
  };

  const totalVehicles = vehicles.length;
  const currentVehicle = vehicles[activeVehicleIndex % (totalVehicles || 1)] || vehicles[0];
  const stalledCount = vehicles.filter((v) => v.status === 'stalled').length;

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="w-full max-w-full bg-[#080B12] text-white p-3 sm:p-5 font-mono select-none overflow-hidden relative"
    >
      {/* Top Cockpit Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 mb-3.5 border-b border-[#1F2937]">
        {/* Breadcrumb / Title */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-6 w-6 rounded-md bg-[var(--accent)] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
            dM
          </div>
          <span className="text-xs font-bold text-gray-200 truncate">
            M/S Popy Traders
          </span>
          <span className="text-gray-500 shrink-0">/</span>
          <span className="text-xs text-[var(--accent)] font-semibold truncate hidden xs:inline">
            Executive War Room
          </span>
        </div>

        {/* Self-Running Interactive Mode Switcher with smooth sliding pill */}
        <div className="flex items-center gap-1 bg-[#111827] p-1 rounded-lg border border-gray-800 text-[10px] overflow-x-auto no-scrollbar shrink-0 self-start sm:self-auto max-w-full">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            const labels: Record<TabType, string> = {
              pulse: 'Live Pulse',
              liquidity: 'Cash Runway',
              dispatch: `Fleet (${totalVehicles})`,
              settlement: 'Till Audit',
            };

            return (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`relative px-2.5 py-1 rounded-md font-bold whitespace-nowrap transition-colors z-10 ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="heroActiveTabPill"
                    className="absolute inset-0 rounded-md bg-[var(--accent)] shadow-xs pointer-events-none"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
                  />
                )}
                <span className="relative z-10">{labels[tab]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 Primary Executive KPI Cards - Exactly 1 Card Highlighted per Active Tab */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-3.5">
        {/* Card 1: Territory Pulse (Selected ONLY when activeTab === 'pulse') */}
        <div
          className={`p-2.5 sm:p-3 rounded-xl border transition-all duration-300 min-w-0 ${
            activeTab === 'pulse'
              ? 'bg-[#10182C] border-blue-600/60 shadow-md ring-1 ring-blue-500/30'
              : 'bg-[#0E1322] border-gray-800 hover:border-gray-700'
          }`}
        >
          <div className="flex items-center justify-between text-gray-400 text-[9px] sm:text-[10px]">
            <span className="uppercase tracking-wider truncate">Territory Pulse</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          </div>
          <div className="text-sm sm:text-lg font-bold text-white mt-1 dm-tabular truncate">
            ৳12,77,000
          </div>
          <div className="text-[9px] sm:text-[10px] text-emerald-400 mt-0.5 truncate flex items-center gap-1">
            <Sparkles size={11} className="shrink-0" />
            <span className="truncate">700 Retail Stores Active</span>
          </div>
        </div>

        {/* Card 2: 48h Auto-Debit / Cash Runway (Selected ONLY when activeTab === 'liquidity') */}
        <div
          className={`p-2.5 sm:p-3 rounded-xl border transition-all duration-300 min-w-0 ${
            activeTab === 'liquidity'
              ? 'bg-[#10182C] border-blue-600/60 shadow-md ring-1 ring-blue-500/30'
              : 'bg-[#0E1322] border-gray-800 hover:border-gray-700'
          }`}
        >
          <div className="flex items-center justify-between text-gray-400 text-[9px] sm:text-[10px]">
            <span className="uppercase tracking-wider truncate">48h Auto-Debit</span>
            <Clock size={11} className="text-amber-400 shrink-0" />
          </div>
          <div className="text-sm sm:text-lg font-bold text-amber-400 mt-1 dm-tabular truncate">
            ৳20,70,000
          </div>
          <div className="text-[9px] sm:text-[10px] text-emerald-400 mt-0.5 truncate flex items-center gap-1">
            <ShieldCheck size={11} className="shrink-0" />
            <span className="truncate">
              {liquidityStaged ? '✓ 2.81× Protected' : '2.17× Safe Cover (৳16.95L Liquid)'}
            </span>
          </div>
        </div>

        {/* Card 3: Fleet Dispatch (Selected ONLY when activeTab === 'dispatch') */}
        <div
          className={`p-2.5 sm:p-3 rounded-xl border transition-all duration-300 min-w-0 ${
            activeTab === 'dispatch'
              ? 'bg-[#10182C] border-blue-600/60 shadow-md ring-1 ring-blue-500/30'
              : 'bg-[#0E1322] border-gray-800 hover:border-gray-700'
          }`}
        >
          <div className="flex items-center justify-between text-gray-400 text-[9px] sm:text-[10px]">
            <span className="uppercase tracking-wider truncate">Fleet Dispatch</span>
            <Truck size={11} className="text-blue-400 shrink-0" />
          </div>
          <div className="text-sm sm:text-lg font-bold text-white mt-1 dm-tabular truncate">
            {totalVehicles} Vehicles
          </div>
          <div className="text-[9px] sm:text-[10px] text-rose-400 mt-0.5 truncate">
            {stalledCount > 0 ? `+165m (${stalledCount} stalled)` : 'All Departed'}
          </div>
        </div>

        {/* Card 4: Till Variance (Selected ONLY when activeTab === 'settlement') */}
        <div
          className={`p-2.5 sm:p-3 rounded-xl border transition-all duration-300 min-w-0 ${
            activeTab === 'settlement'
              ? 'bg-[#10182C] border-blue-600/60 shadow-md ring-1 ring-blue-500/30'
              : 'bg-[#0E1322] border-gray-800 hover:border-gray-700'
          }`}
        >
          <div className="flex items-center justify-between text-gray-400 text-[9px] sm:text-[10px]">
            <span className="uppercase tracking-wider truncate">Till Variance</span>
            <Receipt size={11} className="text-purple-400 shrink-0" />
          </div>
          <div
            className={`text-sm sm:text-lg font-bold mt-1 dm-tabular truncate transition-colors ${
              settlementResolved ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {settlementResolved ? '৳0.00' : '−৳400'}
          </div>
          <div
            className={`text-[9px] sm:text-[10px] mt-0.5 truncate ${
              settlementResolved ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {settlementResolved ? '✓ Balanced' : 'Route #3 Discrepancy'}
          </div>
        </div>
      </div>

      {/* Interactive Main Body depending on Tab with AnimatePresence */}
      <AnimatePresence mode="wait">
        {activeTab === 'pulse' && (
          <motion.div
            key="pulse"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: CINEMATIC_EASE }}
            className="rounded-xl border border-gray-800 bg-[#0B0F19] p-3 sm:p-3.5 space-y-3"
          >
            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 text-xs text-gray-300">
              <span className="font-bold flex items-center gap-1.5 truncate">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                <span className="truncate">Live Territory Stream · {totalVehicles} Beats</span>
              </span>
              <span className="text-[10px] text-gray-400 shrink-0">700 Grocery Stores Active</span>
            </div>

            {/* Micro Route Table with automatic vehicle spotlight rotation */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
              {/* Rotating Spotlight Route */}
              <div className="p-2.5 rounded-lg bg-[#111827] border border-[var(--accent)]/50 relative overflow-hidden min-w-0 transition-all">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-bold text-white truncate flex items-center gap-1">
                      <span className="text-[9px] text-[var(--accent)] bg-[var(--accent-soft)] px-1 rounded">
                        {currentVehicle.code}
                      </span>
                      <span className="truncate">{currentVehicle.route}</span>
                    </div>
                    <div className="text-[10px] text-gray-400 truncate mt-0.5">
                      Driver: {currentVehicle.driver.split(' ')[0]} · {currentVehicle.dropsCompleted}/{currentVehicle.dropsTarget} drops
                    </div>
                  </div>
                  <span className="text-emerald-400 font-bold text-xs shrink-0 dm-tabular">
                    ৳{(currentVehicle.deliveredSales / 100000).toFixed(2)}L
                  </span>
                </div>
              </div>

              {/* Sample Route 2 */}
              <div className="p-2.5 rounded-lg bg-[#111827] border border-gray-800 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-bold text-white truncate">Van #02 · Nakla Upazila</div>
                    <div className="text-[10px] text-gray-400 truncate mt-0.5">Driver: Jahangir · 64 drops</div>
                  </div>
                  <span className="text-emerald-400 font-bold text-xs shrink-0 dm-tabular">৳3.92L</span>
                </div>
              </div>

              {/* Sample Route 3 (Flagged Till Variance) */}
              <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-900/60 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-bold text-rose-300 truncate">Van #03 · Town Central</div>
                    <div className="text-[10px] text-rose-400 truncate mt-0.5">Driver: Babul · 72 drops</div>
                  </div>
                  <span className="text-rose-400 font-bold text-xs shrink-0 dm-tabular">−৳400 Short</span>
                </div>
              </div>
            </div>

            {/* Action Ticker */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] pt-1 text-gray-400">
              <span className="truncate">Auto-cycling live stream across all 12 beats</span>
              <Link
                href="/businesses/unilever-distribution/war-room"
                className="text-[var(--accent)] hover:underline font-bold flex items-center gap-1 shrink-0"
              >
                <span>Open Full Cockpit</span>
                <ChevronRight size={12} />
              </Link>
            </div>
          </motion.div>
        )}

        {activeTab === 'liquidity' && (
          <motion.div
            key="liquidity"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: CINEMATIC_EASE }}
            className="rounded-xl border border-gray-800 bg-[#0B0F19] p-3 sm:p-3.5 space-y-3"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-300 font-bold">Principal 48h Auto-Debit Liquidity Buffer</span>
              <span className="text-emerald-400 font-bold text-[10px] bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/60">
                {liquidityStaged ? '✓ ৳5.0L VAULT CASH STAGED TO BANK' : 'PREPARING BANK BUFFER'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="p-2.5 sm:p-3 rounded-lg bg-[#111827] border border-gray-800 min-w-0">
                <div className="text-[9px] sm:text-[10px] text-gray-400 truncate">Clearing Bank Account</div>
                <div className="text-base sm:text-lg font-bold text-white mt-0.5 truncate dm-tabular">
                  {liquidityStaged ? '৳13,00,000' : '৳8,00,000'}
                </div>
                <div className="text-[9px] sm:text-[10px] text-emerald-400 mt-1 truncate">
                  {liquidityStaged ? '✓ Ready for 48h debit cutoff' : 'Pre-cutoff balance'}
                </div>
              </div>
              <div className="p-2.5 sm:p-3 rounded-lg bg-[#111827] border border-gray-800 min-w-0">
                <div className="text-[9px] sm:text-[10px] text-gray-400 truncate">Physical Vault Safe</div>
                <div className="text-base sm:text-lg font-bold text-amber-400 mt-0.5 truncate dm-tabular">
                  {liquidityStaged ? '৳3,95,200' : '৳8,95,200'}
                </div>
                <div className="text-[9px] sm:text-[10px] text-gray-400 mt-1 truncate">
                  Cash in depot safe
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'dispatch' && (
          <motion.div
            key="dispatch"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: CINEMATIC_EASE }}
            className="rounded-xl border border-gray-800 bg-[#0B0F19] p-3 sm:p-3.5 space-y-2.5"
          >
            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 text-xs">
              <span className="text-gray-300 font-bold truncate">
                Fleet Radar · {totalVehicles} Delivery Beats
              </span>
              <span className="text-rose-400 font-bold text-[10px] bg-rose-950/40 px-2 py-0.5 rounded border border-rose-900/60 shrink-0 self-start xs:self-auto">
                {stalledCount > 0 ? `+165m Delay · ${stalledCount} Stalls` : 'All On-Time'}
              </span>
            </div>

            {/* Dynamic Fleet Strip supporting ANY number of vehicles */}
            <div className="flex flex-wrap gap-1 sm:gap-1.5 pt-1">
              {vehicles.map((v, i) => {
                const isLate = v.status === 'stalled';
                const isCurrent = i === activeVehicleIndex % totalVehicles;

                return (
                  <button
                    key={v.id || i}
                    onClick={() => setActiveVehicleIndex(i)}
                    className={`px-2 py-1 rounded text-[9px] sm:text-[10px] font-bold border transition-all ${
                      isCurrent
                        ? 'ring-2 ring-[var(--accent)] scale-105 z-10'
                        : 'opacity-85 hover:opacity-100'
                    }`}
                  >
                    <span
                      className={
                        isLate
                          ? 'bg-rose-950/60 text-rose-300'
                          : 'bg-emerald-950/40 text-emerald-300'
                      }
                    >
                      {v.code || `V${i + 1}`}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick telemetry for active vehicle */}
            <div className="text-[10px] text-gray-400 font-sans flex items-center justify-between pt-1">
              <span className="text-gray-300 font-mono font-bold truncate">
                Active: {currentVehicle.name} ({currentVehicle.model}) · {currentVehicle.route}
              </span>
              <span className="text-emerald-400 font-mono font-bold shrink-0 ml-2">
                {currentVehicle.dropsCompleted}/{currentVehicle.dropsTarget} Drops
              </span>
            </div>
          </motion.div>
        )}

        {activeTab === 'settlement' && (
          <motion.div
            key="settlement"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: CINEMATIC_EASE }}
            className="rounded-xl border border-gray-800 bg-[#0B0F19] p-3 sm:p-3.5 space-y-3"
          >
            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 text-xs">
              <span className="text-gray-300 font-bold truncate">
                Dusk Till Window · Van #3 (Driver: Babul)
              </span>
              <span
                className={`font-bold text-[10px] px-2 py-0.5 rounded border shrink-0 self-start xs:self-auto ${
                  settlementResolved
                    ? 'text-emerald-400 bg-emerald-950/40 border-emerald-900/60'
                    : 'text-rose-400 bg-rose-950/40 border-rose-900/60 animate-pulse'
                }`}
              >
                {settlementResolved ? '✓ VARIANCE BALANCED TO ZERO' : 'Variance: −৳400 Detected'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center text-xs">
              <div className="p-2 rounded bg-[#111827] border border-gray-800 min-w-0">
                <span className="text-[8px] sm:text-[9px] text-gray-400 block truncate">EXPECTED</span>
                <span className="font-bold text-white truncate block mt-0.5 text-xs sm:text-sm">৳4,43,000</span>
              </div>
              <div className="p-2 rounded bg-[#111827] border border-gray-800 min-w-0">
                <span className="text-[8px] sm:text-[9px] text-gray-400 block truncate">COUNTED</span>
                <span className="font-bold text-gray-200 truncate block mt-0.5 text-xs sm:text-sm">
                  {settlementResolved ? '৳4,43,000' : '৳4,42,600'}
                </span>
              </div>
              <div
                className={`p-2 rounded border min-w-0 ${
                  settlementResolved
                    ? 'bg-emerald-950/30 border-emerald-900/60'
                    : 'bg-rose-950/30 border-rose-900/60'
                }`}
              >
                <span className="text-[8px] sm:text-[9px] text-gray-400 block truncate">DISCREPANCY</span>
                <span
                  className={`font-bold truncate block mt-0.5 text-xs sm:text-sm ${
                    settlementResolved ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {settlementResolved ? '৳0.00' : '−৳400'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
