import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductPaginationProps {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}

export function ProductPagination({ page, totalPages, onChange }: ProductPaginationProps) {
  if (totalPages <= 1) return null;
  const pages = buildPages(page, totalPages);

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="w-8 h-8 rounded-md flex items-center justify-center text-[#495057] hover:bg-[#F1F3F5] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        aria-label="이전"
      >
        <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
      </button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-[#ADB5BD] text-xs">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`min-w-8 h-8 px-2 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
              p === page ? 'bg-[#4E7FFF] text-white' : 'text-[#495057] hover:bg-[#F1F3F5]'
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="w-8 h-8 rounded-md flex items-center justify-center text-[#495057] hover:bg-[#F1F3F5] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        aria-label="다음"
      >
        <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
      </button>
    </div>
  );
}

function buildPages(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out: (number | '...')[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) out.push('...');
  for (let i = start; i <= end; i++) out.push(i);
  if (end < total - 1) out.push('...');
  out.push(total);
  return out;
}
