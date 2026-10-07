'use client';

import React from 'react';
import { Receipt, MapPin, User, AlertCircle } from 'lucide-react';
import { useExecutive } from '../../../context/ExecutiveContext';
import { formatBDT, formatVariance } from '../../../utils/formatters';

interface DailyReconciliationCardProps {
  className?: string;
  expected?: number;
  counted?: number;
  variance?: number;
  route?: string;
  responsible?: string;
  hasException?: boolean;
  onOpenReconciliation?: () => void;
}

export const DailyReconciliationCard: React.FC<DailyReconciliationCardProps> = ({
  className = '',
  expected: propExpected,
  counted: propCounted,
  variance: propVariance,
  route: propRoute,
  responsible: propResponsible,
  hasException: propHasException,
  onOpenReconciliation,
}) => {
  const { state, openDrawer } = useExecutive();

  const isWaived = state.varianceWaived;
  const isDeducted = state.varianceDeducted;
  
  const expected = propExpected ?? state.reconciliationExpected ?? 443000;
  const counted = propCounted ?? state.reconciliationCounted ?? 442600;
  const variance = propVariance ?? state.cashVariance ?? -400;
  const route = propRoute ?? state.reconciliationRoute ?? 'Van #3';
  const responsible = propResponsible ?? state.reconciliationJSR ?? 'Babul';
  const hasException = propHasException !== undefined 
    ? propHasException 
    : (variance !== 0 && !isWaived && !isDeducted);

  const handleClick = () => {
    if (onOpenReconciliation) {
      onOpenReconciliation();
    } else {
      openDrawer('RECONCILIATION');
    }
  };

  return (
    <div className={`rounded-xl border border-[#1F2937] bg-[#0E131F] p-4 sm:p-5 shadow-lg flex flex-col justify-between text-white ${className}`}>
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-semibold tracking-tight text-white font-sans">
              Daily Cash Reconciliation
            </h3>
          </div>
          <span className={`text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded border uppercase flex items-center gap-1 ${
            hasException
              ? 'bg-red-950/40 text-red-400 border-red-800'
              : 'bg-emerald-950/40 text-emerald-400 border-emerald-800'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${hasException ? 'bg-red-400 animate-pulse' : 'bg-emerald-400'}`} />
            {hasException ? 'EXCEPTION' : 'RECONCILED'}
          </span>
        </div>
        <p className="text-[11px] font-sans text-gray-400">
          Expected vs counted cash — route settlement
        </p>

        {/* 3 Metric Summary Boxes */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center font-mono">
          {/* Expected */}
          <div className="p-3 rounded-lg bg-[#0B0F19] border border-[#1F2937]">
            <div className="text-[9px] text-gray-400 uppercase tracking-wider">EXPECTED</div>
            <div className="text-sm sm:text-base font-bold text-white mt-1">
              {formatBDT(expected, { mode: 'summary' })}
            </div>
          </div>

          {/* Counted */}
          <div className="p-3 rounded-lg bg-[#0B0F19] border border-[#1F2937]">
            <div className="text-[9px] text-gray-400 uppercase tracking-wider">COUNTED</div>
            <div className="text-sm sm:text-base font-bold text-white mt-1">
              {formatBDT(counted, { mode: 'summary' })}
            </div>
          </div>

          {/* Variance */}
          <div className={`p-3 rounded-lg border ${
            hasException 
              ? 'bg-[#160B0E] border-red-900/60' 
              : 'bg-[#0B1610] border-emerald-900/60'
          }`}>
            <div className="text-[9px] text-gray-400 uppercase tracking-wider">VARIANCE</div>
            <div className={`text-sm sm:text-base font-bold mt-1 ${
              hasException ? 'text-red-400' : 'text-emerald-400'
            }`}>
              {formatVariance(variance)}
            </div>
          </div>
        </div>

        {/* Route Metadata */}
        <div className="mt-4 p-3 rounded-lg bg-[#0B0F19] border border-[#1F2937] space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-gray-400">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>ASSIGNED ROUTE</span>
            </div>
            <span className="font-bold text-white">
              {route}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-gray-400">
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>RESPONSIBLE DSR</span>
            </div>
            <span className="font-bold text-white">
              {responsible}
            </span>
          </div>
        </div>

        {/* Warning Callout */}
        <div className="mt-3.5 flex items-center gap-2 text-[11px] font-sans text-gray-400">
          <AlertCircle className={`w-3.5 h-3.5 shrink-0 ${hasException ? 'text-amber-400' : 'text-emerald-400'}`} />
          <span>{hasException ? 'Cash variance detected — review required' : 'All till balances verified against sales book'}</span>
        </div>
      </div>

      {/* Footer Link */}
      <button
        onClick={handleClick}
        className="mt-4 pt-3 border-t border-[#1F2937] text-left text-[11px] font-sans text-gray-400 hover:text-amber-400 transition-colors flex items-center justify-between group"
      >
        <span className="text-[10px] font-mono text-gray-500 uppercase border border-gray-800 px-1.5 py-0.5 rounded">
          ILLUSTRATIVE
        </span>
        <span className="group-hover:underline">Click to review →</span>
      </button>
    </div>
  );
};
