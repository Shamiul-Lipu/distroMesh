'use client';

import React from 'react';
import { useExecutive } from '@/context/ExecutiveContext.tsx';
import { X, CalendarClock, Building } from 'lucide-react';
import { formatBDT } from '@/utils/formatters.ts';
import type { PortfolioSnapshot } from '@/data/portfolioDemo.ts';

export const ObligationDrawer: React.FC<{ portfolio: PortfolioSnapshot }> = ({ portfolio }) => {
  const { state, closeDrawer, openModal } = useExecutive();

  if (state.activeDrawer !== 'OBLIGATION') return null;

  const liquidCash = portfolio.bankCash + portfolio.vaultCash;
  const projectedRemaining = liquidCash - portfolio.upcomingObligation;
  const firstInvoice = state.upcomingObligation > 0
    ? Math.round(portfolio.upcomingObligation * (3_250_000 / 5_400_000))
    : 0;
  const secondInvoice = portfolio.upcomingObligation - firstInvoice;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[540px] bg-[#111827] border-l border-[#374151] z-50 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-[#1F2937] pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-mono font-extrabold text-white uppercase">
                Principal Obligation &amp; Auto-Debit Audit
              </h2>
              <span className="text-[10px] font-mono text-amber-300">ILLUSTRATIVE · SELECTED PORTFOLIO SCOPE</span>
            </div>
          </div>
          <button
            onClick={closeDrawer}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#1F2937] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Breakdown */}
        <div className="bg-[#0B0F19] p-4 rounded-xl border border-[#374151] mb-6">
          <div className="text-xs font-mono font-bold text-gray-400 mb-3 uppercase">
            {portfolio.upcomingObligation > 0
              ? `Scheduled Supplier Auto-Debit · Due in ${state.obligationDueHours} Hours`
              : 'No Scheduled Supplier Auto-Debit In This Scope'}
          </div>

          {portfolio.upcomingObligation > 0 ? (
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between bg-[#1F2937] p-2.5 rounded border border-[#374151]">
                <div>
                  <div className="text-white font-bold">Invoice #FMCG-BD-8891</div>
                  <div className="text-[10px] text-gray-400">Personal Care (Toiletries, Hair Care, Skin)</div>
                </div>
                <div className="text-amber-400 font-bold">{formatBDT(firstInvoice)}</div>
              </div>

              <div className="flex justify-between bg-[#1F2937] p-2.5 rounded border border-[#374151]">
                <div>
                  <div className="text-white font-bold">Invoice #FMCG-BD-8892</div>
                  <div className="text-[10px] text-gray-400">Home Care (Detergent, Fabric, Dishwash)</div>
                </div>
                <div className="text-amber-400 font-bold">{formatBDT(secondInvoice)}</div>
              </div>
            </div>
          ) : (
            <p className="rounded-lg border border-[#374151] bg-[#1F2937] p-3 text-[11px] leading-relaxed text-gray-300">
              No supplier auto-debit is allocated to this principal/depot scope in the illustrative data.
            </p>
          )}

          <div className="mt-4 pt-3 border-t border-[#374151] flex justify-between font-mono font-bold text-sm">
            <span className="text-gray-300">Total Obligation Sweep:</span>
            <span className="text-amber-400">{formatBDT(portfolio.upcomingObligation)}</span>
          </div>
        </div>

        {/* Bank Account Funding Status */}
        <div className="bg-[#0B0F19] p-4 rounded-xl border border-[#374151] mb-6">
          <div className="flex items-center gap-2 text-blue-400 font-mono font-bold text-xs mb-3">
            <Building className="w-4 h-4" />
            <span>Cash balances · selected portfolio scope</span>
          </div>

          <div className="space-y-2 text-xs font-mono bg-[#1F2937] p-3 rounded border border-[#374151]">
            <div className="flex justify-between">
              <span className="text-gray-400">Current Bank Cash:</span>
              <span className="text-white font-bold">{formatBDT(portfolio.bankCash)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Vault Cash (Till Balance):</span>
              <span className="text-emerald-400 font-bold">{formatBDT(portfolio.vaultCash)}</span>
            </div>
            <div className="flex justify-between border-t border-[#374151] pt-2">
              <span className="text-gray-400">Total Liquid Cash (Bank + Vault):</span>
              <span className="text-blue-300 font-bold">{formatBDT(liquidCash)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Post Sweep Cash Buffer:</span>
              <span className={`font-bold ${projectedRemaining < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {formatBDT(projectedRemaining)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-[#1F2937] flex items-center justify-between gap-2 text-xs font-mono">
        <button
          onClick={() => {
            closeDrawer();
            openModal('BANK_DEPOSIT');
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all"
        >
          Post Deposit to Bank →
        </button>
        <button
          onClick={closeDrawer}
          className="px-4 py-2 bg-[#1F2937] hover:bg-[#374151] text-gray-300 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};
