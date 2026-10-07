# distroMesh: Platform Overview & Operations Manual (USER_GUIDE)

Welcome to **distroMesh**. This manual is written for distribution business owners, general managers, warehouse supervisors, vault cashiers, and commercial accountants who run day-to-day distribution operations.

You do **not** need any computer science or software background to use distroMesh or this manual.

---

## 1. Executive Platform Overview

### What is distroMesh?

If you run an FMCG or durables distribution house in Bangladesh (such as **M/S Popy Traders** operating across the **Sherpur & Bogura Hub** for Unilever Bangladesh, Pureit, and allied consumer brands), your business handles millions of taka each day across delivery vans, hundreds of retail grocery shops, field salesmen, and supplier credit lines.

In high-volume distribution, profit margins are tight (typically 2.5% to 5.5%). A single uncollected invoice, a careless cashier till shortage, or a delayed delivery van directly burns your net earnings.

**distroMesh is your centralized commercial command center.** It provides an operational and financial operating system engineered specifically to:

1. **Stop Till & Route Leakage**: Reconcile every single taka handed in by van crews against delivered challans with mathematical proof down to the exact coin.
2. **Enforce Market Credit Ceilings**: Prevent field order bookers (SRs) from extending fresh credit to retail grocery shops when past-due market balances exceed company limits.
3. **Protect Principal Auto-Debits**: Separate physical warehouse vault cash from clearing bank balances to prevent dishonored auto-debits from principal companies (like Unilever's 48-hour RTGS sweeps).
4. **Eliminate Yard Bottlenecks**: Pinpoint morning dispatch delays (such as billing printer breakdowns) and calculate the exact wage loss of stalled van crews.
5. **Manage Multi-Business Holdings**: Oversee multiple distribution agencies and legal entities under one owner with separate books, distinct bank accounts, and aggregated portfolio visibility.

---

## 2. Navigating the distroMesh Platform

distroMesh is organized into three primary operational workspaces:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                            DISTROMESH WORKSPACES                             │
├───────────────────────┬──────────────────────────────┬───────────────────────┤
│ 1. BUSINESS PORTFOLIO │ 2. EXECUTIVE CONTROL BOARD   │ 3. BUSINESS WORKSPACE │
│    (/businesses)      │    (/.../war-room)           │    (/.../overview)    │
│                       │                              │                       │
│ • Cross-company view  │ • Live ops telemetry (clock) │ • General ledger      │
│ • Multi-agency cash   │ • 12-route settlement table  │ • Daily P&L breakdown │
│ • Entity onboarding   │ • Dispatch runway tracking   │ • Working capital map │
│ • Inter-company links │ • Executive action dock      │ • AI financial helper │
└───────────────────────┴──────────────────────────────┴───────────────────────┘
```

### Workspace 1: Multi-Business Portfolio (`/businesses`)
Built for proprietors managing multiple commercial distribution agencies. In one screen, view consolidated capital, monthly turnover across all businesses, combined retail drop counts, and individual entity health cards.

- **Entity Isolation**: Each agency (e.g., *M/S Popy Traders - Unilever Distribution*, *Pureit Durables Division*, *Apex Footwear Agency*, *Meghna Edible Oil Depot*, *Square Consumer Wholesale*) maintains completely isolated financial records, receivables, and tax obligations.
- **Add a Business**: Click **Add a business** to configure a new principal contract, bank buffer, depot location, or linked subsidiary.
- **Connect Existing**: Link relationships between sister companies (e.g., supplier-retailer or common logistics fleet) without commingling cash reserves.

### Workspace 2: Executive Control Board (`/businesses/[id]/war-room`)
The primary operational nerve center used during active business hours (07:00 AM – 08:00 PM). Designed for high-density visual monitoring on office desktops, warehouse tablets, or wall-mounted depot TV screens.

- **Live Ops Header**: Live operations clock, current operational shift (Morning Dispatch, Field Deliveries, Evening Vault Close), and active risk telemetry.
- **Liquidity Runway**: Real-time ratio of liquid cash versus upcoming supplier payment sweeps.
- **Trapped Capital Matrix**: Categorized view of capital tied up in overdue customer credit, damaged warehouse stock, and pending manufacturer scheme claims.
- **Dispatch Runway & Bottleneck Radar**: Step-by-step progress of morning delivery van departures, pinpointing printer or loading jams.
- **Route Settlement Matrix**: Live breakdown of all 12 delivery beats, comparing expected till collections against physical driver hand-ins.
- **Executive Action Dock**: One-touch controls to lock market credit, authorize bank deposit vouchers, or sign off on daily ledger closing.

### Workspace 3: Business Operations & Ledger Workspace (`/businesses/[id]`)
The operational accounting dashboard for bookkeepers and general managers.

- **Financial Summary**: Monthly P&L table showing delivered gross revenue, cost of goods sold, van fleet operating overhead, interest, taxes, and net profit margins.
- **Working Capital Breakdown**: Direct visibility into Days Sales Outstanding (DSO), Days Inventory Outstanding (DIO), and Cash Conversion Cycle (CCC).
- **Recent Transactions Ledger**: Searchable, filterable ledger of invoices, supplier payments, and expense vouchers with `⌘K` quick search.
- **Ask distroMesh (AI Assistant)**: Real-time contextual assistant that answers commercial queries from current ledger figures.

---

## 3. Display Customization, Themes & Language

distroMesh adapts to any operating environment, from executive desks to warehouse packing floors:

### Dedicated Dual-Theme Architecture (Dark & Light)
- **Dark Mode**: Cinematic, low-strain interface (`#050506` base) with layered card surfaces and distinct alert badges. Ideal for low-light management offices, evening reconciliation, or wall-mounted displays.
- **Light Mode**: High-contrast, clean editorial layout (`#F7F8FA` base) with crisp borders and optimal daytime readability in bright depots.
- **How to Switch**: Click the **Sun / Moon** icon in the top header or sidebar. Your theme preference is automatically remembered on your device.

### Display Profiles (Deck / Touch / Wall 4K)
Click the screen mode toggle in the top control bar to switch layouts:
- **Deck (Standard)**: Optimized for keyboard-and-mouse laptop or desktop computer use.
- **Touch (Field / Tablet)**: Enlarged touch targets and simplified drawers designed for warehouse supervisors carrying iPads or rugged Android tablets.
- **Wall (4K Display)**: High-contrast, high-legibility telemetry profile built to run full-screen on a depot TV monitor so drivers, loaders, and managers share single-source situational awareness.
- **WakeLock Support**: When operating on a depot wall display or cashier tablet, distroMesh automatically keeps the display awake without sleeping.

### Instant English / Bangla (বাংলা) Numerals & Text
- Click the **EN / BN** toggle in the top control bar.
- Instantly translates interface terms, status badges, and all numbers into Bengali numerals (`৳১৬,৯৫,২০০`, `১, ২, ৩...`).

---

## 4. The 4 Operational Roles

distroMesh provides four distinct role perspectives configured in the top navigation:

| Role | Primary User | Primary Screen Focus | Available Permissions |
| :--- | :--- | :--- | :--- |
| **Owner / CEO** | Proprietor / Managing Director | Liquidity runway, profit margins, capital trapped in credit, bank sweep coverage | Full authority to lock credit, approve cashier shortage waivers, and authorize bank deposits |
| **Operations Manager** | Warehouse In-Charge / Dispatch Manager | Van departure runway, printer bottlenecks, return damages, JSR driver progress | Inspect route manifests, log hardware repairs, review shop-level delivery slips |
| **Vault Cashier** | Chief Cashier / Depot Accountant | Physical currency note counter, till variance cards, route hand-in table | Log opening floats, record driver cash hand-ins, prepare bank deposit vouchers |
| **Field Auditor** | Internal Audit / Principal Inspector | Route variance table, credit ageing bands, mathematical balance identities | Read-only ledger inspection, exception audit logs, historical trail review |

---

## 5. The Daily 4-Phase Distribution Cycle

distroMesh follows the real rhythm of a fast-moving FMCG distribution depot from dawn to dusk:

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│ 1. MORNING          │     │ 2. AFTERNOON        │     │ 3. EVENING          │     │ 4. NIGHT / BANK     │
│ Dispatch & Float    │ ──▶ │ Delivery & Live     │ ──▶ │ Hand-In & Cashier   │ ──▶ │ Principal Sweeps &  │
│ (07:00 - 09:00 AM)  │     │ Credit Telemetry    │     │ Reconciliation      │     │ Next 48-Hour Safety │
│                     │     │ (10:00 AM - 04:00)  │     │ (05:00 - 07:30 PM)  │     │ (08:00 PM Onwards)  │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘     └─────────────────────┘
```

---

### Phase 1: Morning Dispatch & Float Allocation (07:00 AM – 09:00 AM)
*Operational Objective: Dispatch all 12 delivery vans loaded, with accurate invoices printed and initial cash floats issued before 09:00 AM.*

1. **Inspect the Dispatch Runway**:
   - Open the **Executive Control Board** (`/.../war-room`).
   - Check the **Field Execution & Dispatch Runway** card.
   - If the status displays `BOTTLENECK ACTIVE: BILLING PRINTER` or shows a delay exceeding `+30 min`, immediately inspect the dot-matrix billing desk.
   - *Financial Impact*: Stalled delivery vans leave 24 delivery men (JSRs) and helpers idling in the yard. distroMesh automatically calculates the accumulated idle crew wage cost (e.g., 165 minutes delayed = ৳4,950 in unrecoverable wage leakage).
   - *Quick Resolution*: Click **Audit Impact** or **Incident Detail** to review printer repair payback (a modern replacement pays for itself within 2.8 operational days).
2. **Issue Opening Vault Float**:
   - The chief cashier issues physical change floats (typically **৳50,000** total across routes).
   - Ensure the opening float balance is reflected in the Till Reconciliation card before the first van leaves the gate.

---

### Phase 2: Afternoon Delivery Monitoring & Credit Control (10:00 AM – 04:00 PM)
*Operational Objective: Track retail drops across all 12 beats while strictly enforcing the 45.0% market credit ceiling.*

1. **Monitor Delivered Sales Velocity**:
   - As Junior Sales Representatives (JSRs) make deliveries across grocery shops, the **Delivered Sales** figure progresses toward the daily depot target (৳9,60,000 across 700 drop points).
2. **Enforce the Market Credit Ceiling**:
   - In FMCG wholesale, retail grocers constantly demand credit.
   - Watch the **Credit Share** gauge. Company policy requires credit to remain strictly **below 45.0%** of delivered value.
   - If market credit rises toward 40%, notify Order Bookers (SRs) on those beats to collect past-due cash before booking fresh deliveries.
3. **One-Tap Credit Lock**:
   - If market credit exceeds safe thresholds or delinquent retail accounts fail to clear balances older than 30 days, navigate to the **Executive Action Dock** at the bottom of the screen.
   - Click **Pause Customer Credit**. This triggers an emergency credit lock notification to all field handhelds, preventing unauthorized credit unloading.

---

### Phase 3: Evening Cash Hand-In & Till Reconciliation (05:00 PM – 07:30 PM)
*Operational Objective: Collect cash from returning van crews and prove that physical money matches invoiced records down to the last taka.*

1. **Open the 12-Route Settlement Matrix**:
   - When vans return to the warehouse yard, locate the **Route Settlement Matrix** table.
   - Review each route from Route 101 to Route 112:
     - **Delivered (৳)**: Total gross value of goods offloaded at retail shops.
     - **Cash Collected (৳)**: Cash collected from today's deliveries.
     - **Credit Issued (৳)**: Goods left on credit.
     - **Old Dues Collected (৳)**: Cash recovered from prior credit balances.
     - **Route Expenses (৳)**: Driver road fuel, bridge tolls, or CNG receipts deducted with cashier authorization.
     - **Expected Cash (৳)**: Exact mathematical cash amount the driver must physically hand to the cashier.
2. **Audit Individual Shop Challans**:
   - Click on any route row (e.g., *Van #03 - Route 103 (Babul / JSR)*).
   - Click **Route Detail** or open the drawer to view line-item retail challans (e.g., Haji General Store, Bismillah Grocers).
   - Verify signed carbon slips against recorded cash and credit numbers.
3. **Physical Vault Currency Count**:
   - The cashier tallies physical notes (৳1000, ৳500, ৳200, ৳100 bills).
   - Total counted currency is entered into the system (e.g., counted till cash of **৳8,95,200**).
4. **Spotting and Resolving Till Variances (Shortages)**:
   - Check the **Till Variance** indicator.
   - A negative value (e.g., **`−৳400`**) indicates cash shortage:
     - **Option A (Payroll Deduction)**: If cash shortage is caused by delivery team discrepancy, assign an automated payroll deduction scheduled for the upcoming pay cycle.
     - **Option B (Owner Waiver)**: If the shortage is an authorized minor coin-rounding discrepancy, the business owner can approve a managerial waiver with an audit comment.

---

### Phase 4: Night Bank Sweep & Manufacturer Clearing (07:30 PM Onwards)
*Operational Objective: Ensure the clearing bank account contains sufficient liquid funds to honor upcoming supplier payments.*

1. **Inspect Principal Obligation Sweep**:
   - Unilever Bangladesh sweeps your clearing account automatically via RTGS (e.g., **৳54,00,000** due every 48 hours).
   - View the **Liquidity Runway & Bank Obligation** card.
2. **The Golden Rule: Vault Cash is NOT Bank Cash**:
   - Physical currency notes locked in your warehouse safe do **not** protect your business from bank dishonors.
   - Check your bank buffer balance (e.g., ৳8,00,000 in Islami Bank) versus physical vault cash (৳8,95,200 in the safe).
3. **Prepare Bank Deposit Voucher**:
   - In the **Executive Action Dock**, click **Prepare Bank Deposit**.
   - Input the deposit voucher amount (e.g., ৳8,00,000) and click **Confirm Deposit**.
   - Generate the deposit voucher slip for armed courier escort to the bank branch before clearing cutoff.
4. **Review & Close Day**:
   - Once all 12 van routes are marked `OK`, the cashier till count matches expected funds, and deposit vouchers are logged, click **Review and Close Day**.
   - Freezes the daily ledger, writes audit timestamps, and archives the business day.

---

## 6. The 10 Invariant Mathematical Identities

distroMesh is built upon **10 non-negotiable mathematical balance equations**. These formulas cannot be bypassed or manually edited, ensuring absolute commercial transparency:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    THE 10 MATHEMATICAL BALANCE IDENTITIES                    │
├────┬───────────────────────────────────────┬─────────────────────────────────┤
│ ID │ FORMULA                               │ COMMERCIAL MEANING              │
├────┼───────────────────────────────────────┼─────────────────────────────────┤
│ 1  │ Delivered = Cash Sales + Credit Sales │ Every taka offloaded from a van │
│    │                                       │ must be paid in cash or credit. │
├────┼───────────────────────────────────────┼─────────────────────────────────┤
│ 2  │ Handed In = Cash Sales + Old Dues     │ Cash received equals today's    │
│    │             Collected - Expenses      │ sales plus old debt recoveries. │
├────┼───────────────────────────────────────┼─────────────────────────────────┤
│ 3  │ Expected Till = Opening Float +       │ Mathematical formula for the    │
│    │                 Cash Handed In        │ exact cash that must be in till.│
├────┼───────────────────────────────────────┼─────────────────────────────────┤
│ 4  │ Till Variance = Counted Cash -        │ Difference between counted cash │
│    │                 Expected Till         │ and mathematical expected till. │
├────┼───────────────────────────────────────┼─────────────────────────────────┤
│ 5  │ Credit Share = Credit Sales ÷         │ Percentage of today's sales on  │
│    │                Delivered Sales        │ credit (must stay below 45%).   │
├────┼───────────────────────────────────────┼─────────────────────────────────┤
│ 6  │ Vault Cash ≠ Bank Balance             │ Safe cash is NOT in bank until  │
│    │                                       │ physical deposit slip posts.    │
├────┼───────────────────────────────────────┼─────────────────────────────────┤
│ 7  │ Closing Dues = Opening Dues +         │ Accounts receivable balance     │
│    │ Fresh Credit - Old Dues Collected     │ roll-forward consistency.       │
├────┼───────────────────────────────────────┼─────────────────────────────────┤
│ 8  │ Working Capital = Receivables +       │ Real operational capital tied   │
│    │ Stock Value - Supplier Payables       │ up in running daily routes.     │
├────┼───────────────────────────────────────┼─────────────────────────────────┤
│ 9  │ Net Profit = Revenue - COGS -         │ Comprehensive monthly P&L       │
│    │ Delivery Costs - Overhead - Tax       │ reconciliation formula.         │
├────┼───────────────────────────────────────┼─────────────────────────────────┤
│ 10 │ Payroll Overhead ≤ Operating Budget   │ Headcount wage ceiling check    │
│    │ (57 Staff Headcount in Demo Scope)    │ across all depot personnel.     │
└────┴───────────────────────────────────────┴─────────────────────────────────┘
```

---

## 7. The Executive Action Dock & Decision Buttons

Located permanently at the bottom of the **Executive Control Board**, these four controls mutate real operational business state:

### 1. 🔴 Pause Customer Credit (`CREDIT_LOCK`)
- **When to Use**: When market credit exceeds 40.0%, or specific retailer balances remain unpaid past 30 days.
- **What it Does**: Activates an emergency credit pause across all van handhelds, freezing new credit drops until overdue invoices are settled.

### 2. 🏦 Prepare Bank Deposit (`BANK_DEPOSIT`)
- **When to Use**: Daily between 01:00 PM and 02:30 PM prior to the commercial bank clearing window.
- **What it Does**: Converts counted warehouse safe cash into a formal deposit slip, transferring funds from the warehouse vault to your clearing account.

### 3. ⚠️ Till Variance Exception Resolution (`EXCEPTIONS`)
- **When to Use**: Whenever the till variance card shows a discrepancy (e.g., `−৳400`).
- **What it Does**: Launches an audit window allowing management to either schedule a payroll deduction for the responsible delivery crew or record an authorized owner waiver.

### 4. ✅ Review and Close Day (`DAY_END_CLOSE`)
- **When to Use**: At the end of the shift once all 12 delivery beats have returned, physical cash has been verified, and bank deposits have been dispatched.
- **What it Does**: Freezes the operational day, creates permanent audit timestamps, and archives the daily performance ledger.

---

## 8. Deep-Dive Investigation Drawers

Whenever you need deeper forensic visibility into a specific number, clicking any card or metric opens a specialized investigation drawer:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                      6 SPECIALIZED INVESTIGATION DRAWERS                     │
├──────────────────────────┬───────────────────────────────────────────────────┤
│ 1. ROUTE DETAIL DRAWER   │ Line-item shop challans for any selected delivery │
│                          │ beat, showing cash, credit, and signed slips.     │
├──────────────────────────┼───────────────────────────────────────────────────┤
│ 2. RECONCILIATION DRAWER │ Full cashier audit breakdown showing opening      │
│                          │ float, route cash receipts, and till count proof. │
├──────────────────────────┼───────────────────────────────────────────────────┤
│ 3. INCIDENT AUDIT DRAWER │ Engineering root-cause report for hardware jams   │
│                          │ and printer mispicks, with payback calculations.  │
├──────────────────────────┼───────────────────────────────────────────────────┤
│ 4. OBLIGATION DRAWER     │ 48-hour cash sweep projection comparing liquid    │
│                          │ bank cash against upcoming manufacturer drafts.   │
├──────────────────────────┼───────────────────────────────────────────────────┤
│ 5. WORKING CAPITAL DRAWER│ Breakdown of DSO (receivables), DIO (inventory),  │
│                          │ and DPO (payables) across all operational brands. │
├──────────────────────────┼───────────────────────────────────────────────────┤
│ 6. ACTION MODAL DIALOGS  │ High-contrast, two-step confirmation dialogs for  │
│                          │ irreversible financial state mutations.           │
└──────────────────────────┴───────────────────────────────────────────────────┘
```

---

## 9. Understanding Bangladeshi Financial Numbers

All monetary figures on distroMesh strictly follow Bangladeshi accounting conventions and the Indian numbering grouping system:

| What You See | Full Numeric Value | Commercial Context & Significance |
| :--- | :--- | :--- |
| **`৳16,95,200`** | 16 Lakh, 95 Thousand, 200 Taka | Exact mode displays exact taka with comma groupings at thousands, lakhs, and crores. |
| **`৳1.37 Cr`** | 1 Crore, 37 Lakh Taka | Summary mode for high-value working capital and monthly gross turnover. |
| **`৳8.00 L`** | 8 Lakh Taka | Summary mode for bank liquid balances and route float ceilings. |
| **`−৳400`** | Short 400 Taka | Minus sign prefix with red/amber alert styling indicating missing till cash. |
| **`SAFE (2.17×)`** | Liquid coverage ratio | Bank liquid cash covers 2.17 times upcoming supplier obligation sweeps. |
| **`39.6%`** | Market credit ratio | Today's credit sales divided by delivered sales (must remain under 45.0%). |

---

## 10. AI Commercial Assistant: "Ask distroMesh"

For instant answers without clicking through multi-level menus, use the embedded financial assistant:

- **Quick Access**: Press **`⌘ K`** (Mac) or **`Ctrl + K`** (Windows) anywhere in the application, or click **Ask about your business** in the ledger sidebar.
- **Example Queries**:
  - *"What is our available liquid cash across vault and bank right now?"*
  - *"Which routes experienced till shortages during evening settlement?"*
  - *"Show me all retail grocery shops with overdue credit exceeding 30 days."*
  - *"Are we covered for tomorrow's Unilever 48-hour auto-debit?"*
- **Safety Note**: The AI assistant responds exclusively using real mathematical data currently loaded into your active session. It does not fabricate estimates or hallucinate unverified projections.

---

## 11. Frequently Asked Questions (FAQ)

### Q1: Why are delivery vans waiting in the yard at 08:30 AM instead of departing?
> **Answer**: Check the **Dispatch Delay** radar on the control board. If the status indicates a critical billing bottleneck, the billing room dot-matrix printer (Epson LQ-310) is likely experiencing a paper feed jam or faded ribbon ribbon issue. Because vans cannot legally leave without 3-part carbon challans for 700 retail grocers, dispatch is blocked. Upgrading to a high-speed thermal billing printer costs approximately ৳3,000 and pays for itself within **2.8 operational days** in saved van crew wages.

### Q2: A grocery retailer claims he paid cash to the delivery man, but the app shows him on credit. How do we resolve this?
> **Answer**: Open the **Route Settlement Matrix**, click the driver's route, and select **Route Detail**. Locate the grocer's name. Check the **Cash Collected** and **Credit Issued** columns. If the driver marked the delivery as credit, request the driver's physical signed delivery challan slip. If the slip is signed as cash, the driver owes that cash to the cashier till.

### Q3: Why does our bank balance display ৳8.00 Lakh when we collected ৳8.95 Lakh in cash today?
> **Answer**: The ৳8.95 Lakh collected from evening route returns is physical paper currency sitting inside your depot safe. It does not become clearing bank cash until your courier physically deposits the money into Islami Bank. distroMesh intentionally separates vault cash from bank balance so you never write supplier cheques against unposted vault cash.

### Q4: What happens if field salesmen lose mobile internet connectivity during deliveries?
> **Answer**: The field handheld client operates fully offline. Order bookers and delivery drivers can continue recording shop drops, issuing invoices, and logging collections without active internet. When vans return to depot Wi-Fi in the evening, all offline challans automatically sync into distroMesh without missing records or duplicated serial numbers.

### Q5: How do I onboard a new distribution business or branch agency?
> **Answer**: Navigate to **Business Portfolio** (`/businesses`). Click **Add a business**. Enter the commercial name, depot location, principal brands (e.g., Akij, Pran, Meghna), opening bank buffer, and employee count. The new agency is immediately provisioned with its own independent ledger, route matrices, and cash controls.

---

*distroMesh Platform Operations Manual · Version 2.4.0 · For M/S Popy Traders (Sherpur & Bogura Hub) and Commercial Distribution Houses.*
