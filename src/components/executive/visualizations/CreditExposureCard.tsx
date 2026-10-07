'use client';

import React from 'react';
import { CreditCard, ArrowDown, AlertTriangle } from 'lucide-react';
import { useExecutive } from '../../../context/ExecutiveContext';
import { formatBDT } from '../../../utils/formatters';

interface CreditExposureCardProps {
  className?: string;
  freshCredit?: number;
  todaySales?: number;
  creditRatio?: number;
  onOpenCreditLock?: () => void;
}

export const CreditExposureCard: React.FC<CreditExposureCardProps> = ({
  className = '',
  freshCredit: propFreshCredit,
  todaySales: propTodaySales,
  creditRatio: propCreditRatio,
  onOpenCreditLock,
}) => {
  const { state, openModal } = useExecutive();

  const freshCredit = propFreshCredit ?? state.freshCredit ?? 190000;
  const todaySales = propTodaySales ?? state.todaySales ?? 480000;
  const calculatedCreditRatio = todaySales > 0 ? ((freshCredit / todaySales) * 100).toFixed(1) : '0.0';
  const creditRatio = propCreditRatio !== undefined ? propCreditRatio.toFixed(1) : calculatedCreditRatio;
  const cashSales = Math.max(0, todaySales - freshCredit);

  let riskBadge = 'WATCH';
  let badgeClasses = 'bg-amber-950/40 text-amber-400 border-amber-800';

  if (Number(creditRatio) > 45) {
    riskBadge = 'HIGH RISK';
    badgeClasses = 'bg-red-950/40 text-red-400 border-red-800 animate-pulse';
  } else if (Number(creditRatio) <= 35) {
    riskBadge = 'SAFE';
    badgeClasses = 'bg-emerald-950/40 text-emerald-400 border-emerald-800';
  }

  const handleClick = () => {
    if (onOpenCreditLock) {
      onOpenCreditLock();
    } else {
      openModal('CREDIT_LOCK');
    }
  };

  return (
    <div className={`rounded-xl border border-[#1F2937] bg-[#0E131F] p-4 sm:p-5 shadow-lg flex flex-col justify-between text-white ${className}`}>
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-semibold tracking-tight text-white font-sans">
              Credit Exposure
            </h3>
          </div>
          <span className={`text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded border uppercase flex items-center gap-1 ${badgeClasses}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            {riskBadge}
          </span>
        </div>
        <p className="text-[11px] font-sans text-gray-400">
          Today&apos;s sales composition and collection risk
        </p>

        {/* Figures Row */}
        <div className="mt-3.5 grid grid-cols-2 gap-4 pb-3 border-b border-[#1F2937] font-mono">
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">
              FRESH RETAILER CREDIT
            </div>
            <div className="text-2xl font-bold text-amber-400 mt-0.5">
              {formatBDT(freshCredit, { mode: 'summary' })}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">
              CREDIT RATIO
            </div>
            <div className="text-2xl font-bold text-white mt-0.5">
              {creditRatio}%
            </div>
          </div>
        </div>

        {/* Structured Sales Flow Diagram */}
        <div className="mt-3">
          <div className="text-[10px] font-mono text-gray-400 uppercase mb-2 tracking-wider">
            TODAY&apos;S SALES FLOW
          </div>

          {/* 1. Total Sales Box */}
          <div className="p-2.5 rounded-lg bg-[#0B0F19] border border-[#1F2937] flex items-center justify-between font-mono text-xs">
            <span className="text-gray-300">Total Sales</span>
            <span className="font-bold text-white">{formatBDT(todaySales, { mode: 'summary' })}</span>
          </div>

          {/* Flow Connector Arrow */}
          <div className="flex justify-center my-1 text-gray-500">
            <ArrowDown className="w-3.5 h-3.5" />
          </div>

          {/* 2. Split Cash vs Credit Box */}
          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            <div className="p-2 rounded-lg bg-[#0B0F19] border border-[#1F2937]">
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 uppercase font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>CASH</span>
              </div>
              <div className="text-xs font-bold text-emerald-400 mt-0.5">
                {formatBDT(cashSales, { mode: 'summary' })}
              </div>
            </div>

            <div className="p-2 rounded-lg bg-[#0B0F19] border border-[#1F2937]">
              <div className="flex items-center gap-1.5 text-[10px] text-amber-400 uppercase font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>MARKET CREDIT</span>
              </div>
              <div className="text-xs font-bold text-amber-400 mt-0.5">
                {formatBDT(freshCredit, { mode: 'summary' })}
              </div>
            </div>
          </div>

          {/* Flow Connector Arrow */}
          <div className="flex justify-center my-1 text-gray-500">
            <ArrowDown className="w-3.5 h-3.5" />
          </div>

          {/* 3. Collection Risk Callout Box */}
          <div
            onClick={handleClick}
            className="p-2 rounded-lg bg-[#16120B] border border-amber-900/50 flex items-center justify-between text-xs font-mono cursor-pointer hover:border-amber-500 transition-colors"
          >
            <div className="flex items-center gap-1.5 text-amber-400 text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Collection Risk</span>
            </div>
            <span className="text-amber-400 font-bold">{creditRatio}% of sales</span>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-4 pt-3 border-t border-[#1F2937] flex items-center justify-between text-[10px] font-mono text-gray-500">
        <span className="border border-gray-800 px-1.5 py-0.5 rounded uppercase">
          ILLUSTRATIVE
        </span>
        <span>Threshold: 35% WATCH • 45% HIGH RISK</span>
      </div>
    </div>
  );
};
