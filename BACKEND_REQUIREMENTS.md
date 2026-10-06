# distroMesh: Backend Architecture & Implementation Specification

## 1. Executive Summary & Objective

This document specifies the backend system requirements, architectural design, database schemas, API contracts, and integration protocols required to transition **distroMesh** from its current frontend demonstration mode into a mission-critical, production-grade financial command and operations system.

The target environment is high-velocity Fast-Moving Consumer Goods (FMCG) distribution in Bangladesh, taking **M/S Popy Traders** (Unilever Distribution, Sherpur & Bogura Hubs) as the primary enterprise reference.

---

## 2. Core Architectural Principles

1. **Multi-Tenant Entity Isolation**:
   - Strict logical data isolation across business entities (e.g., Unilever Distribution, Flour Mills, Beverage Logistics, Agro Trade) using PostgreSQL Row-Level Security (RLS) and tenant-scoped connection pooling.
   - No co-mingling of bank balances, general ledgers, inventory lots, or retailer receivables across legal entities.

2. **Immutable Double-Entry Financial Ledger**:
   - Every financial transaction (cash sale, credit issuance, old dues collection, expense voucher, vault deposit, bank sweep) must generate balanced debit/credit journal entries.
   - Zero hard deletion of financial records. Corrections must be handled via reversing journal entries.

3. **Strict Mathematical Identity Verification at API Boundary**:
   - The backend must validate the 10 Non-Negotiable Identities (documented in [`PLATFORM_OVERVIEW.md`](file:///d:/dfb/PLATFORM_OVERVIEW.md)) at database transaction boundaries before committing any route settlement or till session.

4. **Offline-First Synchronization for Field Teams**:
   - Sales Representatives (SRs) and Delivery/Cash Collectors (JSRs) operate in rural and suburban beats with intermittent cellular connectivity.
   - Client-side SQLite/IndexedDB on mobile handhelds synchronizing via vector clocks / conflict-free replicated data types (CRDTs) with idempotency keys.

5. **Sub-Second Live Telemetry for War Room**:
   - Server-Sent Events (SSE) or WebSocket push for real-time updates to the War Room dashboard (`/war-room`) when delivery drops, cash sweeps, and printer queues change state.

---

## 3. Technology Stack Recommendation

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Primary Backend Runtime** | **Go (Golang)** or **Node.js (NestJS / TypeScript)** | High-concurrency route settlement processing, strict typing, and shared data contracts with the Next.js frontend. |
| **Relational Database** | **PostgreSQL 16+** | Native support for Row-Level Security (RLS), JSONB, strict ACID guarantees, and declarative financial constraints. |
| **Time-Series / Telemetry** | **TimescaleDB Extension** | Ultra-efficient aggregation of minute-by-minute van GPS pings, dispatch bottlenecks, and hourly sales run-rates. |
| **In-Memory Cache & Locks**| **Redis 7+** | Distributed locks (`Redlock`) to prevent double-settlement of routes; caching of War Room KPI rollups. |
| **Message Broker** | **RabbitMQ** or **Apache Kafka** | Asynchronous processing of invoice printing queues, audit logging, SMS/WhatsApp alerts, and principal ERP sync. |
| **Edge Hardware Daemon** | **Go (Single Binary Daemon)** | Lightweight local warehouse service communicating over USB/Parallel with Epson LQ-310 dot-matrix printers. |

---

## 4. Database Schema (PostgreSQL DDL)

### 4.1 Multi-Tenant Governance & Organizations

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

### 4.2 Field Operations, Beats & Retailers

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

### 4.3 Invoices & Delivery Drops

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

CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    sku_code VARCHAR(64) NOT NULL,
    sku_name VARCHAR(255) NOT NULL,
    ordered_units INT NOT NULL,
    delivered_units INT NOT NULL,
    unit_trade_price NUMERIC(12, 2) NOT NULL,
    line_total NUMERIC(14, 2) NOT NULL
);
```

### 4.4 Daily Cash Reconciliation & Route Settlement

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

-- Denomination Breakdown for Vault Audits
CREATE TABLE till_denominations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    till_session_id UUID NOT NULL REFERENCES till_sessions(id) ON DELETE CASCADE,
    note_1000 INT DEFAULT 0,
    note_500 INT DEFAULT 0,
    note_200 INT DEFAULT 0,
    note_100 INT DEFAULT 0,
    note_50 INT DEFAULT 0,
    note_20 INT DEFAULT 0,
    note_10 INT DEFAULT 0,
    coins NUMERIC(10, 2) DEFAULT 0.00
);
```

### 4.5 Working Capital Ledger & Bank Sweeps

```sql
CREATE TABLE bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    bank_name VARCHAR(128) NOT NULL, -- e.g., 'Islami Bank Bangladesh Ltd'
    branch_name VARCHAR(128),
    account_number VARCHAR(64) NOT NULL,
    current_balance NUMERIC(16, 2) NOT NULL DEFAULT 0.00,
    is_principal_auto_debit_account BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE bank_deposits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    till_session_id UUID REFERENCES till_sessions(id),
    bank_account_id UUID NOT NULL REFERENCES bank_accounts(id),
    deposit_amount NUMERIC(14, 2) NOT NULL,
    deposit_slip_number VARCHAR(64),
    slip_image_url TEXT,
    status VARCHAR(32) DEFAULT 'PENDING', -- 'PENDING', 'CONFIRMED', 'REJECTED'
    confirmed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE principal_obligations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    principal_name VARCHAR(128) NOT NULL, -- 'Unilever Bangladesh Limited'
    debit_order_number VARCHAR(64) NOT NULL,
    due_datetime TIMESTAMPTZ NOT NULL,
    amount NUMERIC(16, 2) NOT NULL,
    status VARCHAR(32) DEFAULT 'SCHEDULED', -- 'SCHEDULED', 'EXECUTED', 'FAILED'
    executed_at TIMESTAMPTZ
);
```

---

## 5. Core REST & WebSocket API Contracts

### 5.1 War Room Live Telemetry Endpoint

- **Endpoint**: `GET /api/v1/businesses/{businessSlug}/war-room`
- **Auth**: Bearer JWT (`OWNER`, `OPERATIONS_MANAGER`, `VAULT_CASHIER`, `AUDITOR`)
- **Response**:

```json
{
  "asOf": "2026-10-06T16:15:00+06:00",
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
      "assignedJsr": "Babul",
      "status": "ACTION_REQUIRED"
    },
    "dispatchDelay": {
      "delayMinutes": 165,
      "lostVanMinutes": 1980,
      "idleCostBdt": 4950.00,
      "bottleneckReason": "Epson LQ-310 Dot-Matrix Jam",
      "status": "CRITICAL"
    }
  },
  "routes": [
    {
      "routeId": "R-101",
      "vanNumber": "Van #1 (11-4021)",
      "beat": "Sherpur Town East",
      "sr": "Rafiqul",
      "jsr": "Selim",
      "deliveredSales": 82400.00,
      "cashSales": 50200.00,
      "creditSales": 32200.00,
      "oldDuesCollected": 24000.00,
      "cashExpenses": 1200.00,
      "cashHandedIn": 74200.00,
      "expectedTill": 73000.00,
      "countedTill": 73000.00,
      "variance": 0.00,
      "status": "OK"
    }
  ],
  "workingCapital": {
    "receivables": 19700000.00,
    "inventory": 15400000.00,
    "schemeClaims": 205000.00,
    "tradePayables": 21500000.00,
    "nowc": 13700000.00,
    "cashConversionCycleDays": 16.0
  },
  "receivablesAgeing": {
    "totalOverdue30d": 3550685.00,
    "percentOverdue30d": 18.02,
    "brackets": [
      { "label": "0-15 Days", "percent": 55, "amount": 10835000.00 },
      { "label": "16-30 Days", "percent": 27, "amount": 5319000.00 },
      { "label": "31-45 Days", "percent": 11, "amount": 2167000.00 },
      { "label": "46-60 Days", "percent": 5, "amount": 985000.00 },
      { "label": "60+ Days", "percent": 2, "amount": 394000.00 }
    ]
  }
}
```

### 5.2 Route Cash Settlement Submission

- **Endpoint**: `POST /api/v1/businesses/{businessSlug}/routes/{routeCode}/settle`
- **Payload**:

```json
{
  "settlementDate": "2026-10-06",
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
    { "type": "TOLL", "amount": 400.00, "memo": "Bridge Toll & Parking" }
  ]
}
```

- **Backend Validation**:
  1. Checks `deliveredSales == cashSales + creditSales` (Identity 1).
  2. Checks `totalCashHandedIn == cashSales + oldDuesCollected` (Identity 2).
  3. Calculates variance: `countedPhysicalCash - totalCashHandedIn`.
  4. Atomically records ledger entries inside a single SQL transaction.

### 5.3 Daily Till Close & Variance Resolution

- **Endpoint**: `POST /api/v1/businesses/{businessSlug}/vault/close-session`
- **Payload**:

```json
{
  "sessionDate": "2026-10-06",
  "openingFloat": 50000.00,
  "countedVaultCash": 895200.00,
  "varianceAction": "SCHEDULE_DEDUCTION", -- Options: 'WAIVE', 'SCHEDULE_DEDUCTION', 'FLAG_AUDIT'
  "deductionTargetJsrId": "e1f1c7d2-7b24-4f9e-8c33-8cb49db9652a",
  "deductionAmount": 400.00,
  "notes": "Route 103 shortfall attributed to change miscount by JSR Babul."
}
```

---

## 6. Edge Hardware Service (Epson LQ-310 Printing Daemon)

### 6.1 The Problem
In Unilever distribution, van dispatch cannot commence until multi-part carbon-copy delivery challans and invoices are printed for all 700 retail drops. Inefficient printer drivers and spooler crashes cause a **165-minute dispatch delay**, stalling 6 vans, generating 1,980 lost van-minutes, and costing ৳4,950 in idle wages.

### 6.2 Solution Architecture: `distromesh-printd`
A dedicated, headless edge daemon written in Go deployed directly on the warehouse billing terminal.

```
┌────────────────────────────────────────────────────────┐
│              distroMesh Cloud API Server               │
└───────────────────────────┬────────────────────────────┘
                            │ WebSocket / gRPC Queue
                            ▼
┌────────────────────────────────────────────────────────┐
│            distromesh-printd (Edge Daemon)             │
│  - Raw ESC/P 2 Matrix Rasterizer                       │
│  - Bidirectional USB/IEEE 1284 Status Poller           │
│  - In-Memory Spool Buffer                              │
└───────────────────────────┬────────────────────────────┘
                            │ Direct Raw Parallel / USB
                            ▼
┌────────────────────────────────────────────────────────┐
│           Epson LQ-310 24-Pin Dot Matrix               │
│  - 416 cps High-Speed Draft Mode                       │
│  - 1+3 Carbon Copy Continuous Stationery               │
└────────────────────────────────────────────────────────┘
```

### 6.3 Daemon Key Specifications
1. **Raw ESC/P Byte Generation**: Bypasses the Windows/Linux CUPS graphical print spooler. Sends raw ASCII and ESC/P control codes (`ESC @`, `ESC C`, `ESC E`) directly to device `/dev/usb/lp0` or `\\.\LPT1`.
2. **Printer Status Telemetry**: Polls printer status pins (Paper Out, Pin Jam, Head Temperature, Ribbon Status) every 500ms.
3. **Automatic Failover**: If the legacy printer halts, automatically redirects the print queue to a backup high-speed line printer and alerts the War Room via WebSocket.
4. **Economic ROI**: The replacement hardware cost (৳3,000 for service or ৳15,000 for backup unit) pays for itself in **2.8 operating days** based on recovered mispick losses (৳2,488/day) and idle crew time (৳4,950/day).

---

## 7. External Integrations

### 7.1 Principal ERP (Unilever DMS / 1View)
- **Morning Import Sync (06:00 AM)**: Pulls order bookings generated by SRs via Unilever handheld terminals (DMS API / SFTP Flat File / EDI).
- **Evening Reconciliation Export (08:00 PM)**: Exports completed drop statuses, return quantities, cash collection logs, and customer damage claims back to Unilever SAP.
- **Automated Scheme Claims Submission**: Generates claim vouchers for promotional discounts (৳2,05,000 current pending balance) and tracks Unilever credit note issuance.

### 7.2 Banking & MFS Interfaces
- **Corporate Bank Sweep (Islami Bank Bangladesh Ltd / City Bank)**:
  - Integration with corporate Internet banking host-to-host API.
  - Queries real-time clearing account balance.
  - Generates auto-sweep instructions to move vault cash into the auto-debit account prior to the 48-hour deadline.
- **Mobile Financial Services (bKash / Nagad / Rocket)**:
  - Generates dynamic retail merchant QR codes on printed delivery invoices.
  - Webhook listener receives instant retail payment notifications, automatically reducing invoice dues and updating route cash collection in real time.

---

## 8. Security, Compliance & Audit Trail

1. **Cryptographic Audit Log**:
   - Every state-altering action in the War Room (locking retailer credit, approving till waivers, posting bank deposits) writes to an append-only `audit_events` table with SHA-256 state chaining:
   $$\text{Hash}_n = \text{SHA256}(\text{Hash}_{n-1} \parallel \text{Timestamp} \parallel \text{UserId} \parallel \text{Payload})$$
2. **Field Token Revocation**:
   - JSR mobile devices require daily biometric or OTP check-in at the hub before beginning delivery routes.
   - Remote wipe capability if a handheld device is lost or stolen on the beat.
3. **Bangladesh Financial Regulations Compliance**:
   - Complies with Bangladesh Bank ICT Security Guidelines for enterprise financial data retention (minimum 7 years of immutable ledger history).

---

## 9. Implementation Roadmap & Milestones

| Phase | Duration | Scope & Deliverables |
| :--- | :--- | :--- |
| **Phase 1: Database & Financial Core** | Weeks 1–3 | PostgreSQL schemas, RLS isolation, Double-entry journal, 10 Mathematical Identities validation suite. |
| **Phase 2: War Room Live APIs** | Weeks 4–5 | REST & WebSocket telemetry endpoints, 12-route settlement workflow, Till session vault management. |
| **Phase 3: Hardware Print Daemon** | Weeks 6–7 | `distromesh-printd` Go service, ESC/P direct generation, Epson LQ-310 status monitoring, and auto-failover. |
| **Phase 4: Field Sync & Offline Engine**| Weeks 8–10 | JSR mobile collection app, offline SQLite sync, retailer QR payments, conflict resolution. |
| **Phase 5: Principal ERP & Bank Connect**| Weeks 11–12| Unilever DMS EDI/SFTP connector, Islami Bank host-to-host balance polling, bKash/Nagad merchant webhooks. |
