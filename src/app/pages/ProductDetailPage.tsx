import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Minus, Plus, ShoppingCart, Bell, BellRing, Bookmark, ChevronRight } from 'lucide-react';
import { CleanHeader } from '../components/CleanHeader';
import { CleanSidebar } from '../components/CleanSidebar';
import { PRODUCTS, STOCK_DOT, STOCK_LABEL_COLOR, type Product } from '../lib/products';
import { ProductImage } from '../components/products/ProductImage';
import { ToastProvider, useToast } from '../components/ui/Toast';

function ProductDetailInner() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024);

  const product = PRODUCTS.find((p) => p.id === Number(id));
  const [qty, setQty] = useState(product?.moq ?? 1);
  const [notified, setNotified] = useState(false);
  const [scrapped, setScrapped] = useState(false);

  useEffect(() => {
    if (product) setQty(product.moq);
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F5F6F8]">
        <CleanHeader onMenuClick={() => setSidebarOpen((v) => !v)} menuOpen={sidebarOpen} />
        <CleanSidebar collapsed={!sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className={`${sidebarOpen ? 'lg:ml-56' : 'lg:ml-0'} mt-14 p-4 sm:p-6 lg:p-8 transition-all duration-300`}>
          <div className="max-w-[1400px] mx-auto py-20 text-center">
            <p className="text-sm text-[#868E96] mb-4">상품을 찾을 수 없습니다.</p>
            <button onClick={() => navigate('/products')} className="text-sm text-[#4E7FFF] font-semibold hover:underline cursor-pointer">
              상품 목록으로 돌아가기
            </button>
          </div>
        </main>
      </div>
    );
  }

  const disabled = product.stock === '품절';
  const price = product.unitPrice * product.packSize;
  const totalPrice = price * qty;

  // 같은 카테고리 다른 상품 (최대 4개)
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const addToCart = () => {
    toast.show(`${product.name} ${qty}개 담기 완료`);
    setQty(product.moq);
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      <CleanHeader onMenuClick={() => setSidebarOpen((v) => !v)} menuOpen={sidebarOpen} />
      <CleanSidebar collapsed={!sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main className={`${sidebarOpen ? 'lg:ml-56' : 'lg:ml-0'} mt-14 p-4 sm:p-6 lg:p-8 transition-all duration-300`}>
        <div className="max-w-[1100px] mx-auto">

          {/* 브레드크럼 + 뒤로가기 */}
          <div className="mb-5">
            <p className="text-xs text-[#868E96] mb-2">
              <button onClick={() => navigate('/1')} className="hover:underline cursor-pointer">홈</button>
              <span className="mx-1.5">/</span>
              <button onClick={() => navigate('/products')} className="hover:underline cursor-pointer">전체 상품</button>
              <span className="mx-1.5">/</span>
              <span className="text-[#495057]">{product.name}</span>
            </p>
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-1 text-sm text-[#495057] hover:text-[#212529] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2} />
              목록으로
            </button>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">

            {/* 왼쪽: 상품 정보 */}
            <div className="space-y-5">

              {/* 상품 헤더 카드 */}
              <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
                <div className="flex gap-5 mb-4">
                  {/* 상품 이미지 */}
                  <div className="shrink-0">
                    <ProductImage form={product.form} category={product.category} name={product.name} image={product.image} size="lg" />
                  </div>

                  {/* 상품 정보 */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-[#F1F3F5] text-[11px] font-semibold text-[#495057]">{product.category}</span>
                        {product.newArrival && <span className="px-2 py-0.5 rounded bg-[#FFF3BF] text-[11px] font-bold text-[#E67700]">신규</span>}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <p className="text-xs font-mono text-[#ADB5BD] pt-0.5">{product.code}</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setScrapped((v) => !v);
                            toast.show(scrapped ? '스크랩이 해제되었습니다' : '스크랩에 저장되었습니다');
                          }}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            scrapped
                              ? 'bg-[#EDF2FF]'
                              : 'bg-[#F1F3F5] hover:bg-[#E9ECEF]'
                          }`}
                          aria-label={scrapped ? '스크랩 해제' : '스크랩'}
                        >
                          <Bookmark
                            className={`w-5 h-5 transition-colors ${scrapped ? 'text-[#4E7FFF] fill-[#4E7FFF]' : 'text-[#868E96]'}`}
                            strokeWidth={2}
                          />
                        </button>
                      </div>
                    </div>
                    <h1 className="text-xl font-bold text-[#212529] mb-1">{product.name}</h1>
                    <p className="text-sm text-[#868E96] mb-4">{product.supplier}</p>

                    <div className="grid grid-cols-2 gap-3">
                      <InfoCell label="제형" value={product.form} />
                      <InfoCell label="규격" value={product.spec} />
                      <InfoCell label="포장 단위" value={product.packLabel} />
                      <InfoCell label="최소 주문" value={`${product.moq}개`} />
                    </div>
                  </div>
                </div>
              </div>

              {/* 재고 상태 카드 */}
              <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
                <h3 className="text-sm font-bold text-[#212529] mb-4">재고 현황</h3>
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${STOCK_DOT[product.stock]}`} />
                  <span className={`text-base font-bold ${STOCK_LABEL_COLOR[product.stock]}`}>{product.stock}</span>
                  <span className="text-sm text-[#868E96]">· 현재 재고 {product.stockCount.toLocaleString()}개</span>
                </div>
                {product.stock === '품절 임박' && (
                  <p className="text-xs text-[#F76707] mt-2 bg-[#FFF4E6] rounded-lg px-3 py-2">
                    재고가 얼마 남지 않았습니다. 빠른 주문을 권장합니다.
                  </p>
                )}
                {disabled && (
                  <p className="text-xs text-[#FA5252] mt-2 bg-[#FFF5F5] rounded-lg px-3 py-2">
                    현재 품절 상태입니다. 재입고 알림을 신청하세요.
                  </p>
                )}
              </div>

              {/* 연관 상품 */}
              {related.length > 0 && (
                <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-[#212529]">같은 카테고리 상품</h3>
                    <button
                      onClick={() => navigate(`/products?q=&category=${encodeURIComponent(product.category)}`)}
                      className="text-xs text-[#868E96] hover:text-[#495057] cursor-pointer inline-flex items-center gap-0.5"
                    >
                      더보기 <ChevronRight className="w-3.5 h-3.5" strokeWidth={2} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {related.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => navigate(`/products/${r.id}`)}
                        className="flex items-center gap-3 p-3 rounded-lg border border-[#F1F3F5] hover:border-[#DEE2E6] text-left cursor-pointer transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-[#212529] truncate">{r.name}</p>
                          <p className="text-[11px] text-[#868E96]">{r.supplier}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-[#212529] tabular-nums">₩{(r.unitPrice * r.packSize).toLocaleString()}</p>
                          <div className="flex items-center gap-1 justify-end">
                            <span className={`w-1.5 h-1.5 rounded-full ${STOCK_DOT[r.stock]}`} />
                            <span className={`text-[10px] font-semibold ${STOCK_LABEL_COLOR[r.stock]}`}>{r.stock}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 오른쪽: 주문 패널 (sticky) */}
            <div className="lg:sticky lg:top-[72px] lg:self-start">
              <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">

                {/* 가격 */}
                <div className="mb-5">
                  <p className="text-xs text-[#868E96] mb-1">{product.packLabel} 기준</p>
                  <p className={`text-2xl font-bold tabular-nums ${disabled ? 'text-[#ADB5BD]' : 'text-[#212529]'}`}>
                    ₩{price.toLocaleString()}
                  </p>
                </div>

                <div className="border-t border-[#F1F3F5] pt-5">
                  {disabled ? (
                    /* 품절 — 재입고 알림 */
                    <button
                      onClick={() => {
                        setNotified((v) => !v);
                        toast.show(notified ? '재입고 알림이 취소되었습니다' : '재입고 시 알림을 보내드립니다');
                      }}
                      className={`w-full h-11 rounded-lg border text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                        notified
                          ? 'bg-[#4E7FFF] border-[#4E7FFF] text-white hover:bg-[#3D6FEF]'
                          : 'bg-white border-[#DEE2E6] text-[#495057] hover:border-[#4E7FFF] hover:text-[#4E7FFF]'
                      }`}
                    >
                      {notified ? <BellRing className="w-4 h-4" strokeWidth={2.5} /> : <Bell className="w-4 h-4" strokeWidth={2} />}
                      {notified ? '알림 신청됨' : '재입고 알림 신청'}
                    </button>
                  ) : (
                    <>
                      {/* 수량 선택 */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-semibold text-[#212529]">수량</span>
                        <div className="flex items-center border border-[#DEE2E6] rounded-lg h-10 bg-white">
                          <button
                            onClick={() => setQty(Math.max(product.moq, qty - 1))}
                            className="w-9 h-full flex items-center justify-center text-[#868E96] hover:text-[#212529] cursor-pointer"
                          >
                            <Minus className="w-4 h-4" strokeWidth={2} />
                          </button>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={qty}
                            onChange={(e) => setQty(Math.max(product.moq, Number(e.target.value.replace(/[^0-9]/g, '')) || product.moq))}
                            className="w-12 h-full text-center text-sm font-semibold text-[#212529] outline-none border-x border-[#DEE2E6] tabular-nums bg-transparent"
                          />
                          <button
                            onClick={() => setQty(qty + 1)}
                            className="w-9 h-full flex items-center justify-center text-[#868E96] hover:text-[#212529] cursor-pointer"
                          >
                            <Plus className="w-4 h-4" strokeWidth={2} />
                          </button>
                        </div>
                      </div>

                      {/* 합계 */}
                      <div className="flex items-center justify-between mb-5 py-3 px-4 bg-[#F8F9FA] rounded-lg">
                        <span className="text-sm text-[#495057]">합계</span>
                        <span className="text-lg font-bold text-[#212529] tabular-nums">₩{totalPrice.toLocaleString()}</span>
                      </div>

                      {/* 장바구니 담기 */}
                      <button
                        onClick={addToCart}
                        className="w-full h-11 rounded-lg bg-[#4E7FFF] hover:bg-[#3D6FEF] text-white text-sm font-semibold cursor-pointer transition-colors inline-flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" strokeWidth={2.5} />
                        장바구니 담기
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-[#ADB5BD] mb-1">{label}</p>
      <p className="text-sm font-semibold text-[#212529]">{value}</p>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <ToastProvider>
      <ProductDetailInner />
    </ToastProvider>
  );
}
