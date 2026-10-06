# distroMesh

distroMesh is a multi-business distribution management dashboard. It gives business owners a portfolio view for comparing businesses, separate workspaces for reviewing each operation, and a consistent path from an overview to the records that need attention.

## What you can do

- Review available sales, cash, receivables, and profit figures across the portfolio.
- Compare selected businesses and inspect sales and operational indicators.
- Open a workspace for each business without combining its ledger with another business.
- Record business relationships, such as product lines, distributors, or retail partners.
- Review transactions, invoices, expenses, cash summaries, and listed alerts.
- Use the sales history chart and contextual review prompts to decide what records to investigate.
- Navigate directly to a business or workspace section using shareable URLs.

## Getting started

### Requirements

- Node.js 20.9 or later
- npm

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The landing page is at `/`; choose the dashboard entry point to open the business portfolio at `/businesses`.

### Production build

```bash
npm run lint
npm run build
npm run start
```

## Application routes

| Route | Purpose |
| --- | --- |
| `/` | distroMesh landing page |
| `/businesses` | Portfolio overview and business comparison |
| `/businesses/{business}/overview` | Selected business workspace |
| `/businesses/{business}/sales-operations` | Sales history and operating indicators |
| `/businesses/{business}/connected-businesses` | Linked business relationships |
| `/businesses/{business}/transactions` | Business transaction activity |
| `/businesses/{business}/invoices` | Invoice records |
| `/businesses/{business}/expenses` | Expense records |
| `/businesses/{business}/cash-flow` | Cash and activity summary |
| `/businesses/{business}/alerts` | Alerts and review tasks |
| `/businesses/{business}/ask` | Contextual questions about the displayed business information |

Use a business identifier from the sidebar or portfolio. Selecting a business opens its Overview; the sidebar also links to its principal sections. Browser Back and Forward follow the selected business and section.

## Technology

- Next.js 16 App Router and React 19
- TypeScript
- Tailwind CSS
- Recharts for responsive, data-driven sales visualization
- Lucide icons

## Current implementation status

The interface, navigation, portfolio comparisons, business workspaces, sales visualization, local record-entry flows, and contextual prompts are implemented. The current application is a front-end implementation: it has no authentication, server-side business database, durable record storage, or connected banking, accounting, inventory, order, or delivery integrations.

The seeded businesses, financial values, sales history, operational indicators, and sample activity are illustrative. New businesses and entries created in the interface are held in client-side application state and are not durable records; reloading the app restores the seeded workspace. Some actions, including receipt storage and account/security settings, are not connected to a production service. The question panel uses simple rules against currently displayed information and is not an AI adviser.

Do not use the sample figures as actual results or for financial decisions. Before operating with live businesses, add persistent storage and access controls, connect reliable source systems or controlled data entry, and validate data coverage, reporting periods, and calculations.

## Project structure

```text
src/
  app/                 App Router pages and workspace routes
  components/
    executive/         Portfolio, business workspace, navigation, and operations UI
    marketing/         Landing page
  context/             Client-side workspace state
  data/                Portfolio sample data and calculations
  types/               Shared TypeScript types
  utils/               Route and formatting helpers
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run lint` | Run ESLint |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
