import { Search, Zap } from 'lucide-react';

interface ProductSearchBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  onQuickOrderClick: () => void;
}

export function ProductSearchBar({ search, onSearchChange, onQuickOrderClick }: ProductSearchBarProps) {
  return (
    <div className="sticky top-14 z-30 bg-[#F5F6F8] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 mb-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#868E96]" strokeWidth={2.5} />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="의약품명·성분·SKU·제약사 검색"
            className="w-full h-11 pl-10 pr-4 text-sm bg-white rounded-lg border border-[#DEE2E6] focus:border-[#4E7FFF] focus:outline-none transition-colors"
          />
        </div>
        <button
          onClick={onQuickOrderClick}
          className="h-11 px-4 rounded-lg border border-[#DEE2E6] bg-white text-sm font-semibold text-[#495057] hover:border-[#4E7FFF] hover:text-[#4E7FFF] transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Zap className="w-4 h-4" strokeWidth={2.5} />
          빠른 주문
        </button>
      </div>
    </div>
  );
}
