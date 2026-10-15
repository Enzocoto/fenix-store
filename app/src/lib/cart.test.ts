import { describe, expect, it } from 'vitest';
import { addLine, cartSubtotalCents, countItems, removeLine, setLineQuantity, type CartLine } from './cart';

const base = {
  slug: 'backseat-hammock-cover',
  name: 'Backseat Hammock Cover',
  variantId: 'std',
  variantLabel: 'Standard',
  unitPriceCents: 3999,
};

describe('cart logic', () => {
  it('adds a new line and counts it', () => {
    const cart = addLine([], base);
    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(1);
    expect(countItems(cart)).toBe(1);
  });

  it('merges lines that share a slug and variant', () => {
    const cart = addLine(addLine([], base), base, 2);
    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(3);
  });

  it('keeps separate lines for different variants', () => {
    const cart = addLine(addLine([], base), { ...base, variantId: 'xl', variantLabel: 'XL', unitPriceCents: 4499 });
    expect(cart).toHaveLength(2);
    expect(countItems(cart)).toBe(2);
  });

  it('caps quantity at MAX_LINE_QUANTITY (20)', () => {
    const cart = addLine([], base, 500);
    expect(cart[0].quantity).toBe(20);
  });

  it('updates quantity and removes at zero', () => {
    const cart = addLine([], base, 2);
    const key = cart[0].key;
    expect(setLineQuantity(cart, key, 5)[0].quantity).toBe(5);
    expect(setLineQuantity(cart, key, 0)).toHaveLength(0);
  });

  it('removes a specific line', () => {
    const cart = addLine([], base);
    expect(removeLine(cart, cart[0].key)).toHaveLength(0);
  });

  it('computes subtotal from unit price and quantity', () => {
    const cart: CartLine[] = addLine(addLine([], base, 2), {
      ...base,
      variantId: 'std-mesh',
      variantLabel: 'Standard + door protectors',
      unitPriceCents: 4799,
    });
    expect(cartSubtotalCents(cart)).toBe(3999 * 2 + 4799);
  });
});
