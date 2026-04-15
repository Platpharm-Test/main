import Inventory2Icon from '@mui/icons-material/Inventory2';
import { useState } from 'react';

type StockType = '정상' | '재고 부족' | '품절 임박' | '품절';
type Category = '전체' | StockType;

interface StockItem {
  name: string;
  stock: number;
  type: StockType;
}

const items: StockItem[] = [
  { name: '게보린 정', stock: 0, type: '품절' },
  { name: '훼스탈 플러스', stock: 0, type: '품절' },
  { name: '리바푸라빈 디뮤코정', stock: 3, type: '품절 임박' },
  { name: '타이레놀 500mg', stock: 5, type: '품절 임박' },
  { name: '베아제정', stock: 2, type: '품절 임박' },
  { name: '판콜에이 내복액', stock: 4, type: '품절 임박' },
  { name: '아스피린 100mg', stock: 12, type: '재고 부족' },
  { name: '파모큐정 20정', stock: 18, type: '재고 부족' },
  { name: '이지엔6 프로', stock: 15, type: '재고 부족' },
  { name: '센트룸 멀티비타민', stock: 20, type: '재고 부족' },
  { name: '마데카솔 연고', stock: 85, type: '정상' },
  { name: '후시딘 연고', stock: 120, type: '정상' },
  { name: '인사돌 플러스', stock: 64, type: '정상' },
  { name: '우루사 100mg', stock: 210, type: '정상' },
];

const types: StockType[] = ['정상', '재고 부족', '품절 임박', '품절'];

const shortLabel: Record<StockType, string> = {
  '정상': '정상',
  '재고 부족': '부족',
  '품절 임박': '임박',
  '품절': '품절',
};

const badgeStyle: Record<StockType, string> = {
  '정상': 'bg-[#E6FCF5] text-[#0CA678]',
  '재고 부족': 'bg-[#FFF9DB] text-[#F59F00]',
  '품절 임박': 'bg-[#FFF4E6] text-[#F76707]',
  '품절': 'bg-[#FFE3E3] text-[#FA5252]',
};

export function AlertList() {
  const [filter, setFilter] = useState<Category>('전체');

  const counts: Record<StockType, number> = {
    '정상': items.filter((i) => i.type === '정상').length,
    '재고 부족': items.filter((i) => i.type === '재고 부족').length,
    '품절 임박': items.filter((i) => i.type === '품절 임박').length,
    '품절': items.filter((i) => i.type === '품절').length,
  };

  const filtered = (filter === '전체' ? items : items.filter((i) => i.type === filter)).slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 h-full flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[#4E7FFF] inline-flex" style={{ fontSize: '20px' }}>
            <Inventory2Icon fontSize="inherit" />
          </span>
          <h3 className="text-sm font-bold text-[#212529]">재고 관리</h3>
        </div>
        <span className="text-xs text-[#868E96] font-medium">전체 {items.length}건</span>
      </div>

      {/* 필터 칩 */}
      <div className="flex items-center gap-1.5 mb-6 flex-wrap">
        <button
          onClick={() => setFilter('전체')}
          className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
            filter === '전체'
              ? 'bg-[#4E7FFF] text-white'
              : 'bg-[#F8F9FA] text-[#868E96] hover:bg-[#F1F3F5]'
          }`}
        >
          전체
        </button>
        {types.map((t) => {
          const active = filter === t;
          return (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                active
                  ? 'bg-[#4E7FFF] text-white'
                  : 'bg-[#F8F9FA] text-[#868E96] hover:bg-[#F1F3F5]'
              }`}
            >
              {shortLabel[t]} {counts[t]}
            </button>
          );
        })}
      </div>

      {/* 리스트 */}
      <div className="flex-1 overflow-y-auto min-h-[260px]">
        {filtered.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-xs text-[#ADB5BD]">해당 항목이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 pb-4 border-b border-[#F1F3F5] last:border-b-0 last:pb-0"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${badgeStyle[item.type]}`}>
                    {item.type}
                  </span>
                  <p className="text-sm font-semibold text-[#212529] truncate">{item.name}</p>
                </div>
                <span className="text-xs text-[#868E96] shrink-0">
                  남은 재고 {item.stock}개
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 푸터 */}
      <div className="mt-3 pt-3 border-t border-[#F1F3F5] flex justify-center">
        <button className="text-xs text-[#4E7FFF] font-semibold hover:text-[#3D6FEF] transition-colors inline-flex items-center gap-1">
          전체 재고 보기
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
