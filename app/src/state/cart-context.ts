import { createContext } from 'react';
import type { CartLine } from '../lib/cart';

export type NewLine = Omit<CartLine, 'key' | 'quantity'>;

export interface CartApi {
  cart: CartLine[];
  count: number;
  subtotalCents: number;
  add: (input: NewLine, quantity?: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

export const CartContext = createContext<CartApi | null>(null);
