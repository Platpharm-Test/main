export type PartnerStatus = '대기' | '승인' | '반려';

export interface PartnerRequest {
  id: string;
  supplier: string;
  bizNumber: string;
  requestedAt: string;
  contact: string;
  status: PartnerStatus;
  memo?: string;
}

export interface SupplierTransaction {
  id: string;
  supplierId: string;
  date: string;
  orderId: string;
  itemCount: number;
  amount: number;
  payStatus: '완료' | '미결제';
}

export interface ApprovedSupplierBase {
  id: string;
  supplier: string;
  bizNumber: string;
  contact: string;
  approvedAt: string;
  paymentTerm: string;
}

export interface ApprovedSupplier extends ApprovedSupplierBase {
  monthlyOrders: number;
  ytdAmount: number;
  transactionCount: number;
}

export const PARTNER_REQUESTS: PartnerRequest[] = [
  { id: 'REQ-2026-041', supplier: '대원제약', bizNumber: '123-45-67890', requestedAt: '2026-04-19', contact: '02-555-1234', status: '대기', memo: '신규 거래 요청 — 호흡기계열 공급' },
  { id: 'REQ-2026-040', supplier: '유유제약', bizNumber: '234-56-78901', requestedAt: '2026-04-18', contact: '02-555-2345', status: '대기' },
  { id: 'REQ-2026-039', supplier: '셀로맥스', bizNumber: '345-67-89012', requestedAt: '2026-04-17', contact: '02-555-3456', status: '승인' },
  { id: 'REQ-2026-038', supplier: '옵투스', bizNumber: '456-78-90123', requestedAt: '2026-04-12', contact: '02-555-4567', status: '반려', memo: '단가 미합의' },
  { id: 'REQ-2026-037', supplier: '익수제약', bizNumber: '567-89-01234', requestedAt: '2026-04-10', contact: '02-555-5678', status: '승인' },
];

const SUPPLIER_BASE: ApprovedSupplierBase[] = [
  { id: 'SUP-001', supplier: '유한양행', bizNumber: '101-81-00001', contact: '02-771-0001', approvedAt: '2024-03-11', paymentTerm: '월말 30일' },
  { id: 'SUP-002', supplier: '종근당', bizNumber: '102-81-00002', contact: '02-771-0002', approvedAt: '2024-05-02', paymentTerm: '월말 30일' },
  { id: 'SUP-003', supplier: '삼진제약', bizNumber: '103-81-00003', contact: '02-771-0003', approvedAt: '2024-07-18', paymentTerm: '월말 60일' },
  { id: 'SUP-004', supplier: '신신제약', bizNumber: '104-81-00004', contact: '02-771-0004', approvedAt: '2024-08-01', paymentTerm: '월말 30일' },
  { id: 'SUP-005', supplier: '일양약품', bizNumber: '105-81-00005', contact: '02-771-0005', approvedAt: '2024-09-22', paymentTerm: '익월 15일' },
  { id: 'SUP-006', supplier: '경방신약', bizNumber: '106-81-00006', contact: '02-771-0006', approvedAt: '2024-11-04', paymentTerm: '월말 30일' },
  { id: 'SUP-007', supplier: '한풍제약', bizNumber: '107-81-00007', contact: '02-771-0007', approvedAt: '2025-01-14', paymentTerm: '월말 30일' },
  { id: 'SUP-008', supplier: '더유제약', bizNumber: '108-81-00008', contact: '02-771-0008', approvedAt: '2025-03-28', paymentTerm: '익월 말일' },
];

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function generateTransactions(supplierId: string, seed: number, count: number, avgAmount: number): SupplierTransaction[] {
  const rand = seeded(seed);
  const txs: SupplierTransaction[] = [];
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(rand() * 365);
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    const date = d.toISOString().slice(0, 10);
    const factor = 0.5 + rand() * 1.2;
    const amount = Math.round((avgAmount * factor) / 100) * 100;
    const itemCount = 1 + Math.floor(rand() * 6);
    const orderId = `ORD-${date.replace(/-/g, '')}-${String(Math.floor(rand() * 9999)).padStart(4, '0')}`;
    const recent = daysAgo < 40;
    const payStatus: '완료' | '미결제' = recent && rand() > 0.6 ? '미결제' : '완료';
    txs.push({
      id: `TX-${supplierId}-${String(i + 1).padStart(3, '0')}`,
      supplierId,
      date,
      orderId,
      itemCount,
      amount,
      payStatus,
    });
  }
  return txs.sort((a, b) => b.date.localeCompare(a.date));
}

const SUPPLIER_TX_PLAN: Record<string, { count: number; avg: number; seed: number }> = {
  'SUP-001': { count: 28, avg: 4500000, seed: 11 },
  'SUP-002': { count: 22, avg: 4300000, seed: 23 },
  'SUP-003': { count: 18, avg: 4000000, seed: 41 },
  'SUP-004': { count: 14, avg: 4100000, seed: 59 },
  'SUP-005': { count: 11, avg: 3900000, seed: 71 },
  'SUP-006': { count: 9, avg: 3900000, seed: 83 },
  'SUP-007': { count: 8, avg: 3500000, seed: 97 },
  'SUP-008': { count: 6, avg: 3200000, seed: 109 },
};

export const SUPPLIER_TRANSACTIONS: SupplierTransaction[] = SUPPLIER_BASE.flatMap((s) => {
  const plan = SUPPLIER_TX_PLAN[s.id];
  return plan ? generateTransactions(s.id, plan.seed, plan.count, plan.avg) : [];
});

export const APPROVED_SUPPLIERS: ApprovedSupplier[] = SUPPLIER_BASE.map((s) => {
  const txs = SUPPLIER_TRANSACTIONS.filter((t) => t.supplierId === s.id);
  const ytdAmount = txs.reduce((sum, t) => sum + t.amount, 0);
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthlyOrders = txs.filter((t) => t.date.startsWith(thisMonth)).length;
  return { ...s, ytdAmount, monthlyOrders, transactionCount: txs.length };
});

export function getSupplier(id: string): ApprovedSupplier | undefined {
  return APPROVED_SUPPLIERS.find((s) => s.id === id);
}

export function getSupplierTransactions(id: string): SupplierTransaction[] {
  return SUPPLIER_TRANSACTIONS.filter((t) => t.supplierId === id);
}
