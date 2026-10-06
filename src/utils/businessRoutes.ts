export const sectionRouteNames: Record<string, string> = {
  overview: 'overview',
  'business-performance': 'sales-operations',
  'related-businesses': 'connected-businesses',
  'general-ledger': 'transactions',
  invoicing: 'invoices',
  expenses: 'expenses',
  reports: 'cash-flow',
  'bank-reconciliation': 'alerts',
  'ai-assistant': 'ask',
  'war-room': 'war-room',
};

export const sectionIdsByRouteName: Record<string, string> = Object.fromEntries(
  Object.entries(sectionRouteNames).map(([sectionId, routeName]) => [routeName, sectionId]),
);

export const getBusinessRoute = (businessId: string, sectionId = 'overview') => {
  const routeName = sectionRouteNames[sectionId] ?? 'overview';
  return `/businesses/${encodeURIComponent(businessId)}/${routeName}`;
};

export const isBusinessRouteName = (routeName: string) =>
  Object.prototype.hasOwnProperty.call(sectionIdsByRouteName, routeName);
