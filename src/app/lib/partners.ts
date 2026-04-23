export type PartnerStatus = '대기' | '승인' | '반려';

export interface PartnerRequestForm {
  pharmacyName: string;
  bizNumber: string;
  representative: string;
  pharmacistLicense: string;
  phone: string;
  fax: string;
  email: string;
  address: string;
  itemGroups: string[];
  volume: string;
  frequency: string;
  paymentTerm: string;
  receiver: string;
  receiverPhone: string;
  note: string;
}

export interface PartnerRequest {
  id: string;
  supplierId: string;
  supplier: string;
  bizNumber: string;
  requestedAt: string;
  contact: string;
  status: PartnerStatus;
  memo?: string;
  form?: PartnerRequestForm;
  reviewedAt?: string;
  reviewMemo?: string;
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

export interface SupplierInfo {
  id: string;
  name: string;
  bizNumber: string;
  contact: string;
  address: string;
  establishedYear: number;
  description: string;
  approved: boolean;
  approvedAt?: string;
  paymentTerm?: string;
}

export interface ApprovedSupplier extends SupplierInfo {
  monthlyOrders: number;
  ytdAmount: number;
  transactionCount: number;
  approvedAt: string;
  paymentTerm: string;
}

// 전체 제약사 디렉토리 — SUPPLIERS 상수(products.ts)와 동일한 19개
export const SUPPLIER_DIRECTORY: SupplierInfo[] = [
  { id: 'SUP-001', name: '유한양행', bizNumber: '101-81-00001', contact: '02-828-0100', address: '서울특별시 동작구 노량진로 74', establishedYear: 1926, description: '해열·진통·소화·피부 등 일반의약품을 포괄하는 국내 대표 제약사.', approved: true, approvedAt: '2024-03-11', paymentTerm: '월말 30일' },
  { id: 'SUP-002', name: '종근당', bizNumber: '102-81-00002', contact: '02-362-1771', address: '서울특별시 서대문구 충정로 8', establishedYear: 1941, description: '락토핏·프로메가 등 건강기능식품·일반의약품 전 품목 보유.', approved: true, approvedAt: '2024-05-02', paymentTerm: '월말 30일' },
  { id: 'SUP-003', name: '삼진제약', bizNumber: '103-81-00003', contact: '02-338-8691', address: '서울특별시 마포구 백범로 192', establishedYear: 1968, description: '게보린 시리즈로 잘 알려진 해열·진통·소염제 전문 제약사.', approved: true, approvedAt: '2024-07-18', paymentTerm: '월말 60일' },
  { id: 'SUP-004', name: '신신제약', bizNumber: '104-81-00004', contact: '031-677-4211', address: '경기도 안성시 서운면 중앙대로 1623', establishedYear: 1959, description: '신신파스 시리즈 등 외용제·반창고·파스 전문.', approved: true, approvedAt: '2024-08-01', paymentTerm: '월말 30일' },
  { id: 'SUP-005', name: '일양약품', bizNumber: '105-81-00005', contact: '031-332-3333', address: '경기도 용인시 처인구 이동읍', establishedYear: 1946, description: '원비디 드링크 등 건강드링크·소화기·감기약 제조.', approved: true, approvedAt: '2024-09-22', paymentTerm: '익월 15일' },
  { id: 'SUP-006', name: '경방신약', bizNumber: '106-81-00006', contact: '041-547-0303', address: '충청남도 아산시 인주면 문방로', establishedYear: 1970, description: '갈근탕·경옥고 등 한방제제 전문 제약사.', approved: true, approvedAt: '2024-11-04', paymentTerm: '월말 30일' },
  { id: 'SUP-007', name: '한풍제약', bizNumber: '107-81-00007', contact: '063-212-4050', address: '전라북도 전주시 덕진구 여의동', establishedYear: 1972, description: '감기약·소화기계·신경계약 액제 제조에 강점.', approved: true, approvedAt: '2025-01-14', paymentTerm: '월말 30일' },
  { id: 'SUP-008', name: '더유제약', bizNumber: '108-81-00008', contact: '031-236-8877', address: '경기도 화성시 팔탄면', establishedYear: 2001, description: '외용액·피부과 분야 소규모 특화 제조사.', approved: true, approvedAt: '2025-03-28', paymentTerm: '익월 말일' },
  { id: 'SUP-009', name: '한솔신약', bizNumber: '201-81-11111', contact: '02-557-4141', address: '서울특별시 강남구 테헤란로 501', establishedYear: 1985, description: '순환기계·호흡기계 치료제 전문.', approved: false },
  { id: 'SUP-010', name: '에프앤디넷', bizNumber: '202-81-22222', contact: '031-786-7700', address: '경기도 성남시 분당구 판교로 255', establishedYear: 2011, description: '건강기능식품·식품유래 원료 기반 제품군.', approved: false },
  { id: 'SUP-011', name: '노보노디스크', bizNumber: '203-81-33333', contact: '02-552-3087', address: '서울특별시 강남구 삼성동', establishedYear: 1923, description: '당뇨·비만·희귀질환 치료제를 보유한 글로벌 바이오제약사의 한국 법인.', approved: false },
  { id: 'SUP-012', name: 'SK케미칼', bizNumber: '204-81-44444', contact: '02-2008-2114', address: '경기도 성남시 분당구 판교로 310', establishedYear: 1969, description: '백신·호르몬·순환기 등 다양한 의약품 사업부를 운영.', approved: false },
  { id: 'SUP-013', name: '대원제약', bizNumber: '205-81-55555', contact: '031-369-3333', address: '경기도 화성시 향남읍', establishedYear: 1958, description: '소화기·호흡기 처방의약품 및 일반의약품 제조.', approved: false },
  { id: 'SUP-014', name: '셀로맥스', bizNumber: '206-81-66666', contact: '02-6952-1188', address: '서울특별시 영등포구 여의도동', establishedYear: 2015, description: '건강기능식품 및 뷰티 기능성 원료 전문.', approved: false },
  { id: 'SUP-015', name: '옵투스', bizNumber: '207-81-77777', contact: '02-418-9988', address: '서울특별시 송파구 올림픽로 35', establishedYear: 2013, description: '안과 점안제 및 OTC 안과약 라인업.', approved: false },
  { id: 'SUP-016', name: '아이월드', bizNumber: '208-81-88888', contact: '031-929-6060', address: '경기도 고양시 일산동구', establishedYear: 2008, description: '콘택트렌즈·안과 관련 용품 및 측정기기 유통.', approved: false },
  { id: 'SUP-017', name: '유유제약', bizNumber: '209-81-99999', contact: '043-644-3030', address: '충청북도 제천시 왕암동', establishedYear: 1941, description: '근골격계·비뇨기계 처방의약품 중심.', approved: false },
  { id: 'SUP-018', name: '익수제약', bizNumber: '210-81-10101', contact: '031-431-8255', address: '경기도 시흥시 정왕동', establishedYear: 1979, description: '소화기·호흡기·감기약 등 일반의약품 제조.', approved: false },
  { id: 'SUP-019', name: '경남제약', bizNumber: '211-81-20202', contact: '055-572-6767', address: '경상남도 의령군 의령읍', establishedYear: 1957, description: '레모나 등 비타민·영양제 브랜드로 알려진 제약사.', approved: false },
];

// 초기 거래 신청 내역 — PartnersProvider의 시드
const BASE_PHARMACY = {
  pharmacyName: '서울연세약국',
  bizNumber: '123-45-67890',
  representative: '김민수',
  pharmacistLicense: '약-54321',
  phone: '02-700-1234',
  fax: '02-700-1235',
  email: 'pharmacy@example.com',
  address: '(03161) 서울특별시 종로구 종로 1길 50 연세빌딩 3층',
  receiver: '김민수',
  receiverPhone: '010-1234-5678',
};

export const SEED_PARTNER_REQUESTS: PartnerRequest[] = [
  {
    id: 'REQ-2026-054',
    supplierId: 'SUP-009',
    supplier: '한솔신약',
    bizNumber: '201-81-11111',
    contact: '02-557-4141',
    requestedAt: '2026-04-21',
    status: '대기',
    memo: '희망 품목: 일반의약품 (OTC), 외용제 · 월 예상 주문액: 200~500만원 · 배송 주기: 주 2~3회 · 결제 조건: 월말 30일',
    form: {
      ...BASE_PHARMACY,
      itemGroups: ['일반의약품 (OTC)', '외용제'],
      volume: '200~500만원',
      frequency: '주 2~3회',
      paymentTerm: '월말 30일',
      note: '순환기·호흡기 계열 OTC 확보가 필요해 신규 거래를 요청드립니다.',
    },
  },
  {
    id: 'REQ-2026-053',
    supplierId: 'SUP-010',
    supplier: '에프앤디넷',
    bizNumber: '202-81-22222',
    contact: '031-786-7700',
    requestedAt: '2026-04-20',
    status: '대기',
    memo: '희망 품목: 건강기능식품 · 월 예상 주문액: 500~1,000만원 · 배송 주기: 주 1회 · 결제 조건: 월말 60일',
    form: {
      ...BASE_PHARMACY,
      itemGroups: ['건강기능식품'],
      volume: '500~1,000만원',
      frequency: '주 1회',
      paymentTerm: '월말 60일',
      note: '프로바이오틱스·오메가3 주력 라인업 확대를 위한 신규 거래 요청드립니다.',
    },
  },
  {
    id: 'REQ-2026-052',
    supplierId: 'SUP-011',
    supplier: '노보노디스크',
    bizNumber: '203-81-33333',
    contact: '02-552-3087',
    requestedAt: '2026-04-18',
    status: '대기',
    memo: '희망 품목: 일반의약품 (OTC) · 월 예상 주문액: 1,000만원 이상 · 배송 주기: 주 1회 · 결제 조건: 세금계산서 (월말 마감)',
    form: {
      ...BASE_PHARMACY,
      itemGroups: ['일반의약품 (OTC)'],
      volume: '1,000만원 이상',
      frequency: '주 1회',
      paymentTerm: '세금계산서 (월말 마감)',
      note: '당뇨 관련 품목 공급을 요청드리며, 월 1,000만원 이상 안정적 발주 가능합니다.',
    },
  },
  {
    id: 'REQ-2026-050',
    supplierId: 'SUP-012',
    supplier: 'SK케미칼',
    bizNumber: '204-81-44444',
    contact: '02-2008-2114',
    requestedAt: '2026-04-15',
    status: '승인',
    reviewedAt: '2026-04-19',
    memo: '희망 품목: 일반의약품 (OTC), 의약외품 · 월 예상 주문액: 500~1,000만원 · 배송 주기: 주 2~3회 · 결제 조건: 월말 30일',
    form: {
      ...BASE_PHARMACY,
      itemGroups: ['일반의약품 (OTC)', '의약외품'],
      volume: '500~1,000만원',
      frequency: '주 2~3회',
      paymentTerm: '월말 30일',
      note: '기존 순환기·호르몬제 라인업 주력 거래를 희망합니다.',
    },
  },
  {
    id: 'REQ-2026-048',
    supplierId: 'SUP-013',
    supplier: '대원제약',
    bizNumber: '205-81-55555',
    contact: '031-369-3333',
    requestedAt: '2026-04-12',
    status: '승인',
    reviewedAt: '2026-04-16',
    memo: '희망 품목: 일반의약품 (OTC) · 월 예상 주문액: 200~500만원 · 배송 주기: 주 2~3회 · 결제 조건: 월말 30일',
    form: {
      ...BASE_PHARMACY,
      itemGroups: ['일반의약품 (OTC)'],
      volume: '200~500만원',
      frequency: '주 2~3회',
      paymentTerm: '월말 30일',
      note: '호흡기·소화기 일반의약품 주력 거래 희망하며, 장기 거래 파트너로 자리잡고자 합니다.',
    },
  },
  {
    id: 'REQ-2026-046',
    supplierId: 'SUP-015',
    supplier: '옵투스',
    bizNumber: '207-81-77777',
    contact: '02-418-9988',
    requestedAt: '2026-04-08',
    status: '반려',
    reviewedAt: '2026-04-11',
    reviewMemo: '월 최소 주문 금액 기준 미충족. 3개월 후 재검토 가능.',
    memo: '희망 품목: 일반의약품 (OTC) · 월 예상 주문액: 50~200만원 · 배송 주기: 주 1회 · 결제 조건: 선결제',
    form: {
      ...BASE_PHARMACY,
      itemGroups: ['일반의약품 (OTC)'],
      volume: '50~200만원',
      frequency: '주 1회',
      paymentTerm: '선결제',
      note: '안과 점안제 라인업 소량 공급을 요청드립니다.',
    },
  },
  {
    id: 'REQ-2026-044',
    supplierId: 'SUP-017',
    supplier: '유유제약',
    bizNumber: '209-81-99999',
    contact: '043-644-3030',
    requestedAt: '2026-04-03',
    status: '승인',
    reviewedAt: '2026-04-07',
    memo: '희망 품목: 일반의약품 (OTC), 외용제 · 월 예상 주문액: 200~500만원 · 배송 주기: 주 1회 · 결제 조건: 월말 30일',
    form: {
      ...BASE_PHARMACY,
      itemGroups: ['일반의약품 (OTC)', '외용제'],
      volume: '200~500만원',
      frequency: '주 1회',
      paymentTerm: '월말 30일',
      note: '근골격계 처방의약품 및 관련 일반약 거래를 희망합니다.',
    },
  },
  {
    id: 'REQ-2026-042',
    supplierId: 'SUP-019',
    supplier: '경남제약',
    bizNumber: '211-81-20202',
    contact: '055-572-6767',
    requestedAt: '2026-03-28',
    status: '반려',
    reviewedAt: '2026-04-02',
    reviewMemo: '당사 지역 대리점 계약 구조상 직거래가 불가합니다. 지역 대리점을 통한 공급만 가능합니다.',
    memo: '희망 품목: 건강기능식품, 일반의약품 (OTC) · 월 예상 주문액: 50~200만원 · 배송 주기: 주 2~3회 · 결제 조건: 익월 15일',
    form: {
      ...BASE_PHARMACY,
      itemGroups: ['건강기능식품', '일반의약품 (OTC)'],
      volume: '50~200만원',
      frequency: '주 2~3회',
      paymentTerm: '익월 15일',
      note: '비타민·영양제(레모나 등) 라인업 공급을 요청드립니다.',
    },
  },
];

// 거래 중 공급사의 거래내역 생성용 플랜
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

export const SUPPLIER_TRANSACTIONS: SupplierTransaction[] = SUPPLIER_DIRECTORY
  .filter((s) => s.approved)
  .flatMap((s) => {
    const plan = SUPPLIER_TX_PLAN[s.id];
    return plan ? generateTransactions(s.id, plan.seed, plan.count, plan.avg) : [];
  });

export const APPROVED_SUPPLIERS: ApprovedSupplier[] = SUPPLIER_DIRECTORY
  .filter((s): s is SupplierInfo & { approvedAt: string; paymentTerm: string } => !!s.approved && !!s.approvedAt && !!s.paymentTerm)
  .map((s) => {
    const txs = SUPPLIER_TRANSACTIONS.filter((t) => t.supplierId === s.id);
    const ytdAmount = txs.reduce((sum, t) => sum + t.amount, 0);
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const monthlyOrders = txs.filter((t) => t.date.startsWith(thisMonth)).length;
    return { ...s, ytdAmount, monthlyOrders, transactionCount: txs.length };
  });

export function getSupplier(id: string): SupplierInfo | undefined {
  return SUPPLIER_DIRECTORY.find((s) => s.id === id);
}

export function getApprovedSupplier(id: string): ApprovedSupplier | undefined {
  return APPROVED_SUPPLIERS.find((s) => s.id === id);
}

export function getSupplierByName(name: string): SupplierInfo | undefined {
  return SUPPLIER_DIRECTORY.find((s) => s.name === name);
}

export function getSupplierTransactions(id: string): SupplierTransaction[] {
  return SUPPLIER_TRANSACTIONS.filter((t) => t.supplierId === id);
}

// 파트너 요청 타입 유틸
export type SupplierTradeStatus = '거래중' | '신청중' | '반려' | '미신청';

export function deriveTradeStatus(supplierId: string, requests: PartnerRequest[], approved: boolean): SupplierTradeStatus {
  if (approved) return '거래중';
  const latest = requests.filter((r) => r.supplierId === supplierId).sort((a, b) => b.requestedAt.localeCompare(a.requestedAt))[0];
  if (!latest) return '미신청';
  if (latest.status === '대기') return '신청중';
  if (latest.status === '승인') return '거래중';
  return '반려';
}
