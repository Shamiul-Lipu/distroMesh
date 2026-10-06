'use client';

import React from 'react';
import { useExecutive } from '../../context/ExecutiveContext';
import { Lock, ArrowUpRight, CheckSquare, ShieldAlert } from 'lucide-react';

export const ActionCenter: React.FC = () => {
  const { state, openModal } = useExecutive();

  return (
    <div className="bg-[#111827] border border-[#374151] rounded-xl p-5 shadow-xl">
      {/* Module Title */}
      <div className="flex items-center justify-between mb-4 border-b border-[#1F2937] pb-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
          <h2 className="text-base font-bold text-[#F9FAFB] tracking-tight uppercase font-sans">
            Executive Decision & Action Cockpit
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1F2937] text-blue-400 border border-[#374151]">
            STATE-MUTATING CONTROLS
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {/* Action 1: CREDIT LOCK */}
        <button
          onClick={() => openModal('CREDIT_LOCK')}
          className={`p-4 rounded-xl border text-left transition-all group flex flex-col justify-between ${
            state.creditLockActive
              ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200'
              : 'bg-[#0B0F19] border-[#374151] hover:border-amber-500/60'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Lock className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                state.creditLockActive ? 'bg-indigo-900 text-indigo-300' : 'bg-amber-950 text-amber-300'
              }`}>
                {state.creditLockActive ? 'SIMULATED • LOCKED' : 'CONFIRMATION REQ'}
              </span>
            </div>
            <h3 className="text-sm font-mono font-bold text-white group-hover:text-amber-400 transition-colors">
              CREDIT LOCK
            </h3>
            <p className="text-xs font-mono text-gray-400 mt-1">
              Lock selected overdue retailer supply (7 outlets, ৳84k exposed).
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#1F2937] text-xs font-mono text-amber-400 flex items-center justify-between">
            <span>Execute Lock</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </button>

        {/* Action 2: BANK DEPOSIT */}
        <button
          onClick={() => openModal('BANK_DEPOSIT')}
          className={`p-4 rounded-xl border text-left transition-all group flex flex-col justify-between ${
            state.depositPrepared
              ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
              : 'bg-[#0B0F19] border-[#374151] hover:border-blue-500/60'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                state.depositPrepared ? 'bg-emerald-900 text-emerald-300' : 'bg-blue-950 text-blue-300'
              }`}>
                {state.depositPrepared ? 'DEPOSIT PREPARED' : 'VAULT DEPOSIT'}
              </span>
            </div>
            <h3 className="text-sm font-mono font-bold text-white group-hover:text-blue-400 transition-colors">
              BANK DEPOSIT
            </h3>
            <p className="text-xs font-mono text-gray-400 mt-1">
              Transfer ৳442,600 vault cash to Islami Bank before auto-debit sweep.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#1F2937] text-xs font-mono text-blue-400 flex items-center justify-between">
            <span>Prepare Deposit</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </button>

        {/* Action 3: DAY-END CLOSE */}
        <button
          onClick={() => openModal('DAY_END_CLOSE')}
          className={`p-4 rounded-xl border text-left transition-all group flex flex-col justify-between ${
            state.dayClosed
              ? 'bg-purple-950/60 border-purple-500 text-purple-200'
              : 'bg-[#0B0F19] border-[#374151] hover:border-purple-500/60'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <CheckSquare className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                state.dayClosed ? 'bg-purple-900 text-purple-300' : 'bg-purple-950 text-purple-300'
              }`}>
                {state.dayClosed ? 'DAY CLOSED' : 'CLOSEOUT'}
              </span>
            </div>
            <h3 className="text-sm font-mono font-bold text-white group-hover:text-purple-400 transition-colors">
              DAY-END CLOSE
            </h3>
            <p className="text-xs font-mono text-gray-400 mt-1">
              Approve daily reconciliation and lock control room into closed state.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#1F2937] text-xs font-mono text-purple-400 flex items-center justify-between">
            <span>Approve Reconciliation</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </button>

        {/* Action 4: REVIEW EXCEPTIONS */}
        <button
          onClick={() => openModal('EXCEPTIONS')}
          className="p-4 rounded-xl border text-left bg-[#0B0F19] border-[#374151] hover:border-red-500/60 transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-red-950 text-red-300 border border-red-800">
                {state.alerts.filter(a => !a.resolved).length} ISSUES
              </span>
            </div>
            <h3 className="text-sm font-mono font-bold text-white group-hover:text-red-400 transition-colors">
              REVIEW EXCEPTIONS
            </h3>
            <p className="text-xs font-mono text-gray-400 mt-1">
              Inspect all pending cash variances, hardware jams, and route alerts.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#1F2937] text-xs font-mono text-red-400 flex items-center justify-between">
            <span>Open Exceptions Modal</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </button>
      </div>
    </div>
  );
};
