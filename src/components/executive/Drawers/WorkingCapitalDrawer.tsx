'use client';

import React from 'react';
import { useExecutive } from '@/context/ExecutiveContext.tsx';
import { X, Layers, Store, Box, FileCheck2 } from 'lucide-react';
import { formatBDT } from '@/utils/formatters.ts';

export const WorkingCapitalDrawer: React.FC = () => {
  const { state, closeDrawer } = useExecutive();

  if (state.activeDrawer !== 'WORKING_CAPITAL') return null;

  const {
    receivables,
    inventory,
    schemeClaimsPending,
    damageClaimsPending,
    payables,
    netOperatingWorkingCapital,
  } = state.workingCapital;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[540px] bg-[var(--surface-elevated)] border-l border-[var(--border)] text-[var(--foreground)] z-50 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[var(--accent-soft)] text-[var(--accent)] rounded-lg border border-[var(--accent)]/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-mono font-extrabold text-[var(--foreground)] uppercase">
                Net Operating Working Capital Audit
              </h2>
              <span className="text-[10px] font-mono text-[var(--accent)]">CLOSING STOCK BASIS · ACCRUAL</span>
            </div>
          </div>
          <button
            onClick={closeDrawer}
            className="p-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] rounded-lg hover:bg-[var(--surface-hover)] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reconciled Headline (Defect A6) */}
        <div className="bg-[var(--surface-inset)] border border-[var(--accent)]/30 rounded-xl p-4 mb-6">
          <div className="text-xs font-mono font-bold text-[var(--accent)] mb-1 uppercase">
            Net Operating Working Capital (NOWC)
          </div>
          <div className="text-xl font-mono font-bold text-[var(--foreground)] mb-2">
            {formatBDT(netOperatingWorkingCapital)}
          </div>
          <p className="text-xs font-mono text-[var(--foreground-muted)] leading-relaxed">
            &quot;Net operating working capital = receivables + inventory + claims receivable − supplier payables. Stock valued at closing inventory cost.&quot;
          </p>
        </div>

        {/* Detailed breakdown */}
        <div className="space-y-4 text-xs font-mono">
          {/* 1. Retailer Receivables */}
          <div className="bg-[var(--surface-inset)] p-4 rounded-xl border border-[var(--border)]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-[var(--accent)] font-bold">
                <Store className="w-4 h-4" />
                <span>1. CUSTOMER RECEIVABLES (DSO 24)</span>
              </div>
              <span className="font-bold text-[var(--foreground)] text-sm">{formatBDT(receivables)}</span>
            </div>
            <p className="text-[var(--foreground-muted)] mb-3 text-[11px]">
              Active market credit extended to retail shops across Sherpur &amp; Bogura beats.
            </p>
            <div className="space-y-1.5 text-[11px] bg-[var(--surface-elevated)] p-3 rounded border border-[var(--border)]">
              <div className="flex justify-between">
                <span className="text-[var(--foreground-muted)]">Current (&lt; 15 Days, 55%):</span>
                <span className="text-[var(--success)] font-bold">{formatBDT(Math.round(receivables * 0.55))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--foreground-muted)]">Overdue (16–30 Days, 27%):</span>
                <span className="text-[var(--warning)] font-bold">{formatBDT(Math.round(receivables * 0.27))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--foreground-muted)]">Past-Due (&gt; 30 Days, 18%):</span>
                <span className="text-[var(--danger)] font-bold">{formatBDT(Math.round(receivables * 0.18))}</span>
              </div>
            </div>
          </div>

          {/* 2. Warehouse Inventory */}
          <div className="bg-[var(--surface-inset)] p-4 rounded-xl border border-[var(--border)]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-[var(--accent)] font-bold">
                <Box className="w-4 h-4" />
                <span>2. WAREHOUSE INVENTORY STOCK (DIO 20)</span>
              </div>
              <span className="font-bold text-[var(--foreground)] text-sm">{formatBDT(inventory)}</span>
            </div>
            <p className="text-[var(--foreground-muted)] mb-3 text-[11px]">
              Physical FMCG stock held at central Sherpur warehouse on closing stock basis.
            </p>
          </div>

          {/* 3. Scheme Claims & Damage Claims (Defect A5) */}
          <div className="bg-[var(--surface-inset)] p-4 rounded-xl border border-[var(--border)]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-[var(--accent)] font-bold">
                <FileCheck2 className="w-4 h-4" />
                <span>3. CLAIMS RECEIVABLE REGISTER</span>
              </div>
              <span className="font-bold text-[var(--foreground)] text-sm">
                {formatBDT(schemeClaimsPending + damageClaimsPending)}
              </span>
            </div>
            <p className="text-[var(--foreground-muted)] mb-3 text-[11px]">
              Promotional scheme rebates (0.5% scale) and transit damage claims pending principal audit.
            </p>
            <div className="space-y-1.5 text-[11px] bg-[var(--surface-elevated)] p-3 rounded border border-[var(--border)]">
              <div className="flex justify-between">
                <span className="text-[var(--foreground-muted)]">Scheme Claims Pending:</span>
                <span className="text-[var(--accent)] font-bold">{formatBDT(schemeClaimsPending)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--foreground-muted)]">Damage Claims Pending:</span>
                <span className="text-[var(--accent)] font-bold">{formatBDT(damageClaimsPending)}</span>
              </div>
            </div>
          </div>

          {/* 4. Supplier Payables */}
          <div className="bg-[var(--surface-inset)] p-4 rounded-xl border border-[var(--danger)]/30">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[var(--danger)] font-bold">4. SUPPLIER PAYABLES (DPO 28)</span>
              <span className="font-bold text-[var(--foreground)] text-sm">−{formatBDT(payables)}</span>
            </div>
            <p className="text-[var(--foreground-muted)] text-[11px]">
              Trade credit obligations due to principal for primary dispatches.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-[var(--border)] flex justify-end">
        <button
          onClick={closeDrawer}
          className="px-5 py-2 bg-[var(--accent)] hover:bg-[var(--accent-bright)] text-white font-mono text-xs font-bold rounded-lg transition-all active:scale-[0.98]"
        >
          Close Drawer
        </button>
      </div>
    </div>
  );
};
