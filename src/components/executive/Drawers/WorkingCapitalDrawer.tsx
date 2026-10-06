'use client';

import React from 'react';
import { useExecutive } from '@/context/ExecutiveContext';
import { X, Layers, AlertCircle, TrendingDown, Store, Box, FileCheck2 } from 'lucide-react';
import { formatBDT, formatCompactBDT } from '@/utils/formatters';

export const WorkingCapitalDrawer: React.FC = () => {
  const { state, closeDrawer } = useExecutive();

  if (state.activeDrawer !== 'WORKING_CAPITAL') return null;

  const { total, retailerReceivables, inventory, unclaimedSchemes } = state.trappedCapital;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[540px] bg-[#111827] border-l border-[#374151] z-50 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-[#1F2937] pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-mono font-extrabold text-white uppercase">
                Trapped Capital & Working Capital Audit
              </h2>
              <span className="text-[10px] font-mono text-purple-300">ILLUSTRATIVE PROTOTYPE BREAKDOWN</span>
            </div>
          </div>
          <button
            onClick={closeDrawer}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#1F2937] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CEO Explanation Box */}
        <div className="bg-[#0B0F19] border border-purple-500/30 rounded-xl p-4 mb-6">
          <div className="text-xs font-mono font-bold text-purple-300 mb-1 uppercase">
            Executive Summary
          </div>
          <p className="text-xs font-mono text-gray-300 leading-relaxed">
            "This money (<strong>{formatBDT(total)}</strong>) exists inside the business structure but is not immediately available as liquid cash for principal payments or emergency buffers."
          </p>
        </div>

        {/* 3 Main Categories Detailed breakdown */}
        <div className="space-y-4 text-xs font-mono">
          {/* 1. Retailer Receivables */}
          <div className="bg-[#0B0F19] p-4 rounded-xl border border-[#374151]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-purple-400 font-bold">
                <Store className="w-4 h-4" />
                <span>1. RETAILER MARKET RECEIVABLES</span>
              </div>
              <span className="font-bold text-white text-sm">{formatBDT(retailerReceivables)}</span>
            </div>

            <p className="text-gray-400 mb-3 text-[11px]">
              Outstanding credit extended to 412 retail shop owners across Sherpur & Bogura beats.
            </p>

            <div className="space-y-1.5 text-[11px] bg-[#1F2937] p-3 rounded border border-[#374151]">
              <div className="flex justify-between">
                <span className="text-gray-400">Current (&lt; 15 Days):</span>
                <span className="text-emerald-400 font-bold">৳9.80M (66.0%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Overdue (15-30 Days):</span>
                <span className="text-amber-400 font-bold">৳3.85M (25.9%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">High Risk (&gt; 30 Days):</span>
                <span className="text-red-400 font-bold">৳1.20M (8.1%)</span>
              </div>
            </div>
          </div>

          {/* 2. Warehouse Inventory */}
          <div className="bg-[#0B0F19] p-4 rounded-xl border border-[#374151]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-indigo-400 font-bold">
                <Box className="w-4 h-4" />
                <span>2. WAREHOUSE INVENTORY STOCK</span>
              </div>
              <span className="font-bold text-white text-sm">{formatBDT(inventory)}</span>
            </div>

            <p className="text-gray-400 mb-3 text-[11px]">
              Physical FMCG stock held at central Sherpur warehouse (Lux, Surf Excel, Wheel, Knorr, Vaseline).
            </p>

            <div className="space-y-1.5 text-[11px] bg-[#1F2937] p-3 rounded border border-[#374151]">
              <div className="flex justify-between">
                <span className="text-gray-400">Fast Moving Stock (DOX &lt; 7 days):</span>
                <span className="text-emerald-400 font-bold">৳5.10M (70.4%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Slow Moving Stock (DOX &gt; 21 days):</span>
                <span className="text-amber-400 font-bold">৳2.14M (29.6%)</span>
              </div>
            </div>
          </div>

          {/* 3. Unclaimed Schemes */}
          <div className="bg-[#0B0F19] p-4 rounded-xl border border-[#374151]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-blue-400 font-bold">
                <FileCheck2 className="w-4 h-4" />
                <span>3. UNCLAIMED PRINCIPAL SCHEMES & REBATES</span>
              </div>
              <span className="font-bold text-white text-sm">{formatBDT(unclaimedSchemes)}</span>
            </div>

            <p className="text-gray-400 mb-3 text-[11px]">
              Promotional discount claims, damaged stock returns, and volume targets pending Unilever audit credit.
            </p>

            <div className="space-y-1.5 text-[11px] bg-[#1F2937] p-3 rounded border border-[#374151]">
              <div className="flex justify-between">
                <span className="text-gray-400">Q3 Secondary Target Discount:</span>
                <span className="text-blue-300 font-bold">৳1.10M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Transit Damage Claims:</span>
                <span className="text-blue-300 font-bold">৳700K</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-[#1F2937] flex justify-end">
        <button
          onClick={closeDrawer}
          className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold rounded-lg transition-all"
        >
          Close Drawer
        </button>
      </div>
    </div>
  );
};
