import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export type CartMap = Record<string, number>;
export type ScrapSet = Record<string, true>;

interface CartContextValue {
  cart: CartMap;
  addToCart: (productId: number, qty: number) => void;
  setCart: (cart: CartMap) => void;
  scraps: ScrapSet;
  toggleScrap: (productId: number) => void;
  cartKindCount: number;
  scrapCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_KEY = 'platpharm:cart';
const SCRAP_KEY = 'platpharm:scraps';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCartState] = useState<CartMap>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [scraps, setScraps] = useState<ScrapSet>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const raw = localStorage.getItem(SCRAP_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch {}
  }, [cart]);

  useEffect(() => {
    try { localStorage.setItem(SCRAP_KEY, JSON.stringify(scraps)); } catch {}
  }, [scraps]);

  const addToCart = useCallback((productId: number, qty: number) => {
    setCartState((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + qty }));
  }, []);

  const setCart = useCallback((next: CartMap) => {
    setCartState(next);
  }, []);

  const toggleScrap = useCallback((productId: number) => {
    setScraps((prev) => {
      const next = { ...prev };
      if (next[productId]) delete next[productId];
      else next[productId] = true;
      return next;
    });
  }, []);

  const cartKindCount = Object.keys(cart).length;
  const scrapCount = Object.keys(scraps).length;

  return (
    <CartContext.Provider value={{ cart, addToCart, setCart, scraps, toggleScrap, cartKindCount, scrapCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
