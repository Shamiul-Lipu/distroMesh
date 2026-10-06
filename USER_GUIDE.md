# distroMesh: Non-Technical User Guide & Operations Manual

Welcome to **distroMesh**. This guide is written for business owners, warehouse managers, cashiers, and accountants who run day-to-day distribution operations.

You do **not** need any computer science or technical background to use this guide or the distroMesh software.

---

## 1. What is distroMesh?

If you run a distribution business (like **M/S Popy Traders** delivering Unilever products in Sherpur and Bogura), you handle millions of taka every single day across delivery vans, hundreds of retail grocery shops, and credit accounts.

**distroMesh** is your digital financial command center. It helps you:
1. **Stop Cash Leakage**: Ensure every single taka handed in by delivery vans matches the invoices down to the last coin.
2. **Control Market Credit**: Prevent grocery shops from taking too much goods on credit without paying off old dues.
3. **Avoid Bank Bounces**: Make sure you have enough cash in the bank before Unilever's 48-hour auto-debit sweeps your account.
4. **Fix Bottlenecks**: See where delays happen (like billing printer jams that hold up your vans in the morning).

---

## 2. Getting Started & Logging In

### How to Open the App
1. Open your web browser (Google Chrome, Microsoft Edge, or Safari).
2. Go to the dashboard web address (e.g., `http://localhost:3000` or your company's web link).
3. Click on **Portfolio** to see all your businesses, or click on **M/S Popy Traders (Unilever Distribution)**.

### Switching Between English and Bangla (বাংলা)
- Look at the top-right corner of the screen.
- Click the **EN / BN** button.
- The entire page, including all numbers (`১, ২, ৩...`) and financial terms, will switch between English and Bengali instantly.

### Choosing Your Role
At the top of the screen, you will see a role selector:
- **Owner / CEO**: Shows high-level profit, working capital, and major approval buttons.
- **Operations Manager**: Focuses on van dispatch times, route delivery progress, and printer status.
- **Vault Cashier**: Focuses on counting cash notes, opening cash floats, and finding cash shortages.
- **Field Viewer**: A read-only view for audit teams.

### Changing Display Views (Deck / Field / Wall 4K)
- **Deck**: Best for working at an office desk on a laptop or desktop computer.
- **Field**: Clean, large-card layout best for iPads or Android tablets on the warehouse floor.
- **Wall (4K)**: Ultra-clear, high-contrast display designed to run on a large TV screen mounted on the warehouse wall so everyone can see van progress at a glance.

---

## 3. The Daily 4-Step Distribution Routine

Here is how your team uses distroMesh from morning to evening:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ 1. MORNING      │     │ 2. AFTERNOON    │     │ 3. EVENING      │     │ 4. NIGHT/BANK   │
│ Dispatch &      │ ──▶ │ Delivery & Live │ ──▶ │ Cash Hand-In &  │ ──▶ │ Auto-Debit &    │
│ Float           │     │ Market Credit   │     │ Vault Settlement│     │ Bank Deposit    │
│ (07:00 - 09:00) │     │ (10:00 - 16:00) │     │ (17:00 - 19:30) │     │ (Next 48 Hours) │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

### Step 1: Morning Dispatch (07:00 AM – 09:00 AM)
*Goal: Get all delivery vans loaded, invoices printed, and cash floats recorded on time.*

1. **Check the Billing Desk**:
   - Open the **War Room** (`/war-room`).
   - Check the **Dispatch Delay** card. If it says `+165 min (CRITICAL)`, check the dot-matrix printer in the billing room. Paper jams here mean delivery vans are sitting idle, costing your business roughly ৳4,950 in wasted driver and loader wages.
2. **Set the Opening Float**:
   - The cashier gives each van or till an initial pool of change money (usually **৳50,000** total).
   - Verify that this opening float is entered correctly into the system.

---

### Step 2: Afternoon Delivery Monitoring (10:00 AM – 04:00 PM)
*Goal: Track shop deliveries and keep market credit under control.*

1. **Watch the Delivered Sales Card**:
   - As your delivery men (JSRs) deliver goods to grocery stores, this number will tick up toward your daily target of **৳9,60,000** (700 shop drops).
2. **Watch the Market Credit Share**:
   - In FMCG distribution, shops always ask for credit.
   - Look at the **Credit Share** metric. Company policy says credit must stay **below 45.0%**.
   - If the credit share reaches 40% or more, tell your Order Bookers (SRs) to stop giving fresh credit until older dues are collected in cash.
3. **Locking Problem Retailers**:
   - If a retailer has not paid their bills for over 30 days, click the **Pause Credit** button at the bottom of the screen.
   - This prevents delivery vans from unloading new goods at that shop until they pay down their outstanding balance.

---

### Step 3: Evening Cash Hand-In & Reconciliation (05:00 PM – 07:30 PM)
*Goal: Collect cash from each van and make sure not a single taka is missing.*

When the 6 vans return to the warehouse:
1. **Open the 12-Route Settlement Table** (on the left side of the War Room):
   - You will see each route from Route 101 to Route 112.
   - For each van, the table shows:
     - **Delivered (৳)**: Total goods delivered.
     - **Cash (৳)**: Cash collected from today's sales.
     - **Credit (৳)**: Goods left on credit.
     - **Old Dues (৳)**: Cash collected from old debts.
     - **Expenses (৳)**: Fuel vouchers, CNG gas, or road tolls paid by the driver.
     - **Handed In (৳)**: Actual cash the driver must hand over to the cashier.
2. **Reviewing Individual Retailer Invoices**:
   - Click on any route row in the table (for example, click **Van #1** or **Van #3**).
   - A box will open directly underneath showing all retail shop bills on that route (e.g., Haji Store, Bismillah Grocers).
   - You can see exactly how much cash that shop paid, how much was on credit, and whether their receipt was signed.
3. **Cashier Vault Count**:
   - The vault cashier counts the physical cash notes (৳1000, ৳500, ৳200, ৳100 bills).
   - Today's counted total should equal **৳8,95,200**.
4. **Spotting Cash Variances (Shortages)**:
   - Check the **Till Variance** card.
   - If it shows **`−৳400 (ACTION REQUIRED)`**, the system is warning you that Van #3 (JSR Babul on Route 103) is short ৳400.
   - Click the **Open Shortage Case** button at the bottom:
     - **Option A (Deduct from Salary)**: Automatically schedules a ৳400 deduction from the delivery man's next payroll.
     - **Option B (Waiver)**: If the shortage was an unavoidable rounding error, the Owner can click "Approve Waiver" to close the case.

---

### Step 4: Bank Deposits & 48-Hour Unilever Auto-Debit
*Goal: Ensure the bank account has enough funds so the company's supply contract is safe.*

1. **Check the 48h Principal Auto-Debit Card**:
   - Unilever Bangladesh automatically debits your bank account for **৳54,00,000** every 48 hours to pay for company stock.
2. **Check Your Available Liquid Cash**:
   - Your total liquid cash is **৳16,95,200** (৳8,00,000 already in Islami Bank + ৳8,95,200 cash sitting physically in your warehouse vault).
3. **Move Vault Cash to the Bank**:
   - Cash sitting in your warehouse safe does **not** protect you from bank bounces.
   - Click the **Prepare Bank Deposit** button at the bottom of the War Room.
   - Enter the deposit amount (e.g., ৳8,00,000) and click **Confirm Deposit**.
   - Send your cashier with security to deposit the physical cash at the bank branch before the 03:00 PM banking cutoff.

---

## 4. How to Read the Numbers on the Screen

Financial numbers on distroMesh are formatted to match Bangladeshi accounting standards:

| What You See | What It Means | Why It Matters |
| :--- | :--- | :--- |
| **`৳16,95,200`** | 16 Lakh, 95 Thousand, 200 Taka | Bangladeshi grouping (commas at thousands, lakhs, and crores). |
| **`৳1.37 Cr`** | 1 Crore 37 Lakh Taka | Summary abbreviation for large working capital balances. |
| **`৳8.00 L`** | 8 Lakh Taka | Summary abbreviation for liquid bank or vault cash. |
| **`−৳400`** | Short 400 Taka | A red or amber minus sign means cash is missing and needs investigation. |
| **`SAFE (2.17×)`** | Liquid cash is safe | Your cash reserves cover more than 2 times your immediate daily needs. |
| **`39.6%`** | Market Credit Share | Percentage of today's sales given out on credit (must stay under 45%). |

---

## 5. Understanding the 4 Action Buttons at the Bottom

At the bottom of the War Room, you will find the **Executive Action Dock**:

1. **🔴 Pause Credit**:
   - *When to use*: When total market credit crosses 40%, or when specific retailers have unpaid bills older than 30 days.
   - *What it does*: Puts an immediate delivery freeze on high-risk shops.
2. **🏦 Prepare Bank Deposit**:
   - *When to use*: Every afternoon between 01:00 PM and 02:30 PM.
   - *What it does*: Creates a bank deposit voucher to transfer physical vault cash into your Islami Bank clearing account.
3. **⚠️ Open Shortage Case**:
   - *When to use*: Whenever the "Till Variance" number is not zero (e.g., −৳400).
   - *What it does*: Opens an incident report to either deduct the missing cash from driver payroll or approve an owner waiver.
4. **✅ Review and Close Day**:
   - *When to use*: At 07:30 PM after all 12 routes have returned, all cash is counted, and the vault is locked.
   - *What it does*: Finalizes today's ledger, freezes the numbers for accounting, and archives the daily report.

---

## 6. Frequently Asked Questions (FAQ)

### Q1: Why is my delivery van sitting in the warehouse at 08:30 AM?
> **Answer**: Look at the **Billing Bottleneck** card. The dot-matrix printer (Epson LQ-310) in the billing office is likely jamming or running out of ribbon. The warehouse cannot dispatch vans until 3-part carbon challans are printed for all 700 shops. Replacing or upgrading this printer pays for itself in just **2.8 days**.

### Q2: A shop owner claims he paid cash, but the app shows him on credit. How do I check?
> **Answer**: Go to the **War Room**, find the van that serves his market, and click that row in the table. Scroll down to find the shop's name. Check the **Cash Paid** vs **Credit** columns. If the driver marked it as credit, ask the driver for the signed physical invoice slip.

### Q3: Why does the bank balance say ৳8.00L when we collected ৳8.95L in cash today?
> **Answer**: Cash collected from the market is currently physical paper notes in your warehouse vault. It does not become "Bank Cash" until your staff deposits it into Islami Bank. Keep vault cash and bank balance separate so you never write checks you cannot cover.

### Q4: What should I do if the internet goes down during delivery?
> **Answer**: Delivery men can continue delivering goods and collecting cash on their handheld mobile apps offline. As soon as their phone reconnects to mobile data or warehouse Wi-Fi in the evening, all records will upload automatically without losing any data.

---

## 7. Need Help or Want to Ask a Question?

If you are unsure about any number or want a fast summary, click **Ask distroMesh** in the left sidebar menu:
- Type questions like:
  - *"How much cash do we have in the vault right now?"*
  - *"Which routes had cash shortages today?"*
  - *"Who are our top 3 overdue credit retailers?"*
- The system will answer instantly using your live business records.
