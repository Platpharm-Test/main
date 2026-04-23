import { useNavigate } from 'react-router';
import { Building2, ChevronRight } from 'lucide-react';
import { PageShell } from '../components/PageShell';
import { APPROVED_SUPPLIERS } from '../lib/partners';

export default function ApprovedSuppliersPage() {
  const navigate = useNavigate();
  return (
    <PageShell title="승인된 거래처">
      {/* 데스크톱: 테이블형 */}
      <div className="hidden lg:block rounded-lg border border-[#DEE2E6] bg-white overflow-hidden">
        <div className="grid grid-cols-[1fr_140px_140px_100px_100px_140px_120px_24px] items-center gap-x-4 px-5 py-2.5 bg-[#F8F9FA] border-b border-[#E9ECEF] text-[11px] font-bold text-[#495057]">
          <span>거래처</span>
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
            className="w-full text-left grid grid-cols-[1fr_140px_140px_100px_100px_140px_120px_24px] items-center gap-x-4 px-5 py-3 border-b border-[#F1F3F5] last:border-0 hover:bg-[#FAFBFC] cursor-pointer transition-colors"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#212529] truncate">{s.name}</p>
              <p className="text-[11px] text-[#868E96]">승인일 {s.approvedAt}</p>
            </div>
            <p className="text-xs text-[#495057] tabular-nums">{s.bizNumber}</p>
            <p className="text-xs text-[#495057] tabular-nums">{s.contact}</p>
            <p className="text-sm font-semibold text-[#212529] tabular-nums text-center">{s.monthlyOrders}건</p>
            <p className="text-xs text-[#868E96] tabular-nums text-center">{s.transactionCount}건</p>
            <p className="text-sm font-bold text-[#212529] tabular-nums text-right">₩{s.ytdAmount.toLocaleString()}</p>
            <p className="text-xs text-[#495057]">{s.paymentTerm}</p>
            <ChevronRight className="w-4 h-4 text-[#ADB5BD]" strokeWidth={2} />
          </button>
        ))}
      </div>

      {/* 모바일: 카드형 */}
      <div className="lg:hidden space-y-2.5">
        {APPROVED_SUPPLIERS.map((s) => (
          <button
            key={s.id}
            onClick={() => navigate(`/partners/approved/${s.id}`)}
            className="w-full text-left rounded-xl border border-[#E9ECEF] bg-white p-4 hover:border-[#4E7FFF] transition-colors cursor-pointer"
          >
            {/* 헤더: 아이콘 + 이름 + 화살표 */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F1F3F5] flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-[#495057]" strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#212529] truncate">{s.name}</p>
                <p className="text-[11px] text-[#868E96] tabular-nums">승인일 {s.approvedAt}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#ADB5BD] shrink-0 mt-1" strokeWidth={2} />
            </div>

            {/* 핵심 지표: 연간 거래액 + 이번 달 주문 */}
            <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-[#F8F9FA] p-3">
              <div className="min-w-0">
                <p className="text-[10px] text-[#868E96] mb-0.5">연간 거래액</p>
                <p className="text-sm font-bold text-[#212529] tabular-nums truncate">₩{s.ytdAmount.toLocaleString()}</p>
              </div>
              <div className="min-w-0 border-l border-[#E9ECEF] pl-2">
                <p className="text-[10px] text-[#868E96] mb-0.5">이번 달 주문</p>
                <p className="text-sm font-bold text-[#212529] tabular-nums">{s.monthlyOrders}건 <span className="text-[10px] font-normal text-[#868E96] ml-1">· 누적 {s.transactionCount}건</span></p>
              </div>
            </div>

            {/* 메타 정보 */}
            <dl className="mt-3 grid grid-cols-2 gap-y-1.5 gap-x-3 text-[11px]">
              <MetaRow label="사업자" value={s.bizNumber} />
              <MetaRow label="결제" value={s.paymentTerm} />
              <MetaRow label="연락처" value={s.contact} full />
            </dl>
          </button>
        ))}
      </div>
    </PageShell>
  );
}

function MetaRow({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={`flex items-baseline gap-1.5 min-w-0 ${full ? 'col-span-2' : ''}`}>
      <dt className="text-[#ADB5BD] shrink-0">{label}</dt>
      <dd className="text-[#495057] tabular-nums truncate">{value}</dd>
    </div>
  );
}
