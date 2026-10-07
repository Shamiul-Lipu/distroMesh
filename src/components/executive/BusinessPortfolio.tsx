'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  Building2,
  Check,
  CircleDollarSign,
  CirclePlus,
  GitBranch,
  MapPin,
  Plus,
  Share2,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatBDT } from '../../utils/formatters';
import { getBusinessRoute } from '../../utils/businessRoutes';
import { useTheme } from '../../context/ThemeContext';
import { CrossEntityCommandMatrix } from './visualizations/CrossEntityCommandMatrix';

export type BusinessProfile = {
  id: string;
  name: string;
  industry: string;
  location: string;
  registrationId: string;
  status: 'Active' | 'Setup';
  createdAt: string;
  customerCount?: number;
  employeeCount?: number;
  isSample?: boolean;
};

export type BusinessRelationship = {
  id: string;
  parentBusinessId: string;
  relatedBusinessId: string;
  linkedAt: string;
  profileReused: boolean;
  referenceEntryCount: number;
  relationshipType?: 'Product line' | 'Local distributor' | 'Retail partner' | 'Connected distributor' | 'Distribution partner';
};

export type BusinessMetrics = {
  availableCash: number | null;
  receivables: number | null;
  monthlyRevenue: number | null;
  monthlyNetProfit: number | null;
  invoiceCount: number;
  expenseCount: number;
  relatedCount: number;
  isIllustrative: boolean;
  customerCount: number | null;
  employeeCount: number | null;
  overdueInvoiceCount: number;
  overdueInvoiceTotal: number;
  monthlySalesHistory?: { month: string; revenue: number }[];
  topProductCategory?: string;
  leadingSalesChannel?: string;
  onTimeDeliveryPercent?: number;
};

export const getSalesChangePercent = (metrics: BusinessMetrics | undefined) => {
  const history = metrics?.monthlySalesHistory;
  if (!history || history.length < 2) return null;
  const previous = history[history.length - 2].revenue;
  if (previous <= 0) return null;
  return ((history[history.length - 1].revenue - previous) / previous) * 100;
};

export const BusinessSalesOperations: React.FC<{
  metrics: BusinessMetrics | undefined;
  businessId: string;
  trendUnavailableMessage?: string;
}> = ({ metrics, businessId, trendUnavailableMessage }) => {
  const { theme } = useTheme();
  const salesHistory = metrics?.monthlySalesHistory;
  const salesChange = getSalesChangePercent(metrics);
  const hasSalesOperationsData = metrics?.monthlyRevenue != null
    || salesHistory != null
    || metrics?.onTimeDeliveryPercent != null
    || (metrics?.invoiceCount ?? 0) > 0;

  const isDark = theme === 'dark';
  const gridStroke = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(20, 24, 35, 0.08)';
  const tickColor = isDark ? '#8A8F98' : '#626772';
  const accentColor = isDark ? '#5E6AD2' : '#4F5BC7';
  const tooltipStyle = isDark
    ? {
        backgroundColor: '#0E1015',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 12,
        fontSize: 11,
        color: '#EDEDEF',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.55)',
      }
    : {
        backgroundColor: '#FFFFFF',
        border: '1px solid rgba(20, 24, 35, 0.12)',
        borderRadius: 12,
        fontSize: 11,
        color: '#17181C',
        boxShadow: '0 8px 24px rgba(20, 24, 35, 0.08)',
      };

  return (
    <section id="business-performance" aria-labelledby="business-performance-heading" className="mb-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 shadow-xs font-mono text-[var(--foreground)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="business-performance-heading" className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">Sales &amp; Dispatch Telemetry</h2>
          <p className="mt-1 text-xs text-[var(--foreground-muted)] font-sans">
            {hasSalesOperationsData
              ? 'Operational metrics and delivery performance trends for this entity.'
              : 'Sales and delivery measures will appear here when dated business information is available.'}
          </p>
        </div>
        <span className={`rounded-lg px-2.5 py-1 text-[10px] font-bold ${hasSalesOperationsData ? 'bg-[var(--success-soft)] border border-[var(--success)]/20 text-[var(--success)]' : 'bg-[var(--surface-inset)] text-[var(--foreground-muted)] border border-[var(--border)]'}`}>
          {hasSalesOperationsData ? 'Active Telemetry' : 'Data Needed'}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {[
          {
            label: 'Monthly sales',
            value: metrics?.monthlyRevenue == null ? 'Not available' : formatBDT(metrics.monthlyRevenue),
          },
          {
            label: 'Sales vs. last month',
            value: salesChange == null ? 'Not available' : `${salesChange >= 0 ? '+' : ''}${salesChange.toFixed(1)}%`,
            valueClassName: salesChange == null ? '' : salesChange >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]',
          },
          {
            label: 'Deliveries on time',
            value: metrics?.onTimeDeliveryPercent == null ? 'Not available' : `${metrics.onTimeDeliveryPercent}%`,
          },
          {
            label: 'Sample invoices',
            value: (metrics?.invoiceCount ?? 0) > 0 ? String(metrics?.invoiceCount) : 'Not available',
          },
        ].map((item) => (
          <div key={item.label} className="min-w-0 rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] p-3">
            <p className="text-[10px] uppercase font-bold text-[var(--foreground-muted)]">{item.label}</p>
            <p className={`mt-1.5 break-words text-[15px] font-bold tabular-nums text-[var(--foreground)] sm:text-[17px] ${item.valueClassName ?? ''}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
      {salesHistory?.length ? (
        <>
          <div className="mt-3 h-[230px] min-w-0 rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] p-3 sm:p-4">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-muted)]">Monthly Run-Rate Sales · BDT</p>
              {salesHistory.length > 1 && (
                <span className={`text-[10px] font-bold ${salesChange != null && salesChange < 0 ? 'text-[var(--danger)]' : 'text-[var(--success)]'}`}>
                  {salesChange == null
                    ? 'Change unavailable'
                    : `${salesChange >= 0 ? '+' : ''}${salesChange.toFixed(1)}% vs. previous month`}
                </span>
              )}
            </div>
            <div className="h-[182px] min-w-0" role="img" aria-label="Illustrative monthly sales trend">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart data={salesHistory} margin={{ top: 8, right: 8, bottom: 0, left: 2 }}>
                  <CartesianGrid stroke={gridStroke} strokeDasharray="3 5" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: tickColor, fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis
                    width={70}
                    tickFormatter={(value: number) => formatBDT(value)}
                    tick={{ fill: tickColor, fontSize: 9 }}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip
                    formatter={(value) => [formatBDT(Number(value)), 'Sales']}
                    labelFormatter={(label) => `${label} · verified`}
                    contentStyle={tooltipStyle}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Sales"
                    stroke={accentColor}
                    strokeWidth={2.5}
                    fill={accentColor}
                    fillOpacity={0.15}
                    activeDot={{ r: 5, strokeWidth: 2, fill: accentColor, stroke: isDark ? '#0A0A0C' : '#FFFFFF' }}
                    dot={{ r: 3, fill: accentColor, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { label: 'Top product category', value: metrics?.topProductCategory },
              { label: 'Leading sales channel', value: metrics?.leadingSalesChannel },
            ].map((item) => (
              <div key={item.label} className="min-w-0 rounded-lg border border-[var(--border)] bg-[var(--surface-inset)] px-3 py-2">
                <span className="text-[9px] uppercase font-bold text-[var(--foreground-muted)]">{item.label}: </span>
                <span className="break-words text-xs font-semibold text-[var(--foreground)]">{item.value ?? 'Not available'}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] p-3.5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-muted)]">Executive Action Signal</p>
                <p className="mt-1 text-xs leading-5 text-[var(--foreground)] font-sans">
                  {metrics?.overdueInvoiceCount
                    ? `${metrics.overdueInvoiceCount} past-due sample ${metrics.overdueInvoiceCount === 1 ? 'invoice' : 'invoices'}${metrics.overdueInvoiceTotal > 0 ? ` · ${formatBDT(metrics.overdueInvoiceTotal)}` : ''}. Check the listed items and confirm against your records.`
                    : metrics?.onTimeDeliveryPercent != null && metrics.onTimeDeliveryPercent < 85
                      ? `The sample on-time delivery rate is ${metrics.onTimeDeliveryPercent}%. Review the delivery records to understand what may need attention.`
                      : salesChange != null && salesChange <= -5
                        ? `Sample sales are down ${Math.abs(salesChange).toFixed(1)}% from the prior month. Review the underlying activity before drawing conclusions.`
                        : salesChange != null
                          ? `Sample sales ${salesChange >= 0 ? 'increased' : 'decreased'} ${Math.abs(salesChange).toFixed(1)}% from the prior month. Compare with dated activity to understand the change.`
                          : 'More dated sales and operating activity is needed to identify a useful trend.'}
                </p>
              </div>
              <Link
                href={getBusinessRoute(businessId, metrics?.overdueInvoiceCount ? 'invoicing' : 'business-performance')}
                className="accounting-focus inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold text-[var(--accent)] hover:bg-[var(--accent-bright)]/20 bg-[var(--accent-soft)] border border-[var(--accent)]/30 transition"
              >
                {metrics?.overdueInvoiceCount ? 'Review invoices' : 'Review details'} <ArrowRight size={12} />
              </Link>
            </div>
            <p className="mt-2 text-[9px] text-[var(--foreground-subtle)] font-sans">Signals use illustrative demo data; they are prompts for review, not verified findings.</p>
          </div>
        </>
      ) : (
        <p className="mt-4 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-inset)] p-4 text-xs leading-relaxed text-[var(--foreground-muted)] font-sans">
          {trendUnavailableMessage ?? 'A dated sales trend is not available for this business yet. The summary figures above are illustrative and should not be treated as a trend.'}
        </p>
      )}
    </section>
  );
};

export const initialBusinesses: BusinessProfile[] = [
  {
    id: 'unilever-distribution',
    name: 'M/S Popy Traders · FMCG Distribution',
    industry: 'FMCG distribution (Thin margin)',
    location: 'Sherpur & Bogura, Bangladesh',
    registrationId: 'DEMO-DIST-8894',
    status: 'Active',
    createdAt: '2021-06-01',
    customerCount: 5760, // 5,760 active retail stores
    employeeCount: 57, // 57 headcount reconciled with ৳5,62,000 payroll
    isSample: true,
  },
  {
    id: 'pureit-distribution',
    name: 'Pureit Distribution (Durables)',
    industry: 'Consumer durables & water purifiers',
    location: 'Bogura, Bangladesh',
    registrationId: 'DEMO-PUR-2048',
    status: 'Active',
    createdAt: '2023-03-12',
    customerCount: 320,
    employeeCount: 16,
    isSample: true,
  },
  {
    id: 'sherpur-trade-distribution',
    name: 'Sherpur Trade Distribution',
    industry: 'Packaged foods distribution (FMCG)',
    location: 'Sherpur, Bangladesh',
    registrationId: 'DEMO-SHP-1176',
    status: 'Active',
    createdAt: '2023-08-04',
    customerCount: 1420,
    employeeCount: 24,
    isSample: true,
  },
  {
    id: 'bogura-retail-distribution',
    name: 'Bogura Retail Distribution',
    industry: 'Household essentials (FMCG)',
    location: 'Bogura, Bangladesh',
    registrationId: 'DEMO-BOG-5531',
    status: 'Active',
    createdAt: '2022-11-18',
    customerCount: 980,
    employeeCount: 18,
    isSample: true,
  },
  {
    id: 'freshway-distribution',
    name: 'Freshway Consumer Distribution',
    industry: 'Food & beverage distribution (FMCG)',
    location: 'Mymensingh, Bangladesh',
    registrationId: 'DEMO-MYM-9034',
    status: 'Active',
    createdAt: '2025-01-09',
    customerCount: 1650,
    employeeCount: 28,
    isSample: true,
  },
];

export const initialRelationships: BusinessRelationship[] = [
  { id: 'demo-link-unilever-pureit', parentBusinessId: 'unilever-distribution', relatedBusinessId: 'pureit-distribution', linkedAt: '2023-03-12', profileReused: true, referenceEntryCount: 3, relationshipType: 'Product line' },
  { id: 'demo-link-unilever-sherpur', parentBusinessId: 'unilever-distribution', relatedBusinessId: 'sherpur-trade-distribution', linkedAt: '2023-08-04', profileReused: true, referenceEntryCount: 2, relationshipType: 'Local distributor' },
  { id: 'demo-link-pureit-bogura', parentBusinessId: 'pureit-distribution', relatedBusinessId: 'bogura-retail-distribution', linkedAt: '2022-11-18', profileReused: false, referenceEntryCount: 0, relationshipType: 'Retail partner' },
];

export const initialSampleRows = [
  { id: 'sherpur-invoice-demo', businessId: 'sherpur-trade-distribution', date: 'Today', description: 'Retailer invoice · Sherpur town', party: 'Rahman General Store', principal: 'Illustrative FMCG' as const, depot: 'Sherpur' as const, category: 'Trade receivable', method: 'Invoice', amount: 186000, status: 'Pending' as const, kind: 'Invoicing' as const, ageDays: 0 },
  { id: 'sherpur-expense-demo', businessId: 'sherpur-trade-distribution', date: 'Yesterday', description: 'Route fuel · Van 04', party: 'Sherpur Fuel Point', principal: 'Illustrative FMCG' as const, depot: 'Sherpur' as const, category: 'Fleet & delivery', method: 'Bank transfer', amount: -24500, status: 'Paid' as const, kind: 'Expenses' as const, ageDays: 1 },
  { id: 'pureit-invoice-demo', businessId: 'pureit-distribution', date: 'Today', description: 'Retailer order · Bogura route', party: 'Mitali Traders', principal: 'Pureit (Durables)' as const, depot: 'Bogura' as const, category: 'Trade receivable', method: 'Invoice', amount: 94000, status: 'Overdue' as const, kind: 'Invoicing' as const, ageDays: 34 },
  { id: 'pureit-expense-demo', businessId: 'pureit-distribution', date: 'Yesterday', description: 'Water purifier demo setup', party: 'Bogura Service Hub', principal: 'Pureit (Durables)' as const, depot: 'Bogura' as const, category: 'Trade marketing', method: 'Bank transfer', amount: -18200, status: 'Paid' as const, kind: 'Expenses' as const, ageDays: 1 },
  { id: 'sherpur-reference-1', businessId: 'sherpur-trade-distribution', date: 'Reference · 30 Sep', description: 'Template · retailer invoice', party: 'Sample source: M/S Popy Traders · FMCG Distribution', principal: 'Illustrative FMCG' as const, depot: 'Sherpur' as const, category: 'Reference template', method: 'Invoice', amount: 0, status: 'Paid' as const, kind: 'Invoicing' as const, ageDays: 0, referenceOnly: true, referenceSourceBusinessId: 'unilever-distribution' },
  { id: 'sherpur-reference-2', businessId: 'sherpur-trade-distribution', date: 'Reference · 30 Sep', description: 'Template · route settlement', party: 'Sample source: M/S Popy Traders · FMCG Distribution', principal: 'Illustrative FMCG' as const, depot: 'Sherpur' as const, category: 'Reference template', method: 'Cash', amount: 0, status: 'Paid' as const, kind: 'Expenses' as const, ageDays: 0, referenceOnly: true, referenceSourceBusinessId: 'unilever-distribution' },
  { id: 'pureit-reference-1', businessId: 'pureit-distribution', date: 'Reference · 30 Sep', description: 'Template · retailer invoice', party: 'Sample source: M/S Popy Traders · FMCG Distribution', principal: 'Pureit (Durables)' as const, depot: 'Bogura' as const, category: 'Reference template', method: 'Invoice', amount: 0, status: 'Paid' as const, kind: 'Invoicing' as const, ageDays: 0, referenceOnly: true, referenceSourceBusinessId: 'unilever-distribution' },
  { id: 'pureit-reference-2', businessId: 'pureit-distribution', date: 'Reference · 30 Sep', description: 'Template · trade marketing expense', party: 'Sample source: M/S Popy Traders · FMCG Distribution', principal: 'Pureit (Durables)' as const, depot: 'Bogura' as const, category: 'Reference template', method: 'Bank transfer', amount: 0, status: 'Paid' as const, kind: 'Expenses' as const, ageDays: 0, referenceOnly: true, referenceSourceBusinessId: 'unilever-distribution' },
];

export const initialBusinessMetrics: Record<string, Omit<BusinessMetrics, 'relatedCount'>> = {
  'unilever-distribution': {
    availableCash: 1695200, // Post-debit bank ৳8,00,000 + vault ৳8,95,200
    receivables: 19726027, // ৳1,97,26,027 (DSO 24)
    monthlyRevenue: 25000000, // ৳2,50,00,000
    monthlyNetProfit: 373375, // ৳3,73,375 (~1.49% thin margin)
    invoiceCount: 18720, // 720 invoices/day × 26 days
    expenseCount: 64,
    isIllustrative: true,
    customerCount: 5760,
    employeeCount: 57,
    overdueInvoiceCount: 7,
    overdueInvoiceTotal: 84000,
    monthlySalesHistory: [
      { month: 'Jul', revenue: 23500000 },
      { month: 'Aug', revenue: 24200000 },
      { month: 'Sep', revenue: 25000000 },
    ],
    topProductCategory: 'Home & personal care',
    leadingSalesChannel: 'General trade (Retail grocery)',
    onTimeDeliveryPercent: 38, // Chronic late dispatch rate
  },
  'pureit-distribution': {
    availableCash: 2100000,
    receivables: 3200000,
    monthlyRevenue: 8400000,
    monthlyNetProfit: 714000, // 8.5% margin (Consumer durables)
    invoiceCount: 241,
    expenseCount: 22,
    isIllustrative: true,
    customerCount: 320,
    employeeCount: 16,
    overdueInvoiceCount: 3,
    overdueInvoiceTotal: 126000,
    monthlySalesHistory: [
      { month: 'Jul', revenue: 7800000 },
      { month: 'Aug', revenue: 8100000 },
      { month: 'Sep', revenue: 8400000 },
    ],
    topProductCategory: 'Consumer durables & water purifiers',
    leadingSalesChannel: 'Dealer network & retail outlets',
    onTimeDeliveryPercent: 91,
  },
  'sherpur-trade-distribution': {
    availableCash: 1450000,
    receivables: 2100000,
    monthlyRevenue: 6200000,
    monthlyNetProfit: 111600, // 1.8% net margin (FMCG)
    invoiceCount: 2890,
    expenseCount: 34,
    isIllustrative: true,
    customerCount: 1420,
    employeeCount: 24,
    overdueInvoiceCount: 1,
    overdueInvoiceTotal: 42000,
    monthlySalesHistory: [
      { month: 'Jul', revenue: 5800000 },
      { month: 'Aug', revenue: 6050000 },
      { month: 'Sep', revenue: 6200000 },
    ],
    topProductCategory: 'Packaged foods (FMCG)',
    leadingSalesChannel: 'Direct grocery store delivery',
    onTimeDeliveryPercent: 86,
  },
  'bogura-retail-distribution': {
    availableCash: 980000,
    receivables: 1650000,
    monthlyRevenue: 5200000,
    monthlyNetProfit: 98800, // 1.9% net margin (FMCG)
    invoiceCount: 2140,
    expenseCount: 29,
    isIllustrative: true,
    customerCount: 980,
    employeeCount: 18,
    overdueInvoiceCount: 2,
    overdueInvoiceTotal: 38000,
    monthlySalesHistory: [
      { month: 'Jul', revenue: 5400000 },
      { month: 'Aug', revenue: 5300000 },
      { month: 'Sep', revenue: 5200000 },
    ],
    topProductCategory: 'Household essentials (FMCG)',
    leadingSalesChannel: 'Local grocery outlets',
    onTimeDeliveryPercent: 82,
  },
  'freshway-distribution': {
    availableCash: 1850000,
    receivables: 2450000,
    monthlyRevenue: 7100000,
    monthlyNetProfit: 127800, // 1.8% net margin (FMCG)
    invoiceCount: 3380,
    expenseCount: 38,
    isIllustrative: true,
    customerCount: 1650,
    employeeCount: 28,
    overdueInvoiceCount: 0,
    overdueInvoiceTotal: 0,
    monthlySalesHistory: [
      { month: 'Jul', revenue: 6600000 },
      { month: 'Aug', revenue: 6850000 },
      { month: 'Sep', revenue: 7100000 },
    ],
    topProductCategory: 'Food & beverage distribution',
    leadingSalesChannel: 'Regional retail stores',
    onTimeDeliveryPercent: 89,
  },
};

export type BusinessSetupOptions = {
  relationshipToBusinessId: string | null;
  reuseFromBusinessId: string | null;
  copyProfile: boolean;
  copyLedgerAsReference: boolean;
};

type BusinessPortfolioProps = {
  businesses: BusinessProfile[];
  relationships: BusinessRelationship[];
  metrics: Record<string, BusinessMetrics>;
  onSelectBusiness: (businessId: string) => void;
  onAddBusiness: () => void;
};

export const BusinessPortfolioOverview: React.FC<BusinessPortfolioProps> = ({
  businesses,
  relationships,
  metrics,
  onSelectBusiness,
  onAddBusiness,
}) => {
  const [selectedForCompare, setSelectedForCompare] = React.useState<string[]>(() =>
    businesses.slice(0, 2).map((b) => b.id)
  );
  const [showComparison, setShowComparison] = React.useState(false);
  const activeCount = businesses.filter((business) => business.status === 'Active').length;
  const totalCash = businesses.reduce((total, business) => total + (metrics[business.id]?.availableCash ?? 0), 0);
  const totalReceivables = businesses.reduce((total, business) => total + (metrics[business.id]?.receivables ?? 0), 0);
  const measuredRevenues = businesses.map((business) => metrics[business.id]?.monthlyRevenue)
    .filter((revenue): revenue is number => revenue !== null && revenue !== undefined);
  const totalMonthlyRevenue = measuredRevenues.reduce((total, revenue) => total + revenue, 0);
  const measuredProfits = businesses.map((business) => metrics[business.id]?.monthlyNetProfit)
    .filter((profit): profit is number => profit !== null && profit !== undefined);
  const totalMonthlyProfit = measuredProfits.reduce((total, profit) => total + profit, 0);
  const measuredCashCount = businesses.filter((business) => metrics[business.id]?.availableCash != null).length;
  const measuredReceivablesCount = businesses.filter((business) => metrics[business.id]?.receivables != null).length;
  const attentionBusinesses = businesses.map((business) => {
    const businessMetrics = metrics[business.id];
    const salesChange = getSalesChangePercent(businessMetrics);
    const reason = businessMetrics?.overdueInvoiceCount
      ? `${businessMetrics.overdueInvoiceCount} past-due sample invoice${businessMetrics.overdueInvoiceCount === 1 ? '' : 's'}`
      : businessMetrics?.onTimeDeliveryPercent != null && businessMetrics.onTimeDeliveryPercent < 85
        ? `Delivery on time is ${businessMetrics.onTimeDeliveryPercent}%`
        : salesChange != null && salesChange <= -5
          ? `Monthly sales down ${Math.abs(salesChange).toFixed(1)}%`
          : null;
    return { business, businessMetrics, salesChange, reason };
  }).filter((item) => item.reason);
  const growingBusinesses = businesses.map((business) => ({
    business,
    salesChange: getSalesChangePercent(metrics[business.id]),
  })).filter((item) => item.salesChange != null && item.salesChange >= 5)
    .sort((left, right) => (right.salesChange ?? 0) - (left.salesChange ?? 0));
  const leadingBusiness = businesses
    .filter((business) => metrics[business.id]?.monthlyRevenue != null)
    .sort((left, right) => (metrics[right.id]?.monthlyRevenue ?? 0) - (metrics[left.id]?.monthlyRevenue ?? 0))[0];
  const comparisonBusinesses = businesses.filter((business) => selectedForCompare.includes(business.id));
  const toggleCompare = (businessId: string) => {
    setSelectedForCompare((previous) => {
      const isSelected = previous.includes(businessId);
      const next = isSelected
        ? previous.filter((id) => id !== businessId)
        : previous.length < 4 ? [...previous, businessId] : previous;
      if (next.length >= 2) {
        setShowComparison(true);
      }
      return next;
    });
  };
  const handleCompareClick = () => {
    if (showComparison) {
      setShowComparison(false);
    } else {
      if (selectedForCompare.length < 2) {
        setSelectedForCompare(businesses.slice(0, 2).map((b) => b.id));
      }
      setShowComparison(true);
      window.setTimeout(() => {
        document.getElementById('comparison-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };
  return (
    <div className="pb-12 text-[var(--foreground)]">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-mono text-[var(--foreground-muted)]">
            <span>Workspace</span><ArrowRight size={12} /><span className="text-[var(--accent)] font-semibold">Business Portfolio</span>
            <span className="ml-1 inline-flex items-center gap-1 rounded bg-[var(--accent-soft)] border border-[var(--accent)]/20 px-2 py-0.5 text-[10px] font-mono font-bold text-[var(--accent)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" /> Multi-Entity Mesh
            </span>
          </div>
          <h1 className="text-[25px] font-bold tracking-tight text-[var(--foreground)] font-mono sm:text-[29px]">Distribution Business Portfolio</h1>
          <p className="mt-1 max-w-3xl text-[13px] leading-relaxed text-[var(--foreground-muted)]">Cross-entity operational health, liquidity comparison, and entity-isolated command boards.</p>
        </div>
        <button
          onClick={onAddBusiness}
          className="accounting-focus inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-bright)] px-4 text-[12px] font-bold text-white shadow-xs transition font-mono active:scale-[0.98]"
        >
          <Plus size={16} /> Add a business
        </button>
      </div>

      <section aria-label="Business summary" className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-5 font-mono">
        {[
          { label: 'Operating Entities', value: businesses.length.toLocaleString('en-BD'), detail: `${activeCount} active · ${businesses.length - activeCount} setting up`, icon: Building2 },
          { label: 'Monthly Turnover', value: measuredRevenues.length ? formatBDT(totalMonthlyRevenue) : 'Not available', detail: `Sample total · ${measuredRevenues.length} of ${businesses.length} businesses`, icon: Activity },
          { label: 'Liquid Cash', value: measuredCashCount ? formatBDT(totalCash) : 'Not available', detail: `${measuredCashCount === businesses.length ? 'Combined total' : 'Partial total'} · ${measuredCashCount} of ${businesses.length} businesses`, icon: Wallet },
          { label: 'Market Receivables', value: measuredReceivablesCount ? formatBDT(totalReceivables) : 'Not available', detail: `${measuredReceivablesCount === businesses.length ? 'Combined total' : 'Partial total'} · ${measuredReceivablesCount} of ${businesses.length} businesses`, icon: CircleDollarSign },
          { label: 'Monthly Net Profit', value: measuredProfits.length ? formatBDT(totalMonthlyProfit) : 'Not available', detail: 'Illustrative business-level total', icon: Check },
        ].map(({ label, value, detail, icon: Icon }) => (
          <article key={label} className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 sm:p-5 shadow-xs">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold text-[var(--foreground-muted)] tracking-wider">{label}</p>
                <p className="mt-2 text-[16px] font-bold text-[var(--foreground)] tabular-nums sm:text-[22px]">{value}</p>
                <p className="mt-1 truncate text-[10px] text-[var(--foreground-subtle)] font-sans">{detail}</p>
              </div>
              <span className="rounded-lg bg-[var(--accent-soft)] border border-[var(--accent)]/20 p-2 text-[var(--accent)]"><Icon size={16} /></span>
            </div>
          </article>
        ))}
      </section>

      <section aria-labelledby="decision-snapshot-heading" className="mb-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 shadow-xs font-mono">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 id="decision-snapshot-heading" className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">Portfolio Decision Snapshot</h2>
            <p className="mt-1 text-xs text-[var(--foreground-muted)] font-sans">Priority review signals across entities based on liquidity and settlement health.</p>
          </div>
          <span className="rounded bg-[var(--warning-soft)] border border-[var(--warning)]/20 px-2.5 py-1 text-[10px] font-bold text-[var(--warning)]">Audit Signal</span>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          <div className={`rounded-xl border p-3.5 ${attentionBusinesses.length ? 'border-[var(--warning)]/30 bg-[var(--warning-soft)]' : 'border-[var(--border)] bg-[var(--surface-inset)]'}`}>
            <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--warning)]">Needs Immediate Review</p>
            {attentionBusinesses.length ? (
              <div className="mt-2 space-y-2">
                {attentionBusinesses.slice(0, 2).map(({ business, reason }) => (
                  <button key={business.id} onClick={() => onSelectBusiness(business.id)} className="accounting-focus block w-full rounded-lg p-2 text-left hover:bg-[var(--surface-elevated)] bg-[var(--surface-elevated)]/80 transition border border-[var(--warning)]/30 shadow-2xs">
                    <span className="block text-xs font-bold text-[var(--foreground)]">{business.name}</span>
                    <span className="mt-0.5 block text-[10px] text-[var(--warning)] font-sans">{reason} · Open Control Board &rarr;</span>
                  </button>
                ))}
              </div>
            ) : <p className="mt-2 text-xs text-[var(--foreground-muted)]">No review signals in the available sample.</p>}
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] p-3.5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--success)]">Highest Run-Rate Growth</p>
            {growingBusinesses[0] ? (
              <button onClick={() => onSelectBusiness(growingBusinesses[0].business.id)} className="accounting-focus mt-2 block rounded-lg p-2 text-left hover:bg-[var(--surface-elevated)] bg-[var(--surface-elevated)]/80 transition border border-[var(--border)] shadow-2xs w-full">
                <span className="block text-xs font-bold text-[var(--foreground)]">{growingBusinesses[0].business.name}</span>
                <span className="mt-0.5 block text-[10px] text-[var(--success)] font-sans">Sales up {growingBusinesses[0].salesChange?.toFixed(1)}% vs. last month &rarr;</span>
              </button>
            ) : <p className="mt-2 text-xs text-[var(--foreground-muted)]">No comparable monthly sales history.</p>}
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] p-3.5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--foreground-muted)]">Largest by Volume</p>
            {leadingBusiness ? (
              <button onClick={() => onSelectBusiness(leadingBusiness.id)} className="accounting-focus mt-2 block rounded-lg p-2 text-left hover:bg-[var(--surface-elevated)] bg-[var(--surface-elevated)]/80 transition border border-[var(--border)] shadow-2xs w-full">
                <span className="block text-xs font-bold text-[var(--foreground)]">{leadingBusiness.name}</span>
                <span className="mt-0.5 block text-[10px] text-[var(--foreground-muted)] font-sans">{formatBDT(metrics[leadingBusiness.id]?.monthlyRevenue ?? 0)} monthly &rarr;</span>
              </button>
            ) : <p className="mt-2 text-xs text-[var(--foreground-muted)]">Monthly sales are not available.</p>}
          </div>
        </div>
      </section>

      {/* Cross-Entity Operational Command Matrix (All 5 Businesses + Consolidated Empire Total) */}
      <CrossEntityCommandMatrix
        onSelectBusiness={onSelectBusiness}
        className="mb-6"
      />

      <section aria-labelledby="businesses-heading" className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] overflow-hidden font-mono shadow-xs">
        <div className="flex flex-col justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface-inset)]/50 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 id="businesses-heading" className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">Enterprise Business Entities</h2>
            <p className="mt-1 text-xs text-[var(--foreground-muted)] font-sans">Strict legal entity separation. Ledgers, bank accounts, and debts remain isolated.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-[var(--surface)] border border-[var(--border)] px-2.5 py-1 text-[10px] font-bold text-[var(--foreground-muted)]">{businesses.length} {businesses.length === 1 ? 'business' : 'businesses'}</span>
            <button
              onClick={handleCompareClick}
              title="Benchmark businesses side-by-side"
              className={`accounting-focus inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-[11px] font-mono font-bold transition shadow-2xs ${
                showComparison
                  ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
                  : 'border-[var(--border)] bg-[var(--surface)] text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]'
              }`}
            >
              <ArrowRight size={13} /> {showComparison ? 'Hide comparison' : selectedForCompare.length >= 2 ? `Compare (${selectedForCompare.length})` : 'Compare (2)'}
            </button>
          </div>
        </div>
        {!showComparison && (
          <p className="border-b border-[var(--border)] bg-[var(--surface-inset)]/30 px-5 py-2 text-[10px] text-[var(--foreground-muted)] font-sans">
            Tip: Select 2 to 4 businesses to benchmark financial and operational telemetry side-by-side. Click <strong className="text-[var(--accent)]">Compare</strong> to view the matrix.
          </p>
        )}

        <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
          {businesses.map((business) => {
            const businessMetrics = metrics[business.id];
            const customerCount = businessMetrics?.customerCount ?? business.customerCount;
            const employeeCount = businessMetrics?.employeeCount ?? business.employeeCount;
            const salesChange = getSalesChangePercent(businessMetrics);
            const attention = !businessMetrics?.isIllustrative
              ? 'More data needed'
              : businessMetrics?.overdueInvoiceCount
              ? 'Past-due invoice'
              : businessMetrics?.onTimeDeliveryPercent != null && businessMetrics.onTimeDeliveryPercent < 85
                ? 'Delivery below target'
                : salesChange != null && salesChange <= -5
                  ? 'Sales declining'
                  : 'Normal';
            return (
              <article key={business.id} className="group flex min-w-0 flex-col rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 transition hover:border-[var(--border-hover)] hover:shadow-md sm:p-5 shadow-xs">
                <div className="flex items-start gap-3">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${(businessMetrics?.availableCash ?? 0) > 0 ? 'bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/20' : 'bg-[var(--surface-inset)] text-[var(--foreground-muted)] border border-[var(--border)]'}`}>
                    <Building2 size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 min-h-10 text-sm font-bold text-[var(--foreground)]">{business.name}</h3>
                    <p className="mt-0.5 line-clamp-1 text-xs text-[var(--foreground-muted)] font-sans">{business.industry}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span className={`rounded px-2 py-0.5 text-[9px] font-bold ${business.status === 'Active' ? 'bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success)]/20' : 'bg-[var(--warning-soft)] text-[var(--warning)] border border-[var(--warning)]/20'}`}>{business.status}</span>
                      {business.isSample && <span className="rounded bg-[var(--surface-inset)] px-2 py-0.5 text-[9px] font-bold text-[var(--foreground-muted)] border border-[var(--border)]">Demo telemetry</span>}
                    </div>
                  </div>
                  <label
                    className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[10px] font-mono font-medium transition cursor-pointer select-none ${
                      selectedForCompare.includes(business.id)
                        ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] shadow-2xs'
                        : 'border-[var(--border)] bg-[var(--surface-inset)] text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]'
                    }`}
                    title="Select up to 4 businesses to compare"
                  >
                    <input
                      type="checkbox"
                      aria-label={`Compare ${business.name}`}
                      checked={selectedForCompare.includes(business.id)}
                      onChange={() => toggleCompare(business.id)}
                      className="h-3.5 w-3.5 accent-[var(--accent)] cursor-pointer"
                    />
                    <span>{selectedForCompare.includes(business.id) ? 'Comparing' : 'Compare'}</span>
                  </label>
                </div>
                <p className="mt-3 flex min-w-0 items-center gap-1.5 text-xs text-[var(--foreground-muted)] font-sans"><MapPin size={13} className="shrink-0 text-[var(--foreground-subtle)]" /><span className="truncate">{business.location}</span></p>

                <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 rounded-lg bg-[var(--surface-inset)] p-3 border border-[var(--border)]">
                  <div>
                    <p className="text-[9px] text-[var(--foreground-muted)] uppercase">Monthly sales</p>
                    <p className="mt-1 text-xs font-bold tabular-nums text-[var(--foreground)]">{businessMetrics?.monthlyRevenue == null ? 'Not available' : formatBDT(businessMetrics.monthlyRevenue)}</p>
                    <p className={`mt-0.5 text-[9px] font-medium ${salesChange == null ? 'text-[var(--foreground-subtle)]' : salesChange >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                      {salesChange == null ? 'No monthly trend' : `${salesChange >= 0 ? '+' : ''}${salesChange.toFixed(1)}% vs. last mo`}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-[var(--foreground-muted)] uppercase">Cash available</p>
                    <p className="mt-1 text-xs font-bold tabular-nums text-[var(--foreground)]">{businessMetrics?.availableCash == null ? 'Not available' : formatBDT(businessMetrics.availableCash)}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-[var(--foreground-muted)] uppercase">Receivables due</p>
                    <p className="mt-1 text-xs font-bold tabular-nums text-[var(--warning)]">{businessMetrics?.receivables == null ? 'Not available' : formatBDT(businessMetrics.receivables)}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-[var(--foreground-muted)] uppercase">Monthly profit</p>
                    <p className="mt-1 text-xs font-bold tabular-nums text-[var(--success)]">{businessMetrics?.monthlyNetProfit == null ? 'Not available' : formatBDT(businessMetrics.monthlyNetProfit)}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[10px]">
                  <span className={`rounded px-2 py-0.5 font-bold ${attention === 'Normal' ? 'bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success)]/20' : attention === 'More data needed' ? 'bg-[var(--surface-inset)] text-[var(--foreground-muted)] border border-[var(--border)]' : 'bg-[var(--warning-soft)] text-[var(--warning)] border border-[var(--warning)]/20'}`}>
                    {attention}
                  </span>
                  {businessMetrics?.onTimeDeliveryPercent != null && <span className="text-[var(--foreground-muted)]">{businessMetrics.onTimeDeliveryPercent}% on-time drops</span>}
                </div>
                <p className="mt-3 flex items-center gap-1.5 text-[10px] text-[var(--foreground-muted)] font-sans"><Users size={12} className="shrink-0 text-[var(--foreground-subtle)]" />{customerCount == null ? 'Customers not added' : `${customerCount.toLocaleString('en-BD')} retail accounts`} <span className="text-[var(--border)]">·</span> {employeeCount == null ? 'Team not added' : `${employeeCount} staff`}</p>

                <div className="mt-auto border-t border-[var(--border)] pt-3">
                  <button onClick={() => onSelectBusiness(business.id)} className="accounting-focus inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-[var(--accent-soft)] border border-[var(--accent)]/30 text-[11px] font-bold text-[var(--accent)] transition hover:bg-[var(--accent)] hover:text-white">
                    Open Control Board <ArrowRight size={13} className="transition group-hover:translate-x-0.5" />
                  </button>
                </div>
              </article>
            );
          })}

          <button onClick={onAddBusiness} className="accounting-focus flex min-h-[206px] flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-inset)]/30 p-5 text-center transition hover:border-[var(--accent)]/50 hover:bg-[var(--accent-soft)]">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-soft)] border border-[var(--accent)]/20 text-[var(--accent)] shadow-2xs"><CirclePlus size={20} /></span>
            <span className="mt-3 text-xs font-bold text-[var(--foreground)]">Add another business</span>
            <span className="mt-1 text-[10px] text-[var(--foreground-muted)] font-sans">Keep its business records and ledger separate</span>
          </button>
        </div>
      </section>

      {showComparison && comparisonBusinesses.length >= 2 && (
        <section id="comparison-section" aria-labelledby="comparison-heading" className="mt-4 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] shadow-xs font-mono scroll-mt-24">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface-inset)]/50 p-5">
            <div>
              <h2 id="comparison-heading" className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">Business Comparison Matrix</h2>
              <p className="mt-1 text-xs text-[var(--foreground-muted)] font-sans">Side-by-side entity benchmarking using verified isolated business records.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {comparisonBusinesses.map((business) => (
                <span key={business.id} className="inline-flex items-center gap-1.5 rounded bg-[var(--accent-soft)] border border-[var(--accent)]/20 px-2.5 py-1 text-[11px] font-mono text-[var(--accent)]">
                  {business.name}
                  <button
                    onClick={() => toggleCompare(business.id)}
                    className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] ml-0.5 text-xs font-bold"
                    title={`Remove ${business.name} from comparison`}
                  >
                    ×
                  </button>
                </span>
              ))}
              <button
                onClick={() => setShowComparison(false)}
                className="rounded border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] px-2.5 py-1 text-[11px] font-mono text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition ml-2 shadow-2xs"
              >
                Hide ×
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-xs">
              <thead className="bg-[var(--surface-inset)] text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-muted)] border-b border-[var(--border)]">
                <tr>
                  <th className="px-5 py-3">Metric</th>
                  {comparisonBusinesses.map((business) => <th key={business.id} className="min-w-40 px-4 py-3 text-[var(--foreground)] font-bold">{business.name}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {[
                  { label: 'Available cash', value: (id: string) => metrics[id]?.availableCash == null ? 'Not available' : formatBDT(metrics[id].availableCash) },
                  { label: 'Customer invoices due', value: (id: string) => metrics[id]?.receivables == null ? 'Not available' : formatBDT(metrics[id].receivables) },
                  { label: 'Monthly revenue', value: (id: string) => metrics[id]?.monthlyRevenue === null || metrics[id]?.monthlyRevenue === undefined ? 'Not available' : formatBDT(metrics[id].monthlyRevenue) },
                  { label: 'Monthly net profit', value: (id: string) => metrics[id]?.monthlyNetProfit === null || metrics[id]?.monthlyNetProfit === undefined ? 'Not available' : formatBDT(metrics[id].monthlyNetProfit) },
                  { label: 'Profit margin', value: (id: string) => {
                    const revenue = metrics[id]?.monthlyRevenue;
                    const profit = metrics[id]?.monthlyNetProfit;
                    return revenue == null || profit == null || revenue <= 0 ? 'Not available' : `${((profit / revenue) * 100).toFixed(1)}%`;
                  } },
                  { label: 'Sales change vs. last month', value: (id: string) => {
                    const change = getSalesChangePercent(metrics[id]);
                    return change == null ? 'Not available' : `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
                  } },
                  { label: 'Past-due sample invoices', value: (id: string) => metrics[id] ? `${metrics[id].overdueInvoiceCount} · ${formatBDT(metrics[id].overdueInvoiceTotal)}` : 'Not available' },
                  { label: 'On-time deliveries', value: (id: string) => metrics[id]?.onTimeDeliveryPercent == null ? 'Not available' : `${metrics[id].onTimeDeliveryPercent}%` },
                  { label: 'Leading product / channel', value: (id: string) => metrics[id]?.topProductCategory || metrics[id]?.leadingSalesChannel ? `${metrics[id]?.topProductCategory ?? '—'} / ${metrics[id]?.leadingSalesChannel ?? '—'}` : 'Not available' },
                  { label: 'Customers · employees', value: (id: string) => {
                    const customerCount = metrics[id]?.customerCount;
                    const employeeCount = metrics[id]?.employeeCount;
                    return `${customerCount == null ? 'Not available' : customerCount.toLocaleString('en-BD')} · ${employeeCount == null ? 'Not available' : employeeCount}`;
                  } },
                  { label: 'Connected businesses', value: (id: string) => String(metrics[id]?.relatedCount ?? 0) },
                  { label: 'Demo invoices · expenses', value: (id: string) => `${metrics[id]?.invoiceCount ?? 0} · ${metrics[id]?.expenseCount ?? 0}` },
                ].map((row) => (
                  <tr key={row.label} className="hover:bg-[var(--surface-hover)] transition">
                    <th scope="row" className="whitespace-nowrap px-5 py-3 font-medium text-[var(--foreground-muted)]">{row.label}</th>
                    {comparisonBusinesses.map((business) => <td key={business.id} className="px-4 py-3 font-bold tabular-nums text-[var(--foreground)]">{row.value(business.id)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <p className="mt-4 text-[10px] leading-relaxed text-[var(--foreground-muted)] font-sans">
        Illustrative sample only—not verified financials or official Unilever/Pureit distributor relationships. Portfolio figures sum business-owned data; shared reference rows are labeled and excluded. Changes are local to this demo session.
      </p>
    </div>
  );
};

type NewBusinessWorkspaceProps = {
  business: BusinessProfile;
  businesses: BusinessProfile[];
  relationships: BusinessRelationship[];
  metrics: Record<string, BusinessMetrics>;
  invoiceCount: number;
  expenseCount: number;
  openInvoiceTotal: number;
  entries: { id: string; date: string; description: string; kind: string; amount: number; status: string; referenceOnly: boolean; referenceSourceName?: string }[];
  transactionFilter: 'All' | 'Invoicing' | 'Expenses';
  onBackToPortfolio: () => void;
  onOpenBusiness: (businessId: string) => void;
  onAddRelatedBusiness: (businessId: string) => void;
  onLinkBusiness: (businessId: string) => void;
  onCreateInvoice: () => void;
  onAddExpense: () => void;
};

export const NewBusinessWorkspace: React.FC<NewBusinessWorkspaceProps> = ({
  business,
  businesses,
  relationships,
  metrics,
  invoiceCount,
  expenseCount,
  openInvoiceTotal,
  entries,
  transactionFilter,
  onBackToPortfolio,
  onOpenBusiness,
  onAddRelatedBusiness,
  onLinkBusiness,
  onCreateInvoice,
  onAddExpense,
}) => {
  const links = relationships.filter((relationship) =>
    relationship.parentBusinessId === business.id || relationship.relatedBusinessId === business.id,
  );
  const relatedBusinesses = links.map((relationship) => {
    const relatedId = relationship.parentBusinessId === business.id
      ? relationship.relatedBusinessId
      : relationship.parentBusinessId;
    return { business: businesses.find((candidate) => candidate.id === relatedId), relationship };
  }).filter((entry): entry is { business: BusinessProfile; relationship: BusinessRelationship } => Boolean(entry.business));
  const referenceCount = entries.filter((entry) => entry.referenceOnly).length;
  const businessMetrics = metrics[business.id];
  const outstandingInvoices = entries.filter((entry) =>
    !entry.referenceOnly && entry.kind === 'Invoicing' && entry.status !== 'Paid',
  );
  const [assistantQuestion, setAssistantQuestion] = React.useState('');
  const [assistantResponse, setAssistantResponse] = React.useState('');
  const visibleEntries = entries.filter((entry) =>
    transactionFilter === 'All'
    || (transactionFilter === 'Invoicing' && entry.kind === 'Invoicing')
    || (transactionFilter === 'Expenses' && entry.kind === 'Expenses'),
  );
  const answerBusinessQuestion = (question: string) => {
    const normalized = question.trim().toLowerCase();
    if (!normalized) return;
    if (/cash|balance/.test(normalized)) {
      setAssistantResponse(businessMetrics?.availableCash == null
        ? `Cash information is not available for ${business.name} in this sample.`
        : `The sample snapshot shows ${formatBDT(businessMetrics.availableCash)} available cash for ${business.name}.`);
    } else if (/sales|revenue/.test(normalized)) {
      setAssistantResponse(businessMetrics?.monthlyRevenue == null
        ? 'Monthly sales are not available for this business in the current sample.'
        : `The sample snapshot shows ${formatBDT(businessMetrics.monthlyRevenue)} in monthly sales for ${business.name}.`);
    } else if (/profit/.test(normalized)) {
      setAssistantResponse(businessMetrics?.monthlyNetProfit == null
        ? 'Monthly profit is not available for this business in the current sample.'
        : `The sample snapshot shows ${formatBDT(businessMetrics.monthlyNetProfit)} in monthly profit for ${business.name}.`);
    } else if (/invoice|owed|due|overdue/.test(normalized)) {
      setAssistantResponse(businessMetrics?.receivables == null && outstandingInvoices.length === 0
        ? `Invoice balance information is not available for ${business.name} in this sample.`
        : `There ${outstandingInvoices.length === 1 ? 'is' : 'are'} ${outstandingInvoices.length} unpaid sample invoice${outstandingInvoices.length === 1 ? '' : 's'} in this business. The summary balance is ${formatBDT(businessMetrics?.receivables ?? openInvoiceTotal)}.`);
    } else {
      setAssistantResponse('Try asking about cash, monthly sales, profit, or unpaid invoices. Answers are limited to this business’s sample information.');
    }
  };
  const submitBusinessQuestion = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    answerBusinessQuestion(assistantQuestion);
  };

  return (
  <div className="pb-12 text-[var(--foreground)]">
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3 font-mono">
      <div>
        <div className="mb-2 flex items-center gap-2 text-[11px] text-[var(--foreground-muted)]">
          <button onClick={onBackToPortfolio} className="accounting-focus rounded text-[var(--accent)] hover:underline">Business Portfolio</button>
          <ArrowRight size={12} /><span className="text-[var(--foreground)] font-semibold">{business.name}</span>
        </div>
        <h1 className="text-[25px] font-bold tracking-tight text-[var(--foreground)] sm:text-[29px]">{business.name}</h1>
        <p className="mt-1 text-xs text-[var(--foreground-muted)] font-sans">{business.industry} · {business.location}</p>
      </div>
      <button onClick={onBackToPortfolio} className="accounting-focus inline-flex h-9 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-3.5 text-xs font-bold text-[var(--foreground)] hover:bg-[var(--surface-hover)] shadow-2xs">
        <Building2 size={14} /> All Businesses
      </button>
    </div>

    <section aria-label="Business financial metrics" className="mb-4 grid grid-cols-2 gap-3 xl:grid-cols-4 font-mono">
      {[
        { label: 'Available cash', value: businessMetrics?.availableCash == null ? 'Not available' : formatBDT(businessMetrics.availableCash) },
        { label: 'Monthly sales', value: businessMetrics?.monthlyRevenue == null ? 'Not available' : formatBDT(businessMetrics.monthlyRevenue) },
        { label: 'Customer invoices due', value: businessMetrics?.receivables == null ? (openInvoiceTotal > 0 ? formatBDT(openInvoiceTotal) : 'Not available') : formatBDT(businessMetrics.receivables) },
        { label: 'Monthly profit', value: businessMetrics?.monthlyNetProfit == null ? 'Not available' : formatBDT(businessMetrics.monthlyNetProfit) },
      ].map((metric) => (
        <article key={metric.label} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 sm:p-5 shadow-xs">
          <p className="text-[10px] uppercase font-bold text-[var(--foreground-muted)] tracking-wider">{metric.label}</p>
          <p className="mt-2 break-words text-[19px] font-bold text-[var(--foreground)] tabular-nums sm:text-[23px]">{metric.value}</p>
          <p className="mt-1 text-[10px] text-[var(--foreground-subtle)] font-sans">Verified records · BDT</p>
        </article>
      ))}
    </section>

    <section id="reports" aria-labelledby="business-cashflow-heading" className="mb-4 scroll-mt-24 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 shadow-xs font-mono">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="business-cashflow-heading" className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">Cash Flow Runway</h2>
          <p className="mt-1 text-xs text-[var(--foreground-muted)] font-sans">Available liquidity, monthly run-rate sales, and customer credit exposure.</p>
        </div>
        <span className="rounded bg-[var(--success-soft)] border border-[var(--success)]/20 px-2.5 py-1 text-[10px] font-bold text-[var(--success)]">Sample Snapshot</span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Cash available now', value: businessMetrics?.availableCash == null ? 'Not available' : formatBDT(businessMetrics.availableCash) },
          { label: 'Monthly sales', value: businessMetrics?.monthlyRevenue == null ? 'Not available' : formatBDT(businessMetrics.monthlyRevenue) },
          { label: 'Customer invoices due', value: businessMetrics?.receivables == null ? (openInvoiceTotal > 0 ? formatBDT(openInvoiceTotal) : 'Not available') : formatBDT(businessMetrics.receivables) },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] p-3.5">
            <p className="text-[10px] uppercase font-bold text-[var(--foreground-muted)]">{item.label}</p>
            <p className="mt-1 text-[16px] font-bold tabular-nums text-[var(--foreground)]">{item.value}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[10px] leading-relaxed text-[var(--foreground-muted)] font-sans">
        This business has summary figures, but no dated income and expense history. A full cash-flow trend chart is not available yet.
      </p>
    </section>

    <BusinessSalesOperations metrics={businessMetrics} businessId={business.id} />

    <section id="bank-reconciliation" aria-labelledby="business-attention-heading" className="mb-4 scroll-mt-24 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 shadow-xs font-mono">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="business-attention-heading" className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">Receivables &amp; Due Tasks</h2>
          <p className="mt-1 text-xs text-[var(--foreground-muted)] font-sans">Unpaid retailer invoices listed for this business.</p>
        </div>
        <span className="rounded bg-[var(--warning-soft)] border border-[var(--warning)]/20 px-2.5 py-1 text-[10px] font-bold text-[var(--warning)]">{outstandingInvoices.length} unpaid</span>
      </div>
      {outstandingInvoices.length ? (
        <div className="mt-3 divide-y divide-[var(--border)]">
          {outstandingInvoices.map((entry) => (
            <div key={entry.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="text-xs font-bold text-[var(--foreground)]">{entry.description}</p>
                <p className="mt-1 text-[10px] text-[var(--foreground-muted)] font-sans">{entry.date} · {entry.status === 'Overdue' ? 'Past due' : 'Awaiting payment'}</p>
              </div>
              <span className={`text-xs font-bold tabular-nums ${entry.status === 'Overdue' ? 'text-[var(--danger)]' : 'text-[var(--warning)]'}`}>
                {formatBDT(entry.amount)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-inset)] p-4 text-xs text-[var(--foreground-muted)] font-sans">
          No unpaid invoices are listed in this sample.
        </p>
      )}
      <p className="mt-2 text-[10px] text-[var(--foreground-subtle)] font-sans">Other operational alerts are not included in this business’s sample data.</p>
    </section>

    <section id="ai-assistant" aria-labelledby="business-assistant-heading" className="mb-4 scroll-mt-24 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 shadow-xs font-mono">
      <div>
        <h2 id="business-assistant-heading" className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">Ask Business Telemetry</h2>
        <p className="mt-1 text-xs text-[var(--foreground-muted)] font-sans">Get an instant calculation based on this entity&apos;s verified figures.</p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {['How much cash is available?', 'What were monthly sales?', 'How much profit was made?', 'Are any invoices unpaid?'].map((question) => (
          <button
            key={question}
            onClick={() => { setAssistantQuestion(question); answerBusinessQuestion(question); }}
            className="accounting-focus rounded-lg border border-[var(--border)] bg-[var(--surface-inset)] px-3 py-2 text-left text-xs text-[var(--foreground)] transition hover:border-[var(--accent)]/50 hover:bg-[var(--surface-hover)]"
          >
            {question}
          </button>
        ))}
      </div>
      <form onSubmit={submitBusinessQuestion} className="mt-3 flex gap-2">
        <input
          value={assistantQuestion}
          onChange={(event) => setAssistantQuestion(event.target.value)}
          aria-label="Ask about this business"
          placeholder="Ask about cash, sales, profit, or invoices"
          className="accounting-focus h-10 min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] px-3 text-xs text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] font-sans focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
        />
        <button type="submit" className="accounting-focus rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-bright)] px-4 text-xs font-bold text-white transition active:scale-[0.98]">Ask</button>
      </form>
      {assistantResponse && (
        <p aria-live="polite" className="mt-3 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-soft)] p-3 text-xs leading-relaxed text-[var(--foreground)] font-sans">
          {assistantResponse}
        </p>
      )}
    </section>

    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 sm:p-6 shadow-xs font-mono">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] border border-[var(--accent)]/20 text-[var(--accent)]"><Building2 size={21} /></span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">Entity Configuration</h2>
            <span className={`rounded px-2.5 py-0.5 text-[10px] font-bold ${business.status === 'Active' ? 'bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success)]/20' : 'bg-[var(--warning-soft)] text-[var(--warning)] border border-[var(--warning)]/20'}`}>
              {business.isSample ? 'DEMO ENTITY' : business.status === 'Active' ? 'ACTIVE WORKSPACE' : 'SETUP IN PROGRESS'}
            </span>
          </div>
          <p className="mt-1 text-xs text-[var(--foreground-muted)] font-sans">
            This workspace maintains strict legal separation from the connected entities below.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {[
              { label: 'Business type', value: business.industry },
              { label: 'Location', value: business.location },
              { label: 'Customers', value: business.customerCount == null ? 'Not added' : business.customerCount.toLocaleString('en-BD') },
              { label: 'Employees', value: business.employeeCount == null ? 'Not added' : business.employeeCount.toLocaleString('en-BD') },
              { label: 'Registration / tax ID', value: business.registrationId || 'Not provided' },
              { label: 'Workspace created', value: business.createdAt },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] p-3">
                <p className="text-[9px] font-bold uppercase tracking-wide text-[var(--foreground-muted)]">{item.label}</p>
                <p className="mt-1.5 break-words text-xs font-semibold text-[var(--foreground)]">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div id="related-businesses" className="mt-5 scroll-mt-24 rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <GitBranch size={15} className="text-[var(--accent)]" />
              <h3 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">Connected Entities</h3>
            </div>
            <span className="rounded bg-[var(--surface)] border border-[var(--border)] px-2 py-0.5 text-[10px] font-bold text-[var(--foreground-muted)]">{relatedBusinesses.length} linked</span>
          </div>
          <p className="mt-1 text-xs text-[var(--foreground-muted)] font-sans">Affiliated entities connected to {business.name}. Each keeps its own isolated ledger and cash balance.</p>
          {relatedBusinesses.length === 0 && <p className="mt-3 rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface-elevated)] p-3 text-xs text-[var(--foreground-muted)] font-sans">No businesses are connected yet.</p>}
          <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {relatedBusinesses.map(({ business: related, relationship }) => {
              const relatedMetrics = metrics[related.id];
              const relatedCustomerCount = relatedMetrics?.customerCount ?? related.customerCount;
              return (
                <article key={related.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-3 shadow-2xs">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-[var(--foreground)]">{related.name}</p>
                      <p className="mt-0.5 truncate text-[10px] text-[var(--foreground-muted)] font-sans">{related.industry} · {related.location}</p>
                      <span className="mt-1 inline-flex rounded bg-[var(--surface-inset)] px-2 py-0.5 text-[9px] font-bold text-[var(--foreground-muted)]">
                        {relationship.parentBusinessId === business.id
                          ? relationship.relationshipType ?? 'Connected business'
                          : `Main business · ${relationship.relationshipType ?? 'Connected business'}`}
                      </span>
                    </div>
                    <button onClick={() => onOpenBusiness(related.id)} className="accounting-focus shrink-0 rounded-lg px-2 py-1 text-[10px] font-bold text-[var(--accent)] hover:bg-[var(--accent-soft)]">Open</button>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-[var(--surface-inset)] p-2 border border-[var(--border)] sm:grid-cols-3">
                    <div><p className="text-[8px] text-[var(--foreground-muted)] uppercase">Cash</p><p className="mt-0.5 text-[10px] font-bold tabular-nums text-[var(--foreground)]">{relatedMetrics?.availableCash == null ? 'Not available' : formatBDT(relatedMetrics.availableCash)}</p></div>
                    <div><p className="text-[8px] text-[var(--foreground-muted)] uppercase">Revenue</p><p className="mt-0.5 text-[10px] font-bold tabular-nums text-[var(--foreground)]">{relatedMetrics?.monthlyRevenue == null ? 'Not available' : formatBDT(relatedMetrics.monthlyRevenue)}</p></div>
                    <div><p className="text-[8px] text-[var(--foreground-muted)] uppercase">Receivables</p><p className="mt-0.5 text-[10px] font-bold tabular-nums text-[var(--warning)]">{relatedMetrics?.receivables == null ? 'Not available' : formatBDT(relatedMetrics.receivables)}</p></div>
                    <div><p className="text-[8px] text-[var(--foreground-muted)] uppercase">Net profit</p><p className="mt-0.5 text-[10px] font-bold tabular-nums text-[var(--success)]">{relatedMetrics?.monthlyNetProfit == null ? 'Not available' : formatBDT(relatedMetrics.monthlyNetProfit)}</p></div>
                    <div><p className="text-[8px] text-[var(--foreground-muted)] uppercase">Customers</p><p className="mt-0.5 text-[10px] font-bold tabular-nums text-[var(--foreground)]">{relatedCustomerCount == null ? 'Not available' : relatedCustomerCount.toLocaleString('en-BD')}</p></div>
                    <div><p className="text-[8px] text-[var(--foreground-muted)] uppercase">Staff</p><p className="mt-0.5 text-[10px] font-bold tabular-nums text-[var(--foreground)]">{relatedMetrics?.employeeCount ?? related.employeeCount ?? 'Not available'}</p></div>
                  </div>
                  {businessMetrics?.monthlyRevenue != null && relatedMetrics?.monthlyRevenue != null && businessMetrics.monthlyRevenue > 0 && (
                    <p className="mt-2 rounded bg-[var(--surface-inset)] px-2.5 py-1.5 text-[9px] text-[var(--foreground-muted)] font-sans">
                      Monthly sales are {Math.abs(((relatedMetrics.monthlyRevenue - businessMetrics.monthlyRevenue) / businessMetrics.monthlyRevenue) * 100).toFixed(1)}% {relatedMetrics.monthlyRevenue >= businessMetrics.monthlyRevenue ? 'higher' : 'lower'} than {business.name}.
                    </p>
                  )}
                  {relationship.profileReused && <span className="mt-2 inline-flex items-center gap-1 rounded bg-[var(--surface-inset)] px-2 py-0.5 text-[9px] font-medium text-[var(--foreground-muted)]"><Share2 size={10} /> Details reused</span>}
                  {relationship.referenceEntryCount > 0 && <span className="ml-1 mt-2 inline-flex items-center gap-1 rounded bg-[var(--surface-inset)] px-2 py-0.5 text-[8px] font-medium text-[var(--foreground-muted)]">{relationship.referenceEntryCount} reference rows</span>}
                </article>
              );
            })}
          </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => onAddRelatedBusiness(business.id)} className="accounting-focus inline-flex h-9 items-center gap-2 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-bright)] px-3.5 text-xs font-bold text-white transition"><GitBranch size={13} /> Add Connected Business</button>
        {businesses.some((candidate) => candidate.id !== business.id && !links.some((link) => link.relatedBusinessId === candidate.id || link.parentBusinessId === candidate.id)) && (
          <button onClick={() => onLinkBusiness(business.id)} className="accounting-focus inline-flex h-9 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-3.5 text-xs font-bold text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition shadow-2xs"><Share2 size={13} /> Connect Existing Business</button>
        )}
      </div>
    </section>

    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] px-4 py-3 text-xs text-[var(--foreground-muted)] font-mono">
      <span><strong className="font-bold text-[var(--foreground)]">{business.customerCount?.toLocaleString('en-BD') ?? 'Not added'}</strong> customers</span>
      <span><strong className="font-bold text-[var(--foreground)]">{business.employeeCount ?? 'Not added'}</strong> employees</span>
      <span><strong className="font-bold text-[var(--foreground)]">{invoiceCount.toLocaleString('en-BD')}</strong> local invoices</span>
      <span><strong className="font-bold text-[var(--foreground)]">{expenseCount.toLocaleString('en-BD')}</strong> local expenses</span>
    </div>

    <section className="mt-4 flex flex-col items-start justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 shadow-xs sm:flex-row sm:items-center font-mono">
      <div>
        <h2 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">Quick Actions &amp; Ledger Operations</h2>
        <p className="mt-1 text-xs text-[var(--foreground-muted)] font-sans">Add invoices or record operational expenses directly to this entity&apos;s ledger.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={onCreateInvoice} className="accounting-focus inline-flex h-9 items-center gap-2 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-bright)] px-3.5 text-xs font-bold text-white transition"><Plus size={14} /> Create Invoice</button>
        <button onClick={onAddExpense} className="accounting-focus inline-flex h-9 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-3.5 text-xs font-bold text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition shadow-2xs"><Plus size={14} /> Add Expense</button>
      </div>
    </section>

    <section id="general-ledger" className="mt-4 scroll-mt-24 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] shadow-xs font-mono">
      <div className="border-b border-[var(--border)] bg-[var(--surface-inset)]/50 p-5">
        <h2 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">Entity Transactions &amp; Ledger</h2>
        <p className="mt-1 text-xs text-[var(--foreground-muted)] font-sans">Records belong exclusively to {business.name}.</p>
      </div>
      {visibleEntries.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-xs">
            <thead className="bg-[var(--surface-inset)] text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-muted)] border-b border-[var(--border)]">
              <tr><th className="px-5 py-3">Date</th><th className="px-3 py-3">Description</th><th className="px-3 py-3">Type</th><th className="px-3 py-3 text-right">Amount</th><th className="px-5 py-3 text-right">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {visibleEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-[var(--surface-hover)] transition">
                  <td className="px-5 py-3 text-[var(--foreground-muted)]">{entry.date}</td>
                  <td className="px-3 py-3 font-semibold text-[var(--foreground)]">{entry.description}</td>
                  <td className="px-3 py-3 text-[var(--foreground-muted)]">
                    {entry.referenceOnly
                      ? <span className="rounded bg-[var(--surface-inset)] px-2 py-0.5 text-[10px] text-[var(--foreground-muted)] border border-[var(--border)]">Example from {entry.referenceSourceName}</span>
                      : entry.kind === 'Invoicing' ? 'Invoice' : entry.kind === 'Expenses' ? 'Expense' : entry.kind}
                  </td>
                  <td className={`px-3 py-3 text-right font-bold tabular-nums ${entry.amount < 0 ? 'text-[var(--danger)]' : 'text-[var(--foreground)]'}`}>{entry.referenceOnly ? '—' : formatBDT(Math.abs(entry.amount))}</td>
                  <td className="px-5 py-3 text-right text-[var(--foreground-muted)]">{entry.referenceOnly ? 'Excluded from totals' : entry.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : entries.length ? (
        <div className="p-8 text-center">
          <p className="text-xs font-bold text-[var(--foreground)]">No matching transactions</p>
          <p className="mt-1 text-[10px] text-[var(--foreground-muted)] font-sans">Choose another transaction type filter to see records.</p>
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-xs font-bold text-[var(--foreground)]">No transactions added yet</p>
          <p className="mt-1 text-[10px] text-[var(--foreground-muted)] font-sans">Create an invoice or expense above to start this business ledger.</p>
        </div>
      )}
    </section>
    {referenceCount > 0 && <p className="mt-2 text-[10px] text-[var(--foreground-muted)] font-sans">{referenceCount} copied example entries shown for context and excluded from business totals.</p>}
  </div>
  );
};

export const BusinessOnboardingModal: React.FC<{
  open: boolean;
  businesses: BusinessProfile[];
  currentBusinessId: string | null;
  initialMode: 'standalone' | 'related' | 'link';
  onClose: () => void;
  onCreate: (
    business: Omit<BusinessProfile, 'id' | 'createdAt'>,
    setup: BusinessSetupOptions,
  ) => void;
  onLinkExisting: (parentBusinessId: string, relatedBusinessId: string) => void;
}> = ({ open, businesses, currentBusinessId, initialMode, onClose, onCreate, onLinkExisting }) => {
  const [mode, setMode] = React.useState<'standalone' | 'related' | 'link'>(initialMode);
  const [name, setName] = React.useState('');
  const initialSource = businesses.find((business) => business.id === currentBusinessId);
  const [industry, setIndustry] = React.useState(initialSource?.industry ?? '');
  const [location, setLocation] = React.useState(initialSource?.location ?? '');
  const [registrationId, setRegistrationId] = React.useState(initialSource?.registrationId ?? '');
  const [customerCount, setCustomerCount] = React.useState(initialSource?.customerCount?.toString() ?? '');
  const [employeeCount, setEmployeeCount] = React.useState(initialSource?.employeeCount?.toString() ?? '');
  const [relationshipToBusinessId, setRelationshipToBusinessId] = React.useState(currentBusinessId ?? '');
  const [reuseFromBusinessId, setReuseFromBusinessId] = React.useState(currentBusinessId ?? '');
  const [linkedBusinessId, setLinkedBusinessId] = React.useState('');
  const [copyProfile, setCopyProfile] = React.useState(Boolean(currentBusinessId));
  const [copyLedgerAsReference, setCopyLedgerAsReference] = React.useState(false);

  if (!open) return null;
  const selectedSource = businesses.find((business) => business.id === reuseFromBusinessId);

  const applyExistingProfile = (businessId: string) => {
    setReuseFromBusinessId(businessId);
    const source = businesses.find((business) => business.id === businessId);
    if (!source) {
      setIndustry('');
      setLocation('');
      setRegistrationId('');
      setCustomerCount('');
      setEmployeeCount('');
      setCopyProfile(false);
      return;
    }
    if (!industry.trim() || copyProfile) setIndustry(source.industry);
    if (!location.trim() || copyProfile) setLocation(source.location);
    if (!registrationId.trim() || copyProfile) setRegistrationId(source.registrationId);
    if (!customerCount || copyProfile) setCustomerCount(source.customerCount?.toString() ?? '');
    if (!employeeCount || copyProfile) setEmployeeCount(source.employeeCount?.toString() ?? '');
    setCopyProfile(true);
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (mode === 'link') {
      if (!relationshipToBusinessId || !linkedBusinessId || relationshipToBusinessId === linkedBusinessId) return;
      onLinkExisting(relationshipToBusinessId, linkedBusinessId);
      return;
    }
    onCreate({
      name: name.trim(),
      industry: industry.trim(),
      location: location.trim(),
      registrationId: registrationId.trim(),
      customerCount: customerCount ? Math.max(0, Math.floor(Number(customerCount))) : undefined,
      employeeCount: employeeCount ? Math.max(0, Math.floor(Number(employeeCount))) : undefined,
      status: 'Setup',
    }, {
      relationshipToBusinessId: mode === 'related' ? relationshipToBusinessId : null,
      reuseFromBusinessId: reuseFromBusinessId || null,
      copyProfile,
      copyLedgerAsReference,
    });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <form onSubmit={submit} aria-labelledby="business-onboarding-title" className="max-h-[min(90vh,820px)] w-full max-w-[560px] overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 shadow-2xl sm:p-6 font-mono text-[var(--foreground)]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="rounded-xl bg-[var(--accent-soft)] border border-[var(--accent)]/20 p-2.5 text-[var(--accent)]"><Building2 size={18} /></span>
            <div>
              <h2 id="business-onboarding-title" className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">Add Enterprise Entity</h2>
              <p className="mt-1 text-xs text-[var(--foreground-muted)] font-sans">Add an isolated legal entity or connect an existing operating branch.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close add business dialog" className="accounting-focus rounded-lg p-1.5 text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]">
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-1 rounded-xl bg-[var(--surface-inset)] p-1 border border-[var(--border)]">
          {[
            { id: 'standalone', label: 'New Entity' },
            { id: 'related', label: 'Connected Unit' },
            { id: 'link', label: 'Connect Existing' },
          ].map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setMode(option.id as typeof mode)}
              aria-pressed={mode === option.id}
              className={`accounting-focus min-h-9 rounded-lg px-2 text-[10px] font-bold uppercase tracking-wider transition ${mode === option.id ? 'bg-[var(--surface-elevated)] text-[var(--accent)] border border-[var(--accent)]/30 shadow-2xs' : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'}`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {mode === 'link' ? (
          <div className="mt-5 space-y-3.5">
            <label className="block text-xs font-semibold text-[var(--foreground)] font-sans">
              Connect to <span className="text-[var(--danger)]">*</span>
              <select required value={relationshipToBusinessId} onChange={(event) => setRelationshipToBusinessId(event.target.value)} className="accounting-focus mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] px-3 text-xs text-[var(--foreground)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]">
                <option value="">Choose a business</option>
                {businesses.map((business) => <option key={business.id} value={business.id}>{business.name}</option>)}
              </select>
            </label>
            <label className="block text-xs font-semibold text-[var(--foreground)] font-sans">
              Choose a business to connect <span className="text-[var(--danger)]">*</span>
              <select required value={linkedBusinessId} onChange={(event) => setLinkedBusinessId(event.target.value)} className="accounting-focus mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] px-3 text-xs text-[var(--foreground)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]">
                <option value="">Choose another business</option>
                {businesses.filter((business) => business.id !== relationshipToBusinessId).map((business) => <option key={business.id} value={business.id}>{business.name}</option>)}
              </select>
            </label>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] p-3 text-xs leading-relaxed text-[var(--foreground-muted)] font-sans">Connecting businesses does not combine their records or financial totals.</div>
          </div>
        ) : (
          <div className="mt-5 space-y-3.5">
            {mode === 'related' && (
              <label className="block text-xs font-semibold text-[var(--foreground)] font-sans">
                Connect to <span className="text-[var(--danger)]">*</span>
                <select required value={relationshipToBusinessId} onChange={(event) => setRelationshipToBusinessId(event.target.value)} className="accounting-focus mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] px-3 text-xs text-[var(--foreground)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]">
                  <option value="">Choose the main business</option>
                  {businesses.map((business) => <option key={business.id} value={business.id}>{business.name}</option>)}
                </select>
              </label>
            )}
            <label className="block text-xs font-semibold text-[var(--foreground)] font-sans">
              Copy details from another business
              <select value={reuseFromBusinessId} onChange={(event) => applyExistingProfile(event.target.value)} className="accounting-focus mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] px-3 text-xs text-[var(--foreground)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]">
                <option value="">Start with blank details</option>
                {businesses.map((business) => <option key={business.id} value={business.id}>{business.name} · {business.industry}</option>)}
              </select>
            </label>
            {selectedSource && (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs font-bold text-[var(--foreground)]">Business details from {selectedSource.name}</p>
                  <span className="shrink-0 rounded bg-[var(--success-soft)] border border-[var(--success)]/20 px-2 py-0.5 text-[9px] font-bold text-[var(--success)]">{selectedSource.status}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-[var(--foreground-muted)] font-sans">
                  <span>{selectedSource.industry}</span>
                  <span>{selectedSource.location}</span>
                  {selectedSource.customerCount != null && <span>{selectedSource.customerCount.toLocaleString('en-BD')} customers</span>}
                  {selectedSource.employeeCount != null && <span>{selectedSource.employeeCount} employees</span>}
                </div>
                <p className="mt-2 text-[10px] text-[var(--foreground-subtle)] font-sans">These details can be copied. Each business keeps its own money and records.</p>
              </div>
            )}
            <label className="flex items-start gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] p-3 text-xs leading-relaxed text-[var(--foreground-muted)] font-sans">
              <input type="checkbox" checked={copyProfile} onChange={(event) => setCopyProfile(event.target.checked)} className="mt-0.5 accent-[var(--accent)]" />
              <span><strong className="text-[var(--foreground)]">Copy business details.</strong> Fills in the industry, location, registration, customer, and team details.</span>
            </label>
            <label className="flex items-start gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] p-3 text-xs leading-relaxed text-[var(--foreground-muted)] font-sans">
              <input type="checkbox" checked={copyLedgerAsReference} onChange={(event) => setCopyLedgerAsReference(event.target.checked)} className="mt-0.5 accent-[var(--accent)]" />
              <span><strong className="text-[var(--foreground)]">Include sample entries for reference.</strong> They stay labeled with their original business and are not included in balances or profit.</span>
            </label>
            <label className="block text-xs font-semibold text-[var(--foreground)] font-sans">
              Business name <span className="text-[var(--danger)]">*</span>
              <input required maxLength={80} autoFocus={mode === 'standalone'} value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. North Star Foods" className="accounting-focus mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] px-3 text-xs text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" />
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block text-xs font-semibold text-[var(--foreground)] font-sans">
                Industry <span className="text-[var(--danger)]">*</span>
                <input required maxLength={60} value={industry} onChange={(event) => setIndustry(event.target.value)} placeholder="e.g. Retail, Distribution" className="accounting-focus mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] px-3 text-xs text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" />
              </label>
              <label className="block text-xs font-semibold text-[var(--foreground)] font-sans">
                Main location <span className="text-[var(--danger)]">*</span>
                <input required maxLength={80} value={location} onChange={(event) => setLocation(event.target.value)} placeholder="City, country" className="accounting-focus mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] px-3 text-xs text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" />
              </label>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block text-xs font-semibold text-[var(--foreground)] font-sans">
                Active customers <span className="font-normal text-[var(--foreground-muted)]">(optional)</span>
                <input type="number" min="0" step="1" value={customerCount} onChange={(event) => setCustomerCount(event.target.value)} placeholder="e.g. 250" className="accounting-focus mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] px-3 text-xs text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" />
              </label>
              <label className="block text-xs font-semibold text-[var(--foreground)] font-sans">
                Employees <span className="font-normal text-[var(--foreground-muted)]">(optional)</span>
                <input type="number" min="0" step="1" value={employeeCount} onChange={(event) => setEmployeeCount(event.target.value)} placeholder="e.g. 25" className="accounting-focus mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] px-3 text-xs text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" />
              </label>
            </div>
            <label className="block text-xs font-semibold text-[var(--foreground)] font-sans">
              Registration / tax ID <span className="font-normal text-[var(--foreground-muted)]">(optional)</span>
              <input maxLength={60} value={registrationId} onChange={(event) => setRegistrationId(event.target.value)} placeholder="Add later if not available" className="accounting-focus mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] px-3 text-xs text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]" />
            </label>
          </div>
        )}

        <div className="mt-4 rounded-xl bg-[var(--surface-inset)] border border-[var(--border)] p-3 text-[10px] leading-relaxed text-[var(--foreground-muted)] font-sans">
          Changes are local to this demo session only. No backend data or legal entity records are created.
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="accounting-focus rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-semibold text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]">Cancel</button>
          <button type="submit" className="accounting-focus inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-bright)] px-4 py-2 text-xs font-bold text-white shadow-2xs active:scale-[0.98]">
            {mode === 'link' ? <Share2 size={14} /> : mode === 'related' ? <GitBranch size={14} /> : <Plus size={14} />}
            {mode === 'link' ? 'Connect Business' : mode === 'related' ? 'Add Connected Unit' : 'Add Entity'}
          </button>
        </div>
      </form>
    </div>
  );
};
