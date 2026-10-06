'use client';

import React from 'react';
import { useExecutive } from '@/context/ExecutiveContext';
import { X, Truck, User, Phone, MapPin, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { formatBDT, formatVariance } from '@/utils/formatters';

export const RouteDetailDrawer: React.FC = () => {
  const { state, closeDrawer, waiveVariance, openModal } = useExecutive();

  if (state.activeDrawer !== 'ROUTE_DETAIL' || !state.selectedRouteId) return null;

  const route = state.routes.find(r => r.id === state.selectedRouteId);
  if (!route) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[540px] bg-[#111827] border-l border-[#374151] z-50 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-[#1F2937] pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-mono font-extrabold text-white uppercase">
                {route.vanNumber} — {route.routeName}
              </h2>
              <span className="text-[10px] font-mono text-gray-400">DSR: {route.dsrName}</span>
            </div>
          </div>
          <button
            onClick={closeDrawer}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#1F2937] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* DSR Overview Card */}
        <div className="bg-[#0B0F19] p-4 rounded-xl border border-[#374151] mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-mono font-bold text-white">{route.dsrName}</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1F2937] text-gray-300 border border-[#374151]">
              DSR CODE #BD-409
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-[#1F2937] p-2.5 rounded border border-[#374151]">
              <div className="text-[10px] text-gray-400">Last GPS Checkin:</div>
              <div className="text-white font-bold mt-0.5">{route.lastCheckin} PM</div>
            </div>
            <div className="bg-[#1F2937] p-2.5 rounded border border-[#374151]">
              <div className="text-[10px] text-gray-400">Outlets Covered:</div>
              <div className="text-white font-bold mt-0.5">{route.retailersVisited} / {route.totalRetailers} ({route.completionPct}%)</div>
            </div>
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="space-y-3 text-xs font-mono mb-6">
          <div className="bg-[#0B0F19] p-3 rounded-lg border border-[#374151] flex justify-between items-center">
            <span className="text-gray-400">Expected Invoice Total:</span>
            <span className="font-bold text-white">{formatBDT(route.expected)}</span>
          </div>

          <div className="bg-[#0B0F19] p-3 rounded-lg border border-[#374151] flex justify-between items-center">
            <span className="text-gray-400">Cash Collected:</span>
            <span className="font-bold text-emerald-400">{formatBDT(route.collected)}</span>
          </div>

          <div className="bg-[#0B0F19] p-3 rounded-lg border border-[#374151] flex justify-between items-center">
            <span className="text-gray-400">Credit Extended to Outlets:</span>
            <span className="font-bold text-amber-400">{formatBDT(route.credit)}</span>
          </div>

          <div className={`p-3 rounded-lg border flex justify-between items-center ${
            route.variance !== 0 ? 'bg-amber-950/40 border-amber-500' : 'bg-[#0B0F19] border-[#374151]'
          }`}>
            <span className="text-gray-400">Cash Settlement Variance:</span>
            <span className={`font-bold ${route.variance !== 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {formatVariance(route.variance)}
            </span>
          </div>
        </div>

        {/* Notes & Audit History */}
        <div className="bg-[#0B0F19] p-4 rounded-xl border border-[#374151]">
          <div className="text-xs font-mono font-bold text-gray-400 mb-2 uppercase">
            Supervisor Notes & Audit Trail
          </div>
          <p className="text-xs font-mono text-gray-300 bg-[#1F2937] p-3 rounded border border-[#374151]">
            "{route.notes || 'Routine beat settlement complete.'}"
          </p>
        </div>
      </div>

      {/* Footer Quick Actions */}
      <div className="mt-6 pt-4 border-t border-[#1F2937] flex items-center justify-between gap-2 text-xs font-mono">
        {route.variance !== 0 && !state.varianceWaived && (
          <button
            onClick={waiveVariance}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-lg transition-all"
          >
            Approve Variance Waiver
          </button>
        )}
        <button
          onClick={() => openModal('CREDIT_LOCK')}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-all"
        >
          Lock Overdue Outlets
        </button>
        <button
          onClick={closeDrawer}
          className="px-4 py-2 bg-[#1F2937] hover:bg-[#374151] text-gray-300 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};
