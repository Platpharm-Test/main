import { useParams, useNavigate } from 'react-router';
import { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { PageShell } from '../components/PageShell';
import { StatCard } from '../components/StatCard';
import { getSupplier, getSupplierTransactions } from '../lib/partners';

type Filter = '전체' | '완료' | '미결제';

export default function SupplierDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const supplier = getSupplier(id);
  const transactions = useMemo(() => getSupplierTransactions(id), [id]);
  const [filter, setFilter] = useState<Filter>('전체');

  if (!supplier) {
    return (
      <PageShell title="공급사를 찾을 수 없습니다.">
        <button onClick={() => navigate('/partners/approved')} className="text-sm text-[#4E7FFF] hover:underline cursor-pointer">← 승인된 공급사 목록으로</button>
      </PageShell>
    );
  }

  const ytd = supplier.ytdAmount;
  const unpaidAmount = transactions.filter((t) => t.payStatus === '미결제').reduce((s, t) => s + t.amount, 0);
  const avgAmount = transactions.length > 0 ? Math.round(ytd / transactions.length) : 0;
  const rows = filter === '전체' ? transactions : transactions.filter((t) => t.payStatus === filter);

  return (
    <PageShell title={supplier.supplier} description={`${supplier.bizNumber} · ${supplier.contact} · 승인일 ${supplier.approvedAt}`} actions={(
      <button onClick={() => navigate('/partners/approved')} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#DEE2E6] text-xs font-semibold text-[#495057] hover:border-[#4E7FFF] hover:text-[#4E7FFF] cursor-pointer">
        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.5} /> 목록으로
      </button>
    )}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="연간 거래액" value={`₩${(ytd / 1_0000_0000).toFixed(2)}억`} sublabel="최근 12개월" highlight />
        <StatCard label="총 거래 건수" value={transactions.length} sublabel="누적 주문" />
        <StatCard label="건당 평균 금액" value={`₩${avgAmount.toLocaleString()}`} />
        <StatCard label="미결제 금액" value={`₩${unpaidAmount.toLocaleString()}`} sublabel={`결제 조건 ${supplier.paymentTerm}`} description={unpaidAmount > 0 ? '입금 예정 있음' : '모두 결제 완료'} />
      </div>

      <div className="rounded-lg border border-[#DEE2E6] bg-white overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#F1F3F5]">
          <h2 className="text-sm font-bold text-[#212529]">거래 내역</h2>
          <div className="flex items-center gap-1.5">
            {(['전체', '완료', '미결제'] as Filter[]).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`h-7 px-3 rounded-full text-[11px] font-semibold cursor-pointer transition-colors ${filter === f ? 'bg-[#4E7FFF] text-white' : 'bg-white border border-[#DEE2E6] text-[#495057] hover:border-[#4E7FFF]'}`}>{f}</button>
            ))}
          </div>
        </div>
        <div className="hidden lg:grid grid-cols-[120px_200px_1fr_100px_160px_100px] items-center gap-x-4 px-5 py-2.5 bg-[#F8F9FA] border-b border-[#E9ECEF] text-[11px] font-bold text-[#495057]">
          <span>거래일</span>
          <span>주문번호</span>
          <span>거래번호</span>
          <span className="text-center">품목</span>
          <span className="text-right">금액</span>
          <span className="text-center">결제</span>
        </div>
        {rows.map((t) => (
          <div key={t.id} className="lg:grid lg:grid-cols-[120px_200px_1fr_100px_160px_100px] lg:items-center lg:gap-x-4 px-5 py-3 border-b border-[#F1F3F5] last:border-0">
            <p className="text-xs text-[#495057] tabular-nums">{t.date}</p>
            <p className="text-xs font-mono tabular-nums text-[#868E96] mt-0.5 lg:mt-0">{t.orderId}</p>
            <p className="text-xs font-mono tabular-nums text-[#ADB5BD] mt-0.5 lg:mt-0">{t.id}</p>
            <p className="text-xs text-[#495057] tabular-nums mt-0.5 lg:mt-0 lg:text-center">{t.itemCount}품목</p>
            <p className="text-sm font-bold tabular-nums text-[#212529] mt-0.5 lg:mt-0 lg:text-right">₩{t.amount.toLocaleString()}</p>
            <div className="mt-1 lg:mt-0 lg:text-center">
              <span className={`inline-block text-[11px] font-semibold px-2 py-1 rounded ${t.payStatus === '완료' ? 'bg-[#EDF2FF] text-[#4E7FFF]' : 'bg-[#FFF4E6] text-[#E67700]'}`}>{t.payStatus}</span>
            </div>
          </div>
        ))}
        {rows.length === 0 && <div className="px-5 py-10 text-center text-sm text-[#868E96]">해당 상태의 거래가 없습니다.</div>}
      </div>
    </PageShell>
  );
}
