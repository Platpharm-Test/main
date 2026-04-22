import { useNavigate } from 'react-router';
import { PageShell } from '../components/PageShell';
import { StatCard } from '../components/StatCard';
import { PARTNER_REQUESTS, APPROVED_SUPPLIERS } from '../lib/partners';

export default function PartnersPage() {
  const navigate = useNavigate();
  const pending = PARTNER_REQUESTS.filter((r) => r.status === '대기').length;
  const totalSuppliers = APPROVED_SUPPLIERS.length;
  const ytdAmount = APPROVED_SUPPLIERS.reduce((sum, s) => sum + s.ytdAmount, 0);

  return (
    <PageShell title="거래처 관리" description="거래 신청과 승인된 공급사를 한눈에 관리합니다.">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard label="승인된 공급사" value={totalSuppliers} sublabel="거래 중" highlight description={`연간 거래액 ₩${(ytdAmount / 1_0000_0000).toFixed(2)}억`} />
        <StatCard label="신규 신청" value={pending} sublabel="승인 대기" description="검토 후 빠르게 처리하세요" />
        <StatCard label="이번 달 주문" value={APPROVED_SUPPLIERS.reduce((s, x) => s + x.monthlyOrders, 0)} sublabel="공급사별 주문 합계" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="rounded-lg border border-[#DEE2E6] bg-white">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#F1F3F5]">
            <h2 className="text-sm font-bold text-[#212529]">최근 거래 신청</h2>
            <button onClick={() => navigate('/partners/requests')} className="text-xs font-semibold text-[#4E7FFF] hover:underline cursor-pointer">전체 보기</button>
          </div>
          <ul className="divide-y divide-[#F1F3F5]">
            {PARTNER_REQUESTS.slice(0, 4).map((r) => (
              <li key={r.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#212529]">{r.supplier}</p>
                  <p className="text-xs text-[#868E96]">{r.requestedAt} · {r.bizNumber}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${r.status === '대기' ? 'bg-[#FFF4E6] text-[#E67700]' : r.status === '승인' ? 'bg-[#EDF2FF] text-[#4E7FFF]' : 'bg-[#F1F3F5] text-[#868E96]'}`}>{r.status}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-[#DEE2E6] bg-white">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#F1F3F5]">
            <h2 className="text-sm font-bold text-[#212529]">주요 공급사</h2>
            <button onClick={() => navigate('/partners/approved')} className="text-xs font-semibold text-[#4E7FFF] hover:underline cursor-pointer">전체 보기</button>
          </div>
          <ul className="divide-y divide-[#F1F3F5]">
            {APPROVED_SUPPLIERS.slice(0, 4).map((s) => (
              <li key={s.id}>
                <button onClick={() => navigate(`/partners/approved/${s.id}`)} className="w-full px-5 py-3 flex items-center justify-between hover:bg-[#FAFBFC] cursor-pointer transition-colors text-left">
                  <div>
                    <p className="text-sm font-semibold text-[#212529]">{s.supplier}</p>
                    <p className="text-xs text-[#868E96]">이번 달 {s.monthlyOrders}건 · {s.paymentTerm}</p>
                  </div>
                  <p className="text-sm font-bold tabular-nums text-[#212529]">₩{s.ytdAmount.toLocaleString()}</p>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageShell>
  );
}
