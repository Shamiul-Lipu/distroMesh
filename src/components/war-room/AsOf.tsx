'use client';

import React, { useState, useEffect } from 'react';
import { Clock, RefreshCw, Radio, AlertTriangle } from 'lucide-react';
import { toBanglaNumeral } from '../../utils/formatters.ts';

interface AsOfProps {
  period?: 'Today' | 'MTD' | 'Month';
  scope?: string;
  bangla?: boolean;
}

const getDhakaTime = (): string => {
  try {
    return `${new Date().toLocaleTimeString('en-US', {
      timeZone: 'Asia/Dhaka',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    })} (Asia/Dhaka)`;
  } catch {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const dhaka = new Date(utc + 3600000 * 6);
    return `${dhaka.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    })} (Asia/Dhaka)`;
  }
};

export const AsOf: React.FC<AsOfProps> = ({
  period = 'Today',
  scope = 'Company-wide',
  bangla = false,
}) => {
  const [timestamp, setTimestamp] = useState<string>('');
  const [secondsAgo, setSecondsAgo] = useState(0);

  const updateTime = () => {
    setTimestamp(getDhakaTime());
    setSecondsAgo(0);
  };

  useEffect(() => {
    const initTimer = setTimeout(() => {
      setTimestamp(getDhakaTime());
    }, 0);
    const timer = setInterval(() => {
      setSecondsAgo((s) => s + 1);
    }, 1000);
    return () => {
      clearTimeout(initTimer);
      clearInterval(timer);
    };
  }, []);

  const isStale = secondsAgo > 300; // Stale if older than 5 minutes

  const periodLabel = bangla
    ? period === 'Today' ? 'আজকের' : period === 'MTD' ? 'চলতি মাস' : 'মাসিক'
    : period;

  return (
    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
      {/* Scope Badge */}
      <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-0.5 font-semibold text-slate-700 border border-slate-200">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        {scope}
      </span>

      {/* Period Badge */}
      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-600 border border-slate-200">
        {periodLabel}
      </span>

      {/* As Of Timestamp */}
      <span className="inline-flex items-center gap-1 text-slate-500">
        <Clock className="w-3.5 h-3.5 text-slate-400" />
        <span suppressHydrationWarning>
          as of {timestamp ? (bangla ? toBanglaNumeral(timestamp) : timestamp) : '--:--:-- (Asia/Dhaka)'}
        </span>
      </span>

      {/* Simulated Live indicator */}
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
        <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
        {bangla ? 'সিমুলেটেড লাইভ' : 'Simulated live'}
      </span>

      {/* Stale warning if needed */}
      {isStale && (
        <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          <AlertTriangle className="w-3 h-3 text-amber-500" />
          {bangla ? 'তথ্য পুরানো (>৫ মিনিট)' : 'Stale data (> 5 min)'}
        </span>
      )}

      {/* Refresh */}
      <button
        onClick={updateTime}
        title="Refresh data timestamp"
        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition"
      >
        <RefreshCw className="w-3 h-3" />
      </button>
    </div>
  );
};
