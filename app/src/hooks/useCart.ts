import { useContext } from 'react';
import { CartContext, type CartApi } from '../state/cart-context';

export function useCart(): CartApi {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return context;
}
