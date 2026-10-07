'use client';

import React from 'react';
import {
  X,
  Navigation,
  Printer,
  Vault,
  Wallet,
  Clock,
  User,
  Store,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  TrendingDown,
} from 'lucide-react';
import { useExecutive } from '../../../context/ExecutiveContext';
import { sampleShopDrops, popy12Routes } from '../../../data/seedData';
import { formatBDT, formatVariance } from '../../../utils/formatters';
import { deriveDispatchMetrics, deriveMispickLoss } from '../../../utils/derivedRules';

export type DrawerType = 'ROUTE' | 'INCIDENT' | 'LIQUIDITY' | 'WORKING_CAPITAL' | null;

interface InvestigationDrawerProps {
  type: DrawerType;
  selectedRouteId: string | null;
  onClose: () => void;
  onTriggerAction?: (actionName: string) => void;
}

export const InvestigationDrawer: React.FC<InvestigationDrawerProps> = ({
  type,
  selectedRouteId,
  onClose,
  onTriggerAction,
}) => {
  const { state } = useExecutive();

  if (!type) return null;

  // Selected route data
  const selectedRoute = state.routes.find((r) => r.id === selectedRouteId) || state.routes[2]; // default to Van 3
  const dispatch = deriveDispatchMetrics(state.dispatchDelayMinutes);
  const mispick = deriveMispickLoss(60);

  return (
    <div className="fixed inset-0 z-40 overflow-hidden font-mono animate-in fade-in duration-200">
      {/* Dark blur backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <aside className="w-screen max-w-md md:max-w-xl border-l border-[#e2e8f0] bg-white text-slate-800 shadow-2xl flex flex-col justify-between">
          {/* Top Bar: Identity & Close */}
          <div className="flex items-center justify-between border-b border-[#e2e8f0] px-5 py-4 bg-slate-50">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                {type === 'ROUTE' && 'ROUTE INVESTIGATION SURFACE'}
                {type === 'INCIDENT' && 'INCIDENT AUDIT & PAYBACK'}
                {type === 'LIQUIDITY' && 'LIQUIDITY & AUTO-DEBIT SCHEDULE'}
                {type === 'WORKING_CAPITAL' && 'NOWC WATERFALL AUDIT'}
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                {type === 'ROUTE' && `${selectedRoute.vanNumber} • ${selectedRoute.routeName}`}
                {type === 'INCIDENT' && 'Morning Dispatch Stall Investigation'}
                {type === 'LIQUIDITY' && 'Islami Bank & Vault Clearing'}
                {type === 'WORKING_CAPITAL' && 'Net Operating Working Capital'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Middle Body: Financial Impact & Operational Evidence */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
            {/* ========================================================
                DRAWER 1: ROUTE INVESTIGATION
                ======================================================== */}
            {type === 'ROUTE' && (
              <div className="space-y-4">
                {/* Financial Summary */}
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center text-[10px] uppercase text-slate-500 font-semibold">
                    <span>FINANCIAL SETTLEMENT</span>
                    <span className="text-emerald-700 font-bold">Van Delivery Beat</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Delivered Sales:</span>
                      <strong className="text-base font-bold text-slate-900">
                        {formatBDT(selectedRoute.deliveredSales)}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Cash Collected:</span>
                      <strong className="text-base font-bold text-emerald-700">
                        {formatBDT(selectedRoute.cashHandedIn)}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Credit Granted:</span>
                      <strong className="text-base font-bold text-amber-700">
                        {formatBDT(selectedRoute.creditSales)}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Till Variance:</span>
                      <strong className={`text-base font-bold ${selectedRoute.variance < 0 ? 'text-rose-700' : 'text-slate-900'}`}>
                        {formatVariance(selectedRoute.variance)}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Crew & DSR Logs */}
                <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-2">
                    CREW &amp; DELIVERY LOG
                  </span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Junior Sales Rep (JSR):</span>
                      <strong className="text-slate-800">{selectedRoute.jsrName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Order Booker (SR):</span>
                      <strong className="text-slate-800">{selectedRoute.srName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Retailer Drops:</span>
                      <span className="text-slate-800">{selectedRoute.totalRetailers} retail stores</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Territory Beat:</span>
                      <span className="text-slate-800">{selectedRoute.territory}</span>
                    </div>
                  </div>
                </div>

                {/* Retail Drops Invoice Breakdown */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-2">
                    SAMPLE RETAIL INVOICES ON THIS ROUTE
                  </span>
                  <div className="space-y-2">
                    {sampleShopDrops.map((drop) => (
                      <div
                        key={drop.billNumber}
                        className="rounded-lg bg-white p-2.5 border border-slate-200 flex items-center justify-between shadow-2xs"
                      >
                        <div>
                          <div className="font-bold text-slate-800">{drop.retailerName}</div>
                          <div className="text-[10px] text-slate-500 font-sans">{drop.marketPoint} · {drop.billNumber}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-emerald-700 font-bold">{formatBDT(drop.cashPaid, { mode: 'summary' })}</div>
                          <div className="text-[10px] text-amber-700 font-medium">Credit: {formatBDT(drop.creditGranted, { mode: 'summary' })}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                DRAWER 2: INCIDENT & PAYBACK
                ======================================================== */}
            {type === 'INCIDENT' && (
              <div className="space-y-4">
                <div className="rounded-xl bg-rose-50 p-4 border border-rose-200 space-y-2">
                  <span className="text-[10px] font-bold text-rose-800 uppercase block">
                    OPERATIONAL FRICTION AUDIT
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    Morning Dispatch Yard Departure Stall
                  </h3>
                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    Morning departure stall delayed 12 delivery vans in the warehouse yard until 11:45 AM, impacting 700 retail shops with 165 minutes of route delay.
                  </p>
                </div>

                {/* Economic Payback Table */}
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 space-y-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">
                    CAPITAL PAYBACK ECONOMICS
                  </span>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Idle Crew Wage Cost:</span>
                      <strong className="text-slate-800">৳{dispatch.idleCrewCost.toLocaleString('en-IN')}/day</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Daily Mispick Packing Loss:</span>
                      <strong className="text-slate-800">৳{mispick.avgDailyLossBDT.toLocaleString('en-IN')}/day</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Combined Daily Friction:</span>
                      <strong className="text-rose-700 font-bold">৳7,438 / day</strong>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                      <span className="text-slate-700 font-bold">Thermal Replacement Cost:</span>
                      <span className="text-slate-800 font-bold">৳21,000</span>
                    </div>
                    <div className="flex justify-between items-center text-emerald-700">
                      <span className="font-bold">Payback Period:</span>
                      <strong className="text-base font-bold">{mispick.paybackDays} Days</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                DRAWER 3: LIQUIDITY
                ======================================================== */}
            {type === 'LIQUIDITY' && (
              <div className="space-y-4">
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 space-y-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">
                    TREASURY CASH POSITIONS
                  </span>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Islami Bank Clearing Balance:</span>
                      <strong className="text-slate-800">{formatBDT(state.bankCash)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Warehouse Safe (Physical Vault):</span>
                      <strong className="text-slate-800">{formatBDT(state.vaultCash)}</strong>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2">
                      <span className="text-slate-700 font-bold">Total Liquid Cash:</span>
                      <strong className="text-emerald-700 text-sm font-bold">
                        {formatBDT(state.bankCash + state.vaultCash)}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-amber-50 p-4 border border-amber-200 space-y-2">
                  <span className="text-[10px] font-bold text-amber-800 uppercase block">
                    UPCOMING OBLIGATIONS (NEXT 48H)
                  </span>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-700">Unilever BD Primary Supply Sweep:</span>
                    <strong className="text-amber-800 font-bold">{formatBDT(state.upcomingObligation)}</strong>
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans pt-1">
                    Automated direct debit sweeps operating bank account every 48 hours for fresh replenishment stock.
                  </p>
                </div>
              </div>
            )}

            {/* ========================================================
                DRAWER 4: WORKING CAPITAL (NOWC)
                ======================================================== */}
            {type === 'WORKING_CAPITAL' && (
              <div className="space-y-4">
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 space-y-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">
                    NET OPERATING WORKING CAPITAL FORMULA
                  </span>
                  <div className="space-y-2 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">(+) Trade Receivables:</span>
                      <strong className="text-slate-800">{formatBDT(state.workingCapital.receivables)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">(+) Warehouse Inventory:</span>
                      <strong className="text-slate-800">{formatBDT(state.workingCapital.inventory)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">(+) Scheme &amp; Damage Claims:</span>
                      <strong className="text-slate-800">{formatBDT(state.workingCapital.schemeClaimsPending + state.workingCapital.damageClaimsPending)}</strong>
                    </div>
                    <div className="flex justify-between text-rose-700">
                      <span>(−) Trade Payables (Principal):</span>
                      <strong>−{formatBDT(state.workingCapital.payables)}</strong>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between text-emerald-700">
                      <span className="font-bold">(=) Net NOWC:</span>
                      <strong className="text-base font-bold">{formatBDT(state.workingCapital.netOperatingWorkingCapital)}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Footer */}
          <div className="border-t border-[#e2e8f0] p-4 bg-slate-50 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">
              distroMesh Executive Investigation Surface
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition shadow-xs"
            >
              Close Drawer
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
