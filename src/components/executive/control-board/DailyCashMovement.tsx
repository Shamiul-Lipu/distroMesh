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
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 sm:p-5 shadow-sm flex flex-col justify-between text-slate-800">
      <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
        <div className="flex items-center gap-2">
          <CircleDollarSign size={14} className="text-emerald-700" />
          <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-800">
            {state.banglaMode ? 'দৈনিক নগদ প্রবাহ (ক্যাশ মুভমেন্ট)' : 'DAILY NET CASH MOVEMENT'}
          </h2>
        </div>
        <span className="text-[9px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          {state.banglaMode ? 'রুট কালেকশন বনাম খরচ' : 'TODAY LIVE SWEEP'}
        </span>
      </div>

      {/* Opposing Forces Flow: Inflow vs Outflow vs Net */}
      <div className="mt-3.5 grid grid-cols-1 md:grid-cols-3 gap-3 items-center font-mono">
        {/* Force 1: Inflow */}
        <div className="rounded-lg bg-emerald-50/60 p-3 border border-emerald-200/80 relative">
          <div className="flex items-center justify-between text-[10px] text-emerald-800 uppercase">
            <span className="flex items-center gap-1 text-emerald-700 font-bold">
              <ArrowUpRight size={13} />
              {state.banglaMode ? 'নগদ অন্তর্প্রবাহ' : 'INFLOW'}
            </span>
            <span className="text-emerald-700 font-bold">+60.4% Cash Conv</span>
          </div>
          <div className="mt-1 text-xl sm:text-2xl font-bold text-emerald-700">
            +{formatBDT(totalInflow, { mode: 'exact', bangla: state.banglaMode })}
          </div>
          <div className="mt-1 text-[9px] text-slate-600 space-y-0.5 pt-1.5 border-t border-emerald-200/60">
            <div className="flex justify-between">
              <span>Cash Sales:</span>
              <span className="text-slate-800 font-semibold">{formatBDT(cashSales, { mode: 'summary', bangla: state.banglaMode })}</span>
            </div>
            <div className="flex justify-between">
              <span>Old Dues:</span>
              <span className="text-slate-800 font-semibold">{formatBDT(oldDues, { mode: 'summary', bangla: state.banglaMode })}</span>
            </div>
          </div>
        </div>

        {/* Force 2: Outflow */}
        <div className="rounded-lg bg-rose-50/60 p-3 border border-rose-200/80 relative">
          <div className="flex items-center justify-between text-[10px] text-rose-800 uppercase">
            <span className="flex items-center gap-1 text-rose-700 font-bold">
              <ArrowDownRight size={13} />
              {state.banglaMode ? 'নগদ বহিঃপ্রবাহ' : 'OUTFLOW'}
            </span>
            <span className="text-rose-700 font-bold">12 Van Vouchers</span>
          </div>
          <div className="mt-1 text-xl sm:text-2xl font-bold text-rose-700">
            −{formatBDT(totalOutflow, { mode: 'exact', bangla: state.banglaMode })}
          </div>
          <div className="mt-1 text-[9px] text-slate-600 space-y-0.5 pt-1.5 border-t border-rose-200/60">
            <div className="flex justify-between">
              <span>Fuel &amp; CNG:</span>
              <span className="text-slate-800 font-semibold">৳9,200</span>
            </div>
            <div className="flex justify-between">
              <span>Labor &amp; Toll:</span>
              <span className="text-slate-800 font-semibold">৳5,200</span>
            </div>
          </div>
        </div>

        {/* Result: Net Position */}
        <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 relative shadow-2xs">
          <div className="flex items-center justify-between text-[10px] uppercase text-slate-600">
            <span className="flex items-center gap-1 text-slate-800 font-bold">
              <ArrowRight size={13} />
              {state.banglaMode ? 'নেট অবস্থান' : 'NET POSITION'}
            </span>
            <span className="text-emerald-700 font-bold">+98.3% Retention</span>
          </div>
          <div className="mt-1 text-xl sm:text-2xl font-bold text-slate-900">
            +{formatBDT(netDailyCash, { mode: 'exact', bangla: state.banglaMode })}
          </div>
          <div className="mt-1 text-[9px] text-slate-600 space-y-0.5 pt-1.5 border-t border-slate-200">
            <div className="flex justify-between">
              <span>Opening Float:</span>
              <span className="text-slate-800 font-medium">+{formatBDT(popyTodaySnapshot.openingFloat, { mode: 'summary', bangla: state.banglaMode })}</span>
            </div>
            <div className="flex justify-between font-bold text-emerald-700">
              <span>Expected in Till:</span>
              <span>{formatBDT(popyTodaySnapshot.expectedTill, { mode: 'exact', bangla: state.banglaMode })}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-[#e2e8f0] flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>Identity: Handed In ({formatBDT(totalInflow, { mode: 'summary' })}) − Expenses ({formatBDT(totalOutflow, { mode: 'summary' })}) = Net Till Cash</span>
        <span className="text-slate-400">Zero-leakage audited</span>
      </div>
    </div>
  );
};
