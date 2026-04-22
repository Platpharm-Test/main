import { PageShell } from '../components/PageShell';
import { LEDGER_ENTRIES } from '../lib/ledger';

export default function LedgerPurchasesPage() {
  const total = LEDGER_ENTRIES.reduce((s, e) => s + e.amount, 0);
  const vat = LEDGER_ENTRIES.reduce((s, e) => s + e.vat, 0);
  return (
    <PageShell title="구매 장부" description={`총 ${LEDGER_ENTRIES.length}건 · 매입 ₩${total.toLocaleString()} · 부가세 ₩${vat.toLocaleString()}`}>
      <div className="rounded-lg border border-[#DEE2E6] bg-white overflow-hidden">
        <div className="hidden lg:grid grid-cols-[120px_180px_1fr_80px_140px_120px_100px] items-center gap-x-4 px-5 py-2.5 bg-[#F8F9FA] border-b border-[#E9ECEF] text-[11px] font-bold text-[#495057]">
          <span>거래일</span>
          <span>주문번호</span>
          <span>공급사</span>
          <span className="text-center">품목</span>
          <span className="text-right">공급가</span>
          <span className="text-right">부가세</span>
          <span className="text-center">결제</span>
        </div>
        {LEDGER_ENTRIES.map((e) => (
          <div key={e.id} className="lg:grid lg:grid-cols-[120px_180px_1fr_80px_140px_120px_100px] lg:items-center lg:gap-x-4 px-5 py-3 border-b border-[#F1F3F5] last:border-0">
            <p className="text-xs text-[#495057] tabular-nums">{e.date}</p>
            <p className="text-xs font-mono tabular-nums text-[#868E96] mt-0.5 lg:mt-0">{e.orderId}</p>
            <p className="text-sm font-semibold text-[#212529] mt-1 lg:mt-0">{e.supplier}</p>
            <p className="text-xs text-[#495057] tabular-nums mt-0.5 lg:mt-0 lg:text-center">{e.itemCount}품목</p>
            <p className="text-sm font-bold tabular-nums text-[#212529] lg:text-right">₩{e.amount.toLocaleString()}</p>
            <p className="text-xs tabular-nums text-[#495057] lg:text-right">₩{e.vat.toLocaleString()}</p>
            <div className="mt-1 lg:mt-0 lg:text-center">
              <span className={`inline-block text-[11px] font-semibold px-2 py-1 rounded ${e.payStatus === '완료' ? 'bg-[#EDF2FF] text-[#4E7FFF]' : 'bg-[#FFF4E6] text-[#E67700]'}`}>{e.payStatus}</span>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
