// distroMesh Multi-Entity Operational Registry & Telemetry Data
// Provides verified, entity-isolated operational snapshots for all 5 distribution businesses
// plus consolidated portfolio-wide totals.

import { DailyPerformancePoint, DispatchReadinessStatus, RouteRecord } from './seedData';
import type { PortfolioSnapshot } from './portfolioDemo';

export interface BusinessOperationalSnapshot {
  id: string;
  name: string;
  shortName: string;
  industry: string;
  location: string;
  principals: string[];
  customerCount: number;
  employeeCount: number;
  vanCount: number;
  routesCount: number;
  
  // Financial parameters
  monthlyRevenue: number;
  monthlyNetProfit: number;
  netMarginPct: number;
  availableCash: number;
  bankCash: number;
  vaultCash: number;
  receivables: number;
  inventory: number;
  payables: number;
  unclaimedSchemes: number;
  nowc: number;
  
  // Debt & Solvency
  upcomingObligation: number;
  obligationDueHours: number;
  cashCoveragePct: number;
  postDebitBuffer: number;
  obligationPrincipal: string;

  // Field Execution & Dispatch
  onTimeDeliveryPct: number;
  dispatchTarget: string;
  dispatchActual: string;
  dispatchDelayMin: number;
  dispatchStatus: 'ON_TIME' | 'DELAYED' | 'CRITICAL';
  dispatchBottleneck: string;
  lostExecutionMinutes: number;

  // Daily Settlement & Exceptions
  expectedTill: number;
  countedTill: number;
  cashVariance: number;
  varianceRoute: string;
  responsiblePerson: string;
  freshCredit: number;
  todaySales: number;
  creditRatio: number;

  // Trends & Checklists
  sevenDayTrend: DailyPerformancePoint[];
  dispatchReadiness: DispatchReadinessStatus;
  routes: Array<{
    id: string;
    name: string;
    vehicle: string;
    jsrName: string;
    srName: string;
    deliveredSales: number;
    cashCollected: number;
    creditSales: number;
    variance: number;
    status: 'OK' | 'REVIEW' | 'ACTION';
  }>;
}

export const businessSnapshots: Record<string, BusinessOperationalSnapshot> = {
  // 1. M/S Popy Traders · FMCG Distribution (Primary Entity)
  'unilever-distribution': {
    id: 'unilever-distribution',
    name: 'M/S Popy Traders · FMCG Distribution',
    shortName: 'Popy Traders',
    industry: 'Fast-Moving Consumer Goods (Thin Margin)',
    location: 'Sherpur & Bogura Hub, Bangladesh',
    principals: ['Unilever BD', 'Pureit BD'],
    customerCount: 5760,
    employeeCount: 57,
    vanCount: 12,
    routesCount: 12,
    monthlyRevenue: 25000000,
    monthlyNetProfit: 373375,
    netMarginPct: 1.49,
    availableCash: 2742600, // Post-debit buffer intact
    bankCash: 2300000,
    vaultCash: 442600,
    receivables: 19726027,
    inventory: 15400000,
    payables: 21500000,
    unclaimedSchemes: 205000,
    nowc: 13831027,
    upcomingObligation: 2070000,
    obligationDueHours: 48,
    cashCoveragePct: 132.5,
    postDebitBuffer: 672600,
    obligationPrincipal: 'Unilever Bangladesh',
    onTimeDeliveryPct: 38,
    dispatchTarget: '09:00 AM',
    dispatchActual: '11:45 AM',
    dispatchDelayMin: 165,
    dispatchStatus: 'CRITICAL',
    dispatchBottleneck: 'Manual WhatsApp-based order entry (24 SRs at billing desk #1)',
    lostExecutionMinutes: 165,
    expectedTill: 443000,
    countedTill: 442600,
    cashVariance: -400,
    varianceRoute: 'Van #3 (Bogura Link)',
    responsiblePerson: 'Babul Hossain',
    freshCredit: 190000,
    todaySales: 480000,
    creditRatio: 39.6,
    sevenDayTrend: [
      { day: 'Sat', fullDay: 'Saturday',  cashSales: 310, creditSales: 170, totalSales: 480, collectionTarget: 420, collectionActual: 395, cashInflow: 410, cashOutflow: 315 },
      { day: 'Sun', fullDay: 'Sunday',    cashSales: 330, creditSales: 160, totalSales: 490, collectionTarget: 420, collectionActual: 425, cashInflow: 435, cashOutflow: 325 },
      { day: 'Mon', fullDay: 'Monday',    cashSales: 290, creditSales: 200, totalSales: 490, collectionTarget: 420, collectionActual: 380, cashInflow: 390, cashOutflow: 270 },
      { day: 'Tue', fullDay: 'Tuesday',   cashSales: 360, creditSales: 180, totalSales: 540, collectionTarget: 420, collectionActual: 430, cashInflow: 455, cashOutflow: 345 },
      { day: 'Wed', fullDay: 'Wednesday', cashSales: 325, creditSales: 195, totalSales: 520, collectionTarget: 420, collectionActual: 400, cashInflow: 420, cashOutflow: 310 },
      { day: 'Thu', fullDay: 'Thursday',  cashSales: 295, creditSales: 185, totalSales: 480, collectionTarget: 420, collectionActual: 390, cashInflow: 405, cashOutflow: 285 },
      { day: 'Fri', fullDay: 'Friday',    cashSales: 280, creditSales: 210, totalSales: 490, collectionTarget: 420, collectionActual: 435, cashInflow: 430, cashOutflow: 330 },
    ],
    dispatchReadiness: {
      countdownSeconds: 8100, // 02:15:00
      billingQueueDSRs: 24,
      invoiceProcessingPct: 68,
      dsrReadinessCurrent: 6,
      dsrReadinessTotal: 6,
      warehouseReady: true,
      routesClearedCurrent: 5,
      routesClearedTotal: 6,
    },
    routes: [
      { id: 'v1', name: 'Van #1 - Sherpur Sadar North', vehicle: 'Tata Ace (Dhaka Metro-U-11)', jsrName: 'Rafiqul Islam', srName: 'Tariqul Anam', deliveredSales: 92000, cashCollected: 88000, creditSales: 30000, variance: 0, status: 'OK' },
      { id: 'v2', name: 'Van #2 - Sherpur Bazar Core', vehicle: 'Mahindra Bolero', jsrName: 'Anisur Rahman', srName: 'Kazi Faruk', deliveredSales: 110000, cashCollected: 107000, creditSales: 35000, variance: 0, status: 'OK' },
      { id: 'v3', name: 'Van #3 - Bogura Link Road', vehicle: 'Tata Ace (Dhaka Metro-U-11-4092)', jsrName: 'Babul Hossain', srName: 'Mominul Haque', deliveredSales: 98000, cashCollected: 76000, creditSales: 46000, variance: -400, status: 'ACTION' },
      { id: 'v4', name: 'Van #4 - Mirzapur Rural', vehicle: 'Rickshaw Van #1', jsrName: 'Shafiqul Alam', srName: 'Zahid Hasan', deliveredSales: 68000, cashCollected: 56000, creditSales: 30000, variance: 0, status: 'REVIEW' },
      { id: 'v5', name: 'Van #5 - Garidaha Beat', vehicle: 'Tata Ace', jsrName: 'Abdul Mannan', srName: 'Nazmul Islam', deliveredSales: 84000, cashCollected: 78000, creditSales: 30000, variance: 0, status: 'OK' },
      { id: 'v6', name: 'Van #6 - Nalitabari Feeder', vehicle: 'Tata Ace', jsrName: 'Kamal Pasha', srName: 'Saiful Islam', deliveredSales: 78000, cashCollected: 72000, creditSales: 28000, variance: 0, status: 'OK' },
    ],
  },

  // 2. Pureit Distribution (Durables)
  'pureit-distribution': {
    id: 'pureit-distribution',
    name: 'Pureit Distribution (Durables)',
    shortName: 'Pureit BD',
    industry: 'Consumer Durables & Water Purification',
    location: 'Bogura Hub & Regional Service Depot',
    principals: ['Unilever Pureit'],
    customerCount: 320,
    employeeCount: 16,
    vanCount: 3,
    routesCount: 3,
    monthlyRevenue: 8400000,
    monthlyNetProfit: 714000,
    netMarginPct: 8.50,
    availableCash: 2100000,
    bankCash: 1450000,
    vaultCash: 650000,
    receivables: 3200000,
    inventory: 2800000,
    payables: 1850000,
    unclaimedSchemes: 180000,
    nowc: 4330000,
    upcomingObligation: 750000,
    obligationDueHours: 48,
    cashCoveragePct: 280.0,
    postDebitBuffer: 1350000,
    obligationPrincipal: 'Unilever Pureit Bangladesh',
    onTimeDeliveryPct: 91,
    dispatchTarget: '09:30 AM',
    dispatchActual: '09:40 AM',
    dispatchDelayMin: 10,
    dispatchStatus: 'ON_TIME',
    dispatchBottleneck: 'Technician tool check & warranty barcode sync (+10m)',
    lostExecutionMinutes: 10,
    expectedTill: 162000,
    countedTill: 162000,
    cashVariance: 0,
    varianceRoute: 'Van #1 (Bogura City & Service)',
    responsiblePerson: 'Kabir Tech',
    freshCredit: 48000,
    todaySales: 181000,
    creditRatio: 26.5,
    sevenDayTrend: [
      { day: 'Sat', fullDay: 'Saturday',  cashSales: 125, creditSales: 45, totalSales: 170, collectionTarget: 140, collectionActual: 142, cashInflow: 155, cashOutflow: 90 },
      { day: 'Sun', fullDay: 'Sunday',    cashSales: 135, creditSales: 40, totalSales: 175, collectionTarget: 140, collectionActual: 148, cashInflow: 160, cashOutflow: 95 },
      { day: 'Mon', fullDay: 'Monday',    cashSales: 120, creditSales: 55, totalSales: 175, collectionTarget: 140, collectionActual: 135, cashInflow: 145, cashOutflow: 85 },
      { day: 'Tue', fullDay: 'Tuesday',   cashSales: 145, creditSales: 50, totalSales: 195, collectionTarget: 140, collectionActual: 155, cashInflow: 170, cashOutflow: 105 },
      { day: 'Wed', fullDay: 'Wednesday', cashSales: 130, creditSales: 48, totalSales: 178, collectionTarget: 140, collectionActual: 142, cashInflow: 150, cashOutflow: 92 },
      { day: 'Thu', fullDay: 'Thursday',  cashSales: 115, creditSales: 42, totalSales: 157, collectionTarget: 140, collectionActual: 138, cashInflow: 142, cashOutflow: 88 },
      { day: 'Fri', fullDay: 'Friday',    cashSales: 133, creditSales: 48, totalSales: 181, collectionTarget: 140, collectionActual: 152, cashInflow: 162, cashOutflow: 98 },
    ],
    dispatchReadiness: {
      countdownSeconds: 3600, // 01:00:00
      billingQueueDSRs: 3,
      invoiceProcessingPct: 92,
      dsrReadinessCurrent: 3,
      dsrReadinessTotal: 3,
      warehouseReady: true,
      routesClearedCurrent: 3,
      routesClearedTotal: 3,
    },
    routes: [
      { id: 'pv1', name: 'Van #1 - Bogura Core & Dealerships', vehicle: 'Mahindra Cargo #88', jsrName: 'Kabir Tech', srName: 'Zubair Alom', deliveredSales: 82000, cashCollected: 64000, creditSales: 18000, variance: 0, status: 'OK' },
      { id: 'pv2', name: 'Van #2 - Sherpur Showroom Route', vehicle: 'Tata Ace Express', jsrName: 'Tanvir Hossain', srName: 'Rashedul', deliveredSales: 54000, cashCollected: 42000, creditSales: 16000, variance: 0, status: 'OK' },
      { id: 'pv3', name: 'Van #3 - Gaibandha Dealer Transit', vehicle: 'Tata Ace Extended', jsrName: 'Sohel Rana', srName: 'Nasir Uddin', deliveredSales: 45000, cashCollected: 38000, creditSales: 14000, variance: 0, status: 'OK' },
    ],
  },

  // 3. Sherpur Trade Distribution
  'sherpur-trade-distribution': {
    id: 'sherpur-trade-distribution',
    name: 'Sherpur Trade Distribution',
    shortName: 'Sherpur Trade',
    industry: 'Packaged Foods Distribution (FMCG)',
    location: 'Sherpur Sadar Hub, Bangladesh',
    principals: ['Olympic Industries', 'Local FMCG'],
    customerCount: 1420,
    employeeCount: 24,
    vanCount: 4,
    routesCount: 4,
    monthlyRevenue: 6200000,
    monthlyNetProfit: 111600,
    netMarginPct: 1.80,
    availableCash: 1450000,
    bankCash: 820000,
    vaultCash: 630000,
    receivables: 2100000,
    inventory: 1650000,
    payables: 1400000,
    unclaimedSchemes: 95000,
    nowc: 2445000,
    upcomingObligation: 580000,
    obligationDueHours: 48,
    cashCoveragePct: 250.0,
    postDebitBuffer: 870000,
    obligationPrincipal: 'Olympic Industries Ltd',
    onTimeDeliveryPct: 86,
    dispatchTarget: '08:45 AM',
    dispatchActual: '09:10 AM',
    dispatchDelayMin: 25,
    dispatchStatus: 'DELAYED',
    dispatchBottleneck: 'Loading dock carton cross-check (+25m)',
    lostExecutionMinutes: 25,
    expectedTill: 186000,
    countedTill: 185850,
    cashVariance: -150,
    varianceRoute: 'Van #2 (Bazaar Core)',
    responsiblePerson: 'Jalal Hossain',
    freshCredit: 74000,
    todaySales: 238000,
    creditRatio: 31.0,
    sevenDayTrend: [
      { day: 'Sat', fullDay: 'Saturday',  cashSales: 160, creditSales: 70, totalSales: 230, collectionTarget: 200, collectionActual: 195, cashInflow: 205, cashOutflow: 145 },
      { day: 'Sun', fullDay: 'Sunday',    cashSales: 170, creditSales: 68, totalSales: 238, collectionTarget: 200, collectionActual: 204, cashInflow: 215, cashOutflow: 150 },
      { day: 'Mon', fullDay: 'Monday',    cashSales: 155, creditSales: 80, totalSales: 235, collectionTarget: 200, collectionActual: 188, cashInflow: 195, cashOutflow: 135 },
      { day: 'Tue', fullDay: 'Tuesday',   cashSales: 180, creditSales: 76, totalSales: 256, collectionTarget: 200, collectionActual: 208, cashInflow: 220, cashOutflow: 160 },
      { day: 'Wed', fullDay: 'Wednesday', cashSales: 168, creditSales: 74, totalSales: 242, collectionTarget: 200, collectionActual: 198, cashInflow: 208, cashOutflow: 148 },
      { day: 'Thu', fullDay: 'Thursday',  cashSales: 152, creditSales: 70, totalSales: 222, collectionTarget: 200, collectionActual: 190, cashInflow: 198, cashOutflow: 140 },
      { day: 'Fri', fullDay: 'Friday',    cashSales: 164, creditSales: 74, totalSales: 238, collectionTarget: 200, collectionActual: 210, cashInflow: 214, cashOutflow: 152 },
    ],
    dispatchReadiness: {
      countdownSeconds: 5400,
      billingQueueDSRs: 4,
      invoiceProcessingPct: 84,
      dsrReadinessCurrent: 4,
      dsrReadinessTotal: 4,
      warehouseReady: true,
      routesClearedCurrent: 4,
      routesClearedTotal: 4,
    },
    routes: [
      { id: 'sv1', name: 'Van #1 - Sherpur Town Central', vehicle: 'Mahindra Maxx', jsrName: 'Enamul Haque', srName: 'Kamrul', deliveredSales: 74000, cashCollected: 58000, creditSales: 22000, variance: 0, status: 'OK' },
      { id: 'sv2', name: 'Van #2 - Sherpur Bazaar & Mills', vehicle: 'Tata Ace Super', jsrName: 'Jalal Hossain', srName: 'Shahinur', deliveredSales: 86000, cashCollected: 68000, creditSales: 26000, variance: -150, status: 'REVIEW' },
      { id: 'sv3', name: 'Van #3 - Nakla Link Beat', vehicle: 'Tata Ace', jsrName: 'Mizanur Rahman', srName: 'Liton', deliveredSales: 48000, cashCollected: 38000, creditSales: 16000, variance: 0, status: 'OK' },
      { id: 'sv4', name: 'Van #4 - Jhenaigati Rural', vehicle: 'Rickshaw Van #2', jsrName: 'Habibur', srName: 'Masum', deliveredSales: 30000, cashCollected: 24000, creditSales: 10000, variance: 0, status: 'OK' },
    ],
  },

  // 4. Bogura Retail Distribution
  'bogura-retail-distribution': {
    id: 'bogura-retail-distribution',
    name: 'Bogura Retail Distribution',
    shortName: 'Bogura Retail',
    industry: 'Household Essentials & FMCG',
    location: 'Bogura Town & Suburban Beats',
    principals: ['Square Consumer Products'],
    customerCount: 980,
    employeeCount: 18,
    vanCount: 3,
    routesCount: 3,
    monthlyRevenue: 5200000,
    monthlyNetProfit: 98800,
    netMarginPct: 1.90,
    availableCash: 980000,
    bankCash: 540000,
    vaultCash: 440000,
    receivables: 1650000,
    inventory: 1420000,
    payables: 1180000,
    unclaimedSchemes: 65000,
    nowc: 1955000,
    upcomingObligation: 460000,
    obligationDueHours: 48,
    cashCoveragePct: 213.0,
    postDebitBuffer: 520000,
    obligationPrincipal: 'Square Toiletries / Consumer',
    onTimeDeliveryPct: 82,
    dispatchTarget: '09:00 AM',
    dispatchActual: '09:35 AM',
    dispatchDelayMin: 35,
    dispatchStatus: 'DELAYED',
    dispatchBottleneck: 'Route sheet signature delay (+35m)',
    lostExecutionMinutes: 35,
    expectedTill: 154000,
    countedTill: 154000,
    cashVariance: 0,
    varianceRoute: 'Van #3 (Sutrapur Core)',
    responsiblePerson: 'Shafiqul',
    freshCredit: 71000,
    todaySales: 198000,
    creditRatio: 35.8,
    sevenDayTrend: [
      { day: 'Sat', fullDay: 'Saturday',  cashSales: 130, creditSales: 62, totalSales: 192, collectionTarget: 170, collectionActual: 165, cashInflow: 172, cashOutflow: 120 },
      { day: 'Sun', fullDay: 'Sunday',    cashSales: 138, creditSales: 60, totalSales: 198, collectionTarget: 170, collectionActual: 172, cashInflow: 180, cashOutflow: 125 },
      { day: 'Mon', fullDay: 'Monday',    cashSales: 124, creditSales: 72, totalSales: 196, collectionTarget: 170, collectionActual: 158, cashInflow: 162, cashOutflow: 115 },
      { day: 'Tue', fullDay: 'Tuesday',   cashSales: 148, creditSales: 68, totalSales: 216, collectionTarget: 170, collectionActual: 175, cashInflow: 185, cashOutflow: 130 },
      { day: 'Wed', fullDay: 'Wednesday', cashSales: 136, creditSales: 65, totalSales: 201, collectionTarget: 170, collectionActual: 168, cashInflow: 175, cashOutflow: 122 },
      { day: 'Thu', fullDay: 'Thursday',  cashSales: 120, creditSales: 64, totalSales: 184, collectionTarget: 170, collectionActual: 160, cashInflow: 166, cashOutflow: 118 },
      { day: 'Fri', fullDay: 'Friday',    cashSales: 127, creditSales: 71, totalSales: 198, collectionTarget: 170, collectionActual: 174, cashInflow: 178, cashOutflow: 126 },
    ],
    dispatchReadiness: {
      countdownSeconds: 4500,
      billingQueueDSRs: 3,
      invoiceProcessingPct: 78,
      dsrReadinessCurrent: 3,
      dsrReadinessTotal: 3,
      warehouseReady: true,
      routesClearedCurrent: 2,
      routesClearedTotal: 3,
    },
    routes: [
      { id: 'bv1', name: 'Van #1 - Sutrapur & Jaleshwaritola', vehicle: 'Tata Ace Euro', jsrName: 'Shafiqul', srName: 'Al-Amin', deliveredSales: 78000, cashCollected: 58000, creditSales: 28000, variance: 0, status: 'OK' },
      { id: 'bv2', name: 'Van #2 - Colony & Station Road', vehicle: 'Mahindra Bolero', jsrName: 'Monirul Islam', srName: 'Ariful', deliveredSales: 68000, cashCollected: 52000, creditSales: 24000, variance: 0, status: 'OK' },
      { id: 'bv3', name: 'Van #3 - Thanthania & Highway', vehicle: 'Tata Ace Mini', jsrName: 'Delwar Hossain', srName: 'Belal', deliveredSales: 52000, cashCollected: 44000, creditSales: 19000, variance: 0, status: 'OK' },
    ],
  },

  // 5. Freshway Consumer Distribution
  'freshway-distribution': {
    id: 'freshway-distribution',
    name: 'Freshway Consumer Distribution',
    shortName: 'Freshway Mymensingh',
    industry: 'Food & Beverage FMCG',
    location: 'Mymensingh Regional Depot',
    principals: ['Pran Foods & Beverage'],
    customerCount: 1650,
    employeeCount: 28,
    vanCount: 5,
    routesCount: 5,
    monthlyRevenue: 7100000,
    monthlyNetProfit: 127800,
    netMarginPct: 1.80,
    availableCash: 1850000,
    bankCash: 1100000,
    vaultCash: 750000,
    receivables: 2450000,
    inventory: 1900000,
    payables: 1620000,
    unclaimedSchemes: 110000,
    nowc: 2840000,
    upcomingObligation: 620000,
    obligationDueHours: 48,
    cashCoveragePct: 298.4,
    postDebitBuffer: 1230000,
    obligationPrincipal: 'Pran-RFL Group',
    onTimeDeliveryPct: 89,
    dispatchTarget: '08:30 AM',
    dispatchActual: '08:45 AM',
    dispatchDelayMin: 15,
    dispatchStatus: 'ON_TIME',
    dispatchBottleneck: 'Early morning dock gate departure (+15m)',
    lostExecutionMinutes: 15,
    expectedTill: 224000,
    countedTill: 224050,
    cashVariance: 50,
    varianceRoute: 'Van #1 (Mymensingh Town Core)',
    responsiblePerson: 'Ratan Saha',
    freshCredit: 77000,
    todaySales: 271000,
    creditRatio: 28.4,
    sevenDayTrend: [
      { day: 'Sat', fullDay: 'Saturday',  cashSales: 180, creditSales: 75, totalSales: 255, collectionTarget: 225, collectionActual: 228, cashInflow: 235, cashOutflow: 165 },
      { day: 'Sun', fullDay: 'Sunday',    cashSales: 192, creditSales: 72, totalSales: 264, collectionTarget: 225, collectionActual: 232, cashInflow: 242, cashOutflow: 170 },
      { day: 'Mon', fullDay: 'Monday',    cashSales: 175, creditSales: 88, totalSales: 263, collectionTarget: 225, collectionActual: 218, cashInflow: 225, cashOutflow: 155 },
      { day: 'Tue', fullDay: 'Tuesday',   cashSales: 205, creditSales: 82, totalSales: 287, collectionTarget: 225, collectionActual: 235, cashInflow: 250, cashOutflow: 180 },
      { day: 'Wed', fullDay: 'Wednesday', cashSales: 190, creditSales: 78, totalSales: 268, collectionTarget: 225, collectionActual: 224, cashInflow: 238, cashOutflow: 168 },
      { day: 'Thu', fullDay: 'Thursday',  cashSales: 172, creditSales: 74, totalSales: 246, collectionTarget: 225, collectionActual: 216, cashInflow: 224, cashOutflow: 158 },
      { day: 'Fri', fullDay: 'Friday',    cashSales: 194, creditSales: 77, totalSales: 271, collectionTarget: 225, collectionActual: 238, cashInflow: 245, cashOutflow: 172 },
    ],
    dispatchReadiness: {
      countdownSeconds: 4800,
      billingQueueDSRs: 5,
      invoiceProcessingPct: 88,
      dsrReadinessCurrent: 5,
      dsrReadinessTotal: 5,
      warehouseReady: true,
      routesClearedCurrent: 5,
      routesClearedTotal: 5,
    },
    routes: [
      { id: 'fv1', name: 'Van #1 - Mymensingh Ganginarpar Core', vehicle: 'Tata Ace Gold', jsrName: 'Ratan Saha', srName: 'Biplob', deliveredSales: 88000, cashCollected: 72000, creditSales: 24000, variance: 50, status: 'OK' },
      { id: 'fv2', name: 'Van #2 - Choto Bazaar & Station', vehicle: 'Mahindra Bolero Maxi', jsrName: 'Mukul Mia', srName: 'Faruque', deliveredSales: 72000, cashCollected: 58000, creditSales: 20000, variance: 0, status: 'OK' },
      { id: 'fv3', name: 'Van #3 - Trishal Feeder Route', vehicle: 'Tata Ace', jsrName: 'Habibur Rahman', srName: 'Ashraful', deliveredSales: 54000, cashCollected: 42000, creditSales: 16000, variance: 0, status: 'OK' },
      { id: 'fv4', name: 'Van #4 - Muktagacha Beat', vehicle: 'Tata Ace Express', jsrName: 'Shahinur Islam', srName: 'Mehedi', deliveredSales: 38000, cashCollected: 32000, creditSales: 10000, variance: 0, status: 'OK' },
      { id: 'fv5', name: 'Van #5 - Bhaluka Highway Transit', vehicle: 'Rickshaw Cargo', jsrName: 'Nurul Islam', srName: 'Jahangir', deliveredSales: 19000, cashCollected: 16000, creditSales: 7000, variance: 0, status: 'OK' },
    ],
  },
};

// Consolidated Portfolio Total (Combined Empire)
export const portfolioConsolidatedSnapshot: BusinessOperationalSnapshot = {
  id: 'all',
  name: 'Distribution Mesh Portfolio (Consolidated Empire)',
  shortName: 'Combined Empire',
  industry: 'Multi-Principal Regional Distribution Network',
  location: 'Sherpur, Bogura, Mymensingh & North Bengal',
  principals: ['Unilever BD', 'Pureit', 'Olympic Industries', 'Square Consumer', 'Pran Foods'],
  customerCount: 10130,
  employeeCount: 143,
  vanCount: 27,
  routesCount: 27,
  monthlyRevenue: 51900000, // ৳5.19 Cr
  monthlyNetProfit: 1425575, // Blended 2.75%
  netMarginPct: 2.75,
  availableCash: 9122600, // Combined liquid cash
  bankCash: 6210000,
  vaultCash: 2912600,
  receivables: 29126027,
  inventory: 23170000,
  payables: 27550000,
  unclaimedSchemes: 655000,
  nowc: 25401027,
  upcomingObligation: 4480000,
  obligationDueHours: 48,
  cashCoveragePct: 203.6,
  postDebitBuffer: 4642600,
  obligationPrincipal: 'All 5 Principals Combined',
  onTimeDeliveryPct: 77,
  dispatchTarget: '08:30–09:30 AM',
  dispatchActual: 'Varies by Depot',
  dispatchDelayMin: 48,
  dispatchStatus: 'DELAYED',
  dispatchBottleneck: 'FMCG billing desk jam in Popy Traders; other 4 depots normal',
  lostExecutionMinutes: 245,
  expectedTill: 1169000,
  countedTill: 1168500,
  cashVariance: -500,
  varianceRoute: 'Cross-Depot Net Variance',
  responsiblePerson: 'Consolidated Cashier Audit',
  freshCredit: 460000,
  todaySales: 1368000,
  creditRatio: 33.6,
  sevenDayTrend: [
    { day: 'Sat', fullDay: 'Saturday',  cashSales: 905, creditSales: 422, totalSales: 1327, collectionTarget: 1155, collectionActual: 1125, cashInflow: 1177, cashOutflow: 830 },
    { day: 'Sun', fullDay: 'Sunday',    cashSales: 965, creditSales: 400, totalSales: 1365, collectionTarget: 1155, collectionActual: 1181, cashInflow: 1232, cashOutflow: 865 },
    { day: 'Mon', fullDay: 'Monday',    cashSales: 864, creditSales: 495, totalSales: 1359, collectionTarget: 1155, collectionActual: 1079, cashInflow: 1117, cashOutflow: 755 },
    { day: 'Tue', fullDay: 'Tuesday',   cashSales: 1041, creditSales: 456, totalSales: 1497, collectionTarget: 1155, collectionActual: 1198, cashInflow: 1280, cashOutflow: 920 },
    { day: 'Wed', fullDay: 'Wednesday', cashSales: 949, creditSales: 460, totalSales: 1409, collectionTarget: 1155, collectionActual: 1132, cashInflow: 1191, cashOutflow: 840 },
    { day: 'Thu', fullDay: 'Thursday',  cashSales: 854, creditSales: 435, totalSales: 1289, collectionTarget: 1155, collectionActual: 1094, cashInflow: 1135, cashOutflow: 789 },
    { day: 'Fri', fullDay: 'Friday',    cashSales: 892, creditSales: 480, totalSales: 1378, collectionTarget: 1155, collectionActual: 1209, cashInflow: 1229, cashOutflow: 878 },
  ],
  dispatchReadiness: {
    countdownSeconds: 8100,
    billingQueueDSRs: 39,
    invoiceProcessingPct: 82,
    dsrReadinessCurrent: 21,
    dsrReadinessTotal: 22,
    warehouseReady: true,
    routesClearedCurrent: 20,
    routesClearedTotal: 22,
  },
  routes: [
    { id: 'all-1', name: 'Popy Traders Hub (12 Vans)', vehicle: '12 Delivery Vans', jsrName: '12 Delivery Men', srName: '24 Sales Reps', deliveredSales: 480000, cashCollected: 442600, creditSales: 190000, variance: -400, status: 'ACTION' },
    { id: 'all-2', name: 'Pureit Bogura Hub (3 Vans)', vehicle: '3 Cargo Express', jsrName: '3 Technicians', srName: '3 Sales Reps', deliveredSales: 181000, cashCollected: 162000, creditSales: 48000, variance: 0, status: 'OK' },
    { id: 'all-3', name: 'Sherpur Trade (4 Vans)', vehicle: '4 Light Cargo', jsrName: '4 Delivery Men', srName: '4 Sales Reps', deliveredSales: 238000, cashCollected: 185850, creditSales: 74000, variance: -150, status: 'REVIEW' },
    { id: 'all-4', name: 'Bogura Retail (3 Vans)', vehicle: '3 Vans', jsrName: '3 Delivery Men', srName: '3 Sales Reps', deliveredSales: 198000, cashCollected: 154000, creditSales: 71000, variance: 0, status: 'OK' },
    { id: 'all-5', name: 'Freshway Mymensingh (5 Vans)', vehicle: '5 Cargo Vans', jsrName: '5 Delivery Men', srName: '5 Sales Reps', deliveredSales: 271000, cashCollected: 224050, creditSales: 77000, variance: 50, status: 'OK' },
  ],
};

export const getBusinessOperationalSnapshot = (businessId: string): BusinessOperationalSnapshot => {
  if (businessId === 'all') {
    return portfolioConsolidatedSnapshot;
  }
  return businessSnapshots[businessId] || businessSnapshots['unilever-distribution'];
};

export const getEntityPortfolioSnapshot = (businessId: string): PortfolioSnapshot => {
  const snap = getBusinessOperationalSnapshot(businessId);
  const rev = snap.monthlyRevenue;
  const isPureit = businessId === 'pureit-distribution';
  
  // Gross margin calibrated to product category: durables (18%) vs FMCG (5.5%)
  const grossMarginRate = isPureit ? 0.18 : 0.055;
  const grossProfit = Math.round(rev * grossMarginRate);
  const cogs = rev - grossProfit;
  const deliveryCost = Math.round(rev * (isPureit ? 0.028 : 0.015));
  const overhead = Math.round(rev * (isPureit ? 0.038 : 0.016));
  const ebit = grossProfit - deliveryCost - overhead;
  const interest = Math.round(ebit * 0.14);
  const tax = Math.round(ebit * 0.11);
  const netProfit = snap.monthlyNetProfit;

  // Working capital days
  const dso = rev > 0 ? (snap.receivables / rev) * 30 : 24;
  const dio = cogs > 0 ? (snap.inventory / cogs) * 30 : 18.5;
  const dpo = cogs > 0 ? (snap.payables / cogs) * 30 : 25.8;
  const ccc = dso + dio - dpo;

  const dailyCashSales = Math.max(0, snap.todaySales - snap.freshCredit);
  const dailyOldDues = Math.round(snap.todaySales * 0.18);
  const dailyOutflow = Math.round(dailyCashSales * 0.07);
  const dailyNetCashAdded = dailyCashSales + dailyOldDues - dailyOutflow;

  return {
    share: 100,
    monthlyUnits: Math.round(rev / 125),
    monthlyRevenue: rev,
    monthlyCogs: cogs,
    monthlyGrossProfit: grossProfit,
    monthlyDeliveryCost: deliveryCost,
    monthlyFixedOverhead: overhead,
    monthlyEbit: ebit,
    monthlyInterest: interest,
    monthlyTax: tax,
    monthlyNetProfit: netProfit,
    receivables: snap.receivables,
    averageInventory: snap.inventory,
    payables: snap.payables,
    unclaimedSchemes: snap.unclaimedSchemes,
    damageClaimsPending: Math.round(snap.unclaimedSchemes * 0.35),
    netOperatingWorkingCapital: snap.nowc,
    bankCash: snap.bankCash,
    vaultCash: snap.vaultCash,
    liquidCash: snap.availableCash,
    plannedDepositTonight: Math.round(snap.countedTill * 0.85),
    upcomingObligation: snap.upcomingObligation,
    next7DayObligations: Math.round(snap.upcomingObligation * 2.5),
    dailyDeliveredSales: snap.todaySales,
    dailyCashSales: dailyCashSales,
    dailyFreshCredit: snap.freshCredit,
    dailyOldDuesCollected: dailyOldDues,
    dailyCashOutflow: dailyOutflow,
    dailyNetCashAdded: dailyNetCashAdded,
    expectedTillCash: snap.expectedTill,
    countedTillCash: snap.countedTill,
    cashVariance: snap.cashVariance,
    dso: Number(dso.toFixed(1)),
    dio: Number(dio.toFixed(1)),
    dpo: Number(dpo.toFixed(1)),
    cashConversionCycle: Number(ccc.toFixed(1)),
  };
};

