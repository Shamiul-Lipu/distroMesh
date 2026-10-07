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
        <aside className="w-screen max-w-md md:max-w-xl border-l border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--foreground)] shadow-2xl flex flex-col justify-between">
          {/* Top Bar: Identity & Close */}
          <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4 bg-[var(--surface)]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent)] block">
                {type === 'ROUTE' && 'ROUTE INVESTIGATION SURFACE'}
                {type === 'INCIDENT' && 'INCIDENT AUDIT & PAYBACK'}
                {type === 'LIQUIDITY' && 'LIQUIDITY & AUTO-DEBIT SCHEDULE'}
                {type === 'WORKING_CAPITAL' && 'NOWC WATERFALL AUDIT'}
              </span>
              <h2 className="text-base font-bold text-[var(--foreground)] mt-0.5">
                {type === 'ROUTE' && `${selectedRoute.vanNumber} • ${selectedRoute.routeName}`}
                {type === 'INCIDENT' && 'Morning Dispatch Stall Investigation'}
                {type === 'LIQUIDITY' && 'Islami Bank & Vault Clearing'}
                {type === 'WORKING_CAPITAL' && 'Net Operating Working Capital'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition"
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
                <div className="rounded-xl bg-[var(--surface-inset)] p-4 border border-[var(--border)] space-y-3">
                  <div className="flex justify-between items-center text-[10px] uppercase text-[var(--foreground-muted)] font-semibold">
                    <span>FINANCIAL SETTLEMENT</span>
                    <span className="text-[var(--success)] font-bold">Van Delivery Beat</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[var(--foreground-muted)] block text-[10px]">{state.banglaMode ? 'ডেলিভারি বিক্রয়:' : 'Delivered Sales:'}</span>
                      <strong className="text-base font-bold text-[var(--foreground)]">
                        {formatBDT(selectedRoute.deliveredSales, { mode: 'exact', bangla: state.banglaMode })}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[var(--foreground-muted)] block text-[10px]">{state.banglaMode ? 'নগদ আদায়:' : 'Cash Collected:'}</span>
                      <strong className="text-base font-bold text-[var(--success)]">
                        {formatBDT(selectedRoute.cashHandedIn, { mode: 'exact', bangla: state.banglaMode })}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[var(--foreground-muted)] block text-[10px]">{state.banglaMode ? 'প্রদত্ত বাকি:' : 'Credit Granted:'}</span>
                      <strong className="text-base font-bold text-[var(--warning)]">
                        {formatBDT(selectedRoute.creditSales, { mode: 'exact', bangla: state.banglaMode })}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[var(--foreground-muted)] block text-[10px]">{state.banglaMode ? 'ক্যাশ তফাত:' : 'Till Variance:'}</span>
                      <strong className={`text-base font-bold ${selectedRoute.variance < 0 ? 'text-[var(--danger)]' : 'text-[var(--foreground)]'}`}>
                        {formatVariance(selectedRoute.variance, state.banglaMode)}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Crew & DSR Logs */}
                <div className="rounded-xl bg-[var(--surface-inset)] p-3.5 border border-[var(--border)]">
                  <span className="text-[10px] uppercase font-bold text-[var(--foreground-muted)] block mb-2">
                    CREW &amp; DELIVERY LOG
                  </span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground-muted)]">Junior Sales Rep (JSR):</span>
                      <strong className="text-[var(--foreground)]">{selectedRoute.jsrName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground-muted)]">Order Booker (SR):</span>
                      <strong className="text-[var(--foreground)]">{selectedRoute.srName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground-muted)]">Retailer Drops:</span>
                      <span className="text-[var(--foreground)]">{selectedRoute.totalRetailers} retail stores</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground-muted)]">Territory Beat:</span>
                      <span className="text-[var(--foreground)]">{selectedRoute.territory}</span>
                    </div>
                  </div>
                </div>

                {/* Retail Drops Invoice Breakdown */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--foreground-muted)] block mb-2">
                    SAMPLE RETAIL INVOICES ON THIS ROUTE
                  </span>
                  <div className="space-y-2">
                    {sampleShopDrops.map((drop) => (
                      <div
                        key={drop.billNumber}
                        className="rounded-lg bg-[var(--surface)] p-2.5 border border-[var(--border)] flex items-center justify-between shadow-2xs"
                      >
                        <div>
                          <div className="font-bold text-[var(--foreground)]">{drop.retailerName}</div>
                          <div className="text-[10px] text-[var(--foreground-muted)] font-sans">{drop.marketPoint} · {drop.billNumber}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[var(--success)] font-bold">{formatBDT(drop.cashPaid, { mode: 'summary', bangla: state.banglaMode })}</div>
                          <div className="text-[10px] text-[var(--warning)] font-medium">{state.banglaMode ? 'বাকি: ' : 'Credit: '}{formatBDT(drop.creditGranted, { mode: 'summary', bangla: state.banglaMode })}</div>
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
                <div className="rounded-xl bg-[var(--danger-soft)] p-4 border border-[var(--danger)]/30 space-y-2">
                  <span className="text-[10px] font-bold text-[var(--danger)] uppercase block">
                    OPERATIONAL FRICTION AUDIT
                  </span>
                  <h3 className="text-sm font-bold text-[var(--foreground)]">
                    Morning Dispatch Yard Departure Stall
                  </h3>
                  <p className="text-xs text-[var(--foreground-muted)] font-sans leading-relaxed">
                    Morning departure stall delayed 12 delivery vans in the warehouse yard until 11:45 AM, impacting 700 retail shops with 165 minutes of route delay.
                  </p>
                </div>

                {/* Economic Payback Table */}
                <div className="rounded-xl bg-[var(--surface-inset)] p-4 border border-[var(--border)] space-y-3">
                  <span className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase block">
                    CAPITAL PAYBACK ECONOMICS
                  </span>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground-muted)]">Idle Crew Wage Cost:</span>
                      <strong className="text-[var(--foreground)]">৳{dispatch.idleCrewCost.toLocaleString('en-IN')}/day</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground-muted)]">Daily Mispick Packing Loss:</span>
                      <strong className="text-[var(--foreground)]">৳{mispick.avgDailyLossBDT.toLocaleString('en-IN')}/day</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground-muted)]">Combined Daily Friction:</span>
                      <strong className="text-[var(--danger)] font-bold">৳7,438 / day</strong>
                    </div>
                    <div className="pt-2 border-t border-[var(--border)] flex justify-between items-center">
                      <span className="text-[var(--foreground)] font-bold">Thermal Replacement Cost:</span>
                      <span className="text-[var(--foreground)] font-bold">৳21,000</span>
                    </div>
                    <div className="flex justify-between items-center text-[var(--success)]">
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
                <div className="rounded-xl bg-[var(--surface-inset)] p-4 border border-[var(--border)] space-y-3">
                  <span className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase block">
                    TREASURY CASH POSITIONS
                  </span>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground-muted)]">Islami Bank Clearing Balance:</span>
                      <strong className="text-[var(--foreground)]">{formatBDT(state.bankCash)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground-muted)]">Warehouse Safe (Physical Vault):</span>
                      <strong className="text-[var(--foreground)]">{formatBDT(state.vaultCash)}</strong>
                    </div>
                    <div className="flex justify-between border-t border-[var(--border)] pt-2">
                      <span className="text-[var(--foreground)] font-bold">Total Liquid Cash:</span>
                      <strong className="text-[var(--success)] text-sm font-bold">
                        {formatBDT(state.bankCash + state.vaultCash)}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-[var(--warning-soft)] p-4 border border-[var(--warning)]/30 space-y-2">
                  <span className="text-[10px] font-bold text-[var(--warning)] uppercase block">
                    UPCOMING OBLIGATIONS (NEXT 48H)
                  </span>
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--foreground)]">Unilever BD Primary Supply Sweep:</span>
                    <strong className="text-[var(--warning)] font-bold">{formatBDT(state.upcomingObligation)}</strong>
                  </div>
                  <p className="text-[11px] text-[var(--foreground-muted)] font-sans pt-1">
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
                <div className="rounded-xl bg-[var(--surface-inset)] p-4 border border-[var(--border)] space-y-3">
                  <span className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase block">
                    NET OPERATING WORKING CAPITAL FORMULA
                  </span>
                  <div className="space-y-2 font-mono">
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground-muted)]">(+) Trade Receivables:</span>
                      <strong className="text-[var(--foreground)]">{formatBDT(state.workingCapital.receivables)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground-muted)]">(+) Warehouse Inventory:</span>
                      <strong className="text-[var(--foreground)]">{formatBDT(state.workingCapital.inventory)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground-muted)]">(+) Scheme &amp; Damage Claims:</span>
                      <strong className="text-[var(--foreground)]">{formatBDT(state.workingCapital.schemeClaimsPending + state.workingCapital.damageClaimsPending)}</strong>
                    </div>
                    <div className="flex justify-between text-[var(--danger)]">
                      <span>(−) Trade Payables (Principal):</span>
                      <strong>−{formatBDT(state.workingCapital.payables)}</strong>
                    </div>
                    <div className="pt-2 border-t border-[var(--border)] flex justify-between text-[var(--success)]">
                      <span className="font-bold">(=) Net NOWC:</span>
                      <strong className="text-base font-bold">{formatBDT(state.workingCapital.netOperatingWorkingCapital)}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Footer */}
          <div className="border-t border-[var(--border)] p-4 bg-[var(--surface)] flex items-center justify-between">
            <span className="text-[10px] text-[var(--foreground-muted)]">
              distroMesh Executive Investigation Surface
            </span>
            <button
              onClick={onClose}
              className="dm-button-secondary px-4 py-2 rounded-lg text-xs font-bold"
            >
              Close Drawer
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
