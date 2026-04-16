import { useState } from 'react';
import { ChevronDown, LayoutGrid, List, X } from 'lucide-react';

export const SORT_OPTIONS = ['인기순', '가격 낮은순', '가격 높은순', '최근 입고', '약품명'] as const;
export type Sort = typeof SORT_OPTIONS[number];

export type ViewMode = 'list' | 'grid';

interface ActiveChip {
  key: string;
  label: string;
  onRemove: () => void;
}

interface ProductResultHeaderProps {
  count: number;
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
  sort: Sort;
  onSortChange: (s: Sort) => void;
  activeChips: ActiveChip[];
  onResetAll: () => void;
}

export function ProductResultHeader({
  count,
  view,
  onViewChange,
  sort,
  onSortChange,
  activeChips,
  onResetAll,
}: ProductResultHeaderProps) {
  const [sortOpen, setSortOpen] = useState(false);

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between gap-2 sm:gap-3 mb-3">
        <p className="text-xs sm:text-sm text-[#495057]">
          결과 <span className="font-bold text-[#212529]">{count}</span>건
        </p>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center bg-white border border-[#DEE2E6] rounded-md overflow-hidden">
            <button
              onClick={() => onViewChange('list')}
              className={`p-1.5 cursor-pointer transition-colors ${view === 'list' ? 'bg-[#212529] text-white' : 'text-[#495057] hover:bg-[#F8F9FA]'}`}
              aria-label="리스트 뷰"
            >
              <List className="w-4 h-4" strokeWidth={2.5} />
            </button>
            <button
              onClick={() => onViewChange('grid')}
              className={`p-1.5 cursor-pointer transition-colors ${view === 'grid' ? 'bg-[#212529] text-white' : 'text-[#495057] hover:bg-[#F8F9FA]'}`}
              aria-label="그리드 뷰"
            >
              <LayoutGrid className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="h-8 px-3 rounded-md border border-[#DEE2E6] bg-white text-xs font-semibold text-[#495057] hover:bg-[#F8F9FA] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {sort}
              <ChevronDown className="w-3 h-3" strokeWidth={2.5} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 mt-1 w-32 bg-white border border-[#DEE2E6] rounded-md shadow-lg z-20 overflow-hidden">
                {SORT_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => { onSortChange(s); setSortOpen(false); }}
                    className={`w-full px-3 py-2 text-left text-xs hover:bg-[#F8F9FA] cursor-pointer ${sort === s ? 'text-[#4E7FFF] font-semibold' : 'text-[#495057]'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {activeChips.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {activeChips.map((c) => (
            <button
              key={c.key}
              onClick={c.onRemove}
              className="inline-flex items-center gap-1 h-7 pl-2.5 pr-2 rounded-full bg-[#F1F3F5] text-xs text-[#495057] hover:bg-[#E9ECEF] cursor-pointer"
            >
              {c.label}
              <X className="w-3 h-3" strokeWidth={2.5} />
            </button>
          ))}
          <button onClick={onResetAll} className="text-xs text-[#868E96] hover:text-[#495057] underline ml-1 cursor-pointer">
            모두 초기화
          </button>
        </div>
      )}
    </div>
  );
}
