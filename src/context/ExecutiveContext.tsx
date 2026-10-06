'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  ExecutiveState,
  OperatingMode,
  RouteData,
  ExecutiveAlert,
  UserRole,
  AuditLogEntry,
  ShortageCase,
  WarRoomTier,
} from '../types/executive.ts';
import { popy12Routes, popyMonthlyParameters, popyTodaySnapshot } from '../data/seedData.ts';
import { deriveRouteStatus } from '../utils/derivedRules.ts';

// Map popy12Routes to RouteData format
const mapInitialRoutes = (): RouteData[] => {
  return popy12Routes.map((r, index) => {
    const statusResult = deriveRouteStatus(r);
    return {
      id: r.id,
      vanNumber: `Van #${index + 1}`,
      routeName: r.name,
      territory: r.territory,
      isOutsideTerritory: r.isOutsideTerritory,
      depot: r.territory.includes('Bogura') ? 'Bogura' : 'Sherpur',
      jsrName: r.jsrName,
      srName: r.srName,
      deliveredSales: r.deliveredSales,
      cashSales: r.cashSales,
      creditSales: r.creditSales,
      oldDuesCollected: r.oldDuesCollected,
      cashExpenses: r.cashExpenses,
      cashHandedIn: r.cashHandedIn,
      expectedTill: r.expectedTill,
      countedTill: r.countedTill,
      collected: r.cashHandedIn,
      expected: r.expectedTill,
      credit: r.creditSales,
      variance: r.variance,
      status: statusResult.status,
      statusReason: statusResult.reason,
      retailersVisited: Math.round(r.dropsCount * 0.95),
      totalRetailers: r.dropsCount,
      completionPct: 95,
      lastCheckin: '17:45',
      notes: r.notes,
      invoicesCount: r.invoicesCount,
      unitsDelivered: r.unitsDelivered,
    };
  });
};

const initialAlerts: ExecutiveAlert[] = [
  {
    id: 'alert-1',
    title: 'Van #3 Till Shortage (−৳400)',
    category: 'CASH',
    severity: 'WARNING',
    whatHappened: 'JSR Babul Hossain reported partial cash settlement during peak rush-hour delivery on Bogura Link Road.',
    impact: 'Shortage of −৳400 against expected route collection of ৳74,600.',
    whyItMatters: 'Cash discrepancy must be formally investigated through the Shortage Case workflow before day-end closeout.',
    availableAction: 'Open Shortage Case',
    actionKey: 'OPEN_SHORTAGE_CASE',
    takaAtRisk: 400,
    timestamp: '18:15',
  },
  {
    id: 'alert-2',
    title: 'Dispatch Delay: 165 Minutes Late (Epson LQ-310 Ribbon Failure)',
    category: 'EXECUTION',
    severity: 'CRITICAL',
    whatHappened: 'Faint ribbon and gear misalignment on billing desk #1 delayed invoice trip prints until 11:45 AM (target 09:00 AM).',
    impact: '12 vans stalled in depot yard; 1,980 van-minutes lost; ≈৳4,950 idle crew cost incurred.',
    whyItMatters: 'Late departures compress retailer drop windows, reducing on-time delivery from 94% down to 38%.',
    availableAction: 'Simulate Dot-Matrix Replacement',
    actionKey: 'SIMULATE_REPLACEMENT',
    takaAtRisk: 4950,
    timestamp: '11:45',
  },
  {
    id: 'alert-3',
    title: 'Principal Auto-Debit Scheduled: ৳54,00,000 Due in 48h',
    category: 'OBLIGATION',
    severity: 'INFO',
    whatHappened: 'Monthly primary FMCG invoice settlement auto-debit scheduled against principal bank account.',
    impact: 'Bank balance post-debit drops to ৳8,00,000. Vault cash (৳8,95,200) must be deposited to maintain liquidity buffer.',
    whyItMatters: 'Post-debit 7-day obligation cover is 2.17× combined, but 1.02× bank-only.',
    availableAction: 'Prepare Bank Deposit',
    actionKey: 'REVIEW_OBLIGATION',
    takaAtRisk: 5400000,
    timestamp: '08:00',
  },
];

const initialAuditLog: AuditLogEntry[] = [
  {
    id: 'audit-1',
    timestamp: '09:15',
    action: 'DISPATCH_DELAY_LOGGED',
    performedBy: 'Manager',
    reason: 'Billing printer gear misalignment halted trip invoice batch generation.',
    reversible: false,
  },
];

const initialShortageCases: ShortageCase[] = [
  {
    id: 'case-van-3-01',
    routeId: 'van-3',
    jsrName: 'Babul Hossain',
    amount: 400,
    notes: 'Shortage occurred during rush-hour collection at Bogura Link road point when shopkeeper made partial payment with ৳500 note.',
    assignedRole: 'Cashier',
    resolution: 'PENDING',
    createdAt: 'Today, 18:15',
  },
];

export const initialExecutiveState: ExecutiveState = {
  currentRole: 'Owner',
  operatingMode: 'LIVE_OPS',
  warRoomTier: 'desktop',
  isTabletView: false,
  wakeLockActive: false,
  banglaMode: false,
  dayClosed: false,
  depositPrepared: false,
  creditLockActive: false,
  hardwareReplaced: false,
  varianceWaived: false,
  varianceDeducted: false,
  depositInTransit: popyTodaySnapshot.plannedDepositTonight, // ৳8,00,000 deposit in transit

  // Financials
  bankCash: popyTodaySnapshot.bankAfterDebit, // ৳8,00,000 post-debit
  vaultCash: popyTodaySnapshot.vaultCash, // ৳8,95,200
  upcomingObligation: popyTodaySnapshot.upcomingAutoDebit, // ৳54,00,000
  obligationDueHours: popyTodaySnapshot.dueHours,
  freshCredit: popyTodaySnapshot.creditSales, // ৳3,80,000
  todaySales: popyTodaySnapshot.deliveredSales, // ৳9,60,000
  cashVariance: popyTodaySnapshot.variance, // -৳400

  // Working Capital headline & components (Defect A6)
  workingCapital: {
    receivables: popyMonthlyParameters.receivables,
    inventory: popyMonthlyParameters.inventory,
    schemeClaimsPending: popyMonthlyParameters.schemeClaimsPending,
    damageClaimsPending: popyMonthlyParameters.damageClaimsPending,
    payables: popyMonthlyParameters.payables,
    netOperatingWorkingCapital:
      popyMonthlyParameters.receivables +
      popyMonthlyParameters.inventory +
      popyMonthlyParameters.schemeClaimsPending +
      popyMonthlyParameters.damageClaimsPending -
      popyMonthlyParameters.payables,
  },

  // Operations
  dispatchTarget: popyTodaySnapshot.dispatchTarget,
  dispatchActual: popyTodaySnapshot.dispatchActual,
  dispatchDelayMinutes: popyTodaySnapshot.dispatchDelayMinutes,
  billingDeskBottleneckSRs: 24,

  // Reconciliation
  reconciliationExpected: popyTodaySnapshot.expectedTill,
  reconciliationCounted: popyTodaySnapshot.countedTill,
  reconciliationRoute: 'Van #3 - Bogura Link Road',
  reconciliationJSR: 'Babul Hossain',

  routes: mapInitialRoutes(),
  alerts: initialAlerts,
  auditLog: initialAuditLog,
  shortageCases: initialShortageCases,

  activeDrawer: null,
  selectedRouteId: null,
  activeModal: null,
  toastMessage: null,
};

interface ExecutiveContextType {
  state: ExecutiveState;
  setOperatingMode: (mode: OperatingMode) => void;
  setUserRole: (role: UserRole) => void;
  setWarRoomTier: (tier: WarRoomTier) => void;
  setTabletView: (isTablet: boolean) => void;
  toggleWakeLock: () => Promise<void>;
  toggleBanglaMode: () => void;
  openDrawer: (drawer: ExecutiveState['activeDrawer'], routeId?: string) => void;
  closeDrawer: () => void;
  openModal: (modal: ExecutiveState['activeModal']) => void;
  closeModal: () => void;
  updateSimulationValues: (values: Partial<{
    bankCash: number;
    vaultCash: number;
    upcomingObligation: number;
    freshCredit: number;
    cashVariance: number;
    dispatchDelayMinutes: number;
  }>) => void;
  resetSimulation: () => void;
  confirmCreditLock: (reason?: string) => void;
  confirmBankDeposit: (reason?: string) => void;
  confirmDayEndClose: (reason?: string) => void;
  handleOpenShortageCase: (caseData: {
    routeId: string;
    jsrName: string;
    amount: number;
    notes: string;
    action: 'WAIVE' | 'RECOVER' | 'ESCALATE';
  }) => void;
  waiveVariance: () => void;
  deductVariance: () => void;
  replaceHardware: () => void;
  resolveAlert: (alertId: string) => void;
  undoAuditAction: (auditId: string) => void;
  showToast: (msg: string) => void;
  clearToast: () => void;
}

const ExecutiveContext = createContext<ExecutiveContextType | undefined>(undefined);

export const ExecutiveProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ExecutiveState>(initialExecutiveState);

  const showToast = useCallback((msg: string) => {
    setState((prev) => ({ ...prev, toastMessage: msg }));
  }, []);

  const clearToast = useCallback(() => {
    setState((prev) => ({ ...prev, toastMessage: null }));
  }, []);

  useEffect(() => {
    if (state.toastMessage) {
      const timer = setTimeout(() => {
        clearToast();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [state.toastMessage, clearToast]);

  const setOperatingMode = (mode: OperatingMode) => {
    setState((prev) => ({ ...prev, operatingMode: mode }));
  };

  const setUserRole = (role: UserRole) => {
    setState((prev) => ({ ...prev, currentRole: role }));
    showToast(`Active role changed to ${role}`);
  };

  const setWarRoomTier = (tier: WarRoomTier) => {
    setState((prev) => ({ ...prev, warRoomTier: tier }));
  };

  const setTabletView = (isTablet: boolean) => {
    setState((prev) => ({ ...prev, isTabletView: isTablet }));
  };

  const toggleBanglaMode = () => {
    setState((prev) => ({ ...prev, banglaMode: !prev.banglaMode }));
  };

  // Screen Wake Lock API implementation with fallback & visibilitychange handling (Defect D5)
  const toggleWakeLock = async () => {
    if (typeof window === 'undefined') return;

    if (!('wakeLock' in navigator)) {
      setState((prev) => ({
        ...prev,
        wakeLockActive: !prev.wakeLockActive,
      }));
      showToast('Wake Lock API not supported in this browser; simulated display keep-alive enabled');
      return;
    }

    try {
      if (!state.wakeLockActive) {
        const sentinel = await (navigator as unknown as { wakeLock: { request: (type: string) => Promise<unknown> } }).wakeLock.request('screen');
        setState((prev) => ({ ...prev, wakeLockActive: true }));
        showToast('Screen Wake Lock acquired — display will stay active');

        const onVisibility = async () => {
          if (document.visibilityState === 'visible' && state.wakeLockActive) {
            try {
              await (navigator as unknown as { wakeLock: { request: (type: string) => Promise<unknown> } }).wakeLock.request('screen');
            } catch {
              // Ignore re-acquire error
            }
          }
        };
        document.addEventListener('visibilitychange', onVisibility, { once: true });
        void sentinel;
      } else {
        setState((prev) => ({ ...prev, wakeLockActive: false }));
        showToast('Screen Wake Lock released');
      }
    } catch {
      setState((prev) => ({ ...prev, wakeLockActive: !prev.wakeLockActive }));
      showToast('Wake Lock permission toggled in simulated mode');
    }
  };

  const openDrawer = (drawer: ExecutiveState['activeDrawer'], routeId?: string) => {
    setState((prev) => ({
      ...prev,
      activeDrawer: drawer,
      selectedRouteId: routeId || null,
    }));
  };

  const closeDrawer = () => {
    setState((prev) => ({ ...prev, activeDrawer: null, selectedRouteId: null }));
  };

  const openModal = (modal: ExecutiveState['activeModal']) => {
    setState((prev) => ({ ...prev, activeModal: modal }));
  };

  const closeModal = () => {
    setState((prev) => ({ ...prev, activeModal: null }));
  };

  const addAuditEntry = (action: string, reason: string, details?: string, reversible = false) => {
    const entry: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      action,
      performedBy: state.currentRole,
      reason: reason || 'Action authorized by supervisor.',
      details,
      reversible,
    };
    setState((prev) => ({
      ...prev,
      auditLog: [entry, ...prev.auditLog],
    }));
  };

  const updateSimulationValues = (values: Partial<{
    bankCash: number;
    vaultCash: number;
    upcomingObligation: number;
    freshCredit: number;
    cashVariance: number;
    dispatchDelayMinutes: number;
  }>) => {
    setState((prev) => {
      const updatedVariance = values.cashVariance !== undefined ? values.cashVariance : prev.cashVariance;
      const updatedExpected = prev.reconciliationExpected;
      const updatedCounted = updatedExpected + updatedVariance;

      const updatedRoutes = prev.routes.map((r) => {
        if (r.id === 'van-3') {
          return {
            ...r,
            variance: updatedVariance,
            countedTill: r.expectedTill + updatedVariance,
            status: updatedVariance !== 0 ? ('REVIEW' as const) : ('OK' as const),
          };
        }
        return r;
      });

      return {
        ...prev,
        ...values,
        reconciliationCounted: updatedCounted,
        cashVariance: updatedVariance,
        routes: updatedRoutes,
        alerts: values.cashVariance !== undefined
          ? prev.alerts.map((alert) => alert.id === 'alert-1'
            ? { ...alert, resolved: updatedVariance === 0 }
            : alert)
          : prev.alerts,
      };
    });
  };

  const resetSimulation = () => {
    setState(initialExecutiveState);
    showToast('Simulation state reset to reconciled defaults');
  };

  // Defect E2: Credit Lock confirmation with reason & audit log
  const confirmCreditLock = (reason = 'Overdue limit enforcement across Van #2, #3, #4') => {
    setState((prev) => ({
      ...prev,
      creditLockActive: true,
      activeModal: null,
    }));
    addAuditEntry('CREDIT_LOCK_ENFORCED', reason, '7 retailers supply suspended', true);
    showToast('Credit lock enacted; audit log recorded');
  };

  // Defect E2: Bank Deposit confirmation with reason & audit log
  const confirmBankDeposit = (reason = 'Daily till deposit for upcoming supplier debit') => {
    setState((prev) => {
      const depositAmount = prev.depositInTransit;
      return {
        ...prev,
        depositPrepared: true,
        bankCash: prev.bankCash + depositAmount,
        vaultCash: Math.max(0, prev.vaultCash - depositAmount),
        depositInTransit: 0,
        activeModal: null,
      };
    });
    addAuditEntry('BANK_DEPOSIT_TRANSFERRED', reason, '৳8,00,000 moved from vault to bank buffer');
    showToast('৳8,00,000 vault deposit posted to bank account');
  };

  // Defect E2: Day-End Closeout blocked if unresolved exceptions exist unless reason provided
  const confirmDayEndClose = (reason = 'Supervised reconciliation complete') => {
    const hasUnresolved = state.alerts.some((a) => !a.resolved && a.severity === 'CRITICAL');
    if (hasUnresolved && !reason) {
      showToast('Cannot close day while unresolved critical exceptions exist without supervisor reason.');
      return;
    }

    setState((prev) => ({
      ...prev,
      dayClosed: true,
      activeModal: null,
    }));
    addAuditEntry('DAY_END_CLOSEOUT', reason, 'Books closed for today');
    showToast('Day-End closeout verified and finalized');
  };

  // Defect E1: Open Shortage Case workflow
  const handleOpenShortageCase = (caseData: {
    routeId: string;
    jsrName: string;
    amount: number;
    notes: string;
    action: 'WAIVE' | 'RECOVER' | 'ESCALATE';
  }) => {
    const newCase: ShortageCase = {
      id: `case-${Date.now()}`,
      routeId: caseData.routeId,
      jsrName: caseData.jsrName,
      amount: caseData.amount,
      notes: caseData.notes,
      assignedRole: state.currentRole,
      resolution: caseData.action === 'WAIVE' ? 'WAIVED' : caseData.action === 'RECOVER' ? 'RECOVERED' : 'ESCALATED',
      createdAt: 'Just now',
    };

    setState((prev) => ({
      ...prev,
      shortageCases: [newCase, ...prev.shortageCases],
      varianceWaived: caseData.action === 'WAIVE' ? true : prev.varianceWaived,
      varianceDeducted: caseData.action === 'RECOVER' ? true : prev.varianceDeducted,
      activeModal: null,
      alerts: prev.alerts.map((a) => a.id === 'alert-1' ? { ...a, resolved: true } : a),
    }));

    addAuditEntry(
      `SHORTAGE_CASE_${caseData.action}`,
      caseData.notes,
      `JSR: ${caseData.jsrName}, Amount: ৳${caseData.amount}`,
      true
    );
    showToast(`Shortage Case recorded: ${caseData.action}`);
  };

  const waiveVariance = () => {
    setState((prev) => ({
      ...prev,
      varianceWaived: true,
      alerts: prev.alerts.map((a) => a.id === 'alert-1' ? { ...a, resolved: true } : a),
    }));
    addAuditEntry('VARIANCE_WAIVER_APPROVED', 'Approved by supervisor for rush-hour partial note mismatch', undefined, true);
    showToast('Variance waiver approved; audit trail updated');
  };

  const deductVariance = () => {
    setState((prev) => ({
      ...prev,
      varianceDeducted: true,
      alerts: prev.alerts.map((a) => a.id === 'alert-1' ? { ...a, resolved: true } : a),
    }));
    addAuditEntry('VARIANCE_RECOVERY_SCHEDULED', 'Scheduled for recovery subject to employment agreement notice', undefined, true);
    showToast('Shortage recovery logged; audit trail updated');
  };

  const replaceHardware = () => {
    setState((prev) => ({
      ...prev,
      hardwareReplaced: true,
      dispatchDelayMinutes: 0,
      alerts: prev.alerts.map((a) => a.id === 'alert-2' ? { ...a, resolved: true } : a),
    }));
    addAuditEntry('HARDWARE_REPLACEMENT_SIMULATED', 'Replaced Epson LQ-310 ribbon gear assembly (Payback 2.8 days)');
    showToast('Printer replacement applied; delay reset to 0 min');
  };

  const resolveAlert = (alertId: string) => {
    setState((prev) => ({
      ...prev,
      alerts: prev.alerts.map((a) => a.id === alertId ? { ...a, resolved: true } : a),
    }));
    addAuditEntry('ALERT_RESOLVED', `Alert ID: ${alertId}`);
  };

  const undoAuditAction = (auditId: string) => {
    const entry = state.auditLog.find((a) => a.id === auditId);
    if (!entry || !entry.reversible) {
      showToast('This action cannot be undone.');
      return;
    }

    if (entry.action === 'CREDIT_LOCK_ENFORCED') {
      setState((prev) => ({ ...prev, creditLockActive: false }));
    } else if (entry.action === 'VARIANCE_WAIVER_APPROVED') {
      setState((prev) => ({ ...prev, varianceWaived: false }));
    } else if (entry.action === 'VARIANCE_RECOVERY_SCHEDULED') {
      setState((prev) => ({ ...prev, varianceDeducted: false }));
    }

    setState((prev) => ({
      ...prev,
      auditLog: prev.auditLog.filter((a) => a.id !== auditId),
    }));
    showToast(`Undid action: ${entry.action}`);
  };

  return (
    <ExecutiveContext.Provider
      value={{
        state,
        setOperatingMode,
        setUserRole,
        setWarRoomTier,
        setTabletView,
        toggleWakeLock,
        toggleBanglaMode,
        openDrawer,
        closeDrawer,
        openModal,
        closeModal,
        updateSimulationValues,
        resetSimulation,
        confirmCreditLock,
        confirmBankDeposit,
        confirmDayEndClose,
        handleOpenShortageCase,
        waiveVariance,
        deductVariance,
        replaceHardware,
        resolveAlert,
        undoAuditAction,
        showToast,
        clearToast,
      }}
    >
      {children}
    </ExecutiveContext.Provider>
  );
};

export const useExecutive = () => {
  const context = useContext(ExecutiveContext);
  if (!context) {
    throw new Error('useExecutive must be used within an ExecutiveProvider');
  }
  return context;
};
