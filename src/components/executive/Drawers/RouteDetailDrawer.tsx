'use client';

import React from 'react';
import { useExecutive } from '@/context/ExecutiveContext.tsx';
import { X, Truck, User } from 'lucide-react';
import { formatBDT, formatVariance } from '@/utils/formatters.ts';

export const RouteDetailDrawer: React.FC = () => {
  const { state, closeDrawer, waiveVariance, openModal } = useExecutive();

  if (state.activeDrawer !== 'ROUTE_DETAIL' || !state.selectedRouteId) return null;

  const route = state.routes.find((r) => r.id === state.selectedRouteId);
  if (!route) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[500px] bg-[#111827] border-l border-[#374151] z-50 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-[#1F2937] pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-mono font-extrabold text-white uppercase">
                {route.routeName}
              </h2>
              <span className="text-xs font-mono text-gray-400">
                {route.vanNumber} · {route.territory} ({route.depot} Depot)
              </span>
            </div>
          </div>
          <button
            onClick={closeDrawer}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#1F2937] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* JSR Delivery & Order Taker Profile */}
        <div className="bg-[#0B0F19] p-4 rounded-xl border border-[#374151] mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#1F2937] text-gray-300 rounded-full">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{route.jsrName}</div>
              <div className="text-xs text-gray-400 font-mono">Assigned JSR (Delivery &amp; Cash Collection)</div>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800">
            {route.status}
          </span>
        </div>

        {/* Route Metrics Breakdown */}
        <div className="space-y-3 font-mono text-xs mb-6">
          <div className="bg-[#0B0F19] p-3 rounded-lg border border-[#374151] flex justify-between items-center">
            <span className="text-gray-400">Delivered Secondary Sales:</span>
            <span className="text-white font-bold">{formatBDT(route.deliveredSales)}</span>
          </div>

          <div className="bg-[#0B0F19] p-3 rounded-lg border border-[#374151] flex justify-between items-center">
            <span className="text-gray-400">Cash Sales Realized:</span>
            <span className="text-emerald-400 font-bold">{formatBDT(route.cashSales)}</span>
          </div>

          <div className="bg-[#0B0F19] p-3 rounded-lg border border-[#374151] flex justify-between items-center">
            <span className="text-gray-400">Credit Extended Today:</span>
            <span className="text-amber-400 font-bold">{formatBDT(route.creditSales)}</span>
          </div>

          <div className="bg-[#0B0F19] p-3 rounded-lg border border-[#374151] flex justify-between items-center">
            <span className="text-gray-400">Old Market Dues Collected:</span>
            <span className="text-emerald-400 font-bold">+{formatBDT(route.oldDuesCollected)}</span>
          </div>

          <div className="bg-[#0B0F19] p-3 rounded-lg border border-[#374151] flex justify-between items-center">
            <span className="text-gray-400">Route Fuel &amp; Helper Allowance:</span>
            <span className="text-gray-300 font-bold">−{formatBDT(route.cashExpenses)}</span>
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
            Supervisor Notes &amp; Audit Trail
          </div>
          <p className="text-xs font-mono text-gray-300 bg-[#1F2937] p-3 rounded border border-[#374151]">
            &quot;{route.notes || 'Routine beat settlement complete.'}&quot;
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
