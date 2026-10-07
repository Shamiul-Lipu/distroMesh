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

  // Percentage of upcoming auto-debit currently covered by liquid cash
  const coveragePercent = upcomingObligation > 0
    ? Math.min(Math.round((totalLiquidCash / upcomingObligation) * 100), 100)
    : 100;

  const getRunwayState = () => {
    if (liquidity.status === 'SAFE') {
      return {
        label: state.banglaMode ? 'নিরাপদ কাভারেজ (২.১৭×)' : 'COMFORTABLY COVERED (2.17×)',
        barColor: 'bg-emerald-500',
        textColor: 'text-emerald-500',
        badgeBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        statusDesc: state.banglaMode ? 'ব্যাংক ও ভল্ট মিলিয়ে পরবর্তী ৭ দিনের দায় মেটানো সম্ভব' : 'Liquid cash reserves exceed immediate 7-day operational debt obligation.',
      };
    }
    if (liquidity.status === 'WATCH') {
      return {
        label: state.banglaMode ? 'সতর্ক সংকেত (ব্যাংক বাফার সীমিত)' : 'APPROACHING PRESSURE (BANK BUFFER LOW)',
        barColor: 'bg-amber-500',
        textColor: 'text-amber-500',
        badgeBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
        statusDesc: state.banglaMode ? 'ভল্ট ক্যাশ ব্যাংকে জমা না দিলে অটো-ডেবিট বাউন্সের ঝুঁকি' : 'Vault cash must be deposited into Islami Bank before cutoff to avoid debit failure.',
      };
    }
    return {
      label: state.banglaMode ? 'তহবিল ঘাটতি (অটো-ডেবিট ঝুঁকিতে)' : 'INSUFFICIENT LIQUIDITY (DEBIT AT RISK)',
      barColor: 'bg-rose-500',
      textColor: 'text-rose-500',
      badgeBg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
      statusDesc: state.banglaMode ? 'জরুরি ভিত্তিতে ঋণ আদায় বা অতিরিক্ত তহবিল প্রয়োজন' : 'Immediate cash injection or route collection required to clear obligations.',
    };
  };

  const runway = getRunwayState();

  return (
    <section
      aria-label="Executive Liquidity Runway"
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 shadow-xs text-[var(--foreground)] backdrop-blur-md transition-colors duration-200"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Left: LIQUIDITY HERO (Columns 1-5) */}
        <div className="lg:col-span-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[var(--border)] pb-4 lg:pb-0 lg:pr-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--foreground-muted)] flex items-center gap-1.5">
              <Wallet size={13} className="text-emerald-500" />
              {state.banglaMode ? 'উপলব্ধ তরল তহবিল' : 'AVAILABLE LIQUID CASH'}
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {state.banglaMode ? 'তাত্ক্ষণিক অ্যাক্সেস' : 'IMMEDIATE ACCESS'}
            </span>
          </div>

          {/* Hero Cash Amount */}
          <div className="my-1 text-3xl sm:text-4xl font-mono font-bold tracking-tight text-[var(--foreground)] flex items-baseline gap-2 dm-tabular">
            <span>{formatBDT(totalLiquidCash, { mode: 'exact', bangla: state.banglaMode })}</span>
            <span className="text-xs font-mono text-[var(--foreground-subtle)] font-normal">
              ({formatBDT(totalLiquidCash, { mode: 'summary', bangla: state.banglaMode })})
            </span>
          </div>

          {/* Subordinate Cash Breakdown: Bank & Vault */}
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono border-t border-[var(--border)] pt-2.5">
            <div className="rounded-xl bg-[var(--surface-elevated)] p-2.5 border border-[var(--border)] dm-interactive">
              <div className="flex items-center gap-1.5 text-[var(--foreground-muted)] text-[10px] uppercase font-semibold">
                <Building2 size={11} className="text-sky-400" />
                <span>{state.banglaMode ? 'ব্যাংক ব্যালেন্স' : 'BANK CASH'}</span>
              </div>
              <div className="mt-1 font-bold text-[var(--foreground)] dm-tabular">
                {formatBDT(state.bankCash, { mode: 'exact', bangla: state.banglaMode })}
              </div>
              <div className="text-[9px] text-[var(--foreground-subtle)] mt-0.5">
                Islami Bank (Post-Debit)
              </div>
            </div>

            <div
              onClick={onInspectVault}
              className="rounded-xl bg-[var(--surface-elevated)] p-2.5 border border-[var(--border)] cursor-pointer hover:border-[var(--border-hover)] transition dm-interactive"
            >
              <div className="flex items-center justify-between text-[var(--foreground-muted)] text-[10px] uppercase font-semibold">
                <span className="flex items-center gap-1.5">
                  <Vault size={11} className="text-amber-400" />
                  <span>{state.banglaMode ? 'ভল্ট / টিল ক্যাশ' : 'VAULT CASH'}</span>
                </span>
                <span className="text-[9px] text-amber-400 font-bold">Physical</span>
              </div>
              <div className="mt-1 font-bold text-[var(--foreground)] dm-tabular">
                {formatBDT(state.vaultCash, { mode: 'exact', bangla: state.banglaMode })}
              </div>
              <div className="text-[9px] text-[var(--foreground-subtle)] mt-0.5">
                Counted Today
              </div>
            </div>
          </div>
        </div>

        {/* Right: OBLIGATION COVERAGE & RUNWAY (Columns 6-12) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              <Clock size={13} className="text-amber-500" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--foreground)]">
                {state.banglaMode ? 'আসন্ন প্রধান দায় (৪৮ ঘণ্টা অটো-ডেবিট)' : 'NEXT 48H PRINCIPAL AUTO-DEBIT'}
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="text-[var(--foreground-muted)]">
                {state.banglaMode ? 'কাভারেজ অনুপাত:' : 'OBLIGATION COVERAGE:'}
              </span>
              <span className={`font-bold ${runway.textColor} dm-tabular`}>
                {liquidity.coverage}× ({coveragePercent}%)
              </span>
            </div>
          </div>

          {/* Metric comparison */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 my-1 text-xs font-mono">
            <div className="rounded-xl bg-[var(--surface-elevated)] p-2.5 border border-[var(--border)] dm-interactive">
              <span className="text-[10px] text-[var(--foreground-muted)] block uppercase font-semibold">
                {state.banglaMode ? 'মোট দায়' : 'TOTAL DUE'}
              </span>
              <span className="font-bold text-[var(--foreground)] text-sm dm-tabular">
                {formatBDT(upcomingObligation, { mode: 'exact', bangla: state.banglaMode })}
              </span>
            </div>

            <div className="rounded-xl bg-[var(--surface-elevated)] p-2.5 border border-[var(--border)] dm-interactive">
              <span className="text-[10px] text-[var(--foreground-muted)] block uppercase font-semibold">
                {state.banglaMode ? 'পরিশোধের মেয়াদ' : 'DUE WINDOW'}
              </span>
              <span className="font-bold text-amber-500 text-sm">
                48 Hours (Unilever BD)
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-xl bg-[var(--surface-elevated)] p-2.5 border border-[var(--border)] dm-interactive">
              <span className="text-[10px] text-[var(--foreground-muted)] block uppercase font-semibold">
                {state.banglaMode ? 'ব্যাংক একা কাভারেজ' : 'BANK-ONLY COVER'}
              </span>
              <span className="font-bold text-[var(--foreground-muted)] text-sm dm-tabular">
                {liquidity.bankOnlyCoverage}× (Requires Vault Deposit)
              </span>
            </div>
          </div>

          {/* HORIZONTAL LIQUIDITY RUNWAY INDICATOR */}
          <div className="mt-3 pt-2">
            <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
              <span className="text-[var(--foreground-muted)] font-semibold uppercase flex items-center gap-1">
                <span>LIQUID CASH</span>
                <span className="text-[var(--foreground-subtle)]">({formatBDT(totalLiquidCash, { mode: 'summary', bangla: state.banglaMode })})</span>
              </span>
              <span className={`font-bold ${runway.textColor} uppercase`}>
                {runway.label}
              </span>
              <span className="text-[var(--foreground-muted)] font-semibold uppercase flex items-center gap-1">
                <span>OBLIGATIONS</span>
                <span className="text-[var(--foreground-subtle)]">({formatBDT(upcomingObligation, { mode: 'summary', bangla: state.banglaMode })})</span>
              </span>
            </div>

            {/* Visual Runway Bar */}
            <div className="relative h-2 w-full rounded-full bg-[var(--surface-inset)] border border-[var(--border-subtle)] overflow-hidden">
              <div
                className={`h-full ${runway.barColor} transition-all duration-500 rounded-full`}
                style={{ width: `${Math.min(coveragePercent, 100)}%` }}
              />
              <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-rose-500" title="Full obligation line" />
            </div>

            <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-[var(--foreground-muted)]">
              <span className="truncate pr-2">{runway.statusDesc}</span>
              {onInspectObligations && (
                <button
                  onClick={onInspectObligations}
                  className="shrink-0 text-emerald-500 hover:text-emerald-400 font-semibold flex items-center gap-1 underline underline-offset-2"
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
