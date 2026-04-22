export interface LedgerEntry {
  id: string;
  date: string;
  orderId: string;
  supplier: string;
  itemCount: number;
  amount: number;
  vat: number;
  payStatus: '완료' | '미결제';
}

export interface ReturnRequest {
  id: string;
  requestedAt: string;
  orderId: string;
  supplier: string;
  product: string;
  qty: number;
  reason: '파손' | '오배송' | '유통기한' | '품질불량' | '기타';
  status: '접수' | '승인' | '반려' | '환불완료';
  refundAmount: number;
}

export const LEDGER_ENTRIES: LedgerEntry[] = [
  { id: 'LG-20260418', date: '2026-04-18', orderId: 'ORD-20260418-0002', supplier: '종근당', itemCount: 1, amount: 95000, vat: 9500, payStatus: '미결제' },
  { id: 'LG-20260415', date: '2026-04-15', orderId: 'ORD-20260415-0001', supplier: '유한양행', itemCount: 2, amount: 160500, vat: 16050, payStatus: '완료' },
  { id: 'LG-20260414', date: '2026-04-14', orderId: 'ORD-20260414-0006', supplier: '한풍제약', itemCount: 3, amount: 128700, vat: 12870, payStatus: '미결제' },
  { id: 'LG-20260410', date: '2026-04-10', orderId: 'ORD-20260410-0003', supplier: '종근당', itemCount: 4, amount: 284000, vat: 28400, payStatus: '완료' },
  { id: 'LG-20260405', date: '2026-04-05', orderId: 'ORD-20260405-0009', supplier: '삼진제약', itemCount: 2, amount: 128400, vat: 12840, payStatus: '완료' },
  { id: 'LG-20260401', date: '2026-04-01', orderId: 'ORD-20260401-0015', supplier: '신신제약', itemCount: 1, amount: 96400, vat: 9640, payStatus: '완료' },
];

export const RETURN_REQUESTS: ReturnRequest[] = [
  { id: 'RT-20260419-001', requestedAt: '2026-04-19', orderId: 'ORD-20260415-0001', supplier: '유한양행', product: '안티푸라민 연고', qty: 1, reason: '파손', status: '접수', refundAmount: 5500 },
  { id: 'RT-20260417-002', requestedAt: '2026-04-17', orderId: 'ORD-20260410-0003', supplier: '종근당', product: '락토핏 생유산균 골드', qty: 2, reason: '유통기한', status: '승인', refundAmount: 38000 },
  { id: 'RT-20260412-003', requestedAt: '2026-04-12', orderId: 'ORD-20260405-0009', supplier: '삼진제약', product: '게보린 정', qty: 1, reason: '오배송', status: '환불완료', refundAmount: 12000 },
  { id: 'RT-20260405-004', requestedAt: '2026-04-05', orderId: 'ORD-20260401-0015', supplier: '신신제약', product: '신신파스 아렉스', qty: 3, reason: '품질불량', status: '반려', refundAmount: 0 },
];
