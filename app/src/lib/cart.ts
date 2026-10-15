export interface CartLine {
  key: string;
  slug: string;
  name: string;
  variantId: string;
  variantLabel: string;
  unitPriceCents: number;
  quantity: number;
}

/** Máximo por línea. Debe coincidir con el límite del backend (`checkout.ts`). */
export const MAX_LINE_QUANTITY = 20;

export function lineKey(slug: string, variantId: string): string {
  return `${slug}::${variantId}`;
}

export function addLine(cart: CartLine[], input: Omit<CartLine, 'key' | 'quantity'>, quantity = 1): CartLine[] {
  const key = lineKey(input.slug, input.variantId);
  const existing = cart.find((line) => line.key === key);
  if (existing) {
    return cart.map((line) =>
      line.key === key ? { ...line, quantity: Math.min(line.quantity + quantity, MAX_LINE_QUANTITY) } : line,
    );
  }
  return [...cart, { ...input, key, quantity: Math.max(1, Math.min(quantity, MAX_LINE_QUANTITY)) }];
}

export function removeLine(cart: CartLine[], key: string): CartLine[] {
  return cart.filter((line) => line.key !== key);
}

export function setLineQuantity(cart: CartLine[], key: string, quantity: number): CartLine[] {
  if (quantity <= 0) {
    return removeLine(cart, key);
  }
  return cart.map((line) => (line.key === key ? { ...line, quantity: Math.min(quantity, MAX_LINE_QUANTITY) } : line));
}

export function countItems(cart: CartLine[]): number {
  return cart.reduce((total, line) => total + line.quantity, 0);
}

export function cartSubtotalCents(cart: CartLine[]): number {
  return cart.reduce((total, line) => total + line.unitPriceCents * line.quantity, 0);
}
