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
  const mispick = deriveMispickLoss(60); // 60 mispicked cases

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
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 sm:p-5 flex items-center justify-between shadow-xs font-mono text-emerald-950">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-300">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                {state.banglaMode ? 'ডেসপ্যাচ স্বাভাবিক' : 'DISPATCH NORMALIZED'}
              </span>
              <span className="text-[9px] text-emerald-700/80">
                {state.banglaMode ? 'ডিপো ইয়ার্ড জ্যাম নিরসন' : 'Yard Stalls Cleared'}
              </span>
            </div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              {state.banglaMode
                ? 'সকালের ডেসপ্যাচ স্বাভাবিক · নির্ধারিত সময়ে যাত্রা (সকাল ৯:০০)'
                : 'Morning Dispatch Normalized · All 12 Vans Departed (09:00 AM)'}
            </div>
          </div>
        </div>
        <div className="text-right text-[11px] text-emerald-800 font-semibold">
          <span>৳7,438/day loss averted</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 sm:p-5 shadow-xs font-mono text-slate-900">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left: Incident Identity + Root Cause */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-700 border border-rose-200 mt-0.5">
            <Truck size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
                <AlertOctagon size={11} />
                {state.banglaMode ? 'সক্রিয় অপারেশনাল বটলনেক' : 'ACTIVE BOTTLENECK INCIDENT'}
              </span>
              <span className="text-[10px] text-slate-500">
                Location: Depot Dispatch Yard
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
              {state.banglaMode
                ? 'সকাল ১০:০০ ডেলিভারি ভ্যান বিলম্ব (১৬৫ মিনিট)'
                : 'Morning Dispatch Delay · 165 Min Departure Stall'}
            </h3>

            <p className="text-xs text-slate-600 font-sans mt-0.5 max-w-2xl">
              {state.banglaMode
                ? 'ডিপো ইয়ার্ডে ১২টি ডেলিভারি ভ্যান ১৬৫ মিনিট আটকে থাকার কারণে ৭০০টি খুচরা দোকানের সকালের ডেলিভারি সূচি বিলম্বিত হয়েছে।'
                : 'Depot yard departure stall delayed 12 delivery vans for 165 minutes, impacting morning delivery schedules across 700 retail drops.'}
            </p>
          </div>
        </div>

        {/* Middle: PROBLEM → IMPACT METRICS */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 text-xs shrink-0 shadow-2xs">
          <div>
            <span className="text-[9px] text-slate-500 uppercase block">Lost Time</span>
            <span className="text-rose-700 font-bold text-sm">+{dispatch.delayMinutes} Min</span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <span className="text-[9px] text-slate-500 uppercase block">Idle Crew Cost</span>
            <span className="text-slate-800 font-bold text-sm">৳{dispatch.idleCrewCost.toLocaleString('en-IN')}</span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <span className="text-[9px] text-slate-500 uppercase block">Replacement Payback</span>
            <span className="text-emerald-700 font-bold text-sm">{mispick.paybackDays} Days</span>
          </div>
        </div>

        {/* Right: Fast Decision Action */}
        <div className="flex items-center gap-2 shrink-0 w-full lg:w-auto justify-end">
          {onInspectIncident && (
            <button
              onClick={onInspectIncident}
              className="px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition"
            >
              {state.banglaMode ? 'বিশ্লেষণ দেখুন' : 'Audit Payback'}
            </button>
          )}
          <button
            onClick={handleQuickFix}
            className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition"
          >
            <Wrench size={12} />
            <span>{state.banglaMode ? 'ডেসপ্যাচ স্বাভাবিক করুন' : 'Expedite Dispatch'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
