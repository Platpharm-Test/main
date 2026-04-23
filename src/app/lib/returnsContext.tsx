import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { RETURN_REQUESTS as SEED_RETURNS, type ReturnRequest } from './ledger';

interface ReturnsContextValue {
  requests: ReturnRequest[];
  addReturn: (input: {
    orderId: string;
    supplier: string;
    product: string;
    productId?: number;
    qty: number;
    unitPrice?: number;
    reason: ReturnRequest['reason'];
    refundAmount: number;
    note?: string;
  }) => ReturnRequest;
}

const ReturnsContext = createContext<ReturnsContextValue | null>(null);

const USER_KEY = 'platpharm:returns_user';

function readUserReturns(): ReturnRequest[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as ReturnRequest[]) : [];
  } catch {
    return [];
  }
}

export function ReturnsProvider({ children }: { children: ReactNode }) {
  const [userReturns, setUserReturns] = useState<ReturnRequest[]>(readUserReturns);

  useEffect(() => {
    try { localStorage.setItem(USER_KEY, JSON.stringify(userReturns)); } catch {}
  }, [userReturns]);

  const addReturn = useCallback((input: {
    orderId: string;
    supplier: string;
    product: string;
    productId?: number;
    qty: number;
    unitPrice?: number;
    reason: ReturnRequest['reason'];
    refundAmount: number;
    note?: string;
  }) => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const id = `RT-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(Math.floor(Math.random() * 999))}`;
    const record: ReturnRequest = {
      id,
      requestedAt: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
      orderId: input.orderId,
      supplier: input.supplier,
      product: input.product,
      productId: input.productId,
      qty: input.qty,
      unitPrice: input.unitPrice,
      reason: input.reason,
      status: '접수',
      refundAmount: input.refundAmount,
      note: input.note,
    };
    setUserReturns((prev) => [record, ...prev]);
    return record;
  }, []);

  const requests = [...userReturns, ...SEED_RETURNS].sort((a, b) => b.requestedAt.localeCompare(a.requestedAt));

  return (
    <ReturnsContext.Provider value={{ requests, addReturn }}>
      {children}
    </ReturnsContext.Provider>
  );
}

export function useReturns() {
  const ctx = useContext(ReturnsContext);
  if (!ctx) throw new Error('useReturns must be used within ReturnsProvider');
  return ctx;
}
