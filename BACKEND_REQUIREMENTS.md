# distroMesh: Backend Architecture & Implementation Specification

> **Live Prototype Deployment**: [https://distromesh.vercel.app](https://distromesh.vercel.app)  
> **Source Repository**: `Shamiul-Lipu/distroMesh`  
> **Current Revision**: Next.js 16.3.8 Turbopack / React 19 / TypeScript 5 / Tailwind CSS v4  

---

## 1. Executive Summary & Objective

**distroMesh** is an institutional-grade financial command and operations system tailored for fast-moving consumer goods (FMCG) distribution houses, regional wholesalers, and multi-entity distribution conglomerates operating in Bangladesh.

The primary reference enterprise is **M/S Popy Traders**, an exclusive tier-1 Unilever distribution house operating across the **Sherpur and Bogura Hubs** in northern Bangladesh. FMCG distribution operates on tight margins (1.0%–2.0% net operating profit), high working capital turnover (৳2.50+ Crore monthly turnover), strict 48-hour principal auto-debit sweeps by multinational FMCGs, and intense physical cash handling across dozens of daily van delivery beats.

This specification documents both:
1. **The Currently Built and Verified System**: A fully functional Next.js 16 App Router application deployed live to Vercel, featuring a comprehensive client-side state engine, mathematical derived rules engine, 10-identity integrity validation suite, interactive War Room command board, multi-business portfolio manager, and deep-dive forensic audit drawers.
2. **The Target Production Backend Architecture**: The planned relational PostgreSQL schema with Row-Level Security (RLS), REST/WebSocket API contracts, distributed locks, edge hardware printing daemon, and external ERP/banking connectors required to transition the live prototype to a multi-server production deployment.

---

## 2. Implementation Status Matrix

To maintain total documentation integrity and treat the active codebase as the single source of truth, every component is classified below:

| Subsystem / Component | Current State | Codebase Implementation | Verification / Notes |
| :--- | :--- | :--- | :--- |
| **Executive War Room (`/war-room`)** | **Implemented** | `src/components/war-room/WarRoomView.tsx`<br>`src/components/executive/control-board/` | 5 operational zones, live clock, 12-route settlement matrix, liquidity runway, action dock. |
| **Multi-Business Portfolio (`/businesses`)** | **Implemented** | `src/components/executive/BusinessPortfolio.tsx` | 5 distinct commercial entities (Unilever, Pureit, Apex, Meghna, Square), comparative metrics, onboarding modal. |
| **Derived Rules & Economics Engine** | **Implemented** | `src/utils/derivedRules.ts` | 6 business calculation rules: liquidity status, dispatch loss, route validation, mispick economics, receivables ageing, FMCG KPIs. |
| **Bangladeshi Financial Numbering & Formatter** | **Implemented** | `src/utils/formatters.ts` | Indian numbering comma grouping (`৳ Lakh`, `৳ Crore`), negative prefixes (`−৳`), exact vs summary modes, Bengali numeral converter (`০–৯`). |
| **Mathematical Identity Integrity Suite** | **Implemented** | `tests/dataIntegrity.test.ts` | 20 unit tests executing under Node.js native test runner validating 10 non-negotiable accounting identities. 100% pass rate. |
| **Forensic Investigation Drawers** | **Implemented** | `src/components/executive/Drawers/` | 6 interactive drawers: Route Detail, Reconciliation, Incident Audit, Obligation, Working Capital, Action Confirmation. |
| **Interactive Scenario Simulator** | **Implemented** | `src/components/executive/SimulationPanel.tsx` | Reactive sliders for Bank Cash, Vault Cash, Obligations, Fresh Credit, Delay Minutes, and Variance with live recalculation. |
| **Dual-Theme Design System** | **Implemented** | `src/context/ThemeContext.tsx`<br>`src/app/globals.css` | Institutional dark mode (`#050506` / `#0B0F19`) and clean light mode (`#F7F8FA`) with persistence in `localStorage`. |
| **Bilingual Localization (EN / BN)** | **Implemented** | `src/context/ExecutiveContext.tsx` | Instant toggle between English and authentic Bengali FMCG terminology and Bengali numerals across all views. |
| **Display Viewport Tiers (Deck / Touch / Wall 4K)** | **Implemented** | `src/components/executive/control-board/` | Responsive viewports for Desktop, Field/Tablet, and 55–65" Wall Display with burn-in pixel shift protection. |
| **Dynamic Workspace Routing** | **Implemented** | `src/app/(workspace)/businesses/[[...segments]]/page.tsx`<br>`src/utils/businessRoutes.ts` | Supports portfolio, War Room, Overview, Sales & Ops, Transactions, Invoices, Expenses, Cash Flow, Alerts, Copilot. |
| **Live Production Deployment** | **Implemented** | Vercel Serverless Edge | Publicly accessible at `https://distromesh.vercel.app` with zero build or runtime errors. |
| **In-Memory Seed Data & Portfolio Profiles** | **Partially Implemented** | `src/data/seedData.ts`<br>`src/data/businessEntitiesData.ts`<br>`src/data/fleetData.ts` | Realistic, mathematically reconciled FMCG operational data held in React state; resets on browser refresh. |
| **Role-Based Perspectives** | **Partially Implemented** | `src/context/ExecutiveContext.tsx` | UI role switcher (Owner, Operations Manager, Vault Cashier, Field Viewer) modifying view permissions; no backend JWT auth. |
| **Audit Log & Shortage Case Lifecycle** | **Partially Implemented** | `src/context/ExecutiveContext.tsx` | Session-scoped audit log and shortage case resolution (Waive / Deduct / Escalate); non-durable across page reloads. |
| **Relational Database (PostgreSQL 16+ with RLS)** | **Planned / Specification** | Section 5 of this document | Comprehensive DDL designed; not yet provisioned in current deployment. |
| **Server-Side REST / WebSocket API** | **Planned / Specification** | Section 6 of this document | Endpoint contracts documented; current prototype operates via client-side Next.js routing and React state. |
| **Edge Hardware Daemon (`distromesh-printd`)** | **Planned / Specification** | Section 7 of this document | ESC/P 2 protocol and daemon architecture specified; economic calculation implemented in frontend. |
| **Principal ERP Integration (Unilever DMS / 1View)** | **Planned / Specification** | Section 8 of this document | Data contracts defined; not connected to live external enterprise systems. |
| **Banking & MFS Host-to-Host Integration** | **Planned / Specification** | Section 8 of this document | Islami Bank balance polling and bKash/Nagad dynamic QR code webhooks specified. |

---

## 3. Current Live Architecture & Runtime

### 3.1 Topology & Infrastructure

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
│  │ CSS, JS, Media, Woff2 │        │ SSR / ISR Page Generation       │  │
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

### 3.2 Implemented Core Modules

1. **Derived Rules Module (`src/utils/derivedRules.ts`)**:
   - `deriveLiquidityStatus({ bankAfterDebit, vaultCash, next7DayObligations })`:
     - Calculates combined liquid cash and coverage ratios.
     - Returns `SAFE` (buffer $\ge$ ৳5,00,000), `WATCH` (buffer $\ge$ ৳1,00,000), or `CRITICAL` (deficit).
   - `deriveDispatchMetrics({ targetTime, actualTime, delayMinutes, vansDispatched, crewDailyWage })`:
     - Calculates van-minutes lost ($12 \times 165 = 1,980\text{ min}$) and idle labor cost ($\approx ৳4,950$).
   - `deriveRouteStatus(route)`:
     - Enforces that non-OK routes have explicit reason strings (e.g., till shortages, outside territory).
   - `deriveMispickLoss()`:
     - Calculates unit loss (৳41.46/unit) and daily mispick expense (৳2,488) with payback period (**2.8 operational days**).
   - `deriveReceivablesAgeing()`:
     - Categorizes trade receivables across 5 ageing buckets with $18.0\%$ overdue $>30$ days.

2. **Formatting Module (`src/utils/formatters.ts`)**:
   - Implements authentic Bangladeshi currency conventions.
   - `formatBDT(amount, { mode: 'exact', bangla: boolean })`: Formats exact taka with commas at thousands, lakhs, and crores (`৳১৬,৯৫,২০০`).
   - `formatBDT(amount, { mode: 'summary', bangla: boolean })`: Enforces summary format using only `L` (Lakh) and `Cr` (Crore). **Explicitly forbids Western `K` or `M` for financial balances.**
   - Negative amounts formatted with standard minus prefix `−৳` rather than trailing symbols or parentheses.
   - `toBanglaNumerals(str)`: Instant character mapping of ASCII digits `0–9` to Bengali glyphs `০–৯`.

3. **Executive Context Store (`src/context/ExecutiveContext.tsx`)**:
   - Central state coordinator providing reactive setters, drawer controls, modal dispatchers, simulation values, and toast notifications.
   - Manages state mutations for:
     - `confirmCreditLock`: Locks credit extensions across overdue beats.
     - `confirmBankDeposit`: Simulates staging vault cash to the clearing bank account.
     - `handleOpenShortageCase`: Manages investigation cases for route cash discrepancies.
     - `waiveVariance` / `deductVariance`: Resolves cashier discrepancies.
     - `confirmDayEndClose`: Finalizes the operational day.
     - `replaceHardware`: Clears billing printer delay bottlenecks.

4. **Theme Context Store (`src/context/ThemeContext.tsx`)**:
   - Manages dark mode and light mode with persistent synchronization across browser tabs via `storage` event listeners.

---

## 4. The 10 Non-Negotiable Mathematical Accounting Identities

The distroMesh operations model is governed by 10 mathematical identities that guarantee zero-leakage accounting. All 10 are strictly implemented in code and verified by automated unit tests in `tests/dataIntegrity.test.ts`.

| ID | Accounting Identity Formulation | Commercial Significance | Test Verification |
| :--- | :--- | :--- | :--- |
| **1** | $\text{Delivered Sales} = \text{Cash Sales} + \text{Credit Sales}$ | Prevents unrecorded deliveries or off-the-books market credit. Valid per route and across the whole hub. | `Identity 1: Delivered sales = cash sales + credit sales` (PASSED) |
| **2** | $\text{Cash Handed In} = \text{Cash Sales} + \text{Old Dues Collected}$ | Ensures all physical currency collected by JSRs on the road is categorized. | `Identity 2: Cash handed in = cash sales + old dues collected` (PASSED) |
| **3** | $\text{Expected Till} = \text{Opening Float} + \text{Cash Handed In} - \text{Cash Expenses}$ | Defines the exact cashier till liability before physical cash count. | `Identity 3: Expected till = opening float + cash handed in − cash expenses` (PASSED) |
| **4** | $\text{Variance} = \text{Counted Till} - \text{Expected Till}$ | Flags shortages as negative numbers ($\sum \text{Route Variances} = \text{Total Variance}$). | `Identity 4: Variance = counted − expected` (PASSED) |
| **5** | $\text{Credit Share} = \frac{\text{Credit Sales}}{\text{Delivered Sales}}$ | Enforces owner policy ceiling ($\le 45.0\%$). Current seed: $39.58\%$. | `Identity 5: Credit share = credit sales ÷ delivered sales` (PASSED) |
| **6** | $\text{Vault Cash} \neq \text{Bank Balance}$ | Cash sitting in the depot safe is **not** available for bank auto-debits until a physical deposit posts. | `Identity 6: Vault cash is NOT in bank until a deposit posts` (PASSED) |
| **7** | $\text{Closing AR} = \text{Opening AR} + \text{Credit Sales} - \text{Old Dues Collected}$ | Validates the roll-forward consistency of retailer accounts receivable. | `Identity 7: Receivables roll-forward consistency` (PASSED) |
| **8** | $\text{NOWC} = \text{AR} + \text{Inventory} + \text{Scheme Claims} + \text{Damage Claims} - \text{AP}$ | Governs Net Operating Working Capital tied up in operational assets. Current seed: ৳1,37,00,000 (৳1.37Cr). | `Identity 8: Net operating working capital formula` (PASSED) |
| **9** | $\text{Net Profit} = \text{Gross Margin} - \text{Opex} - \text{Financing} - \text{Tax}$ | Validates monthly enterprise profit margin ($1.49\%$ on ৳2.50Cr turnover). | `Identity 9: Monthly P&L lines sum to net profit` (PASSED) |
| **10** | $\text{Payroll} \le \text{Operating Costs}$ | Verifies enterprise payroll (৳4,05,000 for 57 staff) remains within total operating overhead (৳6,00,000). | `Identity 10: Payroll <= operating costs; headcount = 57` (PASSED) |

---

## 5. Target Production Database Architecture (PostgreSQL Schema)

*Note: The schemas below represent the target relational architecture for Phase 2 backend deployment. In the current live demo, these entities are modeled in TypeScript (`src/types/executive.ts` and `src/data/seedData.ts`).*

### 5.1 Multi-Tenant Governance & Organizations

```sql
-- Tenants & Hubs
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(64) UNIQUE NOT NULL,
    legal_name VARCHAR(255) NOT NULL,
    trade_license_no VARCHAR(128),
    tin_bin_number VARCHAR(128),
    currency VARCHAR(3) DEFAULT 'BDT',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE hubs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    hub_code VARCHAR(32) NOT NULL, -- e.g., 'SHERPUR-01', 'BOGURA-02'
    name VARCHAR(128) NOT NULL,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, hub_code)
);

-- Users & Role-Based Access Control
CREATE TYPE user_role AS ENUM ('OWNER', 'OPERATIONS_MANAGER', 'VAULT_CASHIER', 'SR', 'JSR', 'AUDITOR', 'VIEWER');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    hub_id UUID REFERENCES hubs(id),
    name VARCHAR(128) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(128),
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 5.2 Field Operations, Beats & Retailers

```sql
CREATE TABLE beats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    hub_id UUID NOT NULL REFERENCES hubs(id),
    route_code VARCHAR(32) NOT NULL, -- e.g., 'R-101', 'R-102'
    name VARCHAR(128) NOT NULL,      -- e.g., 'Sherpur Town East'
    market_point VARCHAR(128) NOT NULL,
    assigned_van_number VARCHAR(32), -- e.g., 'Dhaka Metro-Ta 11-4021'
    assigned_sr_id UUID REFERENCES users(id),
    assigned_jsr_id UUID REFERENCES users(id),
    scheduled_dispatch_time TIME DEFAULT '07:30:00',
    UNIQUE(tenant_id, route_code)
);

CREATE TABLE retailers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    beat_id UUID NOT NULL REFERENCES beats(id),
    code VARCHAR(32) NOT NULL,
    store_name VARCHAR(128) NOT NULL,
    proprietor_name VARCHAR(128),
    phone VARCHAR(20),
    credit_limit NUMERIC(14, 2) DEFAULT 0.00,
    credit_terms_days INT DEFAULT 7,
    current_outstanding NUMERIC(14, 2) DEFAULT 0.00,
    is_credit_locked BOOLEAN DEFAULT FALSE,
    lock_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, code)
);
```

### 5.3 Invoices & Delivery Drops

```sql
CREATE TYPE invoice_status AS ENUM ('ORDERED', 'PRINTED', 'DISPATCHED', 'DELIVERED', 'PARTIAL', 'RETURNED', 'CANCELLED');

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    hub_id UUID NOT NULL REFERENCES hubs(id),
    beat_id UUID NOT NULL REFERENCES beats(id),
    retailer_id UUID NOT NULL REFERENCES retailers(id),
    invoice_number VARCHAR(64) UNIQUE NOT NULL,
    invoice_date DATE NOT NULL,
    
    total_case_units INT NOT NULL,
    gross_amount NUMERIC(14, 2) NOT NULL,
    discount_amount NUMERIC(14, 2) DEFAULT 0.00,
    net_payable_amount NUMERIC(14, 2) NOT NULL,
    
    cash_collected NUMERIC(14, 2) DEFAULT 0.00,
    credit_issued NUMERIC(14, 2) DEFAULT 0.00,
    old_dues_collected NUMERIC(14, 2) DEFAULT 0.00,
    
    status invoice_status DEFAULT 'ORDERED',
    printed_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT chk_settlement_sum CHECK (net_payable_amount = (cash_collected + credit_issued))
);
```

### 5.4 Daily Cash Reconciliation & Route Settlement

```sql
CREATE TYPE settlement_status AS ENUM ('DRAFT', 'SUBMITTED', 'AUDITED', 'SETTLED', 'EXCEPTION');

CREATE TABLE route_settlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    hub_id UUID NOT NULL REFERENCES hubs(id),
    beat_id UUID NOT NULL REFERENCES beats(id),
    settlement_date DATE NOT NULL,
    jsr_id UUID NOT NULL REFERENCES users(id),
    
    delivered_sales NUMERIC(14, 2) NOT NULL,
    cash_sales NUMERIC(14, 2) NOT NULL,
    credit_sales NUMERIC(14, 2) NOT NULL,
    old_dues_collected NUMERIC(14, 2) NOT NULL,
    
    total_cash_handed_in NUMERIC(14, 2) NOT NULL,
    cash_expenses NUMERIC(14, 2) DEFAULT 0.00,
    
    status settlement_status DEFAULT 'SUBMITTED',
    variance_amount NUMERIC(14, 2) DEFAULT 0.00,
    variance_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Enforcement of Mathematical Identity 1 & 2
    CONSTRAINT chk_delivered_identity CHECK (delivered_sales = (cash_sales + credit_sales)),
    CONSTRAINT chk_handed_in_identity CHECK (total_cash_handed_in = (cash_sales + old_dues_collected)),
    UNIQUE(tenant_id, beat_id, settlement_date)
);

CREATE TABLE till_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    hub_id UUID NOT NULL REFERENCES hubs(id),
    session_date DATE NOT NULL,
    cashier_id UUID NOT NULL REFERENCES users(id),
    
    opening_float NUMERIC(14, 2) NOT NULL,
    total_handed_in NUMERIC(14, 2) NOT NULL,
    total_cash_expenses NUMERIC(14, 2) NOT NULL,
    expected_till NUMERIC(14, 2) NOT NULL,
    counted_vault_cash NUMERIC(14, 2) NOT NULL,
    till_variance NUMERIC(14, 2) NOT NULL,
    
    is_closed BOOLEAN DEFAULT FALSE,
    variance_resolution VARCHAR(32), -- 'PENDING', 'WAIVED_BY_CEO', 'DEDUCTION_SCHEDULED'
    resolution_notes TEXT,
    resolved_by UUID REFERENCES users(id),
    closed_at TIMESTAMPTZ,
    
    -- Enforcement of Mathematical Identity 3 & 4
    CONSTRAINT chk_expected_till CHECK (expected_till = (opening_float + total_handed_in - total_cash_expenses)),
    CONSTRAINT chk_till_variance CHECK (till_variance = (counted_vault_cash - expected_till)),
    UNIQUE(tenant_id, hub_id, session_date)
);
```

---

## 6. Target Production API Specifications

*Note: In the current prototype, navigation and data retrieval occur via Next.js App Router client routing and React Context. The endpoints below specify the RESTful contracts for the future dedicated API server.*

### 6.1 War Room Live Telemetry Endpoint

- **Endpoint**: `GET /api/v1/businesses/{businessSlug}/war-room`
- **Method**: `GET`
- **Authentication**: `Bearer <JWT_TOKEN>` (`OWNER`, `OPERATIONS_MANAGER`, `VAULT_CASHIER`, `AUDITOR`)
- **Sample Response**:
```json
{
  "asOf": "2026-10-08T12:00:00+06:00",
  "operatingSchedule": {
    "phase": "Delivery & Settlement",
    "window": "12:00 - 19:00",
    "activeVans": 6,
    "dispatchedRoutes": 12
  },
  "executiveKpis": {
    "liquidCash": {
      "total": 1695200.00,
      "bankPortion": 800000.00,
      "vaultPortion": 895200.00,
      "coverageRatio": 2.17,
      "status": "SAFE"
    },
    "principalAutoDebit": {
      "amount": 5400000.00,
      "dueInHours": 48.0,
      "projectedPostDebitBuffer": 800000.00,
      "status": "SCHEDULED"
    },
    "deliveredSales": {
      "amount": 960000.00,
      "units": 7997,
      "invoices": 700,
      "avgDropSize": 1333.33
    },
    "creditShare": {
      "percent": 39.58,
      "freshCreditAmount": 380000.00,
      "policyCeiling": 45.00,
      "status": "NORMAL"
    },
    "tillVariance": {
      "amount": -400.00,
      "flaggedRouteId": "R-103",
      "assignedJsr": "Babul Hossain",
      "status": "ACTION_REQUIRED"
    },
    "dispatchDelay": {
      "delayMinutes": 165,
      "lostVanMinutes": 1980,
      "idleCostBdt": 4950.00,
      "bottleneckReason": "Epson LQ-310 Dot-Matrix Jam",
      "status": "CRITICAL"
    }
  }
}
```

### 6.2 Route Cash Settlement Submission

- **Endpoint**: `POST /api/v1/businesses/{businessSlug}/routes/{routeCode}/settle`
- **Method**: `POST`
- **Request Payload**:
```json
{
  "settlementDate": "2026-10-08",
  "jsrId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "deliveredSales": 82400.00,
  "cashSales": 50200.00,
  "creditSales": 32200.00,
  "oldDuesCollected": 24000.00,
  "cashExpenses": 1200.00,
  "totalCashHandedIn": 74200.00,
  "countedPhysicalCash": 74200.00,
  "expenseVouchers": [
    { "type": "FUEL", "amount": 800.00, "memo": "Padma Oil CNG Fill" },
    { "type": "TOLL", "amount": 400.00, "memo": "Sherpur Bridge Toll" }
  ]
}
```

---

## 7. Edge Hardware Subsystem (`distromesh-printd`)

### 7.1 Operational Problem
In FMCG distribution in Bangladesh, delivery vans cannot legally depart the warehouse yard without 3-part carbon-copy invoices and delivery challans signed by the cashier. When billing rooms rely on aging 24-pin dot-matrix printers (such as the legacy Epson LQ-310) driven by standard Windows spoolers, frequent ribbon jams and head overheats cause severe morning dispatch stalls.
- **Observed Bottleneck**: 165-minute dispatch delay (09:00 target vs 11:45 actual departure).
- **Fleet Impact**: 12 vans stalled in yard; 1,980 van-minutes lost.
- **Labor Waste**: ৳4,950 in idle driver/loader crew wages.
- **Warehouse Packing Errors**: ৳2,488 daily mispick loss (৳41.46 per unit).

### 7.2 Solution Architecture
A standalone edge daemon written in Go (`distromesh-printd`) deployed on the warehouse billing terminal:
1. **Direct ESC/P 2 Rasterization**: Bypasses the OS print spooler; emits raw ASCII and ESC/P control codes directly to `\\.\LPT1` or `/dev/usb/lp0`.
2. **Status Pin Telemetry**: Polls hardware status pins every 500ms (Paper Out, Pin Jam, Head Temperature).
3. **Economic Payback**: Replacing faulty print hardware (cost ৳3,000 for high-speed thermal head or ৳15,000 for line printer) achieves complete financial payback in **2.8 operational days**.

---

## 8. Development Setup, Build & Deployment

### 8.1 Prerequisites
- **Node.js**: Version 20.9.0 or later (Node 22 LTS recommended)
- **Package Manager**: npm 10+
- **Operating Systems**: Windows 11/10, macOS Sonoma/Sequoia, Ubuntu 22.04+

### 8.2 Windows PowerShell Execution Notice
On Windows systems with default execution policies, PowerShell blocks `.ps1` wrapper scripts. Always use `npm.cmd` or run via `cmd.exe /c`:
```powershell
# In PowerShell on Windows:
npm.cmd install
npm.cmd run dev
npm.cmd test
npm.cmd run build
```

### 8.3 Core Commands

| Action | Command | Purpose |
| :--- | :--- | :--- |
| **Install Dependencies** | `npm.cmd install` | Installs Next.js, React 19, Recharts, Lucide, Tailwind v4. |
| **Start Development Server** | `npm.cmd run dev` | Launches Turbopack dev server on `http://localhost:3000`. |
| **Run Mathematical Integrity Tests** | `npm.cmd test` | Executes 20 automated unit tests verifying the 10 identities. |
| **Run Linter** | `npm.cmd run lint` | Runs ESLint 9 checks across all TypeScript files. |
| **Compile Production Bundle** | `npm.cmd run build` | Compiles optimized Next.js static and dynamic bundles. |
| **Start Production Server** | `npm.cmd start` | Serves compiled production build locally. |
| **Deploy to Vercel** | `npx.cmd vercel deploy --prod --yes` | Deploys directly to live Vercel production edge network. |

### 8.4 Production Deployment Details

- **Deployment Platform**: Vercel Serverless Edge Network
- **Production URL**: [https://distromesh.vercel.app](https://distromesh.vercel.app)
- **Edge Regions**: Global Anycast CDN distribution
- **Build Pipeline**: Next.js Turbopack automated production build

---

## 9. Known Limitations & Prototype Boundaries

1. **Client-Side State Durability**:  
   The current live deployment holds transaction records, new business additions, and audit entries in client-side React memory. Refreshing the browser resets the session back to the seed baseline.
2. **Absence of Server-Side SQL Database**:  
   PostgreSQL 16 with Row-Level Security is specified in full DDL detail in Section 5, but is not currently attached to the live Vercel frontend.
3. **Simulated Authentication**:  
   The role selector in the top bar (`Owner`, `Operations Manager`, `Vault Cashier`, `Field Viewer`) allows testing user perspectives without requiring SMS OTP or database password verification.
4. **Offline Sync Handheld Handshake**:  
   The mobile handheld CRDT synchronization protocol for rural beats is currently specified in architecture but not yet distributed as a native Android APK.
5. **No Direct Banking Host-to-Host Link**:  
   Bank balances and auto-debit sweeps simulate the real financial schedule of M/S Popy Traders and Unilever Bangladesh, but are not connected to live bank API webhooks.
