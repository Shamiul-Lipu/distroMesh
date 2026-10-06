'use client';

import React from 'react';
import { useExecutive } from '../../context/ExecutiveContext';
import { formatBDT, formatCompactBDT } from '../../utils/formatters';
import { ArrowRight, Store, Box, FileCheck2, Info } from 'lucide-react';

export const WorkingCapital: React.FC = () => {
  const { state, openDrawer } = useExecutive();

  const wc = state.workingCapital;
  const total = wc.netOperatingWorkingCapital;
  const retailerReceivables = wc.receivables;
  const inventory = wc.inventory;
  const unclaimedSchemes = wc.schemeClaimsPending;
  const grossCapital = retailerReceivables + inventory + unclaimedSchemes;

  const recPct = grossCapital ? ((retailerReceivables / grossCapital) * 100).toFixed(1) : '0.0';
  const invPct = grossCapital ? ((inventory / grossCapital) * 100).toFixed(1) : '0.0';
  const schPct = grossCapital ? ((unclaimedSchemes / grossCapital) * 100).toFixed(1) : '0.0';

  return (
    <div className="bg-[#111827] border border-[#374151] rounded-xl p-5 shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-[#1F2937] pb-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-purple-500"></div>
          <h2 className="text-base font-bold text-[#F9FAFB] tracking-tight uppercase font-sans">
            Net Operating Working Capital
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
            ILLUSTRATIVE
          </span>
        </div>
        <button
          onClick={() => openDrawer('WORKING_CAPITAL')}
          className="text-xs font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1 hover:underline"
        >
          <span>Capital Breakdown</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Total Highlight */}
      <div
        onClick={() => openDrawer('WORKING_CAPITAL')}
        className="bg-[#0B0F19] rounded-lg p-4 border border-[#374151] hover:border-purple-500/50 cursor-pointer transition-all mb-4 group"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-[#9CA3AF] uppercase">
              Net Operating Working Capital (Closing Stock Basis)
            </div>
            <div className="text-2xl font-mono font-bold text-[#F9FAFB] group-hover:text-purple-400 transition-colors mt-0.5">
              {formatBDT(total)}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-mono text-purple-400 bg-purple-950/60 px-2.5 py-1 rounded border border-purple-800">
              NOWC
            </span>
          </div>
        </div>

        {/* Multi-segment Bar Chart */}
        <div className="mt-3">
          <div className="h-3 w-full bg-[#1F2937] rounded-full overflow-hidden flex">
            <div
              style={{ width: `${recPct}%` }}
              className="bg-purple-500 h-full hover:brightness-125 transition-all"
              title={`Retailer Receivables: ${recPct}%`}
            ></div>
            <div
              style={{ width: `${invPct}%` }}
              className="bg-indigo-500 h-full hover:brightness-125 transition-all"
              title={`Warehouse Inventory: ${invPct}%`}
            ></div>
            <div
              style={{ width: `${schPct}%` }}
              className="bg-blue-400 h-full hover:brightness-125 transition-all"
              title={`Unclaimed Schemes: ${schPct}%`}
            ></div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-3 gap-2 text-xs font-mono">
        {/* Retailer Receivables */}
        <div
          onClick={() => openDrawer('WORKING_CAPITAL')}
          className="bg-[#0B0F19] p-3 rounded-lg border border-[#1F2937] hover:border-purple-500/40 cursor-pointer transition-all"
        >
          <div className="flex items-center gap-1.5 text-purple-400 mb-1">
            <Store className="w-3.5 h-3.5" />
            <span className="font-semibold text-[11px]">Receivables</span>
          </div>
          <div className="font-bold text-white text-sm">
            {formatCompactBDT(retailerReceivables)}
          </div>
          <div className="text-[10px] text-gray-400 mt-0.5">{recPct}% of Total</div>
        </div>

        {/* Warehouse Inventory */}
        <div
          onClick={() => openDrawer('WORKING_CAPITAL')}
          className="bg-[#0B0F19] p-3 rounded-lg border border-[#1F2937] hover:border-indigo-500/40 cursor-pointer transition-all"
        >
          <div className="flex items-center gap-1.5 text-indigo-400 mb-1">
            <Box className="w-3.5 h-3.5" />
            <span className="font-semibold text-[11px]">Inventory</span>
          </div>
          <div className="font-bold text-white text-sm">
            {formatCompactBDT(inventory)}
          </div>
          <div className="text-[10px] text-gray-400 mt-0.5">{invPct}% of Total</div>
        </div>

        {/* Unclaimed Schemes */}
        <div
          onClick={() => openDrawer('WORKING_CAPITAL')}
          className="bg-[#0B0F19] p-3 rounded-lg border border-[#1F2937] hover:border-blue-400/40 cursor-pointer transition-all"
        >
          <div className="flex items-center gap-1.5 text-blue-400 mb-1">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span className="font-semibold text-[11px]">Unclaimed Schemes</span>
          </div>
          <div className="font-bold text-white text-sm">
            {formatCompactBDT(unclaimedSchemes)}
          </div>
          <div className="text-[10px] text-gray-400 mt-0.5">{schPct}% of Total</div>
        </div>
      </div>

      {/* Explanatory CEO Callout */}
      <div className="mt-3 pt-2 border-t border-[#1F2937] flex items-center gap-2 text-[11px] font-mono text-[#9CA3AF]">
        <Info className="w-4 h-4 text-purple-400 shrink-0" />
        <p className="truncate">
          &quot;This money exists inside the business but is not immediately available as liquid cash.&quot;
        </p>
      </div>
    </div>
  );
};
