import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  addLine,
  cartSubtotalCents,
  countItems,
  removeLine,
  setLineQuantity,
  type CartLine,
} from '../lib/cart';
import { readStore, writeStore } from '../lib/store';
import { CartContext, type CartApi, type NewLine } from './cart-context';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>(() => readStore<CartLine[]>('cart', []));

  useEffect(() => {
    writeStore('cart', cart);
  }, [cart]);

  const add = useCallback((input: NewLine, quantity = 1) => {
    setCart((current) => addLine(current, input, quantity));
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setCart((current) => setLineQuantity(current, key, quantity));
  }, []);

  const remove = useCallback((key: string) => {
    setCart((current) => removeLine(current, key));
  }, []);

  const clear = useCallback(() => setCart([]), []);

  const value = useMemo<CartApi>(
    () => ({
      cart,
      count: countItems(cart),
      subtotalCents: cartSubtotalCents(cart),
      add,
      setQuantity,
      remove,
      clear,
    }),
    [cart, add, setQuantity, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
