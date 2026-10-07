'use client';

import React from 'react';
import { Layers, ArrowUpRight, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useExecutive } from '../../../context/ExecutiveContext';
import { formatBDT } from '../../../utils/formatters';

interface TrappedCapitalMatrixProps {
  onInspectWorkingCapital?: () => void;
}

export const TrappedCapitalMatrix: React.FC<TrappedCapitalMatrixProps> = ({
  onInspectWorkingCapital,
}) => {
  const { state } = useExecutive();
  const wc = state.workingCapital;

  // Capital components
  const receivables = wc.receivables; // ৳1,97,00,000 (55.8%)
  const inventory = wc.inventory; // ৳1,54,00,000 (43.6%)
  const claims = wc.schemeClaimsPending + wc.damageClaimsPending; // ৳2,05,000 (0.6%)
  const grossTrappedCapital = receivables + inventory + claims; // ৳3,53,05,000
  const payables = wc.payables; // ৳2,15,00,000
  const nowc = wc.netOperatingWorkingCapital; // ৳1,37,00,000

  // Calculate proportional percentages of gross trapped capital
  const pctReceivables = ((receivables / grossTrappedCapital) * 100).toFixed(1);
  const pctInventory = ((inventory / grossTrappedCapital) * 100).toFixed(1);
  const pctClaims = ((claims / grossTrappedCapital) * 100).toFixed(1);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 flex flex-col justify-between shadow-xs text-[var(--foreground)] backdrop-blur-md transition-colors duration-200">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-amber-500" />
            <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--foreground)]">
              {state.banglaMode ? 'আটকে থাকা কার্যকরী মূলধন' : 'TRAPPED WORKING CAPITAL MATRIX'}
            </h2>
          </div>
          {onInspectWorkingCapital && (
            <button
              onClick={onInspectWorkingCapital}
              className="text-[10px] font-mono text-[var(--foreground-muted)] hover:text-emerald-500 flex items-center gap-1 transition"
            >
              <span>{state.banglaMode ? 'NOWC ওয়াটারফল' : 'NOWC Breakdown'}</span>
              <ArrowUpRight size={11} />
            </button>
          )}
        </div>

        {/* Headline: Gross Trapped Capital */}
        <div className="mt-3 flex items-baseline justify-between font-mono">
          <div>
            <span className="text-[10px] text-[var(--foreground-muted)] uppercase block font-semibold">
              {state.banglaMode ? 'অনুপলব্ধ কার্যকরী মূলধন' : 'TOTAL CAPITAL LOCKED IN CYCLE'}
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight dm-tabular">
              {formatBDT(grossTrappedCapital, { mode: 'exact', bangla: state.banglaMode })}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[var(--foreground-muted)] uppercase block font-semibold">
              {state.banglaMode ? 'নেট কার্যকরী মূলধন (NOWC)' : 'NET OPERATING (NOWC)'}
            </span>
            <div className="text-lg font-bold text-emerald-500 dm-tabular">
              {formatBDT(nowc, { mode: 'summary', bangla: state.banglaMode })}
            </div>
          </div>
        </div>

        {/* Proportional Exposure Visual Bar */}
        <div className="mt-3">
          <div className="h-2 w-full rounded-full bg-[var(--surface-inset)] flex overflow-hidden border border-[var(--border-subtle)]">
            <div
              style={{ width: `${pctReceivables}%` }}
              className="h-full bg-amber-500 hover:bg-amber-400 transition"
              title={`Retailer Credit: ${pctReceivables}%`}
            />
            <div
              style={{ width: `${pctInventory}%` }}
              className="h-full bg-sky-500 hover:bg-sky-400 transition"
              title={`Warehouse Inventory: ${pctInventory}%`}
            />
            <div
              style={{ width: `${pctClaims}%` }}
              className="h-full bg-purple-500 hover:bg-purple-400 transition"
              title={`Principal Claims: ${pctClaims}%`}
            />
          </div>
          <div className="mt-1 flex items-center justify-between text-[9px] font-mono text-[var(--foreground-muted)]">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              <span>Credit ({pctReceivables}%)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
              <span>Inventory ({pctInventory}%)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
              <span>Claims ({pctClaims}%)</span>
            </span>
          </div>
        </div>

        {/* Proportional Capital Map (Allocated Visual Weight) */}
        <div className="mt-4 space-y-2 font-mono">
          {/* 1. Retailer Credit (Largest Exposure - Proportional Emphasis) */}
          <div className="rounded-xl bg-amber-500/10 p-3 border border-amber-500/20 relative overflow-hidden dm-interactive">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wide">
                  {state.banglaMode ? '১. খুচরা বাজারের বাকি (ক্রেডিট)' : '1. RETAILER CREDIT EXPOSURE'}
                </span>
                <div className="text-base font-bold text-[var(--foreground)] mt-0.5 dm-tabular">
                  {formatBDT(receivables, { mode: 'exact', bangla: state.banglaMode })}
                  <span className="text-[10px] text-[var(--foreground-muted)] font-normal ml-1.5">
                    ({pctReceivables}% of trapped capital)
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30 font-bold">
                  <AlertTriangle size={10} />
                  <span>18.0% Overdue &gt;30d</span>
                </span>
                <span className="block text-[9px] text-[var(--foreground-muted)] mt-1">
                  ৳35.5L at risk of default
                </span>
              </div>
            </div>
          </div>

          {/* 2. Warehouse Inventory (Second Largest Exposure) */}
          <div className="rounded-xl bg-sky-500/10 p-2.5 border border-sky-500/20 relative overflow-hidden dm-interactive">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500" />
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wide">
                  {state.banglaMode ? '২. গুদামজাত পণ্যের স্টক (ইনভেন্টরি)' : '2. WAREHOUSE INVENTORY'}
                </span>
                <div className="text-sm font-bold text-[var(--foreground)] mt-0.5 dm-tabular">
                  {formatBDT(inventory, { mode: 'exact', bangla: state.banglaMode })}
                  <span className="text-[10px] text-[var(--foreground-muted)] font-normal ml-1.5">
                    ({pctInventory}% of trapped capital)
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-[10px] text-sky-400 bg-sky-500/20 px-2 py-0.5 rounded border border-sky-500/30 font-bold">
                  <ShieldCheck size={10} />
                  <span>18.5 Days Cover</span>
                </span>
                <span className="block text-[9px] text-[var(--foreground-muted)] mt-1">
                  7,997 physical units
                </span>
              </div>
            </div>
          </div>

          {/* 3. Principal Claims & Schemes (Subordinate Exposure) */}
          <div className="rounded-xl bg-[var(--surface-elevated)] p-2 border border-[var(--border)] relative overflow-hidden dm-interactive">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500" />
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wide">
                  {state.banglaMode ? '৩. কোম্পানির অনিষ্পন্ন দাবি ও স্কিম' : '3. UNCLAIMED PRINCIPAL CLAIMS'}
                </span>
                <div className="text-sm font-bold text-[var(--foreground)] mt-0.5 dm-tabular">
                  {formatBDT(claims, { mode: 'exact', bangla: state.banglaMode })}
                  <span className="text-[10px] text-[var(--foreground-muted)] font-normal ml-1.5">
                    ({pctClaims}%)
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[var(--foreground)] font-semibold">
                  Unilever Scheme &amp; Damage
                </span>
                <span className="block text-[9px] text-[var(--foreground-muted)] mt-0.5">
                  Awaiting rebate credit note
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payables offset note */}
      <div className="mt-3 pt-2.5 border-t border-[var(--border)] flex items-center justify-between text-[10px] font-mono text-[var(--foreground-muted)]">
        <span>Principal Trade Payables: <strong className="text-[var(--foreground)] dm-tabular">{formatBDT(payables, { mode: 'summary', bangla: state.banglaMode })}</strong></span>
        <span className="text-[var(--foreground-muted)] font-medium">Cycle: 16.0 Days CCC</span>
      </div>
    </div>
  );
};
