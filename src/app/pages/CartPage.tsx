import { Minus, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { PageShell } from '../components/PageShell';
import { ProductImage } from '../components/products/ProductImage';
import { useCart } from '../lib/cart';
import { PRODUCTS } from '../lib/products';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, setCart } = useCart();

  const lines = Object.entries(cart)
    .map(([id, qty]) => {
      const p = PRODUCTS.find((x) => x.id === Number(id));
      return p ? { product: p, qty } : null;
    })
    .filter((x): x is { product: typeof PRODUCTS[number]; qty: number } => !!x);

  const subtotal = lines.reduce((s, l) => s + l.product.unitPrice * l.product.packSize * l.qty, 0);

  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) removeItem(id);
    else setCart({ ...cart, [id]: qty });
  };

  const removeItem = (id: number) => {
    const next = { ...cart };
    delete next[id];
    setCart(next);
  };

  return (
    <PageShell
      title="장바구니"
      description={lines.length > 0 ? `총 ${lines.length}종의 상품이 담겨 있습니다.` : '장바구니가 비어 있습니다.'}
    >
      {lines.length === 0 ? (
        <div className="rounded-lg border border-[#DEE2E6] bg-white px-6 py-16 text-center">
          <p className="text-sm text-[#868E96] mb-4">장바구니에 담긴 상품이 없습니다.</p>
          <button onClick={() => navigate('/products')} className="h-10 px-5 rounded-lg bg-[#4E7FFF] hover:bg-[#3D6FEF] text-white text-sm font-semibold cursor-pointer">상품 보러가기</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
          <div className="rounded-lg border border-[#DEE2E6] bg-white overflow-hidden">
            {lines.map(({ product, qty }) => {
              const lineTotal = product.unitPrice * product.packSize * qty;
              return (
                <div key={product.id} className="flex items-start gap-3 px-4 py-3 border-b border-[#F1F3F5] last:border-0">
                  <button onClick={() => navigate(`/products/${product.id}`)} aria-label={`${product.name} 상세로 이동`} className="shrink-0 cursor-pointer">
                    <ProductImage form={product.form} category={product.category} name={product.name} code={product.code} image={product.image} size="sm" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <button onClick={() => navigate(`/products/${product.id}`)} className="text-left cursor-pointer">
                          <p className="text-sm font-semibold text-[#212529] truncate">{product.name}</p>
                        </button>
                        <p className="text-[11px] text-[#868E96]">{product.supplier} · {product.code}</p>
                        <p className="text-[11px] text-[#ADB5BD]">{product.packLabel}</p>
                      </div>
                      <button onClick={() => removeItem(product.id)} aria-label="삭제" className="text-[#ADB5BD] hover:text-[#FA5252] cursor-pointer">
                        <Trash2 className="w-4 h-4" strokeWidth={2} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center border border-[#DEE2E6] rounded h-8 bg-white w-fit">
                        <button onClick={() => updateQty(product.id, qty - 1)} className="w-7 h-full flex items-center justify-center text-[#868E96] cursor-pointer"><Minus className="w-3 h-3" strokeWidth={2.5} /></button>
                        <input type="text" inputMode="numeric" value={qty} onChange={(e) => updateQty(product.id, Math.max(1, Number(e.target.value.replace(/[^0-9]/g, '')) || 1))} className="w-10 h-full text-center text-xs font-semibold text-[#212529] outline-none border-x border-[#DEE2E6] tabular-nums bg-transparent" />
                        <button onClick={() => updateQty(product.id, qty + 1)} className="w-7 h-full flex items-center justify-center text-[#868E96] cursor-pointer"><Plus className="w-3 h-3" strokeWidth={2.5} /></button>
                      </div>
                      <p className="text-sm font-bold tabular-nums text-[#212529]">₩{lineTotal.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <aside className="rounded-lg border border-[#DEE2E6] bg-white p-5 h-fit lg:sticky lg:top-20">
            <h2 className="text-sm font-bold text-[#212529] mb-3">주문 요약</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-[#868E96]">상품 합계</dt>
                <dd className="tabular-nums text-[#212529]">₩{subtotal.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#868E96]">부가세 (10%)</dt>
                <dd className="tabular-nums text-[#212529]">₩{Math.round(subtotal * 0.1).toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#868E96]">배송비</dt>
                <dd className="tabular-nums text-[#495057]">무료</dd>
              </div>
            </dl>
            <div className="border-t border-[#F1F3F5] my-3" />
            <div className="flex items-baseline justify-between mb-4">
              <span className="text-sm font-semibold text-[#212529]">결제 예정 금액</span>
              <span className="text-lg font-bold tabular-nums text-[#4E7FFF]">₩{Math.round(subtotal * 1.1).toLocaleString()}</span>
            </div>
            <button onClick={() => navigate('/checkout')} className="w-full h-11 rounded-lg bg-[#4E7FFF] hover:bg-[#3D6FEF] text-white text-sm font-semibold cursor-pointer">결제하기</button>
            <button onClick={() => navigate('/products')} className="w-full h-10 mt-2 rounded-lg border border-[#DEE2E6] hover:border-[#4E7FFF] text-[#495057] hover:text-[#4E7FFF] text-sm font-semibold cursor-pointer transition-colors">계속 쇼핑</button>
          </aside>
        </div>
      )}
    </PageShell>
  );
}
