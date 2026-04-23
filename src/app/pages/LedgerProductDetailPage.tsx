import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { PageShell } from '../components/PageShell';
import { ProductImage } from '../components/products/ProductImage';
import { StatCard } from '../components/StatCard';
import { getProductPurchases } from '../lib/ledger';
import { PRODUCTS } from '../lib/products';

export default function LedgerProductDetailPage() {
  const navigate = useNavigate();
  const { productId = '' } = useParams();
  const id = Number(productId);
  const product = PRODUCTS.find((p) => p.id === id);

  const records = useMemo(() => getProductPurchases(id), [id]);

  if (!product || records.length === 0) {
    return (
      <PageShell title="구매 내역을 찾을 수 없습니다.">
        <button onClick={() => navigate('/ledger/purchases')} className="text-sm text-[#4E7FFF] hover:underline cursor-pointer">← 구매 장부로</button>
      </PageShell>
    );
  }

  const totalQty = records.reduce((s, r) => s + r.qty, 0);
  const totalAmount = records.reduce((s, r) => s + r.amount, 0);
  const suppliers = Array.from(new Set(records.map((r) => r.supplier)));
  const avgUnitPrice = Math.round(totalAmount / totalQty);
  const unpaidAmount = records.filter((r) => r.payStatus === '미결제').reduce((s, r) => s + r.amount, 0);

  // 거래처별 집계
  const bySupplier = suppliers.map((sup) => {
    const arr = records.filter((r) => r.supplier === sup);
    const qty = arr.reduce((s, r) => s + r.qty, 0);
    const amount = arr.reduce((s, r) => s + r.amount, 0);
    const avg = Math.round(amount / qty);
    const last = arr.map((r) => r.date).sort().reverse()[0];
    return { supplier: sup, qty, amount, avg, count: arr.length, last };
  }).sort((a, b) => b.amount - a.amount);

  return (
    <PageShell
      title="제품별 구매 내역"
      description="선택한 제품의 거래처별 구매 이력을 확인합니다."
      actions={(
        <button onClick={() => navigate('/ledger/purchases')} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#DEE2E6] bg-white text-xs font-semibold text-[#495057] hover:border-[#4E7FFF] hover:text-[#4E7FFF] cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.5} /> 목록으로
        </button>
      )}
    >
      {/* 제품 정보 */}
      <section className="rounded-2xl border border-[#E9ECEF] bg-white p-5 mb-4 flex items-start gap-4">
        <ProductImage form={product.form} category={product.category} name={product.name} code={product.code} image={product.image} size="sm" />
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-[#212529] mb-1">{product.name}</h2>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-[#868E96]">
            <span className="tabular-nums">{product.code}</span>
            <span>·</span>
            <span>{product.category}</span>
            <span>·</span>
            <span>{product.spec}</span>
            <span>·</span>
            <span>{product.packLabel}</span>
          </div>
        </div>
        <button
          onClick={() => navigate(`/products/${product.id}`)}
          className="inline-flex items-center gap-1 h-9 px-3 rounded-lg border border-[#DEE2E6] text-xs font-semibold text-[#495057] hover:border-[#4E7FFF] hover:text-[#4E7FFF] cursor-pointer whitespace-nowrap shrink-0 transition-colors"
        >
          상품 보기 <ExternalLink className="w-3.5 h-3.5" strokeWidth={2.5} />
        </button>
      </section>

      {/* 요약 통계 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <StatCard label="누적 매입액" value={`₩${totalAmount.toLocaleString()}`} highlight />
        <StatCard label="총 구매 수량" value={`${totalQty.toLocaleString()}개`} sublabel={`${records.length}회 거래`} />
        <StatCard label="평균 단가" value={`₩${avgUnitPrice.toLocaleString()}`} description={bySupplier.length > 1 ? `최저 ₩${Math.min(...records.map((r) => r.unitPrice)).toLocaleString()} · 최고 ₩${Math.max(...records.map((r) => r.unitPrice)).toLocaleString()}` : undefined} />
        <StatCard label="거래처" value={`${suppliers.length}곳`} description={unpaidAmount > 0 ? `미결제 ₩${unpaidAmount.toLocaleString()}` : '결제 모두 완료'} />
      </div>

      {/* 거래처별 요약 */}
      <section className="rounded-xl border border-[#E9ECEF] bg-white overflow-hidden mb-4">
        <div className="px-5 py-3 border-b border-[#F1F3F5]">
          <h3 className="text-sm font-bold text-[#212529]">거래처별 요약</h3>
        </div>
        <div className="hidden lg:grid grid-cols-[1fr_100px_140px_120px_140px_120px] items-center gap-x-4 px-5 py-2.5 bg-[#F8F9FA] border-b border-[#E9ECEF] text-[11px] font-bold text-[#495057]">
          <span>거래처</span>
          <span className="text-center">거래 횟수</span>
          <span className="text-center">누적 수량</span>
          <span className="text-right">평균 단가</span>
          <span className="text-right">누적 금액</span>
          <span className="text-center">최근 구매</span>
        </div>
        {bySupplier.map((s) => (
          <div key={s.supplier} className="lg:grid lg:grid-cols-[1fr_100px_140px_120px_140px_120px] lg:items-center lg:gap-x-4 px-5 py-3 border-b border-[#F1F3F5] last:border-0">
            <p className="text-sm font-semibold text-[#212529]">{s.supplier}</p>
            <p className="text-xs text-[#495057] tabular-nums lg:text-center mt-0.5 lg:mt-0">{s.count}회</p>
            <p className="text-xs text-[#495057] tabular-nums lg:text-center">{s.qty.toLocaleString()}개</p>
            <p className="text-xs tabular-nums text-[#495057] lg:text-right">₩{s.avg.toLocaleString()}</p>
            <p className="text-sm font-bold tabular-nums text-[#212529] lg:text-right">₩{s.amount.toLocaleString()}</p>
            <p className="text-[11px] text-[#868E96] tabular-nums lg:text-center">{s.last}</p>
          </div>
        ))}
      </section>

      {/* 전체 거래 내역 */}
      <section className="rounded-xl border border-[#E9ECEF] bg-white overflow-hidden">
        <div className="px-5 py-3 border-b border-[#F1F3F5]">
          <h3 className="text-sm font-bold text-[#212529]">전체 거래 내역 <span className="text-[#868E96] font-semibold ml-1">{records.length}건</span></h3>
        </div>
        <div className="hidden lg:grid grid-cols-[120px_1fr_180px_100px_140px_140px_100px] items-center gap-x-4 px-5 py-2.5 bg-[#F8F9FA] border-b border-[#E9ECEF] text-[11px] font-bold text-[#495057]">
          <span>거래일</span>
          <span>거래처</span>
          <span>주문번호</span>
          <span className="text-center">수량</span>
          <span className="text-right">단가</span>
          <span className="text-right">금액</span>
          <span className="text-center">결제</span>
        </div>
        {records.map((r) => (
          <div key={r.id} className="lg:grid lg:grid-cols-[120px_1fr_180px_100px_140px_140px_100px] lg:items-center lg:gap-x-4 px-5 py-3 border-b border-[#F1F3F5] last:border-0">
            <p className="text-xs text-[#495057] tabular-nums">{r.date}</p>
            <p className="text-sm font-semibold text-[#212529] mt-0.5 lg:mt-0">{r.supplier}</p>
            <p className="text-xs font-mono tabular-nums text-[#868E96] mt-0.5 lg:mt-0">{r.orderId}</p>
            <p className="text-xs text-[#495057] tabular-nums mt-0.5 lg:mt-0 lg:text-center">{r.qty.toLocaleString()}개</p>
            <p className="text-xs tabular-nums text-[#495057] lg:text-right">₩{r.unitPrice.toLocaleString()}</p>
            <p className="text-sm font-bold tabular-nums text-[#212529] lg:text-right">₩{r.amount.toLocaleString()}</p>
            <div className="mt-1 lg:mt-0 lg:text-center">
              <span className={`inline-block text-[11px] font-semibold px-2 py-1 rounded ${r.payStatus === '완료' ? 'bg-[#EDF2FF] text-[#4E7FFF]' : 'bg-[#FFF4E6] text-[#E67700]'}`}>{r.payStatus}</span>
            </div>
          </div>
        ))}
      </section>
    </PageShell>
  );
}
