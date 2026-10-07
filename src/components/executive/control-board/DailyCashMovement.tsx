'use client';

import React from 'react';
import { ArrowDownRight, ArrowUpRight, ArrowRight, CircleDollarSign } from 'lucide-react';
import { useExecutive } from '../../../context/ExecutiveContext';
import { popyTodaySnapshot } from '../../../data/seedData';
import { formatBDT } from '../../../utils/formatters';

export const DailyCashMovement: React.FC = () => {
  const { state } = useExecutive();

  // Inflows: Cash sales collected + Old dues collected
  const cashSales = popyTodaySnapshot.cashSales; // ৳5,80,000
  const oldDues = popyTodaySnapshot.oldDuesCollected; // ৳2,80,000
  const totalInflow = cashSales + oldDues; // ৳8,60,000

  // Outflow: Cash expenses paid by vans (fuel, tolls, lunch)
  const totalOutflow = popyTodaySnapshot.routeCashExpenses; // ৳14,400

  // Net Cash Generated Today
  const netDailyCash = totalInflow - totalOutflow; // ৳8,45,600

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 shadow-xs flex flex-col justify-between text-[var(--foreground)] backdrop-blur-md transition-colors duration-200">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <CircleDollarSign size={14} className="text-emerald-500" />
          <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--foreground)]">
            {state.banglaMode ? 'দৈনিক নগদ প্রবাহ (ক্যাশ মুভমেন্ট)' : 'DAILY NET CASH MOVEMENT'}
          </h2>
        </div>
        <span className="text-[9px] font-mono text-[var(--foreground-muted)] bg-[var(--surface-elevated)] px-2 py-0.5 rounded border border-[var(--border)]">
          {state.banglaMode ? 'রুট কালেকশন বনাম খরচ' : 'TODAY LIVE SWEEP'}
        </span>
      </div>

      {/* Opposing Forces Flow: Inflow vs Outflow vs Net */}
      <div className="mt-3.5 grid grid-cols-1 md:grid-cols-3 gap-3 items-center font-mono">
        {/* Force 1: Inflow */}
        <div className="rounded-xl bg-emerald-500/10 p-3.5 border border-emerald-500/20 relative dm-interactive">
          <div className="flex items-center justify-between text-[10px] text-emerald-400 uppercase font-bold">
            <span className="flex items-center gap-1 text-emerald-400">
              <ArrowUpRight size={13} />
              {state.banglaMode ? 'নগদ অন্তর্প্রবাহ' : 'INFLOW'}
            </span>
            <span>+60.4% Cash Conv</span>
          </div>
          <div className="mt-1 text-xl sm:text-2xl font-bold text-emerald-400 dm-tabular">
            +{formatBDT(totalInflow, { mode: 'exact', bangla: state.banglaMode })}
          </div>
          <div className="mt-1 text-[9px] text-[var(--foreground-muted)] space-y-0.5 pt-1.5 border-t border-emerald-500/20">
            <div className="flex justify-between">
              <span>Cash Sales:</span>
              <span className="text-[var(--foreground)] font-semibold dm-tabular">{formatBDT(cashSales, { mode: 'summary', bangla: state.banglaMode })}</span>
            </div>
            <div className="flex justify-between">
              <span>Old Dues:</span>
              <span className="text-[var(--foreground)] font-semibold dm-tabular">{formatBDT(oldDues, { mode: 'summary', bangla: state.banglaMode })}</span>
            </div>
          </div>
        </div>

        {/* Force 2: Outflow */}
        <div className="rounded-xl bg-rose-500/10 p-3.5 border border-rose-500/20 relative dm-interactive">
          <div className="flex items-center justify-between text-[10px] text-rose-400 uppercase font-bold">
            <span className="flex items-center gap-1 text-rose-400">
              <ArrowDownRight size={13} />
              {state.banglaMode ? 'নগদ বহিঃপ্রবাহ' : 'OUTFLOW'}
            </span>
            <span>12 Van Vouchers</span>
          </div>
          <div className="mt-1 text-xl sm:text-2xl font-bold text-rose-400 dm-tabular">
            −{formatBDT(totalOutflow, { mode: 'exact', bangla: state.banglaMode })}
          </div>
          <div className="mt-1 text-[9px] text-[var(--foreground-muted)] space-y-0.5 pt-1.5 border-t border-rose-500/20">
            <div className="flex justify-between">
              <span>Fuel &amp; CNG:</span>
              <span className="text-[var(--foreground)] font-semibold dm-tabular">৳9,200</span>
            </div>
            <div className="flex justify-between">
              <span>Labor &amp; Toll:</span>
              <span className="text-[var(--foreground)] font-semibold dm-tabular">৳5,200</span>
            </div>
          </div>
        </div>

        {/* Result: Net Position */}
        <div className="rounded-xl bg-[var(--surface-elevated)] p-3.5 border border-[var(--border)] relative shadow-2xs dm-interactive">
          <div className="flex items-center justify-between text-[10px] uppercase text-[var(--foreground-muted)]">
            <span className="flex items-center gap-1 text-[var(--foreground)] font-bold">
              <ArrowRight size={13} />
              {state.banglaMode ? 'নেট অবস্থান' : 'NET POSITION'}
            </span>
            <span className="text-emerald-400 font-bold">+98.3% Retention</span>
          </div>
          <div className="mt-1 text-xl sm:text-2xl font-bold text-[var(--foreground)] dm-tabular">
            +{formatBDT(netDailyCash, { mode: 'exact', bangla: state.banglaMode })}
          </div>
          <div className="mt-1 text-[9px] text-[var(--foreground-muted)] space-y-0.5 pt-1.5 border-t border-[var(--border)]">
            <div className="flex justify-between">
              <span>Opening Float:</span>
              <span className="text-[var(--foreground)] font-semibold dm-tabular">+৳50,000</span>
            </div>
            <div className="flex justify-between">
              <span>Expected in Till:</span>
              <span className="text-[var(--foreground)] font-semibold dm-tabular">৳8,95,600</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-[var(--border)] flex items-center justify-between text-[9px] font-mono text-[var(--foreground-muted)]">
        <span>Identity: Handed In (৳8.6 L) − Expenses (৳14,400) = Net Till Cash</span>
        <span>Zero-leakage audited</span>
      </div>
    </div>
  );
};
