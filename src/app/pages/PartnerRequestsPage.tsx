import { useState } from 'react';
import { useNavigate } from 'react-router';
import { FileText } from 'lucide-react';
import { PageShell } from '../components/PageShell';
import { usePartners } from '../lib/partnersContext';
import type { PartnerStatus } from '../lib/partners';

const FILTERS: (PartnerStatus | '전체')[] = ['전체', '대기', '승인', '반려'];

export default function PartnerRequestsPage() {
  const navigate = useNavigate();
  const { requests } = usePartners();
  const [filter, setFilter] = useState<PartnerStatus | '전체'>('전체');
  const rows = filter === '전체' ? requests : requests.filter((r) => r.status === filter);

  const counts: Record<PartnerStatus | '전체', number> = {
    '전체': requests.length,
    '대기': requests.filter((r) => r.status === '대기').length,
    '승인': requests.filter((r) => r.status === '승인').length,
    '반려': requests.filter((r) => r.status === '반려').length,
  };

  return (
    <PageShell title="거래 신청 내역" description="제약사에 제출한 거래 신청의 진행 상태를 확인합니다.">
      <div
        className="flex items-center gap-1.5 mb-4 overflow-x-auto [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {FILTERS.map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`h-9 px-4 rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors flex items-center gap-1.5 ${active ? 'bg-[#212529] text-white' : 'bg-white border border-[#DEE2E6] text-[#495057] hover:border-[#212529]'}`}
            >
              <span>{f}</span>
              <span className={`tabular-nums ${active ? 'text-white/70' : 'text-[#ADB5BD]'}`}>{counts[f]}</span>
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-[#E9ECEF] bg-white overflow-hidden">
        {rows.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-[#868E96]">해당 상태의 거래 신청이 없습니다.</div>
        ) : rows.map((r) => {
          const reviewLabel = r.status === '승인' ? '승인일' : r.status === '반려' ? '반려일' : null;
          return (
            <div key={r.id} className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-[#F1F3F5] last:border-0">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <button
                    onClick={() => navigate(`/partners/${r.supplierId}`)}
                    className="text-sm font-semibold text-[#212529] hover:text-[#4E7FFF] hover:underline cursor-pointer"
                  >
                    {r.supplier}
                  </button>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${r.status === '대기' ? 'bg-[#FFF4E6] text-[#E67700]' : r.status === '승인' ? 'bg-[#EDF2FF] text-[#4E7FFF]' : 'bg-[#FFE3E3] text-[#C92A2A]'}`}>{r.status}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#868E96] tabular-nums">
                  <span>신청일 {r.requestedAt}</span>
                  {reviewLabel && r.reviewedAt && (
                    <>
                      <span className="w-px h-3 bg-[#DEE2E6]" />
                      <span>{reviewLabel} {r.reviewedAt}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => navigate(`/partners/${r.supplierId}`)}
                  className="h-8 px-3 rounded-lg border border-[#DEE2E6] text-xs font-semibold text-[#495057] hover:border-[#4E7FFF] hover:text-[#4E7FFF] cursor-pointer transition-colors"
                >
                  제약사 보기
                </button>
                <button
                  onClick={() => navigate(`/partners/requests/${r.id}`)}
                  className="inline-flex items-center gap-1 h-8 px-3 rounded-lg bg-[#4E7FFF] hover:bg-[#3D6FEF] text-xs font-semibold text-white cursor-pointer transition-colors"
                >
                  <FileText className="w-3 h-3" strokeWidth={2.5} />
                  신청 내역 보기
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
