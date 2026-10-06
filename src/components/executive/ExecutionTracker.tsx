'use client';

import React from 'react';
import { useExecutive } from '../../context/ExecutiveContext';
import { Clock, AlertTriangle, ArrowRight, Printer } from 'lucide-react';

export const ExecutionTracker: React.FC = () => {
  const { state, openDrawer } = useExecutive();

  const isHardwareResolved = state.hardwareReplaced;
  const isDelayed = state.dispatchDelayMinutes > 0 && !isHardwareResolved;

  return (
    <div className="bg-[#111827] border border-[#374151] rounded-xl p-5 shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-[#1F2937] pb-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500 animate-ping"></div>
          <h2 className="text-base font-bold text-[#F9FAFB] tracking-tight uppercase font-sans">
            Today&apos;s Operational Execution
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800">
            DISPATCH AUDIT
          </span>
        </div>
        <button
          onClick={() => openDrawer('INCIDENT')}
          className="text-xs font-mono text-red-400 hover:text-red-300 flex items-center gap-1 hover:underline"
        >
          <span>Incident Log</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Target vs Actual Header Card */}
      <div className="bg-[#0B0F19] rounded-lg p-4 border border-[#374151] mb-4">
        <div className="flex items-center justify-between">
          <div className="grid grid-cols-3 gap-4 w-full">
            <div>
              <div className="text-[11px] font-mono text-[#9CA3AF] uppercase">Target Dispatch</div>
              <div className="text-base font-mono font-bold text-gray-300 mt-0.5">
                {state.dispatchTarget}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-mono text-[#9CA3AF] uppercase">Actual Departure</div>
              <div className="text-base font-mono font-bold text-white mt-0.5">
                {state.dispatchActual}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-mono text-[#9CA3AF] uppercase">Dispatch Delay</div>
              <div className={`text-base font-mono font-bold mt-0.5 flex items-center gap-1 ${
                isDelayed ? 'text-red-400' : 'text-emerald-400'
              }`}>
                <span>+{Math.floor(state.dispatchDelayMinutes / 60)}h {state.dispatchDelayMinutes % 60}m</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                  isDelayed ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-emerald-950 text-emerald-400'
                }`}>
                  {isDelayed ? 'FAILED' : 'RESOLVED'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event -> Cause -> Impact Executive Pipeline */}
      <div
        onClick={() => openDrawer('INCIDENT')}
        className="bg-[#0B0F19] p-4 rounded-lg border border-red-500/30 hover:border-red-500/60 cursor-pointer transition-all group"
      >
        <div className="text-xs font-mono font-semibold text-red-400 mb-3 uppercase flex items-center justify-between">
          <span>EVENT → CAUSE → IMPACT BREAKDOWN</span>
          <span className="text-[10px] text-gray-400 group-hover:text-red-400">CLICK FOR INCIDENT DETAILS →</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          {/* 1. EVENT */}
          <div className="bg-[#1F2937] p-3 rounded-md border border-[#374151] group-hover:border-red-500/30">
            <div className="text-[10px] font-mono text-red-400 font-bold uppercase flex items-center gap-1">
              <Clock className="w-3 h-3 text-red-400" />
              <span>EVENT</span>
            </div>
            <div className="text-sm font-mono font-extrabold text-white mt-1">
              DISPATCH DELAY (+2h 45m)
            </div>
            <div className="text-[10px] font-mono text-gray-400 mt-1">
              Vans held at warehouse gates past 09:00 AM.
            </div>
          </div>

          {/* 2. CAUSE */}
          <div className="bg-[#1F2937] p-3 rounded-md border border-[#374151] group-hover:border-red-500/30">
            <div className="text-[10px] font-mono text-amber-400 font-bold uppercase flex items-center gap-1">
              <Printer className="w-3 h-3 text-amber-400" />
              <span>CAUSE</span>
            </div>
            <div className="text-sm font-mono font-extrabold text-amber-300 mt-1">
              {state.billingDeskBottleneckSRs} SRs at Billing Desk #1
            </div>
            <div className="text-[10px] font-mono text-gray-400 mt-1">
              Epson LQ-310 ribbon jam & WhatsApp manual order entry bottleneck.
            </div>
          </div>

          {/* 3. IMPACT */}
          <div className="bg-[#1F2937] p-3 rounded-md border border-[#374151] group-hover:border-red-500/30">
            <div className="text-[10px] font-mono text-purple-400 font-bold uppercase flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-purple-400" />
              <span>IMPACT</span>
            </div>
            <div className="text-sm font-mono font-extrabold text-purple-300 mt-1">
              165 MIN Lost Market Time
            </div>
            <div className="text-[10px] font-mono text-gray-400 mt-1">
              60 cartons returned, estimated market loss ৳2,790.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
