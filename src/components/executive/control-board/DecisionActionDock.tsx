'use client';

import React, { useState } from 'react';
import {
  Lock,
  Building2,
  MinusCircle,
  ShieldCheck,
  Check,
  ChevronUp,
} from 'lucide-react';
import { useExecutive } from '../../../context/ExecutiveContext';

interface DecisionActionDockProps {
  onOpenCreditLockModal: () => void;
  onOpenBankDepositModal: () => void;
  onOpenShortageModal: () => void;
  onOpenDayEndModal: () => void;
}

export const DecisionActionDock: React.FC<DecisionActionDockProps> = ({
  onOpenCreditLockModal,
  onOpenBankDepositModal,
  onOpenShortageModal,
  onOpenDayEndModal,
}) => {
  const { state } = useExecutive();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isCreditLocked = state.creditLockActive;
  const isDepositPrepared = state.depositPrepared;
  const isShortageResolved = state.varianceWaived || state.varianceDeducted;
  const isDayClosed = state.dayClosed;

  return (
    <div
      aria-label="Executive Decision & Action Dock"
      className="sticky bottom-3 z-20 rounded-xl border border-[#cbd5e1] bg-white/95 backdrop-blur-md p-2.5 sm:p-3.5 lg:p-4 shadow-[0_4px_24px_rgba(15,23,42,0.08)] font-mono text-slate-800 transition-all"
    >
      <div className="mx-auto flex max-w-[1920px] items-center justify-between gap-3">
        {/* Left Indicator */}
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-ping" />
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-800">
              {state.banglaMode ? 'নির্বাহী অ্যাকশন ডক' : 'EXECUTIVE ACTION DOCK'}
            </span>
            <span className="text-[9px] text-slate-500 hidden sm:inline">
              High-confidence controls that mutate enterprise business state
            </span>
          </div>
        </div>

        {/* Mobile Toggle Button (< lg) */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 text-xs font-bold shadow-xs transition"
            aria-expanded={mobileOpen}
            aria-label="Toggle executive action dock"
          >
            <span>{mobileOpen ? (state.banglaMode ? 'লুকান' : 'Collapse') : (state.banglaMode ? 'অ্যাকশন (৪)' : 'Actions (4)')}</span>
            <ChevronUp size={13} className={`transition-transform duration-200 ${mobileOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Desktop Controls (hidden on mobile, visible on lg) */}
        <div className="hidden lg:flex items-center gap-2.5 ml-auto flex-wrap">
          {/* Action 1: ONE-TAP CREDIT LOCK */}
          <button
            onClick={onOpenCreditLockModal}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition shadow-xs ${
              isCreditLocked
                ? 'border border-emerald-300 bg-emerald-50 text-emerald-800 cursor-default'
                : 'border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700'
            }`}
          >
            {isCreditLocked ? <Check size={13} /> : <Lock size={13} />}
            <span>
              {isCreditLocked
                ? (state.banglaMode ? 'ক্রেডিট লক সক্রিয়' : 'Credit Locked (Active)')
                : (state.banglaMode ? 'ওয়ান-ট্যাপ ক্রেডিট লক' : 'One-Tap Credit Lock')}
            </span>
          </button>

          {/* Action 2: PREPARE BANK DEPOSIT */}
          <button
            onClick={onOpenBankDepositModal}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition shadow-xs ${
              isDepositPrepared
                ? 'border border-emerald-300 bg-emerald-50 text-emerald-800 cursor-default'
                : 'border border-amber-300 bg-amber-500 hover:bg-amber-600 text-slate-950'
            }`}
          >
            {isDepositPrepared ? <Check size={13} /> : <Building2 size={13} />}
            <span>
              {isDepositPrepared
                ? (state.banglaMode ? 'ব্যাংক জমা প্রস্তুত' : 'Deposit In Transit')
                : (state.banglaMode ? 'ব্যাংক জমা প্রস্তুত করুন' : 'Prepare Bank Deposit')}
            </span>
          </button>

          {/* Action 3: AUTO-DEDUCT SHORTAGE */}
          <button
            onClick={onOpenShortageModal}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition shadow-2xs ${
              isShortageResolved
                ? 'border border-emerald-300 bg-emerald-50 text-emerald-800 cursor-default'
                : 'border border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
            }`}
          >
            {isShortageResolved ? <Check size={13} /> : <MinusCircle size={13} />}
            <span>
              {isShortageResolved
                ? (state.banglaMode ? 'ঘাটতি নিষ্পন্ন' : 'Shortage Audited')
                : (state.banglaMode ? 'ঘাটতি কেস নিষ্পত্তি' : 'Auto-Deduct Shortage')}
            </span>
          </button>

          {/* Action 4: APPROVE DAY-END CLOSEOUT */}
          <button
            onClick={onOpenDayEndModal}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition shadow-xs ${
              isDayClosed
                ? 'border border-emerald-300 bg-emerald-100 text-emerald-800 cursor-default'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white'
            }`}
          >
            <ShieldCheck size={14} />
            <span>
              {isDayClosed
                ? (state.banglaMode ? 'দিন সমাপ্ত ও ফ্রোজেন' : 'Day Closed & Frozen')
                : (state.banglaMode ? 'দিন সমাপ্তি অনুমোদন' : 'Approve Day-End Closeout')}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Actions Drawer (visible when mobileOpen is true on < lg) */}
      {mobileOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Action 1 */}
          <button
            onClick={() => {
              setMobileOpen(false);
              onOpenCreditLockModal();
            }}
            className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-bold transition shadow-xs ${
              isCreditLocked
                ? 'border border-emerald-300 bg-emerald-50 text-emerald-800'
                : 'border border-rose-200 bg-rose-50 text-rose-700'
            }`}
          >
            {isCreditLocked ? <Check size={13} /> : <Lock size={13} />}
            <span>
              {isCreditLocked
                ? (state.banglaMode ? 'ক্রেডিট লক সক্রিয়' : 'Credit Locked (Active)')
                : (state.banglaMode ? 'ওয়ান-ট্যাপ ক্রেডিট লক' : 'One-Tap Credit Lock')}
            </span>
          </button>

          {/* Action 2 */}
          <button
            onClick={() => {
              setMobileOpen(false);
              onOpenBankDepositModal();
            }}
            className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-bold transition shadow-xs ${
              isDepositPrepared
                ? 'border border-emerald-300 bg-emerald-50 text-emerald-800'
                : 'border border-amber-300 bg-amber-500 text-slate-950'
            }`}
          >
            {isDepositPrepared ? <Check size={13} /> : <Building2 size={13} />}
            <span>
              {isDepositPrepared
                ? (state.banglaMode ? 'ব্যাংক জমা প্রস্তুত' : 'Deposit In Transit')
                : (state.banglaMode ? 'ব্যাংক জমা প্রস্তুত করুন' : 'Prepare Bank Deposit')}
            </span>
          </button>

          {/* Action 3 */}
          <button
            onClick={() => {
              setMobileOpen(false);
              onOpenShortageModal();
            }}
            className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-bold transition shadow-2xs ${
              isShortageResolved
                ? 'border border-emerald-300 bg-emerald-50 text-emerald-800'
                : 'border border-slate-300 bg-white text-slate-700'
            }`}
          >
            {isShortageResolved ? <Check size={13} /> : <MinusCircle size={13} />}
            <span>
              {isShortageResolved
                ? (state.banglaMode ? 'ঘাটতি নিষ্পন্ন' : 'Shortage Audited')
                : (state.banglaMode ? 'ঘাটতি কেস নিষ্পত্তি' : 'Auto-Deduct Shortage')}
            </span>
          </button>

          {/* Action 4 */}
          <button
            onClick={() => {
              setMobileOpen(false);
              onOpenDayEndModal();
            }}
            className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-bold transition shadow-xs ${
              isDayClosed
                ? 'border border-emerald-300 bg-emerald-100 text-emerald-800'
                : 'bg-emerald-700 text-white'
            }`}
          >
            <ShieldCheck size={14} />
            <span>
              {isDayClosed
                ? (state.banglaMode ? 'দিন সমাপ্ত ও ফ্রোজেন' : 'Day Closed & Frozen')
                : (state.banglaMode ? 'দিন সমাপ্তি অনুমোদন' : 'Approve Day-End Closeout')}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
