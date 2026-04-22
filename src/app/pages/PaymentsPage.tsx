import { useNavigate } from 'react-router';
import { PageShell } from '../components/PageShell';
import { StatCard } from '../components/StatCard';
import { PAYMENT_HISTORY, UNPAID_RECORDS } from '../lib/payments';

export default function PaymentsPage() {
  const navigate = useNavigate();
  const thisMonthPaid = PAYMENT_HISTORY.reduce((s, p) => s + p.amount, 0);
  const unpaid = UNPAID_RECORDS.filter((p) => p.status === '미결제').reduce((s, p) => s + p.amount, 0);
  const overdue = UNPAID_RECORDS.filter((p) => p.status === '연체').reduce((s, p) => s + p.amount, 0);

  return (
    <PageShell title="결제 관리" description="결제·수금 현황을 한눈에 확인합니다.">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="이번 달 결제액" value={`₩${(thisMonthPaid / 10000).toLocaleString()}만`} sublabel={`${PAYMENT_HISTORY.length}건 결제 완료`} highlight />
        <StatCard label="미결제 금액" value={`₩${(unpaid / 10000).toLocaleString()}만`} sublabel={`${UNPAID_RECORDS.filter((p) => p.status === '미결제').length}건 대기 중`} description="결제일까지 입금 예정" />
        <StatCard label="연체 금액" value={`₩${(overdue / 10000).toLocaleString()}만`} sublabel={`${UNPAID_RECORDS.filter((p) => p.status === '연체').length}건 연체`} description="빠른 처리가 필요합니다" />
        <StatCard label="등록 결제수단" value={3} sublabel="카드·계좌·세금계산서" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="rounded-lg border border-[#DEE2E6] bg-white">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#F1F3F5]">
            <h2 className="text-sm font-bold text-[#212529]">최근 결제</h2>
            <button onClick={() => navigate('/payments/history')} className="text-xs font-semibold text-[#4E7FFF] hover:underline cursor-pointer">전체 보기</button>
          </div>
          <ul className="divide-y divide-[#F1F3F5]">
            {PAYMENT_HISTORY.slice(0, 4).map((p) => (
              <li key={p.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#212529]">{p.supplier}</p>
                  <p className="text-xs text-[#868E96]">{p.paidAt} · {p.method}</p>
                </div>
                <p className="text-sm font-bold tabular-nums text-[#212529]">₩{p.amount.toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-[#DEE2E6] bg-white">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#F1F3F5]">
            <h2 className="text-sm font-bold text-[#212529]">미결제 건</h2>
            <button onClick={() => navigate('/payments/unpaid')} className="text-xs font-semibold text-[#4E7FFF] hover:underline cursor-pointer">전체 보기</button>
          </div>
          <ul className="divide-y divide-[#F1F3F5]">
            {UNPAID_RECORDS.map((p) => (
              <li key={p.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#212529]">{p.supplier}</p>
                  <p className="text-xs text-[#868E96]">기한 {p.dueDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${p.status === '연체' ? 'bg-[#FFE3E3] text-[#C92A2A]' : 'bg-[#FFF4E6] text-[#E67700]'}`}>{p.status}</span>
                  <p className="text-sm font-bold tabular-nums text-[#212529]">₩{p.amount.toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageShell>
  );
}
