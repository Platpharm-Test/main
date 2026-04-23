import { useNavigate, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { PageShell } from '../components/PageShell';
import { useOrders } from '../lib/orders';
import { ProductImage } from '../components/products/ProductImage';
import { PRODUCTS } from '../lib/products';

export default function OrderDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { orders, markPaid, cancelOrder } = useOrders();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <PageShell title="주문을 찾을 수 없습니다.">
        <button onClick={() => navigate('/orders')} className="text-sm text-[#4E7FFF] hover:underline cursor-pointer">← 주문 내역으로</button>
      </PageShell>
    );
  }

  const subtotal = Math.round(order.total / 1.1);
  const vat = order.total - subtotal;
  const createdAt = new Date(order.createdAt).toLocaleString('ko-KR', { dateStyle: 'long', timeStyle: 'short' });

  const statusColor =
    order.status === '상품준비중' ? 'bg-[#FFF4E6] text-[#E67700]'
    : order.status === '배송준비' ? 'bg-[#FFF9DB] text-[#B27700]'
    : order.status === '배송중' ? 'bg-[#E7F5FF] text-[#1971C2]'
    : order.status === '배송완료' ? 'bg-[#EDF2FF] text-[#4E7FFF]'
    : 'bg-[#F1F3F5] text-[#868E96]';

  return (
    <PageShell
      title="주문 상세"
      description={`주문번호 ${order.id} · ${createdAt}`}
      actions={(
        <button onClick={() => navigate('/orders')} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#DEE2E6] text-xs font-semibold text-[#495057] hover:border-[#4E7FFF] hover:text-[#4E7FFF] cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.5} /> 목록으로
        </button>
      )}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
        <div className="space-y-4">
          <section className="rounded-lg border border-[#DEE2E6] bg-white p-5">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`text-[11px] font-semibold px-2 py-1 rounded ${statusColor}`}>{order.status}</span>
              <span className={`text-[11px] font-semibold px-2 py-1 rounded ${order.paid ? 'bg-[#EDF2FF] text-[#4E7FFF]' : 'bg-[#FFE3E3] text-[#C92A2A]'}`}>{order.paid ? '결제완료' : '미결제'}</span>
              <span className="text-[11px] text-[#868E96]">상품 {order.lines.length}종 · 총 {order.lines.reduce((s, l) => s + l.qty, 0)}개</span>
            </div>
            <h2 className="text-sm font-bold text-[#212529] mb-3">주문 상품</h2>
            <ul className="divide-y divide-[#F1F3F5]">
              {order.lines.map((l) => {
                const prod = PRODUCTS.find((p) => p.id === l.productId);
                const lineTotal = l.unitPrice * l.packSize * l.qty;
                return (
                  <li key={l.productId} className="py-3 flex items-start gap-3">
                    <button onClick={() => navigate(`/products/${l.productId}`)} aria-label={`${l.name} 상세로 이동`} className="shrink-0 cursor-pointer">
                      {prod ? (
                        <ProductImage form={prod.form} category={prod.category} name={prod.name} code={prod.code} image={prod.image} size="sm" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-[#F1F3F5]" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <button onClick={() => navigate(`/products/${l.productId}`)} className="text-left cursor-pointer">
                        <p className="text-sm font-semibold text-[#212529] truncate">{l.name}</p>
                      </button>
                      <p className="text-[11px] text-[#868E96]">{l.supplier} · {l.code}</p>
                      <p className="text-[11px] text-[#ADB5BD]">단가 ₩{(l.unitPrice * l.packSize).toLocaleString()} × {l.qty}개</p>
                    </div>
                    <p className="text-sm font-bold tabular-nums text-[#212529] shrink-0">₩{lineTotal.toLocaleString()}</p>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="rounded-lg border border-[#DEE2E6] bg-white p-5">
            <h2 className="text-sm font-bold text-[#212529] mb-3">배송 / 결제 정보</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-[11px] text-[#868E96] mb-0.5">결제수단</dt>
                <dd className="text-[#212529]">{order.paymentMethod}</dd>
              </div>
              <div>
                <dt className="text-[11px] text-[#868E96] mb-0.5">주문 상태</dt>
                <dd className="text-[#212529]">{order.status}</dd>
              </div>
              <div>
                <dt className="text-[11px] text-[#868E96] mb-0.5">주문일시</dt>
                <dd className="text-[#212529] tabular-nums">{createdAt}</dd>
              </div>
              <div>
                <dt className="text-[11px] text-[#868E96] mb-0.5">배송지</dt>
                <dd className="text-[#212529]">서울연세약국 (등록 주소)</dd>
              </div>
            </dl>
          </section>
        </div>

        <aside className="rounded-lg border border-[#DEE2E6] bg-white p-5 h-fit lg:sticky lg:top-20">
          <h2 className="text-sm font-bold text-[#212529] mb-3">결제 요약</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-[#868E96]">상품 합계</dt><dd className="tabular-nums text-[#212529]">₩{subtotal.toLocaleString()}</dd></div>
            <div className="flex justify-between"><dt className="text-[#868E96]">부가세 (10%)</dt><dd className="tabular-nums text-[#212529]">₩{vat.toLocaleString()}</dd></div>
            <div className="flex justify-between"><dt className="text-[#868E96]">배송비</dt><dd className="tabular-nums text-[#495057]">무료</dd></div>
          </dl>
          <div className="border-t border-[#F1F3F5] my-3" />
          <div className="flex items-baseline justify-between mb-4">
            <span className="text-sm font-semibold text-[#212529]">총 결제 금액</span>
            <span className="text-lg font-bold tabular-nums text-[#4E7FFF]">₩{order.total.toLocaleString()}</span>
          </div>
          {!order.paid && order.status !== '주문취소' && (
            <button onClick={() => markPaid(order.id)} className="w-full h-11 rounded-lg bg-[#4E7FFF] hover:bg-[#3D6FEF] text-white text-sm font-semibold cursor-pointer">결제 완료 처리</button>
          )}
          {order.status === '주문취소' ? (
            <button disabled className="w-full h-10 mt-2 rounded-lg border border-[#DEE2E6] bg-[#F8F9FA] text-[#ADB5BD] text-sm font-semibold cursor-not-allowed">취소된 주문입니다</button>
          ) : order.status === '상품준비중' || !order.paid ? (
            <button
              onClick={() => cancelOrder(order.id)}
              className="w-full h-10 mt-2 rounded-lg border border-[#DEE2E6] hover:border-[#4E7FFF] text-[#495057] hover:text-[#4E7FFF] text-sm font-semibold cursor-pointer transition-colors"
            >
              주문 취소
            </button>
          ) : (
            <button onClick={() => navigate('/returns')} className="w-full h-10 mt-2 rounded-lg border border-[#DEE2E6] hover:border-[#4E7FFF] text-[#495057] hover:text-[#4E7FFF] text-sm font-semibold cursor-pointer transition-colors">반품 신청</button>
          )}
        </aside>
      </div>
    </PageShell>
  );
}
