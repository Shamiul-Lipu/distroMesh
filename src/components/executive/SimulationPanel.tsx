'use client';

import React from 'react';
import { useExecutive } from '../../context/ExecutiveContext';
import { SlidersHorizontal, RotateCcw, X } from 'lucide-react';
import { formatBDT } from '../../utils/formatters';

export const SimulationPanel: React.FC = () => {
  const { state, closeDrawer, updateSimulationValues, resetSimulation } = useExecutive();

  if (state.activeDrawer !== 'SIMULATION') return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[450px] bg-white border-l border-[#e2e8f0] z-50 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-mono font-bold text-slate-900 uppercase tracking-tight">
              Simulation Control Center
            </h2>
          </div>
          <button
            onClick={closeDrawer}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs font-mono text-slate-600 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
          Modify business parameters to test state-driven decision outputs. All dashboard metrics, buffer gauges, and alerts respond dynamically in real time.
        </p>

        {/* Sliders & Controls Form */}
        <div className="space-y-4 text-xs font-mono">
          {/* 1. Bank Cash */}
          <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
            <div className="flex justify-between mb-1">
              <label className="text-slate-700 font-semibold">Bank Account Cash</label>
              <span className="text-sky-700 font-bold">{formatBDT(state.bankCash)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="5000000"
              step="50000"
              value={state.bankCash}
              onChange={(e) => updateSimulationValues({ bankCash: Number(e.target.value) })}
              className="w-full accent-sky-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>৳0</span>
              <span>৳2.5M</span>
              <span>৳5.0M</span>
            </div>
          </div>

          {/* 2. Vault Cash */}
          <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
            <div className="flex justify-between mb-1">
              <label className="text-slate-700 font-semibold">Physical Vault Cash</label>
              <span className="text-emerald-700 font-bold">{formatBDT(state.vaultCash)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1000000"
              step="10000"
              value={state.vaultCash}
              onChange={(e) => updateSimulationValues({ vaultCash: Number(e.target.value) })}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>৳0</span>
              <span>৳500K</span>
              <span>৳1.0M</span>
            </div>
          </div>

          {/* 3. Upcoming Obligation */}
          <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
            <div className="flex justify-between mb-1">
              <label className="text-slate-700 font-semibold">Principal Auto-Debit Obligation</label>
              <span className="text-amber-700 font-bold">{formatBDT(state.upcomingObligation)}</span>
            </div>
            <input
              type="range"
              min="1000000"
              max="8000000"
              step="100000"
              value={state.upcomingObligation}
              onChange={(e) => updateSimulationValues({ upcomingObligation: Number(e.target.value) })}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>৳10.0 L</span>
              <span>৳54.0 L</span>
              <span>৳80.0 L</span>
            </div>
          </div>

          {/* 4. Fresh Retailer Credit */}
          <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
            <div className="flex justify-between mb-1">
              <label className="text-slate-700 font-semibold">Fresh Retailer Credit Extended Today</label>
              <span className="text-purple-700 font-bold">{formatBDT(state.freshCredit)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="450000"
              step="10000"
              value={state.freshCredit}
              onChange={(e) => updateSimulationValues({ freshCredit: Number(e.target.value) })}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>৳0 (0%)</span>
              <span>৳190K (39%)</span>
              <span>৳450K (93%)</span>
            </div>
          </div>

          {/* 5. Cash Variance */}
          <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
            <div className="flex justify-between mb-1">
              <label className="text-slate-700 font-semibold">Daily Cash Variance (Van #3)</label>
              <span className={`font-bold ${state.cashVariance < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                {state.cashVariance > 0 ? `+৳${state.cashVariance}` : `৳${state.cashVariance}`}
              </span>
            </div>
            <input
              type="range"
              min="-5000"
              max="5000"
              step="100"
              value={state.cashVariance}
              onChange={(e) => updateSimulationValues({ cashVariance: Number(e.target.value) })}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>-৳5,000</span>
              <span>৳0</span>
              <span>+৳5,000</span>
            </div>
          </div>

          {/* 6. Dispatch Delay */}
          <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
            <div className="flex justify-between mb-1">
              <label className="text-slate-700 font-semibold">Morning Dispatch Delay (Minutes)</label>
              <span className="text-rose-600 font-bold">{state.dispatchDelayMinutes} min</span>
            </div>
            <input
              type="range"
              min="0"
              max="300"
              step="15"
              value={state.dispatchDelayMinutes}
              onChange={(e) => updateSimulationValues({ dispatchDelayMinutes: Number(e.target.value) })}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0 min (On-Time)</span>
              <span>165 min</span>
              <span>300 min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reset & Done Footer */}
      <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
        <button
          onClick={resetSimulation}
          className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-mono text-xs font-semibold rounded-xl border border-slate-300 transition-all flex items-center gap-1.5 shadow-2xs"
        >
          <RotateCcw className="w-4 h-4 text-amber-600" />
          Reset Seed Data
        </button>
        <button
          onClick={closeDrawer}
          className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs font-bold rounded-xl transition-all shadow-2xs"
        >
          Apply Simulation →
        </button>
      </div>
    </div>
  );
};
