'use client';

import React, { useState } from 'react';
import {
  Navigation,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  User,
  Store,
} from 'lucide-react';
import { useExecutive } from '../../../context/ExecutiveContext';
import { RouteData } from '../../../types/executive';
import { sampleShopDrops } from '../../../data/seedData';
import { formatBDT, formatVariance } from '../../../utils/formatters';

interface RouteSettlementMatrixProps {
  onSelectRoute?: (routeId: string) => void;
}

export const RouteSettlementMatrix: React.FC<RouteSettlementMatrixProps> = ({
  onSelectRoute,
}) => {
  const { state } = useExecutive();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'EXCEPTION' | 'WATCH' | 'OK'>('ALL');
  const [expandedRouteId, setExpandedRouteId] = useState<string | null>(null);

  // Filter routes based on search and status
  const filteredRoutes = state.routes.filter((route) => {
    const matchesSearch =
      route.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.vanNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.jsrName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.srName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'EXCEPTION') return route.status === 'ACTION';
    if (statusFilter === 'WATCH') return route.status === 'REVIEW';
    if (statusFilter === 'OK') return route.status === 'OK';
    return true;
  });

  const getStatusBadge = (route: RouteData) => {
    if (route.status === 'ACTION') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <AlertOctagon size={11} />
          <span>{state.banglaMode ? '■ ব্যতিক্রম' : '■ EXCEPTION'}</span>
        </span>
      );
    }
    if (route.status === 'REVIEW') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
          <AlertTriangle size={11} />
          <span>{state.banglaMode ? '▲ পর্যবেক্ষণ' : '▲ WATCH'}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
        <ShieldCheck size={11} />
        <span>{state.banglaMode ? '● সম্পন্ন' : '● OK'}</span>
      </span>
    );
  };

  const handleRowClick = (route: RouteData) => {
    if (onSelectRoute) {
      onSelectRoute(route.id);
    } else {
      setExpandedRouteId((prev) => (prev === route.id ? null : route.id));
    }
  };

  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white shadow-sm overflow-hidden font-mono text-slate-800">
      {/* Header with Search and Filter */}
      <div className="p-4 sm:p-5 border-b border-[#e2e8f0] flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/60">
        <div>
          <div className="flex items-center gap-2">
            <Navigation size={14} className="text-emerald-700" />
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
              {state.banglaMode ? '১২টি রুটের সেটলমেন্ট ও আর্থিক জবাবদিহিতা' : '12-ROUTE SETTLEMENT & ACCOUNTABILITY MATRIX'}
            </h2>
            <span className="text-[10px] text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded font-mono">
              {filteredRoutes.length} of 12 Beats
            </span>
          </div>
          <p className="text-[10px] text-slate-500 font-sans mt-0.5">
            Click any route row to inspect underlying retail shop drops, invoice challans, and driver cash sheets.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={state.banglaMode ? 'রুট, ভ্যান, বা কর্মী খুঁজুন...' : 'Search beat, van, SR, JSR...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-44 sm:w-56 rounded border border-slate-300 bg-white pl-8 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex items-center rounded border border-slate-200 bg-slate-100 p-0.5 text-[10px]">
            {(['ALL', 'EXCEPTION', 'WATCH', 'OK'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-2 py-1 rounded transition ${
                  statusFilter === filter
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Routes Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#e2e8f0] bg-slate-50 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
              <th className="py-2.5 px-3">Beat / Van</th>
              <th className="py-2.5 px-3">Crew (JSR / SR)</th>
              <th className="py-2.5 px-3 text-right">Delivered (৳)</th>
              <th className="py-2.5 px-3 text-right">Collected (৳)</th>
              <th className="py-2.5 px-3 text-right">Credit (৳)</th>
              <th className="py-2.5 px-3 text-right">Variance (৳)</th>
              <th className="py-2.5 px-3 text-center">Settlement</th>
              <th className="py-2.5 px-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRoutes.map((route) => {
              const isExpanded = expandedRouteId === route.id;
              const hasShortage = route.variance !== 0;

              return (
                <React.Fragment key={route.id}>
                  <tr
                    onClick={() => handleRowClick(route)}
                    className={`cursor-pointer transition hover:bg-slate-50 ${
                      hasShortage && route.status === 'ACTION'
                        ? 'bg-rose-50/40 hover:bg-rose-50/60'
                        : isExpanded
                        ? 'bg-slate-50/80'
                        : ''
                    }`}
                  >
                    {/* Beat / Van */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedRouteId((prev) => (prev === route.id ? null : route.id));
                          }}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                        <div>
                          <div className="font-bold text-slate-900">
                            {route.vanNumber} · {route.id.toUpperCase()}
                          </div>
                          <div className="text-[10px] text-slate-500 font-sans">
                            {route.routeName} ({route.depot})
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Crew */}
                    <td className="py-3 px-3 text-[11px] font-sans">
                      <div className="text-slate-800 font-medium">JSR: {route.jsrName}</div>
                      <div className="text-[10px] text-slate-500">SR: {route.srName}</div>
                    </td>

                    {/* Delivered */}
                    <td className="py-3 px-3 text-right font-bold text-slate-800 tabular-nums">
                      {formatBDT(route.deliveredSales, { mode: 'exact', bangla: state.banglaMode })}
                    </td>

                    {/* Collected (Handed in) */}
                    <td className="py-3 px-3 text-right font-bold text-emerald-700 tabular-nums">
                      {formatBDT(route.cashHandedIn, { mode: 'exact', bangla: state.banglaMode })}
                    </td>

                    {/* Credit Extended */}
                    <td className="py-3 px-3 text-right font-bold text-amber-700 tabular-nums">
                      {formatBDT(route.creditSales, { mode: 'exact', bangla: state.banglaMode })}
                    </td>

                    {/* Till Variance */}
                    <td className="py-3 px-3 text-right tabular-nums">
                      <span className={`font-bold ${
                        route.variance < 0
                          ? 'text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200'
                          : route.variance > 0
                          ? 'text-emerald-700'
                          : 'text-slate-500'
                      }`}>
                        {formatVariance(route.variance, state.banglaMode)}
                      </span>
                    </td>

                    {/* Settlement Status */}
                    <td className="py-3 px-3 text-center">
                      {getStatusBadge(route)}
                    </td>

                    {/* Action Icon */}
                    <td className="py-3 px-2 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectRoute) onSelectRoute(route.id);
                        }}
                        className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-emerald-700 transition"
                        title="Investigate Route Drawer"
                      >
                        <ExternalLink size={13} />
                      </button>
                    </td>
                  </tr>

                  {/* Expandable Retail Shop Drops Drilldown */}
                  {isExpanded && (
                    <tr className="bg-slate-50/60 border-y border-slate-200">
                      <td colSpan={8} className="p-3 sm:p-4">
                        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-2xs">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                              <Store size={12} className="text-emerald-700" />
                              Retailer Invoices for {route.vanNumber} ({route.routeName})
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {sampleShopDrops.length} drops logged · Average Drop: ৳1,333
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                            {sampleShopDrops.map((drop) => (
                              <div
                                key={drop.billNumber}
                                className="rounded bg-slate-50 p-2 border border-slate-200 flex flex-col justify-between"
                              >
                                <div>
                                  <div className="flex items-center justify-between text-[10px]">
                                    <span className="font-bold text-slate-800 truncate">{drop.retailerName}</span>
                                    <span className="text-slate-400 font-mono">{drop.billNumber}</span>
                                  </div>
                                  <div className="text-[10px] text-slate-500 font-sans mt-0.5">{drop.marketPoint}</div>
                                </div>
                                <div className="mt-2 pt-1 border-t border-slate-200 flex items-center justify-between text-[10px]">
                                  <span className="text-emerald-700 font-semibold">Cash: {formatBDT(drop.cashPaid, { mode: 'summary' })}</span>
                                  <span className="text-amber-700 font-semibold">Credit: {formatBDT(drop.creditGranted, { mode: 'summary' })}</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {route.statusReason && (
                            <div className="mt-2 text-[10px] text-amber-900 bg-amber-50 px-2.5 py-1 rounded border border-amber-200 font-sans">
                              <strong>Audit Exception:</strong> {route.statusReason}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
