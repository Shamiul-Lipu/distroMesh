'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ExecutiveState, OperatingMode, RouteData, ExecutiveAlert } from '../types/executive';

const initialRoutes: RouteData[] = [
  {
    id: 'van-1',
    vanNumber: 'Van #1',
    routeName: 'Sherpur Rural',
    depot: 'Sherpur',
    dsrName: 'Tariqul Islam',
    collected: 78000,
    expected: 78000,
    credit: 31000,
    variance: 0,
    status: 'OK',
    retailersVisited: 38,
    totalRetailers: 40,
    completionPct: 95,
    lastCheckin: '17:30',
    notes: 'Smooth collection in Rural beat.',
  },
  {
    id: 'van-2',
    vanNumber: 'Van #2',
    routeName: 'Town Central',
    depot: 'Sherpur',
    dsrName: 'Rafiqul Alam',
    collected: 92000,
    expected: 92000,
    credit: 12000,
    variance: 0,
    status: 'OK',
    retailersVisited: 45,
    totalRetailers: 45,
    completionPct: 100,
    lastCheckin: '17:45',
    notes: 'All key town accounts settled.',
  },
  {
    id: 'van-3',
    vanNumber: 'Van #3',
    routeName: 'Bogura Link',
    depot: 'Bogura',
    dsrName: 'Babul Hossain',
    collected: 84600,
    expected: 85000,
    credit: 38000,
    variance: -400,
    status: 'EXCEPTION',
    retailersVisited: 32,
    totalRetailers: 34,
    completionPct: 94,
    lastCheckin: '18:10',
    notes: 'Cash count mismatch of ৳400 at Bogura road point.',
  },
  {
    id: 'van-4',
    vanNumber: 'Van #4',
    routeName: 'Mirzapur Beat',
    depot: 'Sherpur',
    dsrName: 'Anowar Hossain',
    collected: 65000,
    expected: 65000,
    credit: 28000,
    variance: 0,
    status: 'OK',
    retailersVisited: 28,
    totalRetailers: 30,
    completionPct: 93,
    lastCheckin: '17:15',
    notes: 'Deliveries completed early.',
  },
  {
    id: 'van-5',
    vanNumber: 'Van #5',
    routeName: 'Nalitabari West',
    depot: 'Sherpur',
    dsrName: 'Kabir Mia',
    collected: 58000,
    expected: 58000,
    credit: 41000,
    variance: 0,
    status: 'WARNING',
    retailersVisited: 26,
    totalRetailers: 32,
    completionPct: 81,
    lastCheckin: '17:50',
    notes: 'High credit ratio (45.2%) on new accounts.',
  },
  {
    id: 'van-6',
    vanNumber: 'Van #6',
    routeName: 'Highway Route',
    depot: 'Sherpur',
    dsrName: 'Jahangir Alam',
    collected: 65000,
    expected: 65000,
    credit: 40000,
    variance: 0,
    status: 'WARNING',
    retailersVisited: 29,
    totalRetailers: 35,
    completionPct: 82,
    lastCheckin: '18:00',
    notes: '2 overdue retailers extended credit.',
  },
];

const initialAlerts: ExecutiveAlert[] = [
  {
    id: 'alert-1',
    title: 'Van #3 Cash Variance (-৳400)',
    category: 'CASH',
    severity: 'CRITICAL',
    whatHappened: 'Closing till count is ৳442,600 against expected till cash of ৳443,000 on the Bogura Link route.',
    impact: '৳400 unverified cash variance in evening route settlement.',
    whyItMatters: 'Unreconciled physical cash discrepancies weaken DSR accountability.',
    availableAction: 'Review details, simulate salary deduction, or approve waiver.',
    actionKey: 'REVIEW_VARIANCE',
    resolved: false,
    timestamp: '18:12',
  },
  {
    id: 'alert-2',
    title: 'Billing Desk Printer Hardware Failure',
    category: 'HARDWARE',
    severity: 'WARNING',
    whatHappened: 'Epson LQ-310 matrix printer ribbon jam at Desk #1 stalled morning invoice printing.',
    impact: '60 cartons returned, 24 DSRs delayed by 165 minutes. Estimated revenue risk: ৳2,790.',
    whyItMatters: 'Printer bottleneck directly delayed market dispatch by +2h 45m.',
    availableAction: 'Simulate hardware replacement (৳3,000 cost, 2.8 days estimated payback).',
    actionKey: 'SIMULATE_REPLACEMENT',
    resolved: false,
    timestamp: '09:15',
  },
  {
    id: 'alert-3',
    title: 'Unilever Principal Auto-Debit (48 Hours)',
    category: 'OBLIGATION',
    severity: 'INFO',
    whatHappened: 'Scheduled principal auto-debit of ৳2,070,000 set for direct withdrawal.',
    impact: 'Reduces available liquid cash buffer from ৳2.74M to ৳672.6K.',
    whyItMatters: 'Ensure minimum bank threshold is maintained prior to sweep.',
    availableAction: 'Review bank liquidity bridge and pending market deposits.',
    actionKey: 'REVIEW_OBLIGATION',
    resolved: false,
    timestamp: '08:00',
  },
];

const initialExecutiveState: ExecutiveState = {
  operatingMode: 'LIVE_OPS',
  isTabletView: false,
  wakeLockActive: false,
  dayClosed: false,
  depositPrepared: false,
  creditLockActive: false,
  hardwareReplaced: false,
  varianceWaived: false,
  varianceDeducted: false,

  bankCash: 2300000,
  vaultCash: 442600,
  upcomingObligation: 2070000,
  obligationDueHours: 48,
  freshCredit: 190000,
  todaySales: 480000,

  trappedCapital: {
    total: 23890000,
    retailerReceivables: 9500000,
    inventory: 12500000,
    unclaimedSchemes: 1890000,
  },

  dispatchTarget: '09:00 AM',
  dispatchActual: '11:45 AM',
  dispatchDelayMinutes: 165,
  billingDeskBottleneckDSRs: 24,

  reconciliationExpected: 443000,
  reconciliationCounted: 442600,
  cashVariance: -400,
  reconciliationRoute: 'Van #3 (Bogura Link)',
  reconciliationDSR: 'Babul Hossain',

  routes: initialRoutes,
  alerts: initialAlerts,

  activeDrawer: null,
  selectedRouteId: null,
  activeModal: null,
  toastMessage: null,
};

const addDelayToTime = (time: string, delayMinutes: number) => {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time);
  if (!match) return time;
  const [, hourText, minuteText, meridiem] = match;
  const hour = Number(hourText) % 12 + (meridiem.toUpperCase() === 'PM' ? 12 : 0);
  const totalMinutes = (hour * 60 + Number(minuteText) + delayMinutes + 1440) % 1440;
  const resultHour = Math.floor(totalMinutes / 60);
  const displayHour = resultHour % 12 || 12;
  const resultMeridiem = resultHour < 12 ? 'AM' : 'PM';
  return `${String(displayHour).padStart(2, '0')}:${String(totalMinutes % 60).padStart(2, '0')} ${resultMeridiem}`;
};

const formatBDTForToast = (amount: number) => {
  const sign = amount < 0 ? '-' : '';
  return `${sign}৳${Math.abs(amount).toLocaleString('en-BD')}`;
};

interface ExecutiveContextType {
  state: ExecutiveState;
  setOperatingMode: (mode: OperatingMode) => void;
  setTabletView: (isTablet: boolean) => void;
  toggleWakeLock: () => Promise<void>;
  openDrawer: (drawer: ExecutiveState['activeDrawer'], routeId?: string) => void;
  closeDrawer: () => void;
  openModal: (modal: ExecutiveState['activeModal']) => void;
  closeModal: () => void;

  // Simulation Actions
  updateSimulationValues: (values: Partial<{
    bankCash: number;
    vaultCash: number;
    upcomingObligation: number;
    freshCredit: number;
    cashVariance: number;
    dispatchDelayMinutes: number;
  }>) => void;
  resetSimulation: () => void;

  // Business Action Triggers
  confirmCreditLock: () => void;
  confirmBankDeposit: () => void;
  confirmDayEndClose: () => void;
  waiveVariance: () => void;
  deductVariance: () => void;
  replaceHardware: () => void;
  resolveAlert: (alertId: string) => void;
  showToast: (msg: string) => void;
}

const ExecutiveContext = createContext<ExecutiveContextType | undefined>(undefined);

export const ExecutiveProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ExecutiveState>(initialExecutiveState);

  // Screen Wake Lock Handler
  const toggleWakeLock = async () => {
    if (typeof window !== 'undefined' && 'wakeLock' in navigator) {
      try {
        if (!state.wakeLockActive) {
          await navigator.wakeLock.request('screen');
          setState(prev => ({ ...prev, wakeLockActive: true }));
          showToast('Screen Wake Lock Enabled — Control Room display stay active');
        } else {
          setState(prev => ({ ...prev, wakeLockActive: false }));
          showToast('Screen Wake Lock Disabled');
        }
      } catch (err) {
        console.error('Wake lock error:', err);
        showToast('Wake Lock Request Failed or Unsupported');
      }
    } else {
      showToast('Wake Lock API not supported on this browser (Simulated toggle active)');
      setState(prev => ({ ...prev, wakeLockActive: !prev.wakeLockActive }));
    }
  };

  const showToast = (msg: string) => {
    setState(prev => ({ ...prev, toastMessage: msg }));
    setTimeout(() => {
      setState(prev => ({ ...prev, toastMessage: null }));
    }, 4000);
  };

  const setOperatingMode = (mode: OperatingMode) => {
    setState(prev => ({
      ...prev,
      operatingMode: mode,
      toastMessage: `Operating Mode switched to: ${mode.replace('_', ' ')}`,
    }));
  };

  const setTabletView = (isTablet: boolean) => {
    setState(prev => ({ ...prev, isTabletView: isTablet }));
  };

  const openDrawer = (drawer: ExecutiveState['activeDrawer'], routeId?: string) => {
    setState(prev => ({
      ...prev,
      activeDrawer: drawer,
      selectedRouteId: routeId || prev.selectedRouteId,
    }));
  };

  const closeDrawer = () => {
    setState(prev => ({ ...prev, activeDrawer: null }));
  };

  const openModal = (modal: ExecutiveState['activeModal']) => {
    setState(prev => ({ ...prev, activeModal: modal }));
  };

  const closeModal = () => {
    setState(prev => ({ ...prev, activeModal: null }));
  };

  const updateSimulationValues = (values: Partial<{
    bankCash: number;
    vaultCash: number;
    upcomingObligation: number;
    freshCredit: number;
    cashVariance: number;
    dispatchDelayMinutes: number;
  }>) => {
    setState(prev => {
      const updatedExpected = prev.reconciliationExpected;
      const updatedVariance = values.cashVariance !== undefined ? values.cashVariance : prev.cashVariance;
      const updatedCounted = updatedExpected + updatedVariance;
      const updatedDispatchActual = values.dispatchDelayMinutes !== undefined
        ? addDelayToTime(prev.dispatchTarget, values.dispatchDelayMinutes)
        : prev.dispatchActual;

      // Also update Van #3 variance if cashVariance changes
      const updatedRoutes = prev.routes.map(r => {
        if (r.id === 'van-3') {
          return {
            ...r,
            variance: updatedVariance,
            collected: r.expected + updatedVariance,
            status: updatedVariance !== 0 ? ('EXCEPTION' as const) : ('OK' as const),
          };
        }
        return r;
      });

      return {
        ...prev,
        ...values,
        dispatchActual: updatedDispatchActual,
        varianceDeducted: values.cashVariance !== undefined ? false : prev.varianceDeducted,
        varianceWaived: values.cashVariance !== undefined ? false : prev.varianceWaived,
        reconciliationCounted: updatedCounted,
        cashVariance: updatedVariance,
        routes: updatedRoutes,
        alerts: values.cashVariance !== undefined
          ? prev.alerts.map(alert => alert.id === 'alert-1'
            ? { ...alert, resolved: updatedVariance === 0 }
            : alert)
          : prev.alerts,
      };
    });
  };

  const resetSimulation = () => {
    setState(initialExecutiveState);
    showToast('Simulation state reset to verified defaults');
  };

  const confirmCreditLock = () => {
    setState(prev => ({
      ...prev,
      creditLockActive: true,
      activeModal: null,
      toastMessage: 'SIMULATED • Credit Lock executed for 7 overdue retailers (৳84,000 exposure locked)',
    }));
  };

  const confirmBankDeposit = () => {
    setState(prev => {
      const newBank = prev.bankCash + prev.vaultCash;
      return {
        ...prev,
        depositPrepared: true,
        bankCash: newBank,
        vaultCash: 0,
        activeModal: null,
        toastMessage: `SIMULATED • Deposit of ৳${prev.vaultCash.toLocaleString()} prepared and credited to Bank`,
      };
    });
  };

  const confirmDayEndClose = () => {
    setState(prev => ({
      ...prev,
      dayClosed: true,
      activeModal: null,
      toastMessage: 'SIMULATED • Evening Closeout Approved. Control Room locked into Day-Closed state.',
    }));
  };

  const waiveVariance = () => {
    setState(prev => ({
      ...prev,
      varianceWaived: true,
      cashVariance: 0,
      reconciliationCounted: prev.reconciliationExpected,
      routes: prev.routes.map(r => r.id === 'van-3' ? { ...r, variance: 0, collected: r.expected, status: 'OK' } : r),
      alerts: prev.alerts.map(a => a.id === 'alert-1' ? { ...a, resolved: true } : a),
      toastMessage: `SIMULATED • ${formatBDTForToast(Math.abs(prev.cashVariance))} cash variance waived by CEO approval.`,
    }));
  };

  const deductVariance = () => {
    setState(prev => ({
      ...prev,
      varianceDeducted: true,
      alerts: prev.alerts.map(a => a.id === 'alert-1' ? { ...a, resolved: true, impact: `${formatBDTForToast(Math.abs(prev.cashVariance))} deducted from DSR Babul payroll` } : a),
      toastMessage: `SIMULATED • ${formatBDTForToast(Math.abs(prev.cashVariance))} deduction scheduled against DSR Babul payroll.`,
    }));
  };

  const replaceHardware = () => {
    setState(prev => ({
      ...prev,
      hardwareReplaced: true,
      vaultCash: Math.max(0, prev.vaultCash - 3000),
      alerts: prev.alerts.map(a => a.id === 'alert-2' ? { ...a, resolved: true } : a),
      toastMessage: 'SIMULATED • Replacement Epson printer ribbon/unit ordered (৳3,000 deducted). Desk #1 back online.',
    }));
  };

  const resolveAlert = (alertId: string) => {
    setState(prev => ({
      ...prev,
      alerts: prev.alerts.map(a => a.id === alertId ? { ...a, resolved: true } : a),
      toastMessage: 'Alert marked as reviewed',
    }));
  };

  return (
    <ExecutiveContext.Provider
      value={{
        state,
        setOperatingMode,
        setTabletView,
        toggleWakeLock,
        openDrawer,
        closeDrawer,
        openModal,
        closeModal,
        updateSimulationValues,
        resetSimulation,
        confirmCreditLock,
        confirmBankDeposit,
        confirmDayEndClose,
        waiveVariance,
        deductVariance,
        replaceHardware,
        resolveAlert,
        showToast,
      }}
    >
      {children}
    </ExecutiveContext.Provider>
  );
};

export const useExecutive = () => {
  const context = useContext(ExecutiveContext);
  if (!context) throw new Error('useExecutive must be used within an ExecutiveProvider');
  return context;
};
