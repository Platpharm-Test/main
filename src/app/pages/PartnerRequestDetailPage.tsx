import { type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Building2, Check } from 'lucide-react';
import { PageShell } from '../components/PageShell';
import { usePartners } from '../lib/partnersContext';

export default function PartnerRequestDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { requests, cancelRequest } = usePartners();
  const request = requests.find((r) => r.id === id);

  if (!request) {
    return (
      <PageShell title="신청 내역을 찾을 수 없습니다.">
        <button onClick={() => navigate('/partners/requests')} className="text-sm text-[#4E7FFF] hover:underline cursor-pointer">← 거래 신청 내역으로</button>
      </PageShell>
    );
  }

  const form = request.form;
  const statusStyle =
    request.status === '대기' ? 'bg-[#FFF4E6] text-[#E67700]'
    : request.status === '승인' ? 'bg-[#EDF2FF] text-[#4E7FFF]'
    : 'bg-[#FFE3E3] text-[#C92A2A]';

  const handleCancel = () => {
    if (!window.confirm(`${request.supplier} 거래 신청을 취소하시겠습니까?`)) return;
    cancelRequest(request.id);
    navigate('/partners/requests');
  };

  return (
    <PageShell
      title="거래 신청 상세"
      description={`${request.supplier}에 ${request.requestedAt}에 제출한 신청 내용입니다.`}
      actions={(
        <button onClick={() => navigate('/partners/requests')} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#DEE2E6] bg-white text-xs font-semibold text-[#495057] hover:border-[#4E7FFF] hover:text-[#4E7FFF] cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.5} /> 목록으로
        </button>
      )}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] items-start gap-6 max-w-[1100px] mx-auto">
        {/* 좌측 본문 */}
        <div className="space-y-4">
          {/* 요약 */}
          <section className="rounded-2xl border border-[#E9ECEF] bg-white p-6">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-[#F1F3F5] flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-[#495057]" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <p className="text-base font-bold text-[#212529]">{request.supplier}</p>
                  <p className="text-[11px] text-[#868E96] tabular-nums">{request.bizNumber} · {request.contact}</p>
                </div>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md shrink-0 ${statusStyle}`}>{request.status}</span>
            </div>
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <DlCard label="신청번호" value={request.id} mono />
              <DlCard label="신청일" value={request.requestedAt} />
              <DlCard label="검토 상태" value={request.status} />
              <DlCard label="담당자 연락" value={form?.receiverPhone ?? '—'} />
            </dl>
          </section>

          {form ? (
            <>
              <FormSection title="약국 정보">
                <FormRow label="약국명" value={form.pharmacyName} />
                <FormRow label="사업자등록번호" value={form.bizNumber} mono />
                <FormRow label="대표 약사" value={form.representative} />
                <FormRow label="약사면허번호" value={form.pharmacistLicense} />
                <FormRow label="전화번호" value={form.phone} mono />
                {form.fax && <FormRow label="팩스" value={form.fax} mono />}
                {form.email && <FormRow label="이메일" value={form.email} />}
                <FormRow label="주소" value={form.address} />
              </FormSection>

              <FormSection title="거래 조건">
                <FormRow label="희망 품목군" value={form.itemGroups.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {form.itemGroups.map((g) => (
                      <span key={g} className="inline-flex items-center gap-1 h-7 px-2.5 rounded-full bg-[#F1F3F5] text-xs font-semibold text-[#495057]">
                        <Check className="w-3 h-3 text-[#4E7FFF]" strokeWidth={3} />
                        {g}
                      </span>
                    ))}
                  </div>
                ) : '—'} />
                <FormRow label="월 예상 주문액" value={form.volume || '—'} />
                <FormRow label="희망 배송 주기" value={form.frequency || '—'} />
                <FormRow label="희망 결제 조건" value={form.paymentTerm || '—'} />
              </FormSection>

              <FormSection title="주문 수령 담당자">
                <FormRow label="담당자명" value={form.receiver} />
                <FormRow label="담당자 연락처" value={form.receiverPhone} mono />
              </FormSection>

              {form.note && (
                <FormSection title="요청사항">
                  <p className="text-sm text-[#495057] leading-relaxed whitespace-pre-wrap">{form.note}</p>
                </FormSection>
              )}
            </>
          ) : (
            <section className="rounded-2xl border border-[#E9ECEF] bg-white p-6">
              <h2 className="text-base font-bold text-[#212529] mb-3">제출 요약</h2>
              <p className="text-sm text-[#495057] leading-relaxed">{request.memo || '제출된 세부 정보가 없습니다.'}</p>
            </section>
          )}

          {request.reviewMemo && (
            <FormSection title="검토 의견">
              <p className="text-sm text-[#495057] leading-relaxed whitespace-pre-wrap">{request.reviewMemo}</p>
            </FormSection>
          )}
        </div>

        {/* 우측 요약/액션 */}
        <aside className="lg:sticky lg:top-20 h-fit space-y-3">
          <div className="rounded-2xl border border-[#E9ECEF] bg-white p-5">
            <p className="text-[11px] font-bold text-[#868E96] uppercase tracking-wide mb-3">진행 상태</p>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-[#212529]">{request.status}</span>
              <span className="text-[11px] text-[#868E96] tabular-nums">{request.requestedAt}</span>
            </div>
            <p className="text-[11px] text-[#868E96] leading-relaxed">
              {request.status === '대기' && '제약사가 신청 내용을 검토 중입니다. 보통 1~3영업일 내 결과가 나옵니다.'}
              {request.status === '승인' && '거래가 승인되었습니다. 이제 브랜드관에서 상품을 주문할 수 있습니다.'}
              {request.status === '반려' && '신청이 반려되었습니다. 사유를 확인한 뒤 필요한 경우 재신청할 수 있습니다.'}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E9ECEF] bg-white p-5 space-y-2">
            <button
              onClick={() => navigate(`/partners/${request.supplierId}`)}
              className="w-full h-11 rounded-xl border border-[#DEE2E6] bg-white hover:border-[#4E7FFF] hover:text-[#4E7FFF] text-sm font-semibold text-[#495057] cursor-pointer transition-colors"
            >
              제약사 브랜드관 보기
            </button>
            {request.status === '대기' && (
              <button
                onClick={handleCancel}
                className="w-full h-11 rounded-xl border border-[#DEE2E6] bg-white hover:border-[#4E7FFF] hover:text-[#4E7FFF] text-sm font-semibold text-[#495057] cursor-pointer transition-colors"
              >
                신청 취소
              </button>
            )}
            {request.status === '반려' && (
              <button
                onClick={() => navigate(`/partners/${request.supplierId}/apply`)}
                className="w-full h-11 rounded-xl bg-[#4E7FFF] hover:bg-[#3D6FEF] text-white text-sm font-bold cursor-pointer transition-colors"
              >
                다시 신청하기
              </button>
            )}
          </div>
        </aside>
      </div>
    </PageShell>
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

function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#E9ECEF] bg-white p-6">
      <h2 className="text-base font-bold text-[#212529] mb-4">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function FormRow({ label, value, mono }: { label: string; value: ReactNode; mono?: boolean }) {
  return (
    <div className="grid grid-cols-[120px_1fr] items-start gap-3">
      <span className="text-xs text-[#868E96] pt-0.5">{label}</span>
      {typeof value === 'string' ? (
        <span className={`text-sm text-[#212529] ${mono ? 'font-mono tabular-nums' : ''}`}>{value || '—'}</span>
      ) : (
        <div>{value}</div>
      )}
    </div>
  );
}
