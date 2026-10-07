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
    <div className="fixed inset-y-0 right-0 w-full sm:w-[540px] bg-[var(--surface-elevated)] border-l border-[var(--border)] text-[var(--foreground)] z-50 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[var(--warning-soft)] text-[var(--warning)] rounded-lg border border-[var(--warning)]/20">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-mono font-extrabold text-[var(--foreground)] uppercase">
                Principal Obligation &amp; Auto-Debit Audit
              </h2>
              <span className="text-[10px] font-mono text-[var(--warning)]">ILLUSTRATIVE · SELECTED PORTFOLIO SCOPE</span>
            </div>
          </div>
          <button
            onClick={closeDrawer}
            className="p-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] rounded-lg hover:bg-[var(--surface-hover)] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Breakdown */}
        <div className="bg-[var(--surface-inset)] p-4 rounded-xl border border-[var(--border)] mb-6">
          <div className="text-xs font-mono font-bold text-[var(--foreground-muted)] mb-3 uppercase">
            {portfolio.upcomingObligation > 0
              ? `Scheduled Supplier Auto-Debit · Due in ${state.obligationDueHours} Hours`
              : 'No Scheduled Supplier Auto-Debit In This Scope'}
          </div>

          {portfolio.upcomingObligation > 0 ? (
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between bg-[var(--surface-elevated)] p-2.5 rounded border border-[var(--border)]">
                <div>
                  <div className="text-[var(--foreground)] font-bold">Invoice #FMCG-BD-8891</div>
                  <div className="text-[10px] text-[var(--foreground-muted)]">Personal Care (Toiletries, Hair Care, Skin)</div>
                </div>
                <div className="text-[var(--warning)] font-bold">{formatBDT(firstInvoice)}</div>
              </div>

              <div className="flex justify-between bg-[var(--surface-elevated)] p-2.5 rounded border border-[var(--border)]">
                <div>
                  <div className="text-[var(--foreground)] font-bold">Invoice #FMCG-BD-8892</div>
                  <div className="text-[10px] text-[var(--foreground-muted)]">Home Care (Detergent, Fabric, Dishwash)</div>
                </div>
                <div className="text-[var(--warning)] font-bold">{formatBDT(secondInvoice)}</div>
              </div>
            </div>
          ) : (
            <p className="rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] p-3 text-[11px] leading-relaxed text-[var(--foreground-muted)]">
              No supplier auto-debit is allocated to this principal/depot scope in the illustrative data.
            </p>
          )}

          <div className="mt-4 pt-3 border-t border-[var(--border)] flex justify-between font-mono font-bold text-sm">
            <span className="text-[var(--foreground-muted)]">Total Obligation Sweep:</span>
            <span className="text-[var(--warning)]">{formatBDT(portfolio.upcomingObligation)}</span>
          </div>
        </div>

        {/* Bank Account Funding Status */}
        <div className="bg-[var(--surface-inset)] p-4 rounded-xl border border-[var(--border)] mb-6">
          <div className="flex items-center gap-2 text-[var(--accent)] font-mono font-bold text-xs mb-3">
            <Building className="w-4 h-4" />
            <span>Cash balances · selected portfolio scope</span>
          </div>

          <div className="space-y-2 text-xs font-mono bg-[var(--surface-elevated)] p-3 rounded border border-[var(--border)]">
            <div className="flex justify-between">
              <span className="text-[var(--foreground-muted)]">Current Bank Cash:</span>
              <span className="text-[var(--foreground)] font-bold">{formatBDT(portfolio.bankCash)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--foreground-muted)]">Vault Cash (Till Balance):</span>
              <span className="text-[var(--success)] font-bold">{formatBDT(portfolio.vaultCash)}</span>
            </div>
            <div className="flex justify-between border-t border-[var(--border)] pt-2">
              <span className="text-[var(--foreground-muted)]">Total Liquid Cash (Bank + Vault):</span>
              <span className="text-[var(--accent)] font-bold">{formatBDT(liquidCash)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--foreground-muted)]">Post Sweep Cash Buffer:</span>
              <span className={`font-bold ${projectedRemaining < 0 ? 'text-[var(--danger)]' : 'text-[var(--success)]'}`}>
                {formatBDT(projectedRemaining)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between gap-2 text-xs font-mono">
        <button
          onClick={() => {
            closeDrawer();
            openModal('BANK_DEPOSIT');
          }}
          className="px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-bright)] text-white font-bold rounded-lg transition-all active:scale-[0.98]"
        >
          Post Deposit to Bank →
        </button>
        <button
          onClick={closeDrawer}
          className="px-4 py-2 bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] rounded-lg border border-[var(--border)]"
        >
          Close
        </button>
      </div>
    </div>
  );
};
