'use client';

import React, { useState } from 'react';
import { useExecutive } from '@/context/ExecutiveContext.tsx';
import { X, AlertOctagon, Printer, Wrench, CheckCircle2, Clock, Info } from 'lucide-react';
import { formatBDT } from '@/utils/formatters.ts';
import { deriveMispickLoss } from '@/utils/derivedRules.ts';

export const IncidentDrawer: React.FC = () => {
  const { state, closeDrawer, replaceHardware } = useExecutive();
  const [showFormula, setShowFormula] = useState(false);

  if (state.activeDrawer !== 'INCIDENT') return null;

  const mispick = deriveMispickLoss();

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[540px] bg-[#111827] border-l border-[#374151] z-50 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-[#1F2937] pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-mono font-extrabold text-white uppercase">
                Dispatch Delay &amp; Hardware Incident
              </h2>
              <span className="text-[10px] font-mono text-red-400">INCIDENT ID #INC-2026-09</span>
            </div>
          </div>
          <button
            onClick={closeDrawer}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#1F2937] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timeline */}
        <div className="bg-[#0B0F19] p-4 rounded-xl border border-[#374151] mb-6">
          <div className="text-xs font-mono font-bold text-gray-400 mb-3 uppercase flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-red-400" />
            <span>Operational Timeline of Failure</span>
          </div>

          <div className="space-y-3 text-xs font-mono border-l-2 border-[#374151] pl-4 ml-1">
            <div className="relative">
              <span className="absolute -left-[21px] top-0 w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <div className="text-gray-400 font-bold">08:00 AM — SR Arrival</div>
              <p className="text-gray-300 text-[11px]">24 SRs submitted order lists via WhatsApp photos to Billing Desk #1.</p>
            </div>

            <div className="relative">
              <span className="absolute -left-[21px] top-0 w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <div className="text-red-400 font-bold">08:45 AM — Hardware Jam</div>
              <p className="text-gray-300 text-[11px]">
                Epson LQ-310 dot matrix ribbon jammed &amp; gear misaligned on Billing Desk #1 (Suspected cause: faint ribbon).
              </p>
            </div>

            <div className="relative">
              <span className="absolute -left-[21px] top-0 w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <div className="text-amber-400 font-bold">09:00 AM — Target Dispatch Missed</div>
              <p className="text-gray-300 text-[11px]">Warehouse gates closed waiting for printed trip sheets.</p>
            </div>

            <div className="relative">
              <span className="absolute -left-[21px] top-0 w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <div className="text-emerald-400 font-bold">11:45 AM — Late Departure</div>
              <p className="text-gray-300 text-[11px]">Vans dispatched with +2h 45m delay (165 min lost market execution time).</p>
            </div>
          </div>
        </div>

        {/* Section 6.6 & Defect A3/A4 Mispick Loss & Payback Model */}
        <div className="bg-[#0B0F19] p-4 rounded-xl border border-amber-500/30 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-xs">
              <Printer className="w-4 h-4" />
              <span>Mispick Loss &amp; Payback Derivation</span>
            </div>
            <button
              onClick={() => setShowFormula(!showFormula)}
              className="text-[10px] text-emerald-400 hover:underline font-mono"
            >
              {showFormula ? 'Hide Formula' : 'Tap Formula'}
            </button>
          </div>

          <div className="space-y-2 text-xs font-mono bg-[#1F2937] p-3 rounded border border-[#374151]">
            <div className="flex justify-between">
              <span className="text-gray-400">Today&apos;s Incident:</span>
              <strong className="text-white">60 units (2.5 cartons of 24)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Unit Loss (Landed ৳112.20 × 30% + Margin ৳7.80):</span>
              <strong className="text-amber-400">৳{mispick.lossPerUnit} / unit</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Today&apos;s Incident Loss:</span>
              <strong className="text-red-400">{formatBDT(mispick.todayLossBDT)}</strong>
            </div>
            <div className="flex justify-between pt-1 border-t border-[#374151]">
              <span className="text-gray-400">Rolling Avg Daily Mispick (26 units):</span>
              <strong className="text-gray-300">{formatBDT(mispick.avgDailyLossBDT)} / day</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Epson LQ-310 Replacement Cost:</span>
              <strong className="text-white">{formatBDT(mispick.printerCost)}</strong>
            </div>
            <div className="flex justify-between pt-1 border-t border-[#374151] font-bold">
              <span className="text-emerald-400">Derived Payback Period:</span>
              <span className="text-emerald-400">{mispick.paybackDays} DAYS</span>
            </div>
          </div>

          {showFormula && (
            <div className="mt-3 p-2.5 bg-[#1F2937] border border-emerald-500/30 rounded text-[10px] font-mono text-emerald-300 leading-relaxed flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{mispick.formula}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-4 border-t border-[#1F2937] flex items-center justify-between gap-2 text-xs font-mono">
        {!state.hardwareReplaced ? (
          <button
            onClick={replaceHardware}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-mono font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Wrench className="w-4 h-4" />
            Simulate Hardware Replacement (৳3,000)
          </button>
        ) : (
          <div className="w-full p-2 bg-emerald-950 border border-emerald-500 text-emerald-400 rounded-lg text-center font-bold flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Hardware Replaced — Billing Desk #1 Operational
          </div>
        )}
      </div>
    </div>
  );
};
