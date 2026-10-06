'use client';

import React from 'react';
import { useExecutive } from '../../context/ExecutiveContext';
import { AlertTriangle, ShieldAlert, ArrowRight, Zap, CheckCircle2, Lock } from 'lucide-react';
import { formatBDT } from '../../utils/formatters';

export const ModeSwitcher: React.FC = () => {
  const { state, setOperatingMode, openModal, openDrawer } = useExecutive();

  const liquidCash = state.bankCash + state.vaultCash;
  const buffer = liquidCash - state.upcomingObligation;

  if (state.operatingMode === 'CRITICAL_RISK') {
    return (
      <div className="bg-gradient-to-r from-red-950 via-red-900 to-red-950 border-2 border-red-500 rounded-xl p-5 mb-6 shadow-2xl animate-pulse">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-600 rounded-xl text-white shadow-lg animate-bounce">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-mono font-black text-white uppercase tracking-wider">
                  CRITICAL LIQUIDITY RISK — SIMULATION
                </h2>
                <span className="bg-black/60 text-red-400 border border-red-500 text-xs font-mono font-bold px-2 py-0.5 rounded">
                  EMERGENCY MODE
                </span>
              </div>
              <p className="text-xs font-mono text-red-200 mt-1">
                48-Hour Unilever Auto-Debit ({formatBDT(state.upcomingObligation)}) exceeds liquid cash buffer by{' '}
                <strong className="text-white underline">{formatBDT(Math.abs(buffer))}</strong>!
              </p>
            </div>
          </div>

          {/* Quick Emergency Actions */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => openModal('BANK_DEPOSIT')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs rounded-lg shadow-lg border border-emerald-400 transition-all flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4" />
              Deposit Vault Cash ({formatBDT(state.vaultCash)})
            </button>
            <button
              onClick={() => openModal('CREDIT_LOCK')}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-mono font-bold text-xs rounded-lg shadow-lg border border-amber-400 transition-all flex items-center gap-1.5"
            >
              <Lock className="w-4 h-4" />
              Lock Overdue Credit (৳84,000)
            </button>
            <button
              onClick={() => setOperatingMode('LIVE_OPS')}
              className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-mono text-xs rounded-lg border border-gray-600 transition-all"
            >
              Exit Emergency Mode
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Mode Specific Focus Banners for Morning / Live Ops / Evening Recon
  return (
    <div className="bg-[#111827] border border-[#374151] rounded-xl p-3 mb-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
      <div className="flex items-center gap-2">
        <span className="text-gray-400">Current Focus:</span>
        {state.operatingMode === 'MORNING' && (
          <span className="text-blue-400 font-bold bg-blue-950/60 px-2.5 py-1 rounded border border-blue-800">
            Dispatch Readiness • Target 09:00 AM • Billing Desk Status
          </span>
        )}
        {state.operatingMode === 'LIVE_OPS' && (
          <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800">
            Market Execution • 6 Vans On Route • Real-time Cash & Credit Monitoring
          </span>
        )}
        {state.operatingMode === 'EVENING_RECON' && (
          <span className="text-amber-300 font-bold bg-amber-950/60 px-2.5 py-1 rounded border border-amber-800">
            Evening Recon • Vault Settlement • Route Variance Audit & Closeout
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 text-gray-400">
        <span>Switch Operating Mode:</span>
        <button
          onClick={() => openDrawer('SIMULATION')}
          className="text-amber-400 hover:underline flex items-center gap-1"
        >
          <span>Modify Live Variables</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
