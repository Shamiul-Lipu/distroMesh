'use client';

import React from 'react';
import { useExecutive } from '../../context/ExecutiveContext';
import { AlertOctagon, Wrench, ShieldAlert, CheckCircle2, ArrowRight, CornerDownRight } from 'lucide-react';
import { ExecutiveAlert } from '../../types/executive';

export const AlertCenter: React.FC = () => {
  const { state, openDrawer, waiveVariance, deductVariance, replaceHardware, resolveAlert } = useExecutive();

  const activeAlerts = state.alerts.filter(a => !a.resolved);

  return (
    <div className="bg-[#111827] border border-[#374151] rounded-xl p-5 shadow-xl">
      {/* Module Title */}
      <div className="flex items-center justify-between mb-4 border-b border-[#1F2937] pb-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
          <h2 className="text-base font-bold text-[#F9FAFB] tracking-tight uppercase font-sans">
            Active Executive Alert Center
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 font-bold">
            {activeAlerts.length} UNRESOLVED EXCEPTIONS
          </span>
        </div>
      </div>

      {activeAlerts.length === 0 ? (
        <div className="bg-[#0B0F19] border border-[#374151] rounded-lg p-6 text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <h3 className="text-sm font-mono font-bold text-white">All Operational Exceptions Resolved</h3>
          <p className="text-xs font-mono text-gray-400 mt-1">No active critical alerts require CEO intervention.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeAlerts.map((alert: ExecutiveAlert) => (
            <div
              key={alert.id}
              className={`bg-[#0B0F19] rounded-xl p-4 border transition-all ${
                alert.severity === 'CRITICAL'
                  ? 'border-red-500/60 bg-red-950/10'
                  : alert.severity === 'WARNING'
                  ? 'border-amber-500/50 bg-amber-950/10'
                  : 'border-blue-500/40 bg-blue-950/10'
              }`}
            >
              {/* Alert Title & Header */}
              <div className="flex items-center justify-between mb-3 border-b border-[#1F2937] pb-2">
                <div className="flex items-center gap-2">
                  <AlertOctagon className={`w-4 h-4 ${
                    alert.severity === 'CRITICAL' ? 'text-red-400' : 'text-amber-400'
                  }`} />
                  <h3 className="text-sm font-mono font-extrabold text-white">
                    {alert.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-gray-400">{alert.timestamp}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    alert.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
              </div>

              {/* 4 Required Executive Dimensions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono mb-3">
                {/* 1. WHAT HAPPENED */}
                <div className="bg-[#1F2937] p-3 rounded border border-[#374151]">
                  <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">1. WHAT HAPPENED</div>
                  <p className="text-gray-200 leading-relaxed text-[11px]">{alert.whatHappened}</p>
                </div>

                {/* 2. FINANCIAL / OPERATIONAL IMPACT */}
                <div className="bg-[#1F2937] p-3 rounded border border-[#374151]">
                  <div className="text-[10px] font-bold text-amber-400 uppercase mb-1">2. IMPACT</div>
                  <p className="text-amber-200 leading-relaxed text-[11px]">{alert.impact}</p>
                </div>

                {/* 3. WHY IT MATTERS */}
                <div className="bg-[#1F2937] p-3 rounded border border-[#374151]">
                  <div className="text-[10px] font-bold text-purple-400 uppercase mb-1">3. WHY IT MATTERS</div>
                  <p className="text-purple-200 leading-relaxed text-[11px]">{alert.whyItMatters}</p>
                </div>
              </div>

              {/* 4. AVAILABLE ACTION BUTTONS */}
              <div className="bg-[#1F2937] p-3 rounded border border-[#374151] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-blue-400">
                  <CornerDownRight className="w-4 h-4 text-blue-400" />
                  <span className="font-bold text-white text-[11px]">4. CEO ACTION:</span>
                  <span className="text-gray-300 text-[11px]">{alert.availableAction}</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {alert.actionKey === 'REVIEW_VARIANCE' && (
                    <>
                      <button
                        onClick={() => openDrawer('RECONCILIATION')}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-mono font-bold transition-all shadow-md"
                      >
                        Review
                      </button>
                      <button
                        onClick={deductVariance}
                        className="px-3 py-1.5 bg-amber-700 hover:bg-amber-600 text-white rounded text-xs font-mono font-bold transition-all shadow-md"
                      >
                        Simulate Deduction
                      </button>
                      <button
                        onClick={waiveVariance}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-mono font-bold transition-all shadow-md"
                      >
                        Approve Waiver
                      </button>
                    </>
                  )}

                  {alert.actionKey === 'SIMULATE_REPLACEMENT' && (
                    <button
                      onClick={replaceHardware}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-mono font-bold transition-all shadow-md flex items-center gap-1.5"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      Simulate Hardware Replacement (৳3,000)
                    </button>
                  )}

                  {alert.actionKey === 'REVIEW_OBLIGATION' && (
                    <button
                      onClick={() => openDrawer('OBLIGATION')}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-mono font-bold transition-all shadow-md"
                    >
                      Inspect Liquidity Sweep
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
