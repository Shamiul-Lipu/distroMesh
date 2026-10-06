export type OperatingMode = 'MORNING' | 'LIVE_OPS' | 'EVENING_RECON' | 'CRITICAL_RISK';

export type LiquidityStatus = 'SAFE' | 'WATCH' | 'CRITICAL';

export type RouteStatus = 'OK' | 'WARNING' | 'EXCEPTION';

export interface RouteData {
  id: string;
  vanNumber: string;
  routeName: string;
  depot: 'Sherpur' | 'Bogura';
  dsrName: string;
  collected: number;
  expected: number;
  credit: number;
  variance: number;
  status: RouteStatus;
  retailersVisited: number;
  totalRetailers: number;
  completionPct: number;
  lastCheckin: string;
  notes?: string;
}

export interface ExecutiveAlert {
  id: string;
  title: string;
  category: 'CASH' | 'HARDWARE' | 'OBLIGATION' | 'EXECUTION';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  whatHappened: string;
  impact: string;
  whyItMatters: string;
  availableAction: string;
  actionKey: 'REVIEW_VARIANCE' | 'SIMULATE_REPLACEMENT' | 'REVIEW_OBLIGATION' | 'REVIEW_DISPATCH';
  resolved?: boolean;
  timestamp: string;
}

export interface ExecutiveState {
  // Operating parameters
  operatingMode: OperatingMode;
  isTabletView: boolean;
  wakeLockActive: boolean;
  dayClosed: boolean;
  depositPrepared: boolean;
  creditLockActive: boolean;
  hardwareReplaced: boolean;
  varianceWaived: boolean;
  varianceDeducted: boolean;

  // Financial State
  bankCash: number;
  vaultCash: number;
  upcomingObligation: number;
  obligationDueHours: number;
  freshCredit: number;
  todaySales: number;

  // Trapped Capital
  trappedCapital: {
    total: number;
    retailerReceivables: number;
    inventory: number;
    unclaimedSchemes: number;
  };

  // Operations
  dispatchTarget: string;
  dispatchActual: string;
  dispatchDelayMinutes: number;
  billingDeskBottleneckDSRs: number;

  // Reconciliation
  reconciliationExpected: number;
  reconciliationCounted: number;
  cashVariance: number;
  reconciliationRoute: string;
  reconciliationDSR: string;

  // Route Performance
  routes: RouteData[];

  // Alerts
  alerts: ExecutiveAlert[];

  // Active Drawers / Modals
  activeDrawer: 'WORKING_CAPITAL' | 'ROUTE_DETAIL' | 'RECONCILIATION' | 'INCIDENT' | 'OBLIGATION' | 'SIMULATION' | null;
  selectedRouteId: string | null;
  activeModal: 'CREDIT_LOCK' | 'BANK_DEPOSIT' | 'DAY_END_CLOSE' | 'EXCEPTIONS' | null;
  toastMessage: string | null;
}
