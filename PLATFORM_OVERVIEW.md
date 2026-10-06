# distroMesh: Platform Overview

## Executive Summary & Purpose

**distroMesh** is an institutional-grade financial intelligence and operations command platform tailored for fast-moving consumer goods (FMCG) distribution houses, regional wholesalers, and multi-entity distribution conglomerates.

In high-velocity FMCG distribution, distributors operate on razor-thin net margins (1.0%–2.0%), cycle crores of taka in working capital, handle complex daily cash sweeps across dozens of van routes, and navigate strict 48-hour auto-debit obligations from multinational principals (such as Unilever Bangladesh). 

distroMesh bridges the gap between high-level executive portfolio governance and granular warehouse floor execution:
1. **Portfolio Governance**: Aggregates disparate businesses (FMCG distributorships, flour mills, beverage logistics, agro-trade) into a unified executive cockpit while strictly isolating ledgers, balances, and legal entities.
2. **Operations War Room**: Delivers a high-density, real-time command center (`/war-room`) featuring a 12-route van settlement ledger, invoice-level retail shop drill-downs, Net Operating Working Capital (NOWC) waterfalls, receivables ageing distribution, and hardware bottleneck economics.
3. **Data Integrity & Reconciled Identities**: Enforces mathematical zero-leakage accounting across sales, cash collections, credit allocations, expense vouchers, and vault counts.

---

## Flagship Implementation: M/S Popy Traders

The reference deployment represents **M/S Popy Traders**, an exclusive tier-1 Unilever distribution house operating across the **Sherpur & Bogura Hubs** in northern Bangladesh.

### Reconciled Baseline Telemetry (Daily Cycle)
- **Delivered Gross Sales**: ৳9,60,000 across 12 delivery beats, 6 distribution vans, 700 retail drops, and 7,997 physical cases/units (average drop size: ৳1,333).
- **Settlement Composition**:
  - **Cash Sales Collected**: ৳5,80,000 (60.4% cash conversion).
  - **Fresh Market Credit Extended**: ৳3,80,000 (39.6% credit share; within policy ceiling of $\le 45.0\%$).
  - **Old Market Dues Collected**: ৳2,80,000.
  - **Total Cash Handed In by JSRs**: ৳8,60,000 ($\text{Cash Sales } ৳5,80,000 + \text{Old Dues } ৳2,80,000$).
  - **Cash Expenses Incurred**: ৳14,400 (fuel, labor, toll vouchers).
  - **Opening Cash Float**: ৳50,000.
  - **Expected Cash in Till**: ৳8,95,600 ($\text{Float } ৳50,000 + \text{Handed In } ৳8,60,000 - \text{Expenses } ৳14,400$).
  - **Counted Vault Till**: ৳8,95,200.
  - **Till Variance**: **−৳400** (audit exception flagged on Van #3 / Route 103 JSR Babul).
- **Liquidity & Working Capital**:
  - **Total Liquid Cash**: ৳16,95,200 (Bank balance ৳8,00,000 at Islami Bank + Counted Vault Cash ৳8,95,200).
  - **Upcoming Principal Obligation**: ৳54,00,000 auto-debit due in 48 hours to Unilever Bangladesh.
  - **Trade Receivables**: ৳1,97,00,000 (overdue > 30 days: ৳35,50,685 / 18.0%).
  - **Warehouse Inventory**: ৳1,54,00,000 (closing stock valuation; 18.5 days of sales cover).
  - **Pending Scheme Claims**: ৳2,05,000 (promotional rebates due from principal).
  - **Trade Payables to Principal**: ৳2,15,00,000.
  - **Net Operating Working Capital (NOWC)**: **৳1,37,00,000** ($\text{Receivables} + \text{Inventory} + \text{Claims} - \text{Payables}$).
  - **Cash Conversion Cycle (CCC)**: **16.0 days**.
- **Monthly Enterprise Economics**:
  - **Monthly Turnover**: ৳2,50,00,000 (26 operating days; ~18,720 shop invoices).
  - **Gross Margin**: 4.20% (৳10,50,000).
  - **Operating Costs**: ৳6,00,000/month (Headcount: 57 personnel; Payroll: ৳4,05,000/month).
  - **Financing Costs**: ৳77,500/month.
  - **Net Operating Profit**: **৳3,72,500/month** (**1.49% Net Margin**).

---

## Core Platform Capabilities

### 1. Multi-Business Portfolio Mesh (`/businesses`)
- **Portfolio-Wide Health Scan**: Consolidates multiple operating units (e.g., M/S Popy Traders, Haji & Sons Flour Mill, Bengal Beverage Ltd., Padma Agro Trade, North Bengal Logistics).
- **Clear Demarcation of Missing Coverage**: Distinguishes true measured zeros from missing data streams.
- **Side-by-Side Business Comparisons**: Benchmarks liquidity cushions, credit exposure ratios, delivery completion rates, and profit margins across entities without co-mingling financial ledgers.

### 2. Operations War Room (`/businesses/{business}/war-room`)
Modeled after Bloomberg Terminal and FactSet operations trading desks, the War Room provides an ultra-dense, institutional operations interface:
- **Header Telemetry**: Real-time status indicators, Dhaka operating schedule context (`12:00–19:00 Delivery & Cash Settlement Phase`), tier switches, role toggles, and live system clocks.
- **6-KPI Health Strip**:
  - *Liquid Cash*: ৳16,95,200 with 2.17× obligation coverage ratio.
  - *Principal Auto-Debit*: ৳54,00,000 with 48h timer and post-debit transit cash buffer.
  - *Delivered Sales*: ৳9,60,000 with 700 retail drops and 7,997 units.
  - *Credit Share*: 39.6% against a strict 45% ceiling.
  - *Till Variance*: −৳400 exception badge linked to Van #3.
  - *Dispatch Delay*: +165 minutes with 1,980 van-minutes lost and ৳4,950 idle crew cost.
- **12-Route Settlement Ledger & Retail Shop Drilldown**:
  - Real-time search by route ID, market name, van number, SR, or JSR.
  - Status filters (`All`, `Flagged Exceptions`, `Settled`).
  - Right-aligned tabular numerals (`font-mono tabular-nums`) with currency indicators in headers.
  - Interactive row expansion: clicking any route opens a live audit table of sample retailer shop invoices (e.g., Haji & Sons Grocery, Janani Store, Bismillah Traders) displaying bill numbers, market points, cash paid, credit granted, and timestamps.
- **Balance Sheet & Economic Waterfall (Right Column)**:
  - *NOWC Waterfall*: Visual step breakdown of Receivables + Inventory + Claims − Payables = ৳1.37Cr.
  - *Receivables Ageing*: 5-bracket segmented distribution bar (0–15d, 16–30d, 31–45d, 46–60d, 60+d) with top overdue retailer watch list.
  - *Billing Hardware Bottleneck Economics*: Economic calculation of legacy Epson LQ-310 dot-matrix printer failures (+165 min dispatch delay, ৳41.46 loss/unit, ৳2,488 daily mispick loss, and **2.8-day payback period** for replacement equipment).
  - *Section F FMCG KPIs*: Order strike rate (75.0%), lines per call (4.8 SKUs), delivery fill rate (96.5%), market return rate (1.2%), warehouse stock cover (18.5 days), break-even volume (90,741 units / 43.6%), and margin of safety (56.4%).

### 3. Multi-Tier Viewports & Responsive Display Modes
- **Deck Tier**: Standard high-density two-column workbench optimized for executive desktop and laptop screens.
- **Field Tier**: Single-column high-contrast layout tuned for tablet devices used by warehouse dispatchers and field coordinators.
- **Wall (4K) Tier**: 7-tile Bloomberg-grade command wall display designed for NOC and warehouse display boards, featuring burn-in pixel shift protection and high-visibility status badges.

### 4. Role-Based Perspectives & Action Dock
- **Contextual Roles**:
  - **Owner / CEO**: High-level working capital, bank deposit approvals, and credit ceiling enforcement.
  - **Operations Manager**: Delivery beat tracking, dispatch delays, and printer hardware replacement.
  - **Vault Cashier**: Cash counting, opening float balancing, and route till variance reconciliation.
  - **Field Viewer**: Read-only tracking for audit teams and supervisors.
- **State-Mutating Action Dock**:
  - `Pause Credit`: Lock market credit extensions for high-risk overdue retailers.
  - `Prepare Bank Deposit`: Simulate moving counted vault cash into the Islami Bank operating account to cover the ৳54,00,000 auto-debit.
  - `Open Shortage Case`: Initiate JSR salary deduction or CEO waiver for cash discrepancies.
  - `Review and Close Day`: Finalize settlement ledger and generate end-of-day audit trail.

### 5. Localization & Dual-Language Architecture (EN / BN)
- Instant bilingual toggle supporting English and native Bengali (বাংলা).
- Automatic conversion of all numbers, currency values, dates, and metric scales into authentic Bengali numerals (`০, ১, ২, ৩, ৪, ৫, ৬, ৭, ৮, ৯`).
- Culturally accurate FMCG terminology:
  - **SR** (*Sales Representative / Order Booker*)
  - **JSR** (*Junior Sales Representative / Delivery Man & Cash Collector*)
  - **Beat / Route** (*দৈনিক বাজার ডেলিভারি রুট*)
  - **Dues** (*পূর্বের বকেয়া আদায়*)
  - **Float** (*শুরুর নগদ ব্যালেন্স*)

---

## Complete Route Reference

The distroMesh application features full App Router deep-linking across the following views:

| Route Path | View Name | Description |
| :--- | :--- | :--- |
| `/` | Landing Page | Public brand overview, platform features, and live demo access. |
| `/businesses` | Portfolio Management | Multi-business aggregated scan, entity metrics, and side-by-side comparison. |
| `/businesses/{business}/overview` | Business Overview | Primary business dashboard, monthly revenue trend charts, and quick KPI tiles. |
| `/businesses/{business}/war-room` | Financial War Room | Real-time operations command center, 12-route settlement matrix, NOWC, and hardware economics. |
| `/businesses/{business}/sales-operations` | Sales & Operations | Detailed breakdown of volume, case drops, delivery routes, and field team performance. |
| `/businesses/{business}/connected-businesses` | Supply Chain Relationships | Map of connected mills, suppliers, retail chains, and sister distribution hubs. |
| `/businesses/{business}/transactions` | Ledger & Transactions | Filterable record of cash sweeps, bank deposits, expense vouchers, and customer receipts. |
| `/businesses/{business}/invoices` | Retail Shop Invoices | Invoice register tracking delivery status, credit terms, and collection progress. |
| `/businesses/{business}/expenses` | Expense Vouchers | Operating expense log categorized by fuel, van maintenance, labor, and warehouse overheads. |
| `/businesses/{business}/cash-flow` | Liquidity & Cash Flow | Cash bridge visualization, bank account ledgers, and 48-hour obligation analysis. |
| `/businesses/{business}/alerts` | Alert Center | Exception inbox for cash variances, delayed dispatches, credit limit breaches, and stockouts. |
| `/businesses/{business}/ask` | Business Q&A Assistant | Context-aware distribution assistant responding to queries using live workspace metrics. |

---

## Strict Mathematical Identities (Zero-Leakage Integrity)

distroMesh implements 10 non-negotiable accounting identities enforced across all calculations and verified via automated test suites:

$$\begin{aligned}
\mathbf{Identity\ 1:} & \quad \text{Delivered Sales} = \text{Cash Sales} + \text{Credit Sales} \\
& \quad \text{৳9,60,000} = \text{৳5,80,000} + \text{৳3,80,000} \\[6pt]
\mathbf{Identity\ 2:} & \quad \text{Cash Handed In} = \text{Cash Sales} + \text{Old Dues Collected} \\
& \quad \text{৳8,60,000} = \text{৳5,80,000} + \text{৳2,80,000} \\[6pt]
\mathbf{Identity\ 3:} & \quad \text{Expected Till} = \text{Opening Float} + \text{Cash Handed In} - \text{Cash Expenses} \\
& \quad \text{৳8,95,600} = \text{৳50,000} + \text{৳8,60,000} - \text{৳14,400} \\[6pt]
\mathbf{Identity\ 4:} & \quad \text{Till Variance} = \text{Counted Till} - \text{Expected Till} = \sum_{r=1}^{12} \text{Route Variance}_r \\
& \quad \mathbf{-৳400} = \text{৳8,95,200} - \text{৳8,95,600} \\[6pt]
\mathbf{Identity\ 5:} & \quad \text{Credit Share} = \frac{\text{Credit Sales}}{\text{Delivered Sales}} = \frac{\text{৳3,80,000}}{\text{৳9,60,000}} = \mathbf{39.6\%} \quad (\le 45.0\%) \\[6pt]
\mathbf{Identity\ 6:} & \quad \text{Bank Balance} \cap \text{Vault Cash} = \emptyset \quad (\text{Vault cash is not counted in bank until deposit is posted}) \\[6pt]
\mathbf{Identity\ 7:} & \quad \text{Receivables}_{t} = \text{Receivables}_{t-1} + \text{Credit Extended} - \text{Dues Collected} \\[6pt]
\mathbf{Identity\ 8:} & \quad \text{NOWC} = \text{Receivables} + \text{Inventory} + \text{Claims} - \text{Payables} \\
& \quad \text{৳1,37,00,000} = \text{৳1,97,00,000} + \text{৳1,54,00,000} + \text{৳2,05,00,000} - \text{৳2,15,00,000} \\[6pt]
\mathbf{Identity\ 9:} & \quad \text{Net Profit} = \text{Gross Profit} - \text{Operating Costs} - \text{Financing Costs} \\
& \quad \text{৳3,72,500} = \text{৳10,50,000} - \text{৳6,00,000} - \text{৳77,500} \quad (\mathbf{1.49\%}\text{ margin}) \\[6pt]
\mathbf{Identity\ 10:} & \quad \text{Monthly Invoices} = \text{Daily Invoices} \times 26 = 720 \times 26 = \mathbf{18,720\ invoices}
\end{aligned}$$

---

## Number Formatting Standards

All financial and operational data in distroMesh follows strict presentation guidelines:
1. **Bangladeshi / South Asian Number Grouping**: Commas format as `X,XX,XX,XXX` (e.g., `৳16,95,200`, `৳54,00,000`, `৳1,37,00,000`).
2. **Standardized Summary Notation**: Compact numbers utilize `L` (Lakh = $10^5$) and `Cr` (Crore = $10^7$) only. Western `K` or `M` abbreviations are strictly barred from high-level currency summaries.
3. **Control Values**: Exact taka figures are displayed without rounding for all audit control values (variance, counted till, invoice totals).
4. **Header-Scoped Currency**: Table column headers explicitly specify `(৳)` to eliminate repetitive currency clutter inside table cells.
5. **Tabular Numerals**: Numeric data is rendered in fixed-width monospace fonts (`font-mono tabular-nums`) and right-aligned for instant vertical scanning.
6. **Negative Control Signage**: Discrepancies and negative balances use the typographical minus sign `−৳` (e.g., `−৳400`).

---

## Technical Stack & Quality Assurance

- **Framework**: Next.js 16 (App Router) with Turbopack compiler.
- **Frontend Core**: React 19, TypeScript (strict mode enabled with zero `any` types).
- **Styling**: Tailwind CSS with custom institutional color palette, responsive breakpoints, and dark mode support.
- **Analytics & Visualizations**: Recharts for revenue curves and liquidity bridges; Lucide React for iconography.
- **Automated Verification**:
  - `npm test`: Built-in Node test runner (`node --test`) executing 20 unit tests across mathematical identities, derived FMCG operational rules, and formatting modules (**100% pass rate**).
  - `npm run lint`: ESLint with **0 errors and 0 warnings**.
- **Production Backend Specification**: See [`BACKEND_REQUIREMENTS.md`](file:///d:/dfb/BACKEND_REQUIREMENTS.md) for full PostgreSQL DDL schemas, double-entry ledger contracts, REST/WebSocket APIs, edge printer daemon specifications, and Unilever ERP integration architecture.
- **Non-Technical Operator's Manual**: See [`USER_GUIDE.md`](file:///d:/dfb/USER_GUIDE.md) for an everyday, plain-language operational manual designed for business owners, warehouse managers, cashiers, and field supervisors.

---

## Local Execution Guide

To run distroMesh locally:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) or open the War Room directly at [http://localhost:3000/businesses/unilever-distribution/war-room](http://localhost:3000/businesses/unilever-distribution/war-room).

To run validation checks:

```bash
# Run ESLint
npm run lint

# Run mathematical & integrity tests
npm test

# Build production bundle
npm run build
```
