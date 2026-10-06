'use client';
import React from 'react';
import { useExecutive } from '../../context/ExecutiveContext';
import { formatBDT, formatVariance } from '../../utils/formatters';
import { Truck, CheckCircle2, AlertTriangle, AlertCircle, User } from 'lucide-react';
import { RouteStatus } from '../../types/executive';

export const RouteMatrix: React.FC = () => {
  const { state, openDrawer } = useExecutive();

  const getStatusBadge = (status: RouteStatus, variance: number) => {
    if (status === 'ACTION' || Math.abs(variance) > 2000) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-rose-400" />
          ACTION ({formatVariance(variance)})
        </span>
      );
    }
    if (status === 'REVIEW' || variance !== 0) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/60 text-amber-400 border border-amber-800 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 text-amber-400" />
          REVIEW ({formatVariance(variance)})
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
        OK
      </span>
    );
  };

  return (
    <div className="bg-[#111827] border border-[#374151] rounded-xl p-5 shadow-xl">
      {/* Module Title */}
      <div className="flex items-center justify-between mb-4 border-b border-[#1F2937] pb-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
          <h2 className="text-base font-bold text-[#F9FAFB] tracking-tight uppercase font-sans">
            Route Settlement Matrix (12 Vans)
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1F2937] text-blue-400 border border-[#374151]">
            FIELD EXECUTION AUDIT
          </span>
        </div>
        <span className="text-xs font-mono text-[#9CA3AF]">
          Click route for detailed audit
        </span>
      </div>

      {/* Grid of Vans */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {state.routes.map((route) => {
          const isSelected = state.selectedRouteId === route.id && state.activeDrawer === 'ROUTE_DETAIL';

          return (
            <div
              key={route.id}
              onClick={() => openDrawer('ROUTE_DETAIL', route.id)}
              className={`bg-[#0B0F19] rounded-xl p-4 border transition-all cursor-pointer relative group ${
                isSelected
                  ? 'border-blue-500 bg-[#111827] shadow-lg shadow-blue-900/30 ring-1 ring-blue-500'
                  : route.status === 'ACTION'
                  ? 'border-rose-500/60 hover:border-rose-500'
                  : route.status === 'REVIEW'
                  ? 'border-amber-500/30 hover:border-amber-500/60'
                  : 'border-[#374151] hover:border-gray-500'
              }`}
            >
              {/* Top Row: Van Number & Status */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-[#1F2937] text-blue-400 border border-[#374151]">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-mono font-bold text-white group-hover:text-blue-400 transition-colors">
                      {route.vanNumber} — {route.routeName}
                    </h3>
                  </div>
                </div>
                {getStatusBadge(route.status, route.variance)}
              </div>

              {/* JSR / SR Info */}
              <div className="flex items-center justify-between text-xs font-mono text-[#9CA3AF] mb-3 pb-2 border-b border-[#1F2937]">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span>JSR: <strong className="text-gray-200">{route.jsrName}</strong> · SR: <strong className="text-gray-200">{route.srName}</strong></span>
                </div>
                <div className="text-[10px] text-gray-500">Last: {route.lastCheckin}</div>
              </div>

              {/* Data Row */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-3">
                <div className="bg-[#1F2937] p-2.5 rounded border border-[#374151]">
                  <div className="text-[10px] text-[#9CA3AF] uppercase">Cash Collected</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">
                    {formatBDT(route.collected)}
                  </div>
                </div>

                <div className="bg-[#1F2937] p-2.5 rounded border border-[#374151]">
                  <div className="text-[10px] text-[#9CA3AF] uppercase">Credit Extended</div>
                  <div className="text-sm font-bold text-amber-400 mt-0.5">
                    {formatBDT(route.credit)}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-[#9CA3AF] mb-1">
                  <span>Retailer Outlets Visited ({route.retailersVisited}/{route.totalRetailers})</span>
                  <span className="font-bold text-white">{route.completionPct}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#1F2937] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${route.completionPct}%` }}
                    className={`h-full ${
                      route.status === 'ACTION' ? 'bg-rose-500' : route.status === 'REVIEW' ? 'bg-amber-500' : 'bg-blue-500'
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
