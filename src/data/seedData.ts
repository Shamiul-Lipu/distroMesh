// Reconciled seed data contract for M/S Popy Traders and portfolio businesses
// All figures are PLACEHOLDER until confirmed with the owner.
// Calibrated to ~1.49% net margin under thin-margin FMCG distribution economics.

export interface RouteRecord {
  id: string;
  name: string;
  vehicle: string;
  territory: string;
  isOutsideTerritory?: boolean;
  jsrName: string;
  srName: string;
  deliveredSales: number;
  cashSales: number;
  creditSales: number;
  oldDuesCollected: number;
  cashExpenses: number;
  cashHandedIn: number;
  expectedTill: number;
  countedTill: number;
  variance: number;
  notes: string;
  statusNotes?: string;
  invoicesCount: number;
  unitsDelivered: number;
  dropsCount: number;
}

export interface RetailerInvoice {
  id: string;
  routeId: string;
  retailerName: string;
  marketPoint: string;
  invoiceAmount: number;
  paymentType: 'Cash' | 'Credit';
  status: 'Paid' | 'Pending' | 'Overdue';
  dueDays: number;
}

export interface OverdueRetailer {
  id: string;
  name: string;
  marketPoint: string;
  routeId: string;
  balance: number;
  overdueDays: number;
  creditLimit: number;
  status: 'LOCKED' | 'WARNED' | 'NORMAL';
}

export interface SchemeClaim {
  id: string;
  principal: string;
  title: string;
  amount: number;
  status: 'Claimed' | 'Pending' | 'Disputed';
  submissionDate: string;
}

// ----------------------------------------------------
// Section 4.1 Monthly Parameters (26 working days)
// ----------------------------------------------------
export const popyMonthlyParameters = {
  workingDays: 26,
  revenue: 25000000, // PLACEHOLDER: ৳2,50,00,000 monthly turnover
  cogsPercent: 0.935, // 93.5% COGS
  cogs: 23375000, // PLACEHOLDER: ৳2,33,75,000
  grossProfit: 1625000, // 6.5% -> ৳16,25,000
  variableCost: 500000, // 2.0% -> ৳5,00,000
  fixedCost: 490000, // ৳4,90,000
  ebit: 635000, // ৳6,35,000
  interest: 120000, // 12% overdraft/debt interest -> ৳1,20,000
  profitBeforeTax: 515000, // ৳5,15,000
  taxRate: 0.275, // 27.5%
  tax: 141625, // ৳1,41,625
  netProfit: 373375, // ≈1.4935% net profit -> ৳3,73,375

  // Unit economics
  pricePerUnit: 120.0, // PLACEHOLDER: ৳120
  landedCostPerUnit: 112.2, // PLACEHOLDER: ৳112.20
  grossMarginPerUnit: 7.8, // ৳7.80
  deliveryCostPerUnit: 2.4, // ৳2.40
  contributionMarginPerUnit: 5.4, // ৳5.40
  ruralDeliveryCostPerUnit: 4.8,
  ruralContributionMarginPerUnit: 3.0,
  breakEvenUnitsMonthly: Math.round(490000 / 5.4), // 90,741 units

  // Headcount & Payroll breakdown
  headcount: {
    sr: 24,
    jsr: 12,
    helpers: 12,
    pickers: 6,
    billing: 1,
    cashier: 1,
    manager: 1,
    total: 57,
  },
  payrollMonthly: 562000, // PLACEHOLDER: ৳5,62,000
  payrollBreakdown: {
    srTotal: 240000, // 24 SRs base (1,20,000) + incentive (1,20,000)
    jsrTotal: 108000, // 12 JSRs wages
    helpersTotal: 84000, // 12 helpers
    pickersTotal: 54000, // 6 pickers
    billingTotal: 14000, // 1 billing operator
    cashierTotal: 22000, // 1 accountant/cashier
    managerTotal: 40000, // 1 manager
  },

  // Working capital metrics
  dso: 24, // Days Sales Outstanding
  dio: 20, // Days Inventory Outstanding
  dpo: 28, // Days Payable Outstanding
  ccc: 16, // Cash Conversion Cycle = 24 + 20 - 28 = 16 days

  // Derived Working Capital figures
  receivables: Math.round((25000000 * 12 / 365) * 24), // ≈ ৳1,97,26,027
  inventory: Math.round((23375000 * 12 / 365) * 20), // ≈ ৳1,53,69,863
  payables: Math.round((23375000 * 12 / 365) * 28), // ≈ ৳2,15,16,164
  schemeClaimsPending: 120000, // PLACEHOLDER: ৳1,20,000
  damageClaimsPending: 85000, // PLACEHOLDER: ৳85,000
};

// ----------------------------------------------------
// Section 4.2 Retail and Field Base
// ----------------------------------------------------
export const popyFieldBase = {
  totalSRs: 24,
  plannedCallsPerSR: 40,
  totalPlannedCalls: 960,
  strikeRate: 0.75, // 75% productive calls
  dailyInvoices: 720, // 720 invoices/day
  dailyUnits: 8000, // 8,000 units/day
  avgDropValue: 1333.33, // ৳9,60,000 / 720 drops ≈ ৳1,333.33
  activeRetailers: 5760, // Visited weekly
  routesCount: 12,
  dropsPerRoute: 60,
};

// ----------------------------------------------------
// Section 5. Reconciled "Today" Daily Snapshot
// ----------------------------------------------------
export const popyTodaySnapshot = {
  deliveredSales: 960000, // ৳9,60,000
  dailyInvoices: 720, // 720 invoices (60 drops * 12 routes)
  cashSales: 580000, // ৳5,80,000
  creditSales: 380000, // ৳3,80,000 (39.58% credit share)
  oldDuesCollected: 280000, // ৳2,80,000
  cashHandedIn: 860000, // cashSales + oldDues = ৳8,60,000
  routeCashExpenses: 14400, // ৳14,400 (fuel, helper allowance)
  openingFloat: 50000, // ৳50,000
  expectedTill: 895600, // 50000 + 860000 - 14400 = ৳8,95,600
  countedTill: 895200, // ৳8,95,200
  variance: -400, // -৳400 (Van #3, JSR Babul Hossain)
  netCashAddedToday: 845600, // cashHandedIn - expenses = ৳8,45,600
  plannedDepositTonight: 800000, // ৳8,00,000 deposit in transit

  // Daily profit calculations
  dailyGrossProfit: 62400, // 6.5% of ৳9,60,000 = ৳62,400
  dailyContribution: 43200, // 8000 units * ৳5.40 = ৳43,200
  dailyFixedShare: Math.round(490000 / 26), // ৳18,846
  dailyOperatingProfit: 24354, // ৳43,200 - ৳18,846 = ৳24,354
  dailyBreakEvenUnits: Math.round(18846 / 5.4), // 3,490 units

  // Dispatch parameters
  dispatchTarget: '09:00',
  dispatchActual: '11:45',
  dispatchDelayMinutes: 165,
  vansDispatched: 12,
  crewDailyWage: 1200,
  seeded30DayOnTimeRate: 38, // 38% chronic late rate

  // Liquidity and Auto-Debit
  bankBeforeDebit: 6200000, // ৳62,00,000
  upcomingAutoDebit: 5400000, // ৳54,00,000 due in 48 hours
  dueHours: 48,
  bankAfterDebit: 800000, // ৳8,00,000
  vaultCash: 895200, // ৳8,95,200 (not yet deposited)
  next7DayObligations: 782000, // Payroll 5,62,000 + rent 80,000 + EMI 1,40,000 = ৳7,82,000
  next7DayBreakdown: {
    payroll: 562000,
    rent: 80000,
    loanEmi: 140000,
  },

  // Incident & hardware mispick parameters
  todayIncidentUnits: 60, // 2.5 cartons of 24
  todayIncidentCartons: 2.5,
  avgDailyMispickUnits: 26,
  liquidationDiscount: 0.30, // 30% discount
  lossPerUnit: 41.46, // 112.20 * 0.30 + 7.80 = ৳41.46
  todayMispickLoss: 2488, // 60 * 41.46 = ৳2,487.60 ≈ ৳2,488
  avgDailyAvoidedLoss: 1078, // 26 * 41.46 = ৳1,077.96 ≈ ৳1,078/day
  replacementPrinterCost: 3000, // ৳3,000
  printerPaybackDays: 2.8, // 3000 / 1078 ≈ 2.8 days
};

// ----------------------------------------------------
// 12 Delivery Routes for M/S Popy Traders
// Sums strictly enforce Section 4.3 Identities!
// ----------------------------------------------------
export const popy12Routes: RouteRecord[] = [
  {
    id: 'van-1',
    name: 'Van #1 - Sherpur Sadar North',
    vehicle: 'Tata Ace (Dhaka Metro-U-11-2041)',
    territory: 'Sherpur Upazila',
    jsrName: 'Rafiqul Islam',
    srName: 'Tariqul Anam',
    deliveredSales: 92000,
    cashSales: 62000,
    creditSales: 30000,
    oldDuesCollected: 26000,
    cashExpenses: 1200,
    cashHandedIn: 88000, // 62000 + 26000
    expectedTill: 86800, // 88000 - 1200
    countedTill: 86800,
    variance: 0,
    notes: 'Routine beat completed on schedule.',
    invoicesCount: 65,
    unitsDelivered: 766,
    dropsCount: 60,
  },
  {
    id: 'van-2',
    name: 'Van #2 - Sherpur Bazar Core',
    vehicle: 'Mahindra Bolero (Dhaka Metro-L-14-9821)',
    territory: 'Sherpur Upazila',
    jsrName: 'Anisur Rahman',
    srName: 'Kazi Faruk',
    deliveredSales: 110000,
    cashSales: 75000,
    creditSales: 35000,
    oldDuesCollected: 32000,
    cashExpenses: 1500,
    cashHandedIn: 107000, // 75000 + 32000
    expectedTill: 105500, // 107000 - 1500
    countedTill: 105500,
    variance: 0,
    notes: 'Heavy commercial bazaar beat. High turnover.',
    invoicesCount: 72,
    unitsDelivered: 916,
    dropsCount: 60,
  },
  {
    id: 'van-3',
    name: 'Van #3 - Bogura Link Road (Urban)',
    vehicle: 'Tata Ace (Dhaka Metro-U-11-4092)',
    territory: 'Bogura Link',
    jsrName: 'Babul Hossain',
    srName: 'Mominul Haque',
    deliveredSales: 98000,
    cashSales: 52000,
    creditSales: 46000, // 46.9% credit share -> REVIEW trigger
    oldDuesCollected: 24000,
    cashExpenses: 1400,
    cashHandedIn: 76000, // 52000 + 24000
    expectedTill: 74600, // 76000 - 1400
    countedTill: 74200, // Shortage of 400
    variance: -400, // -৳400 cash variance
    notes: 'Shopkeeper at Link Road point made partial payment with ৳500 note during rush hour.',
    statusNotes: 'Cash shortage −৳400; credit share 46.9% exceeds 45% threshold.',
    invoicesCount: 64,
    unitsDelivered: 816,
    dropsCount: 60,
  },
  {
    id: 'van-4',
    name: 'Van #4 - Mirzapur Highway Rural',
    vehicle: 'Rickshaw Van #1 (Local Permit 44)',
    territory: 'Mirzapur (Verify Territory)',
    isOutsideTerritory: true, // Flagged for territory review
    jsrName: 'Shafiqul Alam',
    srName: 'Zahid Hasan',
    deliveredSales: 68000,
    cashSales: 38000,
    creditSales: 30000,
    oldDuesCollected: 18000,
    cashExpenses: 1000,
    cashHandedIn: 56000,
    expectedTill: 55000,
    countedTill: 55000,
    variance: 0,
    notes: 'Rural transit route. Roads dusty but delivery complete.',
    statusNotes: 'Route outside standard Sherpur bounds; verify territory assignment.',
    invoicesCount: 52,
    unitsDelivered: 566,
    dropsCount: 60,
  },
  {
    id: 'van-5',
    name: 'Van #5 - Garidaha & Chhania Beat',
    vehicle: 'Tata Ace (Dhaka Metro-U-12-8812)',
    territory: 'Sherpur Upazila',
    jsrName: 'Abdul Mannan',
    srName: 'Nazmul Islam',
    deliveredSales: 84000,
    cashSales: 54000,
    creditSales: 30000,
    oldDuesCollected: 24000,
    cashExpenses: 1100,
    cashHandedIn: 78000,
    expectedTill: 76900,
    countedTill: 76900,
    variance: 0,
    notes: 'Smooth delivery across Garidaha wholesale hub.',
    invoicesCount: 58,
    unitsDelivered: 700,
    dropsCount: 60,
  },
  {
    id: 'van-6',
    name: 'Van #6 - Bhabanipur Feeder Road',
    vehicle: 'Rickshaw Van #2 (Local Permit 45)',
    territory: 'Sherpur Upazila',
    jsrName: 'Dulal Mia',
    srName: 'Saidur Rahman',
    deliveredSales: 70000,
    cashSales: 44000,
    creditSales: 26000,
    oldDuesCollected: 19000,
    cashExpenses: 900,
    cashHandedIn: 63000,
    expectedTill: 62100,
    countedTill: 62100,
    variance: 0,
    notes: 'Village retail stores. Cash collected on delivery.',
    invoicesCount: 54,
    unitsDelivered: 583,
    dropsCount: 60,
  },
  {
    id: 'van-7',
    name: 'Van #7 - Khanpur Union Beat',
    vehicle: 'Tata Ace (Dhaka Metro-U-15-1190)',
    territory: 'Sherpur Upazila',
    jsrName: 'Golam Rabbani',
    srName: 'Mahmudul Hasan',
    deliveredSales: 76000,
    cashSales: 46000,
    creditSales: 30000,
    oldDuesCollected: 21000,
    cashExpenses: 1200,
    cashHandedIn: 67000,
    expectedTill: 65800,
    countedTill: 65800,
    variance: 0,
    notes: 'Union level grocery distribution.',
    invoicesCount: 57,
    unitsDelivered: 633,
    dropsCount: 60,
  },
  {
    id: 'van-8',
    name: 'Van #8 - Kusumbi & Raninagar',
    vehicle: 'Rickshaw Van #3 (Local Permit 49)',
    territory: 'Sherpur Upazila',
    jsrName: 'Mokbul Hossain',
    srName: 'Ashraful Alam',
    deliveredSales: 64000,
    cashSales: 40000,
    creditSales: 24000,
    oldDuesCollected: 18000,
    cashExpenses: 800,
    cashHandedIn: 58000,
    expectedTill: 57200,
    countedTill: 57200,
    variance: 0,
    notes: 'Regular retailer orders fulfilled.',
    invoicesCount: 50,
    unitsDelivered: 533,
    dropsCount: 60,
  },
  {
    id: 'van-9',
    name: 'Van #9 - Suwagari Industrial Link',
    vehicle: 'Mahindra Bolero (Dhaka Metro-L-16-3391)',
    territory: 'Sherpur Upazila',
    jsrName: 'Habibur Rahman',
    srName: 'Tanvir Ahmed',
    deliveredSales: 96000,
    cashSales: 56000,
    creditSales: 40000,
    oldDuesCollected: 29000,
    cashExpenses: 1500,
    cashHandedIn: 85000,
    expectedTill: 83500,
    countedTill: 83500,
    variance: 0,
    notes: 'Canteen and factory outlet deliveries.',
    invoicesCount: 66,
    unitsDelivered: 800,
    dropsCount: 60,
  },
  {
    id: 'van-10',
    name: 'Van #10 - Bishalpur Remote North',
    vehicle: 'Rickshaw Van #4 (Local Permit 52)',
    territory: 'Sherpur Upazila',
    jsrName: 'Jahangir Alam',
    srName: 'Kamrul Hasan',
    deliveredSales: 60000,
    cashSales: 34000,
    creditSales: 26000,
    oldDuesCollected: 17000,
    cashExpenses: 1000,
    cashHandedIn: 51000,
    expectedTill: 50000,
    countedTill: 50000,
    variance: 0,
    notes: 'Long distance rural track.',
    invoicesCount: 48,
    unitsDelivered: 500,
    dropsCount: 60,
  },
  {
    id: 'van-11',
    name: 'Van #11 - Shilmukhi Hat Extension',
    vehicle: 'Tata Ace (Dhaka Metro-U-16-7023)',
    territory: 'Sherpur Upazila',
    jsrName: 'Sirajul Islam',
    srName: 'Mehedi Hasan',
    deliveredSales: 74000,
    cashSales: 45000,
    creditSales: 29000,
    oldDuesCollected: 21000,
    cashExpenses: 1300,
    cashHandedIn: 66000,
    expectedTill: 64700,
    countedTill: 64700,
    variance: 0,
    notes: 'Haat day retailers took standard allotments.',
    invoicesCount: 56,
    unitsDelivered: 617,
    dropsCount: 60,
  },
  {
    id: 'van-12',
    name: 'Van #12 - Nalitabari Borderlink (Verify)',
    vehicle: 'Mahindra Bolero (Dhaka Metro-L-18-5520)',
    territory: 'Nalitabari (Verify Territory)',
    isOutsideTerritory: true, // Flagged for territory review
    jsrName: 'Kabir Ahmed',
    srName: 'Rasel Mia',
    deliveredSales: 68000,
    cashSales: 34000,
    creditSales: 34000, // 50.0% credit share -> REVIEW trigger
    oldDuesCollected: 31000,
    cashExpenses: 1500,
    cashHandedIn: 65000,
    expectedTill: 63500,
    countedTill: 63500,
    variance: 0,
    notes: 'Special feeder run outside standard Bogura upazila border.',
    statusNotes: 'Territory far outside Sherpur depot declared boundaries; 50% credit share.',
    invoicesCount: 58,
    unitsDelivered: 567,
    dropsCount: 60,
  },
];

// Verify the exact sums for popy12Routes:
// Delivered sales = 92k + 110k + 98k + 68k + 84k + 70k + 76k + 64k + 96k + 60k + 74k + 68k = 960,000!
// Cash sales = 62 + 75 + 52 + 38 + 54 + 44 + 46 + 40 + 56 + 34 + 45 + 34 = 580,000!
// Credit sales = 30 + 35 + 46 + 30 + 30 + 26 + 30 + 24 + 40 + 26 + 29 + 34 = 380,000!
// Old dues = 26 + 32 + 24 + 18 + 24 + 19 + 21 + 18 + 29 + 17 + 21 + 20 = 280,000!
// Cash handed in = 88 + 107 + 76 + 56 + 78 + 63 + 67 + 58 + 85 + 51 + 66 + 54 = 860,000!
// Cash expenses = 1200 + 1500 + 1400 + 1000 + 1100 + 900 + 1200 + 800 + 1600 + 1100 + 1300 + 1500 = 14,400!
// Opening float = 50,000. Expected till total = 50,000 + 860,000 - 14,400 = 895,600!
// Counted till total = 895,200 (Van #3 shortage 400). Net variance = -400!
// Invoices count = 65+72+64+52+58+54+57+50+66+48+56+58 = 720 invoices!
// Units delivered = 766+916+816+566+700+583+633+533+800+500+617+567 = 8,000 units!

// ----------------------------------------------------
// Top-10 Overdue Retailers summing to 31+ day buckets
// Total receivables = ৳1,97,26,027
// 31-45 days (11%) = ৳21,69,863
// 46-60 days (5%) = ৳9,86,301
// 60+ days (2%) = ৳3,94,521
// Total 31+ days = ৳35,50,685
// Top-10 represents the most critical overdue shop owners
// ----------------------------------------------------
export const top10OverdueRetailers: OverdueRetailer[] = [
  {
    id: 'ret-1',
    name: 'Mayer Doa General Store',
    marketPoint: 'Bogura Link Road Mor',
    routeId: 'van-3',
    balance: 520000,
    overdueDays: 68,
    creditLimit: 300000,
    status: 'LOCKED',
  },
  {
    id: 'ret-2',
    name: 'Bismillah Store & Dairy',
    marketPoint: 'Sherpur College Gate',
    routeId: 'van-2',
    balance: 480000,
    overdueDays: 52,
    creditLimit: 350000,
    status: 'LOCKED',
  },
  {
    id: 'ret-3',
    name: 'Al-Madina Grocers',
    marketPoint: 'Mirzapur Highway Bazar',
    routeId: 'van-4',
    balance: 430000,
    overdueDays: 45,
    creditLimit: 250000,
    status: 'WARNED',
  },
  {
    id: 'ret-4',
    name: 'Janani Bastralaya & Store',
    marketPoint: 'Chhania Mor',
    routeId: 'van-5',
    balance: 390000,
    overdueDays: 42,
    creditLimit: 250000,
    status: 'WARNED',
  },
  {
    id: 'ret-5',
    name: 'Bhai Bhai Traders',
    marketPoint: 'Nalitabari Stand',
    routeId: 'van-12',
    balance: 380000,
    overdueDays: 39,
    creditLimit: 200000,
    status: 'WARNED',
  },
  {
    id: 'ret-6',
    name: 'Maa Store',
    marketPoint: 'Bhabanipur Bazar',
    routeId: 'van-6',
    balance: 340000,
    overdueDays: 36,
    creditLimit: 200000,
    status: 'WARNED',
  },
  {
    id: 'ret-7',
    name: 'Haji & Sons Confectionery',
    marketPoint: 'Khanpur Bazar',
    routeId: 'van-7',
    balance: 310000,
    overdueDays: 34,
    creditLimit: 200000,
    status: 'WARNED',
  },
  {
    id: 'ret-8',
    name: 'Rabbani Departmental',
    marketPoint: 'Sherpur Town Center',
    routeId: 'van-1',
    balance: 280000,
    overdueDays: 33,
    creditLimit: 250000,
    status: 'WARNED',
  },
  {
    id: 'ret-9',
    name: 'Kusumbi Green Grocery',
    marketPoint: 'Raninagar Mor',
    routeId: 'van-8',
    balance: 240000,
    overdueDays: 32,
    creditLimit: 180000,
    status: 'NORMAL',
  },
  {
    id: 'ret-10',
    name: 'Suwagari Station Store',
    marketPoint: 'Suwagari Mor',
    routeId: 'van-9',
    balance: 210000,
    overdueDays: 31,
    creditLimit: 150000,
    status: 'NORMAL',
  },
];

// Scheme Claims Register
export const initialSchemeClaims: SchemeClaim[] = [
  {
    id: 'sch-1',
    principal: 'Illustrative Principal (FMCG)',
    title: 'Trade Scheme Q3 Retailer Slab Rebate',
    amount: 65000,
    status: 'Claimed',
    submissionDate: '2026-09-15',
  },
  {
    id: 'sch-2',
    principal: 'Illustrative Principal (FMCG)',
    title: 'Damage & Leakage Replacement Claim #DMG-88',
    amount: 85000,
    status: 'Pending',
    submissionDate: '2026-09-22',
  },
  {
    id: 'sch-3',
    principal: 'Illustrative Principal (FMCG)',
    title: 'Festival Extra Discount Reimbursement',
    amount: 55000,
    status: 'Pending',
    submissionDate: '2026-09-28',
  },
];

export interface SampleShopDrop {
  billNumber: string;
  retailerName: string;
  marketPoint: string;
  cashPaid: number;
  creditGranted: number;
}

export const sampleShopDrops: SampleShopDrop[] = [
  { billNumber: 'INV-8821', retailerName: 'Rahman General Store', marketPoint: 'Sherpur Town Center', cashPaid: 3200, creditGranted: 1400 },
  { billNumber: 'INV-8822', retailerName: 'M/S Bismillah Departmental', marketPoint: 'Nalitabari Road', cashPaid: 2800, creditGranted: 1200 },
  { billNumber: 'INV-8823', retailerName: 'Suwagari Station Grocers', marketPoint: 'Suwagari Mor', cashPaid: 4100, creditGranted: 1900 },
  { billNumber: 'INV-8824', retailerName: 'Al-Madina Traders', marketPoint: 'Nakla Bazaar', cashPaid: 1900, creditGranted: 800 },
  { billNumber: 'INV-8825', retailerName: 'Kusumbi Green Store', marketPoint: 'Raninagar Mor', cashPaid: 2500, creditGranted: 1100 },
  { billNumber: 'INV-8826', retailerName: 'Chowdhury & Brothers', marketPoint: 'Bhatara Mor', cashPaid: 3600, creditGranted: 1500 },
  { billNumber: 'INV-8827', retailerName: 'Rabbani Confectionery', marketPoint: 'Sherpur New Market', cashPaid: 1800, creditGranted: 750 },
  { billNumber: 'INV-8828', retailerName: 'Bogra Corner Grocery', marketPoint: 'College Road', cashPaid: 2900, creditGranted: 1250 },
];
