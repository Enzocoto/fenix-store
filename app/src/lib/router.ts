import { useEffect, useState } from 'react';

export type RouteName = 'home' | 'product' | 'cart' | 'checkout' | 'portal' | 'admin';

const ROUTES: Record<string, RouteName> = {
  '': 'home',
  '/': 'home',
  '/product': 'product',
  '/cart': 'cart',
  '/checkout': 'checkout',
  '/portal': 'portal',
  '/admin': 'admin',
};

function parse(): RouteName {
  if (typeof window === 'undefined') return 'home';
  const hash = window.location.hash.replace(/^#/, '').split('?')[0];
  return ROUTES[hash] ?? 'home';
}

export function navigate(route: RouteName): void {
  if (typeof window === 'undefined') return;
  window.location.hash = route === 'home' ? '/' : `/${route}`;
}

export function useRoute(): RouteName {
  const [route, setRoute] = useState<RouteName>(parse);
  useEffect(() => {
    const onChange = () => setRoute(parse());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}
