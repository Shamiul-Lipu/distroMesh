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
    <div className="fixed inset-y-0 right-0 w-full sm:w-[500px] bg-[var(--surface-elevated)] border-l border-[var(--border)] text-[var(--foreground)] z-50 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[var(--accent-soft)] text-[var(--accent)] rounded-lg border border-[var(--accent)]/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-mono font-extrabold text-[var(--foreground)] uppercase">
                {route.routeName}
              </h2>
              <span className="text-xs font-mono text-[var(--foreground-muted)]">
                {route.vanNumber} · {route.territory} ({route.depot} Depot)
              </span>
            </div>
          </div>
          <button
            onClick={closeDrawer}
            className="p-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] rounded-lg hover:bg-[var(--surface-hover)] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* JSR Delivery & Order Taker Profile */}
        <div className="bg-[var(--surface-inset)] p-4 rounded-xl border border-[var(--border)] mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[var(--surface-elevated)] text-[var(--foreground)] rounded-full border border-[var(--border)]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[var(--foreground)]">{route.jsrName}</div>
              <div className="text-xs text-[var(--foreground-muted)] font-mono">Assigned JSR (Delivery &amp; Cash Collection)</div>
            </div>
          </div>
          <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${
            route.status === 'ACTION' ? 'bg-[var(--danger-soft)] text-[var(--danger)] border-[var(--danger)]/30'
            : route.status === 'REVIEW' ? 'bg-[var(--warning-soft)] text-[var(--warning)] border-[var(--warning)]/30'
            : 'bg-[var(--success-soft)] text-[var(--success)] border-[var(--success)]/30'
          }`}>
            {route.status}
          </span>
        </div>

        {/* Route Metrics Breakdown */}
        <div className="space-y-3 font-mono text-xs mb-6">
          <div className="bg-[var(--surface-inset)] p-3 rounded-lg border border-[var(--border)] flex justify-between items-center">
            <span className="text-[var(--foreground-muted)]">Delivered Secondary Sales:</span>
            <span className="text-[var(--foreground)] font-bold">{formatBDT(route.deliveredSales)}</span>
          </div>

          <div className="bg-[var(--surface-inset)] p-3 rounded-lg border border-[var(--border)] flex justify-between items-center">
            <span className="text-[var(--foreground-muted)]">Cash Sales Realized:</span>
            <span className="text-[var(--success)] font-bold">{formatBDT(route.cashSales)}</span>
          </div>

          <div className="bg-[var(--surface-inset)] p-3 rounded-lg border border-[var(--border)] flex justify-between items-center">
            <span className="text-[var(--foreground-muted)]">Credit Extended Today:</span>
            <span className="text-[var(--warning)] font-bold">{formatBDT(route.creditSales)}</span>
          </div>

          <div className="bg-[var(--surface-inset)] p-3 rounded-lg border border-[var(--border)] flex justify-between items-center">
            <span className="text-[var(--foreground-muted)]">Old Market Dues Collected:</span>
            <span className="text-[var(--success)] font-bold">+{formatBDT(route.oldDuesCollected)}</span>
          </div>

          <div className="bg-[var(--surface-inset)] p-3 rounded-lg border border-[var(--border)] flex justify-between items-center">
            <span className="text-[var(--foreground-muted)]">Route Fuel &amp; Helper Allowance:</span>
            <span className="text-[var(--foreground)] font-bold">−{formatBDT(route.cashExpenses)}</span>
          </div>

          <div className={`p-3 rounded-lg border flex justify-between items-center ${
            route.variance !== 0 ? 'bg-[var(--warning-soft)] border-[var(--warning)]/40' : 'bg-[var(--surface-inset)] border-[var(--border)]'
          }`}>
            <span className="text-[var(--foreground-muted)]">Cash Settlement Variance:</span>
            <span className={`font-bold ${route.variance !== 0 ? 'text-[var(--warning)]' : 'text-[var(--success)]'}`}>
              {formatVariance(route.variance)}
            </span>
          </div>
        </div>

        {/* Notes & Audit History */}
        <div className="bg-[var(--surface-inset)] p-4 rounded-xl border border-[var(--border)]">
          <div className="text-xs font-mono font-bold text-[var(--foreground-muted)] mb-2 uppercase">
            Supervisor Notes &amp; Audit Trail
          </div>
          <p className="text-xs font-mono text-[var(--foreground)] bg-[var(--surface-elevated)] p-3 rounded border border-[var(--border)]">
            &quot;{route.notes || 'Routine beat settlement complete.'}&quot;
          </p>
        </div>
      </div>

      {/* Footer Quick Actions */}
      <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between gap-2 text-xs font-mono">
        {route.variance !== 0 && !state.varianceWaived && (
          <button
            onClick={waiveVariance}
            className="px-4 py-2 bg-[var(--success)] hover:opacity-90 text-white font-bold rounded-lg transition-all"
          >
            Approve Variance Waiver
          </button>
        )}
        <button
          onClick={() => openModal('CREDIT_LOCK')}
          className="px-4 py-2 bg-[var(--warning)] hover:opacity-90 text-white font-bold rounded-lg transition-all"
        >
          Lock Overdue Outlets
        </button>
        <button
          onClick={closeDrawer}
          className="px-4 py-2 bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] rounded-lg border border-[var(--border)]"
        >
          Close
        </button>
      </div>
    </div>
  );
};
