'use client';

import React from 'react';
import { AlertOctagon, Truck, CheckCircle2, ArrowRight, Wrench } from 'lucide-react';
import { useExecutive } from '../../../context/ExecutiveContext';
import { deriveDispatchMetrics, deriveMispickLoss } from '../../../utils/derivedRules';
import { formatBDT } from '../../../utils/formatters';

interface BottleneckIndicatorProps {
  onInspectIncident?: () => void;
  onReplaceHardware?: () => void;
}

export const BottleneckIndicator: React.FC<BottleneckIndicatorProps> = ({
  onInspectIncident,
  onReplaceHardware,
}) => {
  const { state, replaceHardware, showToast } = useExecutive();

  const isRecovered = state.hardwareReplaced;
  const dispatch = deriveDispatchMetrics(state.dispatchDelayMinutes);

  const handleQuickFix = () => {
    if (onReplaceHardware) {
      onReplaceHardware();
    } else {
      replaceHardware();
      showToast('Dispatch bottleneck resolved: Van departure stalls cleared. Dispatch normalized to 09:00 AM.');
    }
  };

  if (isRecovered) {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 sm:p-5 flex items-center justify-between shadow-xs font-mono text-emerald-400 backdrop-blur-md transition-colors duration-200">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                {state.banglaMode ? 'ডেসপ্যাচ স্বাভাবিক' : 'DISPATCH NORMALIZED'}
              </span>
              <span className="text-[9px] text-emerald-400/80">
                {state.banglaMode ? 'ডিপো ইয়ার্ড জ্যাম নিরসন' : 'Yard Stalls Cleared'}
              </span>
            </div>
            <div className="text-sm font-bold text-[var(--foreground)] mt-0.5">
              {state.banglaMode
                ? 'সকালের ডেসপ্যাচ স্বাভাবিক · নির্ধারিত সময়ে যাত্রা (সকাল ৯:০০)'
                : 'Morning Dispatch Normalized · All 12 Vans Departed (09:00 AM)'}
            </div>
          </div>
        </div>
        <div className="text-right text-[11px] text-emerald-400 font-semibold dm-tabular">
          <span>৳7,438/day loss averted</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 sm:p-5 shadow-xs font-mono text-[var(--foreground)] backdrop-blur-md transition-colors duration-200">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left: Incident Identity + Root Cause */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 mt-0.5">
            <Truck size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30">
                <AlertOctagon size={11} />
                {state.banglaMode ? 'সক্রিয় অপারেশনাল বটলনেক' : 'ACTIVE BOTTLENECK INCIDENT'}
              </span>
              <span className="text-[10px] text-[var(--foreground-muted)]">
                Location: Depot Dispatch Yard
              </span>
            </div>

            <div className="text-sm sm:text-base font-bold text-[var(--foreground)] mt-1">
              Morning Dispatch Delay · 165 Min Departure Stall
            </div>
            <p className="text-xs text-[var(--foreground-muted)] mt-0.5 max-w-2xl font-sans leading-relaxed">
              12 delivery vans stalled in depot yard for 165 minutes awaiting departure manifests. Idle crew wage leakage active across all routes.
            </p>
          </div>
        </div>

        {/* Right: Quantified Loss & Actions */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
          <div className="flex items-center gap-4 text-xs font-mono border-l border-[var(--border)] pl-4">
            <div>
              <span className="text-[9px] text-[var(--foreground-muted)] block uppercase">Lost Time</span>
              <span className="font-bold text-rose-400 dm-tabular">+{state.dispatchDelayMinutes} Min</span>
            </div>
            <div>
              <span className="text-[9px] text-[var(--foreground-muted)] block uppercase">Idle Crew Cost</span>
              <span className="font-bold text-rose-400 dm-tabular">{formatBDT(dispatch.idleCrewCost)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onInspectIncident && (
              <button
                onClick={onInspectIncident}
                className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] text-xs font-mono font-medium text-[var(--foreground)] transition shadow-2xs"
              >
                Audit Impact
              </button>
            )}
            <button
              onClick={handleQuickFix}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition shadow-xs flex items-center gap-1.5 active:scale-95"
            >
              <Wrench size={12} />
              <span>Clear Bottleneck</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
