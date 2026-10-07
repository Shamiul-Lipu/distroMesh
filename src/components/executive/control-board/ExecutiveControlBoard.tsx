'use client';

import React, { useState } from 'react';
import { useExecutive } from '../../../context/ExecutiveContext';
import { ExecutiveHeader } from './ExecutiveHeader';
import { LiquidityRunway } from './LiquidityRunway';
import { ExecutiveBriefing } from './ExecutiveBriefing';
import { TrappedCapitalMatrix } from './TrappedCapitalMatrix';
import { DailyCashMovement } from './DailyCashMovement';
import { DispatchRunway } from './DispatchRunway';
import { BottleneckIndicator } from './BottleneckIndicator';
import { RouteSettlementMatrix } from './RouteSettlementMatrix';
import { ExceptionMatrix } from './ExceptionMatrix';
import { DecisionActionDock } from './DecisionActionDock';
import { InvestigationDrawer, DrawerType } from './InvestigationDrawer';
import { ActionConfirmationModal, ActionModalType } from './ActionConfirmationModal';
import { SimulationPanel } from '../SimulationPanel';
import { formatBDT, formatVariance, formatPercent } from '../../../utils/formatters';
import { deriveLiquidityStatus, deriveDispatchMetrics, deriveReceivablesAgeing } from '../../../utils/derivedRules';
import { popyTodaySnapshot } from '../../../data/seedData';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  AlertOctagon,
  Tv,
  Zap,
} from 'lucide-react';

interface ExecutiveControlBoardProps {
  businessSlug?: string;
}

export const ExecutiveControlBoard: React.FC<ExecutiveControlBoardProps> = ({
  businessSlug = 'unilever-distribution',
}) => {
  const { state, openDrawer, closeDrawer, replaceHardware, showToast } = useExecutive();

  // Local state for modals & drawers
  const [activeModalType, setActiveModalType] = useState<ActionModalType>(null);
  const [activeDrawerType, setActiveDrawerType] = useState<DrawerType>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [burnInSafe, setBurnInSafe] = useState(false);

  const liquidity = deriveLiquidityStatus({
    bankAfterDebit: state.bankCash,
    vaultCash: state.vaultCash,
    next7DayObligations: state.upcomingObligation,
  });
  const dispatch = deriveDispatchMetrics({
    targetTime: state.dispatchTarget,
    actualTime: state.dispatchActual,
    delayMinutes: state.dispatchDelayMinutes,
    vansDispatched: 12,
    crewDailyWage: 1200,
  });
  const receivables = deriveReceivablesAgeing();

  const handleSelectRoute = (routeId: string) => {
    setSelectedRouteId(routeId);
    setActiveDrawerType('ROUTE');
  };

  return (
    <div className={`min-h-screen bg-[var(--background-deep)] text-[var(--foreground)] selection:bg-[var(--accent)]/20 selection:text-[var(--accent)] font-sans ${
      burnInSafe ? 'translate-x-0.5 translate-y-0.5' : ''
    }`}>
      {/* =========================================================================
          ZONE 1: EXECUTIVE STATUS & HEADER (Executive Topbar)
          ========================================================================= */}
      <ExecutiveHeader
        businessName="M/S Popy Traders"
        location="Sherpur & Bogura Hub"
        onOpenSimulation={() => openDrawer('SIMULATION')}
      />

      {/* Main Command Surface */}
      <main className="mx-auto max-w-[1920px] px-3 sm:px-5 lg:px-6 py-4 space-y-4 pb-28">
        {/* =========================================================================
            TIER 1: 55-65" WALL DISPLAY MODE (Section 25)
            ========================================================================= */}
        {state.warRoomTier === 'wall' ? (
          <div className="space-y-4 font-mono animate-in fade-in duration-200">
            {/* Wall Mode Subheader */}
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 text-xs text-[var(--foreground-muted)]">
              <span className="font-bold tracking-wider text-[var(--foreground)] uppercase flex items-center gap-2">
                <Tv size={14} className="text-[var(--success)]" />
                55–65&quot; Wall Display Mode · NOC Command Wall (Distance Scan 10–15 Ft)
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setBurnInSafe(!burnInSafe)}
                  className={`px-2 py-0.5 rounded text-[10px] border ${
                    burnInSafe ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] font-bold' : 'border-[var(--border)] text-[var(--foreground-muted)]'
                  }`}
                >
                  {burnInSafe ? 'Burn-In Drift Active' : 'Enable Burn-In Drift'}
                </button>
                <span>7 Core Control Tiles · Exact BDT</span>
              </div>
            </div>

            {/* 7 High-Contrast Wall Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Tile 1: Liquid Cash */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 flex flex-col justify-between shadow-md">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-[var(--foreground-muted)]">1. Liquid Cash</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      liquidity.status === 'SAFE' ? 'bg-[var(--success-soft)] text-[var(--success)]' : 'bg-[var(--warning-soft)] text-[var(--warning)]'
                    }`}>
                      {liquidity.status}
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-[var(--foreground)] tracking-tight">
                    {formatBDT(state.bankCash + state.vaultCash, { mode: 'exact', bangla: state.banglaMode })}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[var(--border)] text-xs text-[var(--foreground-muted)] space-y-1">
                  <div className="flex justify-between">
                    <span>Bank:</span>
                    <strong className="text-[var(--foreground)]">{formatBDT(state.bankCash)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Vault (Counted):</span>
                    <strong className="text-[var(--foreground)]">{formatBDT(state.vaultCash)}</strong>
                  </div>
                </div>
              </div>

              {/* Tile 2: Principal Auto-Debit */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 flex flex-col justify-between shadow-md">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-[var(--foreground-muted)]">2. 48h Auto-Debit</span>
                    <span className="bg-[var(--warning-soft)] text-[var(--warning)] px-2 py-0.5 rounded text-xs font-bold">
                      {state.obligationDueHours}h Left
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-[var(--warning)] tracking-tight">
                    {formatBDT(state.upcomingObligation, { mode: 'exact', bangla: state.banglaMode })}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[var(--border)] text-xs text-[var(--foreground-muted)] flex justify-between">
                  <span>Coverage:</span>
                  <strong className="text-[var(--success)] font-bold">{liquidity.coverage}× Combined</strong>
                </div>
              </div>

              {/* Tile 3: Dispatch Delay */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 flex flex-col justify-between shadow-md">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-[var(--foreground-muted)]">3. Dispatch Delay</span>
                    <span className="bg-[var(--danger-soft)] text-[var(--danger)] px-2 py-0.5 rounded text-xs font-bold">CRITICAL</span>
                  </div>
                  <div className="text-3xl font-bold text-[var(--danger)] tracking-tight">
                    +{state.dispatchDelayMinutes} Min
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[var(--border)] text-xs text-[var(--foreground-muted)] flex justify-between">
                  <span>Fleet Runtime Lost:</span>
                  <strong className="text-[var(--foreground)]">{dispatch.vanMinutesLost} van-min</strong>
                </div>
              </div>

              {/* Tile 4: Till Variance */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 flex flex-col justify-between shadow-md">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-[var(--foreground-muted)]">4. Till Variance</span>
                    <span className="bg-[var(--danger-soft)] text-[var(--danger)] px-2 py-0.5 rounded text-xs font-bold">Van #3</span>
                  </div>
                  <div className="text-3xl font-bold text-[var(--danger)] tracking-tight">
                    {formatVariance(state.cashVariance, state.banglaMode)}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[var(--border)] text-xs text-[var(--foreground-muted)] flex justify-between">
                  <span>Expected: {formatBDT(state.reconciliationExpected)}</span>
                  <span>Counted: {formatBDT(state.reconciliationCounted)}</span>
                </div>
              </div>

              {/* Tile 5: Credit Share */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 flex flex-col justify-between shadow-md">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-[var(--foreground-muted)]">5. Credit Share</span>
                    <span className="text-[var(--foreground-muted)] text-xs">Ceiling &le; 45%</span>
                  </div>
                  <div className="text-3xl font-bold text-[var(--foreground)] tracking-tight">
                    {formatPercent((state.freshCredit / state.todaySales) * 100, 1, state.banglaMode)}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[var(--border)] text-xs text-[var(--foreground-muted)] flex justify-between">
                  <span>Cash: {formatBDT(popyTodaySnapshot.cashSales, { mode: 'summary' })}</span>
                  <span>Credit: {formatBDT(state.freshCredit, { mode: 'summary' })}</span>
                </div>
              </div>

              {/* Tile 6: Overdue > 30 Days */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 flex flex-col justify-between shadow-md">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-[var(--foreground-muted)]">6. Overdue &gt;30d</span>
                    <span className="text-[var(--warning)] bg-[var(--warning-soft)] px-2 py-0.5 rounded text-xs font-bold">
                      {receivables.overdue30PlusPercent}%
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-[var(--foreground)] tracking-tight">
                    {formatBDT(receivables.totalOverdue30Plus, { mode: 'summary', bangla: state.banglaMode })}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[var(--border)] text-xs text-[var(--foreground-muted)] flex justify-between">
                  <span>Total Receivables:</span>
                  <strong className="text-[var(--foreground)]">{formatBDT(state.workingCapital.receivables, { mode: 'summary' })}</strong>
                </div>
              </div>

              {/* Tile 7: Top Critical Operational Exception (Double Column) */}
              <div className="rounded-xl border border-[var(--danger)]/30 bg-[var(--surface-elevated)] p-5 flex flex-col justify-between shadow-md lg:col-span-2">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-[var(--danger)] flex items-center gap-1.5">
                      <AlertOctagon size={14} /> 7. Active Critical Exception
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--danger-soft)] text-[var(--danger)] border border-[var(--danger)]/20">
                      HIGH URGENCY
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[var(--foreground)]">
                    Morning Dispatch Delay · 165 Min Departure Stall
                  </h3>
                  <p className="mt-1 text-xs text-[var(--foreground-muted)] leading-relaxed font-sans">
                    Morning departure stall delayed 12 delivery vans in depot yard for 165 minutes. ৳4,950 idle crew cost incurred across 700 retail drops.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs">
                  <span className="text-[var(--danger)] font-semibold">Avoidable Friction: ৳7,438/day</span>
                  <button
                    onClick={() => setActiveDrawerType('INCIDENT')}
                    className="px-3.5 py-1.5 bg-[var(--danger)] hover:opacity-90 text-white font-bold rounded-lg shadow-sm transition"
                  >
                    Inspect Dispatch Loss
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* =========================================================================
            TIER 2: DESKTOP & TABLET EXECUTIVE CONTROL BOARD
            ========================================================================= */}
        {/* ZONE 1 (HERO): LIQUIDITY RUNWAY */}
        <LiquidityRunway
          onInspectObligations={() => setActiveDrawerType('LIQUIDITY')}
          onInspectVault={() => setActiveDrawerType('LIQUIDITY')}
        />

        {/* ZONE 2: EXECUTIVE BRIEFING + TRAPPED CAPITAL + CASH MOVEMENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Executive Briefing Card (Col 1-5) */}
          <div className="lg:col-span-5">
            <ExecutiveBriefing />
          </div>

          {/* Trapped Working Capital Matrix (Col 6-12) */}
          <div className="lg:col-span-7">
            <TrappedCapitalMatrix
              onInspectWorkingCapital={() => setActiveDrawerType('WORKING_CAPITAL')}
            />
          </div>
        </div>

        {/* Daily Cash Movement Opposing Forces Flow */}
        <DailyCashMovement />

        {/* ZONE 3: FIELD EXECUTION & DISPATCH RUNWAY + BOTTLENECK INCIDENT */}
        <div className="space-y-4">
          <DispatchRunway
            onInspectBottleneck={() => setActiveDrawerType('INCIDENT')}
          />
          <BottleneckIndicator
            onInspectIncident={() => setActiveDrawerType('INCIDENT')}
            onReplaceHardware={() => {
              replaceHardware();
              showToast('Printer replacement approved: High-speed thermal system installed.');
            }}
          />
        </div>

        {/* ZONE 4: 12-ROUTE SETTLEMENT MATRIX & DRILLDOWN */}
        <RouteSettlementMatrix
          onSelectRoute={handleSelectRoute}
        />

        {/* ZONE 4: OPERATIONAL EXCEPTION MATRIX */}
        <ExceptionMatrix
          onOpenShortageModal={() => setActiveModalType('SHORTAGE')}
          onOpenBankDepositModal={() => setActiveModalType('BANK_DEPOSIT')}
          onOpenCreditLockModal={() => setActiveModalType('CREDIT_LOCK')}
          onInspectIncidentDrawer={() => setActiveDrawerType('INCIDENT')}
        />
      </main>

      {/* =========================================================================
          ZONE 5: DECISION & ACTION DOCK (Sticky Bottom Controls)
          ========================================================================= */}
      <DecisionActionDock
        onOpenCreditLockModal={() => setActiveModalType('CREDIT_LOCK')}
        onOpenBankDepositModal={() => setActiveModalType('BANK_DEPOSIT')}
        onOpenShortageModal={() => setActiveModalType('SHORTAGE')}
        onOpenDayEndModal={() => setActiveModalType('DAY_END_CLOSE')}
      />

      {/* =========================================================================
          LEVEL 2 FOCUS: INVESTIGATION SIDE DRAWER
          ========================================================================= */}
      <InvestigationDrawer
        type={activeDrawerType}
        selectedRouteId={selectedRouteId}
        onClose={() => setActiveDrawerType(null)}
      />

      {/* =========================================================================
          LEVEL 3 ACTION: CONSEQUENCE CONFIRMATION MODAL
          ========================================================================= */}
      <ActionConfirmationModal
        type={activeModalType}
        onClose={() => setActiveModalType(null)}
      />

      {/* Contextual Simulation Panel */}
      <SimulationPanel />
    </div>
  );
};
