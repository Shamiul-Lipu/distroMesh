'use client';

import React, { useState, useEffect } from 'react';
import { useExecutive } from '../../../context/ExecutiveContext';

import { DispatchReadinessStatus } from '../../../data/seedData';

interface DispatchReadinessCardProps {
  status?: DispatchReadinessStatus;
  shiftLabel?: string;
  className?: string;
  onOpenIncident?: () => void;
}

export const DispatchReadinessCard: React.FC<DispatchReadinessCardProps> = ({
  status,
  shiftLabel,
  className = '',
  onOpenIncident,
}) => {
  const { state, openDrawer } = useExecutive();
  const initialSecs = status?.countdownSeconds || 8100;
  const [seconds, setSeconds] = useState(initialSecs);
  const [prevInitial, setPrevInitial] = useState(initialSecs);

  if (prevInitial !== initialSecs) {
    setPrevInitial(initialSecs);
    setSeconds(initialSecs);
  }

  // Countdown timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleIncident = () => {
    if (onOpenIncident) {
      onOpenIncident();
    } else {
      openDrawer('INCIDENT');
    }
  };

  const billingQueue = status ? status.billingQueueDSRs : (state.billingDeskBottleneckSRs || 24);
  const invoicePct = status ? status.invoiceProcessingPct : 68;
  const dsrReadyStr = status ? `${status.dsrReadinessCurrent} / ${status.dsrReadinessTotal} Ready` : '6 / 6 Ready';
  const whReadyStr = status ? (status.warehouseReady ? 'Ready' : 'Check Required') : 'Ready';
  const routeReadyStr = status ? `${status.routesClearedCurrent} / ${status.routesClearedTotal} Cleared` : '5 / 6 Cleared';

  return (
    <div className={`rounded-xl border border-[#1F2937] bg-[#0E131F] p-4 sm:p-5 shadow-lg flex flex-col justify-between text-white ${className}`}>
      {/* Title */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-white font-sans tracking-tight">
          Dispatch Readiness
        </h3>
        <button
          onClick={handleIncident}
          className="text-[10px] font-mono text-gray-400 hover:text-amber-400 transition-colors uppercase tracking-wider"
        >
          {shiftLabel || 'Morning Shift Status'}
        </button>
      </div>

      {/* 6 Metric List Items */}
      <div className="space-y-2.5 font-mono text-xs">
        {/* Item 1: Dispatch Countdown */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-[#0B0F19] border border-[#1F2937]">
          <span className="text-gray-400 text-xs font-medium">Dispatch Countdown</span>
          <span className="text-[#38BDF8] text-sm font-bold tracking-wider">
            {formatCountdown(seconds)}
          </span>
        </div>

        {/* Item 2: Billing Queue */}
        <div
          onClick={handleIncident}
          className="flex items-center justify-between p-3 rounded-lg bg-[#0B0F19] border border-[#1F2937] hover:border-amber-500/40 cursor-pointer transition-colors"
        >
          <span className="text-gray-400 text-xs font-medium">Billing Queue</span>
          <span className="text-amber-400 text-sm font-bold">
            {billingQueue} DSRs
          </span>
        </div>

        {/* Item 3: Invoice Processing */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-[#0B0F19] border border-[#1F2937]">
          <span className="text-gray-400 text-xs font-medium">Invoice Processing</span>
          <span className="text-[#38BDF8] text-sm font-bold">
            {invoicePct}%
          </span>
        </div>

        {/* Item 4: DSR Readiness */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-[#0B0F19] border border-[#1F2937]">
          <span className="text-gray-400 text-xs font-medium">DSR Readiness</span>
          <span className="text-emerald-400 text-sm font-bold">
            {dsrReadyStr}
          </span>
        </div>

        {/* Item 5: Warehouse Readiness */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-[#0B0F19] border border-[#1F2937]">
          <span className="text-gray-400 text-xs font-medium">Warehouse Readiness</span>
          <span className="text-emerald-400 text-sm font-bold">
            {whReadyStr}
          </span>
        </div>

        {/* Item 6: Route Readiness */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-[#0B0F19] border border-[#1F2937]">
          <span className="text-gray-400 text-xs font-medium">Route Readiness</span>
          <span className="text-amber-400 text-sm font-bold">
            {routeReadyStr}
          </span>
        </div>
      </div>
    </div>
  );
};
