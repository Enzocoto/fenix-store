export interface OrderRow {
  id: string;
  status: string;
  amount_cents: number;
  quantity: number;
  product_id: string | null;
}

export interface ProductRow {
  id: string;
  cost_cents: number | null;
}

export interface FinanceSummary {
  revenueCents: number;
  cogsCents: number;
  feesCents: number;
  grossProfitCents: number;
  netProfitCents: number;
  margin: number;
  paidOrders: number;
}

export function computeFinance(
  orders: OrderRow[],
  products: ProductRow[],
  feePercent: number,
  feeFixedCents: number,
): FinanceSummary {
  const costById = new Map(products.map((p) => [p.id, p.cost_cents ?? 0]));
  let revenueCents = 0;
  let cogsCents = 0;
  let feesCents = 0;
  let paidOrders = 0;

  const paidGroups = new Set<string>();
  for (const o of orders) {
    if (o.status !== 'paid') continue;
    const key = (o as any).group_id ?? o.id;
    if (!paidGroups.has(key)) {
      paidGroups.add(key);
      paidOrders += 1;
    }
    revenueCents += o.amount_cents;
    cogsCents += (costById.get(o.product_id ?? '') ?? 0) * o.quantity;
    feesCents += Math.round((o.amount_cents * feePercent) / 100) + feeFixedCents;
  }

  const grossProfitCents = revenueCents - cogsCents;
  const netProfitCents = grossProfitCents - feesCents;
  return {
    revenueCents,
    cogsCents,
    feesCents,
    grossProfitCents,
    netProfitCents,
    margin: revenueCents ? grossProfitCents / revenueCents : 0,
    paidOrders,
  };
}
