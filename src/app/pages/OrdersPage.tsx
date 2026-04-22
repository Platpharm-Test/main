import { useLocation, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { Check, ChevronDown, ChevronRight, Package } from 'lucide-react';
import { PageShell } from '../components/PageShell';
import { ProductImage } from '../components/products/ProductImage';
import { useOrders, type OrderStatus, type Order } from '../lib/orders';
import { PRODUCTS } from '../lib/products';

const FILTERS: (OrderStatus | '전체')[] = ['전체', '상품준비중', '배송준비', '배송중', '배송완료', '취소'];

function statusBadgeClass(s: OrderStatus) {
  switch (s) {
    case '상품준비중': return 'bg-[#FFF4E6] text-[#E67700]';
    case '배송준비': return 'bg-[#FFF9DB] text-[#B27700]';
    case '배송중': return 'bg-[#E7F5FF] text-[#1971C2]';
    case '배송완료': return 'bg-[#EDF2FF] text-[#4E7FFF]';
    case '취소': return 'bg-[#F1F3F5] text-[#868E96]';
  }
}

function statusTextColor(s: OrderStatus) {
  switch (s) {
    case '상품준비중': return '#E67700';
    case '배송준비': return '#F08C00';
    case '배송중': return '#1971C2';
    case '배송완료': return '#2F9E44';
    case '취소': return '#868E96';
  }
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${d.getFullYear()}. ${pad(d.getMonth() + 1)}. ${pad(d.getDate())}. (${days[d.getDay()]})`;
}

export default function OrdersPage() {
  const { orders } = useOrders();
  const location = useLocation();
  const navigate = useNavigate();
  const justPlaced = (location.state as { justPlaced?: string } | null)?.justPlaced;
  const [filter, setFilter] = useState<OrderStatus | '전체'>('전체');
  const [banner, setBanner] = useState(!!justPlaced);

  useEffect(() => {
    if (!justPlaced) return;
    const t = setTimeout(() => setBanner(false), 5000);
    return () => clearTimeout(t);
  }, [justPlaced]);

  const rows = filter === '전체' ? orders : orders.filter((o) => o.status === filter);
  const counts: Record<OrderStatus | '전체', number> = {
    '전체': orders.length,
    '상품준비중': orders.filter((o) => o.status === '상품준비중').length,
    '배송준비': orders.filter((o) => o.status === '배송준비').length,
    '배송중': orders.filter((o) => o.status === '배송중').length,
    '배송완료': orders.filter((o) => o.status === '배송완료').length,
    '취소': orders.filter((o) => o.status === '취소').length,
  };

  return (
    <PageShell title="주문 내역" description="진행 중인 주문과 과거 주문을 확인합니다.">
      {banner && justPlaced && (
        <div className="mb-4 rounded-lg border border-[#D0EBFF] bg-[#EDF8FF] px-4 py-3 text-sm text-[#1971C2] flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#4E7FFF] text-white shrink-0">
            <Check className="w-2.5 h-2.5" strokeWidth={3.5} />
          </span>
          <span>주문 <span className="font-semibold">{justPlaced}</span>이 접수되었습니다.</span>
        </div>
      )}

      <div
        className="flex items-center gap-1.5 mb-4 overflow-x-auto [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {FILTERS.map((f) => {
          const active = filter === f;
          const count = counts[f];
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`h-9 px-4 rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors flex items-center gap-1.5 ${active ? 'bg-[#212529] text-white' : 'bg-white border border-[#DEE2E6] text-[#495057] hover:border-[#212529]'}`}
            >
              <span>{f}</span>
              <span className={`tabular-nums ${active ? 'text-white/70' : 'text-[#ADB5BD]'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-[#DEE2E6] bg-white px-6 py-20 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#F1F3F5] text-[#868E96] mb-3">
            <Package className="w-6 h-6" strokeWidth={2} />
          </div>
          <p className="text-sm text-[#495057] font-semibold mb-1">주문 내역이 없습니다</p>
          <p className="text-xs text-[#868E96] mb-5">아직 주문한 내역이 없어요.</p>
          <button onClick={() => navigate('/products')} className="h-10 px-5 rounded-lg bg-[#4E7FFF] hover:bg-[#3D6FEF] text-white text-sm font-semibold cursor-pointer">상품 보러가기</button>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((o) => <OrderCard key={o.id} order={o} onOpen={() => navigate(`/orders/${o.id}`)} />)}
        </div>
      )}
    </PageShell>
  );
}

function OrderCard({ order, onOpen }: { order: Order; onOpen: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = order.lines.length > 1;
  const visible = expanded || !hasMore ? order.lines : order.lines.slice(0, 1);
  const extra = order.lines.length - 1;
  return (
    <article className="rounded-xl border border-[#E9ECEF] bg-white overflow-hidden hover:border-[#CED4DA] transition-colors">
      <header className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="text-base font-bold text-[#212529]">{order.status}</h3>
            {!order.paid && (
              <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FFE3E3] text-[#C92A2A]">미결제</span>
            )}
            <span className="w-px h-3 bg-[#DEE2E6]" />
            <p className="text-xs text-[#868E96] truncate">{formatDate(order.createdAt)}</p>
          </div>
          <button onClick={onOpen} className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#495057] hover:text-[#4E7FFF] cursor-pointer shrink-0">
            주문 상세 <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        </div>
      </header>

      <div className="px-5 pb-4">
        <ul className="space-y-2.5">
          {visible.map((l) => {
            const prod = PRODUCTS.find((p) => p.id === l.productId);
            const lineTotal = l.unitPrice * l.packSize * l.qty;
            return (
              <li key={l.productId} className="flex items-center gap-3">
                <button onClick={onOpen} aria-label={`${l.name} 주문 상세`} className="shrink-0 cursor-pointer">
                  {prod ? (
                    <ProductImage form={prod.form} category={prod.category} name={prod.name} code={prod.code} image={prod.image} size="sm" />
                  ) : (
                    <div className="w-10 h-10 rounded bg-[#F1F3F5]" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#212529] truncate">{l.name}</p>
                  <p className="text-[11px] text-[#868E96]">{l.supplier} · {l.qty}개</p>
                </div>
                <p className="text-sm font-semibold tabular-nums text-[#495057] shrink-0">₩{lineTotal.toLocaleString()}</p>
              </li>
            );
          })}
        </ul>
        {hasMore && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-3 w-full h-9 rounded-lg border border-[#DEE2E6] bg-white hover:border-[#ADB5BD] text-xs font-semibold text-[#495057] cursor-pointer inline-flex items-center justify-center gap-1 transition-colors"
          >
            {expanded ? '접기' : `${extra}개 상품 모두 보기`}
            <ChevronDown className={`w-3.5 h-3.5 text-[#868E96] transition-transform ${expanded ? 'rotate-180' : ''}`} strokeWidth={2.5} />
          </button>
        )}
      </div>

    </article>
  );
}
