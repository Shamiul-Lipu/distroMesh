'use client';

import React from 'react';
import { useExecutive } from '../../context/ExecutiveContext';
import { formatBDT, formatPercent } from '../../utils/formatters';
import { CreditCard, ShieldAlert, ArrowRight, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

export const CreditExposure: React.FC = () => {
  const { state, openModal } = useExecutive();

  const creditRatio = (state.freshCredit / state.todaySales) * 100;
  const isCreditLocked = state.creditLockActive;

  let riskStatus: 'SAFE' | 'WATCH' | 'HIGH RISK' = 'SAFE';
  let badgeColor = 'bg-emerald-950 text-emerald-400 border-emerald-800';

  if (creditRatio > 45) {
    riskStatus = 'HIGH RISK';
    badgeColor = 'bg-red-950 text-red-400 border-red-800 animate-pulse';
  } else if (creditRatio > 35) {
    riskStatus = 'WATCH';
    badgeColor = 'bg-amber-950 text-amber-300 border-amber-800';
  }

  const cashCollectedPortion = state.todaySales - state.freshCredit;

  return (
    <div className="bg-[#111827] border border-[#374151] rounded-xl p-5 shadow-xl flex flex-col justify-between">
      {/* Module Title */}
      <div className="flex items-center justify-between mb-4 border-b border-[#1F2937] pb-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-amber-500"></div>
          <h2 className="text-base font-bold text-[#F9FAFB] tracking-tight uppercase font-sans">
            Credit Exposure & Risk Control
          </h2>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${badgeColor}`}>
            CREDIT WATCH: {riskStatus}
          </span>
        </div>
        <button
          onClick={() => openModal('CREDIT_LOCK')}
          className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 hover:underline"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Credit Lock Control</span>
        </button>
      </div>

      {/* Main Figures Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* Fresh Credit */}
        <div className="bg-[#0B0F19] p-3 rounded-lg border border-[#374151]">
          <div className="text-[11px] font-mono text-[#9CA3AF] uppercase">Fresh Market Credit Today</div>
          <div className="text-xl font-mono font-bold text-amber-400 mt-1">
            {formatBDT(state.freshCredit)}
          </div>
          <div className="text-[10px] font-mono text-gray-400 mt-1">
            Extended across 6 beats
          </div>
        </div>

        {/* Credit Ratio Gauge */}
        <div className="bg-[#0B0F19] p-3 rounded-lg border border-[#374151]">
          <div className="text-[11px] font-mono text-[#9CA3AF] uppercase">Credit-to-Sales Ratio</div>
          <div className="text-xl font-mono font-bold text-white mt-1">
            {formatPercent(creditRatio)}
          </div>
          <div className="text-[10px] font-mono text-amber-400 mt-1">
            Threshold: Max 35.0%
          </div>
        </div>

        {/* Credit Lock Status */}
        <div className={`p-3 rounded-lg border ${
          isCreditLocked ? 'bg-indigo-950/60 border-indigo-500' : 'bg-[#0B0F19] border-[#374151]'
        }`}>
          <div className="text-[11px] font-mono text-[#9CA3AF] uppercase">Executive Supply Lock</div>
          <div className="text-base font-mono font-bold text-white mt-1 flex items-center gap-1.5">
            {isCreditLocked ? (
              <span className="text-indigo-400 font-bold flex items-center gap-1 text-sm">
                <Lock className="w-4 h-4 text-indigo-400" />
                ACTIVE (7 RETAILERS)
              </span>
            ) : (
              <span className="text-gray-400 text-sm">INACTIVE</span>
            )}
          </div>
          <div className="text-[10px] font-mono text-gray-400 mt-1">
            {isCreditLocked ? '৳84,000 exposure locked' : 'No supply holds'}
          </div>
        </div>
      </div>

      {/* Structured Relationship Diagram */}
      <div className="bg-[#0B0F19] p-4 rounded-lg border border-[#374151]">
        <div className="text-xs font-mono font-semibold text-[#9CA3AF] mb-3 uppercase">
          Sales → Liquidity & Credit Flow Relationship
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center text-xs font-mono">
          {/* Sales */}
          <div className="flex-1 w-full bg-[#1F2937] p-2.5 rounded border border-[#374151]">
            <div className="text-[10px] text-gray-400 uppercase">Today's Total Sales</div>
            <div className="text-sm font-bold text-white mt-0.5">{formatBDT(state.todaySales)}</div>
          </div>

          <ArrowRight className="w-4 h-4 text-gray-500 hidden sm:block" />

          {/* Breakdown */}
          <div className="flex-1 w-full bg-[#1F2937] p-2.5 rounded border border-[#374151] flex justify-around">
            <div>
              <div className="text-[10px] text-emerald-400 uppercase">Cash ({(100 - creditRatio).toFixed(1)}%)</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">{formatBDT(cashCollectedPortion)}</div>
            </div>
            <div className="border-r border-[#374151]"></div>
            <div>
              <div className="text-[10px] text-amber-400 uppercase">Credit ({creditRatio.toFixed(1)}%)</div>
              <div className="text-sm font-bold text-amber-400 mt-0.5">{formatBDT(state.freshCredit)}</div>
            </div>
          </div>

          <ArrowRight className="w-4 h-4 text-gray-500 hidden sm:block" />

          {/* Risk Outcome */}
          <div className={`flex-1 w-full p-2.5 rounded border ${
            riskStatus === 'SAFE'
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
              : 'bg-amber-950/40 border-amber-800 text-amber-300'
          }`}>
            <div className="text-[10px] uppercase">Market Collection Risk</div>
            <div className="text-sm font-bold mt-0.5">
              {riskStatus === 'SAFE' ? 'LOW RISK' : `EXPOSED: ${formatBDT(state.freshCredit)}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
