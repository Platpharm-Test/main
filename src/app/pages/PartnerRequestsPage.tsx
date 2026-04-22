import { useState } from 'react';
import { PageShell } from '../components/PageShell';
import { PARTNER_REQUESTS, type PartnerStatus } from '../lib/partners';

const FILTERS: (PartnerStatus | '전체')[] = ['전체', '대기', '승인', '반려'];

export default function PartnerRequestsPage() {
  const [filter, setFilter] = useState<PartnerStatus | '전체'>('전체');
  const rows = filter === '전체' ? PARTNER_REQUESTS : PARTNER_REQUESTS.filter((r) => r.status === filter);

  return (
    <PageShell title="거래 신청 내역" description="공급사로부터 들어온 거래 신청을 검토하고 처리합니다.">
      <div className="flex items-center gap-2 mb-4 overflow-x-auto">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`h-8 px-3 rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors ${filter === f ? 'bg-[#4E7FFF] text-white' : 'bg-white border border-[#DEE2E6] text-[#495057] hover:border-[#4E7FFF]'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-[#DEE2E6] bg-white overflow-hidden">
        <div className="hidden lg:grid grid-cols-[140px_1fr_160px_140px_100px_120px] items-center gap-x-4 px-5 py-2.5 bg-[#F8F9FA] border-b border-[#E9ECEF] text-[11px] font-bold text-[#495057]">
          <span>신청번호</span>
          <span>공급사</span>
          <span>사업자번호</span>
          <span>연락처</span>
          <span className="text-center">상태</span>
          <span className="text-right">신청일</span>
        </div>
        {rows.map((r) => (
          <div key={r.id} className="lg:grid lg:grid-cols-[140px_1fr_160px_140px_100px_120px] lg:items-center lg:gap-x-4 px-5 py-3 border-b border-[#F1F3F5] last:border-0">
            <p className="text-xs font-mono tabular-nums text-[#495057]">{r.id}</p>
            <div className="lg:min-w-0 mt-1 lg:mt-0">
              <p className="text-sm font-semibold text-[#212529]">{r.supplier}</p>
              {r.memo && <p className="text-[11px] text-[#868E96] truncate">{r.memo}</p>}
            </div>
            <p className="text-xs text-[#495057] tabular-nums mt-0.5 lg:mt-0">{r.bizNumber}</p>
            <p className="text-xs text-[#495057] tabular-nums">{r.contact}</p>
            <div className="mt-1 lg:mt-0 lg:text-center">
              <span className={`inline-block text-[11px] font-semibold px-2 py-1 rounded ${r.status === '대기' ? 'bg-[#FFF4E6] text-[#E67700]' : r.status === '승인' ? 'bg-[#EDF2FF] text-[#4E7FFF]' : 'bg-[#F1F3F5] text-[#868E96]'}`}>{r.status}</span>
            </div>
            <p className="text-xs text-[#868E96] lg:text-right">{r.requestedAt}</p>
          </div>
        ))}
        {rows.length === 0 && <div className="px-5 py-10 text-center text-sm text-[#868E96]">해당 상태의 신청이 없습니다.</div>}
      </div>
    </PageShell>
  );
}
