'use client';

import React from 'react';
import { Truck, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useExecutive } from '../../../context/ExecutiveContext';
import { deriveDispatchMetrics } from '../../../utils/derivedRules';
import { toBanglaNumeral, formatBDT } from '../../../utils/formatters';

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
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 shadow-xs flex flex-col justify-between text-[var(--foreground)] backdrop-blur-md transition-colors duration-200">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <Truck size={14} className="text-sky-400" />
          <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--foreground)]">
            {state.banglaMode ? 'ফিল্ড এক্সিকিউশন ও ডেসপ্যাচ রানওয়ে' : 'FIELD EXECUTION & DISPATCH RUNWAY'}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[var(--foreground-muted)]">
            {state.banglaMode ? '১২টি ভ্যান ফ্লিট' : '12 Delivery Beats'}
          </span>
          {onInspectBottleneck && (
            <button
              onClick={onInspectBottleneck}
              className="text-[10px] font-mono text-rose-400 hover:text-rose-300 font-semibold underline underline-offset-2"
            >
              {state.banglaMode ? 'বটলনেক বিশ্লেষণ' : 'Bottleneck Details'}
            </button>
          )}
        </div>
      </div>

      {/* Target vs Actual vs EMPHASIZED VARIANCE */}
      <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
        <div className="rounded-xl bg-[var(--surface-elevated)] p-3 border border-[var(--border)] dm-interactive">
          <span className="text-[10px] text-[var(--foreground-muted)] uppercase block font-semibold">
            {state.banglaMode ? 'নির্ধারিত সময়' : 'TARGET DISPATCH'}
          </span>
          <div className="mt-1 text-2xl font-bold text-[var(--foreground)] dm-tabular">
            {state.banglaMode ? toBanglaNumeral(state.dispatchTarget) : state.dispatchTarget} AM
          </div>
          <span className="text-[9px] text-[var(--foreground-subtle)] mt-0.5 block">Depot Yard Departure Target</span>
        </div>

        <div className="rounded-xl bg-[var(--surface-elevated)] p-3 border border-[var(--border)] dm-interactive">
          <span className="text-[10px] text-[var(--foreground-muted)] uppercase block font-semibold">
            {state.banglaMode ? 'প্রকৃত প্রস্থান' : 'ACTUAL DISPATCH'}
          </span>
          <div className="mt-1 text-2xl font-bold text-[var(--foreground)] dm-tabular">
            {state.banglaMode ? toBanglaNumeral(actualTime) : actualTime} AM
          </div>
          <span className="text-[9px] text-[var(--foreground-subtle)] mt-0.5 block">Last Van Departure</span>
        </div>

        {/* Emphasized Variance */}
        <div className={`rounded-xl p-3 border dm-interactive ${
          isRecovered
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
          <span className="text-[10px] uppercase block font-bold">
            {state.banglaMode ? 'ডেসপ্যাচ বিলম্বের পার্থক্য' : 'DISPATCH DELAY VARIANCE'}
          </span>
          <div className="mt-1 text-2xl font-bold flex items-baseline gap-1.5 dm-tabular">
            <span>{isRecovered ? '0 MIN' : `+${currentDelay} MIN`}</span>
            {isRecovered ? (
              <CheckCircle2 size={16} className="text-emerald-400" />
            ) : (
              <span className="text-[10px] font-normal uppercase text-rose-400">
                ({dispatchMetrics.vanMinutesLost} van-min lost)
              </span>
            )}
          </div>
          <span className="text-[9px] mt-0.5 block text-[var(--foreground-muted)]">
            {isRecovered
              ? 'Schedule recovered · High-speed thermal billing active'
              : `Idle labor crew cost ≈ ${formatBDT(dispatchMetrics.idleCrewCost)}`}
          </span>
        </div>
      </div>

      {/* Visual Pipeline Progression */}
      <div className="mt-3.5 pt-2.5 border-t border-[var(--border)]">
        <div className="flex items-center justify-between text-[10px] font-mono text-[var(--foreground-muted)] mb-2">
          <span>OPERATIONAL DEPARTURE PIPELINE</span>
          <span className={isRecovered ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
            {isRecovered ? 'STATUS: NORMAL' : 'ACTIVE BOTTLENECK: BILLING'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 font-mono text-xs">
          {steps.map((s, idx) => (
            <div
              key={s.id}
              className={`rounded-xl p-2.5 border transition ${
                s.status === 'DONE'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : s.status === 'BOTTLENECK'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 font-bold shadow-xs'
                  : s.status === 'DELAYED'
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                  : 'bg-[var(--surface-elevated)] border-[var(--border)] text-[var(--foreground-muted)]'
              }`}
            >
              <div className="flex items-center justify-between text-[9px] mb-1">
                <span>0{idx + 1}</span>
                <span className="font-bold px-1.5 py-0.2 rounded bg-[var(--surface-inset)]">
                  {s.status}
                </span>
              </div>
              <div className="font-bold text-[11px] truncate text-[var(--foreground)]">{s.label}</div>
              <div className="text-[10px] text-[var(--foreground-muted)] mt-0.5">{s.time} AM</div>
              {s.bottleneckMsg && (
                <div className="text-[9px] text-rose-400 font-semibold mt-1 truncate">
                  {s.bottleneckMsg}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
