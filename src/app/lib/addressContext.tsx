import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export interface DeliveryAddress {
  id: string;
  name: string;
  recipient: string;
  phone: string;
  zip: string;
  line1: string;
  line2: string;
}

const DEFAULT_ADDRESS: DeliveryAddress = {
  id: 'addr-default',
  name: '서울연세약국',
  recipient: '김민수',
  phone: '010-1234-5678',
  zip: '03161',
  line1: '서울특별시 종로구 종로 1길 50',
  line2: '연세빌딩 3층',
};

interface AddressContextValue {
  addresses: DeliveryAddress[];
  selectedId: string;
  selected: DeliveryAddress;
  addAddress: (a: Omit<DeliveryAddress, 'id'>) => DeliveryAddress;
  updateAddress: (id: string, a: Partial<DeliveryAddress>) => void;
  removeAddress: (id: string) => void;
  selectAddress: (id: string) => void;
}

const AddressContext = createContext<AddressContextValue | null>(null);
const ADDRESSES_KEY = 'platpharm:deliveryAddresses';
const SELECTED_KEY = 'platpharm:deliveryAddress:selectedId';

// 구 저장소(단일 주소) 호환용
const LEGACY_KEY = 'platpharm:deliveryAddress';

function generateId() {
  return `addr-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
}

function loadInitial(): { addresses: DeliveryAddress[]; selectedId: string } {
  if (typeof window === 'undefined') {
    return { addresses: [DEFAULT_ADDRESS], selectedId: DEFAULT_ADDRESS.id };
  }
  try {
    const raw = localStorage.getItem(ADDRESSES_KEY);
    if (raw) {
      const list: DeliveryAddress[] = JSON.parse(raw);
      if (Array.isArray(list) && list.length > 0) {
        const selectedRaw = localStorage.getItem(SELECTED_KEY);
        const selectedId = selectedRaw && list.some((a) => a.id === selectedRaw) ? selectedRaw : list[0].id;
        return { addresses: list, selectedId };
      }
    }
    // 구 단일 주소 마이그레이션
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy);
      const migrated: DeliveryAddress = { ...DEFAULT_ADDRESS, ...parsed, id: DEFAULT_ADDRESS.id };
      return { addresses: [migrated], selectedId: migrated.id };
    }
  } catch {}
  return { addresses: [DEFAULT_ADDRESS], selectedId: DEFAULT_ADDRESS.id };
}

export function AddressProvider({ children }: { children: ReactNode }) {
  const [{ addresses, selectedId }, setState] = useState<{ addresses: DeliveryAddress[]; selectedId: string }>(loadInitial);

  useEffect(() => {
    try {
      localStorage.setItem(ADDRESSES_KEY, JSON.stringify(addresses));
      localStorage.setItem(SELECTED_KEY, selectedId);
    } catch {}
  }, [addresses, selectedId]);

  const addAddress = useCallback((input: Omit<DeliveryAddress, 'id'>) => {
    const record: DeliveryAddress = { ...input, id: generateId() };
    setState((prev) => ({ addresses: [...prev.addresses, record], selectedId: prev.selectedId || record.id }));
    return record;
  }, []);

  const updateAddress = useCallback((id: string, patch: Partial<DeliveryAddress>) => {
    setState((prev) => ({
      ...prev,
      addresses: prev.addresses.map((a) => (a.id === id ? { ...a, ...patch, id: a.id } : a)),
    }));
  }, []);

  const removeAddress = useCallback((id: string) => {
    setState((prev) => {
      const next = prev.addresses.filter((a) => a.id !== id);
      if (next.length === 0) return { addresses: [DEFAULT_ADDRESS], selectedId: DEFAULT_ADDRESS.id };
      const selectedId = prev.selectedId === id ? next[0].id : prev.selectedId;
      return { addresses: next, selectedId };
    });
  }, []);

  const selectAddress = useCallback((id: string) => {
    setState((prev) => (prev.addresses.some((a) => a.id === id) ? { ...prev, selectedId: id } : prev));
  }, []);

  const selected = addresses.find((a) => a.id === selectedId) ?? addresses[0];

  return (
    <AddressContext.Provider value={{ addresses, selectedId, selected, addAddress, updateAddress, removeAddress, selectAddress }}>
      {children}
    </AddressContext.Provider>
  );
}

export function useDeliveryAddress() {
  const ctx = useContext(AddressContext);
  if (!ctx) throw new Error('useDeliveryAddress must be used within AddressProvider');
  return ctx;
}
