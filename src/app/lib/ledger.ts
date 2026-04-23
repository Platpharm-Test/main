export interface PurchaseRecord {
  id: string;
  date: string;
  productId: number;
  productName: string;
  productCode: string;
  productCategory: string;
  supplier: string;
  qty: number;
  unitPrice: number;
  amount: number;
  orderId: string;
  payStatus: '완료' | '미결제';
}

export interface ReturnRequest {
  id: string;
  requestedAt: string;
  orderId: string;
  supplier: string;
  product: string;
  productId?: number;
  qty: number;
  unitPrice?: number;
  reason: '파손' | '오배송' | '유통기한' | '품질불량' | '기타';
  status: '접수' | '승인' | '반려' | '환불완료';
  refundAmount: number;
  note?: string;
  reviewedAt?: string;
  reviewMemo?: string;
}

export const PURCHASE_RECORDS: PurchaseRecord[] = [
  // 안티푸라민 연고 (YUH-001)
  { id: 'PC-20260415-001', date: '2026-04-15', productId: 1, productName: '안티푸라민 연고', productCode: 'YUH-001', productCategory: '외용제', supplier: '유한양행', qty: 30, unitPrice: 5500, amount: 165000, orderId: 'ORD-20260415-0001', payStatus: '완료' },
  { id: 'PC-20260322-001', date: '2026-03-22', productId: 1, productName: '안티푸라민 연고', productCode: 'YUH-001', productCategory: '외용제', supplier: '서울의약품도매', qty: 50, unitPrice: 5700, amount: 285000, orderId: 'ORD-20260322-0012', payStatus: '완료' },
  { id: 'PC-20260210-001', date: '2026-02-10', productId: 1, productName: '안티푸라민 연고', productCode: 'YUH-001', productCategory: '외용제', supplier: '경기바이오상사', qty: 20, unitPrice: 5600, amount: 112000, orderId: 'ORD-20260210-0008', payStatus: '완료' },

  // 삐콤씨 정 (YUH-010)
  { id: 'PC-20260415-002', date: '2026-04-15', productId: 10, productName: '삐콤씨 정', productCode: 'YUH-010', productCategory: '비타민·영양제', supplier: '유한양행', qty: 10, unitPrice: 72000, amount: 720000, orderId: 'ORD-20260415-0001', payStatus: '완료' },
  { id: 'PC-20260305-001', date: '2026-03-05', productId: 10, productName: '삐콤씨 정', productCode: 'YUH-010', productCategory: '비타민·영양제', supplier: '한국약품유통', qty: 15, unitPrice: 74500, amount: 1117500, orderId: 'ORD-20260305-0005', payStatus: '완료' },

  // 게보린 정 (SAM-006)
  { id: 'PC-20260418-001', date: '2026-04-18', productId: 6, productName: '게보린 정', productCode: 'SAM-006', productCategory: '해열진통소염제', supplier: '삼진제약', qty: 20, unitPrice: 12000, amount: 240000, orderId: 'ORD-20260418-0004', payStatus: '완료' },
  { id: 'PC-20260330-001', date: '2026-03-30', productId: 6, productName: '게보린 정', productCode: 'SAM-006', productCategory: '해열진통소염제', supplier: '서울의약품도매', qty: 30, unitPrice: 12300, amount: 369000, orderId: 'ORD-20260330-0014', payStatus: '완료' },
  { id: 'PC-20260220-001', date: '2026-02-20', productId: 6, productName: '게보린 정', productCode: 'SAM-006', productCategory: '해열진통소염제', supplier: '대한메디사', qty: 15, unitPrice: 12200, amount: 183000, orderId: 'ORD-20260220-0011', payStatus: '미결제' },

  // 락토핏 생유산균 골드 (JOO-009)
  { id: 'PC-20260412-001', date: '2026-04-12', productId: 9, productName: '락토핏 생유산균 골드', productCode: 'JOO-009', productCategory: '건강기능식품', supplier: '종근당', qty: 40, unitPrice: 19000, amount: 760000, orderId: 'ORD-20260412-0007', payStatus: '완료' },
  { id: 'PC-20260318-001', date: '2026-03-18', productId: 9, productName: '락토핏 생유산균 골드', productCode: 'JOO-009', productCategory: '건강기능식품', supplier: '한국약품유통', qty: 25, unitPrice: 19500, amount: 487500, orderId: 'ORD-20260318-0009', payStatus: '완료' },
  { id: 'PC-20260128-001', date: '2026-01-28', productId: 9, productName: '락토핏 생유산균 골드', productCode: 'JOO-009', productCategory: '건강기능식품', supplier: '서울의약품도매', qty: 20, unitPrice: 19300, amount: 386000, orderId: 'ORD-20260128-0003', payStatus: '완료' },

  // 원비디 드링크 (ILY-004)
  { id: 'PC-20260408-001', date: '2026-04-08', productId: 4, productName: '원비디 드링크', productCode: 'ILY-004', productCategory: '드링크·액제', supplier: '일양약품', qty: 50, unitPrice: 6800, amount: 340000, orderId: 'ORD-20260408-0006', payStatus: '완료' },
  { id: 'PC-20260312-001', date: '2026-03-12', productId: 4, productName: '원비디 드링크', productCode: 'ILY-004', productCategory: '드링크·액제', supplier: '경기바이오상사', qty: 30, unitPrice: 6900, amount: 207000, orderId: 'ORD-20260312-0013', payStatus: '완료' },

  // 유한 이브펜 연질캡슐 (YUH-021)
  { id: 'PC-20260405-001', date: '2026-04-05', productId: 21, productName: '유한 이브펜 연질캡슐', productCode: 'YUH-021', productCategory: '해열진통소염제', supplier: '유한양행', qty: 15, unitPrice: 22000, amount: 330000, orderId: 'ORD-20260405-0009', payStatus: '완료' },
  { id: 'PC-20260228-001', date: '2026-02-28', productId: 21, productName: '유한 이브펜 연질캡슐', productCode: 'YUH-021', productCategory: '해열진통소염제', supplier: '서울의약품도매', qty: 20, unitPrice: 22500, amount: 450000, orderId: 'ORD-20260228-0010', payStatus: '완료' },

  // 신신파스 아렉스 (SSJ-012)
  { id: 'PC-20260402-001', date: '2026-04-02', productId: 12, productName: '신신파스 아렉스', productCode: 'SSJ-012', productCategory: '반창고·밴드·파스', supplier: '신신제약', qty: 40, unitPrice: 4800, amount: 192000, orderId: 'ORD-20260401-0015', payStatus: '완료' },
  { id: 'PC-20260310-001', date: '2026-03-10', productId: 12, productName: '신신파스 아렉스', productCode: 'SSJ-012', productCategory: '반창고·밴드·파스', supplier: '서울의약품도매', qty: 60, unitPrice: 4900, amount: 294000, orderId: 'ORD-20260310-0002', payStatus: '완료' },

  // 래피콜케어 건조시럽 (YUH-013)
  { id: 'PC-20260328-001', date: '2026-03-28', productId: 13, productName: '래피콜케어 건조시럽', productCode: 'YUH-013', productCategory: '감기약', supplier: '유한양행', qty: 10, unitPrice: 32000, amount: 320000, orderId: 'ORD-20260328-0020', payStatus: '완료' },
];

export interface ProductPurchaseSummary {
  productId: number;
  productName: string;
  productCode: string;
  productCategory: string;
  totalQty: number;
  totalAmount: number;
  supplierCount: number;
  suppliers: string[];
  minUnitPrice: number;
  maxUnitPrice: number;
  avgUnitPrice: number;
  lastPurchaseDate: string;
  purchaseCount: number;
}

export function aggregatePurchases(records: PurchaseRecord[] = PURCHASE_RECORDS): ProductPurchaseSummary[] {
  const map = new Map<number, PurchaseRecord[]>();
  for (const r of records) {
    const arr = map.get(r.productId) ?? [];
    arr.push(r);
    map.set(r.productId, arr);
  }
  const out: ProductPurchaseSummary[] = [];
  map.forEach((arr, productId) => {
    const suppliers = Array.from(new Set(arr.map((r) => r.supplier)));
    const prices = arr.map((r) => r.unitPrice);
    const totalQty = arr.reduce((s, r) => s + r.qty, 0);
    const totalAmount = arr.reduce((s, r) => s + r.amount, 0);
    const lastPurchaseDate = arr.map((r) => r.date).sort().reverse()[0];
    out.push({
      productId,
      productName: arr[0].productName,
      productCode: arr[0].productCode,
      productCategory: arr[0].productCategory,
      totalQty,
      totalAmount,
      supplierCount: suppliers.length,
      suppliers,
      minUnitPrice: Math.min(...prices),
      maxUnitPrice: Math.max(...prices),
      avgUnitPrice: Math.round(totalAmount / totalQty),
      lastPurchaseDate,
      purchaseCount: arr.length,
    });
  });
  return out.sort((a, b) => b.lastPurchaseDate.localeCompare(a.lastPurchaseDate));
}

export function getProductPurchases(productId: number): PurchaseRecord[] {
  return PURCHASE_RECORDS.filter((r) => r.productId === productId).sort((a, b) => b.date.localeCompare(a.date));
}

export const RETURN_REQUESTS: ReturnRequest[] = [
  {
    id: 'RT-20260419-001',
    requestedAt: '2026-04-19',
    orderId: 'ORD-20260415-0001',
    supplier: '유한양행',
    product: '안티푸라민 연고',
    productId: 1,
    qty: 1,
    unitPrice: 5500,
    reason: '파손',
    status: '접수',
    refundAmount: 5500,
    note: '배송 박스 외부는 멀쩡했으나 내부 연고 용기 뚜껑이 찌그러져 있었습니다.',
  },
  {
    id: 'RT-20260417-002',
    requestedAt: '2026-04-17',
    orderId: 'ORD-20260412-0007',
    supplier: '종근당',
    product: '락토핏 생유산균 골드',
    productId: 9,
    qty: 2,
    unitPrice: 19000,
    reason: '유통기한',
    status: '승인',
    refundAmount: 38000,
    note: '수령 당일 확인한 유통기한이 2주 미만으로 임박해 있어 판매가 어렵습니다.',
    reviewedAt: '2026-04-20',
    reviewMemo: '유통기한 임박 확인, 반품 승인되었습니다. 익일 수거 예정입니다.',
  },
  {
    id: 'RT-20260412-003',
    requestedAt: '2026-04-12',
    orderId: 'ORD-20260405-0009',
    supplier: '삼진제약',
    product: '게보린 정',
    productId: 6,
    qty: 1,
    unitPrice: 12000,
    reason: '오배송',
    status: '환불완료',
    refundAmount: 12000,
    note: '주문한 게보린 연질캡슐이 아닌 일반 게보린 정이 배송되었습니다.',
    reviewedAt: '2026-04-16',
    reviewMemo: '오배송 확인, 반품 처리 및 환불 완료되었습니다.',
  },
  {
    id: 'RT-20260405-004',
    requestedAt: '2026-04-05',
    orderId: 'ORD-20260401-0015',
    supplier: '신신제약',
    product: '신신파스 아렉스',
    productId: 12,
    qty: 3,
    unitPrice: 4800,
    reason: '품질불량',
    status: '반려',
    refundAmount: 0,
    note: '파스 접착력이 평소 대비 크게 부족하다는 고객 불만이 반복적으로 접수됨.',
    reviewedAt: '2026-04-10',
    reviewMemo: '제조상 결함으로 보기 어렵고, 보관 환경에 따른 차이로 판단되어 반품이 어렵습니다.',
  },
];
