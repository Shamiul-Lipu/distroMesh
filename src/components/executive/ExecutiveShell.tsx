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
  Monitor,
  Sun,
  Moon,
  Layers,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useExecutive } from '../../context/ExecutiveContext';
import { formatBDT } from '../../utils/formatters';
import { getBusinessRoute, isBusinessRouteName, sectionIdsByRouteName } from '../../utils/businessRoutes';
import { RouteData } from '../../types/executive';
import { WarRoomView } from '../war-room/WarRoomView';
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
import { ExecutiveOperationsGrid } from './visualizations/ExecutiveOperationsGrid';
import { CrossEntityCommandMatrix } from './visualizations/CrossEntityCommandMatrix';
import {
  businessSnapshots,
  getBusinessOperationalSnapshot,
  getEntityPortfolioSnapshot,
} from '../../data/businessEntitiesData';
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

const commandNavItems = [
  { id: 'war-room', label: 'War Room', icon: Monitor, isLive: true },
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'business-performance', label: 'Sales & operations', icon: Activity },
];

const financeNavItems = [
  { id: 'general-ledger', label: 'Transactions', icon: BookOpen },
  { id: 'invoicing', label: 'Invoices', icon: FileText },
  { id: 'expenses', label: 'Expenses', icon: CreditCard },
  { id: 'reports', label: 'Cash flow', icon: Wallet },
];

const governanceNavItems = [
  { id: 'related-businesses', label: 'Connected businesses', icon: GitBranch },
  { id: 'bank-reconciliation', label: 'Alerts & tasks', icon: FileCheck2 },
  { id: 'ai-assistant', label: 'Help & Copilot', icon: Sparkles },
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
  const { theme, toggleTheme } = useTheme();
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
  const [formPrincipal, setFormPrincipal] = useState<Exclude<PrincipalFilter, 'All principals'>>('Illustrative FMCG');
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
  const portfolio = useMemo(() => {
    if (!isPortfolioView && activeBusinessId !== 'unilever-distribution' && businessSnapshots[activeBusinessId]) {
      return getEntityPortfolioSnapshot(activeBusinessId);
    }
    return getPortfolioSnapshot(principalFilter, depotFilter, {
      bankCash: state.bankCash,
      vaultCash: state.vaultCash,
      upcomingObligation: state.upcomingObligation,
      freshCredit: state.freshCredit,
      todaySales: state.todaySales,
      cashVariance: state.cashVariance,
    });
  }, [
    isPortfolioView,
    activeBusinessId,
    principalFilter,
    depotFilter,
    state.bankCash,
    state.vaultCash,
    state.upcomingObligation,
    state.freshCredit,
    state.todaySales,
    state.cashVariance,
  ]);
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
      const fmcgCollected = Math.round(route.collected * 0.7);
      const fmcgCredit = Math.round(route.credit * 0.7);
      return [
        {
          id: `${route.id}-fmcg-collection`,
          businessId: 'unilever-distribution',
          date: 'Today',
          description: `Route collection · ${route.vanNumber}`,
          party: `${route.routeName} · ${route.depot}`,
          principal: 'Illustrative FMCG',
          depot: route.depot,
          category: 'Cash collection',
          method: 'Cash',
          amount: fmcgCollected,
          status: (route.status === 'ACTION' || route.status === 'REVIEW') ? 'Pending' : 'Paid',
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
          principal: 'Pureit (Durables)',
          depot: route.depot,
          category: 'Cash collection',
          method: 'Cash',
          amount: route.collected - fmcgCollected,
          status: (route.status === 'ACTION' || route.status === 'REVIEW') ? 'Pending' : 'Paid',
          kind: 'Collection',
          ageDays: 0,
          routeId: route.id,
        },
        {
          id: `${route.id}-fmcg-credit`,
          businessId: 'unilever-distribution',
          date: 'Today',
          description: `Market credit · ${route.vanNumber}`,
          party: `${route.routeName} · ${route.depot}`,
          principal: 'Illustrative FMCG',
          depot: route.depot,
          category: 'Trade receivable',
          method: 'Invoice',
          amount: fmcgCredit,
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
          principal: 'Pureit (Durables)',
          depot: route.depot,
          category: 'Trade receivable',
          method: 'Invoice',
          amount: route.credit - fmcgCredit,
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
      id: 'fmcg-sherpur-auto-debit',
      businessId: 'unilever-distribution',
      date: `Due in ${state.obligationDueHours}h`,
      description: 'Supplier principal auto-debit',
      party: 'Principal Supplier (Illustrative)',
      principal: 'Illustrative FMCG',
      depot: 'Sherpur',
      category: 'Supplier payable',
      method: 'Bank transfer',
      amount: -Math.round(state.upcomingObligation * 0.8),
      status: 'Pending',
      kind: 'Payable',
      ageDays: 0,
    },
    {
      id: 'fmcg-bogura-auto-debit',
      businessId: 'unilever-distribution',
      date: `Due in ${state.obligationDueHours}h`,
      description: 'Supplier principal auto-debit',
      party: 'Principal Supplier (Illustrative)',
      principal: 'Illustrative FMCG',
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
        return principalFilter !== 'Pureit (Durables)' && portfolio.upcomingObligation > 0;
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
    (route.status === 'ACTION' || route.status === 'REVIEW') && (depotFilter === 'All depots' || route.depot === depotFilter),
  ).length : 0;
  const currentSnapshot = getBusinessOperationalSnapshot(activeBusinessId);
  const activeBusinessMetrics = businessMetrics[activeBusinessId];
  const fullBusinessScope = principalFilter === 'All principals' && depotFilter === 'All depots';
  const activePerformanceMetrics = activeBusinessMetrics
    ? {
      ...activeBusinessMetrics,
      availableCash: liquidCash,
      receivables: portfolio.receivables,
      monthlyRevenue: portfolio.monthlyRevenue,
      monthlyNetProfit: portfolio.monthlyNetProfit,
      monthlySalesHistory: activeBusinessMetrics.monthlySalesHistory,
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
  const scopedRoutes = useMemo(() => {
    if (!isPortfolioView && activeBusinessId !== 'unilever-distribution' && businessSnapshots[activeBusinessId]) {
      const snap = businessSnapshots[activeBusinessId];
      return snap.routes.map((r, idx) => ({
        id: r.id,
        depot: snap.location.split(' ')[0] || 'Hub',
        vanNumber: `Van #${idx + 1}`,
        routeName: r.name,
        jsrName: r.jsrName,
        srName: r.srName,
        collected: r.cashCollected,
        credit: r.creditSales,
        expected: r.cashCollected - r.variance,
        variance: r.variance,
        status: r.status,
      }));
    }
    return state.routes
      .filter((route) => depotFilter === 'All depots' || route.depot === depotFilter)
      .map((route) => {
        const scopedAmount = (amount: number) => {
          const fmcgAmount = Math.round(amount * 0.7);
          if (principalFilter === 'Illustrative FMCG') return fmcgAmount;
          if (principalFilter === 'Pureit (Durables)') return amount - fmcgAmount;
          return amount;
        };
        const variance = scopedAmount(route.variance);
        return {
          ...route,
          expected: scopedAmount(route.expected),
          collected: scopedAmount(route.collected),
          credit: scopedAmount(route.credit),
          variance,
          status: (route.status === 'ACTION' || route.status === 'REVIEW') && variance === 0 ? 'OK' as const : route.status,
        };
      });
  }, [isPortfolioView, activeBusinessId, depotFilter, principalFilter, state.routes]);

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
    setFormPrincipal(principalFilter === 'All principals' ? 'Illustrative FMCG' : principalFilter);
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

  const renderNavSection = (
    heading: string,
    items: {
      id: string;
      label: string;
      icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
      badge?: string | number | null;
      badgeColor?: string;
      isLive?: boolean;
    }[],
    isMobile: boolean
  ) => (
    <div className="mb-4">
      {(!collapsed || isMobile) && (
        <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 font-mono">
          {heading}
        </p>
      )}
      <nav aria-label={heading} className="space-y-0.5">
        {items.map(({ id, label, icon: Icon, badge, badgeColor, isLive }) => {
          const selected = activeSection === id;
          const targetBusinessId = isPortfolioView ? 'unilever-distribution' : activeBusinessId;
          return (
            <Link
              key={id}
              href={getBusinessRoute(targetBusinessId, id)}
              scroll={false}
              onClick={() => {
                prepareSectionNavigation(id);
                setMobileNavOpen(false);
              }}
              aria-current={selected ? 'page' : undefined}
              title={collapsed && !isMobile ? label : undefined}
              className={`accounting-focus group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-[12px] font-medium transition-all ${
                selected
                  ? 'bg-[var(--accent-soft)] font-semibold text-[var(--accent)] border border-[var(--accent)]/30 shadow-2xs'
                  : 'text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]'
              }`}
            >
              <Icon
                size={16}
                strokeWidth={selected ? 2.2 : 1.8}
                className={`shrink-0 transition-colors ${selected ? 'text-[var(--accent)]' : 'text-[var(--foreground-muted)] group-hover:text-[var(--foreground)]'}`}
              />
              {(!collapsed || isMobile) && (
                <>
                  <span className="flex-1 truncate">{label}</span>
                  {isLive && (
                    <span className="inline-flex items-center gap-1 rounded bg-[var(--success-soft)] px-1.5 py-0.5 text-[9px] font-bold font-mono text-[var(--success)] border border-[var(--success)]/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)] animate-pulse" />
                      LIVE
                    </span>
                  )}
                  {badge !== undefined && badge !== null && (
                    <span
                      className={`ml-auto rounded-md px-1.5 py-0.5 text-[10px] tabular-nums font-bold ${
                        badgeColor ?? 'bg-[var(--surface-inset)] border border-[var(--border)] text-[var(--foreground-muted)]'
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  const renderSidebar = (isMobile = false) => {
    const isCollapsed = collapsed && !isMobile;
    const currentBusinessName = isPortfolioView ? 'Portfolio overview' : (activeBusiness?.name ?? 'Business workspace');
    const currentBusinessInitial = isPortfolioView ? 'P' : (activeBusiness?.name.charAt(0) ?? 'B');

    return (
      <aside className={`accounting-sidebar flex h-full flex-col overflow-y-auto bg-[var(--surface-elevated)] text-[var(--foreground)] border-r border-[var(--border)] ${isCollapsed ? 'w-[76px]' : 'w-[252px]'} ${isMobile ? 'w-[280px]' : ''} transition-[width] duration-200`}>
        {/* Top Brand Logo */}
        <div className="flex h-[76px] items-center gap-3 border-b border-[var(--border)] px-5">
          <Link
            href="/"
            aria-label="distroMesh home"
            title="Go to distroMesh home"
            onClick={() => setMobileNavOpen(false)}
            className="accounting-focus flex min-w-0 flex-1 items-center gap-3 rounded-lg"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] text-white shadow-md">
              <Building2 size={19} strokeWidth={2} />
            </span>
            {!isCollapsed && (
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold tracking-wide text-[var(--foreground)]">distroMesh</span>
                <span className="mt-0.5 block text-[10px] font-medium tracking-wide text-[var(--accent)]">Executive Workspace</span>
              </span>
            )}
          </Link>
          {isMobile && (
            <button onClick={() => setMobileNavOpen(false)} aria-label="Close navigation" className="accounting-focus rounded-lg p-2 text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation Body */}
        <div className="flex-1 px-3 pt-4 space-y-4">
          {/* Active Scope / Workspace Switcher Card */}
          {isCollapsed ? (
            <Link
              href="/businesses"
              scroll={false}
              onClick={() => { prepareBusinessSelection('all'); setMobileNavOpen(false); }}
              title={`Switch Business: ${currentBusinessName}`}
              className="flex h-10 w-full items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] text-[var(--foreground)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] transition"
            >
              <BriefcaseBusiness size={17} className="text-[var(--accent)]" />
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setBusinessNavExpanded((prev) => !prev)}
                aria-expanded={businessNavExpanded}
                aria-label="Toggle business selector"
                className="w-full text-left rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] p-2.5 shadow-2xs hover:bg-[var(--surface-hover)] transition"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-muted)] font-mono">
                    {isPortfolioView ? 'Scope' : 'Active Business'}
                  </span>
                  <span className="text-[10px] font-semibold text-[var(--accent)] flex items-center gap-0.5">
                    {businessNavExpanded ? 'Close' : 'Switch'} <ChevronDown size={11} className={`transition-transform duration-200 ${businessNavExpanded ? 'rotate-180' : ''}`} />
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold font-mono border bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent)]/30">
                    {currentBusinessInitial}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-[var(--foreground)] leading-tight">
                      {currentBusinessName}
                    </p>
                    <p className="truncate text-[10px] text-[var(--foreground-muted)] mt-0.5">
                      {isPortfolioView ? 'Cross-business portfolio' : (activeBusiness?.industry ?? 'Distribution')}
                    </p>
                  </div>
                </div>
              </button>
              {businessNavExpanded && (
                <div className="mt-1 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-1.5 shadow-lg space-y-0.5 animate-in fade-in duration-150">
                  <Link
                    href="/businesses"
                    scroll={false}
                    onClick={() => {
                      setBusinessNavExpanded(false);
                      prepareBusinessSelection('all');
                      setMobileNavOpen(false);
                    }}
                    className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] transition ${
                      isPortfolioView ? 'bg-[var(--accent-soft)] font-bold text-[var(--accent)]' : 'font-semibold text-[var(--foreground)] hover:bg-[var(--surface-hover)]'
                    }`}
                  >
                    <BriefcaseBusiness size={14} className="text-[var(--accent)]" />
                    <span>All businesses portfolio ({businesses.length})</span>
                  </Link>
                  <div className="my-1 border-t border-[var(--border)]" />
                  {businesses.map((business) => {
                    const selected = business.id === activeBusinessId;
                    return (
                      <Link
                        key={business.id}
                        href={getBusinessRoute(business.id, 'overview')}
                        scroll={false}
                        onClick={() => {
                          setBusinessNavExpanded(false);
                          prepareBusinessSelection(business.id);
                          setMobileNavOpen(false);
                        }}
                        className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] transition ${
                          selected ? 'bg-[var(--accent-soft)] font-bold text-[var(--accent)]' : 'text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]'
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${selected ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`} />
                        <span className="truncate flex-1">{business.name}</span>
                        {selected && <span className="text-[9px] font-bold text-[var(--accent)] bg-[var(--accent-soft)] px-1 py-0.2 rounded font-mono">ACTIVE</span>}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Mode 1: Portfolio View Specific Navigation */}
          {isPortfolioView ? (
            <div className="space-y-3">
              {!isCollapsed && (
                <p className="px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--foreground-muted)] font-mono">
                  Connected Businesses
                </p>
              )}
              <div className="space-y-1">
                {businesses.map((business) => (
                  <Link
                    key={business.id}
                    href={getBusinessRoute(business.id, 'overview')}
                    scroll={false}
                    onClick={() => {
                      prepareBusinessSelection(business.id);
                      setMobileNavOpen(false);
                    }}
                    title={isCollapsed ? business.name : undefined}
                    className="accounting-focus group flex min-h-10 w-full items-center gap-2.5 rounded-xl px-2.5 text-left text-[12px] text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition-colors"
                  >
                    <Building2 size={15} className="text-[var(--foreground-muted)] group-hover:text-[var(--accent)] shrink-0" />
                    {!isCollapsed && (
                      <>
                        <span className="min-w-0 flex-1 truncate font-medium">{business.name}</span>
                        <ChevronRight size={13} className="text-[var(--foreground-muted)] group-hover:text-[var(--foreground)] shrink-0" />
                      </>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            /* Mode 2: Single Business Workspace Navigation (3 Organised Clusters) */
            <>
              {/* Cluster 1: Command & Operations */}
              {renderNavSection('Command & Ops', [
                { id: 'war-room', label: 'War Room', icon: Monitor, isLive: true },
                { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                { id: 'business-performance', label: 'Sales & operations', icon: Activity },
              ], isMobile)}

              {/* Cluster 2: Financial Operations */}
              {renderNavSection('Financial Operations', [
                { id: 'general-ledger', label: 'Transactions', icon: BookOpen },
                { id: 'invoicing', label: 'Invoices', icon: FileText },
                { id: 'expenses', label: 'Expenses', icon: CreditCard },
                { id: 'reports', label: 'Cash flow', icon: Wallet },
              ], isMobile)}

              {/* Cluster 3: Governance & Intelligence */}
              {renderNavSection('Governance & Network', [
                {
                  id: 'related-businesses',
                  label: 'Connected businesses',
                  icon: GitBranch,
                  badge: activeRelatedBusinesses.length > 0 ? activeRelatedBusinesses.length : null,
                },
                {
                  id: 'bank-reconciliation',
                  label: 'Alerts & tasks',
                  icon: FileCheck2,
                  badge: activeAlerts.length > 0 ? activeAlerts.length : null,
                  badgeColor: activeAlerts.length > 0 ? 'bg-[var(--danger-soft)] border border-[var(--danger)]/30 text-[var(--danger)]' : undefined,
                },
                { id: 'ai-assistant', label: 'Help & Copilot', icon: Sparkles },
              ], isMobile)}
            </>
          )}

          {/* Today's Focus Card (When not in portfolio and not collapsed) */}
          {!isPortfolioView && !isCollapsed && (
            <section aria-label="Business focus" className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-soft)] p-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-[var(--accent)] font-mono">Today&apos;s Focus</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              </div>
              <p className="mt-1.5 text-[11px] font-bold text-[var(--foreground)] leading-tight">{businessFocus.title}</p>
              <p className="mt-1 text-[10px] leading-relaxed text-[var(--foreground-muted)] line-clamp-2">{businessFocus.detail}</p>
              <div className="mt-2.5 flex items-center gap-3 pt-1 border-t border-[var(--accent)]/20">
                <Link
                  href={getBusinessRoute(activeBusinessId, businessFocus.section)}
                  scroll={false}
                  onClick={() => {
                    prepareSectionNavigation(businessFocus.section);
                    setMobileNavOpen(false);
                  }}
                  className="accounting-focus inline-flex items-center gap-1 text-[10px] font-bold text-[var(--accent)] hover:opacity-80"
                >
                  Review <ArrowRight size={10} />
                </Link>
                <Link
                  href={getBusinessRoute(activeBusinessId, 'ai-assistant')}
                  scroll={false}
                  onClick={() => {
                    prepareSectionNavigation('ai-assistant');
                    setMobileNavOpen(false);
                  }}
                  className="accounting-focus inline-flex items-center gap-1 text-[10px] font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                >
                  Ask AI <ArrowRight size={10} />
                </Link>
              </div>
            </section>
          )}
        </div>

        {/* Bottom Footer Actions */}
        <div className="mt-auto px-3 pb-4 pt-2 border-t border-[var(--border)]">
          {!isCollapsed && (
            <div className="mb-2 px-2.5 py-2 rounded-xl bg-[var(--surface-inset)] border border-[var(--border)]">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--foreground)]">
                <ShieldCheck size={13} className="text-[var(--success)]" />
                <span>Demo Workspace</span>
              </div>
              <p className="mt-0.5 text-[9px] text-[var(--foreground-muted)] leading-tight">Local illustrative ledger data</p>
            </div>
          )}
          <button
            onClick={() => openDrawer('SIMULATION')}
            title={isCollapsed ? 'Simulation & Controls' : undefined}
            className="accounting-focus flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-[12px] font-medium text-[var(--foreground-muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
          >
            <Settings2 size={16} className="shrink-0 text-[var(--foreground-muted)]" />
            {!isCollapsed && <span>Simulation controls</span>}
          </button>
        </div>
      </aside>
    );
  };

  const renderTransactionRows = (rows: LedgerRow[]) => rows.map((row) => (
    <tr
      key={row.id}
      onClick={() => row.routeId && openDrawer('ROUTE_DETAIL', row.routeId)}
      className={`border-b border-[var(--border)] last:border-0 ${row.routeId ? 'cursor-pointer hover:bg-[var(--surface-hover)]' : ''}`}
    >
      <td className="whitespace-nowrap px-5 py-3.5 text-[12px] text-[var(--foreground-muted)]">{row.date}</td>
      <td className="min-w-[220px] px-5 py-3.5">
        <div className="text-[13px] font-semibold text-[var(--foreground)]">{row.description}</div>
        <div className="mt-0.5 text-[11px] text-[var(--foreground-muted)]">{row.party}</div>
      </td>
      <td className="whitespace-nowrap px-5 py-3.5">
        <span className={`rounded-md px-2 py-1 text-[11px] font-medium ${row.referenceOnly ? 'bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/30' : 'bg-[var(--surface-inset)] text-[var(--foreground-muted)] border border-[var(--border)]'}`}>
          {row.referenceOnly ? `Reference · ${businesses.find((business) => business.id === row.referenceSourceBusinessId)?.name ?? 'Source'}` : row.category}
        </span>
      </td>
      <td className="whitespace-nowrap px-5 py-3.5 text-[12px] text-[var(--foreground-muted)]">{row.method}</td>
      <td className={`whitespace-nowrap px-5 py-3.5 text-right text-[13px] font-semibold tabular-nums ${row.amount < 0 ? 'text-[var(--danger)]' : 'text-[var(--foreground)]'}`}>
        {row.referenceOnly ? '—' : `${row.amount < 0 ? '−' : '+'}${compactCurrency(Math.abs(row.amount))}`}
      </td>
      <td className="whitespace-nowrap px-5 py-3.5 text-right">
        {row.referenceOnly ? (
          <span className="inline-flex rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[10px] font-semibold text-[var(--accent)] border border-[var(--accent)]/20">Reference only</span>
        ) : <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          row.status === 'Paid' ? 'bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success)]/20'
            : row.status === 'Overdue' ? 'bg-[var(--danger-soft)] text-[var(--danger)] border border-[var(--danger)]/20'
              : 'bg-[var(--warning-soft)] text-[var(--warning)] border border-[var(--warning)]/20'
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${row.status === 'Paid' ? 'bg-[var(--success)]' : row.status === 'Overdue' ? 'bg-[var(--danger)]' : 'bg-[var(--warning)]'}`} />
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
          <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">Workspace unavailable</p>
          <h1 className="mt-2 text-[26px] font-semibold tracking-[-0.04em] text-[var(--foreground)]">This business could not be found.</h1>
          <p className="mx-auto mt-3 max-w-sm text-[13px] leading-6 text-[var(--foreground-muted)]">
            It may have been added in another browser session. Demo workspaces are local to the current session.
          </p>
          <Link href="/businesses" className="accounting-focus mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--accent)] px-4 text-[12px] font-semibold text-white hover:bg-[var(--accent-hover)]">
            Return to all businesses <ArrowRight size={15} />
          </Link>
        </section>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="min-h-screen">
        <div className={`accounting-sidebar fixed inset-y-0 left-0 z-40 hidden md:block border-r border-[var(--border)] bg-[var(--surface-elevated)] ${collapsed ? 'w-[76px]' : 'w-[252px]'}`}>
          {renderSidebar()}
          <button
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="accounting-focus absolute left-[238px] top-1/2 z-20 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--foreground-muted)] shadow-md transition-all hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] md:flex"
            style={{ left: collapsed ? 62 : 238 }}
          >
            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>

        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <button className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation overlay" />
            <div className="absolute inset-y-0 left-0 shadow-2xl">{renderSidebar(true)}</div>
          </div>
        )}

        <div className={`min-w-0 transition-[margin] duration-200 ${collapsed ? 'md:ml-[76px]' : 'md:ml-[252px]'}`}>
          <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface-elevated)]/90 text-[var(--foreground)] backdrop-blur-xl shadow-xs">
            <div className="flex h-[72px] items-center gap-3 px-4 sm:px-6 lg:px-8">
              <button
                onClick={() => setMobileNavOpen(true)}
                aria-label="Open navigation"
                className="accounting-focus rounded-lg p-2 text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] md:hidden"
              >
                <Menu size={20} />
              </button>
              <button
                onClick={() => {
                  setMobileSearchOpen((value) => !value);
                  window.setTimeout(() => mobileSearchRef.current?.focus(), 0);
                }}
                aria-label="Search the ledger"
                className="accounting-focus rounded-lg p-2 text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] sm:hidden"
              >
                <Search size={18} />
              </button>
              <div className="relative hidden min-w-0 flex-1 sm:block sm:max-w-[440px]">
                <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
                <input
                  ref={searchRef}
                  value={globalSearch}
                  onChange={(event) => {
                    setGlobalSearch(event.target.value);
                    setTransactionSearch(event.target.value);
                  }}
                  onFocus={openSearchSection}
                  placeholder="Search transactions, invoices, accounts..."
                  aria-label="Search the ledger"
                  className="accounting-focus h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] pl-10 pr-16 text-[13px] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:bg-[var(--surface-elevated)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
                />
                <span className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--surface)] px-1.5 py-1 text-[10px] text-[var(--foreground-muted)] font-mono">
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
                  className="accounting-focus flex items-center gap-2 rounded-xl px-2.5 py-2 text-left hover:bg-[var(--surface-hover)] text-[var(--foreground)] sm:px-3"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/30"><Building2 size={16} /></span>
                  <span className="hidden min-w-0 sm:block">
                    <span className="block max-w-[180px] truncate text-[12px] font-semibold text-[var(--foreground)]">{isPortfolioView ? 'All businesses' : activeBusiness?.name ?? 'Business workspace'}</span>
                    <span className="block text-[10px] text-[var(--foreground-muted)]">{isPortfolioView ? `${businesses.length} in portfolio` : activeBusiness?.location ?? 'Select a business'}</span>
                  </span>
                  <ChevronDown size={14} className="hidden text-[var(--foreground-muted)] sm:block" />
                </button>
                {companyMenuOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Close business selection menu"
                      className="fixed inset-0 z-40 bg-transparent cursor-default"
                      onClick={() => setCompanyMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-12 z-50 w-[min(320px,calc(100vw-24px))] rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-2 shadow-xl text-[var(--foreground)]">
                      <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">Business Portfolio</p>
                      <button onClick={() => { setCompanyMenuOpen(false); selectBusiness('all'); }} className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[12px] font-semibold transition ${isPortfolioView ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]'}`}>
                        <BriefcaseBusiness size={15} className="text-[var(--accent)]" /> All businesses
                        {isPortfolioView && <Check size={14} className="ml-auto text-[var(--accent)]" />}
                      </button>
                      <p className="px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">Open a business</p>
                      <div className="relative px-2 pb-2">
                        <Search size={14} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
                        <input
                          value={businessSearch}
                          onChange={(event) => setBusinessSearch(event.target.value)}
                          aria-label="Search businesses"
                          placeholder="Find a business"
                          className="accounting-focus h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-inset)] pl-8 pr-3 text-[11px] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:bg-[var(--surface-elevated)] focus:border-[var(--accent)]"
                        />
                      </div>
                      <div className="max-h-56 space-y-1 overflow-y-auto">
                        {businesses
                          .filter((business) => `${business.name} ${business.industry} ${business.location}`.toLowerCase().includes(businessSearch.trim().toLowerCase()))
                          .map((business) => (
                          <button key={business.id} onClick={() => { setCompanyMenuOpen(false); selectBusiness(business.id); }} className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[12px] transition ${activeBusinessId === business.id ? 'bg-[var(--accent-soft)] font-semibold text-[var(--accent)]' : 'text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]'}`}>
                            <Building2 size={15} className="shrink-0 text-[var(--foreground-muted)]" />
                            <span className="min-w-0 flex-1 truncate">{business.name}</span>
                            {activeBusinessId === business.id && <Check size={14} className="shrink-0 text-[var(--accent)]" />}
                          </button>
                        ))}
                        {businesses.every((business) => !`${business.name} ${business.industry} ${business.location}`.toLowerCase().includes(businessSearch.trim().toLowerCase())) && (
                          <p className="px-3 py-3 text-[10px] text-[var(--foreground-muted)]">No matching businesses.</p>
                        )}
                      </div>
                      <button onClick={() => { setCompanyMenuOpen(false); setBusinessModalMode('standalone'); setBusinessOnboardingOpen(true); }} className="mt-2 flex w-full items-center gap-2 rounded-xl border-t border-[var(--border)] px-3 py-3 text-left text-[11px] font-semibold text-[var(--accent)] hover:bg-[var(--accent-soft)]">
                        <Plus size={15} /> Add a business
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Theme Toggle (Dark / Light) */}
              <button
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                className="accounting-focus rounded-xl p-2.5 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
              >
                {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
              </button>

              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen((value) => !value)}
                  aria-label={`Notifications, ${activeAlerts.length} active`}
                  aria-expanded={notificationsOpen}
                  className="accounting-focus relative rounded-xl p-2.5 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                >
                  <Bell size={18} />
                  {activeAlerts.length > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-rose-500" />}
                </button>
                {notificationsOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Close notifications menu"
                      className="fixed inset-0 z-40 bg-transparent cursor-default"
                      onClick={() => setNotificationsOpen(false)}
                    />
                    <div className="absolute right-0 top-12 z-50 w-[min(360px,calc(100vw-24px))] rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-3 shadow-xl text-[var(--foreground)]">
                      <div className="flex items-center justify-between px-2 pb-2 border-b border-[var(--border)]">
                        <p className="text-[13px] font-bold text-[var(--foreground)] uppercase tracking-wider font-mono">Notifications</p>
                        <span className="rounded bg-[var(--danger-soft)] border border-[var(--danger)]/30 px-2 py-0.5 text-[10px] font-bold text-[var(--danger)]">{activeAlerts.length} open</span>
                      </div>
                      {activeAlerts.length === 0 ? <p className="p-3 text-[12px] text-[var(--foreground-muted)]">You’re all caught up.</p> : activeAlerts.slice(0, 4).map((alert) => (
                        <button key={alert.id} onClick={() => { setNotificationsOpen(false); getAlertAction(alert); }} className="flex w-full items-start gap-2.5 rounded-xl p-2.5 text-left hover:bg-[var(--surface-hover)] transition">
                          <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${alert.severity === 'CRITICAL' ? 'bg-[#ef4444]' : alert.severity === 'WARNING' ? 'bg-[#f59e0b]' : 'bg-[#3b82f6]'}`} />
                          <span className="min-w-0"><span className="block text-[12px] font-bold text-[var(--foreground)]">{alert.title}</span><span className="mt-0.5 block text-[10px] text-[var(--foreground-muted)]">{alert.timestamp} · Open details</span></span>
                          <ChevronRight size={15} className="mt-1 shrink-0 text-[var(--foreground-muted)]" />
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen((value) => !value)}
                  aria-label="Open user profile menu"
                  aria-expanded={profileMenuOpen}
                  className="accounting-focus flex items-center gap-2 rounded-xl p-1.5 hover:bg-[var(--surface-hover)]"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-soft)] border border-[var(--accent)]/30 text-[11px] font-bold text-[var(--accent)] font-mono">AR</span>
                  <span className="hidden text-left lg:block"><span className="block text-[11px] font-bold text-[var(--foreground)]">Owner</span><span className="block text-[10px] text-[var(--foreground-muted)]">distroMesh HQ</span></span>
                  <ChevronDown size={13} className="hidden text-[var(--foreground-muted)] lg:block" />
                </button>
                {profileMenuOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Close profile menu"
                      className="fixed inset-0 z-40 bg-transparent cursor-default"
                      onClick={() => setProfileMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-12 z-50 w-48 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-2 shadow-xl text-[var(--foreground)]">
                      <p className="px-3 py-2 text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-wider font-mono">Account settings</p>
                      <button onClick={() => { setProfileMenuOpen(false); showToast('Profile settings are not configured in this demo'); }} className="w-full rounded-lg px-3 py-2 text-left text-[12px] text-[var(--foreground)] hover:bg-[var(--surface-hover)]">Profile &amp; preferences</button>
                      <button onClick={() => { setProfileMenuOpen(false); showToast('You are viewing the local demo workspace'); }} className="w-full rounded-lg px-3 py-2 text-left text-[12px] text-[var(--foreground)] hover:bg-[var(--surface-hover)]">Workspace security</button>
                    </div>
                  </>
                )}
              </div>
            </div>
            {mobileSearchOpen && (
              <div className="px-4 pb-3 sm:hidden">
                <div className="relative">
                  <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
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
                    className="accounting-focus h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] pl-9 pr-10 text-[13px] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:bg-[var(--surface-elevated)] focus:border-[var(--accent)]"
                  />
                  <button onClick={() => { setMobileSearchOpen(false); setGlobalSearch(''); setTransactionSearch(''); }} aria-label="Close search" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)]"><X size={15} /></button>
                </div>
              </div>
            )}
          </header>

          <main id="overview" className={activeSection === 'war-room' ? "w-full pb-12" : "mx-auto w-full max-w-[1600px] px-4 pb-12 pt-7 sm:px-6 lg:px-8"}>
            {isPortfolioView ? (
              <BusinessPortfolioOverview
                businesses={businesses}
                relationships={relationships}
                metrics={businessMetrics}
                onSelectBusiness={selectBusiness}
                onAddBusiness={() => { setBusinessModalMode('standalone'); setBusinessOnboardingOpen(true); }}
              />
            ) : activeSection === 'war-room' ? (
              <WarRoomView businessSlug={activeBusinessId} />
            ) : activeBusiness && !businessSnapshots[activeBusiness.id] ? (
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
                <div className="mb-2 flex items-center gap-2 text-[11px] font-medium text-[var(--foreground-muted)]">
                  <span>Workspace</span><ChevronRight size={12} /><span className="text-[var(--foreground)]">Overview</span>
                  <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--accent)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />Live Telemetry</span>
                </div>
                <h1 className="text-[25px] font-semibold tracking-[-0.035em] text-[var(--foreground)] sm:text-[29px]">{activeBusiness?.name ?? currentSnapshot.name}</h1>
                <p className="mt-1 text-[13px] text-[var(--foreground-muted)]">{currentSnapshot.industry} · {currentSnapshot.location}.</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-2.5 py-1 text-[9px] font-medium text-[var(--foreground-muted)]">
                    {currentSnapshot.principals.join(' · ')}
                  </span>
                  <span className="rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-2.5 py-1 text-[9px] font-medium text-[var(--foreground-muted)]">
                    {currentSnapshot.vanCount} Delivery Vans · {currentSnapshot.routesCount} Routes
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={getBusinessRoute(activeBusinessId, 'war-room')}
                  className="accounting-focus inline-flex h-9 items-center gap-2 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-3 text-[11px] font-semibold text-[var(--accent)] hover:bg-[var(--accent)]/20"
                >
                  <Monitor size={14} /> War Room
                </Link>
                <button onClick={() => openQuickAction('expense')} className="accounting-focus inline-flex h-9 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-3 text-[11px] font-semibold text-[var(--foreground)] hover:bg-[var(--surface-hover)]">
                  <Plus size={14} /> Add expense
                </button>
                <button onClick={() => openQuickAction('invoice')} className="accounting-focus inline-flex h-9 items-center gap-2 rounded-xl bg-[var(--accent)] px-3.5 text-[12px] font-semibold text-white shadow-sm transition hover:bg-[var(--accent-hover)]">
                  <Plus size={16} /> Create invoice
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
            <section aria-label="Portfolio filters" className="order-1 flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-[13px] font-semibold text-[var(--foreground)]">Narrow this view</h2>
                <p className="mt-1 text-[11px] text-[var(--foreground-muted)]">Show results for a specific brand or location.</p>
              </div>
              <div className="flex flex-wrap items-end gap-2">
                <label className="text-[10px] font-medium text-[var(--foreground-muted)]">
                  Brand
                  <select
                    value={principalFilter}
                    onChange={(event) => setPrincipalFilter(event.target.value as PrincipalFilter)}
                    className="accounting-focus mt-1 block h-9 min-w-36 rounded-lg border border-[var(--border)] bg-[var(--surface-inset)] px-3 text-[12px] text-[var(--foreground)]"
                  >
                    {principalOptions.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </label>
                <label className="text-[10px] font-medium text-[var(--foreground-muted)]">
                  Location
                  <select
                    value={depotFilter}
                    onChange={(event) => setDepotFilter(event.target.value as DepotFilter)}
                    className="accounting-focus mt-1 block h-9 min-w-32 rounded-lg border border-[var(--border)] bg-[var(--surface-inset)] px-3 text-[12px] text-[var(--foreground)]"
                  >
                    {depotOptions.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </label>
                <span className="mb-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-2.5 py-1 text-[10px] font-semibold text-[var(--accent)]">
                  Illustrative BDT data
                </span>
              </div>
            </section>

            <section id="related-businesses" aria-label="Related businesses" className="order-3 scroll-mt-24 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 shadow-xs sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <BriefcaseBusiness size={15} className="text-[var(--accent)]" />
                      <h2 className="text-[14px] font-semibold text-[var(--foreground)]">Connected businesses</h2>
                      <span className="rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--accent)]">{activeRelatedBusinesses.length + 1} businesses</span>
                    </div>
                    <p className="mt-1 text-[11px] text-[var(--foreground-muted)]">These businesses are linked to {activeBusiness?.name}. Their money and records stay separate.</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button onClick={() => { setBusinessModalMode('related'); setBusinessOnboardingOpen(true); }} className="accounting-focus inline-flex h-9 items-center gap-1.5 rounded-lg bg-[var(--accent)] px-3 text-[10px] font-semibold text-white hover:bg-[var(--accent-hover)]"><Plus size={13} /> Add a connected business</button>
                    {businesses.some((candidate) => candidate.id !== activeBusinessId && !activeRelatedBusinesses.some((item) => item.business.id === candidate.id)) && (
                      <button onClick={() => { setBusinessModalMode('link'); setBusinessOnboardingOpen(true); }} className="accounting-focus inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-[10px] font-semibold text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"><Share2 size={13} /> Connect existing</button>
                    )}
                  </div>
                </div>
                {activeRelatedBusinesses.length === 0 && <p className="mt-3 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-inset)] p-4 text-[11px] text-[var(--foreground-muted)]">No connected businesses yet. Add a new business or connect one already in your list.</p>}
                <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {[activeBusiness, ...activeRelatedBusinesses.map((item) => item.business)].filter((business): business is BusinessProfile => Boolean(business)).map((business) => {
                    const metrics = businessMetrics[business.id];
                    const relationship = activeRelatedBusinesses.find((item) => item.business.id === business.id)?.relationship;
                    return (
                      <button key={business.id} onClick={() => selectBusiness(business.id)} className={`accounting-focus rounded-xl border p-3 text-left transition hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)] ${business.id === activeBusinessId ? 'border-[var(--accent)]/40 bg-[var(--accent-soft)]/20' : 'border-[var(--border)] bg-[var(--surface)]'}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-[11px] font-semibold text-[var(--foreground)]">{business.name}</p>
                            <p className="mt-0.5 truncate text-[9px] text-[var(--foreground-muted)]">{business.industry} · {business.location}</p>
                            {relationship?.relationshipType && <span className="mt-1 inline-flex rounded-full border border-[var(--border)] bg-[var(--surface-inset)] px-2 py-0.5 text-[9px] font-medium text-[var(--foreground-muted)]">{relationship.parentBusinessId === activeBusinessId ? relationship.relationshipType : `Main business · ${relationship.relationshipType}`}</span>}
                          </div>
                          {business.id === activeBusinessId
                            ? <span className="rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-2 py-0.5 text-[8px] font-semibold text-[var(--accent)]">CURRENT</span>
                            : <ArrowRight size={13} className="shrink-0 text-[var(--foreground-muted)]" />}
                        </div>
                        <div className="mt-2 grid grid-cols-3 gap-2 border-t border-[var(--border)] pt-2">
                          <span><span className="block text-[8px] text-[var(--foreground-muted)]">Cash</span><span className="mt-0.5 block text-[10px] font-semibold tabular-nums text-[var(--foreground)]">{metrics?.availableCash == null ? 'Not available' : compactCurrency(metrics.availableCash)}</span></span>
                          <span><span className="block text-[8px] text-[var(--foreground-muted)]">Monthly revenue</span><span className="mt-0.5 block text-[10px] font-semibold tabular-nums text-[var(--foreground)]">{metrics?.monthlyRevenue == null ? 'Not available' : compactCurrency(metrics.monthlyRevenue)}</span></span>
                          <span><span className="block text-[8px] text-[var(--foreground-muted)]">Invoices due</span><span className="mt-0.5 block text-[10px] font-semibold tabular-nums text-[var(--foreground)]">{metrics?.receivables == null ? 'Not available' : compactCurrency(metrics.receivables)}</span></span>
                          <span><span className="block text-[8px] text-[var(--foreground-muted)]">Net profit</span><span className="mt-0.5 block text-[10px] font-semibold tabular-nums text-[var(--success)]">{metrics?.monthlyNetProfit == null ? 'Not available' : compactCurrency(metrics.monthlyNetProfit)}</span></span>
                          <span><span className="block text-[8px] text-[var(--foreground-muted)]">Customers</span><span className="mt-0.5 block text-[10px] font-semibold tabular-nums text-[var(--foreground)]">{(metrics?.customerCount ?? business.customerCount)?.toLocaleString('en-BD') ?? 'Not available'}</span></span>
                          <span><span className="block text-[8px] text-[var(--foreground-muted)]">Team</span><span className="mt-0.5 block text-[10px] font-semibold tabular-nums text-[var(--foreground)]">{metrics?.employeeCount ?? business.employeeCount ?? 'Not available'}</span></span>
                        </div>
                      </button>
                    );
                  })}
                </div>
            </section>

            <section aria-label="Key financial metrics" className="order-2 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 shadow-xs sm:p-5">
                <div className="flex items-start justify-between">
                  <div><p className="text-[12px] font-medium text-[var(--foreground-muted)]">Available cash</p><p className="mt-3 text-[25px] font-semibold tracking-[-0.04em] text-[var(--foreground)] tabular-nums">{compactCurrency(liquidCash)}</p></div>
                  <span className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-soft)] p-2.5 text-[var(--accent)]"><Wallet size={18} /></span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-3">
                  <span className="flex items-center gap-1 text-[11px] text-[var(--foreground-muted)]"><ArrowDownLeft size={13} className="text-[var(--success)]" /> Bank {compactCurrency(portfolio.bankCash)} + cash on hand {compactCurrency(portfolio.vaultCash)}</span>
                </div>
              </article>
              <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 shadow-xs sm:p-5">
                <div className="flex items-start justify-between">
                  <div><p className="text-[12px] font-medium text-[var(--foreground-muted)]">Monthly net profit</p><p className="mt-3 text-[25px] font-semibold tracking-[-0.04em] text-[var(--success)] tabular-nums">{compactCurrency(portfolio.monthlyNetProfit)}</p></div>
                  <span className="rounded-xl border border-[var(--success)]/30 bg-[var(--success-soft)] p-2.5 text-[var(--success)]"><Activity size={18} /></span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-3">
                  <span className="text-[11px] text-[var(--foreground-muted)]">After example interest and tax</span>
                  <span className="text-[11px] font-semibold text-[var(--success)]">{formatPortfolioMargin(portfolio.monthlyNetProfit)} margin</span>
                </div>
              </article>
              <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 shadow-xs sm:p-5">
                <div className="flex items-start justify-between">
                  <div><p className="text-[12px] font-medium text-[var(--foreground-muted)]">Customer invoices due</p><p className="mt-3 text-[25px] font-semibold tracking-[-0.04em] text-[var(--foreground)] tabular-nums">{compactCurrency(portfolio.receivables)}</p></div>
                  <span className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-soft)] p-2.5 text-[var(--accent)]"><ArrowDownRight size={18} /></span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-3">
                  <span className="text-[11px] text-[var(--foreground-muted)]">Illustrative customer balances</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => goTo('invoicing')} className="text-[11px] font-semibold text-[var(--accent)] hover:underline">View invoices <ArrowRight size={12} className="ml-0.5 inline" /></button>
                  </div>
                </div>
              </article>
              <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 shadow-xs sm:p-5">
                <div className="flex items-start justify-between">
                  <div><p className="text-[12px] font-medium text-[var(--foreground-muted)]">Supplier payment due</p><p className="mt-3 text-[25px] font-semibold tracking-[-0.04em] text-[var(--danger)] tabular-nums">{compactCurrency(portfolio.upcomingObligation)}</p></div>
                  <span className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger-soft)] p-2.5 text-[var(--danger)]"><ArrowUpRight size={18} /></span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-3">
                  <span className="text-[11px] text-[var(--foreground-muted)]">{principalFilter === 'Pureit (Durables)' ? 'No payment in demo scope' : `Principal · due in ${state.obligationDueHours}h`}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openDrawer('OBLIGATION')} className="text-[11px] font-semibold text-[var(--accent)] hover:underline">Review</button>
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
              <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-[15px] font-semibold text-[var(--foreground)]">Monthly income &amp; expenses</h2>
                    <p className="mt-1 text-[11px] text-[var(--foreground-muted)]">Example figures · BDT</p>
                  </div>
                  <span className="rounded-lg border border-[var(--border)] bg-[var(--surface-inset)] px-2.5 py-1 text-[10px] font-semibold text-[var(--foreground-muted)]">26 working days</span>
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
                    <div key={item.label} className={`flex items-center justify-between gap-2 border-b border-[var(--border)] pb-2 ${item.emphasis ? 'font-semibold text-[var(--foreground)]' : 'text-[var(--foreground-muted)]'}`}>
                      <span>{item.label}</span>
                      <span className={`whitespace-nowrap tabular-nums ${item.amount < 0 ? 'text-[var(--danger)]' : ''}`}>{formatBDT(item.amount)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[10px] text-[var(--foreground-muted)]">
                  <span>Gross profit margin <strong className="text-[var(--foreground)]">{formatPortfolioMargin(portfolio.monthlyGrossProfit)}</strong></span>
                  <span>Operating profit margin <strong className="text-[var(--foreground)]">{formatPortfolioMargin(portfolio.monthlyEbit)}</strong></span>
                  <span>Net margin <strong className="text-[var(--foreground)]">{formatPortfolioMargin(portfolio.monthlyNetProfit)}</strong></span>
                </div>
                <p className="mt-3 text-[10px] leading-relaxed text-[var(--foreground-muted)]">
                  Amounts are examples and can be filtered by brand or location. Sales are counted when delivered; collected cash is shown separately.
                </p>
              </article>

              <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-[15px] font-semibold text-[var(--foreground)]">Cash, stock &amp; supplier payments</h2>
                    <p className="mt-1 text-[11px] text-[var(--foreground-muted)]">Cash you can use is different from money tied up in stock or unpaid bills.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => openDrawer('WORKING_CAPITAL')} className="text-[11px] font-semibold text-[var(--accent)] hover:underline">Operating working capital <ArrowRight size={12} className="ml-1 inline" /></button>
                    <button onClick={() => openDrawer('OBLIGATION')} className="text-[11px] font-semibold text-[var(--accent)] hover:underline">View cash position <ArrowRight size={12} className="ml-1 inline" /></button>
                  </div>
                </div>
                <details className="group mt-4">
                  <summary className="accounting-focus flex cursor-pointer list-none items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface-inset)] px-3 py-2.5 text-[11px] font-semibold text-[var(--foreground)] marker:hidden hover:bg-[var(--surface-hover)]">
                    Show stock and payment details
                    <ChevronDown size={15} className="text-[var(--foreground-muted)] transition-transform group-open:rotate-180" />
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
                        <div key={item.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
                          <p className="text-[10px] leading-snug text-[var(--foreground-muted)]">{item.label}</p>
                          <p className="mt-1 text-[14px] font-semibold tabular-nums text-[var(--foreground)]">{compactCurrency(item.value)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 grid grid-cols-4 gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-center">
                      {[
                        { label: 'Customer payment time', value: portfolio.dso },
                        { label: 'Time stock is held', value: portfolio.dio },
                        { label: 'Supplier payment time', value: portfolio.dpo },
                        { label: 'Cash cycle', value: portfolio.cashConversionCycle },
                      ].map((item) => (
                        <div key={item.label}>
                          <p className="text-[10px] text-[var(--foreground-muted)]">{item.label}</p>
                          <p className="mt-1 text-[14px] font-semibold tabular-nums text-[var(--foreground)]">{item.value.toFixed(1)} days</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] p-3">
                      <div className="flex items-center justify-between gap-3 text-[11px]">
                        <span className="text-[var(--foreground-muted)]">Bank balance after supplier payment</span>
                        <strong className="tabular-nums text-[var(--foreground)]">{formatBDT(portfolio.bankCash - portfolio.upcomingObligation)}</strong>
                        <span className={`rounded-full border px-2 py-0.5 text-[9px] font-semibold ${portfolio.bankCash >= portfolio.upcomingObligation ? 'border-[var(--success)]/30 bg-[var(--success-soft)] text-[var(--success)]' : 'border-[var(--danger)]/30 bg-[var(--danger-soft)] text-[var(--danger)]'}`}>
                          {portfolio.bankCash >= portfolio.upcomingObligation ? 'Covered' : 'Shortfall'}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-3 text-[11px]">
                        <span className="text-[var(--foreground-muted)]">Cash after payment, including cash on hand</span>
                        <strong className="tabular-nums text-[var(--success)]">{formatBDT(liquidCash - portfolio.upcomingObligation)}</strong>
                      </div>
                    </div>
                  </div>
                </details>
              </article>
            </section>

            {/* Cross-Entity Benchmark Matrix Collapsible */}
            <details className="mt-4 group rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 shadow-xs">
              <summary className="accounting-focus flex cursor-pointer list-none items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-[var(--foreground)] marker:hidden hover:text-[var(--accent)] transition-colors">
                <div className="flex items-center gap-2">
                  <Layers size={15} className="text-[var(--accent)]" />
                  <span>Cross-Entity Benchmark Matrix (All 5 Businesses + Empire in One Look)</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[var(--foreground-muted)] font-normal font-sans">
                  <span>Compare with other entities</span>
                  <ChevronDown size={14} className="transition-transform group-open:rotate-180" />
                </div>
              </summary>
              <div className="mt-4 pt-3 border-t border-[var(--border)]">
                <CrossEntityCommandMatrix
                  activeBusinessId={activeBusinessId}
                  onSelectBusiness={selectBusiness}
                />
              </div>
            </details>

            {/* Executive Operations Pulse (7-Day Performance, Dispatch Runway, Capital Solvency, and Exception Triage) */}
            <ExecutiveOperationsGrid
              businessId={activeBusinessId}
              className="mt-4"
              onOpenDrawer={(drawer) => openDrawer(drawer)}
            />

            <section aria-label="Today’s business activity" className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 shadow-xs">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-[15px] font-semibold text-[var(--foreground)]">Today’s business activity</h2>
                  <p className="mt-1 text-[11px] text-[var(--foreground-muted)]">Delivered sales, cash vs. credit, dispatch, returns, and till control.</p>
                </div>
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface-inset)] px-2.5 py-1 text-[10px] font-medium text-[var(--foreground-muted)]">Daily demo snapshot · BDT</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                {[
                  { label: 'Delivered sales', value: compactCurrency(portfolio.dailyDeliveredSales), tone: 'text-[var(--foreground)]' },
                  { label: 'Cash sales', value: compactCurrency(portfolio.dailyCashSales), tone: 'text-[var(--success)]' },
                  { label: 'New credit sales', value: compactCurrency(portfolio.dailyFreshCredit), tone: 'text-[var(--warning)]' },
                  { label: 'Past-due invoices collected', value: compactCurrency(portfolio.dailyOldDuesCollected), tone: 'text-[var(--success)]' },
                  { label: 'Net cash added', value: compactCurrency(portfolio.dailyNetCashAdded), tone: 'text-[var(--success)]' },
                  { label: 'Expected cash on hand', value: compactCurrency(portfolio.expectedTillCash), tone: 'text-[var(--foreground)]' },
                  { label: 'Counted cash on hand', value: compactCurrency(portfolio.countedTillCash), tone: 'text-[var(--foreground)]' },
                  { label: 'Cash difference', value: formatBDT(portfolio.cashVariance), tone: portfolio.cashVariance < 0 ? 'text-[var(--danger)]' : 'text-[var(--success)]' },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
                    <p className="text-[10px] text-[var(--foreground-muted)]">{item.label}</p>
                    <p className={`mt-1 text-[16px] font-semibold tabular-nums ${item.tone}`}>{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-1 gap-3 text-[11px] sm:grid-cols-3">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] p-3">
                  <span className="text-[var(--foreground-muted)]">Credit share of delivered sales</span>
                  <strong className="ml-2 text-[var(--foreground)]">{portfolio.dailyDeliveredSales ? (portfolio.dailyFreshCredit / portfolio.dailyDeliveredSales * 100).toFixed(1) : '0.0'}%</strong>
                </div>
                <div className="rounded-xl border border-[var(--warning)]/30 bg-[var(--warning-soft)] p-3">
                  <span className="text-[var(--warning)] font-medium">Dispatch</span>
                  <strong className="ml-2 text-[var(--warning)]">
                    {activeBusinessId === 'unilever-distribution' && state.hardwareReplaced
                      ? 'Printer replacement simulated · monitor next dispatch'
                      : currentSnapshot.dispatchDelayMin === 0
                        ? `${currentSnapshot.dispatchTarget} target · on time`
                        : `${currentSnapshot.dispatchTarget} target · ${currentSnapshot.dispatchActual} actual · ${currentSnapshot.dispatchDelayMin} min late`}
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={() => openDrawer('INCIDENT')}
                  className={`accounting-focus rounded-xl border p-3 text-left transition ${
                    currentSnapshot.dispatchStatus === 'ON_TIME'
                      ? 'border-[var(--success)]/30 bg-[var(--success-soft)] hover:bg-[var(--success-soft)]/80'
                      : 'border-[var(--danger)]/30 bg-[var(--danger-soft)] hover:bg-[var(--danger-soft)]/80'
                  }`}
                >
                  <span className={`font-medium ${currentSnapshot.dispatchStatus === 'ON_TIME' ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                    {currentSnapshot.dispatchStatus === 'ON_TIME' ? 'Dispatch Status: Normal' : 'Returns & Bottleneck Incident'}
                  </span>
                  <strong className={`ml-2 block ${currentSnapshot.dispatchStatus === 'ON_TIME' ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                    {currentSnapshot.dispatchStatus === 'ON_TIME'
                      ? '100% routes dispatched on time'
                      : `${currentSnapshot.dispatchBottleneck}`}
                  </strong>
                  <p className={`mt-1 text-[10px] ${currentSnapshot.dispatchStatus === 'ON_TIME' ? 'text-[var(--success)]/80' : 'text-[var(--danger)]/80'}`}>
                    {currentSnapshot.dispatchStatus === 'ON_TIME' ? 'All depot loading bays cleared' : 'Tap for triage & hardware mitigation'}
                  </p>
                </button>
              </div>
              <p className="mt-3 text-[10px] text-[var(--foreground-muted)]">
                Daily cash added = cash sales + old dues collected − cash expenses. This is a cash measure, not daily profit.
              </p>
            </section>

            <section aria-label="Route cash and sales" className="mt-4 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] shadow-xs">
              <div className="flex flex-wrap items-start justify-between gap-3 p-5">
                <div>
                  <h2 className="text-[15px] font-semibold text-[var(--foreground)]">Route cash &amp; sales</h2>
                  <p className="mt-1 text-[11px] text-[var(--foreground-muted)]">Cash handed in, credit sales, and expected cash by delivery route.</p>
                </div>
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface-inset)] px-2.5 py-1 text-[10px] font-medium text-[var(--foreground-muted)]">{scopedRoutes.length} routes · filtered to selected scope</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[780px] border-t border-[var(--border)] text-left text-[11px]">
                  <thead className="bg-[var(--surface-inset)] text-[10px] font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
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
                  <tbody className="divide-y divide-[var(--border)]">
                    {scopedRoutes.map((route) => (
                      <tr key={route.id} className="bg-[var(--surface-elevated)] transition hover:bg-[var(--surface-hover)]">
                        <td className="px-5 py-3">
                          <button onClick={() => openDrawer('ROUTE_DETAIL', route.id)} className="accounting-focus rounded text-left">
                            <span className="block font-semibold text-[var(--foreground)]">{route.vanNumber} · {route.routeName}</span>
                            <span className="mt-0.5 block text-[10px] text-[var(--foreground-muted)]">JSR: {route.jsrName} · SR: {route.srName}</span>
                          </button>
                        </td>
                        <td className="px-3 py-3 text-[var(--foreground-muted)]">{route.depot}</td>
                        <td className="px-3 py-3 text-right font-medium tabular-nums text-[var(--foreground)]">{formatBDT(route.collected)}</td>
                        <td className="px-3 py-3 text-right tabular-nums text-[var(--foreground-muted)]">{formatBDT(route.credit)}</td>
                        <td className="px-3 py-3 text-right tabular-nums text-[var(--foreground-muted)]">{formatBDT(route.expected)}</td>
                        <td className={`px-3 py-3 text-right font-semibold tabular-nums ${route.variance < 0 ? 'text-[var(--danger)]' : route.variance > 0 ? 'text-[var(--success)]' : 'text-[var(--foreground-muted)]'}`}>
                          {route.variance > 0 ? '+' : ''}{formatBDT(route.variance)}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <span className={`inline-flex rounded-full border px-2 py-1 text-[9px] font-semibold ${
                            route.status === 'ACTION' ? 'border-[var(--danger)]/30 bg-[var(--danger-soft)] text-[var(--danger)]'
                              : route.status === 'REVIEW' ? 'border-[var(--warning)]/30 bg-[var(--warning-soft)] text-[var(--warning)]'
                                : 'border-[var(--success)]/30 bg-[var(--success-soft)] text-[var(--success)]'
                          }`}>
                            {route.status === 'ACTION' ? 'Action required' : route.status === 'REVIEW' ? 'Needs review' : 'On track'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t border-[var(--border)] bg-[var(--surface-inset)] font-semibold text-[var(--foreground)]">
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
              <section aria-labelledby="daily-actions-heading" className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 shadow-xs">
                <div className="mb-4">
                  <h2 id="daily-actions-heading" className="text-[15px] font-semibold text-[var(--foreground)]">Daily business actions</h2>
                  <p className="mt-1 text-[11px] text-[var(--foreground-muted)]">Manage customer credit, prepare a cash deposit, or finish today’s close.</p>
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                  <button
                    onClick={() => openModal('CREDIT_LOCK')}
                    disabled={state.creditLockActive}
                    className="accounting-focus flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-3 text-[11px] font-semibold text-white transition hover:bg-[var(--accent-hover)] disabled:cursor-default disabled:border disabled:border-[var(--accent)]/30 disabled:bg-[var(--accent-soft)] disabled:text-[var(--accent)]"
                  >
                    <ShieldCheck size={15} />
                    {state.creditLockActive ? 'Credit paused' : 'Pause customer credit'}
                  </button>
                  <button
                    onClick={() => openModal('BANK_DEPOSIT')}
                    disabled={state.depositPrepared}
                    className="accounting-focus flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-[11px] font-semibold text-[var(--foreground)] transition hover:bg-[var(--surface-hover)] disabled:cursor-default disabled:bg-[var(--surface-inset)] disabled:text-[var(--foreground-muted)]"
                  >
                    <Download size={15} />
                    {state.depositPrepared ? 'Deposit prepared' : 'Prepare bank deposit'}
                  </button>
                  <button
                    onClick={() => openModal('DAY_END_CLOSE')}
                    disabled={state.dayClosed}
                    className="accounting-focus flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-[11px] font-semibold text-[var(--foreground)] transition hover:bg-[var(--surface-hover)] disabled:cursor-default disabled:bg-[var(--surface-inset)] disabled:text-[var(--foreground-muted)]"
                  >
                    <Check size={15} />
                    {state.dayClosed ? 'Day closed' : 'Review and close day'}
                  </button>
                </div>
              </section>
            )}

            <section className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(310px,0.85fr)]">
              <article id="reports" className="scroll-mt-24 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 sm:p-6 shadow-xs">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2"><h2 className="text-[15px] font-semibold text-[var(--foreground)]">Cash position &amp; today’s activity</h2><span className="rounded-md border border-[var(--border)] bg-[var(--surface-inset)] px-2 py-1 text-[10px] font-medium text-[var(--foreground-muted)]">SAMPLE DATA</span></div>
                    <p className="mt-1 text-[11px] text-[var(--foreground-muted)]">A current snapshot from the selected business scope, not a dated cash-flow forecast.</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    { label: 'Cash available', value: formatBDT(liquidCash), detail: 'Bank + cash on hand' },
                    { label: 'Collections today', value: formatBDT(collectedToday), detail: 'Recorded route collections' },
                    { label: 'Supplier payment due', value: formatBDT(portfolio.upcomingObligation), detail: portfolio.upcomingObligation > 0 ? `Due in ${state.obligationDueHours} hours` : 'None in selected sample scope' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5">
                      <p className="text-[10px] font-medium text-[var(--foreground-muted)]">{item.label}</p>
                      <p className="mt-1.5 text-[17px] font-semibold tabular-nums text-[var(--foreground)]">{item.value}</p>
                      <p className="mt-1 text-[10px] text-[var(--foreground-muted)]">{item.detail}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] pt-3 text-[11px]">
                  <span className={dueSoon ? 'font-medium text-[var(--warning)]' : 'text-[var(--foreground-muted)]'}>
                    {dueSoon ? `${dueSoon} route ${dueSoon === 1 ? 'settlement needs' : 'settlements need'} review.` : 'No route exceptions in the current sample scope.'}
                  </span>
                  <button onClick={() => openDrawer(dueSoon ? 'RECONCILIATION' : 'OBLIGATION')} className="font-semibold text-[var(--accent)] hover:underline">
                    {dueSoon ? 'Review route cash' : 'Review payment details'} <ArrowRight size={12} className="ml-1 inline" />
                  </button>
                </div>
              </article>

              <article className="flex scroll-mt-24 flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between">
                  <div><h2 className="text-[15px] font-semibold text-[var(--foreground)]">Quick actions</h2><p className="mt-1 text-[11px] text-[var(--foreground-muted)]">Common tasks, one click away</p></div>
                  <span className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-soft)] p-2 text-[var(--accent)]"><FilePlus2 size={17} /></span>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2.5">
                  <button onClick={() => openDrawer('RECONCILIATION')} className="accounting-focus flex min-h-[74px] items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-left transition hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)]">
                    <span className="rounded-lg border border-[var(--warning)]/30 bg-[var(--warning-soft)] p-2 text-[var(--warning)]"><FileCheck2 size={17} /></span><span><span className="block text-[12px] font-semibold text-[var(--foreground)]">Review route cash</span><span className="mt-1 block text-[10px] text-[var(--foreground-muted)]">{dueSoon ? `${dueSoon} item needs review` : 'Compare cash handed in'}</span></span>
                  </button>
                  <label className="accounting-focus flex min-h-[74px] cursor-pointer items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-left transition hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)]">
                    <span className="rounded-lg border border-[var(--accent)]/30 bg-[var(--accent-soft)] p-2 text-[var(--accent)]"><Upload size={17} /></span><span><span className="block text-[12px] font-semibold text-[var(--foreground)]">Select a receipt</span><span className="mt-1 block text-[10px] text-[var(--foreground-muted)]">PDF or image</span></span>
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
                <div className="mt-auto flex items-center gap-2 border-t border-[var(--border)] pt-4 text-[11px] text-[var(--foreground-muted)]">
                  <Command size={13} /><span>Shortcuts</span><kbd className="rounded border border-[var(--border)] bg-[var(--surface-inset)] px-1.5 py-0.5 text-[10px] text-[var(--foreground-muted)]">⌘ K</kbd><span>search</span><kbd className="rounded border border-[var(--border)] bg-[var(--surface-inset)] px-1.5 py-0.5 text-[10px] text-[var(--foreground-muted)]">⌘ I</kbd><span>invoice</span>
                </div>
              </article>
            </section>

            <section className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(310px,0.85fr)]">
              <article id="general-ledger" className="min-w-0 scroll-mt-24 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] shadow-xs">
                <div className="flex flex-col justify-between gap-3 border-b border-[var(--border)] px-5 py-4 sm:flex-row sm:items-center">
                  <div><h2 className="text-[15px] font-semibold text-[var(--foreground)]">Recent transactions</h2><p className="mt-1 text-[11px] text-[var(--foreground-muted)]">Sample route activity and supplier payments</p></div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
                      <input value={transactionSearch} onChange={(event) => setTransactionSearch(event.target.value)} aria-label="Filter transactions" placeholder="Filter" className="accounting-focus h-8 w-[130px] rounded-lg border border-[var(--border)] bg-[var(--surface-inset)] pl-8 pr-2 text-[11px] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)]" />
                    </div>
                    <div className="flex rounded-lg border border-[var(--border)] bg-[var(--surface-inset)] p-0.5">
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
                          className={`accounting-focus rounded-md px-2 py-1.5 text-[10px] font-medium transition ${transactionFilter === filter ? 'border border-[var(--border)] bg-[var(--surface-elevated)] font-semibold text-[var(--foreground)] shadow-xs' : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'}`}
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
                      className="accounting-focus rounded-lg p-2 text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                    >
                      <Filter size={15} />
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[770px] border-collapse text-left">
                    <thead><tr className="bg-[var(--surface-inset)] text-[10px] font-semibold uppercase tracking-[0.09em] text-[var(--foreground-muted)]">
                      <th className="px-5 py-3 font-medium">Date</th><th className="px-5 py-3 font-medium">Description</th><th className="px-5 py-3 font-medium">Category</th><th className="px-5 py-3 font-medium">Payment method</th><th className="px-5 py-3 text-right font-medium">Amount</th><th className="px-5 py-3 text-right font-medium">Status</th>
                    </tr></thead>
                    <tbody>{renderTransactionRows(showAllTransactions ? filteredRows : filteredRows.slice(0, 8))}</tbody>
                  </table>
                  {filteredRows.length === 0 && <div className="px-5 py-12 text-center text-[12px] text-[var(--foreground-muted)]">No transactions match those filters.</div>}
                </div>
                <div className="flex items-center justify-between border-t border-[var(--border)] px-5 py-3 text-[11px] text-[var(--foreground-muted)]">
                  <span>Showing {showAllTransactions ? filteredRows.length : Math.min(filteredRows.length, 8)} of {filteredRows.length} entries <span className="text-[var(--foreground-muted)]/60">· Sample data</span></span>
                  {filteredRows.length > 8 && (
                    <button
                      onClick={() => setShowAllTransactions((showAll) => !showAll)}
                      aria-expanded={showAllTransactions}
                      className="font-semibold text-[var(--accent)] hover:underline"
                    >
                      {showAllTransactions ? 'Show recent only' : 'View all activity'} <ArrowRight size={12} className="ml-1 inline" />
                    </button>
                  )}
                </div>
              </article>

              <aside className="flex scroll-mt-24 flex-col gap-4">
                <article id="ai-assistant" className={`rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 shadow-xs transition-shadow ${aiOpen ? 'ring-1 ring-[var(--accent)]' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-soft)] text-[var(--accent)]"><Sparkles size={18} /></span>
                      <div><h2 className="text-[14px] font-semibold text-[var(--foreground)]">Ask about your business</h2><p className="mt-0.5 text-[10px] text-[var(--foreground-muted)]">Answers from sample data</p></div>
                    </div>
                    <button onClick={() => setAiOpen((value) => !value)} aria-label={aiOpen ? 'Collapse AI assistant' : 'Expand AI assistant'} className="accounting-focus rounded-lg p-1.5 text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)]"><MoreHorizontal size={18} /></button>
                  </div>
                  <p className="mt-4 text-[12px] leading-relaxed text-[var(--foreground-muted)]">Get a quick answer from the financial information currently in your workspace.</p>
                  <div className="mt-3 space-y-1.5">
                    {['What is my available cash?', 'Show pending invoices', 'What supplier payments are due?'].map((question) => (
                      <button key={question} onClick={() => { setAiOpen(true); runAssistantQuery(question); }} className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-[11px] text-[var(--foreground-muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--accent)]">
                        <span>{question}</span><ArrowRight size={13} className="shrink-0 text-[var(--foreground-muted)]" />
                      </button>
                    ))}
                  </div>
                  {aiResponse && (
                    <div aria-live="polite" className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] p-3 text-[11px] leading-relaxed text-[var(--foreground)]">
                      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)]">Answer from demo data</span>{aiResponse}
                    </div>
                  )}
                  <form onSubmit={(event) => { event.preventDefault(); runAssistantQuery(); }} className="mt-4 flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] p-1.5 pl-3 focus-within:border-[var(--accent)]">
                    <MessageSquareText size={15} className="shrink-0 text-[var(--foreground-muted)]" />
                    <input value={aiQuery} onChange={(event) => setAiQuery(event.target.value)} onFocus={() => setAiOpen(true)} aria-label="Ask a question about your books" placeholder="Ask about your finances..." className="accounting-focus min-w-0 flex-1 border-0 bg-transparent py-1.5 text-[11px] text-[var(--foreground)] outline-none placeholder:text-[var(--foreground-muted)]" />
                    <button type="submit" aria-label="Send question" className="accounting-focus flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"><Send size={13} /></button>
                  </form>
                  <p className="mt-2 text-[10px] leading-relaxed text-[var(--foreground-muted)]">AI answers are limited to demo data and may not include invoice due dates.</p>
                </article>

                <article id="bank-reconciliation" className="scroll-mt-24 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div><h2 className="text-[14px] font-semibold text-[var(--foreground)]">Needs attention</h2><p className="mt-1 text-[10px] text-[var(--foreground-muted)]">{activeAlerts.length} open items</p></div>
                    <span className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger-soft)] p-2 text-[var(--danger)]"><CircleHelp size={16} /></span>
                  </div>
                  {activeAlerts.length ? activeAlerts.slice(0, 2).map((alert) => (
                    <button key={alert.id} onClick={() => getAlertAction(alert)} className="mt-3 flex w-full items-start gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-left transition hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)]">
                      <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${alert.severity === 'CRITICAL' ? 'bg-[#ef4444]' : alert.severity === 'WARNING' ? 'bg-[#f59e0b]' : 'bg-[#3b82f6]'}`} />
                      <span className="min-w-0 flex-1"><span className="block truncate text-[11px] font-semibold text-[var(--foreground)]">{alert.title}</span><span className="mt-1 block text-[10px] text-[var(--foreground-muted)]">{alert.timestamp} · Review details</span></span>
                      <ChevronRight size={14} className="mt-1 shrink-0 text-[var(--foreground-muted)]" />
                    </button>
                  )) : <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] p-3 text-[11px] text-[var(--foreground-muted)]">No open items. Your demo ledger is up to date.</div>}
                  <button onClick={() => openDrawer('RECONCILIATION')} className="mt-3 w-full rounded-xl border border-[var(--border)] px-3 py-2 text-[11px] font-semibold text-[var(--accent)] transition hover:bg-[var(--accent-soft)]">Open bank reconciliation</button>
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
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs" onMouseDown={(event) => { if (event.target === event.currentTarget) setQuickAction(null); }}>
          <form onSubmit={saveQuickAction} className="w-full max-w-[420px] rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 text-[var(--foreground)] shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-soft)] p-2.5 text-[var(--accent)]">{quickAction === 'invoice' ? <FileText size={18} /> : <CreditCard size={18} />}</span>
                <div><h2 className="text-[15px] font-semibold text-[var(--foreground)]">{quickAction === 'invoice' ? 'Create invoice' : 'Add expense'}</h2><p className="mt-1 text-[11px] text-[var(--foreground-muted)]">Add a record to this local demo ledger</p></div>
              </div>
              <button type="button" onClick={() => setQuickAction(null)} aria-label="Close dialog" className="accounting-focus rounded-lg p-1.5 text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)]"><X size={18} /></button>
            </div>
            <label className="mt-5 block text-[11px] font-medium text-[var(--foreground-muted)]">
              Description
              <input required autoFocus value={formDescription} onChange={(event) => setFormDescription(event.target.value)} placeholder={quickAction === 'invoice' ? 'e.g. Retailer order' : 'e.g. Delivery fuel'} className="accounting-focus mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] px-3 text-[12px] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)]" />
            </label>
            <label className="mt-4 block text-[11px] font-medium text-[var(--foreground-muted)]">
              Amount (BDT)
              <input required min="1" step="0.01" type="number" value={formAmount} onChange={(event) => setFormAmount(event.target.value)} placeholder="0.00" className="accounting-focus mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] px-3 text-[12px] tabular-nums text-[var(--foreground)] placeholder:text-[var(--foreground-muted)]" />
            </label>
            {activeBusinessId === 'unilever-distribution' && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="text-[11px] font-medium text-[var(--foreground-muted)]">
                Principal
                <select value={formPrincipal} onChange={(event) => setFormPrincipal(event.target.value as Exclude<PrincipalFilter, 'All principals'>)} className="accounting-focus mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] px-3 text-[12px] text-[var(--foreground)]">
                  {principalOptions.filter((option) => option !== 'All principals').map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
              <label className="text-[11px] font-medium text-[var(--foreground-muted)]">
                Depot
                <select value={formDepot} onChange={(event) => setFormDepot(event.target.value as Exclude<DepotFilter, 'All depots'>)} className="accounting-focus mt-1.5 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] px-3 text-[12px] text-[var(--foreground)]">
                  {depotOptions.filter((option) => option !== 'All depots').map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
            </div>
            )}
            <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] p-3 text-[10px] leading-relaxed text-[var(--foreground-muted)]">
              This entry is stored only in the current browser session. It will not be sent to accounting software or saved to a server.
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setQuickAction(null)} className="accounting-focus rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-[12px] font-medium text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]">Cancel</button>
              <button type="submit" className="accounting-focus rounded-xl bg-[var(--accent)] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[var(--accent-hover)]">{quickAction === 'invoice' ? 'Add invoice' : 'Save expense'}</button>
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
