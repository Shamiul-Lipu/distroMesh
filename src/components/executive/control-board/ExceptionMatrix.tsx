'use client';

import React from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  MinusCircle,
  Clock,
  Printer,
  CreditCard,
  Building2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { useExecutive } from '../../../context/ExecutiveContext';
import { formatBDT } from '../../../utils/formatters';

interface ExceptionMatrixProps {
  onOpenShortageModal?: () => void;
  onOpenBankDepositModal?: () => void;
  onOpenCreditLockModal?: () => void;
  onInspectIncidentDrawer?: () => void;
}

export const ExceptionMatrix: React.FC<ExceptionMatrixProps> = ({
  onOpenShortageModal,
  onOpenBankDepositModal,
  onOpenCreditLockModal,
  onInspectIncidentDrawer,
}) => {
  const { state } = useExecutive();

  const isShortageResolved = state.varianceWaived || state.varianceDeducted;
  const isDepositPrepared = state.depositPrepared;
  const isCreditLocked = state.creditLockActive;
  const isHardwareReplaced = state.hardwareReplaced;

  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 sm:p-5 shadow-sm font-mono text-slate-800">
      <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
        <div className="flex items-center gap-2">
          <AlertOctagon size={14} className="text-rose-600" />
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
            {state.banglaMode ? 'সক্রিয় ব্যতিক্রম ও ঝুঁকি পর্যালোচনা' : 'ACTIVE OPERATIONAL EXCEPTIONS'}
          </h2>
        </div>
        <span className="text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
          Financial &amp; Execution Vulnerabilities
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Exception 1: Cash Till Shortage */}
        <div className={`rounded-xl p-3.5 border flex flex-col justify-between transition ${
          isShortageResolved
            ? 'bg-slate-50 border-emerald-300 border-l-4 border-l-emerald-600 shadow-2xs'
            : 'bg-white border-rose-200 border-l-4 border-l-rose-500 shadow-xs'
        }`}>
          <div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-bold text-slate-500 uppercase">
                {state.banglaMode ? '১. ঘটনা (EVENT)' : '1. EVENT'}
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                isShortageResolved ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-700'
              }`}>
                {isShortageResolved ? 'RESOLVED' : 'HIGH PRIORITY'}
              </span>
            </div>

            <h3 className="font-bold text-slate-900 text-xs mt-1">
              {state.banglaMode ? 'ভ্যান #৩ ক্যাশ ঘাটতি' : 'Van #3 Cash Shortage'}
            </h3>

            {/* Financial Impact */}
            <div className="mt-2.5 rounded bg-slate-50 p-2 border border-slate-200">
              <span className="text-[9px] text-slate-500 uppercase block font-semibold">FINANCIAL IMPACT</span>
              <span className={`text-base font-bold ${isShortageResolved ? 'text-emerald-700' : 'text-rose-700'}`}>
                {isShortageResolved ? '৳0 (Recovered/Waived)' : '−৳400 Missing Cash'}
              </span>
            </div>

            {/* Owner */}
            <div className="mt-2 text-[10px] text-slate-600">
              <span className="text-slate-400">OWNER: </span>
              <strong className="text-slate-800">JSR Babul Hossain (Bogura Link)</strong>
            </div>

            {/* Resolution */}
            <div className="mt-1 text-[10px] text-slate-600">
              <span className="text-slate-400">RESOLUTION: </span>
              <span className="text-slate-700 font-sans">
                {isShortageResolved
                  ? (state.varianceDeducted ? 'Deducted from salary' : 'Approved by CEO waiver')
                  : 'Reconcile before day-end closeout'}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100">
            {isShortageResolved ? (
              <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold">
                <CheckCircle2 size={12} />
                <span>Shortage Audited</span>
              </span>
            ) : (
              <button
                onClick={onOpenShortageModal}
                className="w-full py-1.5 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] shadow-xs transition"
              >
                Resolve Shortage Case
              </button>
            )}
          </div>
        </div>

        {/* Exception 2: Morning Dispatch Delay */}
        <div className={`rounded-xl p-3.5 border flex flex-col justify-between transition ${
          isHardwareReplaced
            ? 'bg-slate-50 border-emerald-300 border-l-4 border-l-emerald-600 shadow-2xs'
            : 'bg-white border-rose-200 border-l-4 border-l-rose-500 shadow-xs'
        }`}>
          <div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-bold text-slate-500 uppercase">
                {state.banglaMode ? '২. ঘটনা (EVENT)' : '2. EVENT'}
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                isHardwareReplaced ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-700'
              }`}>
                {isHardwareReplaced ? 'RESOLVED' : 'EXECUTION BOTTLENECK'}
              </span>
            </div>

            <h3 className="font-bold text-slate-900 text-xs mt-1">
              Morning Dispatch Yard Stall (165 Min)
            </h3>

            {/* Financial Impact */}
            <div className="mt-2.5 rounded bg-slate-50 p-2 border border-slate-200">
              <span className="text-[9px] text-slate-500 uppercase block font-semibold">FINANCIAL IMPACT</span>
              <span className={`text-base font-bold ${isHardwareReplaced ? 'text-emerald-700' : 'text-rose-700'}`}>
                {isHardwareReplaced ? '৳0 Delay Cost' : '৳4,950 Idle Crew + ৳2,488 Loss'}
              </span>
            </div>

            {/* Owner */}
            <div className="mt-2 text-[10px] text-slate-600">
              <span className="text-slate-400">OWNER: </span>
              <strong className="text-slate-800">Depot Dispatch Yard</strong>
            </div>

            {/* Resolution */}
            <div className="mt-1 text-[10px] text-slate-600">
              <span className="text-slate-400">RESOLUTION: </span>
              <span className="text-slate-700 font-sans">
                {isHardwareReplaced ? 'Departures on schedule (09:00 AM)' : 'Expedite morning dispatch (2.8d payback)'}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100">
            {isHardwareReplaced ? (
              <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold">
                <CheckCircle2 size={12} />
                <span>Dispatch Cleared</span>
              </span>
            ) : (
              <button
                onClick={onInspectIncidentDrawer}
                className="w-full py-1.5 rounded bg-white hover:bg-slate-50 text-slate-700 font-bold text-[11px] border border-slate-300 shadow-2xs transition"
              >
                Inspect Payback Model
              </button>
            )}
          </div>
        </div>

        {/* Exception 3: 48h Principal Auto-Debit */}
        <div className={`rounded-xl p-3.5 border flex flex-col justify-between transition ${
          isDepositPrepared
            ? 'bg-slate-50 border-emerald-300 border-l-4 border-l-emerald-600 shadow-2xs'
            : 'bg-white border-amber-200 border-l-4 border-l-amber-500 shadow-xs'
        }`}>
          <div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-bold text-slate-500 uppercase">
                {state.banglaMode ? '৩. ঘটনা (EVENT)' : '3. EVENT'}
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                isDepositPrepared ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {isDepositPrepared ? 'IN TRANSIT' : '48H DEADLINE'}
              </span>
            </div>

            <h3 className="font-bold text-slate-900 text-xs mt-1">
              Unilever Stock Auto-Debit
            </h3>

            {/* Financial Impact */}
            <div className="mt-2.5 rounded bg-slate-50 p-2 border border-slate-200">
              <span className="text-[9px] text-slate-500 uppercase block font-semibold">FINANCIAL IMPACT</span>
              <span className="text-base font-bold text-amber-800">
                ৳54,00,000 Auto-Debit
              </span>
            </div>

            {/* Owner */}
            <div className="mt-2 text-[10px] text-slate-600">
              <span className="text-slate-400">OWNER: </span>
              <strong className="text-slate-800">Finance &amp; Treasury Desk</strong>
            </div>

            {/* Resolution */}
            <div className="mt-1 text-[10px] text-slate-600">
              <span className="text-slate-400">RESOLUTION: </span>
              <span className="text-slate-700 font-sans">
                {isDepositPrepared ? '৳8.00L deposit posted to bank' : 'Deposit ৳8.00L vault cash before 3pm'}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100">
            {isDepositPrepared ? (
              <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold">
                <CheckCircle2 size={12} />
                <span>Deposit In Transit</span>
              </span>
            ) : (
              <button
                onClick={onOpenBankDepositModal}
                className="w-full py-1.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shadow-xs transition"
              >
                Prepare Bank Deposit
              </button>
            )}
          </div>
        </div>

        {/* Exception 4: Overdue Receivables > 30 Days */}
        <div className={`rounded-xl p-3.5 border flex flex-col justify-between transition ${
          isCreditLocked
            ? 'bg-slate-50 border-emerald-300 border-l-4 border-l-emerald-600 shadow-2xs'
            : 'bg-white border-amber-200 border-l-4 border-l-amber-500 shadow-xs'
        }`}>
          <div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-bold text-slate-500 uppercase">
                {state.banglaMode ? '৪. ঘটনা (EVENT)' : '4. EVENT'}
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                isCreditLocked ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {isCreditLocked ? 'CREDIT LOCKED' : 'POLICY BREACH'}
              </span>
            </div>

            <h3 className="font-bold text-slate-900 text-xs mt-1">
              Overdue Receivables &gt;30d
            </h3>

            {/* Financial Impact */}
            <div className="mt-2.5 rounded bg-slate-50 p-2 border border-slate-200">
              <span className="text-[9px] text-slate-500 uppercase block font-semibold">FINANCIAL IMPACT</span>
              <span className="text-base font-bold text-amber-800">
                ৳35,50,685 (18.0% of AR)
              </span>
            </div>

            {/* Owner */}
            <div className="mt-2 text-[10px] text-slate-600">
              <span className="text-slate-400">OWNER: </span>
              <strong className="text-slate-800">14 Overdue Retailer Accounts</strong>
            </div>

            {/* Resolution */}
            <div className="mt-1 text-[10px] text-slate-600">
              <span className="text-slate-400">RESOLUTION: </span>
              <span className="text-slate-700 font-sans">
                {isCreditLocked ? 'Delivery lock active on overdue shops' : 'Pause fresh credit delivery on defaulters'}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100">
            {isCreditLocked ? (
              <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold">
                <CheckCircle2 size={12} />
                <span>Credit Lock Enforced</span>
              </span>
            ) : (
              <button
                onClick={onOpenCreditLockModal}
                className="w-full py-1.5 rounded bg-white hover:bg-rose-50 text-rose-700 font-bold text-[11px] border border-rose-200 shadow-2xs transition"
              >
                One-Tap Credit Lock
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
