'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Receipt,
  User,
  MapPin,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface RouteSettlementPreviewProps {
  autoDemo?: boolean;
}

const CINEMATIC_EASE = [0.4, 0, 0.2, 1] as const;

export const RouteSettlementPreview: React.FC<RouteSettlementPreviewProps> = ({
  autoDemo = true,
}) => {
  const [resolution, setResolution] = useState<'none' | 'deducted' | 'waived'>('none');
  const [isAutoResolved, setIsAutoResolved] = useState(false);

  // Self-running / auto-demo execution when mounted (balanced pacing)
  useEffect(() => {
    if (!autoDemo) return;

    const resolveTimer = setTimeout(() => {
      setResolution('deducted');
      setIsAutoResolved(true);
    }, 1200);

    return () => clearTimeout(resolveTimer);
  }, [autoDemo]);

  const isResolved = resolution !== 'none';
  const expectedCash = 443000;
  const countedCash = isResolved && resolution === 'deducted' ? 443000 : 442600;
  const variance = isResolved ? 0 : -400;

  return (
    <div className="w-full max-w-full rounded-xl border border-[var(--border)] bg-[#0B0F19] text-white p-3.5 sm:p-5 shadow-2xl font-mono select-none overflow-hidden relative">
      {/* Background glow */}
      <div className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
        isResolved ? 'bg-emerald-500/10' : 'bg-rose-500/10'
      }`} />

      {/* Step Indicator Banner for Auto-Cycle */}
      <div className="mb-3 pb-2.5 border-b border-[#1F2937] flex items-center justify-between gap-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={isResolved ? 'step-2' : 'step-1'}
            initial={{ opacity: 0, x: -8, filter: 'blur(3px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: 8, filter: 'blur(3px)' }}
            transition={{ duration: 0.22, ease: CINEMATIC_EASE }}
            className="flex items-center gap-1.5 text-[10px] font-bold"
          >
            <span className={`h-2 w-2 rounded-full ${isResolved ? 'bg-emerald-400' : 'bg-rose-400'} animate-ping shrink-0`} />
            <span className={isResolved ? 'text-emerald-400' : 'text-rose-400'}>
              {isResolved
                ? 'STEP 2/2 · −৳400 WAGE DEDUCTION EXECUTED · ZERO VARIANCE RESOLVED'
                : 'STEP 1/2 · TILL SHORTAGE DETECTED (−৳400 CASH VARIANCE ON ROUTE #3)'}
            </span>
          </motion.div>
        </AnimatePresence>
        <span className="text-[9px] text-gray-400 bg-[#111827] px-2 py-0.5 rounded border border-gray-800 shrink-0">
          ZONE 04 ACTIVE
        </span>
      </div>

      {/* Cockpit Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#1F2937]">
        <div className="flex items-center gap-2 min-w-0">
          <Receipt size={14} className={isResolved ? 'text-emerald-400' : 'text-rose-400'} />
          <span className="text-[11px] font-bold tracking-wider uppercase truncate">
            Dusk Till Settlement · Route #3 Audit
          </span>
        </div>
        <div className={`flex items-center gap-1.5 text-[9px] sm:text-[10px] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border shrink-0 ${
          isResolved
            ? 'text-emerald-400 bg-emerald-950/40 border-emerald-900/60'
            : 'text-rose-400 bg-rose-950/40 border-rose-900/60 animate-pulse'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isResolved ? 'bg-emerald-400' : 'bg-rose-400'}`} />
          <span>{isResolved ? 'ZERO VARIANCE · RECONCILED' : 'DISCREPANCY DETECTED'}</span>
        </div>
      </div>

      {/* 3 Metric Summary Boxes */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 mb-3.5 text-center">
        <div className="p-2 sm:p-3 rounded-lg bg-[#111827] border border-gray-800 min-w-0">
          <div className="text-[8px] sm:text-[9px] text-gray-400 uppercase tracking-wider truncate">EXPECTED</div>
          <div className="text-xs sm:text-base font-bold text-white mt-1 dm-tabular truncate">
            ৳4.43L
          </div>
          <div className="text-[8px] sm:text-[9px] text-gray-500 mt-0.5 truncate">Sales memos</div>
        </div>

        <div className="p-2 sm:p-3 rounded-lg bg-[#111827] border border-gray-800 min-w-0">
          <div className="text-[8px] sm:text-[9px] text-gray-400 uppercase tracking-wider truncate">COUNTED</div>
          <div className="text-xs sm:text-base font-bold text-gray-200 mt-1 dm-tabular truncate">
            ৳{(countedCash / 100000).toFixed(2)}L
          </div>
          <div className="text-[8px] sm:text-[9px] text-gray-500 mt-0.5 truncate">Physical cash</div>
        </div>

        <div className={`p-2 sm:p-3 rounded-lg border transition-colors min-w-0 ${
          isResolved
            ? 'bg-emerald-950/20 border-emerald-900/60'
            : 'bg-rose-950/30 border-rose-900/60'
        }`}>
          <div className="text-[8px] sm:text-[9px] uppercase tracking-wider text-gray-400 truncate">VARIANCE</div>
          <div className={`text-xs sm:text-base font-bold mt-1 dm-tabular truncate ${
            isResolved ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {variance === 0 ? '৳0.00' : `−৳400`}
          </div>
          <div className={`text-[8px] sm:text-[9px] font-bold mt-0.5 truncate ${
            isResolved ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {isResolved ? 'Balanced' : 'Shortage'}
          </div>
        </div>
      </div>

      {/* Route Metadata Box */}
      <div className="p-2.5 rounded-lg bg-[#111827] border border-gray-800 space-y-1.5 text-xs text-gray-300 mb-3.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-gray-400 flex items-center gap-1.5">
            <MapPin size={12} className="text-blue-400" /> Route &amp; Territory
          </span>
          <span className="font-bold text-white text-[11px]">Van #3 · Sherpur Town Central</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-gray-400 flex items-center gap-1.5">
            <User size={12} className="text-blue-400" /> Responsible Staff
          </span>
          <span className="font-bold text-white text-[11px]">JSR: Babul (Delivery Lead)</span>
        </div>
      </div>

      {/* Resolution Protocol Bar */}
      <div className="pt-1">
        {isResolved ? (
          <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-emerald-300">
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
              <span className="text-[11px] font-sans">
                {resolution === 'deducted'
                  ? '−৳400 deducted from driver payroll · Till closed'
                  : 'Shortage waived by distributor owner · Till closed'}
              </span>
            </div>
            <button
              onClick={() => setResolution('none')}
              className="text-[10px] text-gray-400 hover:text-white px-2 py-0.5 rounded bg-[#111827] border border-gray-700 transition"
            >
              Reset
            </button>
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">
              Enforce Owner Resolution Protocol:
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setResolution('deducted')}
                className="py-2 px-2.5 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white text-[11px] font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
              >
                <span>Deduct −৳400 Wage</span>
              </button>
              <button
                onClick={() => setResolution('waived')}
                className="py-2 px-2.5 rounded-lg bg-[#1F2937] hover:bg-gray-700 text-gray-300 text-[11px] font-bold transition flex items-center justify-center gap-1.5 border border-gray-700 active:scale-95"
              >
                <span>Waive Shortage</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
