'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal,
  Lock,
  Unlock,
  Building2,
  DollarSign,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Gauge,
} from 'lucide-react';

interface DecisionDockPreviewProps {
  autoDemo?: boolean;
}

const CINEMATIC_EASE = [0.4, 0, 0.2, 1] as const;

export const DecisionDockPreview: React.FC<DecisionDockPreviewProps> = ({
  autoDemo = true,
}) => {
  const [collectionRate, setCollectionRate] = useState(85);
  const [creditLockActive, setCreditLockActive] = useState(true);
  const [vaultAutoStage, setVaultAutoStage] = useState(false);

  // Self-running / auto-demo execution when mounted (balanced pacing)
  useEffect(() => {
    if (!autoDemo) return;

    // Phase 1: Stress test down to 65% collection rate at 1.0s
    const stressTimer = setTimeout(() => {
      setCollectionRate(65);
    }, 1000);

    // Phase 2: Countermeasure - stage vault cash to bank at 2.2s, restoring positive buffer
    const restoreTimer = setTimeout(() => {
      setVaultAutoStage(true);
      setCollectionRate(80);
    }, 2200);

    return () => {
      clearTimeout(stressTimer);
      clearTimeout(restoreTimer);
    };
  }, [autoDemo]);

  // Dynamic calculations based on slider
  const dailyDelivered = 480000;
  const simulatedCollection = Math.round(dailyDelivered * (collectionRate / 100));
  const debitObligation = 2070000;
  const currentCash = 1695200 + (vaultAutoStage ? 500000 : 0);
  const projectedBuffer = currentCash + simulatedCollection - debitObligation;
  const isHealthy = projectedBuffer > 0;

  return (
    <div className="w-full max-w-full rounded-xl border border-[var(--border)] bg-[#0B0F19] text-white p-3.5 sm:p-5 shadow-2xl font-mono select-none overflow-hidden relative">
      {/* Background glow */}
      <div className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
        isHealthy ? 'bg-emerald-500/10' : 'bg-rose-500/10'
      }`} />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Step Indicator Banner for Auto-Cycle */}
      <div className="mb-3 pb-2.5 border-b border-[#1F2937] flex items-center justify-between gap-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={vaultAutoStage ? 'step-3' : !isHealthy ? 'step-2' : 'step-1'}
            initial={{ opacity: 0, x: -8, filter: 'blur(3px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: 8, filter: 'blur(3px)' }}
            transition={{ duration: 0.22, ease: CINEMATIC_EASE }}
            className="flex items-center gap-1.5 text-[10px] font-bold"
          >
            <span className={`h-2 w-2 rounded-full ${isHealthy ? 'bg-emerald-400' : 'bg-rose-400'} animate-ping shrink-0`} />
            <span className={vaultAutoStage ? 'text-emerald-400' : !isHealthy ? 'text-rose-400' : 'text-purple-400'}>
              {vaultAutoStage
                ? 'STEP 3/3 · ৳5.0L VAULT CASH STAGED · +৳3.88L BUFFER SECURED'
                : !isHealthy
                ? 'STEP 2/3 · 65% STRESS CRISIS SIMULATED · LIQUIDITY GAP (−৳1.12L)'
                : 'STEP 1/3 · BASELINE RUNWAY (85% COLLECTION · ৳1.05L BUFFER)'}
            </span>
          </motion.div>
        </AnimatePresence>
        <span className="text-[9px] text-gray-400 bg-[#111827] px-2 py-0.5 rounded border border-gray-800 shrink-0">
          ZONE 05 ACTIVE
        </span>
      </div>

      {/* Cockpit Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#1F2937]">
        <div className="flex items-center gap-2 min-w-0">
          <SlidersHorizontal size={14} className="text-purple-400 shrink-0" />
          <span className="text-[11px] font-bold tracking-wider text-purple-400 uppercase truncate">
            Owner Command Dock &amp; Runway Sandbox
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-gray-400 bg-[#111827] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md border border-gray-800 shrink-0">
          <Gauge size={11} className="text-purple-400 shrink-0" />
          <span>Interactive Sandbox</span>
        </div>
      </div>

      {/* Quick Action Toggle Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-3.5">
        <button
          onClick={() => setCreditLockActive(!creditLockActive)}
          className={`p-2.5 rounded-lg border text-left transition flex items-center justify-between ${
            creditLockActive
              ? 'bg-rose-950/30 border-rose-800/80 text-rose-300'
              : 'bg-[#111827] border-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-bold">
            {creditLockActive ? <Lock size={12} className="text-rose-400" /> : <Unlock size={12} />}
            <span>Credit Guard</span>
          </div>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
            creditLockActive ? 'bg-rose-500/20 text-rose-300' : 'bg-gray-800 text-gray-400'
          }`}>
            {creditLockActive ? 'LOCKED' : 'OFF'}
          </span>
        </button>

        <button
          onClick={() => setVaultAutoStage(!vaultAutoStage)}
          className={`p-2.5 rounded-lg border text-left transition flex items-center justify-between ${
            vaultAutoStage
              ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-300'
              : 'bg-[#111827] border-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <Building2 size={12} className={vaultAutoStage ? 'text-emerald-400' : 'text-gray-400'} />
            <span>Bank Staging</span>
          </div>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
            vaultAutoStage ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-800 text-gray-400'
          }`}>
            {vaultAutoStage ? '+৳5.0L' : 'OFF'}
          </span>
        </button>
      </div>

      {/* Interactive Collection Stress Slider */}
      <div className="p-3 rounded-lg bg-[#111827] border border-gray-800 mb-3.5">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-gray-300 font-semibold">Stress-Test Market Collections</span>
          <span className="text-emerald-400 font-bold text-sm dm-tabular">{collectionRate}% Rate</span>
        </div>

        <input
          type="range"
          min={60}
          max={100}
          step={5}
          value={collectionRate}
          onChange={(e) => setCollectionRate(Number(e.target.value))}
          className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-gray-800 rounded-lg appearance-none"
        />

        <div className="flex items-center justify-between text-[10px] text-gray-400 mt-2 font-sans">
          <span>60% (Depressed market)</span>
          <span>100% (Perfect cash recovery)</span>
        </div>
      </div>

      {/* Dynamic Runway Health Meter */}
      <div className={`p-3 rounded-lg border transition-all ${
        isHealthy
          ? 'bg-emerald-950/20 border-emerald-900/60'
          : 'bg-rose-950/30 border-rose-900/60'
      }`}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold flex items-center gap-1.5">
            {isHealthy ? (
              <>
                <ShieldCheck size={14} className="text-emerald-400" />
                <span className="text-emerald-400">Projected 48h Runway: Solvency Protected</span>
              </>
            ) : (
              <>
                <AlertTriangle size={14} className="text-rose-400" />
                <span className="text-rose-400">Projected 48h Runway: Liquidity Shortfall</span>
              </>
            )}
          </span>
          <span className={`text-xs font-bold dm-tabular ${isHealthy ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isHealthy ? `+৳${(projectedBuffer / 100000).toFixed(2)}L` : `−৳${(Math.abs(projectedBuffer) / 100000).toFixed(2)}L`}
          </span>
        </div>
        <p className="text-[11px] text-gray-400 font-sans mt-1">
          {isHealthy
            ? `At ${collectionRate}% collection rate, post-debit bank cushion remains positive. Supplier auto-debit passes cleanly.`
            : `Warning: Collections below 75% trigger bank shortfall. Tap "Bank Staging" above to inject ৳5.0L vault buffer.`}
        </p>
      </div>
    </div>
  );
};
