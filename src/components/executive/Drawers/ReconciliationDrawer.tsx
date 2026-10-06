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
    <div className="fixed inset-y-0 right-0 w-full sm:w-[540px] bg-[#111827] border-l border-[#374151] z-50 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-[#1F2937] pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-mono font-extrabold text-white uppercase">
                Till &amp; Route Reconciliation
              </h2>
              <span className="text-[10px] font-mono text-amber-300">
                {portfolio.cashVariance === 0 ? 'SELECTED SCOPE · NO CASH VARIANCE' : state.reconciliationRoute.toUpperCase()}
              </span>
            </div>
          </div>
          <button
            onClick={closeDrawer}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#1F2937] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audit Sheet Summary */}
        <div className="bg-[#0B0F19] p-4 rounded-xl border border-[#374151] mb-6">
          <div className="text-xs font-mono font-bold text-gray-400 mb-3 uppercase">
            Till Reconciliation · Selected Scope
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between bg-[#1F2937] p-2 rounded">
              <span className="text-gray-400">Expected till cash:</span>
              <span className="text-white font-bold">{formatBDT(portfolio.expectedTillCash)}</span>
            </div>
            <div className="flex justify-between bg-[#1F2937] p-2 rounded">
              <span className="text-gray-400">Counted till cash:</span>
              <span className="text-white font-bold">{formatBDT(portfolio.countedTillCash)}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#374151] flex justify-between font-mono font-bold text-sm">
            <span className="text-gray-300">Net variance:</span>
            <span className="text-amber-400">{formatVariance(portfolio.cashVariance)}</span>
          </div>
          <div className="mt-3 text-[10px] leading-relaxed text-gray-500">
            Waiver or case resolution applies to the company-wide demo variance, even while viewing a filtered scope.
          </div>
          {state.varianceDeducted && portfolio.cashVariance !== 0 && (
            <div className="mt-2 text-[10px] font-semibold text-emerald-400">
              Case opened &amp; recovery scheduled; original route variance remains visible for audit trail.
            </div>
          )}
        </div>

        {/* Responsible JSR Explanation (Defect E1) */}
        {portfolio.cashVariance !== 0 ? (
          <div className="bg-[#0B0F19] p-4 rounded-xl border border-amber-500/30">
            <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-xs mb-2">
              <User className="w-4 h-4" />
              <span>JSR Statement — Babul Hossain (Van #3)</span>
            </div>
            <p className="text-xs font-mono text-gray-300 bg-[#1F2937] p-3 rounded border border-[#374151] leading-relaxed">
              &quot;Shortage occurred during rush-hour collection at Bogura Link road point when shopkeeper made partial payment with ৳500 note.&quot;
            </p>
            <div className="mt-3 text-[10px] text-gray-400 flex items-center gap-1.5 font-mono">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Statutory policy: Never auto-deduct wages without formal case review.</span>
            </div>
          </div>
        ) : (
          <div className="bg-[#0B0F19] p-4 rounded-xl border border-emerald-500/20 text-xs font-mono text-gray-300">
            No cash shortage is allocated to the selected scope.
          </div>
        )}
      </div>

      {/* Actions (Defect E1) */}
      <div className="mt-6 pt-4 border-t border-[#1F2937] flex items-center justify-between gap-2 text-xs font-mono">
        <button
          onClick={() => openModal('SHORTAGE_CASE')}
          disabled={portfolio.cashVariance === 0 || state.varianceDeducted || state.varianceWaived}
          className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-lg transition-all disabled:cursor-not-allowed disabled:opacity-50"
        >
          Open Shortage Case
        </button>
        <button
          onClick={waiveVariance}
          disabled={portfolio.cashVariance === 0 || state.varianceDeducted || state.varianceWaived}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-lg transition-all disabled:cursor-not-allowed disabled:opacity-50"
        >
          Approve Waiver
        </button>
        <button
          onClick={closeDrawer}
          className="px-4 py-2 bg-[#1F2937] hover:bg-[#374151] text-gray-300 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};
