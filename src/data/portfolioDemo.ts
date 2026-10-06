// Portfolio Demo Data Contract & Allocation Module
// All figures align with Section 4 and Section 5 reconciled seed data contract.
// Uses exact taka for control figures and realistic thin-margin calibration (~1.49% net profit).

import { popyFieldBase, popyMonthlyParameters, popyTodaySnapshot } from './seedData.ts';

export type PrincipalFilter = 'All principals' | 'Illustrative FMCG' | 'Pureit (Durables)';
export type DepotFilter = 'All depots' | 'Sherpur' | 'Bogura';

export const principalOptions: PrincipalFilter[] = [
  'All principals',
  'Illustrative FMCG',
  'Pureit (Durables)',
];

export const depotOptions: DepotFilter[] = [
  'All depots',
  'Sherpur',
  'Bogura',
];

type DemoSegment = {
  principal: Exclude<PrincipalFilter, 'All principals'>;
  depot: Exclude<DepotFilter, 'All depots'>;
  share: number;
  bankShare: number;
  upcomingObligation: number;
};

export type PortfolioSnapshot = {
  share: number;
  monthlyUnits: number;
  monthlyRevenue: number;
  monthlyCogs: number;
  monthlyGrossProfit: number;
  monthlyDeliveryCost: number;
  monthlyFixedOverhead: number;
  monthlyEbit: number;
  monthlyInterest: number;
  monthlyTax: number;
  monthlyNetProfit: number;
  receivables: number;
  averageInventory: number;
  payables: number;
  unclaimedSchemes: number;
  damageClaimsPending: number;
  netOperatingWorkingCapital: number;
  bankCash: number;
  vaultCash: number;
  liquidCash: number;
  plannedDepositTonight: number;
  upcomingObligation: number;
  next7DayObligations: number;
  dailyDeliveredSales: number;
  dailyCashSales: number;
  dailyFreshCredit: number;
  dailyOldDuesCollected: number;
  dailyCashOutflow: number;
  dailyNetCashAdded: number;
  expectedTillCash: number;
  countedTillCash: number;
  cashVariance: number;
  dso: number;
  dio: number;
  dpo: number;
  cashConversionCycle: number;
};

// Segment allocation:
// Sherpur Upazila: 70% share; Bogura Link: 30% share
const demoSegments: DemoSegment[] = [
  { principal: 'Illustrative FMCG', depot: 'Sherpur', share: 55, bankShare: 65, upcomingObligation: 3780000 },
  { principal: 'Illustrative FMCG', depot: 'Bogura', share: 25, bankShare: 20, upcomingObligation: 1620000 },
  { principal: 'Pureit (Durables)', depot: 'Sherpur', share: 15, bankShare: 10, upcomingObligation: 0 },
  { principal: 'Pureit (Durables)', depot: 'Bogura', share: 5, bankShare: 5, upcomingObligation: 0 },
];

const allocate = (amount: number, share: number) => Math.round((amount * share) / 100);

export const getPortfolioSnapshot = (
  principal: PrincipalFilter,
  depot: DepotFilter,
  overrides?: {
    bankCash?: number;
    vaultCash?: number;
    upcomingObligation?: number;
    freshCredit?: number;
    todaySales?: number;
    cashVariance?: number;
  },
): PortfolioSnapshot => {
  const matchingSegments = demoSegments.filter((segment) =>
    (principal === 'All principals' || segment.principal === principal)
    && (depot === 'All depots' || segment.depot === depot),
  );

  const share = matchingSegments.reduce((total, segment) => total + segment.share, 0);
  const bankShare = matchingSegments.reduce((total, segment) => total + segment.bankShare, 0);

  const split = (amount: number) => (share === 100 ? amount : allocate(amount, share));
  const splitBankCash = (amount: number) => (bankShare === 100 ? amount : allocate(amount, bankShare));

  // Base calibrated figures from Section 4.1
  const monthlyRevenue = split(popyMonthlyParameters.revenue);
  const monthlyCogs = split(popyMonthlyParameters.cogs);
  const monthlyGrossProfit = monthlyRevenue - monthlyCogs;
  const monthlyDeliveryCost = split(popyMonthlyParameters.variableCost);
  const monthlyFixedOverhead = split(popyMonthlyParameters.fixedCost);
  const monthlyEbit = monthlyGrossProfit - monthlyDeliveryCost - monthlyFixedOverhead;
  const monthlyInterest = split(popyMonthlyParameters.interest);
  const monthlyProfitBeforeTax = monthlyEbit - monthlyInterest;
  const monthlyTax = Math.round(Math.max(0, monthlyProfitBeforeTax * popyMonthlyParameters.taxRate));
  const monthlyNetProfit = Math.round(monthlyProfitBeforeTax - monthlyTax);

  // Cash variance: allocated to Bogura route Van #3
  const boguraShare = matchingSegments
    .filter((segment) => segment.depot === 'Bogura')
    .reduce((total, segment) => total + segment.share, 0);
  const cashVariance = boguraShare > 0
    ? (overrides?.cashVariance ?? popyTodaySnapshot.variance)
    : 0;

  // Daily operations
  const baseDeliveredSales = overrides?.todaySales ?? popyTodaySnapshot.deliveredSales;
  const baseFreshCredit = overrides?.freshCredit ?? popyTodaySnapshot.creditSales;
  const dailyDeliveredSales = split(baseDeliveredSales);
  const dailyFreshCredit = split(baseFreshCredit);
  const dailyCashSales = Math.max(0, dailyDeliveredSales - dailyFreshCredit);
  const dailyOldDuesCollected = split(popyTodaySnapshot.oldDuesCollected);
  const dailyCashOutflow = split(popyTodaySnapshot.routeCashExpenses);
  const dailyNetCashAdded = (dailyCashSales + dailyOldDuesCollected) - dailyCashOutflow;

  const openingFloat = split(popyTodaySnapshot.openingFloat);
  const cashHandedIn = dailyCashSales + dailyOldDuesCollected;
  const expectedTillCash = openingFloat + cashHandedIn - dailyCashOutflow;
  const countedTillCash = expectedTillCash + cashVariance;

  // Auto-debit and Liquidity
  const obligationShare = matchingSegments.reduce(
    (total, segment) => total + segment.upcomingObligation,
    0,
  );
  const upcomingObligation = overrides?.upcomingObligation !== undefined
    ? split(overrides.upcomingObligation)
    : (share === 100 ? popyTodaySnapshot.upcomingAutoDebit : obligationShare);

  const bankCash = overrides?.bankCash !== undefined
    ? splitBankCash(overrides.bankCash)
    : splitBankCash(popyTodaySnapshot.bankAfterDebit);
  const vaultCash = overrides?.vaultCash !== undefined
    ? split(overrides.vaultCash)
    : (share === 100 ? countedTillCash : split(countedTillCash));
  const liquidCash = bankCash + vaultCash;

  // Working capital metrics (Section 4.1 & Defect A5/A6)
  const receivables = split(popyMonthlyParameters.receivables);
  const averageInventory = split(popyMonthlyParameters.inventory);
  const payables = split(popyMonthlyParameters.payables);
  const unclaimedSchemes = split(popyMonthlyParameters.schemeClaimsPending);
  const damageClaimsPending = split(popyMonthlyParameters.damageClaimsPending);
  const netOperatingWorkingCapital = receivables + averageInventory + unclaimedSchemes + damageClaimsPending - payables;

  return {
    share,
    monthlyUnits: split(popyMonthlyParameters.workingDays * popyFieldBase.dailyUnits),
    monthlyRevenue,
    monthlyCogs,
    monthlyGrossProfit,
    monthlyDeliveryCost,
    monthlyFixedOverhead,
    monthlyEbit,
    monthlyInterest,
    monthlyTax,
    monthlyNetProfit,
    receivables,
    averageInventory,
    payables,
    unclaimedSchemes,
    damageClaimsPending,
    netOperatingWorkingCapital,
    bankCash,
    vaultCash,
    liquidCash,
    plannedDepositTonight: split(popyTodaySnapshot.plannedDepositTonight),
    upcomingObligation,
    next7DayObligations: split(popyTodaySnapshot.next7DayObligations),
    dailyDeliveredSales,
    dailyCashSales,
    dailyFreshCredit,
    dailyOldDuesCollected,
    dailyCashOutflow,
    dailyNetCashAdded,
    expectedTillCash,
    countedTillCash,
    cashVariance,
    dso: popyMonthlyParameters.dso,
    dio: popyMonthlyParameters.dio,
    dpo: popyMonthlyParameters.dpo,
    cashConversionCycle: popyMonthlyParameters.ccc,
  };
};
