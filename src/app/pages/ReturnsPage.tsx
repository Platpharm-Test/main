import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, Plus } from 'lucide-react';
import { PageShell } from '../components/PageShell';
import { useReturns } from '../lib/returnsContext';
import type { ReturnRequest } from '../lib/ledger';

const FILTERS: (ReturnRequest['status'] | '전체')[] = ['전체', '접수', '승인', '반려', '환불완료'];

export default function ReturnsPage() {
  const navigate = useNavigate();
  const { requests } = useReturns();
  const [filter, setFilter] = useState<ReturnRequest['status'] | '전체'>('전체');
  const rows = filter === '전체' ? requests : requests.filter((r) => r.status === filter);
  return (
    <PageShell
      title="반품 신청"
      description="반품 요청을 접수하고 진행 상태를 추적합니다."
      actions={(
        <button onClick={() => navigate('/returns/new')} className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#4E7FFF] hover:bg-[#3D6FEF] text-white text-sm font-semibold cursor-pointer">
          <Plus className="w-4 h-4" strokeWidth={2.5} /> 반품 신청
        </button>
      )}
    >
      <div className="flex items-center gap-2 mb-4 overflow-x-auto">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`h-8 px-3 rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors ${filter === f ? 'bg-[#4E7FFF] text-white' : 'bg-white border border-[#DEE2E6] text-[#495057] hover:border-[#4E7FFF]'}`}>{f}</button>
        ))}
      </div>

      <div className="rounded-lg border border-[#DEE2E6] bg-white overflow-hidden">
        <div className="hidden lg:grid grid-cols-[120px_1fr_120px_80px_100px_140px_100px_24px] items-center gap-x-4 px-5 py-2.5 bg-[#F8F9FA] border-b border-[#E9ECEF] text-[11px] font-bold text-[#495057]">
          <span>신청일</span>
          <span>상품</span>
          <span>공급사</span>
          <span className="text-center">수량</span>
          <span>사유</span>
          <span className="text-right">환불금액</span>
          <span className="text-center">상태</span>
          <span></span>
        </div>
        {rows.map((r) => (
          <button
            key={r.id}
            onClick={() => navigate(`/returns/${r.id}`)}
            className="w-full text-left lg:grid lg:grid-cols-[120px_1fr_120px_80px_100px_140px_100px_24px] lg:items-center lg:gap-x-4 px-5 py-3 border-b border-[#F1F3F5] last:border-0 hover:bg-[#FAFBFC] cursor-pointer transition-colors"
          >
            <p className="text-xs text-[#495057] tabular-nums">{r.requestedAt}</p>
            <div className="min-w-0 mt-1 lg:mt-0">
              <p className="text-sm font-semibold text-[#212529] truncate">{r.product}</p>
              <p className="lg:hidden text-[11px] text-[#868E96] tabular-nums">{r.id}</p>
            </div>
            <p className="text-xs text-[#495057] mt-0.5 lg:mt-0">{r.supplier}</p>
            <p className="text-xs text-[#495057] tabular-nums mt-0.5 lg:mt-0 lg:text-center">{r.qty}개</p>
            <p className="text-xs text-[#495057] mt-0.5 lg:mt-0">{r.reason}</p>
            <p className="text-sm font-bold tabular-nums text-[#212529] mt-0.5 lg:mt-0 lg:text-right">₩{r.refundAmount.toLocaleString()}</p>
            <div className="mt-1 lg:mt-0 lg:text-center">
              <span className={`inline-block text-[11px] font-semibold px-2 py-1 rounded ${r.status === '환불완료' ? 'bg-[#EDF2FF] text-[#4E7FFF]' : r.status === '반려' ? 'bg-[#FFE3E3] text-[#C92A2A]' : r.status === '승인' ? 'bg-[#E7F5FF] text-[#1971C2]' : 'bg-[#FFF4E6] text-[#E67700]'}`}>{r.status}</span>
            </div>
            <ChevronRight className="hidden lg:block w-4 h-4 text-[#ADB5BD]" strokeWidth={2} />
          </button>
        ))}
        {rows.length === 0 && <div className="px-5 py-10 text-center text-sm text-[#868E96]">해당 상태의 반품 신청이 없습니다.</div>}
      </div>
    </PageShell>
  );
}
