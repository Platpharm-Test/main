import { useNavigate } from 'react-router';
import { PageShell } from '../components/PageShell';
import { StatCard } from '../components/StatCard';
import { aggregatePurchases, PURCHASE_RECORDS, RETURN_REQUESTS } from '../lib/ledger';

export default function LedgerPage() {
  const navigate = useNavigate();

  const summaries = aggregatePurchases();
  const totalPurchaseAmount = summaries.reduce((s, p) => s + p.totalAmount, 0);
  const totalPurchaseCount = PURCHASE_RECORDS.length;
  const totalPurchaseVat = Math.round(totalPurchaseAmount * 0.1);
  const activeReturns = RETURN_REQUESTS.filter((r) => r.status === '접수' || r.status === '승인').length;
  const refundTotal = RETURN_REQUESTS.filter((r) => r.status === '환불완료').reduce((s, r) => s + r.refundAmount, 0);

  return (
    <PageShell title="장부·반품관리" description="구매 장부와 반품 진행 현황을 한눈에 확인합니다.">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="누적 매입액" value={`₩${(totalPurchaseAmount / 10000).toLocaleString()}만`} sublabel={`${totalPurchaseCount}건 · 제품 ${summaries.length}종`} highlight />
        <StatCard label="부가세 (매입)" value={`₩${(totalPurchaseVat / 10000).toLocaleString()}만`} sublabel="공제 예정" />
        <StatCard label="진행 중 반품" value={activeReturns} sublabel="접수·승인" description="빠른 처리가 필요합니다" />
        <StatCard label="환불 완료" value={`₩${refundTotal.toLocaleString()}`} sublabel="누적 환불액" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="rounded-lg border border-[#DEE2E6] bg-white">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#F1F3F5]">
            <h2 className="text-sm font-bold text-[#212529]">매입 상위 제품</h2>
            <button onClick={() => navigate('/ledger/purchases')} className="text-xs font-semibold text-[#4E7FFF] hover:underline cursor-pointer">구매 장부 보기</button>
          </div>
          <ul className="divide-y divide-[#F1F3F5]">
            {[...summaries].sort((a, b) => b.totalAmount - a.totalAmount).slice(0, 4).map((s) => (
              <li key={s.productId}>
                <button onClick={() => navigate(`/ledger/purchases/${s.productId}`)} className="w-full px-5 py-3 flex items-center justify-between hover:bg-[#FAFBFC] cursor-pointer transition-colors text-left">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#212529] truncate">{s.productName}</p>
                    <p className="text-xs text-[#868E96]">거래처 {s.supplierCount}곳 · 수량 {s.totalQty.toLocaleString()}개</p>
                  </div>
                  <p className="text-sm font-bold tabular-nums text-[#212529] shrink-0 ml-3">₩{s.totalAmount.toLocaleString()}</p>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-[#DEE2E6] bg-white">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#F1F3F5]">
            <h2 className="text-sm font-bold text-[#212529]">반품 현황</h2>
            <button onClick={() => navigate('/returns')} className="text-xs font-semibold text-[#4E7FFF] hover:underline cursor-pointer">전체 보기</button>
          </div>
          <ul className="divide-y divide-[#F1F3F5]">
            {RETURN_REQUESTS.slice(0, 4).map((r) => (
              <li key={r.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#212529]">{r.product}</p>
                  <p className="text-xs text-[#868E96]">{r.supplier} · {r.reason}</p>
                </div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${r.status === '환불완료' ? 'bg-[#EDF2FF] text-[#4E7FFF]' : r.status === '반려' ? 'bg-[#F1F3F5] text-[#868E96]' : 'bg-[#FFF4E6] text-[#E67700]'}`}>{r.status}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageShell>
  );
}
