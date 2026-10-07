'use client';

import React from 'react';
import { LayoutGrid } from 'lucide-react';
import { WeeklySalesComposition } from './WeeklySalesComposition';
import { WeeklyCollectionVsTarget } from './WeeklyCollectionVsTarget';
import { WeeklyCashFlowInOut } from './WeeklyCashFlowInOut';
import { DispatchReadinessCard } from './DispatchReadinessCard';
import { UpcomingObligationCard } from './UpcomingObligationCard';
import { TrappedCapitalCard } from './TrappedCapitalCard';
import { TodayExecutionCard } from './TodayExecutionCard';
import { DailyReconciliationCard } from './DailyReconciliationCard';
import { CreditExposureCard } from './CreditExposureCard';
import { getBusinessOperationalSnapshot } from '../../../data/businessEntitiesData';

interface ExecutiveOperationsGridProps {
  businessId?: string;
  className?: string;
  onOpenDrawer?: (drawer: 'INCIDENT' | 'RECONCILIATION' | 'WORKING_CAPITAL' | 'OBLIGATION') => void;
}

export const ExecutiveOperationsGrid: React.FC<ExecutiveOperationsGridProps> = ({
  businessId = 'unilever-distribution',
  className = '',
  onOpenDrawer,
}) => {
  const snapshot = getBusinessOperationalSnapshot(businessId);

  return (
    <section
      aria-label="Executive Operations Pulse"
      className={`rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 sm:p-6 shadow-xs ${className}`}
    >
      {/* Section Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5 pb-3 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <LayoutGrid size={16} className="text-emerald-400" />
            <h2 className="text-[15px] font-bold tracking-tight text-[var(--foreground)] uppercase font-mono">
              Executive Operations &amp; Performance Pulse
            </h2>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 font-mono">
              LIVE PULSE
            </span>
          </div>
          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            7-day cash velocity, dispatch runway, debt coverage, and operational exception triage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-lg border border-[var(--border)] bg-[var(--surface-inset)] px-2.5 py-1 text-[10px] font-mono font-medium text-[var(--foreground-muted)]">
            {snapshot.name} · {snapshot.industry}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* =========================================================================
            ROW 1: 7-DAY PERFORMANCE TREND ANALYTICS (3 Cards)
            ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <WeeklySalesComposition data={snapshot.sevenDayTrend} />
          <WeeklyCollectionVsTarget data={snapshot.sevenDayTrend} />
          <WeeklyCashFlowInOut data={snapshot.sevenDayTrend} />
        </div>

        {/* =========================================================================
            ROW 2: OPERATIONAL READINESS & CAPITAL RUNWAY
            Left: Dispatch Readiness | Right: Upcoming Obligation & Trapped Capital
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Dispatch Readiness (Col 1-5) */}
          <div className="lg:col-span-5 flex flex-col">
            <DispatchReadinessCard
              className="h-full"
              status={snapshot.dispatchReadiness}
              onOpenIncident={() => onOpenDrawer?.('INCIDENT')}
            />
          </div>

          {/* Capital Solvency & Trapped Capital (Col 6-12) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UpcomingObligationCard
              className="h-full"
              amountDue={snapshot.upcomingObligation}
              dueHours={snapshot.obligationDueHours}
              coveragePct={snapshot.cashCoveragePct}
              postDebitRemaining={snapshot.postDebitBuffer}
              principalName={snapshot.obligationPrincipal}
              onOpenObligation={() => onOpenDrawer?.('OBLIGATION')}
            />
            <TrappedCapitalCard
              className="h-full"
              nowc={snapshot.nowc}
              receivables={snapshot.receivables}
              inventory={snapshot.inventory}
              schemes={snapshot.unclaimedSchemes}
              onOpenWorkingCapital={() => onOpenDrawer?.('WORKING_CAPITAL')}
            />
          </div>
        </div>

        {/* =========================================================================
            ROW 3: OPERATIONAL TRIAGE & EXCEPTIONS (3 Cards)
            ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TodayExecutionCard
            targetTime={snapshot.dispatchTarget}
            actualTime={snapshot.dispatchActual}
            delayMinutes={snapshot.dispatchDelayMin}
            status={snapshot.dispatchStatus}
            bottleneck={snapshot.dispatchBottleneck}
            lostMinutes={snapshot.lostExecutionMinutes}
            onOpenIncident={() => onOpenDrawer?.('INCIDENT')}
          />
          <DailyReconciliationCard
            expected={snapshot.expectedTill}
            counted={snapshot.countedTill}
            variance={snapshot.cashVariance}
            route={snapshot.varianceRoute}
            responsible={snapshot.responsiblePerson}
            hasException={snapshot.cashVariance !== 0}
            onOpenReconciliation={() => onOpenDrawer?.('RECONCILIATION')}
          />
          <CreditExposureCard
            freshCredit={snapshot.freshCredit}
            todaySales={snapshot.todaySales}
            creditRatio={snapshot.creditRatio}
          />
        </div>
      </div>
    </section>
  );
};
