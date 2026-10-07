'use client';

import React from 'react';
import { TrendingDown } from 'lucide-react';
import { useExecutive } from '../../../context/ExecutiveContext';
import { formatBDT, formatCompactBDT } from '../../../utils/formatters';

interface UpcomingObligationCardProps {
  amountDue?: number;
  dueHours?: number;
  coveragePct?: number;
  postDebitRemaining?: number;
  principalName?: string;
  className?: string;
  onOpenObligation?: () => void;
}

export const UpcomingObligationCard: React.FC<UpcomingObligationCardProps> = ({
  amountDue,
  dueHours,
  coveragePct: customCoverage,
  postDebitRemaining: customPostDebit,
  principalName,
  className = '',
  onOpenObligation,
}) => {
  const { state, openDrawer } = useExecutive();

  const liquidCash = state.bankCash + state.vaultCash;
  const obligation = amountDue !== undefined ? amountDue : (state.upcomingObligation || 2070000);
  const coverage = customCoverage !== undefined
    ? customCoverage
    : (obligation > 0 ? Number(((liquidCash / obligation) * 100).toFixed(1)) : 100);
  const remaining = customPostDebit !== undefined
    ? customPostDebit
    : (liquidCash - obligation);

  const isSafe = remaining >= 0;
  const hoursLeft = dueHours !== undefined ? dueHours : (state.obligationDueHours || 48);

  const handleClick = () => {
    if (onOpenObligation) {
      onOpenObligation();
    } else {
      openDrawer('OBLIGATION');
    }
  };

  return (
    <div className={`rounded-xl border border-[#1F2937] bg-[#0E131F] p-4 sm:p-5 shadow-lg flex flex-col justify-between text-white ${className}`}>
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold tracking-tight text-white font-sans">
              Upcoming Principal Obligation
            </h3>
          </div>
          <span className={`text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded border uppercase ${
            isSafe
              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800'
              : 'bg-red-950/40 text-red-400 border-red-800'
          }`}>
            {isSafe ? 'SAFE' : 'CRITICAL'}
          </span>
        </div>
        <p className="text-[11px] font-sans text-gray-400">
          Auto-debit scheduled — {principalName || 'principal repayment'}
        </p>

        {/* Hero Row: Amount Due & Due In */}
        <div className="mt-4 grid grid-cols-2 gap-4 pb-3 border-b border-[#1F2937]">
          <div>
            <div className="text-[10px] font-mono uppercase text-gray-400 tracking-wider">
              AMOUNT DUE
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-400 mt-0.5">
              {formatCompactBDT(obligation)}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase text-gray-400 tracking-wider">
              DUE IN
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-white mt-0.5">
              {hoursLeft}h
            </div>
          </div>
        </div>

        {/* Secondary Metric Rows */}
        <div className="mt-3 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Current Cash Coverage</span>
            <span className="text-emerald-400 font-bold">{coverage}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Post-Debit Remaining</span>
            <span className={`font-bold ${isSafe ? 'text-emerald-400' : 'text-red-400'}`}>
              {remaining >= 0 ? '+' : ''}{formatCompactBDT(remaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Link */}
      <button
        onClick={handleClick}
        className="mt-4 pt-3 border-t border-[#1F2937] text-left text-[11px] font-sans text-gray-400 hover:text-emerald-400 transition-colors flex items-center justify-between group"
      >
        <span>Principal auto-debit in {hoursLeft} hours. Click for schedule →</span>
      </button>
    </div>
  );
};
