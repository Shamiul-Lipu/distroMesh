'use client';

import React from 'react';
import { useExecutive } from '../../context/ExecutiveContext';
import { formatBDT, formatVariance } from '../../utils/formatters';
import { Scale, CheckCircle2, AlertTriangle, ArrowRight, UserCheck, ShieldAlert } from 'lucide-react';

export const Reconciliation: React.FC = () => {
  const { state, openDrawer, waiveVariance, deductVariance } = useExecutive();

  const isWaived = state.varianceWaived;
  const isDeducted = state.varianceDeducted;
  const isException = state.cashVariance !== 0 && !isWaived && !isDeducted;

  return (
    <div className="bg-[#111827] border border-[#374151] rounded-xl p-5 shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-[#1F2937] pb-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-amber-500"></div>
          <h2 className="text-base font-bold text-[#F9FAFB] tracking-tight uppercase font-sans">
            Daily Cash Reconciliation
          </h2>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
            isException
              ? 'bg-amber-950 text-amber-300 border-amber-800'
              : 'bg-emerald-950 text-emerald-400 border-emerald-800'
          }`}>
            {isException ? 'EXCEPTION DETECTED' : 'RECONCILED'}
          </span>
        </div>
        <button
          onClick={() => openDrawer('RECONCILIATION')}
          className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 hover:underline"
        >
          <span>Vault Audit</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Reconciliation Data Bar */}
      <div className="bg-[#0B0F19] rounded-lg p-4 border border-[#374151] mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          {/* Expected */}
          <div className="bg-[#1F2937] p-3 rounded-md border border-[#374151]">
            <div className="text-[10px] font-mono text-[#9CA3AF] uppercase">Expected Collection</div>
            <div className="text-lg font-mono font-bold text-white mt-0.5">
              {formatBDT(state.reconciliationExpected)}
            </div>
            <div className="text-[10px] font-mono text-gray-400 mt-1">
              Invoice Total
            </div>
          </div>

          {/* Counted */}
          <div className="bg-[#1F2937] p-3 rounded-md border border-[#374151]">
            <div className="text-[10px] font-mono text-[#9CA3AF] uppercase">Physical Vault Counted</div>
            <div className="text-lg font-mono font-bold text-blue-400 mt-0.5">
              {formatBDT(state.reconciliationCounted)}
            </div>
            <div className="text-[10px] font-mono text-gray-400 mt-1">
              Vault Supervisor Sheet
            </div>
          </div>

          {/* Variance */}
          <div className={`p-3 rounded-md border ${
            isException
              ? 'bg-amber-950/40 border-amber-500/50'
              : 'bg-emerald-950/30 border-emerald-500/40'
          }`}>
            <div className="text-[10px] font-mono uppercase text-[#9CA3AF]">Cash Variance</div>
            <div className={`text-lg font-mono font-bold mt-0.5 ${
              isException ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {formatVariance(state.cashVariance)}
            </div>
            <div className="text-[10px] font-mono mt-1 font-semibold">
              {isException ? 'DISCREPANCY' : 'MATCHED'}
            </div>
          </div>

          {/* Assigned DSR & Route */}
          <div className="bg-[#1F2937] p-3 rounded-md border border-[#374151]">
            <div className="text-[10px] font-mono text-[#9CA3AF] uppercase">Assigned DSR & Beat</div>
            <div className="text-sm font-mono font-bold text-white mt-0.5 truncate">
              {state.reconciliationDSR}
            </div>
            <div className="text-[10px] font-mono text-amber-300 mt-0.5 truncate">
              {state.reconciliationRoute}
            </div>
          </div>
        </div>
      </div>

      {/* Neutral Language Callout & Quick Action Buttons */}
      <div className="bg-[#0B0F19] p-3 rounded-lg border border-[#374151] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-amber-300">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            {isWaived
              ? 'Status: WAIVED BY CEO — Variance resolved.'
              : isDeducted
              ? 'Status: DEDUCTION SCHEDULED — DSR payroll adjusted.'
              : 'Cash variance detected — review required.'}
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => openDrawer('RECONCILIATION')}
            className="flex-1 sm:flex-none px-3 py-1.5 bg-[#1F2937] hover:bg-[#374151] text-white rounded text-xs font-mono border border-[#374151] transition-all"
          >
            Review Details
          </button>
          {!isWaived && !isDeducted && (
            <>
              <button
                onClick={deductVariance}
                className="flex-1 sm:flex-none px-3 py-1.5 bg-amber-700/60 hover:bg-amber-600 text-white rounded text-xs font-mono transition-all"
              >
                Simulate Deduction
              </button>
              <button
                onClick={waiveVariance}
                className="flex-1 sm:flex-none px-3 py-1.5 bg-emerald-700/60 hover:bg-emerald-600 text-white rounded text-xs font-mono font-bold transition-all"
              >
                Approve Waiver
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
