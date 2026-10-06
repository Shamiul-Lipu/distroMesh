'use client';

import React from 'react';
import { useExecutive } from '@/context/ExecutiveContext';
import { Lock, ArrowUpRight, CheckSquare, ShieldAlert, X } from 'lucide-react';
import { formatBDT } from '@/utils/formatters';

export const ActionConfirmationModal: React.FC = () => {
  const { state, closeModal, confirmCreditLock, confirmBankDeposit, confirmDayEndClose, resolveAlert } = useExecutive();

  if (!state.activeModal) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* 1. CREDIT LOCK MODAL */}
      {state.activeModal === 'CREDIT_LOCK' && (
        <div className="bg-[#111827] border-2 border-amber-500/60 rounded-2xl p-6 max-w-md w-full shadow-2xl">
          <div className="flex items-center justify-between mb-4 border-b border-[#1F2937] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-mono font-extrabold text-white uppercase">
                CREDIT LOCK
              </h2>
            </div>
            <button onClick={closeModal} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs font-mono text-gray-300 mb-4 leading-relaxed">
            You are about to simulate a supply lock for selected overdue retailers across Sherpur & Bogura beats.
          </p>

          <div className="bg-[#0B0F19] p-4 rounded-xl border border-[#374151] mb-6 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-gray-300">
              <span>Affected Overdue Retailers:</span>
              <strong className="text-white font-mono">7 Shop Owners</strong>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Estimated Exposed Credit Locked:</span>
              <strong className="text-amber-400 font-mono">{formatBDT(84000)}</strong>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Impact on Next Dispatch:</span>
              <strong className="text-emerald-400 font-mono">Supply Suspended</strong>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 text-xs font-mono">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-[#1F2937] hover:bg-[#374151] text-gray-300 rounded-lg"
            >
              CANCEL
            </button>
            <button
              onClick={() => confirmCreditLock()}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg shadow-lg"
            >
              CONFIRM SIMULATION
            </button>
          </div>
        </div>
      )}

      {/* 2. BANK DEPOSIT MODAL */}
      {state.activeModal === 'BANK_DEPOSIT' && (
        <div className="bg-[#111827] border-2 border-blue-500/60 rounded-2xl p-6 max-w-md w-full shadow-2xl">
          <div className="flex items-center justify-between mb-4 border-b border-[#1F2937] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                <ArrowUpRight className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-mono font-extrabold text-white uppercase">
                BANK CASH DEPOSIT
              </h2>
            </div>
            <button onClick={closeModal} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs font-mono text-gray-300 mb-4 leading-relaxed">
            Prepare physical vault cash for direct deposit into Islami Bank Sherpur Branch Account #9021.
          </p>

          <div className="bg-[#0B0F19] p-4 rounded-xl border border-[#374151] mb-6 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-gray-300">
              <span>Vault Cash to Deposit:</span>
              <strong className="text-emerald-400 font-mono">{formatBDT(state.vaultCash)}</strong>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Destination Account:</span>
              <strong className="text-blue-400 font-mono">Islami Bank #9021</strong>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Post-Deposit Bank Cash:</span>
              <strong className="text-white font-mono">{formatBDT(state.bankCash + state.vaultCash)}</strong>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 text-xs font-mono">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-[#1F2937] hover:bg-[#374151] text-gray-300 rounded-lg"
            >
              CANCEL
            </button>
            <button
              onClick={() => confirmBankDeposit()}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg"
            >
              CONFIRM DEPOSIT
            </button>
          </div>
        </div>
      )}

      {/* 3. DAY-END CLOSE MODAL */}
      {state.activeModal === 'DAY_END_CLOSE' && (
        <div className="bg-[#111827] border-2 border-purple-500/60 rounded-2xl p-6 max-w-md w-full shadow-2xl">
          <div className="flex items-center justify-between mb-4 border-b border-[#1F2937] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
                <CheckSquare className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-mono font-extrabold text-white uppercase">
                DAY-END CLOSEOUT
              </h2>
            </div>
            <button onClick={closeModal} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs font-mono text-gray-300 mb-4 leading-relaxed">
            Approve final daily cash reconciliation for 6 vans and lock executive control room into day-closed state.
          </p>

          <div className="bg-[#0B0F19] p-4 rounded-xl border border-[#374151] mb-6 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-gray-300">
              <span>Total Sales Consolidated:</span>
              <strong className="text-white font-mono">{formatBDT(state.todaySales)}</strong>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Total Cash Vaulted:</span>
              <strong className="text-emerald-400 font-mono">{formatBDT(state.reconciliationCounted)}</strong>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Unresolved Exceptions:</span>
              <strong className="text-amber-400 font-mono">
                {state.alerts.filter(a => !a.resolved).length} Pending
              </strong>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 text-xs font-mono">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-[#1F2937] hover:bg-[#374151] text-gray-300 rounded-lg"
            >
              CANCEL
            </button>
            <button
              onClick={() => confirmDayEndClose()}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg shadow-lg"
            >
              APPROVE CLOSEOUT
            </button>
          </div>
        </div>
      )}

      {/* 4. EXCEPTIONS MODAL */}
      {state.activeModal === 'EXCEPTIONS' && (
        <div className="bg-[#111827] border-2 border-red-500/60 rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[80vh] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-[#1F2937] pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-6 h-6 text-red-400" />
                <h2 className="text-lg font-mono font-extrabold text-white uppercase">
                  Active Exceptions Log ({state.alerts.filter(a => !a.resolved).length})
                </h2>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-2">
              {state.alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-xl border text-xs font-mono ${
                    alert.resolved
                      ? 'bg-[#0B0F19] border-[#374151] opacity-50'
                      : 'bg-[#0B0F19] border-red-500/40'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-white">{alert.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      alert.resolved ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                    }`}>
                      {alert.resolved ? 'RESOLVED' : alert.severity}
                    </span>
                  </div>
                  <p className="text-gray-300 text-[11px] mb-2">{alert.whatHappened}</p>
                  {!alert.resolved && (
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="px-3 py-1 bg-[#1F2937] hover:bg-[#374151] text-gray-300 rounded text-[11px]"
                    >
                      Mark Reviewed
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#1F2937] flex justify-end">
            <button
              onClick={closeModal}
              className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-white font-mono text-xs rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
