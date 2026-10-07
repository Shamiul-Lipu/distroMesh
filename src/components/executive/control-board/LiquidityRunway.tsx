'use client';

import React from 'react';
import {
  Wallet,
  Building2,
  Vault,
  Clock,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
} from 'lucide-react';
import { useExecutive } from '../../../context/ExecutiveContext';
import { formatBDT } from '../../../utils/formatters';
import { deriveLiquidityStatus } from '../../../utils/derivedRules';

interface LiquidityRunwayProps {
  onInspectObligations?: () => void;
  onInspectVault?: () => void;
}

export const LiquidityRunway: React.FC<LiquidityRunwayProps> = ({
  onInspectObligations,
  onInspectVault,
}) => {
  const { state } = useExecutive();

  const totalLiquidCash = state.bankCash + state.vaultCash;
  const upcomingObligation = state.upcomingObligation;
  const liquidity = deriveLiquidityStatus(state.bankCash, state.vaultCash, upcomingObligation);

  // Coverage ratio against obligation
  const coverageRatio = upcomingObligation > 0
    ? (totalLiquidCash / (upcomingObligation / 7 * 7)) // 7-day or 48h comparison
    : 1;

  // Percentage of upcoming auto-debit currently covered by liquid cash
  const coveragePercent = upcomingObligation > 0
    ? Math.min(Math.round((totalLiquidCash / upcomingObligation) * 100), 100)
    : 100;

  const getRunwayState = () => {
    if (liquidity.status === 'SAFE') {
      return {
        label: state.banglaMode ? 'নিরাপদ কাভারেজ (২.১৭×)' : 'COMFORTABLY COVERED (2.17×)',
        barColor: 'bg-emerald-600',
        textColor: 'text-emerald-700',
        bgColor: 'bg-emerald-50 border-emerald-200',
        statusDesc: state.banglaMode ? 'ব্যাংক ও ভল্ট মিলিয়ে পরবর্তী ৭ দিনের দায় মেটানো সম্ভব' : 'Liquid cash reserves exceed immediate 7-day operational debt obligation.',
      };
    }
    if (liquidity.status === 'WATCH') {
      return {
        label: state.banglaMode ? 'সতর্ক সংকেত (ব্যাংক বাফার সীমিত)' : 'APPROACHING PRESSURE (BANK BUFFER LOW)',
        barColor: 'bg-amber-500',
        textColor: 'text-amber-800',
        bgColor: 'bg-amber-50 border-amber-200',
        statusDesc: state.banglaMode ? 'ভল্ট ক্যাশ ব্যাংকে জমা না দিলে অটো-ডেবিট বাউন্সের ঝুঁকি' : 'Vault cash must be deposited into Islami Bank before cutoff to avoid debit failure.',
      };
    }
    return {
      label: state.banglaMode ? 'তহবিল ঘাটতি (অটো-ডেবিট ঝুঁকিতে)' : 'INSUFFICIENT LIQUIDITY (DEBIT AT RISK)',
      barColor: 'bg-rose-600',
      textColor: 'text-rose-700',
      bgColor: 'bg-rose-50 border-rose-200',
      statusDesc: state.banglaMode ? 'জরুরি ভিত্তিতে ঋণ আদায় বা অতিরিক্ত তহবিল প্রয়োজন' : 'Immediate cash injection or route collection required to clear obligations.',
    };
  };

  const runway = getRunwayState();

  return (
    <section
      aria-label="Executive Liquidity Runway"
      className="rounded-xl border border-[#e2e8f0] bg-white p-4 sm:p-5 shadow-sm text-slate-800"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Left: LIQUIDITY HERO (Columns 1-5) */}
        <div className="lg:col-span-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200 pb-4 lg:pb-0 lg:pr-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Wallet size={13} className="text-emerald-600" />
              {state.banglaMode ? 'উপলব্ধ তরল তহবিল' : 'AVAILABLE LIQUID CASH'}
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {state.banglaMode ? 'তাত্ক্ষণিক অ্যাক্সেস' : 'IMMEDIATE ACCESS'}
            </span>
          </div>

          {/* Hero Cash Amount */}
          <div className="my-1 text-3xl sm:text-4xl font-mono font-bold tracking-tight text-slate-900 flex items-baseline gap-2">
            <span>{formatBDT(totalLiquidCash, { mode: 'exact', bangla: state.banglaMode })}</span>
            <span className="text-xs font-mono text-slate-400 font-normal">
              ({formatBDT(totalLiquidCash, { mode: 'summary', bangla: state.banglaMode })})
            </span>
          </div>

          {/* Subordinate Cash Breakdown: Bank & Vault */}
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono border-t border-slate-200 pt-2.5">
            <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase font-semibold">
                <Building2 size={11} className="text-sky-600" />
                <span>{state.banglaMode ? 'ব্যাংক ব্যালেন্স' : 'BANK CASH'}</span>
              </div>
              <div className="mt-1 font-bold text-slate-900">
                {formatBDT(state.bankCash, { mode: 'exact', bangla: state.banglaMode })}
              </div>
              <div className="text-[9px] text-slate-400 mt-0.5">
                Islami Bank (Post-Debit)
              </div>
            </div>

            <div
              onClick={onInspectVault}
              className="rounded-lg bg-slate-50 p-2.5 border border-slate-200/80 cursor-pointer hover:border-slate-400 transition"
            >
              <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-semibold">
                <span className="flex items-center gap-1.5">
                  <Vault size={11} className="text-amber-600" />
                  <span>{state.banglaMode ? 'ভল্ট / টিল ক্যাশ' : 'VAULT CASH'}</span>
                </span>
                <span className="text-[9px] text-amber-700 font-bold">Physical</span>
              </div>
              <div className="mt-1 font-bold text-slate-900">
                {formatBDT(state.vaultCash, { mode: 'exact', bangla: state.banglaMode })}
              </div>
              <div className="text-[9px] text-slate-400 mt-0.5">
                Counted Today
              </div>
            </div>
          </div>
        </div>

        {/* Right: OBLIGATION COVERAGE & RUNWAY (Columns 6-12) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              <Clock size={13} className="text-amber-600" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700">
                {state.banglaMode ? 'আসন্ন প্রধান দায় (৪৮ ঘণ্টা অটো-ডেবিট)' : 'NEXT 48H PRINCIPAL AUTO-DEBIT'}
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="text-slate-500">
                {state.banglaMode ? 'কাভারেজ অনুপাত:' : 'OBLIGATION COVERAGE:'}
              </span>
              <span className={`font-bold ${runway.textColor}`}>
                {liquidity.coverage}× ({coveragePercent}%)
              </span>
            </div>
          </div>

          {/* Metric comparison */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 my-1 text-xs font-mono">
            <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-semibold">
                {state.banglaMode ? 'মোট দায়' : 'TOTAL DUE'}
              </span>
              <span className="font-bold text-slate-900 text-sm">
                {formatBDT(upcomingObligation, { mode: 'exact', bangla: state.banglaMode })}
              </span>
            </div>

            <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-semibold">
                {state.banglaMode ? 'পরিশোধের মেয়াদ' : 'DUE WINDOW'}
              </span>
              <span className="font-bold text-amber-800 text-sm">
                48 Hours (Unilever BD)
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-lg bg-slate-50 p-2.5 border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-semibold">
                {state.banglaMode ? 'ব্যাংক একা কাভারেজ' : 'BANK-ONLY COVER'}
              </span>
              <span className="font-bold text-slate-700 text-sm">
                {liquidity.bankOnlyCoverage}× (Requires Vault Deposit)
              </span>
            </div>
          </div>

          {/* HORIZONTAL LIQUIDITY RUNWAY INDICATOR */}
          <div className="mt-3 pt-2">
            <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
              <span className="text-slate-500 font-semibold uppercase flex items-center gap-1">
                <span>LIQUID CASH</span>
                <span className="text-slate-400">({formatBDT(totalLiquidCash, { mode: 'summary', bangla: state.banglaMode })})</span>
              </span>
              <span className={`font-bold ${runway.textColor} uppercase`}>
                {runway.label}
              </span>
              <span className="text-slate-500 font-semibold uppercase flex items-center gap-1">
                <span>OBLIGATIONS</span>
                <span className="text-slate-400">({formatBDT(upcomingObligation, { mode: 'summary', bangla: state.banglaMode })})</span>
              </span>
            </div>

            {/* Visual Runway Bar */}
            <div className="relative h-2.5 w-full rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
              <div
                className={`h-full ${runway.barColor} transition-all duration-500 rounded-full`}
                style={{ width: `${Math.min(coveragePercent, 100)}%` }}
              />
              {/* Threshold indicator line at 100% or danger marks */}
              <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-rose-500" title="Full obligation line" />
            </div>

            <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span className="truncate pr-2">{runway.statusDesc}</span>
              {onInspectObligations && (
                <button
                  onClick={onInspectObligations}
                  className="shrink-0 text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 underline underline-offset-2"
                >
                  <span>{state.banglaMode ? 'দায় বিস্তারিত' : 'Inspect Breakdown'}</span>
                  <ArrowRight size={10} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
