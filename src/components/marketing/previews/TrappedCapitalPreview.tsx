'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  Store,
  Clock,
  ArrowRight,
  ShieldAlert,
  Zap,
} from 'lucide-react';

interface TrappedCapitalPreviewProps {
  autoDemo?: boolean;
}

const CINEMATIC_EASE = [0.4, 0, 0.2, 1] as const;

export const TrappedCapitalPreview: React.FC<TrappedCapitalPreviewProps> = ({
  autoDemo = true,
}) => {
  const [lockedList, setLockedList] = useState<string[]>([]);
  const [claimAudited, setClaimAudited] = useState(false);
  const [autoLockedItem, setAutoLockedItem] = useState<string | null>(null);

  // Self-running / auto-demo execution when mounted (balanced pacing)
  useEffect(() => {
    if (!autoDemo) return;

    // Step 1: Auto-lock defaulting retailer at 1.2s
    const lockTimer = setTimeout(() => {
      setLockedList(['ret-1']);
      setAutoLockedItem('ret-1');
    }, 1200);

    // Step 2: Auto-audit Unilever claims at 2.4s
    const claimTimer = setTimeout(() => {
      setClaimAudited(true);
    }, 2400);

    return () => {
      clearTimeout(lockTimer);
      clearTimeout(claimTimer);
    };
  }, [autoDemo]);

  const toggleLock = (id: string) => {
    setLockedList((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const retailers = [
    {
      id: 'ret-1',
      name: 'Bhai Bhai General Store',
      location: 'Sherpur Sadar',
      due: 48500,
      days: 38,
      isSevere: true,
    },
    {
      id: 'ret-2',
      name: 'Mitali Grocers',
      location: 'Bogura Link Road',
      due: 32400,
      days: 34,
      isSevere: true,
    },
    {
      id: 'ret-3',
      name: 'Haji Confectionery',
      location: 'College Gate',
      due: 19200,
      days: 14,
      isSevere: false,
    },
  ];

  const hasLocks = lockedList.length > 0;

  return (
    <div className="w-full max-w-full rounded-xl border border-[var(--border)] bg-[#0B0F19] text-white p-3.5 sm:p-5 shadow-2xl font-mono select-none overflow-hidden relative">
      {/* Background glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Step Indicator Banner */}
      <div className="mb-3 pb-2.5 border-b border-[#1F2937] flex items-center justify-between gap-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={hasLocks ? 'step-2' : 'step-1'}
            initial={{ opacity: 0, x: -8, filter: 'blur(3px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: 8, filter: 'blur(3px)' }}
            transition={{ duration: 0.22, ease: CINEMATIC_EASE }}
            className="flex items-center gap-1.5 text-[10px] font-bold"
          >
            <span className={`h-2 w-2 rounded-full ${hasLocks ? 'bg-emerald-400' : 'bg-amber-400'} animate-ping shrink-0`} />
            <span className={hasLocks ? 'text-emerald-400' : 'text-amber-400'}>
              {hasLocks
                ? 'STEP 2/2 · DEFAULTING SHOP LOCKED · UNAUTHORIZED CREDIT BLOCKED'
                : 'STEP 1/2 · IDENTIFYING OVERDUE CREDIT (>30 DAYS EXPOSURE)'}
            </span>
          </motion.div>
        </AnimatePresence>
        <span className="text-[9px] text-gray-400 bg-[#111827] px-2 py-0.5 rounded border border-gray-800 shrink-0">
          ZONE 02 ACTIVE
        </span>
      </div>

      {/* Cockpit Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#1F2937]/60">
        <div className="flex items-center gap-2 min-w-0">
          <Layers size={14} className="text-amber-400 shrink-0" />
          <span className="text-[11px] font-bold tracking-wider text-amber-400 uppercase truncate">
            NOWC Breakdown · 700 Retail Drops
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-rose-400 bg-rose-950/40 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md border border-rose-900/50 shrink-0">
          <ShieldAlert size={11} className="shrink-0" />
          <span>18.0% Overdue &gt;30D</span>
        </div>
      </div>

      {/* Working Capital Stack Strip */}
      <div className="p-3 rounded-lg bg-[#111827] border border-gray-800/80 mb-3.5">
        <div className="flex items-center justify-between text-[11px] text-gray-300 font-semibold mb-2">
          <span>Capital Allocation Stack</span>
          <span className="text-white font-bold">৳3.53 Cr Trapped</span>
        </div>
        {/* Multi-segmented bar */}
        <div className="h-2.5 w-full rounded-full bg-gray-800 overflow-hidden flex gap-0.5">
          <div className="h-full bg-amber-500 rounded-l-full" style={{ width: '56%' }} title="Receivables (56%)" />
          <div className="h-full bg-blue-500" style={{ width: '38%' }} title="Inventory (38%)" />
          <div className="h-full bg-emerald-500 rounded-r-full" style={{ width: '6%' }} title="Scheme Claims (6%)" />
        </div>
        <div className="grid grid-cols-3 gap-1 text-[8px] sm:text-[9px] text-gray-400 mt-2 font-sans">
          <span className="flex items-center gap-1 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
            <span className="truncate">Credit ৳1.97 Cr</span>
          </span>
          <span className="flex items-center gap-1 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
            <span className="truncate">Stock ৳1.54 Cr</span>
          </span>
          <span className="flex items-center gap-1 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="truncate">Claims ৳2.05L</span>
          </span>
        </div>
      </div>

      {/* Overdue Retailer List with Interactive & Self-Running Credit Lock */}
      <div className="space-y-2 mb-3">
        <div className="text-[10px] uppercase tracking-wider text-gray-400 flex items-center justify-between">
          <span>Credit Lock Control (Van Delivery Gate)</span>
          <span className="text-[9px] text-gray-500 hidden xs:inline">Self-running live audit</span>
        </div>

        {retailers.map((r) => {
          const isLocked = lockedList.includes(r.id);
          const wasAutoLocked = autoLockedItem === r.id;

          return (
            <motion.div
              key={r.id}
              animate={{ scale: isLocked && wasAutoLocked ? [1, 1.02, 1] : 1 }}
              transition={{ duration: 0.3 }}
              className={`p-2.5 rounded-lg border transition-colors flex items-center justify-between gap-2 ${
                isLocked
                  ? 'bg-rose-950/25 border-rose-800/80 shadow-md ring-1 ring-rose-500/20'
                  : 'bg-[#111827] border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <Store size={12} className={isLocked ? 'text-rose-400' : 'text-gray-400'} />
                  <span className="text-xs font-bold text-gray-100 truncate">{r.name}</span>
                  {wasAutoLocked && isLocked && (
                    <span className="text-[8px] font-mono bg-rose-900/60 text-rose-300 px-1 rounded border border-rose-700/50 hidden xs:inline">
                      AUTO-LOCKED
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-gray-400 font-sans flex items-center gap-2 mt-0.5">
                  <span>৳{(r.due / 1000).toFixed(1)}k due</span>
                  <span>•</span>
                  <span className={r.isSevere ? 'text-rose-400 font-bold' : 'text-gray-400'}>
                    {r.days}d overdue
                  </span>
                </div>
              </div>

              <button
                onClick={() => toggleLock(r.id)}
                className={`px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition shrink-0 active:scale-95 ${
                  isLocked
                    ? 'bg-rose-500/25 text-rose-300 border border-rose-500/50 hover:bg-rose-500/35'
                    : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {isLocked ? (
                  <>
                    <Lock size={10} className="text-rose-400" />
                    <span>LOCKED</span>
                  </>
                ) : (
                  <>
                    <Unlock size={10} className="text-gray-400" />
                    <span>LOCK</span>
                  </>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Principal Scheme Claims Audit Trigger with Self-Running Execution */}
      <div className="p-2.5 rounded-lg bg-[#111827] border border-gray-800 flex items-center justify-between text-xs min-w-0">
        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-gray-300 truncate">
          <Clock size={12} className="text-blue-400 shrink-0" />
          <span className="truncate">Unilever Scheme Claims: ৳2.05L</span>
        </div>
        <button
          onClick={() => setClaimAudited(!claimAudited)}
          className={`px-2.5 py-1 rounded text-[10px] font-bold transition shrink-0 active:scale-95 ${
            claimAudited
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-blue-600/30 text-blue-300 border border-blue-500/40 hover:bg-blue-600/40'
          }`}
        >
          {claimAudited ? '✓ Offsetting Approved' : 'Audit Claims'}
        </button>
      </div>
    </div>
  );
};
