'use client';

import React from 'react';
import { useExecutive } from '@/context/ExecutiveContext';
import { Lock, ArrowUpRight, CheckSquare, ShieldAlert, X } from 'lucide-react';
import { formatBDT } from '@/utils/formatters';

export const ActionConfirmationModal: React.FC = () => {
  const { state, closeModal, confirmCreditLock, confirmBankDeposit, confirmDayEndClose, resolveAlert } = useExecutive();

  if (!state.activeModal) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* 1. CREDIT LOCK MODAL */}
      {state.activeModal === 'CREDIT_LOCK' && (
        <div className="bg-[var(--surface-elevated)] border border-[var(--warning)]/50 rounded-2xl p-6 max-w-md w-full shadow-2xl text-[var(--foreground)]">
          <div className="flex items-center justify-between mb-4 border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[var(--warning-soft)] text-[var(--warning)] rounded-lg border border-[var(--warning)]/20">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-mono font-extrabold text-[var(--foreground)] uppercase">
                CREDIT LOCK
              </h2>
            </div>
            <button onClick={closeModal} className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] p-1 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs font-mono text-[var(--foreground-muted)] mb-4 leading-relaxed">
            You are about to simulate a supply lock for selected overdue retailers across Sherpur &amp; Bogura beats.
          </p>

          <div className="bg-[var(--surface-inset)] p-4 rounded-xl border border-[var(--border)] mb-6 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-[var(--foreground-muted)]">
              <span>Affected Overdue Retailers:</span>
              <strong className="text-[var(--foreground)] font-mono">7 Shop Owners</strong>
            </div>
            <div className="flex justify-between text-[var(--foreground-muted)]">
              <span>Estimated Exposed Credit Locked:</span>
              <strong className="text-[var(--warning)] font-mono">{formatBDT(84000)}</strong>
            </div>
            <div className="flex justify-between text-[var(--foreground-muted)]">
              <span>Impact on Next Dispatch:</span>
              <strong className="text-[var(--success)] font-mono">Supply Suspended</strong>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 text-xs font-mono">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] rounded-lg border border-[var(--border)]"
            >
              CANCEL
            </button>
            <button
              onClick={() => confirmCreditLock()}
              className="px-5 py-2 bg-[var(--warning)] hover:opacity-90 text-white font-bold rounded-lg shadow-lg active:scale-[0.98]"
            >
              CONFIRM SIMULATION
            </button>
          </div>
        </div>
      )}

      {/* 2. BANK DEPOSIT MODAL */}
      {state.activeModal === 'BANK_DEPOSIT' && (
        <div className="bg-[var(--surface-elevated)] border border-[var(--accent)]/50 rounded-2xl p-6 max-w-md w-full shadow-2xl text-[var(--foreground)]">
          <div className="flex items-center justify-between mb-4 border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[var(--accent-soft)] text-[var(--accent)] rounded-lg border border-[var(--accent)]/20">
                <ArrowUpRight className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-mono font-extrabold text-[var(--foreground)] uppercase">
                BANK CASH DEPOSIT
              </h2>
            </div>
            <button onClick={closeModal} className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] p-1 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs font-mono text-[var(--foreground-muted)] mb-4 leading-relaxed">
            Prepare physical vault cash for direct deposit into Islami Bank Sherpur Branch Account #9021.
          </p>

          <div className="bg-[var(--surface-inset)] p-4 rounded-xl border border-[var(--border)] mb-6 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-[var(--foreground-muted)]">
              <span>Vault Cash to Deposit:</span>
              <strong className="text-[var(--success)] font-mono">{formatBDT(state.vaultCash)}</strong>
            </div>
            <div className="flex justify-between text-[var(--foreground-muted)]">
              <span>Destination Account:</span>
              <strong className="text-[var(--accent)] font-mono">Islami Bank #9021</strong>
            </div>
            <div className="flex justify-between text-[var(--foreground-muted)]">
              <span>Post-Deposit Bank Cash:</span>
              <strong className="text-[var(--foreground)] font-mono">{formatBDT(state.bankCash + state.vaultCash)}</strong>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 text-xs font-mono">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] rounded-lg border border-[var(--border)]"
            >
              CANCEL
            </button>
            <button
              onClick={() => confirmBankDeposit()}
              className="px-5 py-2 bg-[var(--accent)] hover:bg-[var(--accent-bright)] text-white font-bold rounded-lg shadow-lg active:scale-[0.98]"
            >
              CONFIRM DEPOSIT
            </button>
          </div>
        </div>
      )}

      {/* 3. DAY-END CLOSE MODAL */}
      {state.activeModal === 'DAY_END_CLOSE' && (
        <div className="bg-[var(--surface-elevated)] border border-[var(--accent)]/50 rounded-2xl p-6 max-w-md w-full shadow-2xl text-[var(--foreground)]">
          <div className="flex items-center justify-between mb-4 border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[var(--accent-soft)] text-[var(--accent)] rounded-lg border border-[var(--accent)]/20">
                <CheckSquare className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-mono font-extrabold text-[var(--foreground)] uppercase">
                DAY-END CLOSEOUT
              </h2>
            </div>
            <button onClick={closeModal} className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] p-1 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs font-mono text-[var(--foreground-muted)] mb-4 leading-relaxed">
            Approve final daily cash reconciliation for 6 vans and lock executive control room into day-closed state.
          </p>

          <div className="bg-[var(--surface-inset)] p-4 rounded-xl border border-[var(--border)] mb-6 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-[var(--foreground-muted)]">
              <span>Total Sales Consolidated:</span>
              <strong className="text-[var(--foreground)] font-mono">{formatBDT(state.todaySales)}</strong>
            </div>
            <div className="flex justify-between text-[var(--foreground-muted)]">
              <span>Total Cash Vaulted:</span>
              <strong className="text-[var(--success)] font-mono">{formatBDT(state.reconciliationCounted)}</strong>
            </div>
            <div className="flex justify-between text-[var(--foreground-muted)]">
              <span>Unresolved Exceptions:</span>
              <strong className="text-[var(--warning)] font-mono">
                {state.alerts.filter(a => !a.resolved).length} Pending
              </strong>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 text-xs font-mono">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] rounded-lg border border-[var(--border)]"
            >
              CANCEL
            </button>
            <button
              onClick={() => confirmDayEndClose()}
              className="px-5 py-2 bg-[var(--accent)] hover:bg-[var(--accent-bright)] text-white font-bold rounded-lg shadow-lg active:scale-[0.98]"
            >
              APPROVE CLOSEOUT
            </button>
          </div>
        </div>
      )}

      {/* 4. EXCEPTIONS MODAL */}
      {state.activeModal === 'EXCEPTIONS' && (
        <div className="bg-[var(--surface-elevated)] border border-[var(--danger)]/50 rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[80vh] flex flex-col justify-between text-[var(--foreground)]">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-6 h-6 text-[var(--danger)]" />
                <h2 className="text-lg font-mono font-extrabold text-[var(--foreground)] uppercase">
                  Active Exceptions Log ({state.alerts.filter(a => !a.resolved).length})
                </h2>
              </div>
              <button onClick={closeModal} className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-2">
              {state.alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-xl border text-xs font-mono ${
                    alert.resolved
                      ? 'bg-[var(--surface-inset)] border-[var(--border)] opacity-60'
                      : 'bg-[var(--surface-inset)] border-[var(--danger)]/30'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-[var(--foreground)]">{alert.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                      alert.resolved ? 'bg-[var(--success-soft)] text-[var(--success)] border-[var(--success)]/20' : 'bg-[var(--danger-soft)] text-[var(--danger)] border-[var(--danger)]/20'
                    }`}>
                      {alert.resolved ? 'RESOLVED' : alert.severity}
                    </span>
                  </div>
                  <p className="text-[var(--foreground-muted)] text-[11px] mb-2">{alert.whatHappened}</p>
                  {!alert.resolved && (
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="px-3 py-1 bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--foreground)] rounded text-[11px] border border-[var(--border)]"
                    >
                      Mark Reviewed
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--border)] flex justify-end">
            <button
              onClick={closeModal}
              className="px-5 py-2 bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--foreground)] font-mono text-xs rounded-lg border border-[var(--border)]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
