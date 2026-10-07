'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  Building2,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  TrendingUp,
  Zap,
} from 'lucide-react';

interface LiquidityRunwayPreviewProps {
  autoDemo?: boolean;
}

const CINEMATIC_EASE = [0.4, 0, 0.2, 1] as const;

export const LiquidityRunwayPreview: React.FC<LiquidityRunwayPreviewProps> = ({
  autoDemo = true,
}) => {
  const [staged, setStaged] = useState(false);
  const [isAutoTriggered, setIsAutoTriggered] = useState(false);

  // Self-running / auto-demo execution when mounted (balanced pacing)
  useEffect(() => {
    if (!autoDemo) return;

    const timer = setTimeout(() => {
      setStaged(true);
      setIsAutoTriggered(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [autoDemo]);

  const bankCash = staged ? 1300000 : 800000;
  const vaultCash = staged ? 395200 : 895200;
  const totalLiquid = bankCash + vaultCash;
  const upcomingDebit = 2070000;
  const coverMultiple = (totalLiquid / upcomingDebit).toFixed(2);

  return (
    <div className="w-full max-w-full rounded-xl border border-[var(--border)] bg-[#0B0F19] text-white p-3.5 sm:p-5 shadow-2xl font-mono select-none overflow-hidden relative">
      {/* Background ambient texture */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Step Indicator Banner for Auto-Cycle */}
      <div className="mb-3 pb-2.5 border-b border-[#1F2937] flex items-center justify-between gap-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={staged ? 'step-2' : 'step-1'}
            initial={{ opacity: 0, x: -8, filter: 'blur(3px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: 8, filter: 'blur(3px)' }}
            transition={{ duration: 0.22, ease: CINEMATIC_EASE }}
            className="flex items-center gap-1.5 text-[10px] font-bold"
          >
            <span className={`h-2 w-2 rounded-full ${staged ? 'bg-emerald-400' : 'bg-amber-400'} animate-ping shrink-0`} />
            <span className={staged ? 'text-emerald-400' : 'text-amber-400'}>
              {staged
                ? 'STEP 2/2 · ৳5.0L STAGED TO BANK (2.81× SAFE COVER)'
                : 'STEP 1/2 · 48H DEBIT SCHEDULED (৳20.70L CUTOFF)'}
            </span>
          </motion.div>
        </AnimatePresence>
        <span className="text-[9px] text-gray-400 bg-[#111827] px-2 py-0.5 rounded border border-gray-800 shrink-0">
          ZONE 01 ACTIVE
        </span>
      </div>

      {/* Cockpit Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#1F2937]/60">
        <div className="flex items-center gap-2 min-w-0">
          <Building2 size={13} className="text-blue-400 shrink-0" />
          <span className="text-[11px] font-bold tracking-wider text-gray-200 uppercase truncate">
            Sonali Corporate Gateway · Liquidity Runway
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-gray-400 bg-[#111827] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md border border-gray-800 shrink-0">
          <Clock size={11} className="text-amber-400 shrink-0" />
          <span>Cutoff: 16:30 BST</span>
        </div>
      </div>

      {/* Split Balances: Bank vs Vault */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-3.5">
        {/* Bank Cash */}
        <motion.div
          animate={{ scale: staged ? [1, 1.02, 1] : 1 }}
          transition={{ duration: 0.3 }}
          className={`p-3 sm:p-3.5 rounded-lg border relative overflow-hidden group min-w-0 transition-all ${
            staged
              ? 'bg-[#101C2E] border-emerald-500/50 shadow-md ring-1 ring-emerald-500/20'
              : 'bg-[#111827] border-gray-800/80'
          }`}
        >
          <div className="flex items-center justify-between text-gray-400 text-[10px] mb-1">
            <span className="uppercase tracking-wider flex items-center gap-1 truncate">
              <Building2 size={12} className="text-blue-400 shrink-0" /> Bank Clearing
            </span>
            <span className={`text-[9px] font-bold shrink-0 ${staged ? 'text-emerald-400' : 'text-gray-400'}`}>
              {staged ? 'STAGED' : 'CLEARING'}
            </span>
          </div>
          <div className={`text-base sm:text-xl font-bold dm-tabular truncate ${staged ? 'text-emerald-400' : 'text-white'}`}>
            ৳{(bankCash / 100000).toFixed(2)}L
          </div>
          <div className="text-[10px] text-gray-400 mt-0.5 truncate">
            {staged ? '✓ ৳5.0L injected from safe' : 'Pre-cutoff balance'}
          </div>
        </motion.div>

        {/* Vault Safe */}
        <div className="p-3 sm:p-3.5 rounded-lg bg-[#111827] border border-gray-800/80 relative overflow-hidden min-w-0">
          <div className="flex items-center justify-between text-gray-400 text-[10px] mb-1">
            <span className="uppercase tracking-wider flex items-center gap-1 truncate">
              <Wallet size={12} className="text-amber-400 shrink-0" /> Depot Vault
            </span>
            <span className="text-[9px] text-amber-400 font-bold shrink-0">PHYSICAL</span>
          </div>
          <div className="text-base sm:text-xl font-bold text-amber-400 dm-tabular truncate">
            ৳{(vaultCash / 100000).toFixed(2)}L
          </div>
          <div className="text-[10px] text-gray-400 mt-0.5 truncate">
            Cash in depot safe
          </div>
        </div>
      </div>

      {/* 48h Auto-Debit Progress Runway */}
      <div className="p-3 rounded-lg bg-[#0F172A]/70 border border-blue-900/40 mb-3.5">
        <div className="flex items-center justify-between text-[11px] mb-1.5">
          <span className="text-gray-300 font-semibold flex items-center gap-1.5 truncate">
            <ShieldCheck size={13} className="text-emerald-400 shrink-0" />
            <span className="truncate">48h Principal Debit Cover</span>
          </span>
          <span className="text-emerald-400 font-bold shrink-0 dm-tabular">{coverMultiple}× Solvency Cover</span>
        </div>
        <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden relative">
          <motion.div
            initial={false}
            animate={{ width: staged ? '92%' : '76%' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1.5">
          <span>Scheduled Debit: ৳20.70L</span>
          <span className="text-emerald-400 font-semibold">
            {staged ? 'Zero bounce risk (Protected)' : 'Adequate buffer'}
          </span>
        </div>
      </div>

      {/* Interactive Staging Action Trigger */}
      <div className="pt-1">
        <AnimatePresence mode="wait">
          {staged ? (
            <motion.div
              key="staged"
              initial={{ opacity: 0, y: 6, filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(3px)' }}
              transition={{ duration: 0.35, ease: CINEMATIC_EASE }}
              className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 shadow-md shadow-emerald-950/30"
            >
              <div className="flex items-center gap-2 text-xs text-emerald-400 min-w-0">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                <span className="text-[11px] font-sans font-semibold truncate">
                  ৳5.0L staged to bank clearing buffer
                </span>
                <span className="text-[9px] font-mono text-emerald-300/80 bg-emerald-900/60 px-1.5 py-0.5 rounded border border-emerald-700/50 hidden xs:inline shrink-0">
                  AUTO-EXECUTED
                </span>
              </div>
              <button
                onClick={() => {
                  setStaged(false);
                  setIsAutoTriggered(false);
                }}
                className="text-[10px] font-mono text-gray-400 hover:text-white px-2 py-1 rounded bg-[#111827] border border-gray-700 transition shrink-0"
              >
                Reset
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="unstaged"
              initial={{ opacity: 0, y: 6, filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(3px)' }}
              transition={{ duration: 0.35, ease: CINEMATIC_EASE }}
              onClick={() => setStaged(true)}
              className="w-full group py-2.5 px-3 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg active:scale-[0.99]"
            >
              <Sparkles size={13} />
              <span>Click to Stage ৳5,00,000 Vault Cash to Bank</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
