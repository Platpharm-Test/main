import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export type OrderStatus = '상품준비중' | '배송준비' | '배송중' | '배송완료' | '주문취소';

export interface OrderLine {
  productId: number;
  qty: number;
  unitPrice: number;
  packSize: number;
  name: string;
  supplier: string;
  code: string;
}

export interface Order {
  id: string;
  createdAt: string;
  lines: OrderLine[];
  total: number;
  paymentMethod: string;
  status: OrderStatus;
  paid: boolean;
}

interface OrdersContextValue {
  orders: Order[];
  addOrder: (order: Order) => void;
  markPaid: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);
const ORDERS_KEY = 'platpharm:orders';

const SEED_ORDERS: Order[] = [
  {
    id: 'ORD-20260415-0001',
    createdAt: '2026-04-15T10:23:00.000Z',
    lines: [
      { productId: 1, qty: 3, unitPrice: 5500, packSize: 1, name: '안티푸라민 연고', supplier: '유한양행', code: 'YUH-001' },
      { productId: 10, qty: 2, unitPrice: 720, packSize: 100, name: '삐콤씨 정', supplier: '유한양행', code: 'YUH-010' },
    ],
    total: 16500 + 144000,
    paymentMethod: '법인카드',
    status: '배송완료',
    paid: true,
  },
  {
    id: 'ORD-20260418-0002',
    createdAt: '2026-04-18T14:02:00.000Z',
    lines: [
      { productId: 9, qty: 5, unitPrice: 380, packSize: 50, name: '락토핏 생유산균 골드', supplier: '종근당', code: 'JOO-009' },
    ],
    total: 95000,
    paymentMethod: '세금계산서',
    status: '배송중',
    paid: false,
  },
];

const VALID_STATUSES: OrderStatus[] = ['상품준비중', '배송준비', '배송중', '배송완료', '주문취소'];
function migrate(o: Order): Order {
  const legacy = o.status as unknown as string;
  if (VALID_STATUSES.includes(o.status)) return o;
  if (legacy === '취소') return { ...o, status: '주문취소' };
  if (legacy === '결제완료') return { ...o, status: '상품준비중' };
  if (legacy === '결제대기') return { ...o, status: '상품준비중', paid: false };
  return { ...o, status: '상품준비중' };
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window === 'undefined') return SEED_ORDERS;
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      const list: Order[] = raw ? JSON.parse(raw) : SEED_ORDERS;
      return list.map(migrate);
    } catch {
      return SEED_ORDERS;
    }
  });

  useEffect(() => {
    try { localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)); } catch {}
  }, [orders]);

  const addOrder = useCallback((order: Order) => {
    setOrders((prev) => [order, ...prev]);
  }, []);

  const markPaid = useCallback((orderId: string) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, paid: true } : o)));
  }, []);

  const cancelOrder = useCallback((orderId: string) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: '주문취소' } : o)));
  }, []);

  return (
    <OrdersContext.Provider value={{ orders, addOrder, markPaid, cancelOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider');
  return ctx;
}
