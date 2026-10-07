'use client';

import React from 'react';
import { useExecutive } from '@/context/ExecutiveContext.tsx';
import { X, Scale, User, AlertTriangle } from 'lucide-react';
import { formatBDT, formatVariance } from '@/utils/formatters.ts';
import type { PortfolioSnapshot } from '@/data/portfolioDemo.ts';

export const ReconciliationDrawer: React.FC<{ portfolio: PortfolioSnapshot }> = ({ portfolio }) => {
  const { state, closeDrawer, openModal, waiveVariance } = useExecutive();

  if (state.activeDrawer !== 'RECONCILIATION') return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[540px] bg-[var(--surface-elevated)] border-l border-[var(--border)] text-[var(--foreground)] z-50 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[var(--warning-soft)] text-[var(--warning)] rounded-lg border border-[var(--warning)]/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-mono font-extrabold text-[var(--foreground)] uppercase">
                Till &amp; Route Reconciliation
              </h2>
              <span className="text-[10px] font-mono text-[var(--warning)]">
                {portfolio.cashVariance === 0 ? 'SELECTED SCOPE · NO CASH VARIANCE' : state.reconciliationRoute.toUpperCase()}
              </span>
            </div>
          </div>
          <button
            onClick={closeDrawer}
            className="p-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] rounded-lg hover:bg-[var(--surface-hover)] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audit Sheet Summary */}
        <div className="bg-[var(--surface-inset)] p-4 rounded-xl border border-[var(--border)] mb-6">
          <div className="text-xs font-mono font-bold text-[var(--foreground-muted)] mb-3 uppercase">
            Till Reconciliation · Selected Scope
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between bg-[var(--surface-elevated)] p-2 rounded border border-[var(--border)]">
              <span className="text-[var(--foreground-muted)]">Expected till cash:</span>
              <span className="text-[var(--foreground)] font-bold">{formatBDT(portfolio.expectedTillCash)}</span>
            </div>
            <div className="flex justify-between bg-[var(--surface-elevated)] p-2 rounded border border-[var(--border)]">
              <span className="text-[var(--foreground-muted)]">Counted till cash:</span>
              <span className="text-[var(--foreground)] font-bold">{formatBDT(portfolio.countedTillCash)}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--border)] flex justify-between font-mono font-bold text-sm">
            <span className="text-[var(--foreground-muted)]">Net variance:</span>
            <span className="text-[var(--warning)]">{formatVariance(portfolio.cashVariance)}</span>
          </div>
          <div className="mt-3 text-[10px] leading-relaxed text-[var(--foreground-subtle)]">
            Waiver or case resolution applies to the company-wide demo variance, even while viewing a filtered scope.
          </div>
          {state.varianceDeducted && portfolio.cashVariance !== 0 && (
            <div className="mt-2 text-[10px] font-semibold text-[var(--success)]">
              Case opened &amp; recovery scheduled; original route variance remains visible for audit trail.
            </div>
          )}
        </div>

        {/* Responsible JSR Explanation (Defect E1) */}
        {portfolio.cashVariance !== 0 ? (
          <div className="bg-[var(--surface-inset)] p-4 rounded-xl border border-[var(--warning)]/30">
            <div className="flex items-center gap-2 text-[var(--warning)] font-mono font-bold text-xs mb-2">
              <User className="w-4 h-4" />
              <span>JSR Statement — Babul Hossain (Van #3)</span>
            </div>
            <p className="text-xs font-mono text-[var(--foreground)] bg-[var(--surface-elevated)] p-3 rounded border border-[var(--border)] leading-relaxed">
              &quot;Shortage occurred during rush-hour collection at Bogura Link road point when shopkeeper made partial payment with ৳500 note.&quot;
            </p>
            <div className="mt-3 text-[10px] text-[var(--foreground-muted)] flex items-center gap-1.5 font-mono">
              <AlertTriangle className="w-3.5 h-3.5 text-[var(--warning)] shrink-0" />
              <span>Statutory policy: Never auto-deduct wages without formal case review.</span>
            </div>
          </div>
        ) : (
          <div className="bg-[var(--surface-inset)] p-4 rounded-xl border border-[var(--success)]/20 text-xs font-mono text-[var(--foreground-muted)]">
            No cash shortage is allocated to the selected scope.
          </div>
        )}
      </div>

      {/* Actions (Defect E1) */}
      <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between gap-2 text-xs font-mono">
        <button
          onClick={() => openModal('SHORTAGE_CASE')}
          disabled={portfolio.cashVariance === 0 || state.varianceDeducted || state.varianceWaived}
          className="px-4 py-2 bg-[var(--warning)] hover:opacity-90 text-white font-bold rounded-lg transition-all disabled:cursor-not-allowed disabled:opacity-50"
        >
          Open Shortage Case
        </button>
        <button
          onClick={waiveVariance}
          disabled={portfolio.cashVariance === 0 || state.varianceDeducted || state.varianceWaived}
          className="px-4 py-2 bg-[var(--success)] hover:opacity-90 text-white font-bold rounded-lg transition-all disabled:cursor-not-allowed disabled:opacity-50"
        >
          Approve Waiver
        </button>
        <button
          onClick={closeDrawer}
          className="px-4 py-2 bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] rounded-lg border border-[var(--border)]"
        >
          Close
        </button>
      </div>
    </div>
  );
};
