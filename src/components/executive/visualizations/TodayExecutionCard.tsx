'use client';

import React from 'react';
import { Truck, XCircle, AlertTriangle, Zap, Clock } from 'lucide-react';
import { useExecutive } from '../../../context/ExecutiveContext';

interface TodayExecutionCardProps {
  targetTime?: string;
  actualTime?: string;
  delayMinutes?: number;
  status?: 'ON_TIME' | 'DELAYED' | 'CRITICAL';
  bottleneck?: string;
  lostMinutes?: number;
  className?: string;
  onOpenIncident?: () => void;
}

export const TodayExecutionCard: React.FC<TodayExecutionCardProps> = ({
  targetTime,
  actualTime,
  delayMinutes,
  status: customStatus,
  bottleneck,
  lostMinutes,
  className = '',
  onOpenIncident,
}) => {
  const { state, openDrawer } = useExecutive();

  const isHardwareResolved = state.hardwareReplaced;
  const currentDelay = delayMinutes !== undefined ? delayMinutes : state.dispatchDelayMinutes;
  const isDelayed = currentDelay > 0 && !isHardwareResolved;
  const target = targetTime || state.dispatchTarget || '09:00 AM';
  const actual = actualTime || (isDelayed ? state.dispatchActual : target);
  const lostMin = lostMinutes !== undefined ? lostMinutes : (isDelayed ? 165 : 0);
  const bottleneckMsg = bottleneck || 'Manual WhatsApp-based order entry';

  const delayStr = isDelayed
    ? (currentDelay >= 60 ? `+${Math.floor(currentDelay / 60)}h ${currentDelay % 60}m` : `+${currentDelay}m`)
    : '0m';

  const handleClick = () => {
    if (onOpenIncident) {
      onOpenIncident();
    } else {
      openDrawer('INCIDENT');
    }
  };

  return (
    <div className={`rounded-xl border border-[#1F2937] bg-[#0E131F] p-4 sm:p-5 shadow-lg flex flex-col justify-between text-white ${className}`}>
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-semibold tracking-tight text-white font-sans">
              Today&apos;s Execution
            </h3>
          </div>
          <span className={`text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded border uppercase ${
            isDelayed
              ? 'bg-red-950/40 text-red-400 border-red-800'
              : 'bg-emerald-950/40 text-emerald-400 border-emerald-800'
          }`}>
            {isDelayed ? 'FAILED' : 'RESOLVED'}
          </span>
        </div>
        <p className="text-[11px] font-sans text-gray-400">
          Did today&apos;s distribution operation execute on time?
        </p>

        {/* Dispatch Delay Alert Box */}
        <div className={`mt-3.5 p-3 rounded-lg border ${isDelayed ? 'border-red-900/60 bg-[#160B0E]' : 'border-emerald-900/60 bg-[#0B1610]'}`}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-1.5 text-xs font-mono font-semibold uppercase ${isDelayed ? 'text-red-400' : 'text-emerald-400'}`}>
              <XCircle className="w-4 h-4" />
              <span>DISPATCH DELAY</span>
            </div>
            <span className={`text-xl font-mono font-bold ${isDelayed ? 'text-red-400' : 'text-emerald-400'}`}>
              {delayStr}
            </span>
          </div>

          <div className={`mt-2.5 pt-2 border-t grid grid-cols-3 gap-2 text-center font-mono ${isDelayed ? 'border-red-900/40' : 'border-emerald-900/40'}`}>
            <div>
              <div className="text-[9px] text-gray-400 uppercase">TARGET</div>
              <div className="text-xs font-bold text-gray-200 mt-0.5">{target}</div>
            </div>
            <div>
              <div className="text-[9px] text-gray-400 uppercase">ACTUAL</div>
              <div className="text-xs font-bold text-gray-200 mt-0.5">{actual}</div>
            </div>
            <div>
              <div className="text-[9px] text-gray-400 uppercase">VARIANCE</div>
              <div className={`text-xs font-bold mt-0.5 ${isDelayed ? 'text-red-400' : 'text-emerald-400'}`}>{delayStr}</div>
            </div>
          </div>
        </div>

        {/* Pipeline Causation: CAUSED BY */}
        <div className="my-2 text-center text-[10px] font-mono text-gray-500 uppercase tracking-wider">
          CAUSED BY
        </div>

        {/* Root Cause Box */}
        <div className="p-3 rounded-lg border border-amber-900/50 bg-[#16120B]">
          <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-mono font-bold uppercase">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>ROOT CAUSE</span>
          </div>
          <div className="text-xs font-sans font-semibold text-gray-100 mt-1">
            {isDelayed ? 'Dispatch departure stall at depot dock' : 'Depot dispatch executed smoothly on schedule'}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-sans text-gray-400 mt-1">
            <Zap className="w-3 h-3 text-amber-400 shrink-0" />
            <span>Bottleneck: {bottleneckMsg}</span>
          </div>
        </div>

        {/* Pipeline Causation: RESULTED IN */}
        <div className="my-2 text-center text-[10px] font-mono text-gray-500 uppercase tracking-wider">
          RESULTED IN
        </div>

        {/* Impact Box */}
        <div className="p-3 rounded-lg border border-amber-900/50 bg-[#16120B]">
          <div className="flex items-center justify-between font-mono">
            <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-bold uppercase">
              <Clock className="w-3.5 h-3.5" />
              <span>LOST EXECUTION TIME</span>
            </div>
            <span className="text-sm font-bold text-amber-400">{lostMin} MIN</span>
          </div>
          <p className="text-[11px] font-sans text-gray-400 mt-1">
            {lostMin > 0 ? `${lostMin} minutes of market execution time lost across delivery beats.` : 'Zero market execution time lost; all drops completed.'}
          </p>
        </div>
      </div>

      {/* Footer Link */}
      <button
        onClick={handleClick}
        className="mt-4 pt-3 border-t border-[#1F2937] text-left text-[11px] font-sans text-gray-400 hover:text-red-400 transition-colors flex items-center justify-between group"
      >
        <span className="text-[10px] font-mono text-gray-500 uppercase border border-gray-800 px-1.5 py-0.5 rounded">
          ILLUSTRATIVE
        </span>
        <span className="group-hover:underline">Click for incident detail →</span>
      </button>
    </div>
  );
};
