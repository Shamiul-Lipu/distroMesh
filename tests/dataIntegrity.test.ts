import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  popyMonthlyParameters,
  popyTodaySnapshot,
  popy12Routes,
  popyFieldBase,
} from '../src/data/seedData.ts';
import {
  deriveLiquidityStatus,
  deriveDispatchMetrics,
  deriveRouteStatus,
  deriveMispickLoss,
  deriveReceivablesAgeing,
  deriveBusinessKPISet,
} from '../src/utils/derivedRules.ts';
import {
  formatBDT,
  formatVariance,
  formatPercent,
  toBanglaNumeral,
} from '../src/utils/formatters.ts';

describe('Data Integrity & Mathematical Identities (Section 4.3)', () => {
  it('Identity 1: Delivered sales = cash sales + credit sales (per route and in total)', () => {
    let totalDelivered = 0;
    let totalCash = 0;
    let totalCredit = 0;

    for (const route of popy12Routes) {
      assert.strictEqual(
        route.deliveredSales,
        route.cashSales + route.creditSales,
        `Route ${route.id} delivered sales identity failed`
      );
      totalDelivered += route.deliveredSales;
      totalCash += route.cashSales;
      totalCredit += route.creditSales;
    }

    assert.strictEqual(totalDelivered, popyTodaySnapshot.deliveredSales);
    assert.strictEqual(totalCash, popyTodaySnapshot.cashSales);
    assert.strictEqual(totalCredit, popyTodaySnapshot.creditSales);
    assert.strictEqual(totalDelivered, totalCash + totalCredit);
  });

  it('Identity 2: Cash handed in = cash sales + old dues collected (per route and in total)', () => {
    let totalHandedIn = 0;
    let totalOldDues = 0;

    for (const route of popy12Routes) {
      assert.strictEqual(
        route.cashHandedIn,
        route.cashSales + route.oldDuesCollected,
        `Route ${route.id} cash handed in identity failed`
      );
      totalHandedIn += route.cashHandedIn;
      totalOldDues += route.oldDuesCollected;
    }

    assert.strictEqual(totalHandedIn, popyTodaySnapshot.cashHandedIn);
    assert.strictEqual(totalOldDues, popyTodaySnapshot.oldDuesCollected);
    assert.strictEqual(totalHandedIn, popyTodaySnapshot.cashSales + totalOldDues);
  });

  it('Identity 3: Expected till = opening float + cash handed in − cash expenses', () => {
    let totalExpenses = 0;
    for (const route of popy12Routes) {
      totalExpenses += route.cashExpenses;
    }
    assert.strictEqual(totalExpenses, popyTodaySnapshot.routeCashExpenses);

    const calculatedExpectedTill =
      popyTodaySnapshot.openingFloat + popyTodaySnapshot.cashHandedIn - popyTodaySnapshot.routeCashExpenses;
    assert.strictEqual(calculatedExpectedTill, popyTodaySnapshot.expectedTill);
  });

  it('Identity 4: Variance = counted − expected. Per-route variances sum to the total', () => {
    let sumRouteVariances = 0;
    for (const route of popy12Routes) {
      const routeVariance = route.countedTill - route.expectedTill;
      assert.strictEqual(route.variance, routeVariance);
      sumRouteVariances += route.variance;
    }

    assert.strictEqual(sumRouteVariances, popyTodaySnapshot.variance);
    assert.strictEqual(popyTodaySnapshot.countedTill - popyTodaySnapshot.expectedTill, popyTodaySnapshot.variance);
    assert.strictEqual(popyTodaySnapshot.variance, -400); // Van #3 shortage of 400
  });

  it('Identity 5: Credit share = credit sales ÷ delivered sales', () => {
    const calculatedCreditShare = popyTodaySnapshot.creditSales / popyTodaySnapshot.deliveredSales;
    assert.strictEqual(Number((calculatedCreditShare * 100).toFixed(2)), 39.58);
  });

  it('Identity 6: Vault cash is NOT in bank until a deposit posts', () => {
    const bankPreDeposit = popyTodaySnapshot.bankAfterDebit;
    const vaultTillCash = popyTodaySnapshot.vaultCash;
    const combinedLiquid = bankPreDeposit + vaultTillCash;

    assert.strictEqual(bankPreDeposit, 800000);
    assert.strictEqual(vaultTillCash, 895200);
    assert.strictEqual(combinedLiquid, 1695200);
    // Vault cash is distinct; planned deposit tonight is ৳8,00,000 in transit
    assert.strictEqual(popyTodaySnapshot.plannedDepositTonight, 800000);
  });

  it('Identity 7: Receivables roll-forward consistency', () => {
    const openingReceivables = popyMonthlyParameters.receivables;
    const creditSalesToday = popyTodaySnapshot.creditSales;
    const oldDuesToday = popyTodaySnapshot.oldDuesCollected;
    const creditNotes = 0;
    const closingReceivables = openingReceivables + creditSalesToday - oldDuesToday - creditNotes;

    assert.strictEqual(closingReceivables, openingReceivables + (380000 - 280000));
  });

  it('Identity 8: Net operating working capital formula', () => {
    // Net operating working capital = receivables + inventory + claims receivable − supplier payables
    const totalClaims = popyMonthlyParameters.schemeClaimsPending + popyMonthlyParameters.damageClaimsPending;
    const calculatedNOWC =
      popyMonthlyParameters.receivables +
      popyMonthlyParameters.inventory +
      totalClaims -
      popyMonthlyParameters.payables;

    assert.ok(calculatedNOWC > 0);
  });

  it('Identity 9: Monthly P&L lines sum to net profit; invoices per month = daily * 26', () => {
    const p = popyMonthlyParameters;
    assert.strictEqual(p.revenue - p.cogs, p.grossProfit);
    assert.strictEqual(p.grossProfit - (p.variableCost + p.fixedCost), p.ebit);
    assert.strictEqual(p.ebit - p.interest, p.profitBeforeTax);
    assert.strictEqual(p.profitBeforeTax - p.tax, p.netProfit);
    assert.strictEqual(p.netProfit, 373375);

    const netMarginPercent = (p.netProfit / p.revenue) * 100;
    assert.ok(netMarginPercent >= 1.0 && netMarginPercent <= 2.0, `Net margin ${netMarginPercent}% is outside 1.0-2.0%`);
    assert.strictEqual(popyFieldBase.dailyInvoices * p.workingDays, 18720);
  });

  it('Identity 10: Payroll <= operating costs; headcount = 57', () => {
    const totalOperatingCosts = popyMonthlyParameters.variableCost + popyMonthlyParameters.fixedCost; // ৳9,90,000
    assert.ok(
      popyMonthlyParameters.payrollMonthly <= totalOperatingCosts,
      `Payroll ${popyMonthlyParameters.payrollMonthly} exceeds operating costs ${totalOperatingCosts}`
    );
    assert.strictEqual(popyMonthlyParameters.headcount.total, 57);
    assert.strictEqual(popyMonthlyParameters.payrollMonthly, 562000);
  });
});

describe('Derived Rules Tests (Section 6 & 9)', () => {
  it('6.1 Liquidity status: SAFE for seed, WATCH on lower bank buffer, CRITICAL on negative/shortfall', () => {
    const safeResult = deriveLiquidityStatus({
      bankAfterDebit: 800000,
      vaultCash: 895200,
      next7DayObligations: 782000,
    });
    // Coverage = 16,95,200 / 7,82,000 = 2.17x (>=1.5), Bank-only = 8,00,000 / 7,82,000 = 1.02x (>=1.0) -> SAFE
    assert.strictEqual(safeResult.status, 'SAFE');
    assert.strictEqual(safeResult.coverage, 2.17);
    assert.strictEqual(safeResult.bankOnlyCoverage, 1.02);

    const watchResult = deriveLiquidityStatus({
      bankAfterDebit: 700000,
      vaultCash: 895200,
      next7DayObligations: 782000,
    });
    assert.strictEqual(watchResult.status, 'WATCH');

    const criticalResult = deriveLiquidityStatus({
      bankAfterDebit: -200000,
      vaultCash: 100000,
      next7DayObligations: 782000,
    });
    assert.strictEqual(criticalResult.status, 'CRITICAL');
    assert.ok(criticalResult.dailyOverdraftInterest > 0);
  });

  it('6.2 Dispatch metrics: 165 min, 1,980 van-minutes, ≈ ৳4,950 idle crew cost', () => {
    const dispatch = deriveDispatchMetrics({
      targetTime: '09:00',
      actualTime: '11:45',
      vansDispatched: 12,
      crewDailyWage: 1200,
    });
    assert.strictEqual(dispatch.delayMinutes, 165);
    assert.strictEqual(dispatch.vanMinutesLost, 1980);
    assert.strictEqual(dispatch.idleCrewCost, 4950);
    assert.strictEqual(dispatch.status, 'FAILED');
  });

  it('6.3 Route status: non-OK routes have mandatory reason string', () => {
    const van3 = popy12Routes.find((r) => r.id === 'van-3')!;
    const status3 = deriveRouteStatus(van3);
    assert.strictEqual(status3.status, 'REVIEW');
    assert.ok(status3.reason.length > 0);

    const van1 = popy12Routes.find((r) => r.id === 'van-1')!;
    const status1 = deriveRouteStatus(van1);
    assert.strictEqual(status1.status, 'OK');
  });

  it('6.6 Mispick loss: loss per unit ৳41.46, today loss ৳2,488, payback 2.8 days', () => {
    const mispick = deriveMispickLoss();
    assert.strictEqual(mispick.lossPerUnit, 41.46);
    assert.strictEqual(mispick.todayLossBDT, 2488);
    assert.strictEqual(mispick.paybackDays, 2.8);
    assert.ok(mispick.formula.includes('2.8 days'));
  });

  it('6.7 Receivables ageing: overdue > 30 days is 18.0%', () => {
    const ageing = deriveReceivablesAgeing();
    assert.strictEqual(ageing.overdue30PlusPercent, 18.0);
    assert.strictEqual(ageing.buckets.length, 5);
  });

  it('Section F Missing KPIs derived correctly', () => {
    const kpis = deriveBusinessKPISet();
    assert.strictEqual(kpis.strikeRate, 75.0);
    assert.strictEqual(kpis.cashConversionCycleDays, 16);
    assert.strictEqual(kpis.breakEvenMonthlyUnits, 90741);
    assert.strictEqual(kpis.schemeClaimsPending, 120000);
    assert.strictEqual(kpis.damageClaimsPending, 85000);
  });
});

describe('Formatting Module Tests (Section 8 & D1)', () => {
  it('Exact mode formats exact taka with Indian grouping', () => {
    assert.strictEqual(formatBDT(895200, { mode: 'exact' }), '৳8,95,200');
    assert.strictEqual(formatBDT(25000000, { mode: 'exact' }), '৳2,50,00,000');
  });

  it('Negative values format with minus sign prefix −৳', () => {
    assert.strictEqual(formatBDT(-400, { mode: 'exact' }), '−৳400');
    assert.strictEqual(formatVariance(-400), '−৳400');
    assert.strictEqual(formatVariance(0), '৳0');
  });

  it('Summary mode allows L and Cr only; NO K or M', () => {
    const crResult = formatBDT(19726027, { mode: 'summary' });
    const lResult = formatBDT(1695200, { mode: 'summary' });
    assert.strictEqual(crResult, '৳1.97 Cr');
    assert.strictEqual(lResult, '৳17.0 L'); // 16.95L -> 17.0L
    assert.ok(!crResult.includes('M') && !crResult.includes('K'));
    assert.ok(!lResult.includes('M') && !lResult.includes('K'));
  });

  it('Bangla numeral and toggle works correctly', () => {
    assert.strictEqual(toBanglaNumeral('895200'), '৮৯৫২০০');
    const banglaExact = formatBDT(895200, { mode: 'exact', bangla: true });
    assert.strictEqual(banglaExact, '৳৮,৯৫,২০০');
    const banglaPercent = formatPercent(18.0, 1, true);
    assert.strictEqual(banglaPercent, '১৮.০%');
  });
});
