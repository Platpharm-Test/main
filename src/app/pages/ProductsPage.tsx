import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ShoppingCart, FileText } from 'lucide-react';
import { CleanHeader } from '../components/CleanHeader';
import { CleanSidebar } from '../components/CleanSidebar';
import { ProductFilterBar, EMPTY_FILTER, type FilterState } from '../components/products/ProductFilterBar';
import { ProductResultHeader, type Sort, type ViewMode } from '../components/products/ProductResultHeader';
import { ProductRow, ProductRowHeader } from '../components/products/ProductRow';
import { ProductCardCompact } from '../components/products/ProductCardCompact';
import { ProductPagination } from '../components/products/ProductPagination';
import { QuickOrderModal } from '../components/products/QuickOrderModal';
import { CompareTray } from '../components/products/CompareTray';
import { ProductDetailDrawer } from '../components/products/ProductDetailDrawer';
import { ToastProvider, useToast } from '../components/ui/Toast';
import { PRODUCTS, type Product } from '../lib/products';
import { matchSearch } from '../lib/choseong';

const PAGE_SIZE = 12;

function ProductsPageInner() {
  const navigate = useNavigate();
  const toast = useToast();
  const [params, setParams] = useSearchParams();

  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024);
  const [filter, setFilter] = useState<FilterState>(EMPTY_FILTER);
  const [search, setSearch] = useState(params.get('q') || '');
  const [sort, setSort] = useState<Sort>((params.get('sort') as Sort) || '인기순');
  const [view, setView] = useState<ViewMode>((params.get('view') as ViewMode) || 'list');
  const [page, setPage] = useState(Number(params.get('page')) || 1);
  const [quickOpen, setQuickOpen] = useState(false);
  const [compare, setCompare] = useState<Product[]>([]);
  const [detail, setDetail] = useState<Product | null>(null);
  const [cart, setCart] = useState<Record<string, number>>({});

  // URL 동기화
  useEffect(() => {
    const next = new URLSearchParams();
    if (search) next.set('q', search);
    if (sort !== '인기순') next.set('sort', sort);
    if (view !== 'list') next.set('view', view);
    if (page !== 1) next.set('page', String(page));
    setParams(next, { replace: true });
  }, [search, sort, view, page, setParams]);

  const filtered = useMemo(() => {
    const list = PRODUCTS.filter((p) => {
      if (search) {
        const hit = [p.name, p.code, p.supplier, p.category].some((v) => matchSearch(v, search));
        if (!hit) return false;
      }
      if (filter.categories.length && !filter.categories.includes(p.category)) return false;
      if (filter.suppliers.length && !filter.suppliers.includes(p.supplier)) return false;
      if (p.unitPrice < filter.priceMin || p.unitPrice > filter.priceMax) return false;
      if (filter.excludeSoldOut && p.stock === '품절') return false;
      return true;
    });
    const sorted = [...list];
    switch (sort) {
      case '가격 낮은순': sorted.sort((a, b) => a.unitPrice - b.unitPrice); break;
      case '가격 높은순': sorted.sort((a, b) => b.unitPrice - a.unitPrice); break;
      case '약품명': sorted.sort((a, b) => a.name.localeCompare(b.name, 'ko')); break;
      case '최근 입고': sorted.sort((a, b) => Number(!!b.newArrival) - Number(!!a.newArrival)); break;
    }
    return sorted;
  }, [search, sort, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search, sort, filter]);

  const addToCart = (product: Product, qty: number) => {
    setCart((prev) => ({ ...prev, [product.id]: (prev[product.id] || 0) + qty }));
    toast.show(`${product.name} ${qty}개 담기 완료`);
  };

  const cartKindCount = Object.keys(cart).length;

  const toggleCompare = (product: Product) => {
    setCompare((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev.filter((p) => p.id !== product.id);
      if (prev.length >= 3) {
        toast.show('비교는 최대 3개까지 가능합니다');
        return prev;
      }
      return [...prev, product];
    });
  };

  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = [];
    filter.categories.forEach((c) => chips.push({ key: `cat-${c}`, label: c, onRemove: () => setFilter({ ...filter, categories: filter.categories.filter((v) => v !== c) }) }));
    filter.suppliers.forEach((s) => chips.push({ key: `sup-${s}`, label: s, onRemove: () => setFilter({ ...filter, suppliers: filter.suppliers.filter((v) => v !== s) }) }));
    return chips;
  }, [filter]);

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      <CleanHeader onMenuClick={() => setSidebarOpen((v) => !v)} menuOpen={sidebarOpen} cartCount={cartKindCount} />
      <CleanSidebar collapsed={!sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main className={`${sidebarOpen ? 'lg:ml-56' : 'lg:ml-0'} mt-14 p-4 sm:p-6 lg:p-8 transition-all duration-300`}>
        <div className="max-w-[1400px] mx-auto">
          {/* 페이지 헤더 */}
          <div className="mb-4">
            <p className="text-xs text-[#868E96] mb-1">
              <button onClick={() => navigate('/1')} className="hover:underline cursor-pointer">의약품 구매</button>
              <span className="mx-1.5">/</span>
              <span>전체 상품</span>
            </p>
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#212529]">전체 상품</h2>
                <p className="text-xs text-[#868E96] mt-1">등록된 {PRODUCTS.length}개 의약품 · 10개 제약사</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="h-9 px-3 rounded-lg border border-[#DEE2E6] bg-white text-xs font-semibold text-[#495057] hover:border-[#CED4DA] inline-flex items-center gap-1.5 cursor-pointer">
                  <FileText className="w-3.5 h-3.5" strokeWidth={2.5} />
                  발주서 작성
                </button>
                <button className="h-9 px-3 rounded-lg border border-[#DEE2E6] bg-white text-xs font-semibold text-[#495057] hover:border-[#CED4DA] inline-flex items-center gap-1.5 cursor-pointer">
                  <ShoppingCart className="w-3.5 h-3.5" strokeWidth={2.5} />
                  장바구니
                  {cartKindCount > 0 && <span className="px-1.5 py-0.5 bg-[#4E7FFF] text-white text-[10px] font-bold rounded-full">{cartKindCount}</span>}
                </button>
              </div>
            </div>
          </div>

          {/* 검색 포함 통합 필터 */}
          <ProductFilterBar
            filter={filter}
            onChange={setFilter}
            search={search}
            onSearchChange={setSearch}
            onQuickOrderClick={() => setQuickOpen(true)}
            activeChips={activeChips}
          />

          {/* 결과 */}
          <div>
            <div className="min-w-0">
              <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4">
                <ProductResultHeader
                  count={filtered.length}
                  view={view}
                  onViewChange={setView}
                  sort={sort}
                  onSortChange={setSort}
                  activeChips={[]}
                  onResetAll={() => setFilter(EMPTY_FILTER)}
                />

                {pageItems.length === 0 ? (
                  <div className="py-16 text-center">
                    <p className="text-sm text-[#868E96] mb-3">조건에 맞는 상품이 없습니다.</p>
                    <button onClick={() => setFilter(EMPTY_FILTER)} className="text-xs text-[#4E7FFF] font-semibold hover:underline cursor-pointer">필터 초기화</button>
                  </div>
                ) : view === 'list' ? (
                  <div className="border border-[#E9ECEF] rounded-lg overflow-hidden">
                    <ProductRowHeader />
                    {pageItems.map((p) => (
                      <ProductRow
                        key={p.id}
                        product={p}
                        cartQty={cart[p.id] || 0}
                        onAddToCart={(q) => addToCart(p, q)}
                        onClick={() => setDetail(p)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {pageItems.map((p) => (
                      <ProductCardCompact
                        key={p.id}
                        product={p}
                        cartQty={cart[p.id] || 0}
                        onAddToCart={(q) => addToCart(p, q)}
                        onClick={() => setDetail(p)}
                      />
                    ))}
                  </div>
                )}

                <ProductPagination page={page} totalPages={totalPages} onChange={setPage} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <CompareTray
        items={compare}
        onRemove={(id) => setCompare((prev) => prev.filter((p) => p.id !== id))}
        onClear={() => setCompare([])}
        onCompare={() => toast.show(`${compare.length}개 상품 비교`)}
      />

      <ProductDetailDrawer
        product={detail}
        onClose={() => setDetail(null)}
        onAddToCart={(q) => { if (detail) { addToCart(detail, q); setDetail(null); } }}
        onToggleCompare={() => { if (detail) toggleCompare(detail); }}
        inCompare={!!detail && compare.some((p) => p.id === detail.id)}
      />

      <QuickOrderModal
        open={quickOpen}
        onClose={() => setQuickOpen(false)}
        onAdd={(lines) => {
          const matched = lines.filter((l) => l.ok);
          const fail = lines.length - matched.length;
          matched.forEach((l) => {
            const product = PRODUCTS.find((p) => p.code.toUpperCase() === l.code.toUpperCase());
            if (product) {
              setCart((prev) => ({ ...prev, [product.id]: (prev[product.id] || 0) + l.qty }));
            }
          });
          toast.show(fail === 0 ? `${matched.length}건 일괄 담기 완료` : `${matched.length}건 담기 / ${fail}건 코드 미일치`);
        }}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <ToastProvider>
      <ProductsPageInner />
    </ToastProvider>
  );
}
