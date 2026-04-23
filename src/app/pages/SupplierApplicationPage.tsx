import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { ArrowLeft, Building2, Check, ChevronDown, Search } from 'lucide-react';
import { usePostcode } from '../lib/postcodeContext';
import { PageShell } from '../components/PageShell';
import { getSupplier } from '../lib/partners';
import { usePartners } from '../lib/partnersContext';

// 기본 약국 정보
const DEFAULT_PHARMACY = {
  name: '서울연세약국',
  bizNumber: '123-45-67890',
  representative: '김민수',
  pharmacistLicense: '약-54321',
  phone: '02-700-1234',
  fax: '02-700-1235',
  email: 'pharmacy@example.com',
  zip: '03161',
  addressLine1: '서울특별시 종로구 종로 1길 50',
  addressLine2: '연세빌딩 3층',
};

function formatBizNumber(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
}

function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 11);
  if (!d) return '';
  const seoul = d.startsWith('02');
  const areaEnd = seoul ? 2 : 3;
  if (d.length <= areaEnd) return d;
  const area = d.slice(0, areaEnd);
  const rest = d.slice(areaEnd);
  if (rest.length <= 6) return `${area}-${rest}`;
  const middle = rest.slice(0, rest.length - 4);
  const last = rest.slice(-4);
  return `${area}-${middle}-${last}`;
}

const ITEM_GROUPS = [
  '일반의약품 (OTC)',
  '건강기능식품',
  '의약외품',
  '외용제',
  '의료기기',
  '반창고·밴드·파스',
  '구강·치아용품',
];

const VOLUME_OPTIONS = [
  { id: 'lt50', label: '50만원 미만' },
  { id: '50-200', label: '50~200만원' },
  { id: '200-500', label: '200~500만원' },
  { id: '500-1000', label: '500~1,000만원' },
  { id: 'gt1000', label: '1,000만원 이상' },
];

const FREQUENCY_OPTIONS = ['매일', '주 2~3회', '주 1회', '격주', '월 1회'];
const PAYMENT_TERMS = ['월말 30일', '월말 60일', '익월 15일', '선결제', '세금계산서 (월말 마감)'];

interface FormState {
  pharmacyName: string;
  bizNumber: string;
  representative: string;
  pharmacistLicense: string;
  phone: string;
  fax: string;
  email: string;
  zip: string;
  addressLine1: string;
  addressLine2: string;
  itemGroups: string[];
  volumeId: string;
  frequency: string;
  paymentTerm: string;
  receiver: string;
  receiverPhone: string;
  memo: string;
  agreeTos: boolean;
  agreePrivacy: boolean;
}

const INITIAL: FormState = {
  pharmacyName: DEFAULT_PHARMACY.name,
  bizNumber: DEFAULT_PHARMACY.bizNumber,
  representative: DEFAULT_PHARMACY.representative,
  pharmacistLicense: DEFAULT_PHARMACY.pharmacistLicense,
  phone: DEFAULT_PHARMACY.phone,
  fax: DEFAULT_PHARMACY.fax,
  email: DEFAULT_PHARMACY.email,
  zip: DEFAULT_PHARMACY.zip,
  addressLine1: DEFAULT_PHARMACY.addressLine1,
  addressLine2: DEFAULT_PHARMACY.addressLine2,
  itemGroups: [],
  volumeId: '',
  frequency: '',
  paymentTerm: '',
  receiver: DEFAULT_PHARMACY.representative,
  receiverPhone: DEFAULT_PHARMACY.phone,
  memo: '',
  agreeTos: false,
  agreePrivacy: false,
};

export default function SupplierApplicationPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const supplier = getSupplier(id);
  const { addRequest, getTradeStatus } = usePartners();

  const { pendingResult, setPendingResult } = usePostcode();

  const draftKey = useMemo(() => `platpharm:supplierApp:${id}`, [id]);

  const [form, setForm] = useState<FormState>(() => {
    if (typeof window === 'undefined') return INITIAL;
    try {
      const raw = sessionStorage.getItem(draftKey);
      return raw ? { ...INITIAL, ...JSON.parse(raw) } : INITIAL;
    } catch {
      return INITIAL;
    }
  });
  const [submitting, setSubmitting] = useState(false);

  // 주소 찾기 결과 반영
  useEffect(() => {
    if (pendingResult) {
      setForm((prev) => ({
        ...prev,
        zip: pendingResult.zonecode,
        addressLine1: pendingResult.roadAddress || pendingResult.jibunAddress || pendingResult.address,
      }));
      setPendingResult(null);
    }
  }, [pendingResult, setPendingResult]);

  // draft 저장 (주소 찾기 왕복 중 상태 유지)
  useEffect(() => {
    try { sessionStorage.setItem(draftKey, JSON.stringify(form)); } catch {}
  }, [form, draftKey]);

  if (!supplier) {
    return (
      <PageShell title="제약사를 찾을 수 없습니다.">
        <button onClick={() => navigate('/partners')} className="text-sm text-[#4E7FFF] hover:underline cursor-pointer">← 제약사 목록으로</button>
      </PageShell>
    );
  }

  const tradeStatus = getTradeStatus(supplier.id);
  const alreadyApplied = tradeStatus === '신청중' || tradeStatus === '거래중';

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const toggleItem = (item: string) => {
    setForm((f) => {
      const exists = f.itemGroups.includes(item);
      return { ...f, itemGroups: exists ? f.itemGroups.filter((x) => x !== item) : [...f.itemGroups, item] };
    });
  };

  const completed = {
    pharmacy: !!form.pharmacyName && !!form.bizNumber && !!form.representative && !!form.pharmacistLicense && !!form.phone && !!form.zip && !!form.addressLine1,
    terms: form.itemGroups.length > 0 && !!form.volumeId && !!form.frequency && !!form.paymentTerm,
    receiver: !!form.receiver && !!form.receiverPhone,
    agree: form.agreeTos && form.agreePrivacy,
  };
  const canSubmit = completed.pharmacy && completed.terms && completed.receiver && completed.agree;
  const completedCount = Object.values(completed).filter(Boolean).length;

  const handleSubmit = () => {
    if (!canSubmit || submitting || alreadyApplied) return;
    setSubmitting(true);
    const volumeLabel = VOLUME_OPTIONS.find((v) => v.id === form.volumeId)?.label ?? form.volumeId;
    const summary = [
      `희망 품목: ${form.itemGroups.join(', ')}`,
      `월 예상 주문액: ${volumeLabel}`,
      `배송 주기: ${form.frequency}`,
      `결제 조건: ${form.paymentTerm}`,
      form.memo && `요청: ${form.memo}`,
    ].filter(Boolean).join(' · ');
    addRequest({
      supplierId: supplier.id,
      memo: summary,
      form: {
        pharmacyName: form.pharmacyName,
        bizNumber: form.bizNumber,
        representative: form.representative,
        pharmacistLicense: form.pharmacistLicense,
        phone: form.phone,
        fax: form.fax,
        email: form.email,
        address: `(${form.zip}) ${form.addressLine1} ${form.addressLine2}`.trim(),
        itemGroups: form.itemGroups,
        volume: volumeLabel,
        frequency: form.frequency,
        paymentTerm: form.paymentTerm,
        receiver: form.receiver,
        receiverPhone: form.receiverPhone,
        note: form.memo,
      },
    });
    try { sessionStorage.removeItem(draftKey); } catch {}
    navigate('/partners/requests', { state: { justApplied: supplier.id } });
  };

  const submitLabel = submitting ? '제출 중…' : alreadyApplied ? '이미 신청됨' : canSubmit ? '거래 신청 제출하기' : '모든 필수 항목 입력';

  return (
    <PageShell
      title="거래 신청"
      actions={(
        <button onClick={() => navigate(`/partners/${supplier.id}`)} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#DEE2E6] bg-white text-xs font-semibold text-[#495057] hover:border-[#4E7FFF] hover:text-[#4E7FFF] cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.5} /> 브랜드관
        </button>
      )}
    >
      {/* 모바일: 대상 제약사 요약 카드 (상단 노출) */}
      <div className="lg:hidden mb-4 rounded-xl border border-[#E9ECEF] bg-gradient-to-br from-[#F8F9FC] to-white p-4">
        <p className="text-[10px] font-bold text-[#868E96] uppercase tracking-wide mb-2">거래 신청 대상</p>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#E9ECEF] flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-[#4E7FFF]" strokeWidth={1.8} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-[#212529] truncate">{supplier.name}</p>
            <p className="text-[11px] text-[#868E96] tabular-nums">{supplier.bizNumber}</p>
          </div>
        </div>
        {/* 모바일 진행 바 */}
        <div className="mt-3 flex items-center gap-2.5">
          <div className="flex-1 h-1.5 bg-[#F1F3F5] rounded-full overflow-hidden">
            <div className="h-full bg-[#4E7FFF] transition-all" style={{ width: `${(completedCount / 4) * 100}%` }} />
          </div>
          <span className="text-[11px] font-bold text-[#4E7FFF] tabular-nums shrink-0">{completedCount}/4</span>
        </div>
      </div>

      {alreadyApplied && (
        <div className="mb-4 sm:mb-5 rounded-xl border border-[#FFE8CC] bg-[#FFF8F0] px-4 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm text-[#864C00] flex items-start gap-3">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#E67700] text-white shrink-0 mt-0.5">
            <Check className="w-3.5 h-3.5" strokeWidth={3} />
          </span>
          <span>이미 이 제약사와 거래 신청이 진행 중이거나 승인되어 있습니다. <button onClick={() => navigate('/partners/requests')} className="underline font-semibold cursor-pointer">신청 내역 보기</button></span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 lg:gap-6 pb-24 lg:pb-0">
        <div className="space-y-5">
          <Section step="01" title="약국 정보" hint="제약사가 사업자 및 약국 검증에 활용합니다.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="약국명" required>
                <Input value={form.pharmacyName} onChange={(v) => update('pharmacyName', v)} />
              </Field>
              <Field label="사업자등록번호" required>
                <Input value={form.bizNumber} onChange={(v) => update('bizNumber', formatBizNumber(v))} placeholder="000-00-00000" />
              </Field>
              <Field label="대표 약사명" required>
                <Input value={form.representative} onChange={(v) => update('representative', v)} />
              </Field>
              <Field label="약사면허번호" required>
                <Input value={form.pharmacistLicense} onChange={(v) => update('pharmacistLicense', v)} />
              </Field>
              <Field label="이메일">
                <Input value={form.email} onChange={(v) => update('email', v)} placeholder="pharmacy@example.com" type="email" />
              </Field>
              <Field label="전화번호" required>
                <Input value={form.phone} onChange={(v) => update('phone', formatPhone(v))} placeholder="02-0000-0000" />
              </Field>
              <Field label="팩스">
                <Input value={form.fax} onChange={(v) => update('fax', formatPhone(v))} placeholder="02-0000-0000" />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="약국 주소" required>
                <div className="flex items-center gap-2">
                  <Input value={form.zip} onChange={(v) => update('zip', v)} placeholder="우편번호" />
                  <button
                    type="button"
                    onClick={() => navigate('/postcode', { state: { returnTo: location.pathname } })}
                    className="h-11 px-4 rounded-xl border border-[#DEE2E6] bg-white hover:border-[#4E7FFF] hover:text-[#4E7FFF] text-xs font-semibold text-[#495057] whitespace-nowrap cursor-pointer inline-flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <Search className="w-3.5 h-3.5" strokeWidth={2.5} />
                    주소 찾기
                  </button>
                </div>
                <div className="mt-2">
                  <Input value={form.addressLine1} onChange={(v) => update('addressLine1', v)} placeholder="기본 주소 (주소 찾기로 자동 입력)" />
                </div>
                <div className="mt-2">
                  <Input value={form.addressLine2} onChange={(v) => update('addressLine2', v)} placeholder="상세 주소" />
                </div>
              </Field>
            </div>
          </Section>

          <Section title="거래 조건" hint="제약사의 공급 가능 여부 검토에 사용됩니다.">
            <Field label="희망 거래 품목군" required hint="여러 개 선택 가능">
              <div className="flex flex-wrap gap-1.5">
                {ITEM_GROUPS.map((item) => (
                  <Pill key={item} active={form.itemGroups.includes(item)} onClick={() => toggleItem(item)}>
                    {form.itemGroups.includes(item) && <Check className="w-3 h-3" strokeWidth={3} />}
                    {item}
                  </Pill>
                ))}
              </div>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
              <Field label="월 예상 주문액" required>
                <Select
                  value={VOLUME_OPTIONS.find((v) => v.id === form.volumeId)?.label ?? ''}
                  placeholder="선택해주세요"
                  options={VOLUME_OPTIONS.map((v) => v.label)}
                  onChange={(label) => {
                    const match = VOLUME_OPTIONS.find((v) => v.label === label);
                    update('volumeId', match?.id ?? '');
                  }}
                />
              </Field>
              <Field label="희망 배송 주기" required>
                <Select
                  value={form.frequency}
                  placeholder="선택해주세요"
                  options={FREQUENCY_OPTIONS}
                  onChange={(v) => update('frequency', v)}
                />
              </Field>
              <Field label="희망 결제 조건" required>
                <Select
                  value={form.paymentTerm}
                  placeholder="선택해주세요"
                  options={PAYMENT_TERMS}
                  onChange={(v) => update('paymentTerm', v)}
                />
              </Field>
            </div>
          </Section>

          <Section step="03" title="주문 수령 담당자" hint="배송 및 주문 확인 시 제약사가 연락합니다.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="담당자명" required>
                <Input value={form.receiver} onChange={(v) => update('receiver', v)} />
              </Field>
              <Field label="담당자 연락처" required>
                <Input value={form.receiverPhone} onChange={(v) => update('receiverPhone', formatPhone(v))} placeholder="010-0000-0000" />
              </Field>
            </div>
          </Section>

          <Section step="04" title="요청사항" hint="전달하고 싶은 내용을 자유롭게 작성하세요. (선택)">
            <textarea
              value={form.memo}
              onChange={(e) => update('memo', e.target.value)}
              rows={4}
              placeholder="예) 기존 ○○ 제약사와 월 1,500만 거래 중, 당사 취급 주력 품목은 ..."
              className="w-full rounded-xl border border-[#DEE2E6] px-4 py-3 text-sm outline-none focus:border-[#4E7FFF] focus:ring-4 focus:ring-[#4E7FFF]/10 transition-all"
            />
          </Section>

          <Section step="05" title="약관 동의">
            <AgreeItem
              checked={form.agreeTos}
              onToggle={() => update('agreeTos', !form.agreeTos)}
              label="제약사와의 거래 약관에 동의합니다."
              detail="거래 단가·결제 조건 등은 제약사 심사 후 개별 협의로 확정됩니다."
            />
            <div className="h-px bg-[#F1F3F5] my-2" />
            <AgreeItem
              checked={form.agreePrivacy}
              onToggle={() => update('agreePrivacy', !form.agreePrivacy)}
              label="개인정보 및 사업자 정보의 제3자 제공에 동의합니다."
              detail={`신청 정보는 ${supplier.name}에만 전달되며, 검토 목적으로만 사용됩니다.`}
            />
          </Section>
        </div>

        {/* 우측 요약 패널 (데스크톱 전용) */}
        <aside className="hidden lg:block lg:sticky lg:top-20 h-fit space-y-3">
          {/* 대상 제약사 카드 */}
          <div className="rounded-2xl border border-[#E9ECEF] bg-gradient-to-br from-[#F8F9FC] to-white p-5">
            <p className="text-[11px] font-semibold text-[#868E96] uppercase tracking-wide mb-3">거래 신청 대상</p>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#E9ECEF] flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6 text-[#4E7FFF]" strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold text-[#212529] truncate">{supplier.name}</p>
                <p className="text-[11px] text-[#868E96] tabular-nums">{supplier.bizNumber}</p>
              </div>
            </div>
            <p className="text-xs text-[#495057] line-clamp-3 leading-relaxed">{supplier.description}</p>
          </div>

          {/* 진행 상태 체크리스트 */}
          <div className="rounded-2xl border border-[#E9ECEF] bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-[#495057]">작성 진행</p>
              <p className="text-xs font-bold text-[#4E7FFF] tabular-nums">{completedCount}/4</p>
            </div>
            <div className="h-1.5 bg-[#F1F3F5] rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-[#4E7FFF] transition-all"
                style={{ width: `${(completedCount / 4) * 100}%` }}
              />
            </div>
            <ul className="space-y-2">
              <CheckRow label="약국 정보" done={completed.pharmacy} />
              <CheckRow label="거래 조건" done={completed.terms} />
              <CheckRow label="수령 담당자" done={completed.receiver} />
              <CheckRow label="약관 동의" done={completed.agree} />
            </ul>
          </div>

          {/* 제출 버튼 */}
          <div className="rounded-2xl border border-[#E9ECEF] bg-white p-5">
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || submitting || alreadyApplied}
              className="w-full h-12 rounded-xl bg-[#4E7FFF] hover:bg-[#3D6FEF] disabled:bg-[#CED4DA] disabled:cursor-not-allowed text-white text-sm font-bold cursor-pointer transition-colors"
            >
              {submitLabel}
            </button>
            <p className="mt-2.5 text-[11px] text-[#ADB5BD] text-center">제출 후 제약사 검토에 1~3영업일이 소요됩니다.</p>
          </div>
        </aside>
      </div>

      {/* 모바일 하단 고정 제출 바 */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#E9ECEF] px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-[#868E96]">작성 진행</span>
          <span className="text-[11px] font-bold tabular-nums text-[#4E7FFF]">{completedCount}/4</span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || submitting || alreadyApplied}
          className="w-full h-12 rounded-xl bg-[#4E7FFF] hover:bg-[#3D6FEF] disabled:bg-[#CED4DA] disabled:cursor-not-allowed text-white text-sm font-bold cursor-pointer transition-colors"
        >
          {submitLabel}
        </button>
      </div>
    </PageShell>
  );
}

function Section({ title, hint, children }: { step?: string; title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#E9ECEF] bg-white p-4 sm:p-6">
      <header className="mb-4 sm:mb-5">
        <h2 className="text-base font-bold text-[#212529] leading-tight">{title}</h2>
        {hint && <p className="text-xs text-[#868E96] mt-1">{hint}</p>}
      </header>
      {children}
    </section>
  );
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: ReactNode }) {
  return (
    <div className="block">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-xs font-semibold text-[#495057]">{label}</span>
        {required && <span className="text-[#FA5252] text-xs">*</span>}
        {hint && <span className="text-[10px] text-[#ADB5BD] ml-1">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Select({ value, options, placeholder, onChange }: { value: string; options: string[]; placeholder: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const empty = !value;
  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full h-11 pl-3.5 pr-3 rounded-xl border text-sm text-left flex items-center justify-between cursor-pointer transition-all ${open ? 'border-[#4E7FFF] ring-4 ring-[#4E7FFF]/10' : 'border-[#DEE2E6] hover:border-[#ADB5BD]'} bg-white`}
      >
        <span className={empty ? 'text-[#ADB5BD]' : 'text-[#212529] font-medium'}>{empty ? placeholder : value}</span>
        <ChevronDown className={`w-4 h-4 text-[#868E96] transition-transform ${open ? 'rotate-180' : ''}`} strokeWidth={2.5} />
      </button>
      {open && (
        <ul className="absolute left-0 right-0 mt-1.5 z-20 rounded-xl border border-[#DEE2E6] bg-white shadow-lg py-1 max-h-72 overflow-y-auto">
          {options.map((opt) => {
            const selected = opt === value;
            return (
              <li key={opt}>
                <button
                  type="button"
                  onClick={() => { onChange(opt); setOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm text-left cursor-pointer transition-colors ${selected ? 'text-[#4E7FFF] font-semibold bg-[#F5F8FF]' : 'text-[#212529] hover:bg-[#F8F9FA]'}`}
                >
                  <span>{opt}</span>
                  {selected && <Check className="w-4 h-4 text-[#4E7FFF]" strokeWidth={3} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = 'text' }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-11 px-3.5 rounded-xl border border-[#DEE2E6] text-sm text-[#212529] outline-none focus:border-[#4E7FFF] focus:ring-4 focus:ring-[#4E7FFF]/10 transition-all"
    />
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 h-9 px-3.5 rounded-full text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap ${active ? 'bg-[#4E7FFF] text-white border border-[#4E7FFF]' : 'bg-white border border-[#DEE2E6] text-[#495057] hover:border-[#4E7FFF] hover:text-[#4E7FFF]'}`}
    >
      {children}
    </button>
  );
}

function AgreeItem({ checked, onToggle, label, detail }: { checked: boolean; onToggle: () => void; label: string; detail: string }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-start gap-3 text-left cursor-pointer py-1.5"
    >
      <span className={`mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-md border-2 transition-colors shrink-0 ${checked ? 'bg-[#4E7FFF] border-[#4E7FFF]' : 'bg-white border-[#CED4DA]'}`}>
        {checked && <Check className="w-3 h-3 text-white" strokeWidth={3.5} />}
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-[#FA5252]">필수</span>
          <span className="text-sm font-semibold text-[#212529]">{label}</span>
        </span>
        <span className="block text-[11px] text-[#868E96] mt-0.5 leading-relaxed">{detail}</span>
      </span>
    </button>
  );
}

function CheckRow({ label, done }: { label: string; done: boolean }) {
  return (
    <li className="flex items-center gap-2">
      <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full transition-colors shrink-0 ${done ? 'bg-[#4E7FFF]' : 'bg-[#E9ECEF]'}`}>
        {done && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3.5} />}
      </span>
      <span className={`text-xs ${done ? 'text-[#212529] font-semibold' : 'text-[#868E96]'}`}>{label}</span>
    </li>
  );
}
