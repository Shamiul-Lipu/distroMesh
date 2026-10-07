// Pure Derived Rules and KPI Calculation Functions
// All logic implements Section 6 and Section F of distroMesh specification.

import { popyMonthlyParameters, popyTodaySnapshot } from "../data/seedData.ts";
import type { RouteRecord } from "../data/seedData.ts";

// -----------------------------------------------------------------------
// 6.1 Liquidity Status & Liquidity Bridge
// -----------------------------------------------------------------------
export interface LiquidityInputs {
  bankAfterDebit: number;
  vaultCash: number;
  next7DayObligations: number;
  expectedCollections7Days?: number;
  plannedDepositTonight?: number;
}

export interface LiquidityResult {
  coverage: number; // (bankAfterDebit + vaultCash) / obligations
  bankOnlyCoverage: number; // bankAfterDebit / obligations
  status: "SAFE" | "WATCH" | "CRITICAL";
  statusReason: string;
  shortfall: number;
  dailyOverdraftInterest: number; // shortfall * 12% / 365
  liquidityBridge: {
    bankStarting: number;
    vaultStarting: number;
    expectedCollections: number;
    upcomingDebit: number;
    sevenDayObligations: number;
    netProjectedRemaining: number;
  };
}

export function deriveLiquidityStatus(inputs: LiquidityInputs): LiquidityResult;
export function deriveLiquidityStatus(
  bankCash: number,
  vaultCash: number,
  upcomingObligation: number,
): LiquidityResult;
export function deriveLiquidityStatus(
  inputsOrBank: LiquidityInputs | number,
  maybeVaultCash?: number,
  maybeObligations?: number,
): LiquidityResult {
  let bankAfterDebit: number;
  let vaultCashVal: number;
  let next7DayObligations: number;
  let expectedCollections7Days: number | undefined;

  if (typeof inputsOrBank === "object" && inputsOrBank !== null) {
    bankAfterDebit = inputsOrBank.bankAfterDebit;
    vaultCashVal = inputsOrBank.vaultCash;
    next7DayObligations = inputsOrBank.next7DayObligations;
    expectedCollections7Days = inputsOrBank.expectedCollections7Days;
  } else {
    bankAfterDebit = inputsOrBank;
    vaultCashVal = maybeVaultCash ?? 0;
    next7DayObligations = maybeObligations ?? 0;
  }

  const liquidCash = bankAfterDebit + vaultCashVal;
  const coverage =
    next7DayObligations > 0 ? liquidCash / next7DayObligations : 999;
  const bankOnlyCoverage =
    next7DayObligations > 0 ? bankAfterDebit / next7DayObligations : 999;

  let status: "SAFE" | "WATCH" | "CRITICAL" = "SAFE";
  let statusReason =
    "Liquid reserves exceed 1.5× 7-day obligations with healthy bank cover.";
  let shortfall = 0;

  if (coverage < 1.0 || bankAfterDebit < 0) {
    status = "CRITICAL";
    shortfall =
      Math.max(0, next7DayObligations - liquidCash) +
      Math.max(0, -bankAfterDebit);
    statusReason =
      bankAfterDebit < 0
        ? `Bank account drawn below ৳0 (Overdraft requirement: ৳${Math.abs(bankAfterDebit).toLocaleString("en-IN")}).`
        : `Total liquid coverage (${coverage.toFixed(2)}×) is under the 1.0× critical threshold.`;
  } else if (coverage < 1.5 || bankOnlyCoverage < 1.0) {
    status = "WATCH";
    if (bankOnlyCoverage < 1.0) {
      statusReason = `Bank-only cover (${bankOnlyCoverage.toFixed(2)}× < 1.0×) is low. Vault cash deposit required to protect auto-debit buffer.`;
    } else {
      statusReason = `Combined coverage (${coverage.toFixed(2)}×) is below the 1.5× safe buffer target.`;
    }
  }

  // 12% overdraft interest on shortfall
  const dailyOverdraftInterest =
    shortfall > 0 ? Math.round((shortfall * 0.12) / 365) : 0;

  const expectedCollections =
    expectedCollections7Days ?? popyTodaySnapshot.deliveredSales * 7;
  const netProjectedRemaining =
    popyTodaySnapshot.bankBeforeDebit +
    vaultCashVal +
    expectedCollections -
    popyTodaySnapshot.upcomingAutoDebit -
    next7DayObligations;

  return {
    coverage: Number(coverage.toFixed(2)),
    bankOnlyCoverage: Number(bankOnlyCoverage.toFixed(2)),
    status,
    statusReason,
    shortfall,
    dailyOverdraftInterest,
    liquidityBridge: {
      bankStarting: popyTodaySnapshot.bankBeforeDebit,
      vaultStarting: vaultCashVal,
      expectedCollections,
      upcomingDebit: popyTodaySnapshot.upcomingAutoDebit,
      sevenDayObligations: next7DayObligations,
      netProjectedRemaining,
    },
  };
}

// -----------------------------------------------------------------------
// 6.2 Dispatch Metrics
// -----------------------------------------------------------------------
export interface DispatchInputs {
  targetTime: string; // e.g. "09:00"
  actualTime: string; // e.g. "11:45"
  delayMinutes?: number; // Override if direct
  vansDispatched: number;
  crewDailyWage: number;
}

export interface DispatchResult {
  delayMinutes: number;
  vanMinutesLost: number;
  idleCrewCost: number;
  status: "ON_TIME" | "LATE" | "FAILED";
  statusLabel: string;
}

export function parseMinutesFromTime(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function deriveDispatchMetrics(inputsOrDelay: DispatchInputs | number): DispatchResult {
  let delay: number;
  let vansDispatched = 12;
  let crewDailyWage = 1200;

  if (typeof inputsOrDelay === "object" && inputsOrDelay !== null) {
    delay =
      inputsOrDelay.delayMinutes !== undefined
        ? inputsOrDelay.delayMinutes
        : parseMinutesFromTime(inputsOrDelay.actualTime) -
          parseMinutesFromTime(inputsOrDelay.targetTime);
    vansDispatched = inputsOrDelay.vansDispatched;
    crewDailyWage = inputsOrDelay.crewDailyWage;
  } else {
    delay = typeof inputsOrDelay === "number" ? inputsOrDelay : 165;
  }

  const vanMinutesLost = Math.max(0, delay * vansDispatched);
  // Crew daily wage ৳1,200 / 480 work minutes = ৳2.50 per minute
  const wagePerMinute = crewDailyWage / 480;
  const idleCrewCost = Math.round(vanMinutesLost * wagePerMinute);

  let status: "ON_TIME" | "LATE" | "FAILED" = "ON_TIME";
  let statusLabel = "On time";

  if (delay > 120) {
    status = "FAILED";
    statusLabel = "Dispatch failed";
  } else if (delay > 15) {
    status = "LATE";
    statusLabel = "Late dispatch";
  }

  return {
    delayMinutes: delay,
    vanMinutesLost,
    idleCrewCost,
    status,
    statusLabel,
  };
}

// -----------------------------------------------------------------------
// 6.3 Route Status
// -----------------------------------------------------------------------
export interface RouteStatusResult {
  status: "ACTION" | "REVIEW" | "OK";
  reason: string;
  creditSharePercent: number;
}

export function deriveRouteStatus(
  route: RouteRecord,
  hasOverdueRetailerOverLimit = false,
): RouteStatusResult {
  const creditShare =
    route.deliveredSales > 0 ? route.creditSales / route.deliveredSales : 0;
  const creditSharePercent = Number((creditShare * 100).toFixed(1));

  if (Math.abs(route.variance) > 2000) {
    return {
      status: "ACTION",
      reason: `Cash variance ৳${Math.abs(route.variance).toLocaleString("en-IN")} exceeds ৳2,000 threshold.`,
      creditSharePercent,
    };
  }
  if (creditShare >= 0.6) {
    return {
      status: "ACTION",
      reason: `Credit share ${creditSharePercent}% reaches 60% high-risk exposure limit.`,
      creditSharePercent,
    };
  }
  if (route.variance !== 0) {
    return {
      status: "REVIEW",
      reason: `Cash variance ${route.variance < 0 ? "−৳" : "+৳"}${Math.abs(route.variance)} requires reconciliation.`,
      creditSharePercent,
    };
  }
  if (creditShare >= 0.45) {
    return {
      status: "REVIEW",
      reason: `Credit share ${creditSharePercent}% ≥ 45% beat caution limit.`,
      creditSharePercent,
    };
  }
  if (hasOverdueRetailerOverLimit) {
    return {
      status: "REVIEW",
      reason: "Contains retailer with past-due dues exceeding credit limit.",
      creditSharePercent,
    };
  }
  if (route.isOutsideTerritory) {
    return {
      status: "REVIEW",
      reason:
        "Route territory flagged outside standard Sherpur Upazila boundary.",
      creditSharePercent,
    };
  }

  return {
    status: "OK",
    reason: "Settlement balanced; credit within approved ratio.",
    creditSharePercent,
  };
}

// -----------------------------------------------------------------------
// 6.4 Today's Focus Ranking (Score = taka_at_risk * urgency_weight)
// -----------------------------------------------------------------------
export interface OperationalIssue {
  id: string;
  title: string;
  description: string;
  takaAtRisk: number;
  urgency: "due_48h" | "today" | "later";
  section: string;
  score?: number;
}

export function deriveTodayFocus(
  issues: OperationalIssue[],
): OperationalIssue[] {
  const urgencyWeights: Record<OperationalIssue["urgency"], number> = {
    due_48h: 3,
    today: 2,
    later: 1,
  };

  return issues
    .map((issue) => ({
      ...issue,
      score: issue.takaAtRisk * (urgencyWeights[issue.urgency] ?? 1),
    }))
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}

// -----------------------------------------------------------------------
// 6.5 Clock-Driven Operating Modes in Asia/Dhaka
// -----------------------------------------------------------------------
export type OperatingPhase =
  | "DISPATCH"
  | "DELIVERY"
  | "RECONCILIATION"
  | "OFF_HOURS";

export interface OperatingModeInfo {
  phase: OperatingPhase;
  phaseLabel: string;
  timeWindow: string;
  description: string;
  isCriticalOverlay: boolean;
}

export function deriveOperatingMode(
  currentDate = new Date(),
  isCritical = false,
): OperatingModeInfo {
  // Convert current time to Asia/Dhaka (UTC+6)
  const utc = currentDate.getTime() + currentDate.getTimezoneOffset() * 60000;
  const dhakaTime = new Date(utc + 3600000 * 6);
  const hour = dhakaTime.getHours();

  let phase: OperatingPhase = "OFF_HOURS";
  let phaseLabel = "Night / Off-Hours";
  let timeWindow = "22:00 – 07:00";
  let description = "Day closed. Night batch settling.";

  if (hour >= 7 && hour < 12) {
    phase = "DISPATCH";
    phaseLabel = "Morning Dispatch";
    timeWindow = "07:00 – 12:00";
    description =
      "Order invoice generation, warehouse picking, and van gate release.";
  } else if (hour >= 12 && hour < 19) {
    phase = "DELIVERY";
    phaseLabel = "Market Delivery & Realisation";
    timeWindow = "12:00 – 19:00";
    description =
      "Active retail drops, cash collection, and market stock monitoring.";
  } else if (hour >= 19 && hour < 22) {
    phase = "RECONCILIATION";
    phaseLabel = "Till & Route Reconciliation";
    timeWindow = "19:00 – 22:00";
    description =
      "Van return settlement, cash tallying, and shortage case reviews.";
  }

  return {
    phase,
    phaseLabel: isCritical ? `${phaseLabel} · CRITICAL OVERLAY` : phaseLabel,
    timeWindow,
    description,
    isCriticalOverlay: isCritical,
  };
}

// -----------------------------------------------------------------------
// 6.6 Mispick Loss & Dot-Matrix Payback
// -----------------------------------------------------------------------
export interface MispickLossResult {
  landedCost: number;
  liquidationDiscount: number;
  grossMarginPerUnit: number;
  lossPerUnit: number;
  todayIncidentUnits: number;
  todayIncidentCartons: number;
  todayLossBDT: number;
  avgDailyLossUnits: number;
  avgDailyLossBDT: number;
  printerCost: number;
  paybackDays: number;
  formula: string;
}

export function deriveMispickLoss(customUnits?: number): MispickLossResult {
  const { landedCostPerUnit, grossMarginPerUnit } = popyMonthlyParameters;
  const {
    todayIncidentUnits: defaultUnits,
    todayIncidentCartons,
    avgDailyMispickUnits,
    liquidationDiscount,
    replacementPrinterCost,
  } = popyTodaySnapshot;

  const todayIncidentUnits = customUnits !== undefined ? customUnits : defaultUnits;

  // lossPerUnit = landedCost * discount + grossMargin = 112.20 * 0.30 + 7.80 = ৳41.46
  const lossPerUnit =
    landedCostPerUnit * liquidationDiscount + grossMarginPerUnit;
  const todayLossBDT = Math.round(todayIncidentUnits * lossPerUnit);
  const avgDailyLossBDT = Math.round(avgDailyMispickUnits * lossPerUnit);
  const paybackDays = Number(
    (replacementPrinterCost / avgDailyLossBDT).toFixed(1),
  );

  return {
    landedCost: landedCostPerUnit,
    liquidationDiscount,
    grossMarginPerUnit,
    lossPerUnit: Number(lossPerUnit.toFixed(2)),
    todayIncidentUnits,
    todayIncidentCartons,
    todayLossBDT,
    avgDailyLossUnits: avgDailyMispickUnits,
    avgDailyLossBDT,
    printerCost: replacementPrinterCost,
    paybackDays,
    formula: `Payback (${paybackDays} days) = ৳${replacementPrinterCost.toLocaleString("en-IN")} printer replacement cost ÷ ৳${avgDailyLossBDT.toLocaleString("en-IN")}/day average avoided mispick loss`,
  };
}

// -----------------------------------------------------------------------
// 6.7 Receivables Ageing & Provisions
// -----------------------------------------------------------------------
export interface ReceivablesAgeingResult {
  totalReceivables: number;
  buckets: {
    range: string;
    percent: number;
    amount: number;
    provisionRate: number;
    provisionAmount: number;
  }[];
  totalOverdue30Plus: number;
  overdue30PlusPercent: number;
  totalProvisionEstimated: number;
}

export function deriveReceivablesAgeing(
  total = popyMonthlyParameters.receivables,
): ReceivablesAgeingResult {
  // 55% (0-15), 27% (16-30), 11% (31-45), 5% (46-60), 2% (60+)
  const specs = [
    { range: "0–15 days", percent: 0.55, provisionRate: 0.005 },
    { range: "16–30 days", percent: 0.27, provisionRate: 0.02 },
    { range: "31–45 days", percent: 0.11, provisionRate: 0.1 },
    { range: "46–60 days", percent: 0.05, provisionRate: 0.25 },
    { range: "60+ days", percent: 0.02, provisionRate: 0.5 },
  ];

  const buckets = specs.map((s) => {
    const amount = Math.round(total * s.percent);
    const provisionAmount = Math.round(amount * s.provisionRate);
    return {
      range: s.range,
      percent: s.percent * 100,
      amount,
      provisionRate: s.provisionRate * 100,
      provisionAmount,
    };
  });

  const totalOverdue30Plus = buckets
    .filter(
      (b) =>
        b.range.includes("31") ||
        b.range.includes("46") ||
        b.range.includes("60+"),
    )
    .reduce((sum, b) => sum + b.amount, 0);

  const overdue30PlusPercent = Number(
    ((totalOverdue30Plus / total) * 100).toFixed(1),
  );
  const totalProvisionEstimated = buckets.reduce(
    (sum, b) => sum + b.provisionAmount,
    0,
  );

  return {
    totalReceivables: total,
    buckets,
    totalOverdue30Plus,
    overdue30PlusPercent,
    totalProvisionEstimated,
  };
}

// -----------------------------------------------------------------------
// Section F Missing KPIs for M/S Popy Traders
// -----------------------------------------------------------------------
export interface BusinessKPISet {
  strikeRate: number; // 75.0%
  linesPerCall: number; // 4.8 lines
  dropSize: number; // ৳1,333
  fillRate: number; // 96.2%
  returnRate: number; // 0.75%
  stockCoverDays: number; // 20 days (DIO)
  nearExpiryStockValue: number; // ৳92,000
  schemeClaimsPending: number; // ৳1,20,000
  damageClaimsPending: number; // ৳85,000
  overdue30PlusPercent: number; // 18.0%
  breakEvenMonthlyUnits: number; // 90,741 units
  marginOfSafetyPercent: number; // 56.4%
  cashConversionCycleDays: number; // 16 days (DIO 20 + DSO 24 - DPO 28)
}

export function deriveBusinessKPISet(): BusinessKPISet {
  const {
    dio,
    ccc,
    schemeClaimsPending,
    damageClaimsPending,
    breakEvenUnitsMonthly,
  } = popyMonthlyParameters;

  // Monthly volume ≈ 26 days * 8,000 units = 2,08,000 units
  const totalMonthlyUnits = 26 * 8000;
  const marginOfSafety =
    ((totalMonthlyUnits - breakEvenUnitsMonthly) / totalMonthlyUnits) * 100;

  return {
    strikeRate: 75.0,
    linesPerCall: 4.8,
    dropSize: 1333,
    fillRate: 96.2,
    returnRate: 0.75,
    stockCoverDays: dio,
    nearExpiryStockValue: 92000,
    schemeClaimsPending,
    damageClaimsPending,
    overdue30PlusPercent: 18.0,
    breakEvenMonthlyUnits: breakEvenUnitsMonthly,
    marginOfSafetyPercent: Number(marginOfSafety.toFixed(1)),
    cashConversionCycleDays: ccc,
  };
}
