import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { SEED_PARTNER_REQUESTS, SUPPLIER_DIRECTORY, deriveTradeStatus, type PartnerRequest, type PartnerRequestForm, type SupplierTradeStatus } from './partners';

interface PartnersContextValue {
  requests: PartnerRequest[];
  addRequest: (input: { supplierId: string; memo?: string; form?: PartnerRequestForm }) => PartnerRequest;
  cancelRequest: (id: string) => void;
  getTradeStatus: (supplierId: string) => SupplierTradeStatus;
}

const PartnersContext = createContext<PartnersContextValue | null>(null);

// 사용자가 직접 제출한 신청만 localStorage에 별도 키로 보관.
// SEED는 항상 소스 파일에서 읽어온다.
const USER_KEY = 'platpharm:partner_requests_user';
const CANCELLED_KEY = 'platpharm:partner_requests_cancelled';
// 구 전체-저장 방식으로 저장된 키들. 남아있으면 전부 삭제.
const LEGACY_KEYS = [
  'platpharm:partner_requests',
  'platpharm:partner_requests:v2',
  'platpharm:partner_requests:v3',
  'platpharm:partner_requests:v4',
];

export function PartnersProvider({ children }: { children: ReactNode }) {
  const [userRequests, setUserRequests] = useState<PartnerRequest[]>(() => {
    if (typeof window === 'undefined') return [];
    LEGACY_KEYS.forEach((k) => { try { localStorage.removeItem(k); } catch {} });
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as PartnerRequest[]) : [];
    } catch {
      return [];
    }
  });
  const [cancelledSeedIds, setCancelledSeedIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(CANCELLED_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try { localStorage.setItem(USER_KEY, JSON.stringify(userRequests)); } catch {}
  }, [userRequests]);

  useEffect(() => {
    try { localStorage.setItem(CANCELLED_KEY, JSON.stringify(cancelledSeedIds)); } catch {}
  }, [cancelledSeedIds]);

  const requests = useMemo(() => {
    const activeSeed = SEED_PARTNER_REQUESTS.filter((r) => !cancelledSeedIds.includes(r.id));
    const merged = [...userRequests, ...activeSeed];
    return merged.sort((a, b) => b.requestedAt.localeCompare(a.requestedAt));
  }, [userRequests, cancelledSeedIds]);

  const addRequest = useCallback((input: { supplierId: string; memo?: string; form?: PartnerRequestForm }) => {
    const supplier = SUPPLIER_DIRECTORY.find((s) => s.id === input.supplierId);
    if (!supplier) throw new Error(`Unknown supplier: ${input.supplierId}`);
    const now = new Date();
    const id = `REQ-${now.getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(3, '0')}`;
    const record: PartnerRequest = {
      id,
      supplierId: supplier.id,
      supplier: supplier.name,
      bizNumber: supplier.bizNumber,
      contact: supplier.contact,
      requestedAt: now.toISOString().slice(0, 10),
      status: '대기',
      memo: input.memo,
      form: input.form,
    };
    setUserRequests((prev) => [record, ...prev]);
    return record;
  }, []);

  const cancelRequest = useCallback((id: string) => {
    const isSeed = SEED_PARTNER_REQUESTS.some((r) => r.id === id);
    if (isSeed) {
      setCancelledSeedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    } else {
      setUserRequests((prev) => prev.filter((r) => r.id !== id));
    }
  }, []);

  const getTradeStatus = useCallback((supplierId: string): SupplierTradeStatus => {
    const supplier = SUPPLIER_DIRECTORY.find((s) => s.id === supplierId);
    return deriveTradeStatus(supplierId, requests, !!supplier?.approved);
  }, [requests]);

  const value = useMemo(
    () => ({ requests, addRequest, cancelRequest, getTradeStatus }),
    [requests, addRequest, cancelRequest, getTradeStatus],
  );

  return <PartnersContext.Provider value={value}>{children}</PartnersContext.Provider>;
}

export function usePartners() {
  const ctx = useContext(PartnersContext);
  if (!ctx) throw new Error('usePartners must be used within PartnersProvider');
  return ctx;
}
