# distroMesh: Platform Overview

## Purpose

distroMesh brings a distribution operator’s business portfolio into one dashboard while keeping each business’s activity and relationships distinct. The platform is designed to help owners move from a portfolio-level scan to a focused review of the business, metric, or record that needs attention.

The application includes a public landing page and an interactive business workspace. It supports portfolio review, business selection, comparison, business relationships, sales and operations summaries, daily record views, and contextual review prompts.

## Platform capabilities

### Portfolio management

The **All businesses** view presents available business-level sales, cash, receivables, and profit figures, with coverage information where values are missing. Users can open any business, review signals in the portfolio snapshot, and select businesses for side-by-side comparison.

Portfolio comparisons include measures such as available cash, monthly sales and profit, profit margin, sales movement, invoice flags, delivery rates, and product or channel indicators when those values are present. The dashboard distinguishes unavailable information from a measured zero.

### Separate business workspaces

Each business has its own workspace for reviewing its summary, transactions, invoices, expenses, operating indicators, and connected businesses. Selecting another business navigates to that business’s workspace; its ledger activity is not merged into another business’s records.

Business workspaces include:

- An overview of the selected business.
- Sales and operations indicators, including monthly sales history when available.
- A responsive Recharts area chart with BDT-formatted axes and interactive value details.
- Cash and receivables snapshots.
- Invoice and expense records, with direct navigation to the relevant section.
- Contextual review prompts with links to the area where a user can investigate further.

When dated history is unavailable or current filters make the history inapplicable, the dashboard explains why it cannot show a trend rather than presenting a fabricated chart.

### Business relationships

Users can add a business as a separate workspace, connect existing businesses, and record relationships such as a product line, local distributor, or retail partner. A relationship makes the connection visible and navigable; it does not combine balances, ownership, or ledger entries.

### Daily work and insights

The sidebar provides direct access to:

| Area | Included workspace |
| --- | --- |
| Daily work | Transactions, invoices, and expenses |
| Insights and help | Cash and activity summaries, alerts and tasks, and business questions |
| Business navigation | Portfolio, all available business workspaces, and the selected business’s overview sections |

An at-a-glance business focus item highlights a known review signal and links to an appropriate section. Signals are prompts to inspect records, not diagnoses or verified recommendations. The business question panel responds to a limited set of questions using the information currently displayed.

### Navigation and responsive layout

The sidebar business submenu lists available businesses; choosing one opens its Overview. The distroMesh brand links to the landing page. Business and section URLs support direct navigation and browser Back and Forward. The navigation and dashboard layout adapt to desktop and mobile screens.

## How to use the dashboard

1. Open **All businesses** to scan available portfolio figures and identify missing coverage.
2. Compare selected businesses when a comparison is useful.
3. Open a business from the sidebar or portfolio to review its own activity.
4. Use its sales chart, indicators, and focus prompt to identify records worth checking.
5. Follow invoice, expense, transaction, alert, and relationship links to the relevant workspace section.
6. Verify amounts and indicators against source records before making operational or financial decisions.

## Route reference

The app uses the following page groups:

| Page | Route |
| --- | --- |
| Landing page | `/` |
| Business portfolio | `/businesses` |
| Business overview | `/businesses/{business}/overview` |
| Sales and operations | `/businesses/{business}/sales-operations` |
| Connected businesses | `/businesses/{business}/connected-businesses` |
| Transactions | `/businesses/{business}/transactions` |
| Invoices | `/businesses/{business}/invoices` |
| Expenses | `/businesses/{business}/expenses` |
| Cash summary | `/businesses/{business}/cash-flow` |
| Alerts and tasks | `/businesses/{business}/alerts` |
| Business questions | `/businesses/{business}/ask` |

`{business}` is the identifier for a business workspace. Use the sidebar to select a business and let the app construct the matching route.

## Data and readiness

The current build demonstrates product workflows with seeded, illustrative values. These include business profiles, sales histories, balances, profit figures, invoice counts, delivery rates, product and channel labels, and sample activity. They are not live business data and should not be presented as verified operating results.

This implementation does not yet include:

- User authentication, roles, or authorization.
- A server-side database or durable storage for businesses and ledger records.
- Bank, accounting, inventory, order, or delivery-system integrations.
- Reconciled live reporting, configurable periods, or source-linked audit trails.
- Production receipt storage or account/security management.
- Evidence-backed automated advice or predictive cash-flow forecasting.

Business and ledger changes created in the current interface are client-side state and are not durable; a full reload restores the seeded workspace. Until persistence, access control, and reliable data sources are implemented and validated, the dashboard is not a source of record for live business decisions.

## Technical foundation

- Next.js App Router
- React and TypeScript
- Tailwind CSS
- Recharts for monthly sales visualization
- Lucide icons

To run the project locally, use Node.js 20.9 or later:

```bash
npm install
npm run dev
```

Run `npm run lint` and `npm run build` to validate the application.
