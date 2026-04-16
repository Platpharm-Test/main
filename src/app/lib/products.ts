export type Stock = '충분' | '보통' | '품절 임박' | '품절';
export type DrugClass = '전문' | '일반';
export type DrugForm = '정' | '캡슐' | '시럽' | '연고' | '주사' | '기타';

export interface Product {
  id: number;
  code: string;
  name: string;
  supplier: string;
  drugClass: DrugClass;
  category: string;
  form: DrugForm;
  spec: string;
  unitPrice: number;
  packSize: number;
  packLabel: string;
  moq: number;
  stock: Stock;
  stockCount: number;
  image?: string;
  recentOrdered?: boolean;
  newArrival?: boolean;
}

export const SUPPLIERS = ['유한양행', '종근당', '삼진제약', '신신제약', '일양약품', '경방신약', '한풍제약', '더유제약', '한솔신약', '에프앤디넷'];
export const CATEGORIES = ['해열진통소염제', '소화기계약', '순환기계약', '호흡기계약', '항생제', '비타민·영양제', '감기약', '알레르기약', '당뇨약', '신경계약', '호르몬제', '외용제', '안과약', '피부과약', '근골격계약', '비뇨기계약', '한방제제', '건강기능식품', '드링크·액제', '모발·두피', '반창고·밴드·파스', '여성건강', '유소아용품', '진단키트', '측정기기', '치아·구강용품', '해충퇴치용품', '기타'];
export const FORMS: DrugForm[] = ['정', '캡슐', '시럽', '연고', '주사', '기타'];
export const CLASSES: DrugClass[] = ['전문', '일반'];

export const PRODUCTS: Product[] = [
  // 유한양행
  { id: 1, code: 'YUH-001', name: '리바푸라빈 디뮤코정', supplier: '유한양행', drugClass: '전문', category: '소화기계약', form: '정', spec: '500mg × 60정', unitPrice: 1287, packSize: 60, packLabel: '1박스 (60정)', moq: 1, stock: '충분', stockCount: 248, image: '/pill.png', recentOrdered: true },
  { id: 10, code: 'YUH-010', name: '훼스탈 플러스', supplier: '유한양행', drugClass: '일반', category: '소화기계약', form: '정', spec: '50정', unitPrice: 720, packSize: 50, packLabel: '1통 (50정)', moq: 1, stock: '품절', stockCount: 0, image: '/pill.png' },
  { id: 13, code: 'YUH-013', name: '암브록솔 정', supplier: '유한양행', drugClass: '전문', category: '감기약', form: '정', spec: '30mg × 100정', unitPrice: 320, packSize: 100, packLabel: '1통 (100정)', moq: 1, stock: '충분', stockCount: 528, image: '/pill.png' },
  { id: 21, code: 'YUH-021', name: '아세트아미노펜 시럽', supplier: '유한양행', drugClass: '일반', category: '해열진통소염제', form: '시럽', spec: '160ml', unitPrice: 2200, packSize: 1, packLabel: '1병', moq: 1, stock: '충분', stockCount: 156, image: '/package.png' },
  { id: 25, code: 'YUH-025', name: '유한 당케어 측정세트', supplier: '유한양행', drugClass: '일반', category: '측정기기', form: '기타', spec: '측정기 1세트 + 시험지 50EA + 채혈기', unitPrice: 17600, packSize: 1, packLabel: '1세트', moq: 1, stock: '충분', stockCount: 85, image: '/package.png' },
  { id: 28, code: 'YUH-028', name: '유한메디카 치약리갈칼슘', supplier: '유한양행', drugClass: '일반', category: '치아·구강용품', form: '기타', spec: '150g', unitPrice: 5280, packSize: 1, packLabel: '1개', moq: 1, stock: '충분', stockCount: 320, image: '/package.png', newArrival: true },
  { id: 29, code: 'YUH-029', name: '유한메디카 치약 잇몸 허브', supplier: '유한양행', drugClass: '일반', category: '치아·구강용품', form: '기타', spec: '150g', unitPrice: 5640, packSize: 1, packLabel: '1개', moq: 1, stock: '보통', stockCount: 175, image: '/package.png' },
  // 종근당
  { id: 9, code: 'JOO-009', name: '센트룸 멀티비타민', supplier: '종근당', drugClass: '일반', category: '비타민·영양제', form: '정', spec: '60정', unitPrice: 380, packSize: 60, packLabel: '1통 (60정)', moq: 1, stock: '보통', stockCount: 142, image: '/pill.png', recentOrdered: true },
  { id: 19, code: 'JOO-019', name: '오메가3 1200', supplier: '종근당', drugClass: '일반', category: '비타민·영양제', form: '캡슐', spec: '1200mg × 60캡슐', unitPrice: 980, packSize: 60, packLabel: '1통 (60캡슐)', moq: 1, stock: '충분', stockCount: 268, image: '/package.png' },
  { id: 27, code: 'JOO-027', name: '메가트루 루테인정', supplier: '종근당', drugClass: '일반', category: '건강기능식품', form: '정', spec: '500mg × 120정', unitPrice: 22770, packSize: 1, packLabel: '1통 (120정)', moq: 1, stock: '보통', stockCount: 64, image: '/pill.png' },
  { id: 34, code: 'JOO-034', name: '종근당 비타민C 1000', supplier: '종근당', drugClass: '일반', category: '비타민·영양제', form: '정', spec: '1000mg × 90정', unitPrice: 580, packSize: 90, packLabel: '1통 (90정)', moq: 1, stock: '보통', stockCount: 132, image: '/pill.png' },
  // 삼진제약
  { id: 6, code: 'SAM-006', name: '게보린 정', supplier: '삼진제약', drugClass: '일반', category: '해열진통소염제', form: '정', spec: '300mg × 30정', unitPrice: 1200, packSize: 30, packLabel: '1박스 (30정)', moq: 1, stock: '품절', stockCount: 0, image: '/pill.png' },
  { id: 16, code: 'SAM-016', name: '세파클러 캡슐', supplier: '삼진제약', drugClass: '전문', category: '항생제', form: '캡슐', spec: '250mg × 60캡슐', unitPrice: 1240, packSize: 60, packLabel: '1박스 (60캡슐)', moq: 1, stock: '품절 임박', stockCount: 14, image: '/package.png' },
  { id: 24, code: 'SAM-024', name: '레보플록사신 정', supplier: '삼진제약', drugClass: '전문', category: '항생제', form: '정', spec: '500mg × 50정', unitPrice: 2240, packSize: 50, packLabel: '1박스 (50정)', moq: 1, stock: '품절 임박', stockCount: 9, image: '/pill.png' },
  // 신신제약
  { id: 3, code: 'SSJ-003', name: '아스피린 100mg', supplier: '신신제약', drugClass: '일반', category: '해열진통소염제', form: '정', spec: '100mg × 100정', unitPrice: 450, packSize: 100, packLabel: '1통 (100정)', moq: 1, stock: '품절 임박', stockCount: 12, image: '/pill.png' },
  { id: 12, code: 'SSJ-012', name: '신신파스 아렉스', supplier: '신신제약', drugClass: '일반', category: '반창고·밴드·파스', form: '기타', spec: '20매입', unitPrice: 4800, packSize: 1, packLabel: '1박스 (20매)', moq: 1, stock: '충분', stockCount: 410, image: '/package.png', newArrival: true },
  { id: 35, code: 'SSJ-035', name: '신신 캡사이신 연고', supplier: '신신제약', drugClass: '일반', category: '외용제', form: '연고', spec: '30g/튜브', unitPrice: 6500, packSize: 1, packLabel: '1개', moq: 1, stock: '충분', stockCount: 198, image: '/package.png' },
  // 일양약품
  { id: 4, code: 'ILY-004', name: '일양 타이레놀정 500mg', supplier: '일양약품', drugClass: '일반', category: '해열진통소염제', form: '정', spec: '500mg × 100정', unitPrice: 680, packSize: 100, packLabel: '1통 (100정)', moq: 1, stock: '보통', stockCount: 96, image: '/pill.png', recentOrdered: true },
  { id: 17, code: 'ILY-017', name: '일양 노이시린정', supplier: '일양약품', drugClass: '전문', category: '소화기계약', form: '정', spec: '30mg × 60정', unitPrice: 1620, packSize: 60, packLabel: '1박스 (60정)', moq: 1, stock: '충분', stockCount: 224, image: '/pill.png' },
  { id: 36, code: 'ILY-036', name: '일양 비타민D 1000IU', supplier: '일양약품', drugClass: '일반', category: '비타민·영양제', form: '캡슐', spec: '60캡슐', unitPrice: 420, packSize: 60, packLabel: '1통 (60캡슐)', moq: 1, stock: '충분', stockCount: 305, image: '/package.png' },
  // 경방신약
  { id: 2, code: 'KBS-002', name: '경방 파모큐정 20mg', supplier: '경방신약', drugClass: '전문', category: '소화기계약', form: '정', spec: '20mg × 20정', unitPrice: 2450, packSize: 20, packLabel: '1박스 (20정)', moq: 1, stock: '보통', stockCount: 84, image: '/pill.png' },
  { id: 7, code: 'KBS-007', name: '경방 소화효소정', supplier: '경방신약', drugClass: '일반', category: '소화기계약', form: '정', spec: '50mg × 100정', unitPrice: 540, packSize: 100, packLabel: '1통 (100정)', moq: 1, stock: '품절 임박', stockCount: 18, image: '/pill.png', newArrival: true },
  { id: 23, code: 'KBS-023', name: '경방 베포타스틴 정', supplier: '경방신약', drugClass: '전문', category: '알레르기약', form: '정', spec: '10mg × 100정', unitPrice: 1380, packSize: 100, packLabel: '1통 (100정)', moq: 1, stock: '충분', stockCount: 178, image: '/pill.png' },
  // 한풍제약
  { id: 5, code: 'HPJ-005', name: '한풍 아목시실린 캡슐', supplier: '한풍제약', drugClass: '전문', category: '항생제', form: '캡슐', spec: '500mg × 100캡슐', unitPrice: 740, packSize: 100, packLabel: '1박스 (100캡슐)', moq: 1, stock: '충분', stockCount: 188, image: '/package.png' },
  { id: 37, code: 'HPJ-037', name: '한풍 쌍화탕 엑스', supplier: '한풍제약', drugClass: '일반', category: '한방제제', form: '시럽', spec: '75ml × 10병', unitPrice: 1250, packSize: 10, packLabel: '1박스 (10병)', moq: 1, stock: '충분', stockCount: 340, image: '/package.png' },
  { id: 38, code: 'HPJ-038', name: '한풍 우황청심환', supplier: '한풍제약', drugClass: '일반', category: '한방제제', form: '기타', spec: '10환입', unitPrice: 3200, packSize: 10, packLabel: '1박스 (10환)', moq: 1, stock: '보통', stockCount: 92, image: '/package.png' },
  // 더유제약
  { id: 8, code: 'DYU-008', name: '더유 우루사 100mg', supplier: '더유제약', drugClass: '일반', category: '소화기계약', form: '정', spec: '100mg × 60정', unitPrice: 920, packSize: 60, packLabel: '1박스 (60정)', moq: 1, stock: '충분', stockCount: 215, image: '/pill.png' },
  { id: 14, code: 'DYU-014', name: '더유 뮤코펙트 정', supplier: '더유제약', drugClass: '전문', category: '감기약', form: '정', spec: '30mg × 50정', unitPrice: 580, packSize: 50, packLabel: '1박스 (50정)', moq: 1, stock: '보통', stockCount: 76, image: '/pill.png' },
  { id: 39, code: 'DYU-039', name: '더유 로라타딘 정', supplier: '더유제약', drugClass: '일반', category: '알레르기약', form: '정', spec: '10mg × 30정', unitPrice: 890, packSize: 30, packLabel: '1박스 (30정)', moq: 1, stock: '충분', stockCount: 265, image: '/pill.png' },
  // 한솔신약
  { id: 11, code: 'HSS-011', name: '한솔 판콜에이 내복액', supplier: '한솔신약', drugClass: '일반', category: '감기약', form: '시럽', spec: '30ml × 10병', unitPrice: 1480, packSize: 10, packLabel: '1박스 (10병)', moq: 1, stock: '품절 임박', stockCount: 22, image: '/package.png' },
  { id: 20, code: 'HSS-020', name: '한솔 인사돌 플러스', supplier: '한솔신약', drugClass: '일반', category: '기타', form: '정', spec: '120정', unitPrice: 1450, packSize: 120, packLabel: '1통 (120정)', moq: 1, stock: '보통', stockCount: 64, image: '/pill.png', recentOrdered: true },
  { id: 40, code: 'HSS-040', name: '한솔 이지엔6 애니', supplier: '한솔신약', drugClass: '일반', category: '해열진통소염제', form: '정', spec: '200mg × 40정', unitPrice: 650, packSize: 40, packLabel: '1박스 (40정)', moq: 1, stock: '충분', stockCount: 186, image: '/pill.png', newArrival: true },
  // 에프앤디넷 (건기식/의약외품 유통)
  { id: 15, code: 'FND-015', name: '아이미루 40EX 마일드', supplier: '에프앤디넷', drugClass: '일반', category: '안과약', form: '기타', spec: '15ml', unitPrice: 9800, packSize: 1, packLabel: '1개', moq: 1, stock: '충분', stockCount: 142, image: '/package.png' },
  { id: 22, code: 'FND-022', name: '아이미루 40EX 골드', supplier: '에프앤디넷', drugClass: '일반', category: '안과약', form: '기타', spec: '15ml', unitPrice: 12500, packSize: 1, packLabel: '1개', moq: 1, stock: '보통', stockCount: 88, image: '/package.png', newArrival: true },
  { id: 26, code: 'FND-026', name: '티트리메디 연고', supplier: '에프앤디넷', drugClass: '일반', category: '외용제', form: '연고', spec: '30g/튜브', unitPrice: 9923, packSize: 1, packLabel: '1개', moq: 1, stock: '충분', stockCount: 210, image: '/package.png' },
  { id: 30, code: 'FND-030', name: '아이미루 40EX 골드콘택트', supplier: '에프앤디넷', drugClass: '일반', category: '안과약', form: '기타', spec: '15ml', unitPrice: 13200, packSize: 1, packLabel: '1개', moq: 1, stock: '충분', stockCount: 96, image: '/package.png' },
  { id: 33, code: 'FND-033', name: '아이미루 40EX 오리지날', supplier: '에프앤디넷', drugClass: '일반', category: '안과약', form: '기타', spec: '15ml', unitPrice: 8900, packSize: 1, packLabel: '1개', moq: 1, stock: '품절 임박', stockCount: 11, image: '/package.png' },
];

export const STOCK_DOT: Record<Stock, string> = {
  '충분': 'bg-[#0CA678]',
  '보통': 'bg-[#4E7FFF]',
  '품절 임박': 'bg-[#F76707]',
  '품절': 'bg-[#FA5252]',
};

export const STOCK_LABEL_COLOR: Record<Stock, string> = {
  '충분': 'text-[#0CA678]',
  '보통': 'text-[#4E7FFF]',
  '품절 임박': 'text-[#F76707]',
  '품절': 'text-[#FA5252]',
};
