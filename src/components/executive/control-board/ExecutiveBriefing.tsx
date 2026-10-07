'use client';

import React from 'react';
import { ArrowDown, Target } from 'lucide-react';
import { useExecutive } from '../../../context/ExecutiveContext';

export const ExecutiveBriefing: React.FC = () => {
  const { state } = useExecutive();

  const isCreditLocked = state.creditLockActive;
  const isDepositPrepared = state.depositPrepared;
  const isShortageResolved = state.varianceWaived || state.varianceDeducted;

  const getContent = () => {
    if (state.banglaMode) {
      if (isCreditLocked && isDepositPrepared && isShortageResolved) {
        return {
          happening: 'আজকের কার্যদিবসের সমস্ত সংকট নিরসন সম্পন্ন হয়েছে; ব্যাংক জমা প্রস্তুত এবং ঋণ স্থগিত কার্যকর।',
          why: 'ভল্ট ক্যাশ ব্যাংকে প্রেরিত হচ্ছে এবং ঝুঁকিপূর্ণ বাকির দোকানসমূহ সাময়িকভাবে লক করা হয়েছে।',
          focus: 'সন্ধ্যা ৭:৩০ টায় সকল ভ্যানের চূড়ান্ত অডিট সম্পন্ন করে দিন সমাপ্তি (Day-End Closeout) অনুমোদন করুন।',
        };
      }
      return {
        happening: 'লিকুইডিটি কাভারেজ নিয়ন্ত্রণে থাকলেও খুচরা বাজারের দীর্ঘমেয়াদি বকেয়া এবং সকালের ডেসপ্যাচ বিলম্ব নগদ প্রবাহে চাপ তৈরি করছে।',
        why: '৳৩৫.৫০ লাখ (১৮.০%) বকেয়া ৩০ দিনের বেশি সময় ধরে আটকে আছে এবং ভ্যান #৩ এ −৳৪০০ ক্যাশ ঘাটতি শনাক্ত হয়েছে।',
        focus: 'নতুন বাকির পরিধি বৃদ্ধি করার আগে ৩০ দিনের পুরোনো বকেয়া আদায় করুন এবং ভল্ট ক্যাশ ব্যাংকে জমা নিশ্চিত করুন।',
      };
    }

    if (isCreditLocked && isDepositPrepared && isShortageResolved) {
      return {
        happening: 'All key operational exceptions have been addressed; bank deposit voucher prepared and high-risk credit locked.',
        why: '৳8,00,000 vault cash transfer underway to safeguard upcoming ৳54,00,000 Unilever auto-debit.',
        focus: 'Proceed to Day-End Closeout once remaining evening route tallies are reconciled with cashier.',
      };
    }

    return {
      happening: 'Cash coverage remains stable (2.17×), but extended retailer receivables and morning dispatch friction threaten day-end margin.',
      why: '৳35.5L (18.0%) remains overdue beyond 30 days, while Van #3 reported an unresolved −৳400 cash till exception.',
      focus: 'Prioritize overdue credit collections on Bogura beats and verify physical vault deposit before banking cutoff.',
    };
  };

  const briefing = getContent();

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 flex flex-col justify-between shadow-xs text-[var(--foreground)] backdrop-blur-md transition-colors duration-200">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <Target size={14} className="text-emerald-500" />
          <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--foreground)]">
            {state.banglaMode ? 'নির্বাহী ব্রিফিং' : 'EXECUTIVE BRIEFING'}
          </h2>
        </div>
        <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          {state.banglaMode ? 'আজকের কৌশলগত সিদ্ধান্ত' : 'CEO ACTIONABLE SYNTHESIS'}
        </span>
      </div>

      <div className="mt-3.5 space-y-3 font-mono">
        {/* 1. WHAT'S HAPPENING */}
        <div className="rounded-xl bg-[var(--surface-elevated)] p-3 border border-[var(--border)] dm-interactive">
          <span className="text-[10px] font-bold tracking-wider text-[var(--foreground-muted)] uppercase block mb-1">
            {state.banglaMode ? '১. বর্তমান পরিস্থিতি' : "WHAT'S HAPPENING"}
          </span>
          <p className="text-xs text-[var(--foreground)] leading-relaxed font-sans">
            {briefing.happening}
          </p>
        </div>

        {/* Down Arrow separator */}
        <div className="flex justify-center -my-1 text-[var(--foreground-subtle)]">
          <ArrowDown size={14} />
        </div>

        {/* 2. WHY */}
        <div className="rounded-xl bg-[var(--surface-elevated)] p-3 border border-[var(--border)] dm-interactive">
          <span className="text-[10px] font-bold tracking-wider text-amber-500 uppercase block mb-1">
            {state.banglaMode ? '২. মূল কারণ' : 'WHY'}
          </span>
          <p className="text-xs text-[var(--foreground)] leading-relaxed font-sans">
            {briefing.why}
          </p>
        </div>

        {/* Down Arrow separator */}
        <div className="flex justify-center -my-1 text-[var(--foreground-subtle)]">
          <ArrowDown size={14} />
        </div>

        {/* 3. FOCUS NOW */}
        <div className="rounded-xl bg-emerald-500/10 p-3 border border-emerald-500/20 dm-interactive">
          <span className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase block mb-1">
            {state.banglaMode ? '৩. এখনই করণীয়' : 'FOCUS NOW'}
          </span>
          <p className="text-xs text-[var(--foreground)] font-semibold leading-relaxed font-sans">
            {briefing.focus}
          </p>
        </div>
      </div>
    </div>
  );
};
