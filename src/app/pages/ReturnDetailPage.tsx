import { type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Package } from 'lucide-react';
import { PageShell } from '../components/PageShell';
import { ProductImage } from '../components/products/ProductImage';
import { useReturns } from '../lib/returnsContext';
import { PRODUCTS } from '../lib/products';

export default function ReturnDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { requests } = useReturns();
  const record = requests.find((r) => r.id === id);

  if (!record) {
    return (
      <PageShell title="반품 신청을 찾을 수 없습니다.">
        <button onClick={() => navigate('/returns')} className="text-sm text-[#4E7FFF] hover:underline cursor-pointer">← 반품 신청으로</button>
      </PageShell>
    );
  }

  const product = record.productId ? PRODUCTS.find((p) => p.id === record.productId) : undefined;
  const statusClass =
    record.status === '환불완료' ? 'bg-[#EDF2FF] text-[#4E7FFF]'
    : record.status === '승인' ? 'bg-[#E7F5FF] text-[#1971C2]'
    : record.status === '반려' ? 'bg-[#FFE3E3] text-[#C92A2A]'
    : 'bg-[#FFF4E6] text-[#E67700]';

  return (
    <PageShell
      title="반품 상세"
      description={`${record.product} · ${record.requestedAt} 접수 건의 상세 내역입니다.`}
      actions={(
        <button onClick={() => navigate('/returns')} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#DEE2E6] bg-white text-xs font-semibold text-[#495057] hover:border-[#4E7FFF] hover:text-[#4E7FFF] cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.5} /> 목록으로
        </button>
      )}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] items-start gap-6 max-w-[1100px] mx-auto">
        {/* 좌측 본문 */}
        <div className="space-y-4">
          {/* 반품 정보 카드 */}
          <section className="rounded-2xl border border-[#E9ECEF] bg-white p-6">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3 min-w-0">
                {product ? (
                  <ProductImage form={product.form} category={product.category} name={product.name} code={product.code} image={product.image} size="sm" />
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-[#F1F3F5] flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-[#495057]" strokeWidth={2} />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-base font-bold text-[#212529] truncate">{record.product}</p>
                  <p className="text-[11px] text-[#868E96] tabular-nums">{record.supplier} · {record.orderId}</p>
                </div>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md shrink-0 ${statusClass}`}>{record.status}</span>
            </div>
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <DlCard label="신청번호" value={record.id} mono />
              <DlCard label="신청일" value={record.requestedAt} />
              <DlCard label="반품 사유" value={record.reason} />
              <DlCard label="반품 수량" value={`${record.qty}개`} />
            </dl>
          </section>

          {/* 상세 사유 */}
          <Section title="상세 사유">
            {record.note ? (
              <p className="text-sm text-[#495057] leading-relaxed whitespace-pre-wrap">{record.note}</p>
            ) : (
              <p className="text-sm text-[#ADB5BD]">입력한 상세 사유가 없습니다.</p>
            )}
          </Section>

          {/* 검토 결과 (승인/반려/환불완료일 때만) */}
          {(record.status === '승인' || record.status === '반려' || record.status === '환불완료') && (
            <Section title="제약사 검토 결과">
              <dl className="space-y-2.5 mb-3 text-sm">
                <FormRow label="검토일" value={record.reviewedAt ?? '—'} />
                <FormRow label="처리 상태" value={record.status} />
              </dl>
              {record.reviewMemo && (
                <div className="rounded-xl bg-[#F8F9FA] px-4 py-3">
                  <p className="text-[11px] font-bold text-[#868E96] mb-1">검토 메모</p>
                  <p className="text-sm text-[#495057] leading-relaxed whitespace-pre-wrap">{record.reviewMemo}</p>
                </div>
              )}
            </Section>
          )}
        </div>

        {/* 우측 요약 패널 */}
        <aside className="lg:sticky lg:top-20 h-fit space-y-3">
          {/* 진행 상태 */}
          <div className="rounded-2xl border border-[#E9ECEF] bg-white p-5">
            <p className="text-[11px] font-bold text-[#868E96] uppercase tracking-wide mb-3">진행 상태</p>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-[#212529]">{record.status}</span>
              <span className="text-[11px] text-[#868E96] tabular-nums">{record.reviewedAt ?? record.requestedAt}</span>
            </div>
            <p className="text-[11px] text-[#868E96] leading-relaxed">
              {record.status === '접수' && '제약사가 반품 신청 내용을 검토 중입니다. 보통 1~3영업일 내 결과가 나옵니다.'}
              {record.status === '승인' && '반품이 승인되었습니다. 수거 일정에 맞춰 상품을 준비해 주세요.'}
              {record.status === '반려' && '반품이 반려되었습니다. 사유를 확인해 주세요.'}
              {record.status === '환불완료' && '반품 및 환불 처리가 완료되었습니다.'}
            </p>
          </div>

          {/* 환불 요약 */}
          <div className="rounded-2xl border border-[#E9ECEF] bg-white p-5">
            <p className="text-[11px] font-bold text-[#868E96] uppercase tracking-wide mb-3">환불 요약</p>
            <dl className="space-y-2 text-sm">
              {record.unitPrice !== undefined && (
                <div className="flex justify-between"><dt className="text-[#868E96]">구매 단가</dt><dd className="tabular-nums text-[#212529]">₩{record.unitPrice.toLocaleString()}</dd></div>
              )}
              <div className="flex justify-between"><dt className="text-[#868E96]">반품 수량</dt><dd className="tabular-nums text-[#212529]">{record.qty}개</dd></div>
            </dl>
            <div className="border-t border-[#F1F3F5] my-3" />
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-[#212529]">{record.status === '환불완료' ? '환불 완료 금액' : '예상 환불액'}</span>
              <span className="text-lg font-bold tabular-nums text-[#4E7FFF]">₩{record.refundAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* 액션 */}
          <div className="rounded-2xl border border-[#E9ECEF] bg-white p-5 space-y-2">
            {product && (
              <button
                onClick={() => navigate(`/products/${product.id}`)}
                className="w-full h-11 rounded-xl border border-[#DEE2E6] bg-white hover:border-[#4E7FFF] hover:text-[#4E7FFF] text-sm font-semibold text-[#495057] cursor-pointer transition-colors"
              >
                상품 상세 보기
              </button>
            )}
            <button
              onClick={() => navigate(`/orders/${record.orderId}`)}
              className="w-full h-11 rounded-xl border border-[#DEE2E6] bg-white hover:border-[#4E7FFF] hover:text-[#4E7FFF] text-sm font-semibold text-[#495057] cursor-pointer transition-colors"
            >
              주문 내역 보기
            </button>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#E9ECEF] bg-white p-6">
      <h2 className="text-base font-bold text-[#212529] mb-4">{title}</h2>
      {children}
    </section>
  );
}

function DlCard({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-xl bg-[#F8F9FA] px-3 py-2.5">
      <dt className="text-[10px] font-semibold text-[#868E96] mb-0.5">{label}</dt>
      <dd className={`text-xs font-semibold text-[#212529] ${mono ? 'font-mono tabular-nums' : ''} truncate`}>{value}</dd>
    </div>
  );
}

function FormRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-[#868E96]">{label}</span>
      <span className="text-sm text-[#212529]">{value}</span>
    </div>
  );
}
