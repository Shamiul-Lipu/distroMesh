'use client';

import React from 'react';
import Link from 'next/link';
import {
  Building2,
  TrendingUp,
  Wallet,
  ShieldCheck,
  AlertTriangle,
  Clock,
  ArrowRight,
  Layers,
  CheckCircle2,
  AlertCircle,
  Truck,
  Sparkles,
} from 'lucide-react';
import { formatBDT, formatCompactBDT } from '../../../utils/formatters';
import {
  businessSnapshots,
  portfolioConsolidatedSnapshot,
  BusinessOperationalSnapshot,
} from '../../../data/businessEntitiesData';

interface CrossEntityCommandMatrixProps {
  activeBusinessId?: string;
  onSelectBusiness?: (id: string) => void;
  className?: string;
}

export const CrossEntityCommandMatrix: React.FC<CrossEntityCommandMatrixProps> = ({
  activeBusinessId,
  onSelectBusiness,
  className = '',
}) => {
  const allBusinesses = Object.values(businessSnapshots);
  const totalMonthlyRev = portfolioConsolidatedSnapshot.monthlyRevenue;

  return (
    <section
      aria-label="Cross-Entity Operational Command Matrix"
      className={`rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 sm:p-6 shadow-xs font-mono text-[var(--foreground)] ${className}`}
    >
      {/* Matrix Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/20">
              <Layers size={16} />
            </span>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-[var(--foreground)] uppercase font-mono">
              Cross-Entity Operational Command Matrix
            </h2>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              UNIFIED VIEW
            </span>
          </div>
          <p className="mt-1 text-xs text-[var(--foreground-muted)] font-sans">
            In one look: Side-by-side operational pulse, debt coverage, trapped working capital, and dispatch reliability across all 5 businesses.
          </p>
        </div>

        {/* Aggregate KPI Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] px-3 py-1.5">
            <span className="text-[10px] text-[var(--foreground-muted)] block uppercase">Empire Turnover</span>
            <span className="text-sm font-bold text-white dm-tabular">
              {formatBDT(portfolioConsolidatedSnapshot.monthlyRevenue, { mode: 'summary' })}/mo
            </span>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] px-3 py-1.5">
            <span className="text-[10px] text-[var(--foreground-muted)] block uppercase">Total Liquid Cash</span>
            <span className="text-sm font-bold text-emerald-400 dm-tabular">
              {formatBDT(portfolioConsolidatedSnapshot.availableCash, { mode: 'summary' })}
            </span>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] px-3 py-1.5">
            <span className="text-[10px] text-[var(--foreground-muted)] block uppercase">Combined Fleet</span>
            <span className="text-sm font-bold text-sky-400 dm-tabular">
              27 Delivery Vans
            </span>
          </div>
        </div>
      </div>

      {/* Visual Matrix Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[1020px] text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface-inset)]/60 text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-muted)]">
              <th className="py-3 px-3">Business Entity &amp; Depot</th>
              <th className="py-3 px-3 text-right">Monthly Turnover</th>
              <th className="py-3 px-3 text-right">Liquid Cash</th>
              <th className="py-3 px-3 text-right">Trapped NOWC</th>
              <th className="py-3 px-3 text-center">48h Auto-Debit</th>
              <th className="py-3 px-3 text-center">Dispatch Status</th>
              <th className="py-3 px-3 text-center">Till Settlement</th>
              <th className="py-3 px-3 text-center">Credit Risk</th>
              <th className="py-3 px-3 text-right">Control Board</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {allBusinesses.map((b) => {
              const isSelected = activeBusinessId === b.id;
              const revPct = ((b.monthlyRevenue / totalMonthlyRev) * 100).toFixed(1);

              return (
                <tr
                  key={b.id}
                  onClick={() => onSelectBusiness?.(b.id)}
                  className={`transition-colors cursor-pointer group ${
                    isSelected
                      ? 'bg-[var(--accent-soft)]/20 border-l-4 border-l-[var(--accent)]'
                      : 'hover:bg-[var(--surface-hover)] bg-[var(--surface)]'
                  }`}
                >
                  {/* Entity Name & Location */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg shrink-0 ${
                        b.id === 'unilever-distribution'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : b.id === 'pureit-distribution'
                          ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                          : b.id === 'sherpur-trade-distribution'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : b.id === 'freshway-distribution'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        <Building2 size={16} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors truncate">
                          {b.name}
                        </div>
                        <div className="text-[11px] text-[var(--foreground-muted)] font-sans flex items-center gap-1.5 mt-0.5">
                          <span>{b.principals.join(' · ')}</span>
                          <span>•</span>
                          <span>{b.vanCount} vans</span>
                          <span>•</span>
                          <span>{b.location}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Monthly Turnover & Share */}
                  <td className="py-3.5 px-3 text-right">
                    <div className="font-bold text-sm text-[var(--foreground)] dm-tabular">
                      {formatBDT(b.monthlyRevenue, { mode: 'summary' })}
                    </div>
                    <div className="flex items-center justify-end gap-1.5 mt-1">
                      <div className="w-16 h-1.5 rounded-full bg-[var(--surface-inset)] overflow-hidden">
                        <div
                          style={{ width: `${revPct}%` }}
                          className="h-full bg-emerald-500 rounded-full"
                        />
                      </div>
                      <span className="text-[10px] text-[var(--foreground-muted)] font-mono">{revPct}%</span>
                    </div>
                  </td>

                  {/* Liquid Cash (Bank + Vault) */}
                  <td className="py-3.5 px-3 text-right font-mono">
                    <div className="font-bold text-sm text-emerald-400 dm-tabular">
                      {formatBDT(b.availableCash, { mode: 'summary' })}
                    </div>
                    <div className="text-[10px] text-[var(--foreground-muted)] mt-0.5">
                      Bank: {formatCompactBDT(b.bankCash)} · Vault: {formatCompactBDT(b.vaultCash)}
                    </div>
                  </td>

                  {/* Trapped NOWC */}
                  <td className="py-3.5 px-3 text-right font-mono">
                    <div className="font-bold text-sm text-[var(--foreground)] dm-tabular">
                      {formatBDT(b.nowc, { mode: 'summary' })}
                    </div>
                    <div className="text-[10px] text-[var(--foreground-muted)] mt-0.5">
                      Rec: {formatCompactBDT(b.receivables)} · Stk: {formatCompactBDT(b.inventory)}
                    </div>
                  </td>

                  {/* 48h Auto-Debit & Coverage */}
                  <td className="py-3.5 px-3 text-center font-mono">
                    <div className="font-bold text-xs text-amber-400 dm-tabular">
                      {formatCompactBDT(b.upcomingObligation)}
                    </div>
                    <span className="mt-1 inline-flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                      <ShieldCheck size={10} />
                      {b.cashCoveragePct}%
                    </span>
                  </td>

                  {/* Dispatch Reliability & Stall Status */}
                  <td className="py-3.5 px-3 text-center font-mono">
                    <div className={`font-bold text-xs ${
                      b.dispatchStatus === 'CRITICAL'
                        ? 'text-rose-400'
                        : b.dispatchStatus === 'DELAYED'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}>
                      {b.dispatchDelayMin > 0 ? `+${b.dispatchDelayMin}m stall` : 'On-Time'}
                    </div>
                    <span className="text-[10px] text-[var(--foreground-muted)] block mt-0.5">
                      {b.onTimeDeliveryPct}% on-time
                    </span>
                  </td>

                  {/* Till Settlement & Variance */}
                  <td className="py-3.5 px-3 text-center font-mono">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                      b.cashVariance < 0
                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        : b.cashVariance > 0
                        ? 'bg-sky-500/10 border-sky-500/20 text-sky-400'
                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    }`}>
                      {b.cashVariance !== 0 ? `${b.cashVariance > 0 ? '+' : ''}৳${b.cashVariance}` : 'Reconciled'}
                    </span>
                    <span className="text-[9px] text-[var(--foreground-subtle)] block mt-0.5 truncate max-w-[110px] mx-auto">
                      {b.varianceRoute}
                    </span>
                  </td>

                  {/* Credit Exposure Risk Meter */}
                  <td className="py-3.5 px-3 text-center font-mono">
                    <div className="font-bold text-xs text-[var(--foreground)]">
                      {b.creditRatio}%
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase mt-0.5 inline-block ${
                      b.creditRatio > 35
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {b.creditRatio > 35 ? 'WATCH' : 'SAFE'}
                    </span>
                  </td>

                  {/* Action Link */}
                  <td className="py-3.5 px-3 text-right">
                    <Link
                      href={`/businesses/${encodeURIComponent(b.id)}/overview`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectBusiness?.(b.id);
                      }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-[11px] font-bold transition shadow-xs whitespace-nowrap"
                    >
                      <span>Open Board</span>
                      <ArrowRight size={12} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Consolidated Overall Empire Footer Row */}
          <tfoot>
            <tr className="border-t-2 border-[var(--border)] bg-[var(--surface-inset)] font-bold text-xs text-[var(--foreground)]">
              <td className="py-3.5 px-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-400" />
                  <span className="font-bold text-sm tracking-tight">CONSOLIDATED EMPIRE TOTAL</span>
                  <span className="text-[10px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    5 ENTITIES
                  </span>
                </div>
              </td>
              <td className="py-3.5 px-3 text-right text-sm dm-tabular text-emerald-400">
                {formatBDT(portfolioConsolidatedSnapshot.monthlyRevenue, { mode: 'summary' })}/mo
              </td>
              <td className="py-3.5 px-3 text-right text-sm dm-tabular text-emerald-400">
                {formatBDT(portfolioConsolidatedSnapshot.availableCash, { mode: 'summary' })}
              </td>
              <td className="py-3.5 px-3 text-right text-sm dm-tabular">
                {formatBDT(portfolioConsolidatedSnapshot.nowc, { mode: 'summary' })}
              </td>
              <td className="py-3.5 px-3 text-center text-xs text-amber-400 dm-tabular">
                {formatCompactBDT(portfolioConsolidatedSnapshot.upcomingObligation)}
                <span className="block text-[9px] text-emerald-400 font-bold">
                  {portfolioConsolidatedSnapshot.cashCoveragePct}% Cover
                </span>
              </td>
              <td className="py-3.5 px-3 text-center text-xs text-amber-400 dm-tabular">
                {portfolioConsolidatedSnapshot.onTimeDeliveryPct}% Overall
              </td>
              <td className="py-3.5 px-3 text-center text-xs text-rose-400 dm-tabular">
                {portfolioConsolidatedSnapshot.cashVariance < 0 ? `−৳${Math.abs(portfolioConsolidatedSnapshot.cashVariance)}` : '৳0'} Net
              </td>
              <td className="py-3.5 px-3 text-center text-xs dm-tabular">
                {portfolioConsolidatedSnapshot.creditRatio}% Blended
              </td>
              <td className="py-3.5 px-3 text-right">
                <Link
                  href="/businesses/all/overview"
                  onClick={() => onSelectBusiness?.('all')}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] text-[11px] font-bold text-[var(--foreground)] transition whitespace-nowrap"
                >
                  <span>Empire View</span>
                </Link>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
};
