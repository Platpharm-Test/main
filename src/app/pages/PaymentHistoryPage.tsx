import { PageShell } from '../components/PageShell';
import { PAYMENT_HISTORY } from '../lib/payments';

export default function PaymentHistoryPage() {
  const total = PAYMENT_HISTORY.reduce((s, p) => s + p.amount, 0);
  return (
    <PageShell title="결제 내역" description={`총 ${PAYMENT_HISTORY.length}건 · 합계 ₩${total.toLocaleString()}`}>
      <div className="rounded-lg border border-[#DEE2E6] bg-white overflow-hidden">
        <div className="hidden lg:grid grid-cols-[140px_180px_1fr_120px_140px_100px] items-center gap-x-4 px-5 py-2.5 bg-[#F8F9FA] border-b border-[#E9ECEF] text-[11px] font-bold text-[#495057]">
          <span>결제일</span>
          <span>결제번호</span>
          <span>공급사 / 주문번호</span>
          <span>결제수단</span>
          <span className="text-right">금액</span>
          <span className="text-center">상태</span>
        </div>
        {PAYMENT_HISTORY.map((p) => (
          <div key={p.id} className="lg:grid lg:grid-cols-[140px_180px_1fr_120px_140px_100px] lg:items-center lg:gap-x-4 px-5 py-3 border-b border-[#F1F3F5] last:border-0">
            <p className="text-xs text-[#495057] tabular-nums">{p.paidAt}</p>
            <p className="text-xs font-mono tabular-nums text-[#868E96] mt-0.5 lg:mt-0">{p.id}</p>
            <div className="mt-1 lg:mt-0 min-w-0">
              <p className="text-sm font-semibold text-[#212529]">{p.supplier}</p>
              <p className="text-[11px] text-[#868E96] tabular-nums">{p.orderId}</p>
            </div>
            <p className="text-xs text-[#495057] mt-0.5 lg:mt-0">{p.method}</p>
            <p className="text-sm font-bold tabular-nums text-[#212529] mt-1 lg:mt-0 lg:text-right">₩{p.amount.toLocaleString()}</p>
            <div className="mt-1 lg:mt-0 lg:text-center">
              <span className="inline-block text-[11px] font-semibold px-2 py-1 rounded bg-[#EDF2FF] text-[#4E7FFF]">{p.status}</span>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
