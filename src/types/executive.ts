// Unified Types for distroMesh Executive Dashboard & War Room
// Strict adherence to terminology: SR (order booker), JSR (delivery man). No 'DSR'.

export type UserRole = 'Owner' | 'Manager' | 'Cashier' | 'Viewer';

export type OperatingMode = 'MORNING' | 'LIVE_OPS' | 'EVENING_RECON' | 'CRITICAL_RISK';

export type LiquidityStatus = 'SAFE' | 'WATCH' | 'CRITICAL';

export type RouteStatus = 'OK' | 'REVIEW' | 'ACTION';

export type WarRoomTier = 'wall' | 'ipad' | 'desktop';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  performedBy: UserRole;
  reason: string;
  details?: string;
  reversible?: boolean;
}

export interface ShortageCase {
  id: string;
  routeId: string;
  jsrName: string;
  amount: number;
  notes: string;
  assignedRole: UserRole;
  resolution: 'PENDING' | 'WAIVED' | 'RECOVERED' | 'ESCALATED';
  createdAt: string;
}

export interface RouteData {
  id: string;
  vanNumber: string;
  routeName: string;
  territory: string;
  isOutsideTerritory?: boolean;
  depot: 'Sherpur' | 'Bogura';
  jsrName: string; // Delivery man
  srName: string; // Sales rep
  deliveredSales: number;
  cashSales: number;
  creditSales: number;
  oldDuesCollected: number;
  cashExpenses: number;
  cashHandedIn: number;
  expectedTill: number;
  countedTill: number;
  collected: number;
  expected: number;
  credit: number;
  variance: number;
  status: RouteStatus;
  statusReason?: string;
  retailersVisited: number;
  totalRetailers: number;
  completionPct: number;
  lastCheckin: string;
  notes?: string;
  invoicesCount: number;
  unitsDelivered: number;
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
  actionKey: 'REVIEW_VARIANCE' | 'SIMULATE_REPLACEMENT' | 'REVIEW_OBLIGATION' | 'REVIEW_DISPATCH' | 'OPEN_SHORTAGE_CASE';
  resolved?: boolean;
  timestamp: string;
  takaAtRisk?: number;
}

export interface ExecutiveState {
  // Operating parameters & role
  currentRole: UserRole;
  operatingMode: OperatingMode;
  warRoomTier: WarRoomTier;
  isTabletView: boolean;
  wakeLockActive: boolean;
  banglaMode: boolean;
  dayClosed: boolean;
  depositPrepared: boolean;
  creditLockActive: boolean;
  hardwareReplaced: boolean;
  varianceWaived: boolean;
  varianceDeducted: boolean;
  depositInTransit: number; // Defect A1

  // Financial State
  bankCash: number;
  vaultCash: number;
  upcomingObligation: number;
  obligationDueHours: number;
  freshCredit: number;
  todaySales: number;
  cashVariance: number;

  // Working Capital headline & components (Defect A6)
  workingCapital: {
    receivables: number;
    inventory: number;
    schemeClaimsPending: number;
    damageClaimsPending: number;
    payables: number;
    netOperatingWorkingCapital: number;
  };

  // Operations
  dispatchTarget: string;
  dispatchActual: string;
  dispatchDelayMinutes: number;
  billingDeskBottleneckSRs: number;

  // Reconciliation
  reconciliationExpected: number;
  reconciliationCounted: number;
  reconciliationRoute: string;
  reconciliationJSR: string;

  // Route Performance
  routes: RouteData[];

  // Alerts & Governance
  alerts: ExecutiveAlert[];
  auditLog: AuditLogEntry[];
  shortageCases: ShortageCase[];

  // Active Drawers / Modals
  activeDrawer: 'WORKING_CAPITAL' | 'ROUTE_DETAIL' | 'RECONCILIATION' | 'INCIDENT' | 'OBLIGATION' | 'SIMULATION' | null;
  selectedRouteId: string | null;
  activeModal: 'CREDIT_LOCK' | 'BANK_DEPOSIT' | 'DAY_END_CLOSE' | 'EXCEPTIONS' | 'SHORTAGE_CASE' | null;
  toastMessage: string | null;
}
