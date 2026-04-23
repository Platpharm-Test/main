import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Check, ChevronDown, ChevronRight, LayoutGrid, List as ListIcon } from 'lucide-react';
import { PageShell } from '../components/PageShell';
import { ProductImage } from '../components/products/ProductImage';
import { ProductFilterBar, EMPTY_FILTER, type FilterState } from '../components/products/ProductFilterBar';
import { ProductPagination } from '../components/products/ProductPagination';
import { aggregatePurchases, type ProductPurchaseSummary } from '../lib/ledger';
import { PRODUCTS } from '../lib/products';
import { matchSearch } from '../lib/choseong';

const PAGE_SIZE = 12;

const SORTS = ['최근 구매순', '매입 많은순', '매입 적은순', '평균 단가 낮은순', '평균 단가 높은순', '약품명'] as const;
type Sort = typeof SORTS[number];

type View = 'list' | 'grid';

export default function LedgerPurchasesPage() {
  const navigate = useNavigate();

  const [filter, setFilter] = useState<FilterState>(EMPTY_FILTER);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<View>('list');
  const [sort, setSort] = useState<Sort>('최근 구매순');
  const [page, setPage] = useState(1);

  const summaries = useMemo(() => aggregatePurchases(), []);

  const filtered = useMemo(() => {
    const list = summaries.filter((s) => {
      if (search) {
        const hit = [s.productName, s.productCode, s.productCategory, ...s.suppliers].some((v) => matchSearch(v, search));
        if (!hit) return false;
      }
      if (filter.categories.length && !filter.categories.includes(s.productCategory)) return false;
      if (s.avgUnitPrice < filter.priceMin || s.avgUnitPrice > filter.priceMax) return false;
      return true;
    });
    const sorted = [...list];
    switch (sort) {
      case '최근 구매순': sorted.sort((a, b) => b.lastPurchaseDate.localeCompare(a.lastPurchaseDate)); break;
      case '매입 많은순': sorted.sort((a, b) => b.totalAmount - a.totalAmount); break;
      case '매입 적은순': sorted.sort((a, b) => a.totalAmount - b.totalAmount); break;
      case '평균 단가 낮은순': sorted.sort((a, b) => a.avgUnitPrice - b.avgUnitPrice); break;
      case '평균 단가 높은순': sorted.sort((a, b) => b.avgUnitPrice - a.avgUnitPrice); break;
      case '약품명': sorted.sort((a, b) => a.productName.localeCompare(b.productName, 'ko')); break;
    }
    return sorted;
  }, [summaries, search, filter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search, sort, filter]);

  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = [];
    filter.categories.forEach((c) => chips.push({ key: `cat-${c}`, label: c, onRemove: () => setFilter({ ...filter, categories: filter.categories.filter((v) => v !== c) }) }));
    return chips;
  }, [filter]);

  const totalAmount = summaries.reduce((s, p) => s + p.totalAmount, 0);
  const totalQty = summaries.reduce((s, p) => s + p.totalQty, 0);
  const totalPurchaseCount = summaries.reduce((s, p) => s + p.purchaseCount, 0);

  return (
    <PageShell title="구매 장부" description="구매한 제품별 누적 거래 내역을 확인합니다.">
      {/* 상단 요약 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="rounded-xl border border-[#E9ECEF] bg-white p-5">
          <p className="text-[11px] text-[#868E96] mb-1">거래 제품</p>
          <p className="text-xl font-bold text-[#212529] tabular-nums">{summaries.length}<span className="text-sm font-semibold text-[#868E96] ml-0.5">종</span></p>
        </div>
        <div className="rounded-xl border border-[#E9ECEF] bg-white p-5">
          <p className="text-[11px] text-[#868E96] mb-1">총 구매 수량</p>
          <p className="text-xl font-bold text-[#212529] tabular-nums">{totalQty.toLocaleString()}<span className="text-sm font-semibold text-[#868E96] ml-0.5">개</span></p>
        </div>
        <div className="rounded-xl border border-[#E9ECEF] bg-white p-5">
          <p className="text-[11px] text-[#868E96] mb-1">누적 매입액</p>
          <p className="text-xl font-bold text-[#4E7FFF] tabular-nums">₩{totalAmount.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-[#E9ECEF] bg-white p-5">
          <p className="text-[11px] text-[#868E96] mb-1">거래 건수</p>
          <p className="text-xl font-bold text-[#212529] tabular-nums">{totalPurchaseCount}<span className="text-sm font-semibold text-[#868E96] ml-0.5">건</span></p>
        </div>
      </div>

      {/* 통합 필터 바 */}
      <ProductFilterBar
        filter={filter}
        onChange={setFilter}
        search={search}
        onSearchChange={setSearch}
        onQuickOrderClick={() => {}}
        activeChips={activeChips}
        resultCount={filtered.length}
        hideSuppliers
      />

      {/* 결과 + 뷰 토글 + 정렬 */}
      <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4">
        <div className="flex items-center justify-between gap-2 sm:gap-3 mb-3">
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
            <SortDropdown value={sort} onChange={setSort} />
          </div>
        </div>

        {pageItems.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-[#868E96] mb-3">조건에 맞는 구매 제품이 없습니다.</p>
            <button onClick={() => setFilter(EMPTY_FILTER)} className="text-xs text-[#4E7FFF] font-semibold hover:underline cursor-pointer">필터 초기화</button>
          </div>
        ) : view === 'list' ? (
          <div className="border border-[#E9ECEF] rounded-lg overflow-hidden">
            <ListHeader />
            {pageItems.map((s) => (
              <PurchaseRow key={s.productId} summary={s} onClick={() => navigate(`/ledger/purchases/${s.productId}`)} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {pageItems.map((s) => (
              <PurchaseCard key={s.productId} summary={s} onClick={() => navigate(`/ledger/purchases/${s.productId}`)} />
            ))}
          </div>
        )}

        <ProductPagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </PageShell>
  );
}

const ROW_GRID = 'hidden lg:grid grid-cols-[40px_minmax(160px,2fr)_100px_80px_90px_120px_130px_100px_24px] items-center gap-x-4';

function ListHeader() {
  return (
    <div className={`${ROW_GRID} px-4 py-2.5 bg-[#F8F9FA] border-b border-[#E9ECEF] text-[11px] font-bold text-[#495057]`}>
      <span></span>
      <span>상품명</span>
      <span>약제코드</span>
      <span>카테고리</span>
      <span className="text-center">거래처</span>
      <span className="text-right">평균 단가</span>
      <span className="text-right">누적 매입액</span>
      <span className="text-center">최근 구매</span>
      <span></span>
    </div>
  );
}

function PurchaseRow({ summary, onClick }: { summary: ProductPurchaseSummary; onClick: () => void }) {
  const product = PRODUCTS.find((p) => p.id === summary.productId);
  return (
    <button
      onClick={onClick}
      className="w-full text-left border-b border-[#F1F3F5] last:border-0 hover:bg-[#FAFBFC] cursor-pointer transition-colors"
    >
      {/* 데스크톱 그리드 */}
      <div className={`${ROW_GRID} px-4 py-3`}>
        {product ? (
          <ProductImage form={product.form} category={product.category} name={product.name} code={product.code} image={product.image} size="sm" />
        ) : (
          <div className="w-10 h-10 rounded bg-[#F1F3F5]" />
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate text-[#212529]">{summary.productName}</p>
          <p className="text-[11px] truncate text-[#ADB5BD]">{product?.spec ?? ''}</p>
        </div>
        <p className="text-xs font-mono tabular-nums text-[#495057]">{summary.productCode}</p>
        <p className="text-xs truncate text-[#868E96]">{summary.productCategory}</p>
        <p className="text-xs tabular-nums text-[#495057] text-center">{summary.supplierCount}<span className="text-[#868E96] ml-0.5">곳</span></p>
        <div className="text-right">
          <p className="text-sm font-semibold tabular-nums text-[#495057]">₩{summary.avgUnitPrice.toLocaleString()}</p>
          {summary.minUnitPrice !== summary.maxUnitPrice && (
            <p className="text-[10px] text-[#ADB5BD] tabular-nums">₩{summary.minUnitPrice.toLocaleString()} ~ ₩{summary.maxUnitPrice.toLocaleString()}</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm font-bold tabular-nums text-[#212529]">₩{summary.totalAmount.toLocaleString()}</p>
          <p className="text-[10px] text-[#ADB5BD] tabular-nums">{summary.totalQty.toLocaleString()}개 · {summary.purchaseCount}회</p>
        </div>
        <p className="text-[11px] text-[#868E96] tabular-nums text-center">{summary.lastPurchaseDate}</p>
        <ChevronRight className="w-4 h-4 text-[#ADB5BD]" strokeWidth={2} />
      </div>

      {/* 모바일 카드형 */}
      <div className="lg:hidden px-4 py-3">
        <div className="flex gap-3">
          {product ? (
            <ProductImage form={product.form} category={product.category} name={product.name} code={product.code} image={product.image} size="sm" />
          ) : (
            <div className="w-10 h-10 rounded bg-[#F1F3F5] shrink-0" />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate text-[#212529]">{summary.productName}</p>
            <p className="text-[11px] text-[#868E96]">{summary.productCode} · {summary.productCategory}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-[11px] text-[#495057]">
              <span>거래처 <span className="font-semibold text-[#212529] tabular-nums">{summary.supplierCount}</span></span>
              <span>· 수량 <span className="font-semibold text-[#212529] tabular-nums">{summary.totalQty.toLocaleString()}</span></span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px] text-[#ADB5BD] tabular-nums">{summary.lastPurchaseDate}</span>
              <span className="text-sm font-bold tabular-nums text-[#212529]">₩{summary.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

function PurchaseCard({ summary, onClick }: { summary: ProductPurchaseSummary; onClick: () => void }) {
  const product = PRODUCTS.find((p) => p.id === summary.productId);
  return (
    <button
      onClick={onClick}
      className="text-left rounded-xl border border-[#E9ECEF] bg-white p-4 hover:border-[#4E7FFF] hover:shadow-sm transition-all cursor-pointer"
    >
      <div className="flex items-start gap-3 mb-3">
        {product ? (
          <ProductImage form={product.form} category={product.category} name={product.name} code={product.code} image={product.image} size="sm" />
        ) : (
          <div className="w-10 h-10 rounded bg-[#F1F3F5] shrink-0" />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold truncate text-[#212529]">{summary.productName}</p>
          <p className="text-[11px] text-[#868E96]">{summary.productCode}</p>
          <p className="text-[11px] text-[#ADB5BD]">{summary.productCategory}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div>
          <p className="text-[#868E96] mb-0.5">거래처</p>
          <p className="font-semibold text-[#212529] tabular-nums">{summary.supplierCount}곳</p>
        </div>
        <div>
          <p className="text-[#868E96] mb-0.5">누적 수량</p>
          <p className="font-semibold text-[#212529] tabular-nums">{summary.totalQty.toLocaleString()}개</p>
        </div>
        <div>
          <p className="text-[#868E96] mb-0.5">평균 단가</p>
          <p className="font-semibold text-[#212529] tabular-nums">₩{summary.avgUnitPrice.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[#868E96] mb-0.5">최근 구매</p>
          <p className="font-semibold text-[#212529] tabular-nums">{summary.lastPurchaseDate}</p>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-[#F1F3F5] flex items-baseline justify-between">
        <span className="text-[11px] text-[#868E96]">누적 매입액</span>
        <span className="text-base font-bold tabular-nums text-[#212529]">₩{summary.totalAmount.toLocaleString()}</span>
      </div>
    </button>
  );
}

function SortDropdown({ value, onChange }: { value: Sort; onChange: (v: Sort) => void }) {
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
        onClick={() => setOpen((o) => !o)}
        className="h-8 px-3 rounded-md border border-[#DEE2E6] bg-white text-xs font-semibold text-[#495057] hover:bg-[#F8F9FA] transition-colors flex items-center gap-1.5 cursor-pointer"
      >
        {value}
        <ChevronDown className="w-3 h-3" strokeWidth={2.5} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-40 bg-white border border-[#DEE2E6] rounded-md shadow-lg z-20 overflow-hidden">
          {SORTS.map((s) => (
            <button
              key={s}
              onClick={() => { onChange(s); setOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs cursor-pointer transition-colors ${value === s ? 'text-[#4E7FFF] font-semibold bg-[#F5F8FF]' : 'text-[#495057] hover:bg-[#F8F9FA]'}`}
            >
              <span>{s}</span>
              {value === s && <Check className="w-3.5 h-3.5 text-[#4E7FFF]" strokeWidth={3} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
