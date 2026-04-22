import { useNavigate } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { PageShell } from '../components/PageShell';
import { APPROVED_SUPPLIERS } from '../lib/partners';

export default function ApprovedSuppliersPage() {
  const navigate = useNavigate();
  return (
    <PageShell title="승인된 공급사" description="공급사를 클릭하면 전체 거래내역을 확인할 수 있습니다.">
      <div className="rounded-lg border border-[#DEE2E6] bg-white overflow-hidden">
        <div className="hidden lg:grid grid-cols-[1fr_140px_140px_100px_100px_140px_120px_24px] items-center gap-x-4 px-5 py-2.5 bg-[#F8F9FA] border-b border-[#E9ECEF] text-[11px] font-bold text-[#495057]">
          <span>공급사</span>
          <span>사업자번호</span>
          <span>연락처</span>
          <span className="text-center">이번 달</span>
          <span className="text-center">누적 거래</span>
          <span className="text-right">연간 거래액</span>
          <span>결제 조건</span>
          <span></span>
        </div>
        {APPROVED_SUPPLIERS.map((s) => (
          <button
            key={s.id}
            onClick={() => navigate(`/partners/approved/${s.id}`)}
            className="w-full text-left lg:grid lg:grid-cols-[1fr_140px_140px_100px_100px_140px_120px_24px] lg:items-center lg:gap-x-4 px-5 py-3 border-b border-[#F1F3F5] last:border-0 hover:bg-[#FAFBFC] cursor-pointer transition-colors"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#212529]">{s.supplier}</p>
              <p className="text-[11px] text-[#868E96]">승인일 {s.approvedAt}</p>
            </div>
            <p className="text-xs text-[#495057] tabular-nums mt-0.5 lg:mt-0">{s.bizNumber}</p>
            <p className="text-xs text-[#495057] tabular-nums">{s.contact}</p>
            <p className="text-sm font-semibold text-[#212529] tabular-nums mt-1 lg:mt-0 lg:text-center">{s.monthlyOrders}건</p>
            <p className="text-xs text-[#868E96] tabular-nums lg:text-center">{s.transactionCount}건</p>
            <p className="text-sm font-bold text-[#212529] tabular-nums lg:text-right">₩{s.ytdAmount.toLocaleString()}</p>
            <p className="text-xs text-[#495057] mt-0.5 lg:mt-0">{s.paymentTerm}</p>
            <ChevronRight className="hidden lg:block w-4 h-4 text-[#ADB5BD]" strokeWidth={2} />
          </button>
        ))}
      </div>
    </PageShell>
  );
}
