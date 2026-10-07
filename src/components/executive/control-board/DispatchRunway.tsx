'use client';

import React from 'react';
import { Truck, Clock, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import { useExecutive } from '../../../context/ExecutiveContext';
import { deriveDispatchMetrics } from '../../../utils/derivedRules';
import { toBanglaNumeral } from '../../../utils/formatters';

interface DispatchRunwayProps {
  onInspectBottleneck?: () => void;
}

export const DispatchRunway: React.FC<DispatchRunwayProps> = ({
  onInspectBottleneck,
}) => {
  const { state } = useExecutive();

  const delayMinutes = state.dispatchDelayMinutes;
  const dispatchMetrics = deriveDispatchMetrics(delayMinutes);
  const isRecovered = state.hardwareReplaced;

  const currentDelay = isRecovered ? 0 : delayMinutes;
  const actualTime = isRecovered ? '09:00' : state.dispatchActual;

  const steps = [
    {
      id: 'prep',
      label: state.banglaMode ? 'গুদাম প্রস্তুতি' : 'WAREHOUSE PREP',
      time: '07:00',
      status: 'DONE',
    },
    {
      id: 'billing',
      label: state.banglaMode ? 'চালান ও বিলিং' : 'BILLING',
      time: '08:30',
      status: isRecovered ? 'DONE' : 'BOTTLENECK',
      bottleneckMsg: isRecovered ? undefined : 'Printer Gear Jam (+165m)',
    },
    {
      id: 'loading',
      label: state.banglaMode ? 'ভ্যানে পণ্য লোডিং' : 'LOADING',
      time: isRecovered ? '08:45' : '11:00',
      status: isRecovered ? 'DONE' : 'DELAYED',
    },
    {
      id: 'dispatch',
      label: state.banglaMode ? 'ডেসপ্যাচ প্রস্থান' : 'DISPATCH',
      time: actualTime,
      status: isRecovered ? 'DONE' : 'LATE',
    },
  ];

  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 sm:p-5 shadow-sm flex flex-col justify-between text-slate-800">
      <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
        <div className="flex items-center gap-2">
          <Truck size={14} className="text-sky-700" />
          <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-800">
            {state.banglaMode ? 'ফিল্ড এক্সিকিউশন ও ডেসপ্যাচ রানওয়ে' : 'FIELD EXECUTION & DISPATCH RUNWAY'}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500">
            {state.banglaMode ? '১২টি ভ্যান ফ্লিট' : '12 Delivery Beats'}
          </span>
          {onInspectBottleneck && (
            <button
              onClick={onInspectBottleneck}
              className="text-[10px] font-mono text-rose-600 hover:text-rose-700 font-semibold underline underline-offset-2"
            >
              {state.banglaMode ? 'বটলনেক বিশ্লেষণ' : 'Bottleneck Details'}
            </button>
          )}
        </div>
      </div>

      {/* Target vs Actual vs EMPHASIZED VARIANCE */}
      <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
        <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
          <span className="text-[10px] text-slate-500 uppercase block font-semibold">
            {state.banglaMode ? 'নির্ধারিত সময়' : 'TARGET DISPATCH'}
          </span>
          <div className="mt-1 text-2xl font-bold text-slate-800">
            {state.banglaMode ? toBanglaNumeral(state.dispatchTarget) : state.dispatchTarget} AM
          </div>
          <span className="text-[9px] text-slate-400 mt-0.5 block">Depot Yard Departure Target</span>
        </div>

        <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
          <span className="text-[10px] text-slate-500 uppercase block font-semibold">
            {state.banglaMode ? 'প্রকৃত প্রস্থান' : 'ACTUAL DISPATCH'}
          </span>
          <div className="mt-1 text-2xl font-bold text-slate-800">
            {state.banglaMode ? toBanglaNumeral(actualTime) : actualTime} AM
          </div>
          <span className="text-[9px] text-slate-400 mt-0.5 block">Last Van Departure</span>
        </div>

        {/* Emphasized Variance */}
        <div className={`rounded-lg p-3 border ${
          currentDelay > 0
            ? 'bg-rose-50/70 border-rose-200 text-rose-950'
            : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
        }`}>
          <span className={`text-[10px] uppercase font-bold tracking-wider block ${
            currentDelay > 0 ? 'text-rose-800' : 'text-emerald-800'
          }`}>
            {state.banglaMode ? 'সময় অপচয় (ভ্যারিয়েন্স)' : 'DISPATCH DELAY VARIANCE'}
          </span>
          <div className={`mt-1 text-2xl sm:text-3xl font-bold tracking-tight ${
            currentDelay > 0 ? 'text-rose-700' : 'text-emerald-700'
          }`}>
            {currentDelay > 0
              ? `+${state.banglaMode ? toBanglaNumeral(currentDelay.toString()) : currentDelay} MIN`
              : state.banglaMode ? 'সময়মতো সম্পন্ন' : 'ON TARGET (0m)'}
          </div>
          <span className={`text-[9px] mt-0.5 block ${
            currentDelay > 0 ? 'text-rose-600' : 'text-emerald-600'
          }`}>
            {currentDelay > 0 ? `${dispatchMetrics.vanMinutesLost} van-min lost across fleet` : 'All routes departed on schedule'}
          </span>
        </div>
      </div>

      {/* HORIZONTAL DISPATCH TIMELINE WITH BOTTLENECK POSITION */}
      <div className="mt-4 pt-3 border-t border-[#e2e8f0]">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-2">
          <span>OPERATIONAL DEPARTURE PIPELINE</span>
          <span className={`font-bold ${isRecovered ? 'text-emerald-700' : 'text-amber-700'}`}>
            {isRecovered ? 'PIPELINE CLEAR' : 'ACTIVE BOTTLENECK: BILLING'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 font-mono">
          {steps.map((step, idx) => {
            const isBottleneck = step.status === 'BOTTLENECK';
            const isDone = step.status === 'DONE';
            return (
              <div
                key={step.id}
                className={`rounded-lg p-2.5 border relative overflow-hidden ${
                  isBottleneck
                    ? 'bg-rose-50 border-rose-300 shadow-xs text-rose-950'
                    : isDone
                    ? 'bg-slate-50 border-slate-200 text-slate-800'
                    : 'bg-slate-50/70 border-slate-200 text-slate-600'
                }`}
              >
                {/* Step indicator */}
                <div className="flex items-center justify-between text-[9px]">
                  <span className={`font-bold ${isBottleneck ? 'text-rose-700' : 'text-slate-400'}`}>0{idx + 1}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                    isBottleneck
                      ? 'bg-rose-600 text-white animate-pulse'
                      : isDone
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {step.status}
                  </span>
                </div>

                <div className="mt-1.5 font-bold text-xs text-slate-900 truncate">
                  {step.label}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {step.time} AM
                </div>

                {step.bottleneckMsg && (
                  <div className="mt-1 text-[9px] text-rose-800 font-bold bg-rose-100 border border-rose-200 px-1.5 py-0.5 rounded">
                    {step.bottleneckMsg}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
