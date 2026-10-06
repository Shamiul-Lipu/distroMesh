'use client';

import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Activity,
  ArrowDownLeft,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  Building2,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Command,
  CreditCard,
  Download,
  FileCheck2,
  FilePlus2,
  FileText,
  Filter,
  LayoutDashboard,
  GitBranch,
  Menu,
  MessageSquareText,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Share2,
  Settings2,
  ShieldCheck,
  Sparkles,
  Upload,
  Wallet,
  X,
} from 'lucide-react';
import { useExecutive } from '../../context/ExecutiveContext';
import { formatBDT } from '../../utils/formatters';
import { getBusinessRoute, isBusinessRouteName, sectionIdsByRouteName } from '../../utils/businessRoutes';
import { RouteData } from '../../types/executive';
import {
  DepotFilter,
  getPortfolioSnapshot,
  PrincipalFilter,
  depotOptions,
  principalOptions,
} from '../../data/portfolioDemo';
import { SimulationPanel } from './SimulationPanel';
import { WorkingCapitalDrawer } from './Drawers/WorkingCapitalDrawer';
import { RouteDetailDrawer } from './Drawers/RouteDetailDrawer';
import { ReconciliationDrawer } from './Drawers/ReconciliationDrawer';
import { IncidentDrawer } from './Drawers/IncidentDrawer';
import { ObligationDrawer } from './Drawers/ObligationDrawer';
import { ActionConfirmationModal } from './Drawers/ActionConfirmationModal';
import { ToastNotification } from './ToastNotification';
import {
  BusinessOnboardingModal,
  BusinessPortfolioOverview,
  BusinessSalesOperations,
  BusinessRelationship,
  BusinessMetrics,
  BusinessSetupOptions,
  initialBusinesses,
  initialBusinessMetrics,
  initialSampleRows,
  initialRelationships,
  NewBusinessWorkspace,
} from './BusinessPortfolio';
import type { BusinessProfile } from './BusinessPortfolio';

type TransactionFilter = 'All' | 'Invoicing' | 'Expenses';
type QuickAction = 'invoice' | 'expense' | null;
type LedgerRow = {
  id: string;
  businessId: string;
  date: string;
  description: string;
  party: string;
  principal: Exclude<PrincipalFilter, 'All principals'>;
  depot: Exclude<DepotFilter, 'All depots'>;
  category: string;
  method: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  kind: 'Invoicing' | 'Expenses' | 'Collection' | 'Payable';
  ageDays: number;
  routeId?: string;
  referenceOnly?: boolean;
  referenceSourceBusinessId?: string;
};

const dailyWorkItems = [
  { id: 'general-ledger', label: 'Transactions', icon: BookOpen },
  { id: 'invoicing', label: 'Invoices', icon: FileText },
  { id: 'expenses', label: 'Expenses', icon: CreditCard },
];

const insightItems = [
  { id: 'reports', label: 'Cash flow', icon: Activity },
  { id: 'bank-reconciliation', label: 'Alerts & tasks', icon: FileCheck2 },
  { id: 'ai-assistant', label: 'Help & business questions', icon: Sparkles },
];

const compactCurrency = (amount: number) => {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  if (abs >= 10000000) return `${sign}৳${(abs / 10000000).toFixed(2)}Cr`;
  if (abs >= 100000) return `${sign}৳${(abs / 100000).toFixed(1)}L`;
  if (abs >= 1000) return `${sign}৳${(abs / 1000).toFixed(1)}K`;
  return `${sign}৳${abs.toLocaleString('en-BD')}`;
};

export const ExecutiveShell: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    state,
    openDrawer,
    openModal,
    closeDrawer,
    closeModal,
    showToast,
    resolveAlert,
  } = useExecutive();
  const routeSegments = pathname.split('/').filter(Boolean);
  const initialBusinessId = routeSegments[0] === 'businesses' && routeSegments[1]
    ? routeSegments[1]
    : 'all';
  const activeBusinessId = initialBusinessId;
  const routeSection = routeSegments[0] === 'businesses'
    ? routeSegments[2] ?? 'overview'
    : 'business-portfolio';
  const hasInvalidRoute = routeSegments[0] !== 'businesses'
    || routeSegments.length > 3
    || (routeSegments.length === 3
      && !isBusinessRouteName(routeSegments[2]));
  const activeSection = activeBusinessId === 'all'
    ? 'business-portfolio'
    : sectionIdsByRouteName[routeSection] ?? 'overview';
  const transactionFilter: TransactionFilter = activeSection === 'invoicing'
    ? 'Invoicing'
    : activeSection === 'expenses'
      ? 'Expenses'
      : 'All';
  const [businesses, setBusinesses] = useState<BusinessProfile[]>(initialBusinesses);
  const [relationships, setRelationships] = useState<BusinessRelationship[]>(initialRelationships);
  const [businessNavExpanded, setBusinessNavExpanded] = useState(true);
  const [businessOnboardingOpen, setBusinessOnboardingOpen] = useState(false);
  const [businessModalMode, setBusinessModalMode] = useState<'standalone' | 'related' | 'link'>('standalone');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [principalFilters, setPrincipalFilters] = useState<Record<string, PrincipalFilter>>({});
  const [depotFilters, setDepotFilters] = useState<Record<string, DepotFilter>>({});
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [transactionSearch, setTransactionSearch] = useState('');
  const [globalSearch, setGlobalSearch] = useState('');
  const [quickAction, setQuickAction] = useState<QuickAction>(null);
  const [companyMenuOpen, setCompanyMenuOpen] = useState(false);
  const [businessSearch, setBusinessSearch] = useState('');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [localRows, setLocalRows] = useState<LedgerRow[]>(initialSampleRows);
  const [formDescription, setFormDescription] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formPrincipal, setFormPrincipal] = useState<Exclude<PrincipalFilter, 'All principals'>>('Unilever');
  const [formDepot, setFormDepot] = useState<Exclude<DepotFilter, 'All depots'>>('Sherpur');
  const searchRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const businessIdCounter = useRef(0);
  const isPortfolioView = activeBusinessId === 'all';
  const activeBusiness = businesses.find((business) => business.id === activeBusinessId);
  const principalFilter = principalFilters[activeBusinessId] ?? 'All principals';
  const depotFilter = depotFilters[activeBusinessId] ?? 'All depots';
  const setPrincipalFilter = (value: PrincipalFilter, businessId = activeBusinessId) =>
    setPrincipalFilters((previous) => ({ ...previous, [businessId]: value }));
  const setDepotFilter = (value: DepotFilter, businessId = activeBusinessId) =>
    setDepotFilters((previous) => ({ ...previous, [businessId]: value }));
  const prepareBusinessSelection = (businessId: string) => {
    setBusinessNavExpanded(true);
    setCompanyMenuOpen(false);
    setBusinessSearch('');
    setPrincipalFilter('All principals', businessId);
    setDepotFilter('All depots', businessId);
    setShowAllTransactions(false);
    setTransactionSearch('');
    setGlobalSearch('');
    setMobileNavOpen(false);
    closeDrawer();
    closeModal();
    const currentRoute = pathname.split('/').filter(Boolean);
    const currentSectionId = currentRoute[0] === 'businesses'
      ? sectionIdsByRouteName[currentRoute[2] ?? 'overview'] ?? 'overview'
      : 'overview';
    const nextPath = businessId === 'all'
      ? '/businesses'
      : getBusinessRoute(businessId, currentSectionId);
    return nextPath;
  };
  const selectBusiness = (businessId: string) => {
    const nextPath = prepareBusinessSelection(businessId);
    if (pathname !== nextPath) router.push(nextPath, { scroll: false });
  };
  const createBusiness = (
    profile: Omit<BusinessProfile, 'id' | 'createdAt'>,
    setup: BusinessSetupOptions,
  ) => {
    if (businesses.some((business) => business.name.toLowerCase() === profile.name.toLowerCase())) {
      showToast('A business with this name already exists in your demo workspace');
      return;
    }
    const now = new Date();
    businessIdCounter.current += 1;
    const business: BusinessProfile = {
      ...profile,
      id: `business-${businessIdCounter.current}`,
      createdAt: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
    };
    setBusinesses((previous) => [...previous, business]);
    const sourceBusinessId = setup.reuseFromBusinessId;
    const referenceEntries = setup.copyLedgerAsReference && sourceBusinessId
      ? allRows.filter((row) => row.businessId === sourceBusinessId && !row.referenceOnly)
        .map((row, index): LedgerRow => ({
          ...row,
          id: `${business.id}-reference-${index}`,
          businessId: business.id,
          party: row.party,
          routeId: undefined,
          referenceOnly: true,
          referenceSourceBusinessId: sourceBusinessId,
        }))
      : [];
    if (referenceEntries.length) setLocalRows((previous) => [...previous, ...referenceEntries]);
    const relationshipParent = setup.relationshipToBusinessId;
    if (relationshipParent && businesses.some((existing) => existing.id === relationshipParent)) {
      setRelationships((previous) => [...previous, {
        id: `${business.id}-relationship`,
        parentBusinessId: relationshipParent,
        relatedBusinessId: business.id,
        linkedAt: business.createdAt,
        profileReused: Boolean(setup.copyProfile && sourceBusinessId),
        referenceEntryCount: referenceEntries.length,
        relationshipType: 'Connected distributor',
      }]);
    }
    setBusinessOnboardingOpen(false);
    selectBusiness(business.id);
    showToast(`${business.name} added${relationshipParent ? ' as a related business' : ''}${referenceEntries.length ? ` with ${referenceEntries.length} reference entries` : ''}`);
  };
  const portfolio = useMemo(
    () => getPortfolioSnapshot(principalFilter, depotFilter, {
      bankCash: state.bankCash,
      vaultCash: state.vaultCash,
      upcomingObligation: state.upcomingObligation,
      freshCredit: state.freshCredit,
      todaySales: state.todaySales,
      cashVariance: state.cashVariance,
    }),
    [
      principalFilter,
      depotFilter,
      state.bankCash,
      state.vaultCash,
      state.upcomingObligation,
      state.freshCredit,
      state.todaySales,
      state.cashVariance,
    ],
  );
  const companyPortfolio = useMemo(
    () => getPortfolioSnapshot('All principals', 'All depots', {
      bankCash: state.bankCash,
      vaultCash: state.vaultCash,
      upcomingObligation: state.upcomingObligation,
      freshCredit: state.freshCredit,
      todaySales: state.todaySales,
      cashVariance: state.cashVariance,
    }),
    [state.bankCash, state.vaultCash, state.upcomingObligation, state.freshCredit, state.todaySales, state.cashVariance],
  );
  const formatPortfolioMargin = (amount: number) => portfolio.monthlyRevenue === 0
    ? 'Not available'
    : `${((amount / portfolio.monthlyRevenue) * 100).toFixed(2)}%`;
  const businessMetrics = useMemo<Record<string, BusinessMetrics>>(() => {
    const metrics = businesses.reduce<Record<string, BusinessMetrics>>((result, business) => {
      const ownedRows = localRows.filter((row) => row.businessId === business.id && !row.referenceOnly);
      const invoiceRows = ownedRows.filter((row) => row.kind === 'Invoicing');
      const expenseRows = ownedRows.filter((row) => row.kind === 'Expenses');
      const isUnileverDistribution = business.id === 'unilever-distribution';
      const demoMetrics = initialBusinessMetrics[business.id];
      result[business.id] = {
        availableCash: isUnileverDistribution ? companyPortfolio.bankCash + companyPortfolio.vaultCash : demoMetrics?.availableCash ?? null,
        receivables: demoMetrics?.receivables == null && !invoiceRows.some((row) => row.status !== 'Paid')
          ? null
          : (isUnileverDistribution ? companyPortfolio.receivables : demoMetrics?.receivables ?? 0)
            + invoiceRows.filter((row) => row.status !== 'Paid').reduce((sum, row) => sum + row.amount, 0),
        monthlyRevenue: isUnileverDistribution ? companyPortfolio.monthlyRevenue : demoMetrics?.monthlyRevenue ?? null,
        monthlyNetProfit: isUnileverDistribution ? companyPortfolio.monthlyNetProfit : demoMetrics?.monthlyNetProfit ?? null,
        invoiceCount: (demoMetrics?.invoiceCount ?? 0) + invoiceRows.length,
        expenseCount: (demoMetrics?.expenseCount ?? 0) + expenseRows.length,
        relatedCount: relationships.filter((relationship) =>
          relationship.parentBusinessId === business.id || relationship.relatedBusinessId === business.id,
        ).length,
        isIllustrative: isUnileverDistribution || Boolean(demoMetrics?.isIllustrative),
        customerCount: business.customerCount ?? demoMetrics?.customerCount ?? null,
        employeeCount: business.employeeCount ?? demoMetrics?.employeeCount ?? null,
        overdueInvoiceCount: (demoMetrics?.overdueInvoiceCount ?? 0)
          + invoiceRows.filter((row) => row.status === 'Overdue').length,
        overdueInvoiceTotal: (demoMetrics?.overdueInvoiceTotal ?? 0)
          + invoiceRows.filter((row) => row.status === 'Overdue').reduce((sum, row) => sum + row.amount, 0),
        monthlySalesHistory: demoMetrics?.monthlySalesHistory,
        topProductCategory: demoMetrics?.topProductCategory,
        leadingSalesChannel: demoMetrics?.leadingSalesChannel,
        onTimeDeliveryPercent: demoMetrics?.onTimeDeliveryPercent,
      };
      return result;
    }, {});
    return metrics;
  }, [businesses, companyPortfolio, localRows, relationships]);
  const activeRelatedBusinesses = useMemo(() => relationships
    .filter((relationship) => relationship.parentBusinessId === activeBusinessId || relationship.relatedBusinessId === activeBusinessId)
    .map((relationship) => {
      const relatedId = relationship.parentBusinessId === activeBusinessId
        ? relationship.relatedBusinessId
        : relationship.parentBusinessId;
      return {
        business: businesses.find((business) => business.id === relatedId),
        relationship,
      };
    })
    .filter((item): item is { business: BusinessProfile; relationship: BusinessRelationship } => Boolean(item.business)),
  [activeBusinessId, businesses, relationships]);
  const linkExistingBusiness = (parentBusinessId: string, relatedBusinessId: string) => {
    if (parentBusinessId === relatedBusinessId) return;
    if (!businesses.some((business) => business.id === parentBusinessId)
      || !businesses.some((business) => business.id === relatedBusinessId)) {
      showToast('Choose two existing businesses to create a relationship');
      return;
    }
    if (relationships.some((relationship) =>
      (relationship.parentBusinessId === parentBusinessId && relationship.relatedBusinessId === relatedBusinessId)
      || (relationship.parentBusinessId === relatedBusinessId && relationship.relatedBusinessId === parentBusinessId),
    )) {
      showToast('These businesses are already linked');
      return;
    }
    setRelationships((previous) => [...previous, {
      id: `relationship-${parentBusinessId}-${relatedBusinessId}`,
      parentBusinessId,
      relatedBusinessId,
      linkedAt: new Date().toISOString().slice(0, 10),
      profileReused: false,
      referenceEntryCount: 0,
      relationshipType: 'Distribution partner',
    }]);
    setBusinessOnboardingOpen(false);
    showToast('Business relationship linked. Ledgers remain separate.');
  };
  const routeRows = useMemo<LedgerRow[]>(
    () => state.routes.flatMap((route: RouteData) => {
      const unileverCollected = Math.round(route.collected * 0.7);
      const unileverCredit = Math.round(route.credit * 0.7);
      return [
        {
          id: `${route.id}-unilever-collection`,
          businessId: 'unilever-distribution',
          date: 'Today',
          description: `Route collection · ${route.vanNumber}`,
          party: `${route.routeName} · ${route.depot}`,
          principal: 'Unilever',
          depot: route.depot,
          category: 'Cash collection',
          method: 'Cash',
          amount: unileverCollected,
          status: route.status === 'EXCEPTION' ? 'Pending' : 'Paid',
          kind: 'Collection',
          ageDays: 0,
          routeId: route.id,
        },
        {
          id: `${route.id}-pureit-collection`,
          businessId: 'unilever-distribution',
          date: 'Today',
          description: `Route collection · ${route.vanNumber}`,
          party: `${route.routeName} · ${route.depot}`,
          principal: 'Pureit',
          depot: route.depot,
          category: 'Cash collection',
          method: 'Cash',
          amount: route.collected - unileverCollected,
          status: route.status === 'EXCEPTION' ? 'Pending' : 'Paid',
          kind: 'Collection',
          ageDays: 0,
          routeId: route.id,
        },
        {
          id: `${route.id}-unilever-credit`,
          businessId: 'unilever-distribution',
          date: 'Today',
          description: `Market credit · ${route.vanNumber}`,
          party: `${route.routeName} · ${route.depot}`,
          principal: 'Unilever',
          depot: route.depot,
          category: 'Trade receivable',
          method: 'Invoice',
          amount: unileverCredit,
          status: 'Pending',
          kind: 'Invoicing',
          ageDays: 0,
          routeId: route.id,
        },
        {
          id: `${route.id}-pureit-credit`,
          businessId: 'unilever-distribution',
          date: 'Today',
          description: `Market credit · ${route.vanNumber}`,
          party: `${route.routeName} · ${route.depot}`,
          principal: 'Pureit',
          depot: route.depot,
          category: 'Trade receivable',
          method: 'Invoice',
          amount: route.credit - unileverCredit,
          status: 'Pending',
          kind: 'Invoicing',
          ageDays: 0,
          routeId: route.id,
        },
      ];
    }),
    [state.routes],
  );

  const allRows: LedgerRow[] = [
    ...localRows,
    ...routeRows,
    {
      id: 'unilever-sherpur-auto-debit',
      businessId: 'unilever-distribution',
      date: `Due in ${state.obligationDueHours}h`,
      description: 'Supplier principal auto-debit',
      party: 'Unilever Bangladesh',
      principal: 'Unilever',
      depot: 'Sherpur',
      category: 'Supplier payable',
      method: 'Bank transfer',
      amount: -Math.round(state.upcomingObligation * 0.8),
      status: 'Pending',
      kind: 'Payable',
      ageDays: 0,
    },
    {
      id: 'unilever-bogura-auto-debit',
      businessId: 'unilever-distribution',
      date: `Due in ${state.obligationDueHours}h`,
      description: 'Supplier principal auto-debit',
      party: 'Unilever Bangladesh',
      principal: 'Unilever',
      depot: 'Bogura',
      category: 'Supplier payable',
      method: 'Bank transfer',
      amount: -Math.round(state.upcomingObligation * 0.2),
      status: 'Pending',
      kind: 'Payable',
      ageDays: 0,
    },
  ];

  const filteredRows = (() => {
    const normalized = transactionSearch.trim().toLowerCase();
    return allRows.filter((row) => {
      const matchesKind = transactionFilter === 'All'
        || (transactionFilter === 'Invoicing' && row.kind === 'Invoicing')
        || (transactionFilter === 'Expenses' && row.kind === 'Expenses');
      const matchesPrincipal = principalFilter === 'All principals' || row.principal === principalFilter;
      const matchesDepot = depotFilter === 'All depots' || row.depot === depotFilter;
      const matchesBusiness = isPortfolioView || row.businessId === activeBusinessId;
      const matchesSearch = !normalized
        || `${row.description} ${row.party} ${row.principal} ${row.depot} ${row.category} ${row.method}`.toLowerCase().includes(normalized);
      return matchesBusiness && matchesKind && matchesPrincipal && matchesDepot && matchesSearch;
    });
  })();

  const activeAlerts = (isPortfolioView || activeBusinessId === 'unilever-distribution' ? state.alerts : [])
    .filter((alert) => {
      if (alert.resolved) return false;
      if (alert.actionKey === 'REVIEW_VARIANCE') {
        return depotFilter !== 'Sherpur' && portfolio.cashVariance !== 0;
      }
      if (alert.actionKey === 'REVIEW_OBLIGATION') {
        return principalFilter !== 'Pureit' && portfolio.upcomingObligation > 0;
      }
      return true;
    })
    .map((alert) => {
      if (alert.actionKey === 'REVIEW_VARIANCE') {
        return {
          ...alert,
          title: `${isPortfolioView ? 'Unilever Distribution · ' : ''}Van #3 Cash Variance (${formatBDT(portfolio.cashVariance)})`,
          whatHappened: `Expected till cash was ${formatBDT(portfolio.expectedTillCash)}; counted cash was ${formatBDT(portfolio.countedTillCash)} in the selected scope.`,
          impact: `${formatBDT(portfolio.cashVariance)} variance in the selected route settlement.`,
        };
      }
      if (alert.actionKey === 'REVIEW_OBLIGATION') {
        return {
          ...alert,
          title: `${isPortfolioView ? 'Unilever Distribution · ' : ''}Unilever Auto-Debit (${formatBDT(portfolio.upcomingObligation)})`,
          impact: `${formatBDT(portfolio.upcomingObligation)} scheduled supplier payment in the selected scope.`,
        };
      }
      return alert;
    });
  const liquidCash = portfolio.bankCash + portfolio.vaultCash;
  const collectedToday = routeRows
    .filter((row) => row.kind === 'Collection'
      && (principalFilter === 'All principals' || row.principal === principalFilter)
      && (depotFilter === 'All depots' || row.depot === depotFilter))
    .reduce((sum, row) => sum + row.amount, 0);
  const dueSoon = activeBusinessId === 'unilever-distribution' ? state.routes.filter((route) =>
    route.status === 'EXCEPTION' && (depotFilter === 'All depots' || route.depot === depotFilter),
  ).length : 0;
  const activeBusinessMetrics = businessMetrics[activeBusinessId];
  const fullBusinessScope = principalFilter === 'All principals' && depotFilter === 'All depots';
  const activePerformanceMetrics = activeBusinessMetrics && activeBusinessId === 'unilever-distribution'
    ? {
      ...activeBusinessMetrics,
      availableCash: liquidCash,
      receivables: portfolio.receivables,
      monthlyRevenue: portfolio.monthlyRevenue,
      monthlyNetProfit: portfolio.monthlyNetProfit,
      monthlySalesHistory: fullBusinessScope ? activeBusinessMetrics.monthlySalesHistory : undefined,
    }
    : activeBusinessMetrics;
  const trendUnavailableMessage = !fullBusinessScope && activeBusinessId === 'unilever-distribution'
    ? 'Dated sales history is only available for the full business sample. Clear the brand and location filters to view it.'
    : undefined;
  const salesHistory = activePerformanceMetrics?.monthlySalesHistory;
  const latestSales = salesHistory?.at(-1)?.revenue;
  const previousSales = salesHistory?.at(-2)?.revenue;
  const monthlySalesChange = latestSales != null && previousSales != null && previousSales !== 0
    ? ((latestSales - previousSales) / previousSales) * 100
    : null;
  const businessFocus = dueSoon > 0
    ? {
      title: `${dueSoon} route ${dueSoon === 1 ? 'exception' : 'exceptions'}`,
      detail: 'Reconcile route cash before closing the day.',
      section: 'bank-reconciliation',
    }
    : activeAlerts.length > 0
      ? {
        title: `${activeAlerts.length} open ${activeAlerts.length === 1 ? 'alert' : 'alerts'}`,
        detail: 'Review flagged cash or payment items.',
        section: 'bank-reconciliation',
      }
      : (activeBusinessMetrics?.overdueInvoiceCount ?? 0) > 0
        ? {
          title: `${activeBusinessMetrics?.overdueInvoiceCount} past-due sample invoices`,
          detail: 'Check the invoice records and confirm against your books.',
          section: 'invoicing',
        }
        : (activeBusinessMetrics?.onTimeDeliveryPercent != null && activeBusinessMetrics.onTimeDeliveryPercent < 85)
          ? {
            title: 'Delivery indicator to review',
            detail: `Sample on-time rate: ${activeBusinessMetrics.onTimeDeliveryPercent}%.`,
            section: 'business-performance',
          }
          : (monthlySalesChange != null && monthlySalesChange <= -5)
            ? {
              title: 'Sales are lower in the sample',
              detail: `${Math.abs(monthlySalesChange).toFixed(1)}% below the previous month.`,
              section: 'business-performance',
            }
            : {
              title: 'No flagged sample indicators',
              detail: 'Review sales and activity as new records come in.',
              section: 'business-performance',
            };
  const scopedRoutes = useMemo(() => state.routes
    .filter((route) => depotFilter === 'All depots' || route.depot === depotFilter)
    .map((route) => {
      const scopedAmount = (amount: number) => {
        const unileverAmount = Math.round(amount * 0.7);
        if (principalFilter === 'Unilever') return unileverAmount;
        if (principalFilter === 'Pureit') return amount - unileverAmount;
        return amount;
      };
      const variance = scopedAmount(route.variance);
      return {
        ...route,
        expected: scopedAmount(route.expected),
        collected: scopedAmount(route.collected),
        credit: scopedAmount(route.credit),
        variance,
        status: route.status === 'EXCEPTION' && variance === 0 ? 'OK' as const : route.status,
      };
    }), [depotFilter, principalFilter, state.routes]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (window.innerWidth < 640) {
          setMobileSearchOpen(true);
          window.setTimeout(() => mobileSearchRef.current?.focus(), 0);
        } else {
          searchRef.current?.focus();
        }
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'i') {
        event.preventDefault();
        if (isPortfolioView) router.push(getBusinessRoute('unilever-distribution'));
        setQuickAction('invoice');
      }
      if (event.key === 'Escape') {
        setQuickAction(null);
        setCompanyMenuOpen(false);
        setProfileMenuOpen(false);
        setNotificationsOpen(false);
        setMobileNavOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isPortfolioView, router]);

  const prepareSectionNavigation = (id: string) => {
    const targetBusinessId = isPortfolioView ? 'unilever-distribution' : activeBusinessId;
    if (isPortfolioView) {
      setPrincipalFilter('All principals', targetBusinessId);
      setDepotFilter('All depots', targetBusinessId);
    }
    setGlobalSearch('');
    setTransactionSearch('');
    if (id === 'ai-assistant') setAiOpen(true);
    setShowAllTransactions(false);
    return getBusinessRoute(targetBusinessId, id);
  };

  const goTo = (id: string) => {
    if (id === 'business-portfolio') {
      selectBusiness('all');
      return;
    }
    setMobileNavOpen(false);
    const nextPath = prepareSectionNavigation(id);
    if (pathname !== nextPath) router.push(nextPath, { scroll: false });
  };

  const openSearchSection = () => {
    const targetBusinessId = isPortfolioView ? 'unilever-distribution' : activeBusinessId;
    if (isPortfolioView) {
      setPrincipalFilter('All principals', targetBusinessId);
      setDepotFilter('All depots', targetBusinessId);
    }
    const nextPath = getBusinessRoute(targetBusinessId, 'general-ledger');
    if (pathname !== nextPath) router.push(nextPath, { scroll: false });
  };

  useEffect(() => {
    const [root, businessId, routeSection] = pathname.split('/').filter(Boolean);
    if (root !== 'businesses') return;
    if (!businessId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const nextSection = sectionIdsByRouteName[routeSection ?? 'overview'];
    if (!nextSection || pathname.split('/').filter(Boolean).length > 3) return;
    const targetId = nextSection === 'invoicing' || nextSection === 'expenses' ? 'general-ledger' : nextSection;
    if (nextSection === 'overview') window.scrollTo({ top: 0, behavior: 'smooth' });
    else document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [pathname]);

  const openQuickAction = (action: QuickAction) => {
    if (isPortfolioView) selectBusiness('unilever-distribution');
    setFormDescription('');
    setFormAmount('');
    setFormPrincipal(principalFilter === 'All principals' ? 'Unilever' : principalFilter);
    setFormDepot(depotFilter === 'All depots' ? 'Sherpur' : depotFilter);
    setQuickAction(action);
  };

  const saveQuickAction = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amount = Number(formAmount);
    if (!formDescription.trim() || !Number.isFinite(amount) || amount <= 0) return;
    const isInvoice = quickAction === 'invoice';
    const targetBusinessId = activeBusinessId === 'all' ? 'unilever-distribution' : activeBusinessId;
    const row: LedgerRow = {
      id: `local-${Date.now()}`,
      businessId: targetBusinessId,
      date: 'Today',
      description: formDescription.trim(),
      party: isInvoice ? 'New customer' : 'New expense',
      principal: formPrincipal,
      depot: formDepot,
      category: isInvoice ? 'Customer invoice' : 'Operating expense',
      method: isInvoice ? 'Invoice' : 'Manual entry',
      amount: isInvoice ? amount : -amount,
      status: isInvoice ? 'Pending' : 'Paid',
      kind: isInvoice ? 'Invoicing' : 'Expenses',
      ageDays: 0,
    };
    setLocalRows((previous) => [row, ...previous]);
    if (targetBusinessId === 'unilever-distribution') {
      setPrincipalFilter(formPrincipal, targetBusinessId);
      setDepotFilter(formDepot, targetBusinessId);
    } else {
      setBusinesses((previous) => previous.map((business) => business.id === targetBusinessId
        ? { ...business, status: 'Active' }
        : business));
    }
    setQuickAction(null);
    const nextPath = getBusinessRoute(targetBusinessId, isInvoice ? 'invoicing' : 'expenses');
    if (pathname !== nextPath) router.push(nextPath, { scroll: false });
    showToast(`${isInvoice ? 'Invoice' : 'Expense'} added to the local demo ledger`);
  };

  const runAssistantQuery = (question = aiQuery) => {
    const normalized = question.trim().toLowerCase();
    if (!normalized) return;
    setAiQuery(question);
    if (/30\s*days|overdue|aging|aged/.test(normalized)) {
      setAiResponse('Invoice aging is not included in this demo ledger, so I can’t verify which invoices are more than 30 days overdue. The current sample ledger has no aging history.');
      return;
    }
    if (/unpaid|pending|invoice|receivable/.test(normalized)) {
      const pending = filteredRows.filter((row) => !row.referenceOnly && row.status === 'Pending' && (row.kind === 'Invoicing' || row.kind === 'Payable'));
      setTransactionSearch('');
      setAiResponse(`I found ${pending.filter((row) => row.kind === 'Invoicing').length} pending market-credit entries in the sample ledger. They are from today's route activity; invoice due dates are not available.`);
      goTo('invoicing');
      return;
    }
    if (/cash|liquid|bank|balance/.test(normalized)) {
      setAiResponse(`Illustrative available cash is ${formatBDT(liquidCash)} across bank and vault for the selected portfolio scope. Today's route collections total ${formatBDT(collectedToday)}.`);
      return;
    }
    if (/payable|supplier|debit/.test(normalized)) {
      setAiResponse(`The illustrative supplier auto-debit for the selected scope is ${formatBDT(portfolio.upcomingObligation)}, due in ${state.obligationDueHours} hours.`);
      return;
    }
    setAiResponse('Try asking about available cash, pending invoices, or supplier payables. I can only answer from the sample data currently shown.');
  };

  const getAlertAction = (alert: typeof activeAlerts[number]) => {
    if (isPortfolioView) selectBusiness('unilever-distribution');
    if (alert.actionKey === 'REVIEW_VARIANCE') openDrawer('RECONCILIATION');
    else if (alert.actionKey === 'REVIEW_OBLIGATION') openDrawer('OBLIGATION');
    else if (alert.actionKey === 'SIMULATE_REPLACEMENT') openDrawer('INCIDENT');
    else resolveAlert(alert.id);
    setNotificationsOpen(false);
  };

  const renderSidebarNavItems = (items: typeof dailyWorkItems | typeof insightItems, isMobile: boolean) => items.map(({ id, label, icon: Icon }) => {
    const selected = activeSection === id;
    const targetBusinessId = isPortfolioView ? 'unilever-distribution' : activeBusinessId;
    return (
      <Link
        key={id}
        href={getBusinessRoute(targetBusinessId, id)}
        onClick={() => {
          prepareSectionNavigation(id);
          setMobileNavOpen(false);
        }}
        aria-current={selected ? 'page' : undefined}
        title={collapsed && !isMobile ? label : undefined}
        className={`accounting-focus flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] transition-colors ${
          selected
            ? 'bg-emerald-500/15 font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-400/15'
            : 'text-slate-400 hover:bg-white/[0.06] hover:text-slate-100'
        }`}
      >
        <Icon size={18} strokeWidth={1.8} className="shrink-0" />
        {(!collapsed || isMobile) && <span>{label}</span>}
        {id === 'bank-reconciliation' && activeAlerts.length > 0 && (!collapsed || isMobile) && (
          <span className="ml-auto rounded-md bg-rose-400/15 px-1.5 py-0.5 text-[10px] font-semibold text-rose-300">{activeAlerts.length}</span>
        )}
      </Link>
    );
  });

  const renderSidebar = (isMobile = false) => (
    <aside className={`accounting-sidebar flex h-full flex-col overflow-y-auto text-white ${collapsed && !isMobile ? 'w-[76px]' : 'w-[252px]'} ${isMobile ? 'w-[280px]' : ''} transition-[width] duration-200`}>
      <div className="flex h-[76px] items-center gap-3 border-b border-white/10 px-5">
        <Link
          href="/"
          aria-label="distroMesh home"
          title="Go to distroMesh home"
          onClick={() => setMobileNavOpen(false)}
          className="accounting-focus flex min-w-0 flex-1 items-center gap-3 rounded-lg"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-[#0e2820] shadow-lg shadow-emerald-950/30">
            <Building2 size={19} strokeWidth={2} />
          </span>
          {(!collapsed || isMobile) && (
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold tracking-wide">distroMesh</span>
              <span className="mt-0.5 block text-[10px] font-medium tracking-wide text-emerald-300">Business workspace</span>
            </span>
          )}
        </Link>
        {isMobile && (
          <button onClick={() => setMobileNavOpen(false)} aria-label="Close navigation" className="accounting-focus rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="px-3 pt-6">
      {(!collapsed || isMobile) && <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Your workspace</p>}
        <nav aria-label="Workspace navigation" className="space-y-1">
          <button
            onClick={() => {
              if (collapsed && !isMobile) {
                setCollapsed(false);
                setBusinessNavExpanded(true);
              } else {
                setBusinessNavExpanded((expanded) => !expanded);
              }
            }}
            aria-expanded={businessNavExpanded && (!collapsed || isMobile)}
            title={collapsed && !isMobile ? 'Businesses · expand navigation' : undefined}
            className={`accounting-focus flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] transition-colors ${
              isPortfolioView || activeSection === 'overview' || activeSection === 'related-businesses'
                ? 'bg-white/[0.075] font-semibold text-white'
                : 'text-slate-400 hover:bg-white/[0.06] hover:text-slate-100'
            }`}
          >
            <BriefcaseBusiness size={18} strokeWidth={1.8} className="shrink-0 text-emerald-300" />
            {(!collapsed || isMobile) && <><span className="flex-1">Businesses</span><ChevronDown size={15} className={`transition-transform duration-200 ${businessNavExpanded ? 'rotate-180' : ''}`} /></>}
          </button>
          <div className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${businessNavExpanded && (!collapsed || isMobile) ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="min-h-0 overflow-hidden">
              <div className="ml-[21px] space-y-0.5 border-l border-white/10 py-1 pl-2.5">
                <Link
                  href="/businesses"
                  onClick={() => {
                    prepareBusinessSelection('all');
                    setMobileNavOpen(false);
                  }}
                  aria-current={isPortfolioView ? 'page' : undefined}
                  className={`accounting-focus flex min-h-10 w-full items-center gap-2.5 rounded-lg px-2.5 text-left text-[12px] transition-colors ${isPortfolioView ? 'bg-emerald-500/15 font-semibold text-emerald-300' : 'text-slate-400 hover:bg-white/[0.06] hover:text-slate-100'}`}
                >
                  <Building2 size={15} strokeWidth={1.8} className="shrink-0" />
                  <span>All businesses</span>
                </Link>
                {(!collapsed || isMobile) && (
                  <p className="px-2.5 pb-1 pt-3 text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                    Your businesses
                  </p>
                )}
                {businesses.map((business) => {
                  const selected = business.id === activeBusinessId;
                  return (
                    <Link
                      key={business.id}
                      href={getBusinessRoute(business.id, 'overview')}
                      onClick={() => {
                        prepareBusinessSelection(business.id);
                        setMobileNavOpen(false);
                      }}
                      aria-current={selected ? 'page' : undefined}
                      title={collapsed && !isMobile ? business.name : undefined}
                      className={`accounting-focus flex min-h-10 w-full items-center gap-2.5 rounded-lg px-2.5 text-left text-[12px] transition-colors ${selected ? 'bg-emerald-500/15 font-semibold text-emerald-300' : 'text-slate-400 hover:bg-white/[0.06] hover:text-slate-100'}`}
                    >
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${selected ? 'bg-emerald-300' : 'bg-slate-500'}`} />
                      <span className="min-w-0 flex-1 truncate">{business.name}</span>
                      {selected && (!collapsed || isMobile) && <span className="text-[9px] font-medium text-emerald-200">OPEN</span>}
                    </Link>
                  );
                })}
                {!isPortfolioView && (
                  <>
                    {(!collapsed || isMobile) && (
                      <p className="px-2.5 pb-1 pt-3 text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                        Current business
                      </p>
                    )}
                    {[
                      { id: 'overview', label: 'Overview', icon: LayoutDashboard, selected: activeSection === 'overview' },
                      { id: 'business-performance', label: 'Sales & operations', icon: Activity, selected: activeSection === 'business-performance' },
                      { id: 'related-businesses', label: 'Connected businesses', icon: GitBranch, selected: activeSection === 'related-businesses' },
                    ].map(({ id, label, icon: Icon, selected }) => (
                  <Link
                    key={id}
                    href={getBusinessRoute(activeBusinessId, id)}
                    onClick={() => {
                      setMobileNavOpen(false);
                      prepareSectionNavigation(id);
                    }}
                    aria-current={selected ? 'page' : undefined}
                    className={`accounting-focus flex min-h-10 w-full items-center gap-2.5 rounded-lg px-2.5 text-left text-[12px] transition-colors ${selected ? 'bg-emerald-500/15 font-semibold text-emerald-300' : 'text-slate-400 hover:bg-white/[0.06] hover:text-slate-100'}`}
                  >
                    <Icon size={15} strokeWidth={1.8} className="shrink-0" /><span>{label}</span>
                    {id === 'related-businesses' && activeRelatedBusinesses.length > 0 && <span className="ml-auto rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] tabular-nums">{activeRelatedBusinesses.length}</span>}
                  </Link>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {!isPortfolioView && (
          <>
            {(!collapsed || isMobile) && <p className="mb-2 mt-6 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Daily work insights</p>}
            <nav aria-label="Daily work and insights navigation" className="space-y-1">
              {renderSidebarNavItems(dailyWorkItems, isMobile)}
            </nav>
          </>
        )}
        {!isPortfolioView && (
          <>
            {(!collapsed || isMobile) && <p className="mb-2 mt-6 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Insights &amp; help</p>}
            <nav aria-label="Insights and help navigation" className="space-y-1">
              {renderSidebarNavItems(insightItems, isMobile)}
            </nav>
          </>
        )}
        {!isPortfolioView && (!collapsed || isMobile) && (
          <section aria-label="Business focus" className="mt-4 rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.06] p-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-emerald-200">Today&apos;s focus</p>
            <p className="mt-2 text-[12px] font-semibold text-slate-100">{businessFocus.title}</p>
            <p className="mt-1 text-[10px] leading-relaxed text-slate-400">{businessFocus.detail}</p>
            <Link
              href={getBusinessRoute(activeBusinessId, businessFocus.section)}
              onClick={() => {
                prepareSectionNavigation(businessFocus.section);
                setMobileNavOpen(false);
              }}
              className="accounting-focus mt-2 inline-flex items-center gap-1 rounded-md py-1 text-[10px] font-semibold text-emerald-300 hover:text-emerald-200"
            >
              Review this <ArrowRight size={11} />
            </Link>
            <Link
              href={getBusinessRoute(activeBusinessId, 'ai-assistant')}
              onClick={() => {
                prepareSectionNavigation('ai-assistant');
                setMobileNavOpen(false);
              }}
              className="accounting-focus ml-3 inline-flex items-center gap-1 rounded-md py-1 text-[10px] font-medium text-slate-300 hover:text-white"
            >
              Get help <ArrowRight size={11} />
            </Link>
          </section>
        )}
      </div>

      <div className="mt-auto px-3 pb-4">
        {(!collapsed || isMobile) && (
          <div className="mb-3 rounded-2xl border border-white/10 bg-white/[0.045] p-3.5">
            <div className="flex items-center gap-2 text-[11px] font-medium text-slate-300">
              <ShieldCheck size={15} className="text-emerald-400" />
              Demo workspace
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-500">Example figures only. Not connected to a bank or accounting system.</p>
          </div>
        )}
        <button
          onClick={() => openDrawer('SIMULATION')}
          title={collapsed && !isMobile ? 'Demo controls' : undefined}
          className="accounting-focus flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          <Settings2 size={18} className="shrink-0" />
          {(!collapsed || isMobile) && <span>Demo controls</span>}
        </button>
      </div>
    </aside>
  );

  const renderTransactionRows = (rows: LedgerRow[]) => rows.map((row) => (
    <tr
      key={row.id}
      onClick={() => row.routeId && openDrawer('ROUTE_DETAIL', row.routeId)}
      className={`border-b border-[#edf1ef] last:border-0 ${row.routeId ? 'cursor-pointer hover:bg-[#f8faf9]' : ''}`}
    >
      <td className="whitespace-nowrap px-5 py-3.5 text-[12px] text-[#74807c]">{row.date}</td>
      <td className="min-w-[220px] px-5 py-3.5">
        <div className="text-[13px] font-semibold text-[#25312c]">{row.description}</div>
        <div className="mt-0.5 text-[11px] text-[#83908b]">{row.party}</div>
      </td>
      <td className="whitespace-nowrap px-5 py-3.5">
        <span className={`rounded-md px-2 py-1 text-[11px] font-medium ${row.referenceOnly ? 'bg-[#f4f1fb] text-[#75669e]' : 'bg-[#f1f5f3] text-[#65726c]'}`}>
          {row.referenceOnly ? `Reference · ${businesses.find((business) => business.id === row.referenceSourceBusinessId)?.name ?? 'Source'}` : row.category}
        </span>
      </td>
      <td className="whitespace-nowrap px-5 py-3.5 text-[12px] text-[#65726c]">{row.method}</td>
      <td className={`whitespace-nowrap px-5 py-3.5 text-right text-[13px] font-semibold tabular-nums ${row.amount < 0 ? 'text-[#b74750]' : 'text-[#23312b]'}`}>
        {row.referenceOnly ? '—' : `${row.amount < 0 ? '−' : '+'}${compactCurrency(Math.abs(row.amount))}`}
      </td>
      <td className="whitespace-nowrap px-5 py-3.5 text-right">
        {row.referenceOnly ? (
          <span className="inline-flex rounded-full bg-[#f4f1fb] px-2.5 py-1 text-[10px] font-semibold text-[#75669e]">Reference only</span>
        ) : <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          row.status === 'Paid' ? 'bg-[#eaf5ef] text-[#117354]'
            : row.status === 'Overdue' ? 'bg-[#fbeded] text-[#ac424b]'
              : 'bg-[#fff5e7] text-[#9a6819]'
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${row.status === 'Paid' ? 'bg-[#16865f]' : row.status === 'Overdue' ? 'bg-[#c8525c]' : 'bg-[#d89b32]'}`} />
          {row.status}
        </span>}
      </td>
    </tr>
  ));

  if (hasInvalidRoute) return null;

  if (!isPortfolioView && !activeBusiness) {
    return (
      <main className="accounting-app flex min-h-screen items-center justify-center px-5 py-16">
        <section className="glass-card w-full max-w-lg rounded-3xl p-8 text-center sm:p-10">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e9f5f0] text-[#087e63]">
            <Building2 size={22} />
          </span>
          <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#358367]">Workspace unavailable</p>
          <h1 className="mt-2 text-[26px] font-semibold tracking-[-0.04em] text-[#23332c]">This business could not be found.</h1>
          <p className="mx-auto mt-3 max-w-sm text-[13px] leading-6 text-[#718078]">
            It may have been added in another browser session. Demo workspaces are local to the current session.
          </p>
          <Link href="/businesses" className="accounting-focus mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[#087e63] px-4 text-[12px] font-semibold text-white hover:bg-[#086d56]">
            Return to all businesses <ArrowRight size={15} />
          </Link>
        </section>
      </main>
    );
  }

  return (
    <div className="accounting-app min-h-screen text-[#1c2924]">
      <div className="min-h-screen">
        <div className={`accounting-sidebar fixed inset-y-0 left-0 z-40 hidden md:block ${collapsed ? 'w-[76px]' : 'w-[252px]'}`}>
          {renderSidebar()}
          <button
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="accounting-focus absolute left-[238px] top-1/2 z-20 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#20302d] text-slate-300 shadow-lg transition-all hover:bg-[#30433e] md:flex"
            style={{ left: collapsed ? 62 : 238 }}
          >
            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>

        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <button className="absolute inset-0 bg-[#0c1714]/55" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation overlay" />
            <div className="absolute inset-y-0 left-0 shadow-2xl">{renderSidebar(true)}</div>
          </div>
        )}

        <div className={`min-w-0 transition-[margin] duration-200 ${collapsed ? 'md:ml-[76px]' : 'md:ml-[252px]'}`}>
          <header className="sticky top-0 z-30 border-b border-[#e6ece9]/90 bg-white/90 backdrop-blur-xl">
            <div className="flex h-[72px] items-center gap-3 px-4 sm:px-6 lg:px-8">
              <button
                onClick={() => setMobileNavOpen(true)}
                aria-label="Open navigation"
                className="accounting-focus rounded-lg p-2 text-[#53615b] hover:bg-[#f0f4f2] md:hidden"
              >
                <Menu size={20} />
              </button>
              <button
                onClick={() => {
                  setMobileSearchOpen((value) => !value);
                  window.setTimeout(() => mobileSearchRef.current?.focus(), 0);
                }}
                aria-label="Search the ledger"
                className="accounting-focus rounded-lg p-2 text-[#53615b] hover:bg-[#f0f4f2] sm:hidden"
              >
                <Search size={18} />
              </button>
              <div className="relative hidden min-w-0 flex-1 sm:block sm:max-w-[440px]">
                <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#84908b]" />
                <input
                  ref={searchRef}
                  value={globalSearch}
                  onChange={(event) => {
                    setGlobalSearch(event.target.value);
                    setTransactionSearch(event.target.value);
                  }}
                  onFocus={openSearchSection}
                  placeholder="Search transactions, invoices..."
                  aria-label="Search the ledger"
                  className="accounting-focus h-10 w-full rounded-xl border border-[#e8eeeb] bg-[#f8faf9] pl-10 pr-16 text-[13px] text-[#24322c] placeholder:text-[#9aa59f]"
                />
                <span className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-md border border-[#e4eae7] bg-white px-1.5 py-1 text-[10px] text-[#8a9691]">
                  <Command size={11} /> K
                </span>
              </div>

              <div className="relative ml-auto">
                <button
                  onClick={() => setCompanyMenuOpen((value) => {
                    if (value) setBusinessSearch('');
                    return !value;
                  })}
                  aria-expanded={companyMenuOpen}
                  aria-label="Choose a business"
                  className="accounting-focus flex items-center gap-2 rounded-xl px-2.5 py-2 text-left hover:bg-[#f4f7f5] sm:px-3"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8f3ed] text-[#087e63]"><Building2 size={16} /></span>
                  <span className="hidden min-w-0 sm:block">
                    <span className="block max-w-[180px] truncate text-[12px] font-semibold text-[#26342e]">{isPortfolioView ? 'All businesses' : activeBusiness?.name ?? 'Business workspace'}</span>
                    <span className="block text-[10px] text-[#8a9691]">{isPortfolioView ? `${businesses.length} in portfolio` : activeBusiness?.location ?? 'Select a business'}</span>
                  </span>
                  <ChevronDown size={14} className="hidden text-[#87938d] sm:block" />
                </button>
                {companyMenuOpen && (
                  <div className="absolute right-0 top-12 z-40 w-[min(320px,calc(100vw-24px))] rounded-2xl border border-[#e5ebe8] bg-white p-2 shadow-xl">
                    <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#91a099]">Portfolio</p>
                    <button onClick={() => selectBusiness('all')} className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[12px] font-semibold transition ${isPortfolioView ? 'bg-[#f1f7f4] text-[#2c3933]' : 'text-[#637169] hover:bg-[#f7f9f8]'}`}>
                      <BriefcaseBusiness size={15} className="text-[#087e63]" /> All businesses
                      {isPortfolioView && <Check size={14} className="ml-auto text-[#087e63]" />}
                    </button>
                    <p className="px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-wider text-[#91a099]">Open a business</p>
                    <div className="relative px-2 pb-2">
                      <Search size={14} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#9aa59f]" />
                      <input
                        value={businessSearch}
                        onChange={(event) => setBusinessSearch(event.target.value)}
                        aria-label="Search businesses"
                        placeholder="Find a business"
                        className="accounting-focus h-9 w-full rounded-lg border border-[#e8eeeb] bg-[#f8faf9] pl-8 pr-3 text-[11px] text-[#34423b] placeholder:text-[#9aa59f]"
                      />
                    </div>
                    <div className="max-h-56 space-y-1 overflow-y-auto">
                      {businesses
                        .filter((business) => `${business.name} ${business.industry} ${business.location}`.toLowerCase().includes(businessSearch.trim().toLowerCase()))
                        .map((business) => (
                        <button key={business.id} onClick={() => selectBusiness(business.id)} className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[12px] transition ${activeBusinessId === business.id ? 'bg-[#f1f7f4] font-semibold text-[#2c3933]' : 'text-[#637169] hover:bg-[#f7f9f8]'}`}>
                          <Building2 size={15} className="shrink-0 text-[#84918a]" />
                          <span className="min-w-0 flex-1 truncate">{business.name}</span>
                          {activeBusinessId === business.id && <Check size={14} className="shrink-0 text-[#087e63]" />}
                        </button>
                      ))}
                      {businesses.every((business) => !`${business.name} ${business.industry} ${business.location}`.toLowerCase().includes(businessSearch.trim().toLowerCase())) && (
                        <p className="px-3 py-3 text-[10px] text-[#89958f]">No matching businesses.</p>
                      )}
                    </div>
                    <button onClick={() => { setCompanyMenuOpen(false); setBusinessModalMode('standalone'); setBusinessOnboardingOpen(true); }} className="mt-2 flex w-full items-center gap-2 rounded-xl border-t border-[#edf1ef] px-3 py-3 text-left text-[11px] font-semibold text-[#087e63] hover:bg-[#f7faf8]">
                      <Plus size={15} /> Add a business
                    </button>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen((value) => !value)}
                  aria-label={`Notifications, ${activeAlerts.length} active`}
                  aria-expanded={notificationsOpen}
                  className="accounting-focus relative rounded-xl p-2.5 text-[#627069] transition-colors hover:bg-[#f1f5f3] hover:text-[#25342d]"
                >
                  <Bell size={18} />
                  {activeAlerts.length > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-[#cb5961]" />}
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 top-12 z-40 w-[min(360px,calc(100vw-24px))] rounded-2xl border border-[#e5ebe8] bg-white p-3 shadow-xl">
                    <div className="flex items-center justify-between px-2 pb-2">
                      <p className="text-[13px] font-semibold text-[#25342d]">Notifications</p>
                      <span className="rounded-full bg-[#fbeded] px-2 py-0.5 text-[10px] font-semibold text-[#a74850]">{activeAlerts.length} open</span>
                    </div>
                    {activeAlerts.length === 0 ? <p className="p-3 text-[12px] text-[#77847e]">You’re all caught up.</p> : activeAlerts.slice(0, 4).map((alert) => (
                      <button key={alert.id} onClick={() => getAlertAction(alert)} className="flex w-full items-start gap-2.5 rounded-xl p-2.5 text-left hover:bg-[#f7f9f8]">
                        <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${alert.severity === 'CRITICAL' ? 'bg-[#c84d57]' : alert.severity === 'WARNING' ? 'bg-[#d59a2d]' : 'bg-[#4d8bc1]'}`} />
                        <span className="min-w-0"><span className="block text-[12px] font-medium text-[#33413b]">{alert.title}</span><span className="mt-1 block text-[10px] text-[#89948f]">{alert.timestamp} · Open details</span></span>
                        <ChevronRight size={15} className="mt-1 shrink-0 text-[#a3ada8]" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen((value) => !value)}
                  aria-label="Open user profile menu"
                  aria-expanded={profileMenuOpen}
                  className="accounting-focus flex items-center gap-2 rounded-xl p-1.5 hover:bg-[#f1f5f3]"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dfece5] text-[11px] font-bold text-[#2b7259]">AR</span>
                  <span className="hidden text-left lg:block"><span className="block text-[11px] font-semibold text-[#34413b]">Admin</span><span className="block text-[10px] text-[#8a9691]">Owner</span></span>
                  <ChevronDown size={13} className="hidden text-[#87938d] lg:block" />
                </button>
                {profileMenuOpen && (
                  <div className="absolute right-0 top-12 z-40 w-48 rounded-2xl border border-[#e5ebe8] bg-white p-2 shadow-xl">
                    <p className="px-3 py-2 text-[12px] font-semibold text-[#33413b]">Account settings</p>
                    <button onClick={() => { setProfileMenuOpen(false); showToast('Profile settings are not configured in this demo'); }} className="w-full rounded-lg px-3 py-2 text-left text-[12px] text-[#68746e] hover:bg-[#f5f8f6]">Profile & preferences</button>
                    <button onClick={() => { setProfileMenuOpen(false); showToast('You are viewing the local demo workspace'); }} className="w-full rounded-lg px-3 py-2 text-left text-[12px] text-[#68746e] hover:bg-[#f5f8f6]">Workspace security</button>
                  </div>
                )}
              </div>
            </div>
            {mobileSearchOpen && (
              <div className="px-4 pb-3 sm:hidden">
                <div className="relative">
                  <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#84908b]" />
                  <input
                    ref={mobileSearchRef}
                    value={globalSearch}
                    onChange={(event) => {
                      setGlobalSearch(event.target.value);
                      setTransactionSearch(event.target.value);
                    }}
                    onFocus={openSearchSection}
                    placeholder="Search transactions, invoices..."
                    aria-label="Search the ledger"
                    className="accounting-focus h-10 w-full rounded-xl border border-[#e8eeeb] bg-[#f8faf9] pl-9 pr-10 text-[13px] text-[#24322c] placeholder:text-[#9aa59f]"
                  />
                  <button onClick={() => { setMobileSearchOpen(false); setGlobalSearch(''); setTransactionSearch(''); }} aria-label="Close search" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#87938d] hover:bg-[#ebf0ed]"><X size={15} /></button>
                </div>
              </div>
            )}
          </header>

          <main id="overview" className="mx-auto w-full max-w-[1600px] px-4 pb-12 pt-7 sm:px-6 lg:px-8">
            {isPortfolioView ? (
              <BusinessPortfolioOverview
                businesses={businesses}
                relationships={relationships}
                metrics={businessMetrics}
                onSelectBusiness={selectBusiness}
                onAddBusiness={() => { setBusinessModalMode('standalone'); setBusinessOnboardingOpen(true); }}
              />
            ) : activeBusiness && activeBusiness.id !== 'unilever-distribution' ? (
              <NewBusinessWorkspace
                business={activeBusiness}
                businesses={businesses}
                relationships={relationships}
                metrics={businessMetrics}
                invoiceCount={localRows.filter((row) => row.businessId === activeBusiness.id && !row.referenceOnly && row.kind === 'Invoicing').length}
                expenseCount={localRows.filter((row) => row.businessId === activeBusiness.id && !row.referenceOnly && row.kind === 'Expenses').length}
                openInvoiceTotal={localRows
                  .filter((row) => row.businessId === activeBusiness.id && !row.referenceOnly && row.kind === 'Invoicing' && row.status !== 'Paid')
                  .reduce((total, row) => total + row.amount, 0)}
                entries={allRows
                  .filter((row) => row.businessId === activeBusiness.id)
                  .map((row) => ({
                    id: row.id,
                    date: row.date,
                    description: row.description,
                    kind: row.kind,
                    amount: row.amount,
                    status: row.status,
                    referenceOnly: Boolean(row.referenceOnly),
                    referenceSourceName: businesses.find((business) => business.id === row.referenceSourceBusinessId)?.name,
                  }))}
                transactionFilter={transactionFilter}
                onBackToPortfolio={() => selectBusiness('all')}
                onOpenBusiness={selectBusiness}
                onAddRelatedBusiness={(businessId) => {
                  selectBusiness(businessId);
                  setBusinessModalMode('related');
                  setBusinessOnboardingOpen(true);
                }}
                onLinkBusiness={(businessId) => {
                  selectBusiness(businessId);
                  setBusinessModalMode('link');
                  setBusinessOnboardingOpen(true);
                }}
                onCreateInvoice={() => openQuickAction('invoice')}
                onAddExpense={() => openQuickAction('expense')}
              />
            ) : (
            <>
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <div className="mb-2 flex items-center gap-2 text-[11px] font-medium text-[#7e8c85]">
                  <span>Workspace</span><ChevronRight size={12} /><span className="text-[#3f5148]">Overview</span>
                  <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-[#eaf5ef] px-2 py-0.5 text-[10px] font-semibold text-[#26765a]"><span className="h-1.5 w-1.5 rounded-full bg-[#29926a]" />Demo data</span>
                </div>
                <h1 className="text-[25px] font-semibold tracking-[-0.035em] text-[#1f2d26] sm:text-[29px]">{activeBusiness?.name ?? 'Distribution executive dashboard'}</h1>
                <p className="mt-1 text-[13px] text-[#74817b]">{activeBusiness?.industry ?? 'Consumer goods distribution'} · {activeBusiness?.location ?? 'Sherpur & Bogura, Bangladesh'}.</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="rounded-full border border-[#e4ebe7] bg-white px-2.5 py-1 text-[9px] font-medium text-[#65736b]">Unilever · Pureit</span>
                  <span className="rounded-full border border-[#e4ebe7] bg-white px-2.5 py-1 text-[9px] font-medium text-[#65736b]">Sherpur · Bogura depots</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={() => openQuickAction('expense')} className="accounting-focus inline-flex h-9 items-center gap-2 rounded-xl border border-[#d8e8df] bg-white px-3 text-[11px] font-semibold text-[#087e63] hover:bg-[#f5faf7]">
                  <Plus size={14} /> Add expense
                </button>
                <button onClick={() => openQuickAction('invoice')} className="accounting-focus inline-flex h-9 items-center gap-2 rounded-xl bg-[#087e63] px-3.5 text-[12px] font-semibold text-white shadow-sm shadow-emerald-900/15 transition hover:bg-[#086d56]">
                  <Plus size={16} /> Create invoice
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
            <section aria-label="Portfolio filters" className="glass-card order-1 flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-[13px] font-semibold text-[#2c3a33]">Narrow this view</h2>
                <p className="mt-1 text-[11px] text-[#7a8781]">Show results for a specific brand or location.</p>
              </div>
              <div className="flex flex-wrap items-end gap-2">
                <label className="text-[10px] font-medium text-[#68766f]">
                  Brand
                  <select
                    value={principalFilter}
                    onChange={(event) => setPrincipalFilter(event.target.value as PrincipalFilter)}
                    className="accounting-focus mt-1 block h-9 min-w-36 rounded-lg border border-[#e1e8e4] bg-white px-3 text-[12px] text-[#34423b]"
                  >
                    {principalOptions.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </label>
                <label className="text-[10px] font-medium text-[#68766f]">
                  Location
                  <select
                    value={depotFilter}
                    onChange={(event) => setDepotFilter(event.target.value as DepotFilter)}
                    className="accounting-focus mt-1 block h-9 min-w-32 rounded-lg border border-[#e1e8e4] bg-white px-3 text-[12px] text-[#34423b]"
                  >
                    {depotOptions.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </label>
                <span className="mb-2 rounded-full bg-[#eaf5ef] px-2.5 py-1 text-[10px] font-semibold text-[#26765a]">
                  Illustrative BDT data
                </span>
              </div>
            </section>

            <section id="related-businesses" aria-label="Related businesses" className="glass-card order-3 scroll-mt-24 rounded-2xl p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <BriefcaseBusiness size={15} className="text-[#087e63]" />
                      <h2 className="text-[14px] font-semibold text-[#2c3a33]">Connected businesses</h2>
                      <span className="rounded-full bg-[#eef5f1] px-2 py-0.5 text-[10px] font-semibold text-[#4c7560]">{activeRelatedBusinesses.length + 1} businesses</span>
                    </div>
                    <p className="mt-1 text-[11px] text-[#7a8781]">These businesses are linked to {activeBusiness?.name}. Their money and records stay separate.</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button onClick={() => { setBusinessModalMode('related'); setBusinessOnboardingOpen(true); }} className="accounting-focus inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#087e63] px-3 text-[10px] font-semibold text-white hover:bg-[#086d56]"><Plus size={13} /> Add a connected business</button>
                    {businesses.some((candidate) => candidate.id !== activeBusinessId && !activeRelatedBusinesses.some((item) => item.business.id === candidate.id)) && (
                      <button onClick={() => { setBusinessModalMode('link'); setBusinessOnboardingOpen(true); }} className="accounting-focus inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#dfe8e3] bg-white px-3 text-[10px] font-semibold text-[#53615a] hover:bg-[#f5f8f6]"><Share2 size={13} /> Connect existing</button>
                    )}
                  </div>
                </div>
                {activeRelatedBusinesses.length === 0 && <p className="mt-3 rounded-xl border border-dashed border-[#dfe8e3] bg-[#fbfdfc] p-4 text-[11px] text-[#77857e]">No connected businesses yet. Add a new business or connect one already in your list.</p>}
                <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {[activeBusiness, ...activeRelatedBusinesses.map((item) => item.business)].filter((business): business is BusinessProfile => Boolean(business)).map((business) => {
                    const metrics = businessMetrics[business.id];
                    const relationship = activeRelatedBusinesses.find((item) => item.business.id === business.id)?.relationship;
                    return (
                      <button key={business.id} onClick={() => selectBusiness(business.id)} className={`accounting-focus rounded-xl border p-3 text-left transition hover:border-[#bdd8c8] hover:bg-[#fbfdfc] ${business.id === activeBusinessId ? 'border-[#bcd9c8] bg-[#f6faf7]' : 'border-[#e8eeeb] bg-white'}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-[11px] font-semibold text-[#34433b]">{business.name}</p>
                            <p className="mt-0.5 truncate text-[9px] text-[#87938d]">{business.industry} · {business.location}</p>
                            {relationship?.relationshipType && <span className="mt-1 inline-flex rounded-full bg-[#eef5f1] px-2 py-0.5 text-[9px] font-medium text-[#587362]">{relationship.parentBusinessId === activeBusinessId ? relationship.relationshipType : `Main business · ${relationship.relationshipType}`}</span>}
                          </div>
                          {business.id === activeBusinessId
                            ? <span className="rounded-full bg-[#eaf5ef] px-2 py-0.5 text-[8px] font-semibold text-[#26765a]">CURRENT</span>
                            : <ArrowRight size={13} className="shrink-0 text-[#87938d]" />}
                        </div>
                        <div className="mt-2 grid grid-cols-3 gap-2 border-t border-[#edf1ef] pt-2">
                          <span><span className="block text-[8px] text-[#87938d]">Cash</span><span className="mt-0.5 block text-[10px] font-semibold tabular-nums text-[#34433b]">{metrics?.availableCash == null ? 'Not available' : compactCurrency(metrics.availableCash)}</span></span>
                          <span><span className="block text-[8px] text-[#87938d]">Monthly revenue</span><span className="mt-0.5 block text-[10px] font-semibold tabular-nums text-[#34433b]">{metrics?.monthlyRevenue == null ? 'Not available' : compactCurrency(metrics.monthlyRevenue)}</span></span>
                          <span><span className="block text-[8px] text-[#87938d]">Invoices due</span><span className="mt-0.5 block text-[10px] font-semibold tabular-nums text-[#34433b]">{metrics?.receivables == null ? 'Not available' : compactCurrency(metrics.receivables)}</span></span>
                          <span><span className="block text-[8px] text-[#87938d]">Net profit</span><span className="mt-0.5 block text-[10px] font-semibold tabular-nums text-[#087e63]">{metrics?.monthlyNetProfit == null ? 'Not available' : compactCurrency(metrics.monthlyNetProfit)}</span></span>
                          <span><span className="block text-[8px] text-[#87938d]">Customers</span><span className="mt-0.5 block text-[10px] font-semibold tabular-nums text-[#34433b]">{(metrics?.customerCount ?? business.customerCount)?.toLocaleString('en-BD') ?? 'Not available'}</span></span>
                          <span><span className="block text-[8px] text-[#87938d]">Team</span><span className="mt-0.5 block text-[10px] font-semibold tabular-nums text-[#34433b]">{metrics?.employeeCount ?? business.employeeCount ?? 'Not available'}</span></span>
                        </div>
                      </button>
                    );
                  })}
                </div>
            </section>

            <section aria-label="Key financial metrics" className="order-2 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <article className="glass-card rounded-2xl p-4 sm:p-5">
                <div className="flex items-start justify-between">
                  <div><p className="text-[12px] font-medium text-[#68766f]">Available cash</p><p className="mt-3 text-[25px] font-semibold tracking-[-0.04em] text-[#223129] tabular-nums">{compactCurrency(liquidCash)}</p></div>
                  <span className="rounded-xl bg-[#eaf5ef] p-2.5 text-[#138061]"><Wallet size={18} /></span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-[#edf1ef] pt-3">
                  <span className="flex items-center gap-1 text-[11px] text-[#76837d]"><ArrowDownLeft size={13} className="text-[#138061]" /> Bank {compactCurrency(portfolio.bankCash)} + cash on hand {compactCurrency(portfolio.vaultCash)}</span>
                </div>
              </article>
              <article className="glass-card rounded-2xl p-4 sm:p-5">
                <div className="flex items-start justify-between">
                  <div><p className="text-[12px] font-medium text-[#68766f]">Monthly net profit</p><p className="mt-3 text-[25px] font-semibold tracking-[-0.04em] text-[#087e63] tabular-nums">{compactCurrency(portfolio.monthlyNetProfit)}</p></div>
                  <span className="rounded-xl bg-[#eaf5ef] p-2.5 text-[#138061]"><Activity size={18} /></span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-[#edf1ef] pt-3">
                  <span className="text-[11px] text-[#76837d]">After example interest and tax</span>
                  <span className="text-[11px] font-semibold text-[#087e63]">{formatPortfolioMargin(portfolio.monthlyNetProfit)} margin</span>
                </div>
              </article>
              <article className="glass-card rounded-2xl p-4 sm:p-5">
                <div className="flex items-start justify-between">
                  <div><p className="text-[12px] font-medium text-[#68766f]">Customer invoices due</p><p className="mt-3 text-[25px] font-semibold tracking-[-0.04em] text-[#223129] tabular-nums">{compactCurrency(portfolio.receivables)}</p></div>
                  <span className="rounded-xl bg-[#eef2fb] p-2.5 text-[#6477bd]"><ArrowDownRight size={18} /></span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-[#edf1ef] pt-3">
                  <span className="text-[11px] text-[#76837d]">Illustrative customer balances</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => goTo('invoicing')} className="text-[11px] font-semibold text-[#087e63] hover:underline">View invoices <ArrowRight size={12} className="ml-0.5 inline" /></button>
                  </div>
                </div>
              </article>
              <article className="glass-card rounded-2xl p-4 sm:p-5">
                <div className="flex items-start justify-between">
                  <div><p className="text-[12px] font-medium text-[#68766f]">Supplier payment due</p><p className="mt-3 text-[25px] font-semibold tracking-[-0.04em] text-[#b54c54] tabular-nums">{compactCurrency(portfolio.upcomingObligation)}</p></div>
                  <span className="rounded-xl bg-[#fbefef] p-2.5 text-[#b54c54]"><ArrowUpRight size={18} /></span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-[#edf1ef] pt-3">
                  <span className="text-[11px] text-[#76837d]">{principalFilter === 'Pureit' ? 'No payment in demo scope' : `Unilever · due in ${state.obligationDueHours}h`}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openDrawer('OBLIGATION')} className="text-[11px] font-semibold text-[#087e63] hover:underline">Review</button>
                  </div>
                </div>
              </article>
            </section>
            </div>

            <BusinessSalesOperations
              metrics={activePerformanceMetrics}
              businessId={activeBusinessId}
              trendUnavailableMessage={trendUnavailableMessage}
            />

            <section aria-label="Monthly financial summary" className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
              <article className="glass-card rounded-2xl p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-[15px] font-semibold text-[#25332c]">Monthly income &amp; expenses</h2>
                    <p className="mt-1 text-[11px] text-[#7a8781]">Example figures · BDT</p>
                  </div>
                  <span className="rounded-lg bg-[#eef5f1] px-2.5 py-1 text-[10px] font-semibold text-[#31745b]">26 working days</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-2.5 text-[12px] sm:grid-cols-3">
                  {[
                    { label: 'Revenue', amount: portfolio.monthlyRevenue, emphasis: true },
                    { label: 'Product costs', amount: -portfolio.monthlyCogs },
                    { label: 'Gross profit', amount: portfolio.monthlyGrossProfit, emphasis: true },
                    { label: 'Delivery cost', amount: -portfolio.monthlyDeliveryCost },
                    { label: 'Other operating costs', amount: -portfolio.monthlyFixedOverhead },
                    { label: 'Operating profit', amount: portfolio.monthlyEbit, emphasis: true },
                    { label: 'Interest', amount: -portfolio.monthlyInterest },
                    { label: 'Income tax', amount: -portfolio.monthlyTax },
                    { label: 'Net profit', amount: portfolio.monthlyNetProfit, emphasis: true },
                  ].map((item) => (
                    <div key={item.label} className={`flex items-center justify-between gap-2 border-b border-[#edf1ef] pb-2 ${item.emphasis ? 'font-semibold text-[#33433b]' : 'text-[#718078]'}`}>
                      <span>{item.label}</span>
                      <span className={`whitespace-nowrap tabular-nums ${item.amount < 0 ? 'text-[#9c6265]' : ''}`}>{formatBDT(item.amount)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[10px] text-[#7b8982]">
                  <span>Gross profit margin <strong className="text-[#53635a]">{formatPortfolioMargin(portfolio.monthlyGrossProfit)}</strong></span>
                  <span>Operating profit margin <strong className="text-[#53635a]">{formatPortfolioMargin(portfolio.monthlyEbit)}</strong></span>
                  <span>Net margin <strong className="text-[#53635a]">{formatPortfolioMargin(portfolio.monthlyNetProfit)}</strong></span>
                </div>
                <p className="mt-3 text-[10px] leading-relaxed text-[#87938d]">
                  Amounts are examples and can be filtered by brand or location. Sales are counted when delivered; collected cash is shown separately.
                </p>
              </article>

              <article className="glass-card rounded-2xl p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-[15px] font-semibold text-[#25332c]">Cash, stock &amp; supplier payments</h2>
                    <p className="mt-1 text-[11px] text-[#7a8781]">Cash you can use is different from money tied up in stock or unpaid bills.</p>
                  </div>
                  <button onClick={() => openDrawer('OBLIGATION')} className="text-[11px] font-semibold text-[#087e63] hover:underline">View cash position <ArrowRight size={12} className="ml-1 inline" /></button>
                </div>
                <details className="group mt-4">
                  <summary className="accounting-focus flex cursor-pointer list-none items-center justify-between rounded-lg bg-[#f7faf8] px-3 py-2.5 text-[11px] font-semibold text-[#53635a] marker:hidden hover:bg-[#f0f6f2]">
                    Show stock and payment details
                    <ChevronDown size={15} className="text-[#819087] transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="mt-4">
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {[
                        { label: 'Average stock value', value: portfolio.averageInventory },
                        { label: 'Supplier bills due', value: portfolio.payables },
                        { label: 'Unclaimed supplier discounts', value: portfolio.unclaimedSchemes },
                        { label: 'Money tied up in daily operations', value: portfolio.receivables + portfolio.averageInventory - portfolio.payables },
                        { label: 'Customer bills, stock & discounts', value: portfolio.receivables + portfolio.averageInventory + portfolio.unclaimedSchemes },
                      ].map((item) => (
                        <div key={item.label} className="rounded-xl bg-[#f7faf8] p-3">
                          <p className="text-[10px] leading-snug text-[#7b8982]">{item.label}</p>
                          <p className="mt-1 text-[14px] font-semibold tabular-nums text-[#35443c]">{compactCurrency(item.value)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 grid grid-cols-4 gap-2 rounded-xl border border-[#e8eeeb] p-3 text-center">
                      {[
                        { label: 'Customer payment time', value: portfolio.dso },
                        { label: 'Time stock is held', value: portfolio.dio },
                        { label: 'Supplier payment time', value: portfolio.dpo },
                        { label: 'Cash cycle', value: portfolio.cashConversionCycle },
                      ].map((item) => (
                        <div key={item.label}>
                          <p className="text-[10px] text-[#819087]">{item.label}</p>
                          <p className="mt-1 text-[14px] font-semibold tabular-nums text-[#34433b]">{item.value.toFixed(1)} days</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 rounded-xl bg-[#f7faf8] p-3">
                      <div className="flex items-center justify-between gap-3 text-[11px]">
                        <span className="text-[#6e7c74]">Bank balance after supplier payment</span>
                        <strong className="tabular-nums text-[#34433b]">{formatBDT(portfolio.bankCash - portfolio.upcomingObligation)}</strong>
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${portfolio.bankCash >= portfolio.upcomingObligation ? 'bg-[#eaf5ef] text-[#26765a]' : 'bg-[#fbefef] text-[#a74850]'}`}>
                          {portfolio.bankCash >= portfolio.upcomingObligation ? 'Covered' : 'Shortfall'}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-3 text-[11px]">
                        <span className="text-[#6e7c74]">Cash after payment, including cash on hand</span>
                        <strong className="tabular-nums text-[#087e63]">{formatBDT(liquidCash - portfolio.upcomingObligation)}</strong>
                      </div>
                    </div>
                  </div>
                </details>
              </article>
            </section>

            <section aria-label="Today’s business activity" className="glass-card mt-4 rounded-2xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-[15px] font-semibold text-[#25332c]">Today’s business activity</h2>
                  <p className="mt-1 text-[11px] text-[#7a8781]">Delivered sales, cash vs. credit, dispatch, returns, and till control.</p>
                </div>
                <span className="rounded-full bg-[#f4f6f5] px-2.5 py-1 text-[10px] font-medium text-[#6f7d76]">Daily demo snapshot · BDT</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                {[
                  { label: 'Delivered sales', value: compactCurrency(portfolio.dailyDeliveredSales), tone: 'text-[#34433b]' },
                  { label: 'Cash sales', value: compactCurrency(portfolio.dailyCashSales), tone: 'text-[#087e63]' },
                  { label: 'New credit sales', value: compactCurrency(portfolio.dailyFreshCredit), tone: 'text-[#9a6819]' },
                  { label: 'Past-due invoices collected', value: compactCurrency(portfolio.dailyOldDuesCollected), tone: 'text-[#087e63]' },
                  { label: 'Net cash added', value: compactCurrency(portfolio.dailyNetCashAdded), tone: 'text-[#087e63]' },
                  { label: 'Expected cash on hand', value: compactCurrency(portfolio.expectedTillCash), tone: 'text-[#34433b]' },
                  { label: 'Counted cash on hand', value: compactCurrency(portfolio.countedTillCash), tone: 'text-[#34433b]' },
                  { label: 'Cash difference', value: formatBDT(portfolio.cashVariance), tone: portfolio.cashVariance < 0 ? 'text-[#b74750]' : 'text-[#087e63]' },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-[#e8eeeb] bg-white p-3">
                    <p className="text-[10px] text-[#7b8982]">{item.label}</p>
                    <p className={`mt-1 text-[16px] font-semibold tabular-nums ${item.tone}`}>{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-1 gap-3 text-[11px] sm:grid-cols-3">
                <div className="rounded-xl bg-[#f7faf8] p-3">
                  <span className="text-[#76837d]">Credit share of delivered sales</span>
                  <strong className="ml-2 text-[#34433b]">{portfolio.dailyDeliveredSales ? (portfolio.dailyFreshCredit / portfolio.dailyDeliveredSales * 100).toFixed(1) : '0.0'}%</strong>
                </div>
                <p className="mt-3 text-[10px] text-[#87938d]">Dispatch and return incident metrics are shared company-wide; amounts are not split across depots in this demo.</p>
                <div className="rounded-xl bg-[#fff8ed] p-3">
                  <span className="text-[#8a704c]">Dispatch</span>
                  <strong className="ml-2 text-[#7e612e]">
                    {state.hardwareReplaced
                      ? 'Printer replacement simulated · monitor next dispatch'
                      : state.dispatchDelayMinutes === 0
                        ? `${state.dispatchTarget} target · on time`
                        : `${state.dispatchTarget} target · ${state.dispatchActual} actual · ${state.dispatchDelayMinutes} min late`}
                  </strong>
                </div>
                <div className="rounded-xl bg-[#fbf1f1] p-3">
                  <span className="text-[#91696b]">Returns incident</span>
                  <strong className="ml-2 text-[#9c555a]">60 cartons · {formatBDT(2790)} historical loss</strong>
                  <p className="mt-1 text-[10px] text-[#987779]">Replacement {formatBDT(3000)} · estimated payback 2.8 days</p>
                </div>
              </div>
              <p className="mt-3 text-[10px] text-[#87938d]">
                Daily cash added = cash sales + old dues collected − cash expenses. This is a cash measure, not daily profit.
              </p>
            </section>

            <section aria-label="Route cash and sales" className="glass-card mt-4 overflow-hidden rounded-2xl">
              <div className="flex flex-wrap items-start justify-between gap-3 p-5">
                <div>
                  <h2 className="text-[15px] font-semibold text-[#25332c]">Route cash &amp; sales</h2>
                  <p className="mt-1 text-[11px] text-[#7a8781]">Cash handed in, credit sales, and expected cash by delivery route.</p>
                </div>
                <span className="rounded-full bg-[#f4f6f5] px-2.5 py-1 text-[10px] font-medium text-[#6f7d76]">{scopedRoutes.length} routes · filtered to selected scope</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[780px] border-t border-[#edf1ef] text-left text-[11px]">
                  <thead className="bg-[#f8faf9] text-[10px] font-semibold uppercase tracking-wide text-[#84918a]">
                    <tr>
                      <th className="px-5 py-3">Route / sales rep</th>
                      <th className="px-3 py-3">Depot</th>
                      <th className="px-3 py-3 text-right">Cash collected</th>
                      <th className="px-3 py-3 text-right">Credit sales</th>
                      <th className="px-3 py-3 text-right">Expected</th>
                      <th className="px-3 py-3 text-right">Cash difference</th>
                      <th className="px-5 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#edf1ef]">
                    {scopedRoutes.map((route) => (
                      <tr key={route.id} className="bg-white transition hover:bg-[#fafcfb]">
                        <td className="px-5 py-3">
                          <button onClick={() => openDrawer('ROUTE_DETAIL', route.id)} className="accounting-focus rounded text-left">
                            <span className="block font-semibold text-[#34433b]">{route.vanNumber} · {route.routeName}</span>
                            <span className="mt-0.5 block text-[10px] text-[#89958f]">{route.dsrName}</span>
                          </button>
                        </td>
                        <td className="px-3 py-3 text-[#68766f]">{route.depot}</td>
                        <td className="px-3 py-3 text-right font-medium tabular-nums text-[#34433b]">{formatBDT(route.collected)}</td>
                        <td className="px-3 py-3 text-right tabular-nums text-[#68766f]">{formatBDT(route.credit)}</td>
                        <td className="px-3 py-3 text-right tabular-nums text-[#68766f]">{formatBDT(route.expected)}</td>
                        <td className={`px-3 py-3 text-right font-semibold tabular-nums ${route.variance < 0 ? 'text-[#b74750]' : route.variance > 0 ? 'text-[#087e63]' : 'text-[#87938d]'}`}>
                          {route.variance > 0 ? '+' : ''}{formatBDT(route.variance)}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <span className={`inline-flex rounded-full px-2 py-1 text-[9px] font-semibold ${
                            route.status === 'EXCEPTION' ? 'bg-[#fbefef] text-[#a74850]'
                              : route.status === 'WARNING' ? 'bg-[#fff6e8] text-[#9a6819]'
                                : 'bg-[#eaf5ef] text-[#26765a]'
                          }`}>
                            {route.status === 'EXCEPTION' ? 'Needs review' : route.status === 'WARNING' ? 'Check' : 'On track'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t border-[#e7edea] bg-[#f8faf9] font-semibold text-[#435149]">
                    <tr>
                      <td className="px-5 py-3" colSpan={2}>Scope total</td>
                      <td className="px-3 py-3 text-right tabular-nums">{formatBDT(scopedRoutes.reduce((total, route) => total + route.collected, 0))}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{formatBDT(scopedRoutes.reduce((total, route) => total + route.credit, 0))}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{formatBDT(scopedRoutes.reduce((total, route) => total + route.expected, 0))}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{formatBDT(scopedRoutes.reduce((total, route) => total + route.variance, 0))}</td>
                      <td className="px-5 py-3" />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>

            {activeBusiness?.id === 'unilever-distribution' && (
              <section aria-labelledby="daily-actions-heading" className="glass-card mt-4 rounded-2xl p-5">
                <div className="mb-4">
                  <h2 id="daily-actions-heading" className="text-[15px] font-semibold text-[#25332c]">Daily business actions</h2>
                  <p className="mt-1 text-[11px] text-[#7a8781]">Manage customer credit, prepare a cash deposit, or finish today’s close.</p>
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                  <button
                    onClick={() => openModal('CREDIT_LOCK')}
                    disabled={state.creditLockActive}
                    className="accounting-focus flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#087e63] px-3 text-[11px] font-semibold text-white transition hover:bg-[#086d56] disabled:cursor-default disabled:bg-[#eaf5ef] disabled:text-[#26765a]"
                  >
                    <ShieldCheck size={15} />
                    {state.creditLockActive ? 'Credit paused' : 'Pause customer credit'}
                  </button>
                  <button
                    onClick={() => openModal('BANK_DEPOSIT')}
                    disabled={state.depositPrepared}
                    className="accounting-focus flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#e1e8e4] bg-white px-3 text-[11px] font-semibold text-[#53615a] transition hover:bg-[#f4f8f5] disabled:cursor-default disabled:bg-[#f3f8f5] disabled:text-[#718078]"
                  >
                    <Download size={15} />
                    {state.depositPrepared ? 'Deposit prepared' : 'Prepare bank deposit'}
                  </button>
                  <button
                    onClick={() => openModal('DAY_END_CLOSE')}
                    disabled={state.dayClosed}
                    className="accounting-focus flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#e1e8e4] bg-white px-3 text-[11px] font-semibold text-[#53615a] transition hover:bg-[#f4f8f5] disabled:cursor-default disabled:bg-[#f3f8f5] disabled:text-[#718078]"
                  >
                    <Check size={15} />
                    {state.dayClosed ? 'Day closed' : 'Review and close day'}
                  </button>
                </div>
              </section>
            )}

            <section className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(310px,0.85fr)]">
              <article id="reports" className="glass-card scroll-mt-24 rounded-2xl p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2"><h2 className="text-[15px] font-semibold text-[#25332c]">Cash position &amp; today’s activity</h2><span className="rounded-md bg-[#f2f5f3] px-2 py-1 text-[10px] font-medium text-[#84908a]">SAMPLE DATA</span></div>
                    <p className="mt-1 text-[11px] text-[#7a8781]">A current snapshot from the selected business scope, not a dated cash-flow forecast.</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    { label: 'Cash available', value: formatBDT(liquidCash), detail: 'Bank + cash on hand' },
                    { label: 'Collections today', value: formatBDT(collectedToday), detail: 'Recorded route collections' },
                    { label: 'Supplier payment due', value: formatBDT(portfolio.upcomingObligation), detail: portfolio.upcomingObligation > 0 ? `Due in ${state.obligationDueHours} hours` : 'None in selected sample scope' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-[#e8eeeb] bg-white p-3.5">
                      <p className="text-[10px] font-medium text-[#7b8982]">{item.label}</p>
                      <p className="mt-1.5 text-[17px] font-semibold tabular-nums text-[#34433b]">{item.value}</p>
                      <p className="mt-1 text-[10px] text-[#87938d]">{item.detail}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#edf1ef] pt-3 text-[11px]">
                  <span className={dueSoon ? 'font-medium text-[#9a6819]' : 'text-[#818e87]'}>
                    {dueSoon ? `${dueSoon} route ${dueSoon === 1 ? 'settlement needs' : 'settlements need'} review.` : 'No route exceptions in the current sample scope.'}
                  </span>
                  <button onClick={() => openDrawer(dueSoon ? 'RECONCILIATION' : 'OBLIGATION')} className="font-semibold text-[#087e63] hover:underline">
                    {dueSoon ? 'Review route cash' : 'Review payment details'} <ArrowRight size={12} className="ml-1 inline" />
                  </button>
                </div>
              </article>

              <article className="glass-card flex scroll-mt-24 flex-col rounded-2xl p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div><h2 className="text-[15px] font-semibold text-[#25332c]">Quick actions</h2><p className="mt-1 text-[11px] text-[#7a8781]">Common tasks, one click away</p></div>
                  <span className="rounded-xl bg-[#eaf5ef] p-2 text-[#087e63]"><FilePlus2 size={17} /></span>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2.5">
                  <button onClick={() => openDrawer('RECONCILIATION')} className="accounting-focus flex min-h-[74px] items-center gap-3 rounded-xl border border-[#e6ece9] bg-white p-3 text-left transition hover:border-[#e8d5ad] hover:bg-[#fffdfa]">
                    <span className="rounded-lg bg-[#fbf4e7] p-2 text-[#ad7b2c]"><FileCheck2 size={17} /></span><span><span className="block text-[12px] font-semibold text-[#34423b]">Review route cash</span><span className="mt-1 block text-[10px] text-[#89958f]">{dueSoon ? `${dueSoon} item needs review` : 'Compare cash handed in'}</span></span>
                  </button>
                  <label className="accounting-focus flex min-h-[74px] cursor-pointer items-center gap-3 rounded-xl border border-[#e6ece9] bg-white p-3 text-left transition hover:border-[#b9d8ca] hover:bg-[#f8fbf9]">
                    <span className="rounded-lg bg-[#eef2fb] p-2 text-[#6678b4]"><Upload size={17} /></span><span><span className="block text-[12px] font-semibold text-[#34423b]">Select a receipt</span><span className="mt-1 block text-[10px] text-[#89958f]">PDF or image</span></span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="sr-only"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) showToast(`${file.name} selected. Receipt storage is not connected in this demo.`);
                        event.currentTarget.value = '';
                      }}
                    />
                  </label>
                </div>
                <div className="mt-auto flex items-center gap-2 border-t border-[#edf1ef] pt-4 text-[11px] text-[#7b8882]">
                  <Command size={13} /><span>Shortcuts</span><kbd className="rounded border border-[#e3eae6] bg-[#f7f9f8] px-1.5 py-0.5 text-[10px]">⌘ K</kbd><span>search</span><kbd className="rounded border border-[#e3eae6] bg-[#f7f9f8] px-1.5 py-0.5 text-[10px]">⌘ I</kbd><span>invoice</span>
                </div>
              </article>
            </section>

            <section className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(310px,0.85fr)]">
              <article id="general-ledger" className="glass-card min-w-0 scroll-mt-24 overflow-hidden rounded-2xl">
                <div className="flex flex-col justify-between gap-3 border-b border-[#edf1ef] px-5 py-4 sm:flex-row sm:items-center">
                  <div><h2 className="text-[15px] font-semibold text-[#25332c]">Recent transactions</h2><p className="mt-1 text-[11px] text-[#7a8781]">Sample route activity and supplier payments</p></div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8d9993]" />
                      <input value={transactionSearch} onChange={(event) => setTransactionSearch(event.target.value)} aria-label="Filter transactions" placeholder="Filter" className="accounting-focus h-8 w-[130px] rounded-lg border border-[#e5ebe8] bg-white pl-8 pr-2 text-[11px] placeholder:text-[#a1aca6]" />
                    </div>
                    <div className="flex rounded-lg bg-[#f2f5f3] p-0.5">
                      {(['All', 'Invoicing', 'Expenses'] as TransactionFilter[]).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => {
                            setShowAllTransactions(false);
                            const sectionId = filter === 'Invoicing' ? 'invoicing' : filter === 'Expenses' ? 'expenses' : 'general-ledger';
                            const nextPath = getBusinessRoute(activeBusinessId, sectionId);
                            if (pathname !== nextPath) router.push(nextPath, { scroll: false });
                          }}
                          aria-pressed={transactionFilter === filter}
                          className={`accounting-focus rounded-md px-2 py-1.5 text-[10px] font-medium ${transactionFilter === filter ? 'bg-white text-[#34423b] shadow-sm' : 'text-[#7e8b84] hover:text-[#435149]'}`}
                        >
                          {filter === 'Invoicing' ? 'Invoices' : filter}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        setTransactionSearch('');
                        setGlobalSearch('');
                        setShowAllTransactions(false);
                        const nextPath = getBusinessRoute(activeBusinessId, 'general-ledger');
                        if (pathname !== nextPath) router.push(nextPath, { scroll: false });
                      }}
                      aria-label="Reset transaction filters"
                      title="Reset transaction filters"
                      className="accounting-focus rounded-lg p-2 text-[#76837d] hover:bg-[#f2f5f3]"
                    >
                      <Filter size={15} />
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[770px] border-collapse text-left">
                    <thead><tr className="bg-[#fafcfb] text-[10px] font-semibold uppercase tracking-[0.09em] text-[#85918b]">
                      <th className="px-5 py-3 font-medium">Date</th><th className="px-5 py-3 font-medium">Description</th><th className="px-5 py-3 font-medium">Category</th><th className="px-5 py-3 font-medium">Payment method</th><th className="px-5 py-3 text-right font-medium">Amount</th><th className="px-5 py-3 text-right font-medium">Status</th>
                    </tr></thead>
                    <tbody>{renderTransactionRows(showAllTransactions ? filteredRows : filteredRows.slice(0, 8))}</tbody>
                  </table>
                  {filteredRows.length === 0 && <div className="px-5 py-12 text-center text-[12px] text-[#87938d]">No transactions match those filters.</div>}
                </div>
                <div className="flex items-center justify-between border-t border-[#edf1ef] px-5 py-3 text-[11px] text-[#87938d]">
                  <span>Showing {showAllTransactions ? filteredRows.length : Math.min(filteredRows.length, 8)} of {filteredRows.length} entries <span className="text-[#adb7b1]">· Sample data</span></span>
                  {filteredRows.length > 8 && (
                    <button
                      onClick={() => setShowAllTransactions((showAll) => !showAll)}
                      aria-expanded={showAllTransactions}
                      className="font-semibold text-[#087e63] hover:underline"
                    >
                      {showAllTransactions ? 'Show recent only' : 'View all activity'} <ArrowRight size={12} className="ml-1 inline" />
                    </button>
                  )}
                </div>
              </article>

              <aside className="flex scroll-mt-24 flex-col gap-4">
                <article id="ai-assistant" className={`glass-card rounded-2xl p-5 transition-shadow ${aiOpen ? 'ring-1 ring-[#9acdb6]' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eaf5ef] text-[#087e63]"><Sparkles size={18} /></span>
                      <div><h2 className="text-[14px] font-semibold text-[#25332c]">Ask about your business</h2><p className="mt-0.5 text-[10px] text-[#85918b]">Answers from sample data</p></div>
                    </div>
                    <button onClick={() => setAiOpen((value) => !value)} aria-label={aiOpen ? 'Collapse AI assistant' : 'Expand AI assistant'} className="accounting-focus rounded-lg p-1.5 text-[#819087] hover:bg-[#f1f5f3]"><MoreHorizontal size={18} /></button>
                  </div>
                  <p className="mt-4 text-[12px] leading-relaxed text-[#63716a]">Get a quick answer from the financial information currently in your workspace.</p>
                  <div className="mt-3 space-y-1.5">
                    {['What is my available cash?', 'Show pending invoices', 'What supplier payments are due?'].map((question) => (
                      <button key={question} onClick={() => { setAiOpen(true); runAssistantQuery(question); }} className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-[11px] text-[#53635a] transition hover:bg-[#f2f7f4] hover:text-[#087e63]">
                        <span>{question}</span><ArrowRight size={13} className="shrink-0 text-[#9aa69f]" />
                      </button>
                    ))}
                  </div>
                  {aiResponse && (
                    <div aria-live="polite" className="mt-3 rounded-xl border border-[#e3eee7] bg-[#f6faf7] p-3 text-[11px] leading-relaxed text-[#52635a]">
                      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#087e63]">Answer from demo data</span>{aiResponse}
                    </div>
                  )}
                  <form onSubmit={(event) => { event.preventDefault(); runAssistantQuery(); }} className="mt-4 flex items-center gap-2 rounded-xl border border-[#e4ebe7] bg-white p-1.5 pl-3 focus-within:border-[#a6cdb8]">
                    <MessageSquareText size={15} className="shrink-0 text-[#8e9a94]" />
                    <input value={aiQuery} onChange={(event) => setAiQuery(event.target.value)} onFocus={() => setAiOpen(true)} aria-label="Ask a question about your books" placeholder="Ask about your finances..." className="accounting-focus min-w-0 flex-1 border-0 bg-transparent py-1.5 text-[11px] text-[#3d4a44] outline-none placeholder:text-[#a4aea8]" />
                    <button type="submit" aria-label="Send question" className="accounting-focus flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#087e63] text-white hover:bg-[#086d56]"><Send size={13} /></button>
                  </form>
                  <p className="mt-2 text-[10px] leading-relaxed text-[#9aa59f]">AI answers are limited to demo data and may not include invoice due dates.</p>
                </article>

                <article id="bank-reconciliation" className="glass-card scroll-mt-24 rounded-2xl p-5">
                  <div className="flex items-center justify-between">
                    <div><h2 className="text-[14px] font-semibold text-[#25332c]">Needs attention</h2><p className="mt-1 text-[10px] text-[#85918b]">{activeAlerts.length} open items</p></div>
                    <span className="rounded-xl bg-[#fbefef] p-2 text-[#b54c54]"><CircleHelp size={16} /></span>
                  </div>
                  {activeAlerts.length ? activeAlerts.slice(0, 2).map((alert) => (
                    <button key={alert.id} onClick={() => getAlertAction(alert)} className="mt-3 flex w-full items-start gap-2.5 rounded-xl border border-[#edf0ed] bg-white p-3 text-left hover:border-[#d6e3db] hover:bg-[#fafcfb]">
                      <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${alert.severity === 'CRITICAL' ? 'bg-[#c84d57]' : alert.severity === 'WARNING' ? 'bg-[#d59a2d]' : 'bg-[#4d8bc1]'}`} />
                      <span className="min-w-0 flex-1"><span className="block truncate text-[11px] font-semibold text-[#3b4942]">{alert.title}</span><span className="mt-1 block text-[10px] text-[#86928c]">{alert.timestamp} · Review details</span></span>
                      <ChevronRight size={14} className="mt-1 shrink-0 text-[#9aa69f]" />
                    </button>
                  )) : <div className="mt-4 rounded-xl bg-[#f3f8f5] p-3 text-[11px] text-[#61756a]">No open items. Your demo ledger is up to date.</div>}
                  <button onClick={() => openDrawer('RECONCILIATION')} className="mt-3 w-full rounded-xl border border-[#e4ebe7] px-3 py-2 text-[11px] font-semibold text-[#087e63] transition hover:bg-[#f4f8f5]">Open bank reconciliation</button>
                </article>
              </aside>
            </section>

            <section id="invoicing" className="sr-only" aria-label="Invoicing section">Invoice records are available in the recent transactions table.</section>
            <section id="expenses" className="sr-only" aria-label="Expenses section">Expense records are available in the recent transactions table.</section>
            </>
            )}
          </main>
        </div>
      </div>

      <BusinessOnboardingModal
        key={`${businessOnboardingOpen ? 'open' : 'closed'}-${businessModalMode}-${activeBusinessId}`}
        open={businessOnboardingOpen}
        businesses={businesses}
        currentBusinessId={isPortfolioView ? null : activeBusinessId}
        initialMode={businessModalMode}
        onClose={() => setBusinessOnboardingOpen(false)}
        onCreate={createBusiness}
        onLinkExisting={linkExistingBusiness}
      />

      {quickAction && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#12221d]/40 p-4 backdrop-blur-[3px]" onMouseDown={(event) => { if (event.target === event.currentTarget) setQuickAction(null); }}>
          <form onSubmit={saveQuickAction} className="w-full max-w-[420px] rounded-2xl border border-[#e2e9e5] bg-white p-5 shadow-[0_24px_80px_rgba(22,44,34,0.2)]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="rounded-xl bg-[#eaf5ef] p-2.5 text-[#087e63]">{quickAction === 'invoice' ? <FileText size={18} /> : <CreditCard size={18} />}</span>
                <div><h2 className="text-[15px] font-semibold text-[#26352d]">{quickAction === 'invoice' ? 'Create invoice' : 'Add expense'}</h2><p className="mt-1 text-[11px] text-[#849089]">Add a record to this local demo ledger</p></div>
              </div>
              <button type="button" onClick={() => setQuickAction(null)} aria-label="Close dialog" className="accounting-focus rounded-lg p-1.5 text-[#89958f] hover:bg-[#f3f6f4]"><X size={18} /></button>
            </div>
            <label className="mt-5 block text-[11px] font-medium text-[#55635b]">
              Description
              <input required autoFocus value={formDescription} onChange={(event) => setFormDescription(event.target.value)} placeholder={quickAction === 'invoice' ? 'e.g. Retailer order' : 'e.g. Delivery fuel'} className="accounting-focus mt-1.5 h-10 w-full rounded-xl border border-[#e1e8e4] px-3 text-[12px] placeholder:text-[#a2ada7]" />
            </label>
            <label className="mt-4 block text-[11px] font-medium text-[#55635b]">
              Amount (BDT)
              <input required min="1" step="0.01" type="number" value={formAmount} onChange={(event) => setFormAmount(event.target.value)} placeholder="0.00" className="accounting-focus mt-1.5 h-10 w-full rounded-xl border border-[#e1e8e4] px-3 text-[12px] tabular-nums placeholder:text-[#a2ada7]" />
            </label>
            {activeBusinessId === 'unilever-distribution' && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="text-[11px] font-medium text-[#55635b]">
                Principal
                <select value={formPrincipal} onChange={(event) => setFormPrincipal(event.target.value as Exclude<PrincipalFilter, 'All principals'>)} className="accounting-focus mt-1.5 h-10 w-full rounded-xl border border-[#e1e8e4] bg-white px-3 text-[12px]">
                  {principalOptions.filter((option) => option !== 'All principals').map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
              <label className="text-[11px] font-medium text-[#55635b]">
                Depot
                <select value={formDepot} onChange={(event) => setFormDepot(event.target.value as Exclude<DepotFilter, 'All depots'>)} className="accounting-focus mt-1.5 h-10 w-full rounded-xl border border-[#e1e8e4] bg-white px-3 text-[12px]">
                  {depotOptions.filter((option) => option !== 'All depots').map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
            </div>
            )}
            <div className="mt-4 rounded-xl bg-[#f6f9f7] p-3 text-[10px] leading-relaxed text-[#7b8981]">
              This entry is stored only in the current browser session. It will not be sent to accounting software or saved to a server.
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setQuickAction(null)} className="accounting-focus rounded-xl border border-[#e1e8e4] px-4 py-2 text-[12px] font-medium text-[#5e6b64] hover:bg-[#f7f9f8]">Cancel</button>
              <button type="submit" className="accounting-focus rounded-xl bg-[#087e63] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#086d56]">{quickAction === 'invoice' ? 'Add invoice' : 'Save expense'}</button>
            </div>
          </form>
        </div>
      )}

      <SimulationPanel />
      <WorkingCapitalDrawer />
      <RouteDetailDrawer />
      <ReconciliationDrawer portfolio={portfolio} />
      <IncidentDrawer />
      <ObligationDrawer portfolio={portfolio} />
      <ActionConfirmationModal />
      <ToastNotification />
    </div>
  );
};
