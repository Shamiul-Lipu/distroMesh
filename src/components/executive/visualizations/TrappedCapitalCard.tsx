'use client';

import React from 'react';
import { Lock } from 'lucide-react';
import { useExecutive } from '../../../context/ExecutiveContext';

import { formatCompactBDT } from '../../../utils/formatters';

interface TrappedCapitalCardProps {
  nowc?: number;
  receivables?: number;
  inventory?: number;
  schemes?: number;
  className?: string;
  onOpenWorkingCapital?: () => void;
}

export const TrappedCapitalCard: React.FC<TrappedCapitalCardProps> = ({
  nowc,
  receivables: customRec,
  inventory: customInv,
  schemes: customSch,
  className = '',
  onOpenWorkingCapital,
}) => {
  const { openDrawer } = useExecutive();

  const rec = customRec !== undefined ? customRec : 12400000;
  const inv = customInv !== undefined ? customInv : 9200000;
  const sch = customSch !== undefined ? customSch : 2290000;
  const totalTrapped = rec + inv + sch;

  const pctRec = totalTrapped > 0 ? ((rec / totalTrapped) * 100).toFixed(1) : '0.0';
  const pctInv = totalTrapped > 0 ? ((inv / totalTrapped) * 100).toFixed(1) : '0.0';
  const pctSch = totalTrapped > 0 ? ((sch / totalTrapped) * 100).toFixed(1) : '0.0';

  const handleClick = () => {
    if (onOpenWorkingCapital) {
      onOpenWorkingCapital();
    } else {
      openDrawer('WORKING_CAPITAL');
    }
  };

  return (
    <div className={`rounded-xl border border-[#1F2937] bg-[#0E131F] p-4 sm:p-5 shadow-lg flex flex-col justify-between text-white ${className}`}>
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-semibold tracking-tight text-white font-sans">
              Trapped Working Capital
            </h3>
          </div>
          <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded border border-gray-700 text-gray-400 uppercase">
            ILLUSTRATIVE
          </span>
        </div>
        <p className="text-[11px] font-sans text-gray-400">
          Capital inside the business — not immediately liquid
        </p>

        {/* Hero Figure */}
        <div className="mt-4">
          <div className="text-[10px] font-mono uppercase text-gray-400 tracking-wider">
            TOTAL TRAPPED CAPITAL
          </div>
          <div className="text-3xl font-mono font-bold text-white mt-1">
            {formatCompactBDT(totalTrapped)}
          </div>
        </div>

        {/* Multi-segment Horizontal Progress Bar */}
        <div className="mt-3.5">
          <div className="h-2.5 w-full bg-[#1F2937] rounded-full overflow-hidden flex">
            <div
              style={{ width: `${pctRec}%` }}
              className="bg-blue-600 h-full"
              title={`Retailer Receivables: ${pctRec}%`}
            />
            <div
              style={{ width: `${pctInv}%` }}
              className="bg-emerald-600 h-full"
              title={`Inventory at Cost: ${pctInv}%`}
            />
            <div
              style={{ width: `${pctSch}%` }}
              className="bg-amber-600 h-full"
              title={`Unclaimed Schemes: ${pctSch}%`}
            />
          </div>
        </div>

        {/* 3 Categories Breakdown */}
        <div className="mt-4 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-gray-300">Retailer Receivables</span>
            </div>
            <span className="font-bold text-white">{formatCompactBDT(rec)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-gray-300">Inventory at Cost</span>
            </div>
            <span className="font-bold text-white">{formatCompactBDT(inv)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-gray-300">Unclaimed Schemes</span>
            </div>
            <span className="font-bold text-white">{formatCompactBDT(sch)}</span>
          </div>
        </div>
      </div>

      {/* Footer Link */}
      <button
        onClick={handleClick}
        className="mt-4 pt-3 border-t border-[#1F2937] text-left text-[11px] font-sans text-gray-400 hover:text-amber-400 transition-colors flex items-center justify-between group"
      >
        <span>This money exists inside the business but is not immediately available as liquid cash. Click for breakdown →</span>
      </button>
    </div>
  );
};
