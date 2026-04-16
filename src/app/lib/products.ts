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

export const SUPPLIERS = ['유한양행', '종근당', '삼진제약', '신신제약', '일양약품', '경방신약', '한풍제약', '더유제약', '한솔신약', '에프앤디넷', '노보노디스크', 'SK케미칼', '대원제약', '셀로맥스', '옵투스', '아이월드', '유유제약', '익수제약', '경남제약'];
export const CATEGORIES = ['해열진통소염제', '소화기계약', '순환기계약', '호흡기계약', '항생제', '비타민·영양제', '감기약', '알레르기약', '당뇨약', '신경계약', '호르몬제', '외용제', '안과약', '피부과약', '근골격계약', '비뇨기계약', '한방제제', '건강기능식품', '드링크·액제', '모발·두피', '반창고·밴드·파스', '여성건강', '유소아용품', '진단키트', '측정기기', '치아·구강용품', '해충퇴치용품', '기타'];
export const FORMS: DrugForm[] = ['정', '캡슐', '시럽', '연고', '주사', '기타'];
export const CLASSES: DrugClass[] = ['전문', '일반'];

export const PRODUCTS: Product[] = [
  // 유한양행 (실제 OTC)
  { id: 1, code: 'YUH-001', name: '안티푸라민 연고', supplier: '유한양행', drugClass: '일반', category: '외용제', form: '연고', spec: '60g', unitPrice: 5500, packSize: 1, packLabel: '1개', moq: 1, stock: '충분', stockCount: 248, image: '/package.png', recentOrdered: true },
  { id: 10, code: 'YUH-010', name: '삐콤씨 정', supplier: '유한양행', drugClass: '일반', category: '비타민·영양제', form: '정', spec: '100정', unitPrice: 720, packSize: 100, packLabel: '1통 (100정)', moq: 1, stock: '품절', stockCount: 0, image: '/pill.png' },
  { id: 13, code: 'YUH-013', name: '래피콜케어 건조시럽', supplier: '유한양행', drugClass: '일반', category: '감기약', form: '기타', spec: '3g × 10포', unitPrice: 3200, packSize: 10, packLabel: '1박스 (10포)', moq: 1, stock: '충분', stockCount: 528, image: '/package.png' },
  { id: 21, code: 'YUH-021', name: '유한 이브펜 연질캡슐', supplier: '유한양행', drugClass: '일반', category: '해열진통소염제', form: '캡슐', spec: '10캡슐', unitPrice: 2200, packSize: 10, packLabel: '1박스 (10캡슐)', moq: 1, stock: '충분', stockCount: 156, image: '/package.png' },
  { id: 28, code: 'YUH-028', name: '라라올라 히알루론산 정', supplier: '유한양행', drugClass: '일반', category: '건강기능식품', form: '정', spec: '60정', unitPrice: 5280, packSize: 60, packLabel: '1통 (60정)', moq: 1, stock: '충분', stockCount: 320, image: '/pill.png', newArrival: true },
  { id: 29, code: 'YUH-029', name: '쎄레스톤지 크림', supplier: '유한양행', drugClass: '일반', category: '피부과약', form: '연고', spec: '15g', unitPrice: 5640, packSize: 1, packLabel: '1개', moq: 1, stock: '보통', stockCount: 175, image: '/package.png' },
  // 종근당건강 (실제 제품)
  { id: 9, code: 'JOO-009', name: '락토핏 생유산균 골드', supplier: '종근당', drugClass: '일반', category: '건강기능식품', form: '기타', spec: '2g × 50포', unitPrice: 380, packSize: 50, packLabel: '1박스 (50포)', moq: 1, stock: '보통', stockCount: 142, image: '/package.png', recentOrdered: true },
  { id: 19, code: 'JOO-019', name: '프로메가 오메가3', supplier: '종근당', drugClass: '일반', category: '건강기능식품', form: '캡슐', spec: '1200mg × 60캡슐', unitPrice: 980, packSize: 60, packLabel: '1통 (60캡슐)', moq: 1, stock: '충분', stockCount: 268, image: '/package.png' },
  { id: 34, code: 'JOO-034', name: '아임비타 멀티비타민', supplier: '종근당', drugClass: '일반', category: '건강기능식품', form: '정', spec: '60정', unitPrice: 580, packSize: 60, packLabel: '1통 (60정)', moq: 1, stock: '보통', stockCount: 132, image: '/pill.png' },
  // 삼진제약 (실제 게보린 라인업)
  { id: 6, code: 'SAM-006', name: '게보린 정', supplier: '삼진제약', drugClass: '일반', category: '해열진통소염제', form: '정', spec: '10정', unitPrice: 1200, packSize: 10, packLabel: '1박스 (10정)', moq: 1, stock: '품절', stockCount: 0, image: '/pill.png' },
  { id: 16, code: 'SAM-016', name: '게보린 소프트 연질캡슐', supplier: '삼진제약', drugClass: '일반', category: '해열진통소염제', form: '캡슐', spec: '10캡슐', unitPrice: 1240, packSize: 10, packLabel: '1박스 (10캡슐)', moq: 1, stock: '품절 임박', stockCount: 14, image: '/package.png' },
  { id: 24, code: 'SAM-024', name: '게보린 릴랙스 연질캡슐', supplier: '삼진제약', drugClass: '일반', category: '근골격계약', form: '캡슐', spec: '10캡슐', unitPrice: 2240, packSize: 10, packLabel: '1박스 (10캡슐)', moq: 1, stock: '품절 임박', stockCount: 9, image: '/package.png' },
  // 신신제약 (실제 파스/첩부제 라인업)
  { id: 3, code: 'SSJ-003', name: '아렉스알파정', supplier: '신신제약', drugClass: '일반', category: '해열진통소염제', form: '정', spec: '40정', unitPrice: 450, packSize: 40, packLabel: '1박스 (40정)', moq: 1, stock: '품절 임박', stockCount: 12, image: '/pill.png' },
  { id: 12, code: 'SSJ-012', name: '신신파스 아렉스', supplier: '신신제약', drugClass: '일반', category: '반창고·밴드·파스', form: '기타', spec: '20매입', unitPrice: 4800, packSize: 1, packLabel: '1박스 (20매)', moq: 1, stock: '충분', stockCount: 410, image: '/package.png', newArrival: true },
  { id: 35, code: 'SSJ-035', name: '신신파스 플렉스', supplier: '신신제약', drugClass: '일반', category: '반창고·밴드·파스', form: '기타', spec: '10매입', unitPrice: 6500, packSize: 1, packLabel: '1박스 (10매)', moq: 1, stock: '충분', stockCount: 198, image: '/package.png' },
  // 일양약품 (실제 OTC)
  { id: 4, code: 'ILY-004', name: '원비디 드링크', supplier: '일양약품', drugClass: '일반', category: '드링크·액제', form: '시럽', spec: '100ml × 10병', unitPrice: 680, packSize: 10, packLabel: '1박스 (10병)', moq: 1, stock: '보통', stockCount: 96, image: '/package.png', recentOrdered: true },
  { id: 36, code: 'ILY-036', name: '노루모 에스산', supplier: '일양약품', drugClass: '일반', category: '소화기계약', form: '기타', spec: '1.5g × 15포', unitPrice: 420, packSize: 15, packLabel: '1박스 (15포)', moq: 1, stock: '충분', stockCount: 305, image: '/package.png' },
  // 경방신약 (일반의약품 전문, 한방 포함)
  { id: 2, code: 'KBS-002', name: '경방 갈근탕액', supplier: '경방신약', drugClass: '일반', category: '한방제제', form: '시럽', spec: '75ml × 10병', unitPrice: 2450, packSize: 10, packLabel: '1박스 (10병)', moq: 1, stock: '보통', stockCount: 84, image: '/package.png' },
  { id: 7, code: 'KBS-007', name: '경방 경옥고', supplier: '경방신약', drugClass: '일반', category: '한방제제', form: '기타', spec: '20g × 30포', unitPrice: 5000, packSize: 30, packLabel: '1박스 (30포)', moq: 1, stock: '품절 임박', stockCount: 18, image: '/package.png', newArrival: true },
  // 한풍제약 (한방 전문)
  { id: 5, code: 'HPJ-005', name: '인후신캡슐', supplier: '한풍제약', drugClass: '일반', category: '감기약', form: '캡슐', spec: '10캡슐', unitPrice: 5500, packSize: 10, packLabel: '1박스 (10캡슐)', moq: 1, stock: '충분', stockCount: 188, image: '/package.png' },
  { id: 37, code: 'HPJ-037', name: '트로겐연조엑스', supplier: '한풍제약', drugClass: '일반', category: '감기약', form: '기타', spec: '11g × 20포', unitPrice: 1500, packSize: 20, packLabel: '1박스 (20포)', moq: 1, stock: '충분', stockCount: 340, image: '/package.png' },
  { id: 38, code: 'HPJ-038', name: '평온액', supplier: '한풍제약', drugClass: '일반', category: '신경계약', form: '시럽', spec: '20ml × 30포', unitPrice: 3500, packSize: 30, packLabel: '1박스 (30포)', moq: 1, stock: '보통', stockCount: 92, image: '/package.png', newArrival: true },
  { id: 41, code: 'HPJ-041', name: '에스톰액', supplier: '한풍제약', drugClass: '일반', category: '소화기계약', form: '시럽', spec: '15ml × 20포', unitPrice: 1200, packSize: 20, packLabel: '1박스 (20포)', moq: 1, stock: '충분', stockCount: 156, image: '/package.png' },
  // 더유제약 (피부/모발 전문)
  { id: 39, code: 'DYU-039', name: '클린디올 외용액', supplier: '더유제약', drugClass: '일반', category: '피부과약', form: '기타', spec: '30ml', unitPrice: 890, packSize: 1, packLabel: '1개', moq: 1, stock: '충분', stockCount: 265, image: '/package.png' },
  // 한솔신약 (한방/양한방 복합제제 전문)
  { id: 11, code: 'HSS-011', name: '마이에신정', supplier: '한솔신약', drugClass: '일반', category: '한방제제', form: '정', spec: '100정', unitPrice: 1480, packSize: 100, packLabel: '1통 (100정)', moq: 1, stock: '품절 임박', stockCount: 22, image: '/pill.png' },
  { id: 20, code: 'HSS-020', name: '맥기천과립', supplier: '한솔신약', drugClass: '일반', category: '한방제제', form: '기타', spec: '3g × 30포', unitPrice: 1450, packSize: 30, packLabel: '1박스 (30포)', moq: 1, stock: '보통', stockCount: 64, image: '/package.png', recentOrdered: true },
  { id: 40, code: 'HSS-040', name: '한솔 은교산엑스과립', supplier: '한솔신약', drugClass: '일반', category: '감기약', form: '기타', spec: '3g × 20포', unitPrice: 650, packSize: 20, packLabel: '1박스 (20포)', moq: 1, stock: '충분', stockCount: 186, image: '/package.png', newArrival: true },
  // 에프앤디넷 (약국 전용 건강기능식품 유통)
  { id: 15, code: 'FND-015', name: '닥터에디션 프로바이오틱스', supplier: '에프앤디넷', drugClass: '일반', category: '건강기능식품', form: '기타', spec: '2g × 30포', unitPrice: 9800, packSize: 30, packLabel: '1박스 (30포)', moq: 1, stock: '충분', stockCount: 142, image: '/package.png' },
  { id: 26, code: 'FND-026', name: '더팜 시크릿우먼', supplier: '에프앤디넷', drugClass: '일반', category: '여성건강', form: '캡슐', spec: '60캡슐', unitPrice: 9923, packSize: 60, packLabel: '1통 (60캡슐)', moq: 1, stock: '충분', stockCount: 210, image: '/package.png' },
  { id: 33, code: 'FND-033', name: '맘엔레디 임산부 영양제', supplier: '에프앤디넷', drugClass: '일반', category: '건강기능식품', form: '정', spec: '60정', unitPrice: 8900, packSize: 60, packLabel: '1통 (60정)', moq: 1, stock: '품절 임박', stockCount: 11, image: '/pill.png' },
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
