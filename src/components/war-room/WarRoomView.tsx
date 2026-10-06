'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useExecutive } from '../../context/ExecutiveContext';
import { AsOf } from './AsOf';
import { ActionModals } from './ActionModals';
import {
  deriveLiquidityStatus,
  deriveDispatchMetrics,
  deriveMispickLoss,
  deriveReceivablesAgeing,
  deriveBusinessKPISet,
  deriveOperatingMode,
} from '../../utils/derivedRules';
import {
  formatBDT,
  formatVariance,
  formatPercent,
  formatTakaNumber,
  banglaTerms,
} from '../../utils/formatters';
import {
  popyTodaySnapshot,
  popyFieldBase,
  top10OverdueRetailers,
} from '../../data/seedData';
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileCheck2,
  Lock,
  Monitor,
  Printer,
  Scale,
  Search,
  ShieldAlert,
  ShieldCheck,
  Store,
  Tablet,
  Truck,
  Tv,
  Wallet,
  X,
  Zap,
} from 'lucide-react';
import { UserRole, WarRoomTier, RouteData } from '../../types/executive';

// Seeded retail shop generator for route invoice drill-down
interface ShopInvoiceDrop {
  invoiceNo: string;
  shopName: string;
  marketPoint: string;
  units: number;
  orderValue: number;
  cashPaid: number;
  creditDue: number;
  deliveryTime: string;
  receiptStatus: 'PAID_IN_FULL' | 'PARTIAL_CREDIT' | 'CREDIT_TERMS';
}

const shopNamesSeed = [
  'Bhai Bhai General Store',
  'Janata Mudir Dokan',
  'Al-Madina Departmental',
  'Sarker Grocery Corner',
  'Mayer Doa Store',
  'Bismillah Variety Store',
  'Bhabanipur Central Store',
  'Haji & Sons Confectionery',
  'Rabbani Mini Mart',
  'Green Grocery & Stationers',
];

const generateRouteShops = (route: RouteData): ShopInvoiceDrop[] => {
  const dropsCount = 10;
  const avgOrder = Math.round(route.deliveredSales / dropsCount);
  const creditRatio = route.deliveredSales > 0 ? route.creditSales / route.deliveredSales : 0;

  return shopNamesSeed.map((name, i) => {
    const isCreditHeavy = i % 3 === 0;
    const invValue = i === dropsCount - 1
      ? route.deliveredSales - avgOrder * (dropsCount - 1)
      : Math.round(avgOrder * (0.85 + (i % 4) * 0.1));
    const creditDue = isCreditHeavy
      ? Math.round(invValue * Math.min(0.9, creditRatio * 1.8))
      : Math.round(invValue * Math.max(0.05, creditRatio * 0.4));
    const cashPaid = Math.max(0, invValue - creditDue);

    const hour = 11 + Math.floor(i / 2);
    const minute = (i * 14) % 60;
    const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

    return {
      invoiceNo: `INV-${route.vanNumber.replace(/\D/g, '') || '01'}-${String(100 + i)}`,
      shopName: name,
      marketPoint: route.routeName.split('-')[1]?.trim() || route.territory,
      units: Math.round(invValue / 120),
      orderValue: invValue,
      cashPaid,
      creditDue,
      deliveryTime: timeStr,
      receiptStatus: creditDue === 0 ? 'PAID_IN_FULL' : cashPaid === 0 ? 'CREDIT_TERMS' : 'PARTIAL_CREDIT',
    };
  });
};

export const WarRoomView: React.FC<{ businessSlug?: string }> = ({ businessSlug = 'unilever-distribution' }) => {
  const {
    state,
    setWarRoomTier,
    setUserRole,
    toggleWakeLock,
    toggleBanglaMode,
    openModal,
    openDrawer,
    resetSimulation,
  } = useExecutive();

  const [darkMode, setDarkMode] = useState(true);
  const [burnInSafe, setBurnInSafe] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [routeSearchQuery, setRouteSearchQuery] = useState('');
  const [routeStatusFilter, setRouteStatusFilter] = useState<'ALL' | 'ACTION' | 'REVIEW' | 'OK'>('ALL');
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  // Auto-detect tier on mount/resize if not manually forced
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1920 && state.warRoomTier === 'wall') {
        // keep wall mode if selected
      } else if (window.innerWidth >= 768 && window.innerWidth < 1280) {
        if (state.warRoomTier !== 'ipad') setWarRoomTier('ipad');
      } else if (window.innerWidth >= 1280 && state.warRoomTier === 'ipad') {
        setWarRoomTier('desktop');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setWarRoomTier, state.warRoomTier]);

  // Derived Financial & Operational Metrics
  const liquidity = deriveLiquidityStatus({
    bankAfterDebit: state.bankCash,
    vaultCash: state.vaultCash,
    next7DayObligations: popyTodaySnapshot.next7DayObligations,
  });

  const dispatch = deriveDispatchMetrics({
    targetTime: state.dispatchTarget,
    actualTime: state.dispatchActual,
    delayMinutes: state.dispatchDelayMinutes,
    vansDispatched: 12,
    crewDailyWage: 1200,
  });

  const mispick = deriveMispickLoss();
  const receivables = deriveReceivablesAgeing();
  const kpis = deriveBusinessKPISet();
  const opMode = deriveOperatingMode(new Date(), liquidity.status === 'CRITICAL');
  const totalInvoices = state.routes?.reduce((acc, r) => acc + (r.invoicesCount || 0), 0) || popyTodaySnapshot.dailyInvoices;
  const totalUnits = state.routes?.reduce((acc, r) => acc + (r.unitsDelivered || 0), 0) || popyFieldBase.dailyUnits;

  const b = (term: string) => (state.banglaMode ? (banglaTerms[term] ?? term) : term);

  // Filtered Routes
  const filteredRoutes = useMemo(() => {
    return state.routes.filter((route) => {
      const matchesSearch = !routeSearchQuery.trim()
        || route.routeName.toLowerCase().includes(routeSearchQuery.toLowerCase())
        || route.vanNumber.toLowerCase().includes(routeSearchQuery.toLowerCase())
        || route.jsrName.toLowerCase().includes(routeSearchQuery.toLowerCase())
        || route.srName.toLowerCase().includes(routeSearchQuery.toLowerCase())
        || route.territory.toLowerCase().includes(routeSearchQuery.toLowerCase());

      const matchesStatus = routeStatusFilter === 'ALL' || route.status === routeStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [state.routes, routeSearchQuery, routeStatusFilter]);

  // Selected route for drilldown
  const selectedRoute = useMemo(() => {
    return state.routes.find((r) => r.id === selectedRouteId) || null;
  }, [state.routes, selectedRouteId]);

  const selectedRouteShops = useMemo(() => {
    if (!selectedRoute) return [];
    return generateRouteShops(selectedRoute);
  }, [selectedRoute]);

  // Table Totals
  const totals = useMemo(() => {
    return state.routes.reduce(
      (acc, r) => ({
        deliveredSales: acc.deliveredSales + r.deliveredSales,
        cashSales: acc.cashSales + r.cashSales,
        creditSales: acc.creditSales + r.creditSales,
        oldDuesCollected: acc.oldDuesCollected + r.oldDuesCollected,
        cashExpenses: acc.cashExpenses + r.cashExpenses,
        cashHandedIn: acc.cashHandedIn + r.cashHandedIn,
        expectedTill: acc.expectedTill + r.expectedTill,
        countedTill: acc.countedTill + r.countedTill,
        variance: acc.variance + r.variance,
      }),
      {
        deliveredSales: 0,
        cashSales: 0,
        creditSales: 0,
        oldDuesCollected: 0,
        cashExpenses: 0,
        cashHandedIn: 0,
        expectedTill: 0,
        countedTill: 0,
        variance: 0,
      }
    );
  }, [state.routes]);

  // Role permissions
  const canCloseDay = state.currentRole === 'Owner';
  const canLockCredit = state.currentRole === 'Owner' || state.currentRole === 'Manager';
  const canDepositBank = state.currentRole !== 'Viewer';
  const canHandleShortage = state.currentRole !== 'Viewer';

  const actionTooltip = (allowed: boolean) =>
    allowed ? '' : `Action restricted for role: ${state.currentRole}. Requires supervisor elevation.`;

  return (
    <div
      className={`min-h-screen text-slate-100 transition-colors duration-200 font-sans ${
        darkMode ? 'bg-[#0B0F17]' : 'bg-[#F4F6F9] text-slate-900'
      } ${burnInSafe ? 'animate-burn-in-drift' : ''}`}
    >
      {/* 1. TOP INSTITUTIONAL COMMAND BAR */}
      <header
        className={`sticky top-0 z-40 border-b px-4 py-2.5 backdrop-blur-md transition-colors ${
          darkMode ? 'border-[#1E293B] bg-[#0F172A]/90' : 'border-slate-200 bg-white/95 text-slate-800'
        }`}
      >
        <div className="mx-auto flex flex-wrap items-center justify-between gap-3 max-w-[1920px]">
          {/* Brand & Context */}
          <div className="flex items-center gap-3">
            <Link
              href={`/businesses/${businessSlug}/overview`}
              className={`flex items-center gap-2 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                darkMode ? 'text-emerald-400 hover:bg-slate-800' : 'text-emerald-700 hover:bg-slate-100'
              }`}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <Activity size={15} />
              </span>
              <span className="font-bold tracking-tight">distroMesh</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="font-bold text-slate-200">{b('War Room')}</span>
            </Link>

            <span className="hidden sm:inline-block h-3.5 w-px bg-slate-700" />

            <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
              <span className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                M/S Popy Traders
              </span>
              <span className="text-[11px] text-slate-400">· Sherpur &amp; Bogura Hubs</span>
              <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                FMCG RD
              </span>
            </div>
          </div>

          {/* Center Clock & Operational Schedule */}
          <div className="hidden lg:flex items-center gap-3">
            <AsOf scope="Company-wide" period="Today" bangla={state.banglaMode} />

            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium ${
                opMode.isCriticalOverlay
                  ? 'bg-rose-950/70 text-rose-300 border border-rose-800/80 animate-pulse'
                  : darkMode
                  ? 'bg-slate-800 text-slate-300 border border-slate-700'
                  : 'bg-slate-100 text-slate-700 border border-slate-300'
              }`}
            >
              <Clock size={12} className="text-slate-400" />
              <span>{opMode.phaseLabel} ({opMode.timeWindow})</span>
            </div>
          </div>

          {/* Right Toolbar Controls */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            {/* Viewport Tier Switcher */}
            <div
              className={`flex rounded-lg p-0.5 border ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-300'
              }`}
            >
              {[
                { id: 'desktop', label: 'Deck', icon: Monitor },
                { id: 'ipad', label: 'Field', icon: Tablet },
                { id: 'wall', label: 'Wall 4K', icon: Tv },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setWarRoomTier(id as WarRoomTier)}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition ${
                    state.warRoomTier === id
                      ? darkMode
                        ? 'bg-slate-800 text-emerald-400 shadow-sm font-bold'
                        : 'bg-white text-slate-900 shadow-sm font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title={`Switch to ${label} mode`}
                >
                  <Icon size={12} />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Role Model Switcher (Defect E3) */}
            <div className="relative">
              <select
                value={state.currentRole}
                onChange={(e) => setUserRole(e.target.value as UserRole)}
                className={`rounded-lg border px-2 py-1 text-[11px] font-mono font-semibold transition focus:outline-none ${
                  darkMode
                    ? 'bg-slate-900 border-slate-800 text-slate-200'
                    : 'bg-white border-slate-300 text-slate-800'
                }`}
                title="Active Permission Level (Role Model)"
              >
                <option value="Owner">Role: Owner</option>
                <option value="Manager">Role: Manager</option>
                <option value="Cashier">Role: Cashier</option>
                <option value="Viewer">Role: Viewer (Read-only)</option>
              </select>
            </div>

            {/* Bangla Numeral & Label Toggle */}
            <button
              onClick={toggleBanglaMode}
              className={`rounded-lg border px-2 py-1 text-[11px] font-semibold transition ${
                state.banglaMode
                  ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                  : darkMode
                  ? 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                  : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
              }`}
              title="Toggle Bangla numerals and labels"
            >
              {state.banglaMode ? 'বাংলা ON' : 'BN'}
            </button>

            {/* Screen Wake Lock (Defect D5) */}
            <button
              onClick={toggleWakeLock}
              className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] transition ${
                state.wakeLockActive
                  ? 'border-amber-500 bg-amber-500/20 text-amber-300 font-bold'
                  : darkMode
                  ? 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                  : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
              }`}
              title="Screen Wake Lock (prevents display sleep during depot monitoring)"
            >
              <Zap size={11} className={state.wakeLockActive ? 'text-amber-400' : 'text-slate-500'} />
              <span className="hidden sm:inline">{state.wakeLockActive ? 'Lock ON' : 'WakeLock'}</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`rounded-lg border px-2 py-1 text-[11px] transition ${
                darkMode
                  ? 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
              title="Toggle Dark / Light theme"
            >
              {darkMode ? 'Light' : 'Dark'}
            </button>

            {/* Simulation Drawer Button */}
            <button
              onClick={() => openDrawer('SIMULATION')}
              className="rounded-lg bg-emerald-600/90 hover:bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm transition"
            >
              Simulate
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN EXECUTIVE DASHBOARD CANVAS */}
      <main className="mx-auto max-w-[1920px] p-3 sm:p-4 lg:p-5 space-y-4 pb-24">
        {/* =========================================================================
            WALL (4K) TIER: Strictly 7 high-contrast headline tiles (Section 7)
            ========================================================================= */}
        {state.warRoomTier === 'wall' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-mono text-slate-400">
              <span className="font-bold tracking-wider text-slate-300 uppercase flex items-center gap-2">
                <Tv size={14} className="text-emerald-400" />
                Wall Display Mode (4K Operational Screen · 10–15 Ft View)
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setBurnInSafe(!burnInSafe)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                    burnInSafe ? 'border-purple-400 bg-purple-500/20 text-purple-300 font-bold' : 'border-slate-700 text-slate-400'
                  }`}
                >
                  {burnInSafe ? 'Burn-In Shield Active' : 'Enable Burn-In Drift'}
                </button>
                <span>7 Core Control Tiles · Exact BDT</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Tile 1: Liquid Cash & Status */}
              <div className="rounded-xl border border-slate-800 bg-[#111827] p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                      1. {b('Liquid Cash')}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                        liquidity.status === 'SAFE'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : liquidity.status === 'WATCH'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {liquidity.status === 'SAFE' ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                      <span>{b(liquidity.status)}</span>
                    </span>
                  </div>
                  <div className="text-3xl font-mono font-bold text-white tracking-tight">
                    {formatBDT(state.bankCash + state.vaultCash, { mode: 'exact', bangla: state.banglaMode })}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-mono text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>{b('Bank Cash')}:</span>
                    <strong className="text-slate-200">{formatBDT(state.bankCash, { mode: 'exact', bangla: state.banglaMode })}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{b('Vault / Till Cash')}:</span>
                    <strong className="text-slate-200">{formatBDT(state.vaultCash, { mode: 'exact', bangla: state.banglaMode })}</strong>
                  </div>
                </div>
              </div>

              {/* Tile 2: Principal Auto-Debit Countdown */}
              <div className="rounded-xl border border-slate-800 bg-[#111827] p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                      2. {b('Principal Auto-Debit')}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full text-xs font-bold font-mono">
                      <Clock size={11} />
                      <span>{b('Due in')} {state.obligationDueHours}h</span>
                    </span>
                  </div>
                  <div className="text-3xl font-mono font-bold text-amber-400 tracking-tight">
                    {formatBDT(state.upcomingObligation, { mode: 'exact', bangla: state.banglaMode })}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-mono text-slate-400 flex justify-between">
                  <span>7-Day Obligations Cover:</span>
                  <strong className="text-slate-200">{liquidity.coverage}× (Bank: {liquidity.bankOnlyCoverage}×)</strong>
                </div>
              </div>

              {/* Tile 3: Fleet Dispatch Delay */}
              <div className="rounded-xl border border-slate-800 bg-[#111827] p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                      3. {b('Dispatch Status')}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold font-mono ${
                        dispatch.status === 'ON_TIME'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      <AlertOctagon size={11} />
                      <span>{b(dispatch.statusLabel)}</span>
                    </span>
                  </div>
                  <div className="text-3xl font-mono font-bold text-rose-400 tracking-tight">
                    +{state.dispatchDelayMinutes} min Late
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-mono text-slate-400 flex justify-between">
                  <span>12 Vans Lost Runtime:</span>
                  <strong className="text-slate-200">{dispatch.vanMinutesLost} van-min (৳{dispatch.idleCrewCost.toLocaleString('en-IN')})</strong>
                </div>
              </div>

              {/* Tile 4: Cash Variance */}
              <div className="rounded-xl border border-slate-800 bg-[#111827] p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                      4. {b('Cash Variance')}
                    </span>
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full text-xs font-bold font-mono">
                      Van #3
                    </span>
                  </div>
                  <div className="text-3xl font-mono font-bold text-amber-400 tracking-tight">
                    {formatVariance(state.cashVariance, state.banglaMode)}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-mono text-slate-400 flex justify-between">
                  <span>Expected: {formatBDT(state.reconciliationExpected)}</span>
                  <span>Counted: {formatBDT(state.reconciliationCounted)}</span>
                </div>
              </div>

              {/* Tile 5: Credit Share Today */}
              <div className="rounded-xl border border-slate-800 bg-[#111827] p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                      5. {b('Credit Share')}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">Policy Ceiling: 45.0%</span>
                  </div>
                  <div className="text-3xl font-mono font-bold text-slate-200 tracking-tight">
                    {formatPercent((state.freshCredit / state.todaySales) * 100, 1, state.banglaMode)}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-mono text-slate-400 flex justify-between">
                  <span>Cash: {formatBDT(popyTodaySnapshot.cashSales, { mode: 'summary' })}</span>
                  <span>Credit: {formatBDT(state.freshCredit, { mode: 'summary' })}</span>
                </div>
              </div>

              {/* Tile 6: Overdue > 30 Days */}
              <div className="rounded-xl border border-slate-800 bg-[#111827] p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                      6. {b('Overdue > 30 Days')}
                    </span>
                    <span className="text-xs font-mono text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded font-bold">
                      {receivables.overdue30PlusPercent}%
                    </span>
                  </div>
                  <div className="text-3xl font-mono font-bold text-slate-200 tracking-tight">
                    {formatBDT(receivables.totalOverdue30Plus, { mode: 'summary', bangla: state.banglaMode })}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-mono text-slate-400 flex justify-between">
                  <span>Total Receivables:</span>
                  <strong className="text-slate-200">{formatBDT(state.workingCapital.receivables, { mode: 'summary' })}</strong>
                </div>
              </div>

              {/* Tile 7: Top Critical Operational Exception */}
              <div className="rounded-xl border border-rose-900/60 bg-rose-950/20 p-5 shadow-lg flex flex-col justify-between lg:col-span-2">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                      <AlertOctagon size={14} /> 7. {b('Active Exception')}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      HIGH URGENCY
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100 leading-snug">
                    {state.alerts[1]?.title || 'Epson LQ-310 Dot-Matrix Failure'}
                  </h3>
                  <p className="mt-1 text-xs font-mono text-slate-300 leading-relaxed">
                    {state.alerts[1]?.whatHappened || 'Billing desk printer hardware breakdown stalled morning dispatch.'}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-rose-900/40 flex items-center justify-between text-xs font-mono">
                  <span className="text-rose-300 font-semibold">Avoidable Loss: ৳1,078/day</span>
                  <button
                    onClick={() => openDrawer('INCIDENT')}
                    className="px-3.5 py-1.5 bg-rose-700 hover:bg-rose-600 text-white font-bold rounded-lg transition"
                  >
                    Inspect Incident &amp; Payback
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            DESKTOP & IPAD TIERS: Professional, dense financial command center
            ========================================================================= */}
        {(state.warRoomTier === 'desktop' || state.warRoomTier === 'ipad') && (
          <div className="space-y-4">
            {/* TOP 6-KPI EXECUTIVE COMMAND STRIP */}
            <section
              aria-label="Executive financial health"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5"
            >
              {/* Card 1: Liquid Cash */}
              <div
                className={`rounded-xl border p-3.5 shadow-sm transition flex flex-col justify-between ${
                  darkMode ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    {b('Liquid Cash')}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                      liquidity.status === 'SAFE'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : liquidity.status === 'WATCH'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {liquidity.status === 'SAFE' ? <ShieldCheck size={10} /> : <ShieldAlert size={10} />}
                    <span>{b(liquidity.status)}</span>
                  </span>
                </div>
                <div className="my-1.5 text-xl font-mono font-bold tracking-tight text-white">
                  {formatBDT(state.bankCash + state.vaultCash, { mode: 'exact', bangla: state.banglaMode })}
                </div>
                <div className="text-[10px] font-mono text-slate-400 pt-1.5 border-t border-slate-800/80 space-y-0.5">
                  <div className="flex justify-between">
                    <span>Bank:</span>
                    <strong className="text-slate-300 font-normal">{formatBDT(state.bankCash, { mode: 'exact', bangla: state.banglaMode })}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Vault (Till):</span>
                    <strong className="text-slate-300 font-normal">{formatBDT(state.vaultCash, { mode: 'exact', bangla: state.banglaMode })}</strong>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-semibold pt-0.5">
                    <span>Coverage:</span>
                    <span>{liquidity.coverage}× (Bank: {liquidity.bankOnlyCoverage}×)</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Auto-Debit */}
              <div
                className={`rounded-xl border p-3.5 shadow-sm transition flex flex-col justify-between ${
                  darkMode ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Principal Debit
                  </span>
                  <span className="inline-flex items-center gap-1 bg-amber-500/15 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono">
                    <Clock size={9} />
                    <span>{state.obligationDueHours}h Left</span>
                  </span>
                </div>
                <div className="my-1.5 text-xl font-mono font-bold tracking-tight text-amber-400">
                  {formatBDT(state.upcomingObligation, { mode: 'exact', bangla: state.banglaMode })}
                </div>
                <div className="text-[10px] font-mono text-slate-400 pt-1.5 border-t border-slate-800/80 space-y-0.5">
                  <div className="flex justify-between">
                    <span>Post-Debit Bank:</span>
                    <strong className="text-slate-300 font-normal">৳8,00,000</strong>
                  </div>
                  <div className="flex justify-between text-amber-300">
                    <span>Transit Deposit:</span>
                    <strong className="font-semibold">+৳8,00,000 tonight</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Overdraft APR:</span>
                    <span>12.0%</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Today's Delivered Sales */}
              <div
                className={`rounded-xl border p-3.5 shadow-sm transition flex flex-col justify-between ${
                  darkMode ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Delivered Sales
                  </span>
                  <span className="bg-blue-500/15 text-blue-300 border border-blue-500/30 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono">
                    Accrual
                  </span>
                </div>
                <div className="my-1.5 text-xl font-mono font-bold tracking-tight text-white">
                  {formatBDT(state.todaySales, { mode: 'exact', bangla: state.banglaMode })}
                </div>
                <div className="text-[10px] font-mono text-slate-400 pt-1.5 border-t border-slate-800/80 space-y-0.5">
                  <div className="flex justify-between">
                    <span>Invoices / Drops:</span>
                    <strong className="text-slate-300 font-normal">{totalInvoices} drops</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Physical Units:</span>
                    <strong className="text-slate-300 font-normal">{totalUnits.toLocaleString('en-IN')} units</strong>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Average Drop:</span>
                    <span>৳{kpis.dropSize.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Credit Share */}
              <div
                className={`rounded-xl border p-3.5 shadow-sm transition flex flex-col justify-between ${
                  darkMode ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Credit Share
                  </span>
                  <span className="bg-slate-800 text-slate-300 border border-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono">
                    Cap ≤ 45%
                  </span>
                </div>
                <div className="my-1.5 text-xl font-mono font-bold tracking-tight text-white flex items-baseline gap-1.5">
                  <span>{formatPercent((state.freshCredit / state.todaySales) * 100, 1, state.banglaMode)}</span>
                  <span className="text-[11px] font-normal text-slate-400">of Sales</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400 pt-1.5 border-t border-slate-800/80 space-y-0.5">
                  <div className="flex justify-between">
                    <span>Cash Sales:</span>
                    <strong className="text-slate-300 font-normal">{formatBDT(popyTodaySnapshot.cashSales, { mode: 'summary' })}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Credit Sales:</span>
                    <strong className="text-slate-300 font-normal">{formatBDT(state.freshCredit, { mode: 'summary' })}</strong>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Breach Status:</span>
                    <span>0 Vans Over Limit</span>
                  </div>
                </div>
              </div>

              {/* Card 5: Till Variance */}
              <div
                className={`rounded-xl border p-3.5 shadow-sm transition flex flex-col justify-between ${
                  darkMode ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Till Variance
                  </span>
                  <span className="bg-amber-500/15 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono">
                    Audit Flag
                  </span>
                </div>
                <div className="my-1.5 text-xl font-mono font-bold tracking-tight text-amber-400">
                  {formatVariance(state.cashVariance, state.banglaMode)}
                </div>
                <div className="text-[10px] font-mono text-slate-400 pt-1.5 border-t border-slate-800/80 space-y-0.5">
                  <div className="flex justify-between">
                    <span>Flagged Route:</span>
                    <strong className="text-amber-300 font-medium">Van #3 (JSR Babul)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Expected Till:</span>
                    <strong className="text-slate-300 font-normal">{formatBDT(state.reconciliationExpected)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Counted Till:</span>
                    <strong className="text-slate-300 font-normal">{formatBDT(state.reconciliationCounted)}</strong>
                  </div>
                </div>
              </div>

              {/* Card 6: Fleet Dispatch */}
              <div
                className={`rounded-xl border p-3.5 shadow-sm transition flex flex-col justify-between ${
                  darkMode ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Dispatch Delay
                  </span>
                  <span className="bg-rose-500/15 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono">
                    Failed
                  </span>
                </div>
                <div className="my-1.5 text-xl font-mono font-bold tracking-tight text-rose-400">
                  +{state.dispatchDelayMinutes} min
                </div>
                <div className="text-[10px] font-mono text-slate-400 pt-1.5 border-t border-slate-800/80 space-y-0.5">
                  <div className="flex justify-between">
                    <span>Target → Actual:</span>
                    <strong className="text-slate-300 font-normal">09:00 → 11:45</strong>
                  </div>
                  <div className="flex justify-between text-rose-300">
                    <span>Van-Minutes Lost:</span>
                    <strong className="font-semibold">{dispatch.vanMinutesLost} min</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Idle Crew Cost:</span>
                    <span>৳{dispatch.idleCrewCost.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* MAIN TWO-COLUMN WORKBENCH */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* =========================================================================
                  LEFT COLUMN (8 cols / ~66%): 12-Route Settlement Table & Shop Drilldown
                  ========================================================================= */}
              <div className="lg:col-span-8 space-y-4">
                {/* 12 Route Settlement Matrix */}
                <div
                  className={`rounded-xl border shadow-sm ${
                    darkMode ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-slate-200'
                  }`}
                >
                  {/* Table Control Header */}
                  <div className="p-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Truck size={15} className="text-emerald-400" />
                        <h2 className="text-sm font-bold text-slate-100 font-mono tracking-tight">
                          12-Route Settlement Matrix &amp; Till Audit
                        </h2>
                        <span className="bg-emerald-500/15 text-emerald-400 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border border-emerald-500/20">
                          Accrual Realised
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Delivered sales = Cash + Credit · Handed In = Cash + Old Dues · Click any row for retailer invoices
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Search Bar */}
                      <div className="relative">
                        <Search size={12} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="text"
                          value={routeSearchQuery}
                          onChange={(e) => setRouteSearchQuery(e.target.value)}
                          placeholder="Search route or crew..."
                          className={`h-7 w-40 rounded-lg pl-7 pr-2 text-xs font-mono border transition focus:outline-none ${
                            darkMode
                              ? 'bg-slate-900 border-slate-800 text-slate-200 placeholder:text-slate-600 focus:border-emerald-500'
                              : 'bg-slate-50 border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-emerald-600'
                          }`}
                        />
                      </div>

                      {/* Status Filter */}
                      <div className="flex rounded-md border border-slate-800 bg-slate-900 p-0.5 text-[10px] font-mono">
                        {(['ALL', 'ACTION', 'REVIEW', 'OK'] as const).map((filter) => (
                          <button
                            key={filter}
                            onClick={() => setRouteStatusFilter(filter)}
                            className={`px-2 py-0.5 rounded transition font-medium ${
                              routeStatusFilter === filter
                                ? 'bg-slate-800 text-emerald-300 font-bold'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {filter}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* High-Density Reconciled Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="border-b border-slate-800 bg-slate-900/60 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        <tr>
                          <th className="py-2.5 px-3">Route / Van</th>
                          <th className="py-2.5 px-2">Crew (JSR · SR)</th>
                          <th className="py-2.5 px-2.5 text-right">Delivered (৳)</th>
                          <th className="py-2.5 px-2.5 text-right">Cash (৳)</th>
                          <th className="py-2.5 px-2.5 text-right">Credit (৳)</th>
                          <th className="py-2.5 px-2.5 text-right">Dues (৳)</th>
                          <th className="py-2.5 px-2 text-right">Exp (৳)</th>
                          <th className="py-2.5 px-2.5 text-right">Handed (৳)</th>
                          <th className="py-2.5 px-2.5 text-right">Expected (৳)</th>
                          <th className="py-2.5 px-2.5 text-right">Variance (৳)</th>
                          <th className="py-2.5 px-2 text-right">Credit %</th>
                          <th className="py-2.5 px-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {filteredRoutes.map((route) => {
                          const isSelected = selectedRouteId === route.id;
                          const creditPct = route.deliveredSales > 0 ? (route.creditSales / route.deliveredSales) * 100 : 0;
                          const hasShortage = route.variance !== 0;

                          return (
                            <tr
                              key={route.id}
                              onClick={() => setSelectedRouteId(isSelected ? null : route.id)}
                              className={`cursor-pointer transition-colors ${
                                isSelected
                                  ? 'bg-emerald-950/30 ring-1 ring-inset ring-emerald-500/40'
                                  : hasShortage
                                  ? 'bg-amber-950/20 hover:bg-amber-950/30'
                                  : 'hover:bg-slate-800/40'
                              }`}
                            >
                              {/* Route / Van */}
                              <td className="py-2 px-3">
                                <div className="font-bold text-slate-200 flex items-center gap-1.5">
                                  <span>{route.vanNumber}</span>
                                  {route.isOutsideTerritory && (
                                    <span className="rounded bg-amber-500/20 px-1 py-0.2 text-[9px] text-amber-300 border border-amber-500/30">
                                      Verify
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-400 truncate max-w-[140px]" title={route.routeName}>
                                  {route.routeName}
                                </div>
                              </td>

                              {/* JSR & SR */}
                              <td className="py-2 px-2 text-[11px]">
                                <div className="text-slate-300 truncate max-w-[120px] font-medium" title={`Delivery: ${route.jsrName}`}>
                                  {route.jsrName}
                                </div>
                                <div className="text-[10px] text-slate-500 truncate max-w-[120px]" title={`Booking: ${route.srName}`}>
                                  SR: {route.srName}
                                </div>
                              </td>

                              {/* Delivered Sales */}
                              <td className="py-2 px-2.5 text-right font-semibold text-slate-100 tabular-nums">
                                {formatTakaNumber(route.deliveredSales, state.banglaMode)}
                              </td>

                              {/* Cash Sales */}
                              <td className="py-2 px-2.5 text-right text-emerald-400 font-medium tabular-nums">
                                {formatTakaNumber(route.cashSales, state.banglaMode)}
                              </td>

                              {/* Credit Sales */}
                              <td className="py-2 px-2.5 text-right text-amber-400 font-medium tabular-nums">
                                {formatTakaNumber(route.creditSales, state.banglaMode)}
                              </td>

                              {/* Old Dues */}
                              <td className="py-2 px-2.5 text-right text-slate-300 tabular-nums">
                                +{formatTakaNumber(route.oldDuesCollected, state.banglaMode)}
                              </td>

                              {/* Route Expenses */}
                              <td className="py-2 px-2 text-right text-slate-400 tabular-nums">
                                −{formatTakaNumber(route.cashExpenses, state.banglaMode)}
                              </td>

                              {/* Cash Handed In */}
                              <td className="py-2 px-2.5 text-right font-bold text-slate-200 tabular-nums">
                                {formatTakaNumber(route.cashHandedIn, state.banglaMode)}
                              </td>

                              {/* Expected Till */}
                              <td className="py-2 px-2.5 text-right text-slate-400 tabular-nums">
                                {formatTakaNumber(route.expectedTill, state.banglaMode)}
                              </td>

                              {/* Variance */}
                              <td className="py-2 px-2.5 text-right font-bold tabular-nums">
                                <span
                                  className={
                                    route.variance < 0
                                      ? 'text-rose-400 bg-rose-500/15 px-1.5 py-0.5 rounded border border-rose-500/20'
                                      : route.variance > 0
                                      ? 'text-emerald-400'
                                      : 'text-slate-500 font-normal'
                                  }
                                >
                                  {route.variance === 0 ? '0' : formatVariance(route.variance, state.banglaMode)}
                                </span>
                              </td>

                              {/* Credit % */}
                              <td className="py-2 px-2 text-right text-slate-300 tabular-nums">
                                <span className={creditPct >= 45 ? 'text-amber-400 font-bold' : ''}>
                                  {creditPct.toFixed(1)}%
                                </span>
                              </td>

                              {/* Status Badge */}
                              <td className="py-2 px-3 text-center">
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                                    route.status === 'OK'
                                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                                      : route.status === 'REVIEW'
                                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                                      : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                                  }`}
                                  title={route.statusReason || ''}
                                >
                                  {route.status === 'OK' ? (
                                    <CheckCircle2 size={10} />
                                  ) : (
                                    <AlertTriangle size={10} />
                                  )}
                                  <span>{route.status}</span>
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>

                      {/* Summary Footer Ties strictly to Section 4.3 identities */}
                      <tfoot className="border-t-2 border-slate-700 bg-slate-900 font-bold text-slate-200">
                        <tr>
                          <td colSpan={2} className="py-2.5 px-3 uppercase text-[10px] text-slate-400 tracking-wider">
                            Total (12 Routes Consolidated)
                          </td>
                          <td className="py-2.5 px-2.5 text-right text-white tabular-nums">
                            {formatTakaNumber(totals.deliveredSales, state.banglaMode)}
                          </td>
                          <td className="py-2.5 px-2.5 text-right text-emerald-400 tabular-nums">
                            {formatTakaNumber(totals.cashSales, state.banglaMode)}
                          </td>
                          <td className="py-2.5 px-2.5 text-right text-amber-400 tabular-nums">
                            {formatTakaNumber(totals.creditSales, state.banglaMode)}
                          </td>
                          <td className="py-2.5 px-2.5 text-right text-slate-200 tabular-nums">
                            +{formatTakaNumber(totals.oldDuesCollected, state.banglaMode)}
                          </td>
                          <td className="py-2.5 px-2 text-right text-slate-400 tabular-nums">
                            −{formatTakaNumber(totals.cashExpenses, state.banglaMode)}
                          </td>
                          <td className="py-2.5 px-2.5 text-right text-white tabular-nums">
                            {formatTakaNumber(totals.cashHandedIn, state.banglaMode)}
                          </td>
                          <td className="py-2.5 px-2.5 text-right text-slate-300 tabular-nums">
                            {formatTakaNumber(totals.expectedTill, state.banglaMode)}
                          </td>
                          <td className="py-2.5 px-2.5 text-right tabular-nums">
                            <span className="text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30">
                              {formatVariance(totals.variance, state.banglaMode)}
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-right text-slate-300 tabular-nums">
                            {formatPercent((totals.creditSales / totals.deliveredSales) * 100, 1, state.banglaMode)}
                          </td>
                          <td className="py-2.5 px-3 text-center text-[10px] text-slate-400 font-normal">
                            12/12 Checked
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* RETAILER INVOICE DRILL-DOWN SUBPANEL */}
                {selectedRoute && (
                  <div
                    className={`rounded-xl border p-4 shadow-lg space-y-3 transition ${
                      darkMode ? 'bg-[#111827] border-emerald-500/40' : 'bg-white border-emerald-500'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Store size={15} className="text-emerald-400" />
                        <div>
                          <h3 className="text-xs font-bold text-slate-100 font-mono">
                            Retailer Shop Invoice Audit · {selectedRoute.vanNumber} ({selectedRoute.routeName})
                          </h3>
                          <p className="text-[10px] text-slate-400 font-mono">
                            JSR: {selectedRoute.jsrName} · SR: {selectedRoute.srName} · Territory: {selectedRoute.territory}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                          Delivered: {formatBDT(selectedRoute.deliveredSales)}
                        </span>
                        <button
                          onClick={() => setSelectedRouteId(null)}
                          className="rounded-lg p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto max-h-60 overflow-y-auto">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="sticky top-0 bg-slate-900 text-[10px] uppercase text-slate-400 border-b border-slate-800">
                          <tr>
                            <th className="py-1.5 px-2">Invoice #</th>
                            <th className="py-1.5 px-2">Retailer Outlet</th>
                            <th className="py-1.5 px-2">Market Point</th>
                            <th className="py-1.5 px-2 text-right">Units</th>
                            <th className="py-1.5 px-2 text-right">Order Value (৳)</th>
                            <th className="py-1.5 px-2 text-right">Cash Paid (৳)</th>
                            <th className="py-1.5 px-2 text-right">Credit Due (৳)</th>
                            <th className="py-1.5 px-2 text-center">Time</th>
                            <th className="py-1.5 px-2 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40 text-[11px]">
                          {selectedRouteShops.map((shop) => (
                            <tr key={shop.invoiceNo} className="hover:bg-slate-800/30">
                              <td className="py-1.5 px-2 font-mono text-slate-300">{shop.invoiceNo}</td>
                              <td className="py-1.5 px-2 font-semibold text-slate-100">{shop.shopName}</td>
                              <td className="py-1.5 px-2 text-slate-400">{shop.marketPoint}</td>
                              <td className="py-1.5 px-2 text-right text-slate-300 tabular-nums">{shop.units}</td>
                              <td className="py-1.5 px-2 text-right font-bold text-slate-100 tabular-nums">
                                {formatTakaNumber(shop.orderValue, state.banglaMode)}
                              </td>
                              <td className="py-1.5 px-2 text-right text-emerald-400 tabular-nums">
                                {formatTakaNumber(shop.cashPaid, state.banglaMode)}
                              </td>
                              <td className="py-1.5 px-2 text-right text-amber-400 tabular-nums">
                                {shop.creditDue > 0 ? formatTakaNumber(shop.creditDue, state.banglaMode) : '—'}
                              </td>
                              <td className="py-1.5 px-2 text-center text-slate-400">{shop.deliveryTime}</td>
                              <td className="py-1.5 px-2 text-center">
                                <span
                                  className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                    shop.receiptStatus === 'PAID_IN_FULL'
                                      ? 'bg-emerald-500/15 text-emerald-400'
                                      : shop.receiptStatus === 'PARTIAL_CREDIT'
                                      ? 'bg-amber-500/15 text-amber-300'
                                      : 'bg-blue-500/15 text-blue-300'
                                  }`}
                                >
                                  {shop.receiptStatus === 'PAID_IN_FULL' ? 'PAID' : shop.receiptStatus === 'PARTIAL_CREDIT' ? 'PARTIAL' : 'CREDIT'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* =========================================================================
                  RIGHT COLUMN (4 cols / ~34%): NOWC, Receivables Ageing, Hardware Payback
                  ========================================================================= */}
              <div className="lg:col-span-4 space-y-4">
                {/* 1. NET OPERATING WORKING CAPITAL WATERFALL (Defect A6) */}
                <div
                  className={`rounded-xl border p-4 shadow-sm font-mono text-xs ${
                    darkMode ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <h3 className="font-bold text-slate-100 uppercase tracking-tight text-xs flex items-center gap-1.5">
                        <Scale size={13} className="text-emerald-400" />
                        Net Operating Working Capital
                      </h3>
                      <p className="text-[10px] text-slate-400 font-normal">
                        Closing Stock Basis · Cash Conversion Cycle 16.0 Days
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      Accrual
                    </span>
                  </div>

                  {/* Accounting Waterfall Rows */}
                  <div className="mt-3 space-y-2 text-slate-300 text-[11px]">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">(+) Trade Receivables (DSO 24):</span>
                      <strong className="text-slate-100 font-medium tabular-nums">
                        {formatBDT(state.workingCapital.receivables)}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">(+) Depot Inventory (DIO 20):</span>
                      <strong className="text-slate-100 font-medium tabular-nums">
                        {formatBDT(state.workingCapital.inventory)}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">(+) Scheme Discounts (0.5% scale):</span>
                      <strong className="text-slate-100 font-medium tabular-nums">
                        {formatBDT(state.workingCapital.schemeClaimsPending)}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">(+) Damage Claims Pending:</span>
                      <strong className="text-slate-100 font-medium tabular-nums">
                        {formatBDT(state.workingCapital.damageClaimsPending)}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center text-rose-400">
                      <span>(−) Supplier Payables (DPO 28):</span>
                      <strong className="font-medium tabular-nums">
                        −{formatBDT(state.workingCapital.payables)}
                      </strong>
                    </div>

                    {/* Headline Total */}
                    <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline font-bold text-sm text-slate-100">
                      <span className="text-xs text-slate-300">Net Operating Working Capital:</span>
                      <span className="text-emerald-400 text-base font-bold tabular-nums">
                        {formatBDT(state.workingCapital.netOperatingWorkingCapital)}
                      </span>
                    </div>

                    {/* CCC Turnover Bar */}
                    <div className="pt-2 border-t border-slate-800/60 grid grid-cols-4 gap-1 text-[10px] text-center text-slate-400">
                      <div className="bg-slate-900 p-1.5 rounded">
                        <span className="block text-[9px] uppercase">DSO</span>
                        <strong className="text-slate-200">24.0 d</strong>
                      </div>
                      <div className="bg-slate-900 p-1.5 rounded">
                        <span className="block text-[9px] uppercase">DIO</span>
                        <strong className="text-slate-200">20.0 d</strong>
                      </div>
                      <div className="bg-slate-900 p-1.5 rounded">
                        <span className="block text-[9px] uppercase">DPO</span>
                        <strong className="text-slate-200">28.0 d</strong>
                      </div>
                      <div className="bg-emerald-950/60 border border-emerald-500/30 p-1.5 rounded">
                        <span className="block text-[9px] uppercase text-emerald-400 font-bold">CCC</span>
                        <strong className="text-emerald-300 font-bold">16.0 d</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. RECEIVABLES AGEING & OVERDUE ANALYSIS (6.7) */}
                <div
                  className={`rounded-xl border p-4 shadow-sm font-mono text-xs ${
                    darkMode ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="font-bold text-slate-100 uppercase tracking-tight text-xs flex items-center gap-1.5">
                      <Wallet size={13} className="text-amber-400" />
                      Receivables Ageing Distribution
                    </h3>
                    <span className="text-[10px] text-amber-400 bg-amber-500/15 px-1.5 py-0.5 rounded font-bold">
                      {receivables.overdue30PlusPercent}% &gt; 30d
                    </span>
                  </div>

                  {/* 5-Bucket Horizontal Segmented Distribution */}
                  <div className="mt-3 space-y-2">
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                      <div style={{ width: '55%' }} className="bg-emerald-500 h-full" title="0–15d: 55%" />
                      <div style={{ width: '27%' }} className="bg-emerald-600 h-full" title="16–30d: 27%" />
                      <div style={{ width: '11%' }} className="bg-amber-500 h-full" title="31–45d: 11%" />
                      <div style={{ width: '5%' }} className="bg-amber-600 h-full" title="46–60d: 5%" />
                      <div style={{ width: '2%' }} className="bg-rose-500 h-full" title="60+d: 2%" />
                    </div>

                    <div className="space-y-1.5 text-[11px] pt-1">
                      {receivables.buckets.map((bkt) => (
                        <div key={bkt.range} className="flex justify-between items-center text-slate-300">
                          <span className="flex items-center gap-1.5">
                            <span
                              className={`h-2 w-2 rounded-full ${
                                bkt.range.includes('60')
                                  ? 'bg-rose-500'
                                  : bkt.range.includes('31') || bkt.range.includes('46')
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                            />
                            <span>{bkt.range}</span>
                            <span className="text-[10px] text-slate-500">({bkt.percent}%)</span>
                          </span>
                          <span className="font-medium tabular-nums">{formatBDT(bkt.amount)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline text-xs">
                      <span className="text-slate-400">Overdue &gt; 30 Days (At Risk):</span>
                      <strong className="text-amber-400 font-bold tabular-nums">
                        {formatBDT(receivables.totalOverdue30Plus)} ({receivables.overdue30PlusPercent}%)
                      </strong>
                    </div>
                    <div className="flex justify-between items-baseline text-[10px] text-slate-500">
                      <span>Prudent Credit Provisioning:</span>
                      <span className="text-slate-300 tabular-nums">৳10,48,561 (Est. allowance)</span>
                    </div>

                    <div className="pt-2 border-t border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Top Overdue Retailers (Watch List):
                      </span>
                      {top10OverdueRetailers.slice(0, 3).map((ret) => (
                        <div key={ret.id} className="flex justify-between items-center text-[10px] text-slate-300">
                          <span className="truncate max-w-[170px]" title={ret.name}>
                            {ret.name} ({ret.marketPoint})
                          </span>
                          <span className="text-amber-400 font-bold tabular-nums">
                            {formatBDT(ret.balance, { mode: 'summary' })} ({ret.overdueDays}d)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. HARDWARE BOTTLEKNECK & PAYBACK ECONOMICS (6.6) */}
                <div
                  className={`rounded-xl border p-4 shadow-sm font-mono text-xs ${
                    darkMode ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="font-bold text-slate-100 uppercase tracking-tight text-xs flex items-center gap-1.5">
                      <Printer size={13} className="text-rose-400" />
                      Epson LQ-310 Payback Analysis
                    </h3>
                    <button
                      onClick={() => setShowFormulaModal(!showFormulaModal)}
                      className="text-[10px] text-emerald-400 font-bold hover:underline"
                    >
                      {showFormulaModal ? 'Hide Formula' : 'Tap Formula'}
                    </button>
                  </div>

                  <div className="mt-3 space-y-1.5 text-slate-300 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Landed Cost / Liquidation Discount:</span>
                      <strong className="text-slate-200 font-normal">৳112.20 · 30.0%</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Loss per Mispicked Unit:</span>
                      <strong className="text-rose-400 font-bold">৳41.46 / unit</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Today&apos;s Incident (60 units / 2.5 ctn):</span>
                      <strong className="text-slate-100 font-semibold">৳2,488 loss</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Average Daily Avoided Loss:</span>
                      <strong className="text-slate-200 font-normal">৳1,078 / day</strong>
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline text-xs font-bold">
                      <span className="text-slate-300">Replacement Cost (৳3,000) Payback:</span>
                      <span className="text-emerald-400 text-sm font-bold">2.8 Days</span>
                    </div>
                  </div>

                  {showFormulaModal && (
                    <div className="mt-2.5 p-2 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 leading-relaxed">
                      {mispick.formula}
                    </div>
                  )}
                </div>

                {/* 4. MISSING FMCG OPERATIONAL KPIS (Section F) */}
                <div
                  className={`rounded-xl border p-4 shadow-sm font-mono text-xs ${
                    darkMode ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="font-bold text-slate-100 uppercase tracking-tight text-xs">
                      Field Execution &amp; Margin of Safety (Sec F)
                    </h3>
                    <span className="text-[10px] text-slate-500">Benchmark Calibrated</span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded bg-slate-900/60 border border-slate-800/60">
                      <span className="block text-[10px] text-slate-400">SR Strike Rate</span>
                      <strong className="text-slate-100 text-xs font-bold">{kpis.strikeRate}%</strong>
                      <span className="block text-[9px] text-slate-500 mt-0.5">720 / 960 calls</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900/60 border border-slate-800/60">
                      <span className="block text-[10px] text-slate-400">Lines per Call</span>
                      <strong className="text-slate-100 text-xs font-bold">{kpis.linesPerCall} SKUs</strong>
                      <span className="block text-[9px] text-slate-500 mt-0.5">Order basket depth</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900/60 border border-slate-800/60">
                      <span className="block text-[10px] text-slate-400">Order Fill Rate</span>
                      <strong className="text-slate-100 text-xs font-bold">{kpis.fillRate}%</strong>
                      <span className="block text-[9px] text-slate-500 mt-0.5">Depot pick accuracy</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900/60 border border-slate-800/60">
                      <span className="block text-[10px] text-slate-400">Return Rate</span>
                      <strong className="text-slate-100 text-xs font-bold">{kpis.returnRate}%</strong>
                      <span className="block text-[9px] text-slate-500 mt-0.5">Market damaged/refused</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900/60 border border-slate-800/60">
                      <span className="block text-[10px] text-slate-400">Stock Cover</span>
                      <strong className="text-slate-100 text-xs font-bold">{kpis.stockCoverDays} Days</strong>
                      <span className="block text-[9px] text-slate-500 mt-0.5">Top-selling FMCG</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900/60 border border-slate-800/60">
                      <span className="block text-[10px] text-slate-400">Margin of Safety</span>
                      <strong className="text-emerald-400 text-xs font-bold">{kpis.marginOfSafetyPercent}%</strong>
                      <span className="block text-[9px] text-slate-500 mt-0.5">BE: 90,741 units</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            BOTTOM COMMAND ACTION DOCK (Touch targets ≥ 48px, Section E & 7)
            ========================================================================= */}
        <section
          aria-label="Executive Action Dock"
          className={`fixed bottom-0 left-0 right-0 z-30 border-t px-4 py-2.5 backdrop-blur-md shadow-2xl transition-colors ${
            darkMode ? 'bg-[#0F172A]/95 border-[#1E293B]' : 'bg-white/95 border-slate-200'
          }`}
        >
          <div className="mx-auto flex flex-wrap items-center justify-between gap-3 max-w-[1920px]">
            {/* Role & Audit Context */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                Action Dock:
              </span>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400">User Role:</span>
                <strong className="text-slate-200 font-semibold bg-slate-800 px-2 py-0.5 rounded">
                  {state.currentRole}
                </strong>
                <span className="text-[10px] text-slate-500 hidden md:inline">
                  (Actions require confirmation modal &amp; audit trail)
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              {/* 1. Pause Credit */}
              <button
                disabled={!canLockCredit}
                onClick={() => openModal('CREDIT_LOCK')}
                title={actionTooltip(canLockCredit)}
                className={`min-h-[44px] px-3.5 py-2 rounded-lg font-bold transition flex items-center gap-1.5 shadow-sm ${
                  canLockCredit
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                }`}
              >
                <Lock size={13} />
                <span>{b('Pause Credit')}</span>
              </button>

              {/* 2. Prepare Bank Deposit */}
              <button
                disabled={!canDepositBank}
                onClick={() => openModal('BANK_DEPOSIT')}
                title={actionTooltip(canDepositBank)}
                className={`min-h-[44px] px-3.5 py-2 rounded-lg font-bold transition flex items-center gap-1.5 shadow-sm ${
                  canDepositBank
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                }`}
              >
                <Wallet size={13} />
                <span>{b('Prepare Bank Deposit')} (৳8.0L)</span>
              </button>

              {/* 3. Open Shortage Case */}
              <button
                disabled={!canHandleShortage}
                onClick={() => openModal('SHORTAGE_CASE')}
                title={actionTooltip(canHandleShortage)}
                className={`min-h-[44px] px-3.5 py-2 rounded-lg font-bold transition flex items-center gap-1.5 border shadow-sm ${
                  canHandleShortage
                    ? 'border-amber-500 text-amber-300 bg-amber-500/10 hover:bg-amber-500/20'
                    : 'border-slate-800 text-slate-500 cursor-not-allowed bg-slate-900'
                }`}
              >
                <Scale size={13} />
                <span>{b('Open Shortage Case')} (Van #3)</span>
              </button>

              {/* 4. Review and Close Day */}
              <button
                disabled={!canCloseDay}
                onClick={() => openModal('DAY_END_CLOSE')}
                title={actionTooltip(canCloseDay)}
                className={`min-h-[44px] px-3.5 py-2 rounded-lg font-bold transition flex items-center gap-1.5 shadow-sm ${
                  canCloseDay
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600'
                    : 'bg-slate-800/50 text-slate-600 cursor-not-allowed border border-slate-800'
                }`}
              >
                <FileCheck2 size={13} />
                <span>{b('Review and Close Day')}</span>
              </button>

              {/* 5. Reset Demo State */}
              <button
                onClick={resetSimulation}
                className="min-h-[44px] px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition text-[11px]"
                title="Reset local demo modifications to reconciled contract"
              >
                Reset
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Confirmation Modals (Shortage Case, Credit Lock, Bank Deposit, Closeout) */}
      <ActionModals />
    </div>
  );
};
