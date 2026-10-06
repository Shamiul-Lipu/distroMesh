'use client';

import React from 'react';
import { useExecutive } from '../../context/ExecutiveContext';
import { formatBDT, formatVariance } from '../../utils/formatters';
import { Wallet, CalendarClock, ShieldCheck, ShieldAlert, AlertTriangle, Layers, Info } from 'lucide-react';

export const StatusStrip: React.FC = () => {
  const { state, openDrawer } = useExecutive();

  const liquidCash = state.bankCash + state.vaultCash;
  const liquidityBuffer = liquidCash - state.upcomingObligation;

  let bufferStatus: 'SAFE' | 'WATCH' | 'CRITICAL' = 'SAFE';
  let bufferBg = 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400';
  let bufferIcon = <ShieldCheck className="w-5 h-5 text-emerald-400" />;

  if (liquidityBuffer < 0) {
    bufferStatus = 'CRITICAL';
    bufferBg = 'bg-red-950/80 border-red-500/80 text-red-400 animate-pulse';
    bufferIcon = <ShieldAlert className="w-5 h-5 text-red-400" />;
  } else if (liquidityBuffer < 400000) {
    bufferStatus = 'WATCH';
    bufferBg = 'bg-amber-950/60 border-amber-500/60 text-amber-400';
    bufferIcon = <AlertTriangle className="w-5 h-5 text-amber-400" />;
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {/* 1. Liquid Cash */}
      <div
        onClick={() => openDrawer('OBLIGATION')}
        className="bg-[#111827] border border-[#374151] hover:border-blue-500/50 rounded-xl p-4 shadow-lg cursor-pointer transition-all hover:translate-y-[-2px] group"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-semibold uppercase text-[#9CA3AF]">
              Liquid Cash
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
            VERIFIED
          </span>
        </div>

        <div className="text-2xl xl:text-3xl font-mono font-bold text-[#F9FAFB] tracking-tight group-hover:text-blue-400 transition-colors">
          {formatBDT(liquidCash)}
        </div>

        <div className="mt-3 pt-2 border-t border-[#1F2937] flex items-center justify-between text-xs font-mono text-[#9CA3AF]">
          <div>Bank: <span className="text-[#F9FAFB] font-bold">{formatBDT(state.bankCash)}</span></div>
          <span className="text-gray-600">•</span>
          <div>Vault: <span className="text-[#F9FAFB] font-bold">{formatBDT(state.vaultCash)}</span></div>
        </div>
      </div>

      {/* 2. Upcoming Principal Obligation */}
      <div
        onClick={() => openDrawer('OBLIGATION')}
        className="bg-[#111827] border border-[#374151] hover:border-amber-500/50 rounded-xl p-4 shadow-lg cursor-pointer transition-all hover:translate-y-[-2px] group"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <CalendarClock className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-semibold uppercase text-[#9CA3AF]">
              Upcoming Obligation
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
            UNILEVER AUTO-DEBIT
          </span>
        </div>

        <div className="text-2xl xl:text-3xl font-mono font-bold text-[#F9FAFB] tracking-tight group-hover:text-amber-400 transition-colors">
          {formatBDT(state.upcomingObligation)}
        </div>

        <div className="mt-3 pt-2 border-t border-[#1F2937] flex items-center justify-between text-xs font-mono text-[#9CA3AF]">
          <span>Due in: <strong className="text-amber-400 font-bold">{state.obligationDueHours} HOURS</strong></span>
          <span className="text-blue-400 hover:underline text-[11px]">View Bridge →</span>
        </div>
      </div>

      {/* 3. Liquidity Buffer */}
      <div className={`border rounded-xl p-4 shadow-lg transition-all ${bufferBg}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-black/30">
              {bufferIcon}
            </div>
            <span className="text-xs font-mono font-semibold uppercase opacity-90">
              Liquidity Buffer
            </span>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-black/40 border border-current">
            {bufferStatus}
          </span>
        </div>

        <div className="text-2xl xl:text-3xl font-mono font-bold tracking-tight">
          {formatVariance(liquidityBuffer)}
        </div>

        <div className="mt-3 pt-2 border-t border-current/20 flex items-center justify-between text-xs font-mono opacity-90">
          <span>Post Auto-Debit Cash Buffer</span>
          <span className="font-bold">{liquidityBuffer >= 0 ? 'Surplus' : 'SHORTFALL!'}</span>
        </div>
      </div>

      {/* 4. Trapped Working Capital */}
      <div
        onClick={() => openDrawer('WORKING_CAPITAL')}
        className="bg-[#111827] border border-[#374151] hover:border-purple-500/50 rounded-xl p-4 shadow-lg cursor-pointer transition-all hover:translate-y-[-2px] group"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-semibold uppercase text-[#9CA3AF]">
              Trapped Capital
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
            ILLUSTRATIVE
          </span>
        </div>

        <div className="text-2xl xl:text-3xl font-mono font-bold text-[#F9FAFB] tracking-tight group-hover:text-purple-400 transition-colors">
          ৳{(state.trappedCapital.total / 1000000).toFixed(2)}M
        </div>

        <div className="mt-3 pt-2 border-t border-[#1F2937] flex items-center justify-between text-xs font-mono text-[#9CA3AF]">
          <span>Receivables + Inventory</span>
          <span className="text-purple-400 hover:underline text-[11px]">Breakdown →</span>
        </div>
      </div>
    </section>
  );
};
