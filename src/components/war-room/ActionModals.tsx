'use client';

import React, { useState } from 'react';
import { useExecutive } from '../../context/ExecutiveContext.tsx';
import {
  Lock,
  X,
  AlertTriangle,
  FileCheck2,
  Building2,
  Info,
} from 'lucide-react';
import { formatBDT } from '../../utils/formatters.ts';
import { top10OverdueRetailers } from '../../data/seedData.ts';

export const ActionModals: React.FC = () => {
  const {
    state,
    closeModal,
    confirmCreditLock,
    confirmBankDeposit,
    confirmDayEndClose,
    handleOpenShortageCase,
  } = useExecutive();

  // Modal form states
  const [reason, setReason] = useState('');
  const [shortageAction, setShortageAction] = useState<'WAIVE' | 'RECOVER' | 'ESCALATE'>('WAIVE');
  const [shortageNotes, setShortageNotes] = useState(
    'Shortage occurred during rush-hour collection at Bogura Link road point when shopkeeper made partial payment with ৳500 note.'
  );
  const shortageAmount = 400;
  const selectedJsr = 'Babul Hossain (Van #3)';

  if (!state.activeModal) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* 1. SHORTAGE CASE MODAL (Defect E1) */}
      {state.activeModal === 'SHORTAGE_CASE' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full shadow-2xl text-slate-800">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold uppercase tracking-tight text-slate-900">
                  Open Shortage Case · Route Audit
                </h2>
                <p className="text-[11px] text-slate-500 font-mono">Van #3 · Bogura Link Road</p>
              </div>
            </div>
            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500 block text-[10px]">Assigned JSR:</span>
                <span className="font-bold text-slate-800">{selectedJsr}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Shortage Discrepancy:</span>
                <span className="font-bold text-amber-600">−{formatBDT(shortageAmount)}</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Investigation Note & Explanation:
              </label>
              <textarea
                value={shortageNotes}
                onChange={(e) => setShortageNotes(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="Record statement from JSR and cash verification note..."
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                Resolution Workflow Action:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'WAIVE', label: 'Approve Waiver', desc: 'Waive small rush-hour diff' },
                  { id: 'RECOVER', label: 'Schedule Recovery', desc: 'Payroll deduction schedule' },
                  { id: 'ESCALATE', label: 'Escalate to Owner', desc: 'Hold for audit committee' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setShortageAction(opt.id as 'WAIVE' | 'RECOVER' | 'ESCALATE')}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      shortageAction === opt.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-[11px]">{opt.label}</div>
                    <div className="text-[9px] text-slate-400 font-normal mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Legal Notice */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-[10px] text-amber-800 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Legal & Compliance Notice:</strong> Salary or allowance deductions require written employee consent under Bangladesh Labour Law regulations and documented company policy. Never enforce auto-deduction without verification.
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2 text-xs font-mono">
            <button
              onClick={closeModal}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleOpenShortageCase({
                  routeId: 'van-3',
                  jsrName: 'Babul Hossain',
                  amount: shortageAmount,
                  notes: shortageNotes,
                  action: shortageAction,
                });
              }}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-sm"
            >
              Confirm Resolution
            </button>
          </div>
        </div>
      )}

      {/* 2. CREDIT LOCK MODAL (Defect E2) */}
      {state.activeModal === 'CREDIT_LOCK' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full shadow-2xl text-slate-800">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold uppercase tracking-tight text-slate-900">
                Enforce Credit Lock · Overdue Retailers
              </h2>
            </div>
            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-slate-600 mb-3">
            Suspending invoice delivery for retailers exceeding overdue aging policy (&gt;30 days).
          </p>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 mb-3 max-h-48 overflow-y-auto space-y-1.5 text-xs font-mono">
            {top10OverdueRetailers.slice(0, 5).map((ret) => (
              <div key={ret.id} className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-200">
                <div>
                  <span className="font-bold text-slate-800 block text-[11px]">{ret.name}</span>
                  <span className="text-[10px] text-slate-400">{ret.marketPoint} · {ret.overdueDays}d overdue</span>
                </div>
                <span className="font-bold text-amber-600 tabular-nums">{formatBDT(ret.balance)}</span>
              </div>
            ))}
          </div>

          <div className="mb-4 text-xs font-mono">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Supervisor Justification (Required for Audit Log):
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Enforcing credit ceiling across Bogura link beats"
              className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="flex items-center justify-end gap-2 text-xs font-mono">
            <button onClick={closeModal} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl">
              Cancel
            </button>
            <button
              onClick={() => confirmCreditLock(reason)}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl"
            >
              Enact Credit Lock
            </button>
          </div>
        </div>
      )}

      {/* 3. BANK DEPOSIT MODAL (Defect A1, E2) */}
      {state.activeModal === 'BANK_DEPOSIT' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl text-slate-800">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200">
                <Building2 className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold uppercase tracking-tight text-slate-900">
                Deposit Vault Cash to Bank
              </h2>
            </div>
            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs font-mono mb-4">
            <div className="flex justify-between">
              <span className="text-slate-500">Deposit In Transit:</span>
              <span className="font-bold text-emerald-600">{formatBDT(state.depositInTransit)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Current Bank Balance:</span>
              <span className="font-bold text-slate-700">{formatBDT(state.bankCash)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 font-bold">
              <span className="text-slate-800">Projected Post-Deposit Bank:</span>
              <span className="text-emerald-700">{formatBDT(state.bankCash + state.depositInTransit)}</span>
            </div>
          </div>

          <div className="mb-4 text-xs font-mono">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Deposit Slip / Bank Reference:
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Cash transit deposit slip #DEP-9021"
              className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="flex items-center justify-end gap-2 text-xs font-mono">
            <button onClick={closeModal} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl">
              Cancel
            </button>
            <button
              onClick={() => confirmBankDeposit(reason)}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl"
            >
              Post Bank Deposit
            </button>
          </div>
        </div>
      )}

      {/* 4. DAY-END CLOSEOUT MODAL (Defect E2) */}
      {state.activeModal === 'DAY_END_CLOSE' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl text-slate-800">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-slate-100 text-slate-700 rounded-xl border border-slate-200">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold uppercase tracking-tight text-slate-900">
                Review and Close Day
              </h2>
            </div>
            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs font-mono mb-4">
            <div className="flex justify-between">
              <span className="text-slate-500">All 12 Routes Checked In:</span>
              <span className="font-bold text-emerald-600">Yes (100%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Unresolved Till Shortage:</span>
              <span className="font-bold text-amber-600">{formatBDT(state.cashVariance)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Critical Alerts Active:</span>
              <span className="font-bold text-slate-700">
                {state.alerts.filter((a) => !a.resolved && a.severity === 'CRITICAL').length}
              </span>
            </div>
          </div>

          <div className="mb-4 text-xs font-mono">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Supervisor Verification Sign-Off:
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Evening till and route cash books balanced"
              className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="flex items-center justify-end gap-2 text-xs font-mono">
            <button onClick={closeModal} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl">
              Cancel
            </button>
            <button
              onClick={() => confirmDayEndClose(reason)}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl"
            >
              Finalize Day Closeout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
