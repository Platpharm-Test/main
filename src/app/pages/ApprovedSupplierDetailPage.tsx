import { useNavigate, useParams } from 'react-router';
import { useMemo, useState } from 'react';
import { ArrowLeft, Building2, ExternalLink } from 'lucide-react';
import { PageShell } from '../components/PageShell';
import { StatCard } from '../components/StatCard';
import { getApprovedSupplier, getSupplierTransactions } from '../lib/partners';
import { PRODUCTS } from '../lib/products';

type TxFilter = '전체' | '완료' | '미결제';

export default function ApprovedSupplierDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const supplier = getApprovedSupplier(id);
  const [txFilter, setTxFilter] = useState<TxFilter>('전체');

  const transactions = useMemo(() => getSupplierTransactions(id), [id]);
  const productCount = useMemo(() => (supplier ? PRODUCTS.filter((p) => p.supplier === supplier.name).length : 0), [supplier]);

  if (!supplier) {
    return (
      <PageShell title="승인된 거래처를 찾을 수 없습니다.">
        <button onClick={() => navigate('/partners/approved')} className="text-sm text-[#4E7FFF] hover:underline cursor-pointer">← 승인된 거래처로</button>
      </PageShell>
    );
  }

  const unpaidAmount = transactions.filter((t) => t.payStatus === '미결제').reduce((s, t) => s + t.amount, 0);
  const avgAmount = transactions.length > 0 ? Math.round(supplier.ytdAmount / transactions.length) : 0;
  const rows = txFilter === '전체' ? transactions : transactions.filter((t) => t.payStatus === txFilter);

  return (
    <PageShell
      title={supplier.name}
      actions={(
        <button onClick={() => navigate('/partners/approved')} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#DEE2E6] bg-white text-xs font-semibold text-[#495057] hover:border-[#4E7FFF] hover:text-[#4E7FFF] cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.5} /> 목록으로
        </button>
      )}
    >
      {/* 거래처 기본 정보 카드 — 모바일: 세로 스택, 데스크톱: 가로 */}
      <section className="rounded-xl border border-[#E9ECEF] bg-white p-4 sm:p-5 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4">
          <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#F1F3F5] flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#495057]" strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h2 className="text-base font-bold text-[#212529] break-keep">{supplier.name}</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EDF2FF] text-[#4E7FFF] shrink-0">거래중</span>
              </div>
              <p className="text-xs text-[#495057] line-clamp-2">{supplier.description}</p>
            </div>
          </div>
          <button
            onClick={() => navigate(`/partners/${supplier.id}`)}
            className="mt-4 sm:mt-0 w-full sm:w-auto inline-flex items-center justify-center gap-1 h-10 sm:h-9 px-3 rounded-lg border border-[#4E7FFF] text-[#4E7FFF] text-xs font-semibold hover:bg-[#EDF2FF] cursor-pointer whitespace-nowrap shrink-0"
          >
            브랜드관 <ExternalLink className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        </div>

        {/* 메타 정보 — 모바일: 세로 나열, 데스크톱: 가로 나열 */}
        <dl className="mt-4 pt-4 border-t border-[#F1F3F5] grid grid-cols-2 sm:flex sm:flex-wrap sm:gap-x-5 gap-y-2 text-[11px]">
          <MetaItem label="사업자번호" value={supplier.bizNumber} />
          <MetaItem label="연락처" value={supplier.contact} />
          <MetaItem label="설립" value={`${supplier.establishedYear}년`} />
          <MetaItem label="승인일" value={supplier.approvedAt} />
          <MetaItem label="주소" value={supplier.address} full />
        </dl>
      </section>

      {/* 거래 통계 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 mb-4">
        <StatCard label="연간 거래액" value={`₩${(supplier.ytdAmount / 1_0000_0000).toFixed(2)}억`} sublabel="최근 12개월" highlight />
        <StatCard label="총 거래 건수" value={supplier.transactionCount} sublabel="누적 주문" />
        <StatCard label="건당 평균" value={`₩${avgAmount.toLocaleString()}`} />
        <StatCard label="미결제 금액" value={`₩${unpaidAmount.toLocaleString()}`} sublabel={`결제 ${supplier.paymentTerm}`} description={unpaidAmount > 0 ? '입금 예정 있음' : '모두 결제 완료'} />
      </div>

      {/* 보조 정보 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-4">
        <div className="rounded-lg border border-[#E9ECEF] bg-white px-4 sm:px-5 py-3 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-[#868E96] mb-0.5">이번 달 주문</p>
            <p className="text-sm font-bold text-[#212529] tabular-nums">{supplier.monthlyOrders}건</p>
          </div>
          <button onClick={() => navigate('/orders')} className="text-[11px] font-semibold text-[#4E7FFF] hover:underline cursor-pointer">주문 내역 →</button>
        </div>
        <div className="rounded-lg border border-[#E9ECEF] bg-white px-4 sm:px-5 py-3 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-[#868E96] mb-0.5">취급 상품</p>
            <p className="text-sm font-bold text-[#212529] tabular-nums">{productCount}종</p>
          </div>
          <button onClick={() => navigate(`/partners/${supplier.id}`)} className="text-[11px] font-semibold text-[#4E7FFF] hover:underline cursor-pointer">브랜드관 →</button>
        </div>
      </div>

      {/* 거래 내역 */}
      <section className="rounded-xl border border-[#E9ECEF] bg-white overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 px-4 sm:px-5 py-3 border-b border-[#F1F3F5]">
          <h2 className="text-sm font-bold text-[#212529]">거래 내역 <span className="text-[#868E96] font-semibold ml-1">{transactions.length}건</span></h2>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {(['전체', '완료', '미결제'] as TxFilter[]).map((f) => (
              <button key={f} onClick={() => setTxFilter(f)} className={`h-7 px-3 rounded-full text-[11px] font-semibold cursor-pointer transition-colors whitespace-nowrap ${txFilter === f ? 'bg-[#4E7FFF] text-white' : 'bg-white border border-[#DEE2E6] text-[#495057] hover:border-[#4E7FFF]'}`}>{f}</button>
            ))}
          </div>
        </div>

        {/* 데스크톱 테이블 헤더 */}
        <div className="hidden lg:grid grid-cols-[120px_200px_1fr_100px_160px_100px] items-center gap-x-4 px-5 py-2.5 bg-[#F8F9FA] border-b border-[#E9ECEF] text-[11px] font-bold text-[#495057]">
          <span>거래일</span>
          <span>주문번호</span>
          <span>거래번호</span>
          <span className="text-center">품목</span>
          <span className="text-right">금액</span>
          <span className="text-center">결제</span>
        </div>

        {rows.map((t) => (
          <div key={t.id} className="lg:grid lg:grid-cols-[120px_200px_1fr_100px_160px_100px] lg:items-center lg:gap-x-4 px-4 sm:px-5 py-3 border-b border-[#F1F3F5] last:border-0">
            {/* 모바일: 카드형 레이아웃 */}
            <div className="lg:hidden">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs text-[#868E96] tabular-nums">{t.date}</p>
                <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded ${t.payStatus === '완료' ? 'bg-[#EDF2FF] text-[#4E7FFF]' : 'bg-[#FFF4E6] text-[#E67700]'}`}>{t.payStatus}</span>
              </div>
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <p className="text-xs font-mono tabular-nums text-[#495057] truncate">{t.orderId}</p>
                <p className="text-sm font-bold tabular-nums text-[#212529] shrink-0">₩{t.amount.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#868E96] tabular-nums">
                <span>{t.itemCount}품목</span>
                <span className="w-px h-3 bg-[#DEE2E6]" />
                <span className="font-mono text-[#ADB5BD] truncate">{t.id}</span>
              </div>
            </div>

            {/* 데스크톱: 그리드 레이아웃 */}
            <p className="hidden lg:block text-xs text-[#495057] tabular-nums">{t.date}</p>
            <p className="hidden lg:block text-xs font-mono tabular-nums text-[#868E96]">{t.orderId}</p>
            <p className="hidden lg:block text-xs font-mono tabular-nums text-[#ADB5BD]">{t.id}</p>
            <p className="hidden lg:block text-xs text-[#495057] tabular-nums text-center">{t.itemCount}품목</p>
            <p className="hidden lg:block text-sm font-bold tabular-nums text-[#212529] text-right">₩{t.amount.toLocaleString()}</p>
            <div className="hidden lg:block text-center">
              <span className={`inline-block text-[11px] font-semibold px-2 py-1 rounded ${t.payStatus === '완료' ? 'bg-[#EDF2FF] text-[#4E7FFF]' : 'bg-[#FFF4E6] text-[#E67700]'}`}>{t.payStatus}</span>
            </div>
          </div>
        ))}
        {rows.length === 0 && <div className="px-5 py-10 text-center text-sm text-[#868E96]">해당 상태의 거래가 없습니다.</div>}
      </section>
    </PageShell>
  );
}

function MetaItem({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? 'col-span-2 sm:col-span-1 sm:flex sm:items-baseline sm:gap-1.5' : 'sm:flex sm:items-baseline sm:gap-1.5'}>
      <dt className="text-[#ADB5BD] font-medium">{label}</dt>
      <dd className="text-[#495057] tabular-nums break-all">{value}</dd>
    </div>
  );
}
