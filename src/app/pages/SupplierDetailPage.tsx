import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, BarChart3, Building2, ChevronRight, Clock, Handshake } from 'lucide-react';
import { CleanHeader } from '../components/CleanHeader';
import { CleanSidebar } from '../components/CleanSidebar';
import { ProductFilterBar, EMPTY_FILTER, type FilterState } from '../components/products/ProductFilterBar';
import { ProductResultHeader, type Sort, type ViewMode } from '../components/products/ProductResultHeader';
import { ProductRow, ProductRowHeader } from '../components/products/ProductRow';
import { ProductCardCompact } from '../components/products/ProductCardCompact';
import { ProductPagination } from '../components/products/ProductPagination';
import { QuickOrderModal } from '../components/products/QuickOrderModal';
import { ToastProvider, useToast } from '../components/ui/Toast';
import { PRODUCTS, type Product } from '../lib/products';
import { matchSearch } from '../lib/choseong';
import { useCart } from '../lib/cart';
import { getSupplier, type SupplierTradeStatus } from '../lib/partners';
import { usePartners } from '../lib/partnersContext';

const PAGE_SIZE = 12;
const isDesktop = () => typeof window !== 'undefined' && window.innerWidth >= 1024;

function statusBadge(s: SupplierTradeStatus) {
  switch (s) {
    case '거래중': return 'bg-[#EDF2FF] text-[#4E7FFF]';
    case '신청중': return 'bg-[#FFF4E6] text-[#E67700]';
    case '반려': return 'bg-[#FFE3E3] text-[#C92A2A]';
    case '미신청': return 'bg-[#F1F3F5] text-[#868E96]';
  }
}

export default function SupplierDetailPage() {
  return (
    <ToastProvider>
      <Inner />
    </ToastProvider>
  );
}

function Inner() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const supplier = getSupplier(id);
  const { getTradeStatus, requests } = usePartners();
  const toast = useToast();
  const { cart, addToCart: addToCartStore, cartKindCount } = useCart();

  const tradeStatus = supplier ? getTradeStatus(supplier.id) : '미신청';
  const latestRequest = supplier ? requests.find((r) => r.supplierId === supplier.id) : undefined;

  const [sidebarOpen, setSidebarOpen] = useState(isDesktop);
  useEffect(() => {
    const handler = () => { if (!isDesktop()) setSidebarOpen(false); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const [filter, setFilter] = useState<FilterState>(EMPTY_FILTER);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<Sort>('인기순');
  const [view, setView] = useState<ViewMode>('list');
  const [page, setPage] = useState(1);
  const [quickOpen, setQuickOpen] = useState(false);

  const supplierProducts = useMemo(
    () => supplier ? PRODUCTS.filter((p) => p.supplier === supplier.name) : [],
    [supplier],
  );

  const filtered = useMemo(() => {
    const list = supplierProducts.filter((p) => {
      if (search) {
        const hit = [p.name, p.code, p.category].some((v) => matchSearch(v, search));
        if (!hit) return false;
      }
      if (filter.categories.length && !filter.categories.includes(p.category)) return false;
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
  }, [supplierProducts, search, sort, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search, sort, filter, supplier?.id]);

  if (!supplier) {
    return (
      <div className="min-h-screen bg-[#F5F6F8]">
        <CleanHeader onMenuClick={() => setSidebarOpen((v) => !v)} menuOpen={sidebarOpen} cartCount={cartKindCount} />
        <CleanSidebar collapsed={!sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className={`${sidebarOpen ? 'lg:ml-56' : 'lg:ml-0'} mt-14 p-8 transition-all duration-300`}>
          <p className="text-sm text-[#868E96]">제약사를 찾을 수 없습니다.</p>
          <button onClick={() => navigate('/partners')} className="mt-3 text-sm text-[#4E7FFF] hover:underline cursor-pointer">← 제약사 목록으로</button>
        </main>
      </div>
    );
  }

  const addToCart = (product: Product, qty: number) => {
    addToCartStore(product.id, qty);
    toast.show(`${product.name} ${qty}개 담기 완료`);
  };

  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = [];
    filter.categories.forEach((c) => chips.push({ key: `cat-${c}`, label: c, onRemove: () => setFilter({ ...filter, categories: filter.categories.filter((v) => v !== c) }) }));
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
            <div className="hidden lg:block mb-3">
              <p className="text-xs text-[#868E96]">
                <button onClick={() => navigate('/partners')} className="hover:underline cursor-pointer">거래처 관리</button>
                <span className="mx-1.5">/</span>
                <button onClick={() => navigate('/partners')} className="hover:underline cursor-pointer">제약사 목록</button>
                <span className="mx-1.5">/</span>
                <span>{supplier.name}</span>
              </p>
            </div>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base lg:text-xl font-bold text-[#212529]">{supplier.name} 브랜드관</h2>
              <button onClick={() => navigate('/partners')} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#DEE2E6] bg-white text-xs font-semibold text-[#495057] hover:border-[#4E7FFF] hover:text-[#4E7FFF] cursor-pointer">
                <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.5} /> 목록으로
              </button>
            </div>
          </div>

          {/* 브랜드 히어로 */}
          <section className="rounded-xl border border-[#E9ECEF] bg-gradient-to-br from-[#F8F9FC] to-white p-5 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white border border-[#E9ECEF] flex items-center justify-center shrink-0">
                <Building2 className="w-7 h-7 text-[#4E7FFF]" strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-[#212529]">{supplier.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${statusBadge(tradeStatus)}`}>{tradeStatus}</span>
                  <span className="text-[11px] text-[#868E96]">설립 {supplier.establishedYear} · 상품 {supplierProducts.length}종</span>
                </div>
                <p className="text-xs text-[#495057] line-clamp-2">{supplier.description}</p>
              </div>
              <div className="shrink-0">
                {tradeStatus === '미신청' || tradeStatus === '반려' ? (
                  <button
                    onClick={() => navigate(`/partners/${supplier.id}/apply`)}
                    className="group inline-flex items-center gap-2 h-11 pl-4 pr-3 rounded-xl bg-[#4E7FFF] hover:bg-[#3D6FEF] text-white text-sm font-semibold cursor-pointer transition-colors whitespace-nowrap"
                  >
                    <Handshake className="w-4 h-4" strokeWidth={2.5} />
                    <span>거래 신청하기</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
                  </button>
                ) : tradeStatus === '신청중' ? (
                  <div className="inline-flex items-center gap-2.5 h-11 px-4 rounded-xl bg-[#FFF8F0] border border-[#FFE8CC] whitespace-nowrap">
                    <Clock className="w-4 h-4 text-[#E67700]" strokeWidth={2.5} />
                    <div className="flex flex-col leading-tight">
                      <span className="text-xs font-bold text-[#E67700]">검토 중</span>
                      <span className="text-[10px] text-[#864C00] tabular-nums">{latestRequest?.requestedAt} 신청</span>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => navigate(`/partners/approved/${supplier.id}`)}
                    className="group inline-flex items-center gap-2 h-11 pl-4 pr-3 rounded-xl bg-white border border-[#DEE2E6] hover:border-[#4E7FFF] text-sm font-semibold text-[#495057] hover:text-[#4E7FFF] cursor-pointer transition-all whitespace-nowrap"
                  >
                    <BarChart3 className="w-4 h-4" strokeWidth={2.5} />
                    <span>거래 현황</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* 통합 필터 (제약사 필터 숨김) */}
          <ProductFilterBar
            filter={filter}
            onChange={setFilter}
            search={search}
            onSearchChange={setSearch}
            onQuickOrderClick={() => setQuickOpen(true)}
            activeChips={activeChips}
            resultCount={filtered.length}
            hideSuppliers
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
                        onClick={() => navigate(`/products/${p.id}`)}
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
                        onClick={() => navigate(`/products/${p.id}`)}
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

      <QuickOrderModal
        open={quickOpen}
        onClose={() => setQuickOpen(false)}
        onAdd={(lines) => {
          const matched = lines.filter((l) => l.ok);
          const fail = lines.length - matched.length;
          matched.forEach((l) => {
            const product = supplierProducts.find((p) => p.code.toUpperCase() === l.code.toUpperCase());
            if (product) addToCartStore(product.id, l.qty);
          });
          toast.show(fail === 0 ? `${matched.length}건 일괄 담기 완료` : `${matched.length}건 담기 / ${fail}건 코드 미일치 또는 해당 제약사 상품 아님`);
        }}
      />
    </div>
  );
}
