export type PaymentStatus = '완료' | '미결제' | '연체';
export type PaymentMethodType = '법인카드' | '계좌이체' | '세금계산서' | '현금';

export interface PaymentRecord {
  id: string;
  orderId: string;
  supplier: string;
  amount: number;
  method: PaymentMethodType;
  paidAt?: string;
  dueDate?: string;
  status: PaymentStatus;
}

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  label: string;
  detail: string;
  isDefault: boolean;
}

export const PAYMENT_HISTORY: PaymentRecord[] = [
  { id: 'PAY-20260418-001', orderId: 'ORD-20260415-0001', supplier: '유한양행', amount: 160500, method: '법인카드', paidAt: '2026-04-18', status: '완료' },
  { id: 'PAY-20260416-002', orderId: 'ORD-20260410-0003', supplier: '종근당', amount: 284000, method: '계좌이체', paidAt: '2026-04-16', status: '완료' },
  { id: 'PAY-20260412-003', orderId: 'ORD-20260405-0009', supplier: '삼진제약', amount: 128400, method: '세금계산서', paidAt: '2026-04-12', status: '완료' },
  { id: 'PAY-20260408-004', orderId: 'ORD-20260401-0015', supplier: '신신제약', amount: 96400, method: '법인카드', paidAt: '2026-04-08', status: '완료' },
  { id: 'PAY-20260405-005', orderId: 'ORD-20260328-0021', supplier: '일양약품', amount: 54200, method: '계좌이체', paidAt: '2026-04-05', status: '완료' },
];

export const UNPAID_RECORDS: PaymentRecord[] = [
  { id: 'PAY-20260418-101', orderId: 'ORD-20260418-0002', supplier: '종근당', amount: 95000, method: '세금계산서', dueDate: '2026-05-31', status: '미결제' },
  { id: 'PAY-20260414-102', orderId: 'ORD-20260414-0006', supplier: '한풍제약', amount: 128700, method: '세금계산서', dueDate: '2026-05-14', status: '미결제' },
  { id: 'PAY-20260301-103', orderId: 'ORD-20260301-0030', supplier: '더유제약', amount: 42300, method: '세금계산서', dueDate: '2026-03-31', status: '연체' },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'PM-001', type: '법인카드', label: '신한 비즈카드', detail: '**** **** **** 1234 · 유효기간 12/28', isDefault: true },
  { id: 'PM-002', type: '계좌이체', label: '우리은행', detail: '1005-***-123456 · 서울연세약국', isDefault: false },
  { id: 'PM-003', type: '세금계산서', label: '세금계산서 결제', detail: '사업자 123-45-67890 · 월말 마감', isDefault: false },
];
