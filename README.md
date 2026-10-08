# distroMesh

> **Institutional-Grade Financial Command & Operations Intelligence Platform for FMCG Distribution Houses**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-distromesh.vercel.app-success?style=for-the-badge&logo=vercel)](https://distromesh.vercel.app)
[![Tests](https://img.shields.io/badge/Unit%20Tests-20%2F20%20Passing-brightgreen?style=for-the-badge)](tests/dataIntegrity.test.ts)
[![Framework](https://img.shields.io/badge/Next.js-16.3.8%20Turbopack-black?style=for-the-badge&logo=next.js)](package.json)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=for-the-badge&logo=react)](package.json)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](package.json)

---

## Live Demo

A fully functional, publicly accessible demo version is deployed and live on Vercel:

- **Demo URL**: [https://distromesh.vercel.app](https://distromesh.vercel.app)

*No account creation or login required for the demo. Open the link to explore all operational workspaces immediately.*

---

## What is distroMesh?

In fast-moving consumer goods (FMCG) distribution across Bangladesh, distribution houses operate on thin net margins (1.0%–2.0%), cycle crores of taka in working capital, handle millions in daily cash across dozens of van delivery beats, and must strictly fulfill 48-hour auto-debit sweeps by multinational principals (such as Unilever Bangladesh).

**distroMesh** is an operations and financial operating system engineered specifically to:
1. **Stop Till & Route Leakage**: Reconcile daily cash handed in by delivery crews (JSRs) against delivered challans down to the exact coin.
2. **Enforce Market Credit Ceilings**: Prevent field sales representatives (SRs) from extending fresh credit when customer balances exceed company policy limits.
3. **Protect Principal Auto-Debits**: Segregate depot vault cash from clearing bank balances to guarantee that multinational supplier drafts never bounce.
4. **Eliminate Yard Bottlenecks**: Identify morning dispatch delays (such as billing printer failures) and calculate idle crew wage losses.
5. **Govern Multi-Business Portfolios**: Supervise multiple commercial agencies (Unilever, durables, footwear, edible oil, wholesale) with isolated books, distinct bank accounts, and aggregated portfolio visibility.

---

## Flagship Enterprise Reference: M/S Popy Traders

The reference dataset represents **M/S Popy Traders**, an exclusive tier-1 Unilever distribution house operating across the **Sherpur and Bogura Hubs** in northern Bangladesh:
- **Daily Delivered Sales**: ৳9,60,000 across 12 delivery beats, 6 delivery vans, and 700 retail drops (average drop size: ৳1,333).
- **Cash Handed In**: ৳8,60,000 ($\text{Cash Sales } ৳5,80,000 + \text{Old Dues } ৳2,80,000$).
- **Counted Vault Till**: ৳8,95,200 (Expected ৳8,95,600; flagged exception of **−৳400** on Van #3 / Route 103).
- **Liquid Cash Reserve**: ৳16,95,200 (Bank balance ৳8,00,000 + Vault Cash ৳8,95,200) covering an upcoming ৳54,00,000 auto-debit due in 48 hours.
- **Net Operating Working Capital (NOWC)**: ৳1,37,00,000 (৳1.37Cr) with a 16.0-day Cash Conversion Cycle.

---

## Key Features

- **Operations War Room (`/businesses/[id]/war-room`)**:
  - Live clock and Dhaka operational schedule phase tracker.
  - Liquidity Runway comparing bank clearing cash vs physical vault cash.
  - 12-route van settlement ledger with retailer invoice drill-downs.
  - Automatic detection and highlighting of route shortages (Van #3 −৳400).
- **Multi-Business Portfolio (`/businesses`)**:
  - Consolidated view of 5 operating entities without commingling accounts.
  - Side-by-side business benchmarking and interactive business onboarding modal.
- **10 Non-Negotiable Accounting Identities**:
  - Mathematical integrity rules enforced in code and validated by 20 unit tests.
- **Forensic Investigation Drawers**:
  - Route Detail Drawer, Reconciliation Drawer, Incident Audit Drawer, Obligation Drawer, and Working Capital Drawer.
- **Interactive Scenario Simulator**:
  - Live sliders to adjust bank cash, obligations, credit, and dispatch delay with instantaneous reactive recalculations.
- **Dual-Theme Design System**:
  - Institutional dark mode (`#050506`) and clean light mode (`#F7F8FA`).
- **Bilingual Localization (EN / BN)**:
  - Instant translation of terms, labels, and numerals into Bengali (`৳১৬,৯৫,২০০`).
- **Display Viewport Tiers**:
  - Optimized profiles for Desktop Deck, Field Touch Tablet, and 55–65" Wall Display.

---

## Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | Next.js 16.3.8 (App Router & Turbopack) |
| **Core Libraries** | React 19.2.8, TypeScript 5, Framer Motion 14 |
| **Styling** | Tailwind CSS v4, PostCSS |
| **Data Visualization** | Recharts 3.10.1 (Responsive financial charts) |
| **Iconography** | Lucide React |
| **Testing** | Node.js Test Runner with `--experimental-strip-types` |
| **Code Quality** | ESLint 9 with Next.js & React 19 rules |
| **Deployment** | Vercel Serverless Edge Platform |

---

## Repository Structure

```text
d:\dfb\
├── src/
│   ├── app/                                # Next.js App Router
│   │   ├── (workspace)/
│   │   │   └── businesses/[[...segments]]/ # Dynamic catch-all workspace routes
│   │   ├── globals.css                     # Tailwind v4 styles & CSS variables
│   │   ├── layout.tsx                      # Root HTML layout with theme script
│   │   └── page.tsx                        # Public landing page entry
│   ├── components/
│   │   ├── executive/
│   │   │   ├── control-board/              # War Room: Header, Runway, Matrices, Action Dock
│   │   │   ├── Drawers/                    # 6 forensic audit drawers & modals
│   │   │   ├── visualizations/             # Executive charts & KPI cards
│   │   │   ├── BusinessPortfolio.tsx       # Multi-entity portfolio view & onboarding
│   │   │   └── ExecutiveShell.tsx          # Workspace navigation shell
│   │   ├── marketing/                      # Landing page & 5-zone interactive showcases
│   │   └── war-room/                       # War Room container
│   ├── context/
│   │   ├── ExecutiveContext.tsx            # In-memory reactive state manager
│   │   └── ThemeContext.tsx                # Dual-theme persistence manager
│   ├── data/
│   │   ├── businessEntitiesData.ts         # Portfolio entities (Unilever, Pureit, etc.)
│   │   ├── fleetData.ts                    # 12 fleet vehicles telemetry
│   │   ├── portfolioDemo.ts                # Portfolio rollups & filters
│   │   └── seedData.ts                     # Reconciled baseline figures for Popy Traders
│   ├── types/
│   │   └── executive.ts                    # Shared TypeScript interfaces
│   └── utils/
│       ├── businessRoutes.ts               # URL route name resolution
│       ├── derivedRules.ts                 # Mathematical calculations & economics
│       └── formatters.ts                   # Bangladeshi currency & Bengali numerals
├── tests/
│   └── dataIntegrity.test.ts               # 20 automated unit tests
├── .vercel/                                # Vercel project configuration
├── BACKEND_REQUIREMENTS.md                 # Complete backend architecture specification
├── PLATFORM_OVERVIEW.md                    # Platform capabilities & FMCG operations
├── USER_GUIDE.md                           # Operations manual for users & reviewers
└── package.json                            # Project scripts & dependencies
```

---

## Application Routes

| Route | Workspace Purpose |
| :--- | :--- |
| `/` | distroMesh landing page with 5 interactive operational showcases |
| `/businesses` | Multi-Business Portfolio overview & comparative benchmarking |
| `/businesses/unilever-distribution/war-room` | **Executive Operations War Room** (Flagship Command Center) |
| `/businesses/unilever-distribution/overview` | Selected business operations workspace & KPI cards |
| `/businesses/unilever-distribution/sales-operations` | Sales history, case volume, and operating indicators |
| `/businesses/unilever-distribution/transactions` | Filterable, searchable transaction ledger |
| `/businesses/unilever-distribution/invoices` | Retail store delivery invoice records |
| `/businesses/unilever-distribution/expenses` | Daily expense vouchers (fuel, labor, toll) |
| `/businesses/unilever-distribution/cash-flow` | Inflow/outflow charts and cash summaries |
| `/businesses/unilever-distribution/alerts` | Operational alerts and review tasks |
| `/businesses/unilever-distribution/connected-businesses`| Linked subsidiaries and sister agencies |
| `/businesses/unilever-distribution/ask` | Contextual commercial assistant (`⌘K` / `Ctrl+K`) |

---

## Getting Started Locally

### Prerequisites
- **Node.js**: Version 20.9.0 or later (Node 22 LTS recommended)
- **npm**: Version 10 or later

### Installation & Execution

> **Windows PowerShell Notice**: Default Windows execution policies block `.ps1` wrapper scripts. Always use `npm.cmd` in PowerShell.

```powershell
# 1. Clone the repository
git clone https://github.com/Shamiul-Lipu/distroMesh.git
cd distroMesh

# 2. Install dependencies
npm.cmd install

# 3. Start local development server
npm.cmd run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Test Commands

distroMesh includes an automated test suite verifying all 10 mathematical identities and formatting rules:

```powershell
# Run the 20 automated unit tests:
npm.cmd test

# Run ESLint across the codebase:
npm.cmd run lint
```

### Production Build

```powershell
# Build optimized production bundle
npm.cmd run build

# Start local production server
npm.cmd start
```

---

## Guided Reviewer Walkthrough (Demo Testing)

To evaluate the live demo without installing code, visit [https://distromesh.vercel.app](https://distromesh.vercel.app) and follow these steps:

1. **Explore the Landing Page (`/`)**:
   - Check the minimal top header, theme toggle (Sun/Moon), and EN/BN toggle.
   - Click through the **5 Operational Zones** (Liquidity Runway, Trapped Capital, Dispatch Runway, Route Settlement, Action Dock) to observe the interactive live previews.
2. **Launch the War Room (`/businesses/unilever-distribution/war-room`)**:
   - Click **লাইভ ওয়ার রুম দেখুন** (View Live War Room).
   - Observe the Executive Header showing **M/S Popy Traders (Sherpur & Bogura Hub)**, live operating phase clock, and status badge.
3. **Audit Liquidity & the 48-Hour Auto-Debit**:
   - Inspect the **Liquidity Runway**: notice that **Bank Cash (৳8,00,000)** is separated from **Vault Cash (৳8,95,200)**.
   - Review the upcoming ৳54,00,000 auto-debit due in 48 hours.
4. **Audit the 12-Route Settlement Matrix**:
   - Scroll to the Route Settlement Matrix.
   - Notice that **Van #3 (Babul Hossain)** is highlighted in red with an audit exception for a **−৳400 cash shortage**.
   - Click on the Van #3 row to open the **Route Detail Drawer**, displaying individual retail store challans (e.g., Haji & Sons Grocery, Janani Store). Close the drawer.
5. **Test the Executive Action Dock**:
   - Click **Pause Credit** in the bottom bar to open the two-step confirmation modal, then cancel.
   - Click **Resolve Exception** to open the shortage case resolution drawer for Van #3. Test the **Waive** or **Deduct** options.
6. **Test the Scenario Simulator**:
   - Click **সিমুলেশন** (Simulation) in the top header.
   - Drag the Bank Balance or Auto-Debit slider to watch coverage ratios recalculate dynamically.
7. **Switch Display Tiers & Language**:
   - Click **Wall 4K** in the top bar to inspect the 7-tile Bloomberg-grade command wall with burn-in protection.
   - Click **Touch** to test the tablet layout.
   - Toggle **বাংলা / English** to watch all figures convert into authentic Bengali numerals.
8. **Inspect the Multi-Business Portfolio (`/businesses`)**:
   - Click **পোর্টফোলিও** (Portfolio) in the navigation menu.
   - Compare the 5 distinct businesses and click **Add a business** to test the commercial onboarding modal.

---

## Known Limitations

- **Session-Scoped Persistence**: State modifications (e.g., resolving a shortage, adding a business) are held in client-side React memory. Hard-refreshing the browser restores the initial seed baseline.
- **Simulated Authentication**: The user role selector (`Owner`, `Operations Manager`, `Vault Cashier`, `Field Viewer`) allows testing permissions without requiring SMS OTP or passwords.
- **Prototype Deployment**: Deployed on Vercel Serverless Edge for demonstration purposes; external banking host-to-host sweeps and Unilever SAP connections are simulated.

---

## Comprehensive Documentation Links

- **Backend Architecture & Implementation Specification**: [`BACKEND_REQUIREMENTS.md`](file:///d:/dfb/BACKEND_REQUIREMENTS.md)
- **Platform Overview & FMCG Operations**: [`PLATFORM_OVERVIEW.md`](file:///d:/dfb/PLATFORM_OVERVIEW.md)
- **User Guide & Operations Manual**: [`USER_GUIDE.md`](file:///d:/dfb/USER_GUIDE.md)

---

*distroMesh · Engineered for Distribution Business Owners · Sherpur & Bogura Hub.*
