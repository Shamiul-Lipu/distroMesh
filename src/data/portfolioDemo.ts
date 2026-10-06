export type PrincipalFilter = 'All principals' | 'Unilever' | 'Pureit';
export type DepotFilter = 'All depots' | 'Sherpur' | 'Bogura';

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
  bankCash: number;
  vaultCash: number;
  upcomingObligation: number;
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

const annualRevenue = 144_000_000;
const annualCogs = 126_000_000;
const annualInterest = 1_400_000;
const taxRate = 0.275;
const initialSupplierObligation = 2_070_000;

const demoSegments: DemoSegment[] = [
  { principal: 'Unilever', depot: 'Sherpur', share: 56, bankShare: 72, upcomingObligation: 1_656_000 },
  { principal: 'Unilever', depot: 'Bogura', share: 14, bankShare: 18, upcomingObligation: 414_000 },
  { principal: 'Pureit', depot: 'Sherpur', share: 24, bankShare: 8, upcomingObligation: 0 },
  { principal: 'Pureit', depot: 'Bogura', share: 6, bankShare: 2, upcomingObligation: 0 },
];

const allocate = (amount: number, share: number) => Math.round((amount * share) / 100);

export const getPortfolioSnapshot = (
  principal: PrincipalFilter,
  depot: DepotFilter,
  overrides?: {
    bankCash: number;
    vaultCash: number;
    upcomingObligation: number;
    freshCredit: number;
    todaySales: number;
    cashVariance: number;
  },
): PortfolioSnapshot => {
  const matchingSegments = demoSegments.filter((segment) =>
    (principal === 'All principals' || segment.principal === principal)
    && (depot === 'All depots' || segment.depot === depot),
  );
  const share = matchingSegments.reduce((total, segment) => total + segment.share, 0);
  const bankShare = matchingSegments.reduce((total, segment) => total + segment.bankShare, 0);
  const split = (amount: number) => allocate(amount, share);
  const splitBankCash = (amount: number) => allocate(amount, bankShare);
  const monthlyRevenue = split(12_000_000);
  const monthlyCogs = split(10_500_000);
  const monthlyGrossProfit = monthlyRevenue - monthlyCogs;
  const monthlyDeliveryCost = split(300_000);
  const monthlyFixedOverhead = split(450_000);
  const monthlyEbit = monthlyGrossProfit - monthlyDeliveryCost - monthlyFixedOverhead;
  const monthlyInterest = split(annualInterest / 12);
  const monthlyProfitBeforeTax = monthlyEbit - monthlyInterest;
  const monthlyTax = Math.round(Math.max(0, monthlyProfitBeforeTax * taxRate));
  const monthlyNetProfit = Math.round(monthlyProfitBeforeTax - monthlyTax);
  const boguraShare = matchingSegments
    .filter((segment) => segment.depot === 'Bogura')
    .reduce((total, segment) => total + segment.share, 0);
  const cashVariance = allocate(overrides?.cashVariance ?? -400, boguraShare * 5);
  const dailyDeliveredSales = split(overrides?.todaySales ?? 480_000);
  const dailyFreshCredit = split(overrides?.freshCredit ?? 190_000);
  const dailyCashSales = split(Math.max(0, (overrides?.todaySales ?? 480_000) - (overrides?.freshCredit ?? 190_000)));
  const dailyOldDuesCollected = split(140_000);
  const dailyCashOutflow = split(12_000);
  const obligationShare = matchingSegments.reduce(
    (total, segment) => total + segment.upcomingObligation,
    0,
  ) / initialSupplierObligation;

  return {
    share,
    monthlyUnits: split(100_000),
    monthlyRevenue,
    monthlyCogs,
    monthlyGrossProfit,
    monthlyDeliveryCost,
    monthlyFixedOverhead,
    monthlyEbit,
    monthlyInterest,
    monthlyTax,
    monthlyNetProfit,
    receivables: split(9_500_000),
    averageInventory: split(12_500_000),
    payables: split(11_000_000),
    unclaimedSchemes: split(1_890_000),
    bankCash: splitBankCash(overrides?.bankCash ?? 2_300_000),
    vaultCash: split(overrides?.vaultCash ?? 442_600),
    upcomingObligation: Math.round((overrides?.upcomingObligation ?? initialSupplierObligation) * obligationShare),
    dailyDeliveredSales,
    dailyCashSales,
    dailyFreshCredit,
    dailyOldDuesCollected,
    dailyCashOutflow,
    dailyNetCashAdded: dailyCashSales + dailyOldDuesCollected - dailyCashOutflow,
    expectedTillCash: split(443_000),
    countedTillCash: split(443_000) + cashVariance,
    cashVariance,
    dso: share === 0 ? 0 : (9_500_000 / annualRevenue) * 365,
    dio: share === 0 ? 0 : (12_500_000 / annualCogs) * 365,
    dpo: share === 0 ? 0 : (11_000_000 / annualCogs) * 365,
    cashConversionCycle: share === 0
      ? 0
      : ((12_500_000 / annualCogs) + (9_500_000 / annualRevenue) - (11_000_000 / annualCogs)) * 365,
  };
};

export const principalOptions: PrincipalFilter[] = ['All principals', 'Unilever', 'Pureit'];
export const depotOptions: DepotFilter[] = ['All depots', 'Sherpur', 'Bogura'];

export const demoPortfolioTotals = {
  monthlyRevenue: 12_000_000,
  monthlyGrossProfit: 1_500_000,
  monthlyEbit: 750_000,
  monthlyInterest: annualInterest / 12,
  monthlyTax: ((750_000 - (annualInterest / 12)) * taxRate),
  monthlyNetProfit: (750_000 - (annualInterest / 12)) * (1 - taxRate),
  dailySales: 480_000,
  dailyCashIn: 430_000,
  dailyCashOut: 12_000,
  annualRevenue,
  annualCogs,
};
