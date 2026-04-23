import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Building2, ChevronDown, ChevronRight, LayoutGrid, List as ListIcon, Search } from 'lucide-react';
import { PageShell } from '../components/PageShell';
import { SUPPLIER_DIRECTORY, type SupplierTradeStatus } from '../lib/partners';
import { usePartners } from '../lib/partnersContext';
import { PRODUCTS } from '../lib/products';

const FILTERS: ('전체' | SupplierTradeStatus)[] = ['전체', '거래중', '신청중', '반려', '미신청'];

type Sort = '거래중 우선' | '상품 많은순' | '상품 적은순' | '최신 등록순' | '이름순';
const SORTS: Sort[] = ['거래중 우선', '상품 많은순', '상품 적은순', '최신 등록순', '이름순'];

function statusBadge(s: SupplierTradeStatus) {
  switch (s) {
    case '거래중': return 'bg-[#EDF2FF] text-[#4E7FFF]';
    case '신청중': return 'bg-[#FFF4E6] text-[#E67700]';
    case '반려': return 'bg-[#FFE3E3] text-[#C92A2A]';
    case '미신청': return 'bg-[#F1F3F5] text-[#868E96]';
  }
}

const STATUS_PRIORITY: Record<SupplierTradeStatus, number> = {
  '거래중': 0, '신청중': 1, '반려': 2, '미신청': 3,
};

type View = 'list' | 'grid';

export default function PartnersPage() {
  const navigate = useNavigate();
  const { getTradeStatus } = usePartners();
  const [filter, setFilter] = useState<'전체' | SupplierTradeStatus>('전체');
  const [query, setQuery] = useState('');
  const [view, setView] = useState<View>('list');
  const [sort, setSort] = useState<Sort>('거래중 우선');

  const list = useMemo(() => {
    return SUPPLIER_DIRECTORY.map((s) => {
      const status = getTradeStatus(s.id);
      const productCount = PRODUCTS.filter((p) => p.supplier === s.name).length;
      return { ...s, tradeStatus: status, productCount };
    });
  }, [getTradeStatus]);

  const filtered = useMemo(() => {
    const arr = list.filter((s) => {
      if (filter !== '전체' && s.tradeStatus !== filter) return false;
      if (query && !s.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
    const sorted = [...arr];
    switch (sort) {
      case '거래중 우선':
        sorted.sort((a, b) => STATUS_PRIORITY[a.tradeStatus] - STATUS_PRIORITY[b.tradeStatus] || a.name.localeCompare(b.name, 'ko'));
        break;
      case '상품 많은순':
        sorted.sort((a, b) => b.productCount - a.productCount || a.name.localeCompare(b.name, 'ko'));
        break;
      case '상품 적은순':
        sorted.sort((a, b) => a.productCount - b.productCount || a.name.localeCompare(b.name, 'ko'));
        break;
      case '최신 등록순':
        sorted.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case '이름순':
        sorted.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
        break;
    }
    return sorted;
  }, [list, filter, query, sort]);

  const counts: Record<'전체' | SupplierTradeStatus, number> = {
    '전체': list.length,
    '거래중': list.filter((s) => s.tradeStatus === '거래중').length,
    '신청중': list.filter((s) => s.tradeStatus === '신청중').length,
    '반려': list.filter((s) => s.tradeStatus === '반려').length,
    '미신청': list.filter((s) => s.tradeStatus === '미신청').length,
  };

  return (
    <PageShell title="제약사 목록" description="등록된 제약사를 살펴보고 거래를 신청할 수 있습니다.">
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#868E96]" strokeWidth={2} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="제약사명 검색"
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#DEE2E6] text-sm outline-none focus:border-[#4E7FFF]"
          />
        </div>
      </div>

      <div
        className="flex items-center gap-1.5 mb-4 overflow-x-auto [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {FILTERS.map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`h-9 px-4 rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors flex items-center gap-1.5 ${active ? 'bg-[#212529] text-white' : 'bg-white border border-[#DEE2E6] text-[#495057] hover:border-[#212529]'}`}
            >
              <span>{f}</span>
              <span className={`tabular-nums ${active ? 'text-white/70' : 'text-[#ADB5BD]'}`}>{counts[f]}</span>
            </button>
          );
        })}
      </div>

      {/* 결과 헤더 + 뷰 토글 + 정렬 */}
      <div className="flex items-center justify-between mb-3 gap-2">
        <p className="text-xs sm:text-sm text-[#495057]">결과 <span className="font-bold text-[#212529]">{filtered.length}</span>건</p>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-[#DEE2E6] rounded-md overflow-hidden">
            <button
              onClick={() => setView('list')}
              aria-label="리스트 뷰"
              className={`p-1.5 cursor-pointer transition-colors ${view === 'list' ? 'bg-[#212529] text-white' : 'text-[#495057] hover:bg-[#F8F9FA]'}`}
            >
              <ListIcon className="w-4 h-4" strokeWidth={2.5} />
            </button>
            <button
              onClick={() => setView('grid')}
              aria-label="그리드 뷰"
              className={`p-1.5 cursor-pointer transition-colors ${view === 'grid' ? 'bg-[#212529] text-white' : 'text-[#495057] hover:bg-[#F8F9FA]'}`}
            >
              <LayoutGrid className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
          <SortDropdown value={sort} options={SORTS} onChange={setSort} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-[#DEE2E6] bg-white px-6 py-16 text-center">
          <p className="text-sm text-[#868E96]">조건에 맞는 제약사가 없습니다.</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((s) => (
            <button
              key={s.id}
              onClick={() => navigate(`/partners/${s.id}`)}
              className="text-left rounded-xl border border-[#E9ECEF] bg-white p-5 hover:border-[#4E7FFF] hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#F1F3F5] flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-[#495057]" strokeWidth={2} />
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${statusBadge(s.tradeStatus)}`}>{s.tradeStatus}</span>
              </div>
              <h3 className="text-base font-bold text-[#212529] mb-1">{s.name}</h3>
              <p className="text-[11px] text-[#868E96] mb-3 line-clamp-2">{s.description}</p>
              <div className="flex items-center gap-2 text-[11px] text-[#495057]">
                <span>상품 {s.productCount}종</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-[#E9ECEF] bg-white overflow-hidden">
          <div className="hidden lg:grid grid-cols-[48px_1fr_100px_100px_24px] items-center gap-x-4 px-5 py-2.5 bg-[#F8F9FA] border-b border-[#E9ECEF] text-[11px] font-bold text-[#495057]">
            <span></span>
            <span>제약사</span>
            <span className="text-center">상품</span>
            <span className="text-center">거래 상태</span>
            <span></span>
          </div>
          {filtered.map((s) => (
            <button
              key={s.id}
              onClick={() => navigate(`/partners/${s.id}`)}
              className="w-full text-left lg:grid lg:grid-cols-[48px_1fr_100px_100px_24px] lg:items-center lg:gap-x-4 flex items-start gap-3 px-5 py-3 border-b border-[#F1F3F5] last:border-0 hover:bg-[#FAFBFC] cursor-pointer transition-colors"
            >
              <div className="w-10 h-10 lg:w-10 lg:h-10 rounded-lg bg-[#F1F3F5] flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-[#495057]" strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-[#212529]">{s.name}</p>
                  <span className={`lg:hidden text-[10px] font-bold px-1.5 py-0.5 rounded ${statusBadge(s.tradeStatus)}`}>{s.tradeStatus}</span>
                </div>
                <p className="text-[11px] text-[#868E96] line-clamp-1">{s.description}</p>
                <div className="lg:hidden flex items-center gap-3 mt-1 text-[10px] text-[#ADB5BD]">
                  <span>상품 {s.productCount}종</span>
                </div>
              </div>
              <p className="hidden lg:block text-xs text-[#495057] tabular-nums lg:text-center">{s.productCount}종</p>
              <div className="hidden lg:block lg:text-center">
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${statusBadge(s.tradeStatus)}`}>{s.tradeStatus}</span>
              </div>
              <ChevronRight className="hidden lg:block w-4 h-4 text-[#ADB5BD]" strokeWidth={2} />
            </button>
          ))}
        </div>
      )}
    </PageShell>
  );
}

function SortDropdown({ value, options, onChange }: { value: Sort; options: Sort[]; onChange: (v: Sort) => void }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="h-8 px-3 rounded-md border border-[#DEE2E6] bg-white text-xs font-semibold text-[#495057] hover:bg-[#F8F9FA] transition-colors flex items-center gap-1.5 cursor-pointer"
      >
        {value}
        <ChevronDown className="w-3 h-3" strokeWidth={2.5} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-36 bg-white border border-[#DEE2E6] rounded-md shadow-lg z-20 overflow-hidden">
          {options.map((s) => (
            <button
              key={s}
              onClick={() => { onChange(s); setOpen(false); }}
              className={`w-full px-3 py-2 text-left text-xs hover:bg-[#F8F9FA] cursor-pointer ${value === s ? 'text-[#4E7FFF] font-semibold' : 'text-[#495057]'}`}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
