'use client';

import React from 'react';
import { useExecutive } from '../../context/ExecutiveContext';
import { formatBDT, formatCompactBDT } from '../../utils/formatters';
import { ArrowDownRight, ArrowRight, Building } from 'lucide-react';

export const LiquidityOverview: React.FC = () => {
  const { state, openDrawer, openModal } = useExecutive();

  const liquidCash = state.bankCash + state.vaultCash;
  const projectedRemaining = liquidCash - state.upcomingObligation;

  const isCritical = projectedRemaining < 0;

  return (
    <div className="bg-[#111827] border border-[#374151] rounded-xl p-5 shadow-xl flex flex-col justify-between">
      {/* Module Title */}
      <div className="flex items-center justify-between mb-4 border-b border-[#1F2937] pb-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
          <h2 className="text-base font-bold text-[#F9FAFB] tracking-tight uppercase font-sans">
            Cash & Liquidity Bridge
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1F2937] text-blue-400 border border-[#374151]">
            48H LIQUIDITY POSITION
          </span>
        </div>
        <button
          onClick={() => openDrawer('OBLIGATION')}
          className="text-xs font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1 hover:underline"
        >
          <span>Obligation Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Figures Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {/* Available */}
        <div className="bg-[#0B0F19] p-3 rounded-lg border border-[#1F2937]">
          <div className="text-[11px] font-mono text-[#9CA3AF] uppercase">Available Liquid Cash</div>
          <div className="text-lg font-mono font-bold text-[#F9FAFB] mt-1">
            {formatCompactBDT(liquidCash)}
          </div>
          <div className="text-[10px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
            <span>Bank + Vault</span>
          </div>
        </div>

        {/* Bank & Vault */}
        <div className="bg-[#0B0F19] p-3 rounded-lg border border-[#1F2937]">
          <div className="text-[11px] font-mono text-[#9CA3AF] uppercase">Bank Account Balance</div>
          <div className="text-lg font-mono font-bold text-blue-400 mt-1">
            {formatCompactBDT(state.bankCash)}
          </div>
          <div className="text-[10px] font-mono text-gray-400 mt-1 flex items-center gap-1">
            <Building className="w-3 h-3 text-blue-400" />
            <span>Islami Bank #9021</span>
          </div>
        </div>

        {/* Upcoming Obligation */}
        <div className="bg-[#0B0F19] p-3 rounded-lg border border-[#1F2937]">
          <div className="text-[11px] font-mono text-[#9CA3AF] uppercase">Principal Auto-Debit</div>
          <div className="text-lg font-mono font-bold text-amber-400 mt-1">
            -{formatCompactBDT(state.upcomingObligation)}
          </div>
          <div className="text-[10px] font-mono text-amber-400/80 mt-1">
            Due in 48 Hours
          </div>
        </div>

        {/* Projected Remaining */}
        <div className={`p-3 rounded-lg border ${
          isCritical
            ? 'bg-red-950/40 border-red-500/50'
            : 'bg-[#0B0F19] border-[#1F2937]'
        }`}>
          <div className="text-[11px] font-mono text-[#9CA3AF] uppercase">Post-Debit Projected Cash</div>
          <div className={`text-lg font-mono font-bold mt-1 ${
            isCritical ? 'text-red-400' : 'text-emerald-400'
          }`}>
            {formatCompactBDT(projectedRemaining)}
          </div>
          <div className={`text-[10px] font-mono mt-1 ${
            isCritical ? 'text-red-400 font-bold' : 'text-emerald-400'
          }`}>
            {isCritical ? 'CRITICAL SHORTFALL' : '+৳230K Buffer Intact'}
          </div>
        </div>
      </div>

      {/* Visual Liquidity Bridge Diagram */}
      <div className="bg-[#0B0F19] rounded-lg p-4 border border-[#374151] relative">
        <div className="text-xs font-mono font-semibold text-[#9CA3AF] mb-3 uppercase flex items-center justify-between">
          <span>Liquidity Bridge Visualization</span>
          <span className="text-[10px] text-gray-500">DYNAMIC FLOW</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
          {/* Step 1 */}
          <div className="flex-1 w-full bg-[#1F2937] p-3 rounded-md border border-[#374151]">
            <div className="text-[10px] font-mono text-gray-400 uppercase">1. Current Liquid Cash</div>
            <div className="text-base font-mono font-bold text-white mt-0.5">
              {formatBDT(liquidCash)}
            </div>
            <div className="text-[10px] font-mono text-blue-400 mt-1">
              Bank ({formatCompactBDT(state.bankCash)}) + Vault ({formatCompactBDT(state.vaultCash)})
            </div>
          </div>

          {/* Connector Down */}
          <div className="flex flex-col items-center justify-center text-amber-400 font-mono text-xs">
            <ArrowRight className="w-5 h-5 hidden sm:block" />
            <ArrowDownRight className="w-5 h-5 sm:hidden" />
            <span className="text-[9px] font-bold uppercase text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800">
              -৳2.07M Sweep
            </span>
          </div>

          {/* Step 2 */}
          <div className="flex-1 w-full bg-[#1F2937] p-3 rounded-md border border-amber-500/30">
            <div className="text-[10px] font-mono text-amber-300 uppercase">2. Unilever Auto-Debit</div>
            <div className="text-base font-mono font-bold text-amber-400 mt-0.5">
              {formatBDT(state.upcomingObligation)}
            </div>
            <div className="text-[10px] font-mono text-amber-300/70 mt-1">
              Primary Product Invoice Clearance
            </div>
          </div>

          {/* Connector Down */}
          <div className="flex flex-col items-center justify-center text-emerald-400 font-mono text-xs">
            <ArrowRight className="w-5 h-5 hidden sm:block" />
            <ArrowDownRight className="w-5 h-5 sm:hidden" />
            <span className="text-[9px] font-bold uppercase text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
              Remaining
            </span>
          </div>

          {/* Step 3 */}
          <div className={`flex-1 w-full p-3 rounded-md border ${
            isCritical
              ? 'bg-red-950/60 border-red-500 text-red-300'
              : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
          }`}>
            <div className="text-[10px] font-mono uppercase opacity-80">3. Projected Cash Buffer</div>
            <div className="text-base font-mono font-bold mt-0.5">
              {formatBDT(projectedRemaining)}
            </div>
            <div className="text-[10px] font-mono mt-1 font-semibold">
              {isCritical ? '⚠️ DEPOSIT REQUIRED' : '✓ SAFE BUFFER AVAILABLE'}
            </div>
          </div>
        </div>

        {/* Quick Deposit Trigger if needed */}
        {state.vaultCash > 0 && (
          <div className="mt-4 pt-3 border-t border-[#1F2937] flex items-center justify-between text-xs font-mono">
            <span className="text-gray-400">Vault Cash available for deposit: <strong className="text-white">{formatBDT(state.vaultCash)}</strong></span>
            <button
              onClick={() => openModal('BANK_DEPOSIT')}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-mono font-bold transition-all shadow-md"
            >
              Simulate Bank Deposit →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
