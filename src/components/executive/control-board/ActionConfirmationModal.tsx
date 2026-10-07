'use client';

import React, { useState } from 'react';
import {
  X,
  Lock,
  Building2,
  MinusCircle,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { useExecutive } from '../../../context/ExecutiveContext';
import { formatBDT } from '../../../utils/formatters';

export type ActionModalType = 'CREDIT_LOCK' | 'BANK_DEPOSIT' | 'SHORTAGE' | 'DAY_END_CLOSE' | null;

interface ActionConfirmationModalProps {
  type: ActionModalType;
  onClose: () => void;
}

export const ActionConfirmationModal: React.FC<ActionConfirmationModalProps> = ({
  type,
  onClose,
}) => {
  const {
    state,
    confirmCreditLock,
    confirmBankDeposit,
    confirmDayEndClose,
    deductVariance,
    waiveVariance,
    showToast,
  } = useExecutive();

  const [depositAmount, setDepositAmount] = useState('800000');
  const [shortageOption, setShortageOption] = useState<'DEDUCT' | 'WAIVE'>('DEDUCT');

  if (!type) return null;

  const handleConfirmCreditLock = () => {
    confirmCreditLock('High overdue receivables >30 days policy violation');
    showToast('Credit lock enforced on 14 overdue retail accounts. Fresh delivery blocked.');
    onClose();
  };

  const handleConfirmBankDeposit = () => {
    confirmBankDeposit(`Deposit voucher of ৳${Number(depositAmount).toLocaleString('en-BD')} generated for Islami Bank`);
    showToast(`Bank deposit voucher of ${formatBDT(Number(depositAmount))} created. Physical vault transfer in transit.`);
    onClose();
  };

  const handleConfirmShortage = () => {
    if (shortageOption === 'DEDUCT') {
      deductVariance();
      showToast('Cash shortage −৳400 scheduled for salary recovery on JSR Babul next payroll.');
    } else {
      waiveVariance();
      showToast('CEO waiver approved: −৳400 variance written off as depot change float discrepancy.');
    }
    onClose();
  };

  const handleConfirmDayEnd = () => {
    confirmDayEndClose('All 12 routes reconciled, vault locked, and banking deposit in transit');
    showToast('Day-End Closeout finalized. Ledger frozen and archived for corporate accounting.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-mono animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-[#cbd5e1] bg-white shadow-2xl overflow-hidden text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e2e8f0] px-5 py-4 bg-slate-50">
          <div className="flex items-center gap-2.5">
            {type === 'CREDIT_LOCK' && <Lock size={18} className="text-rose-600" />}
            {type === 'BANK_DEPOSIT' && <Building2 size={18} className="text-amber-600" />}
            {type === 'SHORTAGE' && <MinusCircle size={18} className="text-amber-600" />}
            {type === 'DAY_END_CLOSE' && <ShieldCheck size={18} className="text-emerald-700" />}

            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              {type === 'CREDIT_LOCK' && (state.banglaMode ? 'খুচরা বাজারের ঋণ স্থগিতকরণ' : 'ONE-TAP CREDIT LOCK')}
              {type === 'BANK_DEPOSIT' && (state.banglaMode ? 'ইসলামী ব্যাংক জমা ভাউচার প্রস্তুত' : 'PREPARE BANK DEPOSIT')}
              {type === 'SHORTAGE' && (state.banglaMode ? 'ভ্যান #৩ ক্যাশ ঘাটতি নিরীক্ষা' : 'AUDIT & RESOLVE CASH SHORTAGE')}
              {type === 'DAY_END_CLOSE' && (state.banglaMode ? 'দৈনিক হিসাব সমাপ্তি অনুমোদন' : 'APPROVE DAY-END CLOSEOUT')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body: Explicit Consequence Transparency */}
        <div className="p-5 space-y-4 text-xs font-sans">
          {/* ========================================================
              MODAL: ONE-TAP CREDIT LOCK
              ======================================================== */}
          {type === 'CREDIT_LOCK' && (
            <div className="space-y-3 font-mono">
              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Accounts:</span>
                  <strong className="text-slate-800">14 High-Risk Overdue Retailers</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Overdue Exposure:</span>
                  <strong className="text-rose-700 font-bold">৳35,50,685 (&gt;30 Days)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Policy Threshold:</span>
                  <span className="text-slate-700">Max Credit Share &le; 45.0%</span>
                </div>
              </div>

              <div className="rounded-lg bg-rose-50 p-3 border border-rose-200 text-rose-950">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block mb-1">
                  EXPECTED OPERATIONAL EFFECT
                </span>
                <p className="text-xs leading-relaxed font-sans text-rose-950">
                  Prevents delivery vans from dropping fresh FMCG inventory on credit at high-risk grocery points until past overdue dues are settled in physical cash. Protects distributor working capital from bad debt.
                </p>
              </div>
            </div>
          )}

          {/* ========================================================
              MODAL: PREPARE BANK DEPOSIT
              ======================================================== */}
          {type === 'BANK_DEPOSIT' && (
            <div className="space-y-3 font-mono">
              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Source:</span>
                  <span className="text-slate-800">Warehouse Physical Vault (Available: {formatBDT(state.vaultCash)})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Destination Account:</span>
                  <strong className="text-slate-800">Islami Bank Bangladesh · A/C 2050145</strong>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <label className="block text-[10px] text-slate-500 uppercase mb-1 font-semibold">
                    Deposit Amount (BDT)
                  </label>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full h-9 rounded border border-slate-300 bg-white px-3 text-sm text-slate-900 font-mono font-bold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
                  />
                </div>
              </div>

              <div className="rounded-lg bg-amber-50 p-3 border border-amber-200 text-amber-950">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                  EXPECTED OPERATIONAL EFFECT
                </span>
                <p className="text-xs leading-relaxed font-sans text-amber-950">
                  Transfers ৳8,00,000 from warehouse safe to clearing bank account prior to 03:00 PM cutoff, ensuring sufficient liquid bank balance to cover the upcoming ৳54,00,000 Unilever Bangladesh auto-debit.
                </p>
              </div>
            </div>
          )}

          {/* ========================================================
              MODAL: SHORTAGE
              ======================================================== */}
          {type === 'SHORTAGE' && (
            <div className="space-y-3 font-mono">
              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Route / Van:</span>
                  <strong className="text-slate-800">Van #3 · Route 103 (Bogura Link Road)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Delivery Crew:</span>
                  <strong className="text-slate-800">JSR Babul Hossain (SR Tarek)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Till Variance:</span>
                  <span className="text-rose-700 font-bold text-sm">−৳400 (Shortage)</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Resolution Workflow:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setShortageOption('DEDUCT')}
                    className={`p-2.5 rounded-lg border text-left transition ${
                      shortageOption === 'DEDUCT'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-2xs'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-bold">Salary Deduction</div>
                    <div className="text-[10px] font-sans text-slate-500 mt-0.5">Deduct ৳400 from driver next payroll</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShortageOption('WAIVE')}
                    className={`p-2.5 rounded-lg border text-left transition ${
                      shortageOption === 'WAIVE'
                        ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold shadow-2xs'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-bold">Approve Waiver</div>
                    <div className="text-[10px] font-sans text-slate-500 mt-0.5">CEO write-off as till coin rounding</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              MODAL: DAY END CLOSE
              ======================================================== */}
          {type === 'DAY_END_CLOSE' && (
            <div className="space-y-3 font-mono">
              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Delivered Fleet Sales:</span>
                  <strong className="text-slate-800">৳9,60,000 (12 Beats, 700 Drops)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Cash Handed In:</span>
                  <strong className="text-emerald-700">৳8,60,000</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Counted Vault Till:</span>
                  <strong className="text-slate-800">৳8,95,200</strong>
                </div>
              </div>

              <div className="rounded-lg bg-emerald-50 p-3 border border-emerald-200 text-emerald-950">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                  EXPECTED AUDIT EFFECT
                </span>
                <p className="text-xs leading-relaxed font-sans text-emerald-950">
                  Freezes all 12 van route settlements, locks today's till reconciliation, updates receivables ledger, and posts immutable daily audit records for management reporting.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-[#e2e8f0] px-5 py-3.5 bg-slate-50">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-2xs"
          >
            Cancel
          </button>

          {type === 'CREDIT_LOCK' && (
            <button
              onClick={handleConfirmCreditLock}
              className="rounded-lg bg-rose-600 hover:bg-rose-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition"
            >
              Confirm Credit Lock
            </button>
          )}

          {type === 'BANK_DEPOSIT' && (
            <button
              onClick={handleConfirmBankDeposit}
              className="rounded-lg bg-amber-500 hover:bg-amber-600 px-4 py-2 text-xs font-bold text-slate-950 shadow-xs transition"
            >
              Confirm Bank Deposit
            </button>
          )}

          {type === 'SHORTAGE' && (
            <button
              onClick={handleConfirmShortage}
              className="rounded-lg bg-emerald-700 hover:bg-emerald-800 px-4 py-2 text-xs font-bold text-white shadow-xs transition"
            >
              Confirm Resolution
            </button>
          )}

          {type === 'DAY_END_CLOSE' && (
            <button
              onClick={handleConfirmDayEnd}
              className="rounded-lg bg-emerald-700 hover:bg-emerald-800 px-4 py-2 text-xs font-bold text-white shadow-xs transition"
            >
              Confirm Closeout &amp; Archive
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
