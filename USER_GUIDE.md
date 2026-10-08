# distroMesh: Platform Overview & Operations Manual (USER_GUIDE)

> **Live Demo URL**: [https://distromesh.vercel.app](https://distromesh.vercel.app)  
> **Access Requirement**: Publicly accessible. No login, username, or password required for prototype testing.  
> **Target Audience**: Distribution business owners, operations managers, dispatch supervisors, vault cashiers, and software reviewers.  

---

## 1. Executive Platform Overview

### What is distroMesh?

If you operate a fast-moving consumer goods (FMCG) distribution house in Bangladesh (such as **M/S Popy Traders** operating across the **Sherpur & Bogura Hub** for Unilever Bangladesh, Pureit, and allied consumer brands), your business handles millions of taka each day across delivery vans, hundreds of retail grocery shops, field salesmen, and supplier credit lines.

In high-volume distribution, net profit margins are tight (typically 1.0% to 2.0%). A single uncollected invoice, a careless cashier till shortage, or a delayed delivery van directly burns your net earnings.

**distroMesh is your centralized commercial command center.** It provides an operational and financial operating system engineered specifically to:

1. **Stop Till & Route Leakage**: Reconcile every single taka handed in by van crews against delivered challans with mathematical proof down to the exact coin.
2. **Enforce Market Credit Ceilings**: Prevent field order bookers (SRs) from extending fresh credit to retail grocery shops when past-due market balances exceed company limits.
3. **Protect Principal Auto-Debits**: Separate physical warehouse vault cash from clearing bank balances to prevent dishonored auto-debits from principal companies (like Unilever's 48-hour RTGS sweeps).
4. **Eliminate Yard Bottlenecks**: Pinpoint morning dispatch delays (such as billing printer breakdowns) and calculate the exact wage loss of stalled van crews.
5. **Manage Multi-Business Holdings**: Oversee multiple distribution agencies and legal entities under one owner with separate books, distinct bank accounts, and aggregated portfolio visibility.

---

## 2. Accessing the Live Demo & Getting Started

### Access Instructions
You do **not** need to install software, install Node.js, or configure environment variables to evaluate distroMesh:

1. Open your web browser (Chrome, Edge, Safari, Firefox).
2. Navigate to: [https://distromesh.vercel.app](https://distromesh.vercel.app)
3. The platform opens directly to the public landing page.
4. Click **লাইভ ওয়ার রুম দেখুন** (View Live War Room) or navigate directly to `/businesses/unilever-distribution/war-room`.

### Demo Considerations
- **In-Memory State**: Any actions you perform in the demo (such as resolving an exception or simulating a bank deposit) are saved dynamically in your browser session. Hard-refreshing the page restores the seed baseline.
- **Role Switching**: There is no login barrier. You can switch roles instantaneously using the perspective dropdown in the top bar.

---

## 3. Platform Navigation & Workspaces

distroMesh provides three primary operational workspaces:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                            DISTROMESH WORKSPACES                             │
├───────────────────────┬──────────────────────────────┬───────────────────────┤
│ 1. BUSINESS PORTFOLIO │ 2. EXECUTIVE WAR ROOM        │ 3. BUSINESS WORKSPACE │
│    (/businesses)      │    (/.../war-room)           │    (/.../overview)    │
│                       │                              │                       │
│ • Cross-company view  │ • Live ops telemetry (clock) │ • General ledger      │
│ • Multi-agency cash   │ • 12-route settlement table  │ • Daily P&L breakdown │
│ • Entity onboarding   │ • Dispatch runway tracking   │ • Working capital map │
│ • Inter-company links │ • Executive action dock      │ • Contextual AI helper│
└───────────────────────┴──────────────────────────────┴───────────────────────┘
```

### Workspace 1: Multi-Business Portfolio (`/businesses`)
Built for proprietors managing multiple commercial distribution agencies. In one screen, view consolidated capital, monthly turnover across all businesses, combined retail drop counts, and individual entity health cards.
- **Entity Isolation**: Each agency (e.g., *M/S Popy Traders - Unilever Distribution*, *Pureit Durables Division*, *Apex Footwear Agency*, *Meghna Edible Oil Depot*, *Square Consumer Wholesale*) maintains completely isolated financial records, receivables, and tax obligations.
- **Add a Business**: Click **Add a business** to configure a new principal contract, bank buffer, depot location, or linked subsidiary.

### Workspace 2: Executive War Room (`/businesses/[id]/war-room`)
The primary operational nerve center used during active business hours (07:00 AM – 08:00 PM). Designed for high-density visual monitoring on office desktops, warehouse tablets, or wall-mounted depot TV screens.
- **Live Ops Header**: Live operations clock, current operational shift (Morning Dispatch, Field Deliveries, Evening Vault Close), and active risk telemetry.
- **Liquidity Runway**: Real-time ratio of liquid cash versus upcoming supplier payment sweeps.
- **Trapped Capital Matrix**: Categorized view of capital tied up in overdue customer credit, damaged warehouse stock, and pending manufacturer scheme claims.
- **Dispatch Runway & Bottleneck Radar**: Step-by-step progress of morning delivery van departures, pinpointing printer or loading jams.
- **Route Settlement Matrix**: Live breakdown of all 12 delivery beats, comparing expected till collections against physical driver hand-ins.
- **Executive Action Dock**: One-touch controls to lock market credit, authorize bank deposit vouchers, or sign off on daily ledger closing.

### Workspace 3: Business Operations Workspace (`/businesses/[id]/overview`)
The operational accounting dashboard for bookkeepers and general managers.
- **Financial Summary**: Monthly P&L table showing delivered gross revenue, cost of goods sold, van fleet operating overhead, interest, taxes, and net profit margins.
- **Working Capital Breakdown**: Direct visibility into Days Sales Outstanding (DSO), Days Inventory Outstanding (DIO), and Cash Conversion Cycle (CCC).
- **Recent Transactions Ledger**: Searchable, filterable ledger of invoices, supplier payments, and expense vouchers with `⌘K` quick search.

---

## 4. The 4 Operational Roles

distroMesh provides four distinct role perspectives configurable via the dropdown in the top navigation bar:

| Role | Primary User | Primary Screen Focus | Available Permissions |
| :--- | :--- | :--- | :--- |
| **Owner / CEO** | Proprietor / Managing Director | Liquidity runway, profit margins, capital trapped in credit, bank sweep coverage | Full authority to lock credit, approve cashier shortage waivers, and authorize bank deposits |
| **Operations Manager** | Warehouse In-Charge / Fleet Manager | Van dispatch delays, delivery route progress, hardware bottlenecks, crew efficiency | Ability to simulate hardware replacements, reassign stalled delivery routes, and flag billing errors |
| **Vault Cashier** | Chief Cashier / Depot Accountant | Route cash handed in, driver float reconciliation, till variance audits, bank deposit slips | Authority to count vault currency, flag route variances, and prepare bank transit vouchers |
| **Field Viewer** | Auditor / Principal Supervisor | Delivery drops completed, cash collection vs credit ratio, route compliance | Read-only access to track deliveries without authority to approve financial transactions |

---

## 5. Step-by-Step Operational Workflows

### Workflow 1: Morning Dispatch & Delay Audit (07:00 AM – 10:00 AM)
1. Navigate to the **War Room** (`/businesses/unilever-distribution/war-room`).
2. Locate the **Dispatch Runway & Bottleneck Radar** on the right side.
3. Observe the departure timeline:
   - Target Dispatch Time: `09:00 AM`
   - Actual Departure Time: `11:45 AM`
   - Dispatch Delay: `+165 minutes`
4. Inspect the economic bottleneck card:
   - Bottleneck Cause: `Epson LQ-310 24-Pin Dot-Matrix Jam & Faded Ribbon`
   - Stalled Fleet: 12 vans stalled in yard
   - Lost Fleet Time: 1,980 van-minutes
   - Idle Labor Wage Loss: ৳4,950
   - Daily Mispick Loss: ৳2,488 (৳41.46 per error)
5. Click **Hardware Incident Details** to open the **Incident Drawer**. Review the payback calculation: replacing the printer costs ৳3,000 to ৳15,000 and achieves 100% payback within **2.8 operational days**.

### Workflow 2: Midday Liquidity & 48-Hour Principal Auto-Debit (11:00 AM – 02:00 PM)
1. Locate the **Liquidity Runway** at the top of the War Room.
2. Review the core cash figures:
   - **Bank Balance**: ৳8,00,000 (Available at Islami Bank)
   - **Depot Vault Cash**: ৳8,95,200 (Physical paper currency in depot safe)
   - **Total Liquid Cash**: ৳16,95,200
3. Inspect the **Upcoming Principal Obligation**:
   - Amount: `৳54,00,000`
   - Principal: `Unilever Bangladesh Limited`
   - Due Date: Within 48 hours
4. Notice the critical commercial distinction:
   - Bank-Only Coverage: `0.15×` (Deficit of ৳46,00,000 if vault cash is not deposited!)
   - Solvency Coverage with Vault Cash: `0.31×`
5. In the bottom **Action Dock**, click **Prepare Bank Deposit**.
6. The modal prompts you to stage the physical vault cash for commercial bank transit to safeguard the auto-debit.

### Workflow 3: Evening Route Cash Settlement & Shortage Investigation (05:00 PM – 08:00 PM)
1. Locate the **Route Settlement Matrix** in the main column of the War Room.
2. The table displays all 12 delivery beats with Driver (JSR), Order Booker (SR), Delivered Sales, Cash Sales, Credit Sales, Old Dues Collected, and Expected vs Counted Till.
3. Notice that **Route #103 / Van #3 (Babul Hossain)** displays a red alert:
   - Expected Cash: `৳74,600`
   - Counted Cash: `৳74,200`
   - Variance: **`−৳400`** (Shortage)
4. Click on the Van #3 row.
5. The **Route Detail Drawer** slides out from the right:
   - Displays line-item retail grocery shop drops (e.g., *Bismillah Traders*, *Janani Store*, *Haji & Sons*).
   - Shows individual cash paid vs credit granted.
6. Close the drawer.
7. In the bottom **Action Dock**, click **Resolve Exception**.
8. Select whether to:
   - **Deduct from JSR Salary**: Schedules a ৳400 payroll deduction for Babul Hossain.
   - **Authorize Owner Waiver**: Records an approved proprietor waiver.
   - **Escalate for Investigation**: Leaves the audit flag pending for tomorrow.
9. Click **Confirm**. A confirmation toast notification confirms the state mutation.

### Workflow 4: Interactive Scenario Simulator
1. In the top header of the War Room, click **সিমুলেশন** (Simulation).
2. The Simulation Drawer opens from the right with interactive parameter sliders:
   - **Bank Balance**: Slide between ৳0 and ৳20,00,000.
   - **Vault Cash**: Slide between ৳0 and ৳20,00,000.
   - **48h Auto-Debit Obligation**: Adjust between ৳10,00,000 and ৳1,00,00,000.
   - **Fresh Credit Share**: Test what happens if market credit exceeds the 45% policy limit.
   - **Dispatch Delay Minutes**: Test the cost impact of longer yard stalls.
3. Observe all status badges, coverage bars, and economic figures recalculating dynamically across the entire board.
4. Click **Reset Simulation Values** to return to the verified baseline figures.

### Workflow 5: Multi-Business Portfolio Governance
1. In the top navigation, click **পোর্টফোলিও** (Portfolio) or visit `/businesses`.
2. Inspect the 5 operating entities:
   - **M/S Popy Traders · FMCG Distribution** (Unilever, Sherpur)
   - **Pureit Distribution (Durables)** (Bogura Hub)
   - **Apex Footwear Agency** (Sherpur Town)
   - **Meghna Edible Oil Depot** (Bogura Central)
   - **Square Consumer Wholesale** (Regional Hub)
3. Compare monthly revenues, liquid reserves, active delivery beats, and credit exposure across all businesses side-by-side.
4. Click **Add a business** to test the onboarding modal:
   - Enter a new company name, principal brand, and opening bank float.
   - Select whether to copy ledger structure as reference.
   - Click submit to immediately add the new entity to your active workspace.

---

## 6. Personalization, Display Modes & Languages

### Dual-Theme Architecture (Dark & Light)
- Click the **Sun / Moon** icon in the top header.
- **Dark Mode**: Cinematic low-glare dark surfaces (`#050506`), ideal for evening till closing and wall displays.
- **Light Mode**: Crisp, high-contrast daylight surfaces (`#F7F8FA`), ideal for bright warehouse offices.
- Your theme selection is automatically persisted across browser reloads.

### Display Viewport Tiers
Click the display profile buttons in the top bar:
- **Deck (Standard)**: Two-column balanced density layout for laptops and desktop monitors.
- **Touch (Field Tablet)**: Enlarged touch buttons and single-column layout for iPads and Android tablets used in the warehouse.
- **Wall 4K**: High-contrast 7-tile Bloomberg-grade command wall designed for 55–65" depot TVs, complete with **Burn-In Drift Protection** to prevent screen burn-in.

### Bilingual Toggle (English & বাংলা)
- Click the **বাংলা / English** toggle in the top bar.
- Instantly translates the entire interface, status indicators, and all monetary amounts into authentic Bengali numerals (`৳১৬,৯৫,২০০`).

---

## 7. Understanding Bangladeshi Financial Numbering

distroMesh strictly formats monetary values using the Bangladeshi / Indian numbering convention:

| Formatted Value | Full Numeric Value | Description |
| :--- | :--- | :--- |
| **`৳16,95,200`** | 16 Lakh, 95 Thousand, 200 Taka | Exact mode formatting with commas at thousands, lakhs, and crores. |
| **`৳1.37 Cr`** | 1 Crore, 37 Lakh Taka | Summary mode for working capital and turnover. |
| **`৳8.00 L`** | 8 Lakh Taka | Summary mode for bank liquid balances. |
| **`−৳400`** | Short 400 Taka | Minus prefix with alert styling indicating missing till cash. |
| **`SAFE (2.17×)`** | Liquid coverage ratio | Bank liquid cash covers 2.17 times upcoming supplier obligation sweeps. |
| **`39.58%`** | Market credit ratio | Today's credit sales divided by delivered sales (must remain under 45.0%). |

---

## 8. Frequently Asked Questions & Troubleshooting

### Q1: Why are the delivery vans stalled in the yard at 09:30 AM?
> **Answer**: Check the **Dispatch Delay** indicator in the War Room. The billing room dot-matrix printer (Epson LQ-310) is experiencing a paper jam or faint ribbon. Vans cannot legally leave without 3-part carbon challans for 700 retail grocers. Upgrading to a high-speed thermal billing printer costs approximately ৳3,000 to ৳15,000 and pays for itself within **2.8 operational days** in saved crew wages.

### Q2: Why does the bank balance show ৳8.00 Lakh when we collected ৳8.95 Lakh in cash today?
> **Answer**: The ৳8.95 Lakh collected from evening route returns is physical paper currency sitting inside your depot vault safe. It does not become clearing bank cash until your courier physically deposits the money into Islami Bank. distroMesh intentionally separates vault cash from bank balance so you never write supplier cheques against unposted vault cash.

### Q3: How do I test the resolution of the −৳400 shortage on Van #3?
> **Answer**: In the War Room, scroll to the bottom **Action Dock**. Click **Resolve Exception**. Select **Deduct from JSR Salary** or **Authorize Owner Waiver**, and confirm. The shortage badge will update to `RESOLVED` and an audit entry will be created.

### Q4: Does my session reset if I reload the web page?
> **Answer**: Yes. This live deployment is a demonstration prototype. All data is held in client-side React memory. Refreshing the browser resets the session back to the clean baseline figures.

---

*distroMesh Operations Manual · Engineered for Commercial Distribution House Owners · Sherpur & Bogura Hub.*
