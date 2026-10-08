# distroMesh: Platform Overview

> **Live Production Demo**: [https://distromesh.vercel.app](https://distromesh.vercel.app)  
> **System Status**: Fully Operational Live Prototype on Vercel Serverless Edge  
> **Current Engine**: Next.js 16.3.8 Turbopack · React 19 · TypeScript 5 · Tailwind CSS v4  

---

## 1. Executive Summary & Purpose

**distroMesh** is an institutional-grade financial command and operations intelligence platform engineered specifically for fast-moving consumer goods (FMCG) distribution houses, regional wholesale distributors, and multi-entity commercial conglomerates in Bangladesh.

In FMCG distribution, distributors operate on tight net margins (1.0%–2.0%), cycle crores of taka in working capital each month, manage complex evening cash sweeps across dozens of delivery beats, and navigate non-negotiable 48-hour auto-debit sweeps from multinational principals (such as Unilever Bangladesh). A single uncollected invoice, an unauthorized credit extension, or an unaccounted till shortage directly destroys the distributor's net profit.

distroMesh bridges the operational gap between high-level owner governance and daily warehouse floor execution:

1. **Portfolio Governance**: Aggregates disparate commercial agencies (e.g., Unilever Distribution, Durables Logistics, Footwear Agencies, Edible Oil Depots, Wholesale Trade) into a unified executive view while strictly isolating bank accounts, ledgers, and legal entities.
2. **Operations War Room**: Delivers a high-density, real-time command center (`/war-room`) featuring a 12-route van settlement ledger, invoice-level retail shop drill-downs, Net Operating Working Capital (NOWC) waterfalls, receivables ageing distribution, and hardware bottleneck economics.
3. **Data Integrity & Reconciled Identities**: Enforces 10 mathematical non-negotiable accounting identities across gross sales, cash collections, credit allocations, expense vouchers, and vault counts.

---

## 2. Flagship Enterprise Reference: M/S Popy Traders

The reference dataset represents **M/S Popy Traders**, an exclusive tier-1 Unilever distribution house operating across the **Sherpur and Bogura Hubs** in northern Bangladesh.

### Reconciled Daily Baseline Telemetry
- **Delivered Gross Sales**: ৳9,60,000 across 12 delivery beats, 6 delivery vans, 700 retail drops, and 7,997 physical case units (average drop size: ৳1,333).
- **Settlement Composition**:
  - **Cash Sales Collected**: ৳5,80,000 (60.4% cash conversion).
  - **Fresh Market Credit Extended**: ৳3,80,000 (39.58% credit share; within policy ceiling of $\le 45.0\%$).
  - **Old Market Dues Collected**: ৳2,80,000.
  - **Total Cash Handed In by JSRs**: ৳8,60,000 ($\text{Cash Sales } ৳5,80,000 + \text{Old Dues } ৳2,80,000$).
  - **Cash Expenses Incurred**: ৳14,400 (fuel, labor, toll vouchers).
  - **Opening Cash Float**: ৳50,000.
  - **Expected Cash in Till**: ৳8,95,600 ($\text{Float } ৳50,000 + \text{Handed In } ৳8,60,000 - \text{Expenses } ৳14,400$).
  - **Counted Vault Till**: ৳8,95,200.
  - **Till Variance**: **−৳400** (audit exception flagged on Van #3 / Route 103 JSR Babul Hossain).
- **Liquidity & Working Capital**:
  - **Total Liquid Cash**: ৳16,95,200 (Islami Bank balance ৳8,00,000 + Counted Vault Cash ৳8,95,200).
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

## 3. Major Platform Capabilities

### 1. Operations War Room (`/businesses/{business}/war-room`)
Modeled after institutional trading desks, the War Room provides an ultra-dense, real-time command surface:
- **Executive Header**: Real-time status indicators, Dhaka operating schedule context (`12:00–19:00 Delivery & Cash Settlement Phase`), tier switches, role toggles, and live clocks.
- **Liquidity Runway**: Real-time ratio of liquid cash versus upcoming supplier auto-debit sweeps, clearly separating physical depot vault cash from clearing bank balances.
- **12-Route Settlement Ledger & Retail Shop Drilldown**:
  - Real-time search by route ID, market name, van number, SR, or JSR.
  - Status filters (`All`, `Flagged Exceptions`, `Settled`).
  - Interactive row expansion: clicking any route opens a live audit table of retailer shop invoices (e.g., Haji & Sons Grocery, Janani Store, Bismillah Traders).
  - Highlighted discrepancy on **Van #3 / Route 103 (−৳400 shortfall)**.
- **Balance Sheet & Economic Waterfall**:
  - *NOWC Waterfall*: Step breakdown of Receivables + Inventory + Claims − Payables = ৳1.37Cr.
  - *Receivables Ageing*: 5-bracket segmented distribution bar with top overdue retailer watch list.
  - *Billing Hardware Bottleneck Economics*: Calculation of legacy Epson LQ-310 dot-matrix printer failures (+165 min dispatch delay, ৳4,950 idle crew cost, ৳2,488 daily mispick loss, and **2.8-day payback period** for replacement equipment).

### 2. Multi-Business Portfolio Mesh (`/businesses`)
- **Portfolio-Wide Health Scan**: Consolidates multiple operating units (M/S Popy Traders, Pureit Distribution, Sherpur Trade, Bogura Retail, Freshway Consumer).
- **Side-by-Side Business Comparisons**: Benchmarks liquidity cushions, credit exposure ratios, delivery completion rates, and profit margins across entities without commingling financial ledgers.
- **Business Onboarding Modal**: Configure new distribution contracts, bank buffers, and linked subsidiaries.

### 3. State-Mutating Action Dock & Investigation Drawers
- **One-Touch Actions**:
  - `Pause Credit`: Lock market credit extensions for high-risk overdue retailers.
  - `Prepare Bank Deposit`: Simulate moving counted vault cash into the bank clearing account.
  - `Resolve Exception`: Shortage case workflow for Van #3 with Waive, Deduct, or Escalate actions.
  - `Review and Close Day`: Finalize settlement ledger and generate end-of-day audit trail.
- **6 Specialized Forensic Drawers**: Route Detail Drawer, Reconciliation Drawer, Incident Audit Drawer, Obligation Drawer, Working Capital Drawer, and Action Confirmation Modal.

### 4. Interactive Scenario Simulator
- Sliding parameter panel enabling real-time stress testing of bank balance, vault cash, supplier obligations, market credit share, and dispatch delay with instantaneous reactive recalculations.

### 5. Dual-Theme & Bilingual Architecture
- Instant toggle between Institutional Dark Mode (`#050506`) and High-Contrast Light Mode (`#F7F8FA`).
- Full bilingual toggle supporting English and native Bengali (বাংলা) with automatic conversion to Bengali numerals (`৳১৬,৯৫,২০০`).

---

## 4. Current System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT / REVIEWER BROWSER                       │
│  (Desktop Browser, Warehouse Tablet, or Depot Wall Display Monitor)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS (TLS 1.3)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     VERCEL SERVERLESS EDGE NETWORK                     │
│               Domain: https://distromesh.vercel.app                    │
│                                                                        │
│  ┌───────────────────────┐        ┌─────────────────────────────────┐  │
│  │ Static Assets (CDN)   │        │ Next.js 16 Turbopack Serverless │  │
│  │ CSS, JS, Media, Woff2 │        │ SSR / Dynamic Page Delivery     │  │
│  └───────────────────────┘        └────────────────┬────────────────┘  │
└────────────────────────────────────────────────────┼───────────────────┘
                                                     │ Hydration
                                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│               REACT 19 CLIENT-SIDE APPLICATION RUNTIME                 │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ ExecutiveContext State Store (In-Memory React Context)            │  │
│  │ - Reactive Bank & Vault Cash     - 12 Van Beat Records           │  │
│  │ - Upcoming Auto-Debit Obligations - Real-Time Till Audit State   │  │
│  │ - Scenario Simulation Overrides   - Session Audit Trail          │  │
│  └───────────────┬──────────────────────────────────┬───────────────┘  │
│                  │                                  │                  │
│                  ▼                                  ▼                  │
│  ┌───────────────────────────────┐  ┌───────────────────────────────┐  │
│  │ Derived Rules Engine          │  │ Formatting & i18n Engine      │  │
│  │ - Liquidity Status (SAFE/CRIT)│  │ - Indian Comma Grouping       │  │
│  │ - Dispatch Loss Calculation   │  │ - Bengali Numeral Converter   │  │
│  │ - Mispick Cost Economics      │  │ - Taka Prefix Standardization │  │
│  │ - Receivables Ageing Brackets │  │ - Exact vs Summary Formatters │  │
│  └───────────────────────────────┘  └───────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Demonstrated vs Planned Capabilities

| Capability | Current Demo Status | Production Target |
| :--- | :--- | :--- |
| **User Interface & War Room** | **Fully Demonstrated** | Same interface connected to live WebSocket push |
| **Mathematical Identity Integrity** | **Fully Demonstrated (20 Tests Passed)** | Enforced at PostgreSQL transaction boundaries |
| **Bilingual Toggle & Numerals** | **Fully Demonstrated** | Same implementation |
| **Dual-Theme Design System** | **Fully Demonstrated** | Same implementation |
| **Scenario Simulator** | **Fully Demonstrated** | Same implementation with server-side snapshotting |
| **Forensic Drawers & Modals** | **Fully Demonstrated** | Same implementation with server-backed audit logs |
| **Data Persistence** | **In-Memory Demo State (Resets on Refresh)** | PostgreSQL 16+ with Row-Level Security |
| **Authentication & Permissions** | **Simulated Role Switcher in UI** | JWT with SMS OTP & Role-Based Access Control |
| **External ERP Integration** | **Simulated FMCG Baseline Rules** | Unilever DMS / SAP EDI/SFTP Connector |
| **Bank Auto-Sweep** | **Simulated 48h Timeline** | Host-to-Host Corporate Banking API |
| **Hardware Printing Daemon** | **Calculated Economic ROI in UI** | `distromesh-printd` Go service on warehouse terminal |

---

## 6. Live Verification & Testing

The live deployment at [https://distromesh.vercel.app](https://distromesh.vercel.app) has been verified across all core paths:

1. **Landing Page (`/`)**: Confirmed interactive hero cockpit, 5-zone product showcases, theme switch, and language switch.
2. **War Room (`/businesses/unilever-distribution/war-room`)**: Verified Executive Header, Liquidity Runway, 12-route settlement matrix, Route 3 shortage highlight, and action dock modals.
3. **Route Detail Drawer**: Verified line-item retailer challans for Van #3 (Babul Hossain).
4. **Action Dock Modals**: Confirmed two-step confirmation dialogs for credit lock, bank deposit, and shortage cases.
5. **Multi-Business Portfolio (`/businesses`)**: Confirmed rendering of all 5 business entities and onboarding modal.
6. **Automated Test Suite**: 20 automated unit tests passing cleanly with zero failures (`npm.cmd test`).
7. **Linter**: Zero ESLint errors across all components (`npm.cmd run lint`).

---

## 7. Known Limitations

- **Session-Scoped Persistence**: Data modifications, business onboarding, and shortage resolutions are held in client-side memory and do not persist across hard browser reloads.
- **Simulated Roles**: User role selection does not require login credentials; it is intended for testing different operational perspectives.
- **No Live Financial Accounts**: Bank balances and principal auto-debits reflect the authentic operational schedule of M/S Popy Traders, but are not connected to live banking webhooks.
