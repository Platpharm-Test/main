import { useEffect, useState, type ReactNode } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { ArrowLeft, Search } from 'lucide-react';
import { PageShell } from '../components/PageShell';
import { useDeliveryAddress, type DeliveryAddress } from '../lib/addressContext';
import { usePostcode } from '../lib/postcodeContext';

const DRAFT_KEY = 'platpharm:deliveryAddress:formDraft';

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

const EMPTY_FORM: Omit<DeliveryAddress, 'id'> = {
  name: '', recipient: '', phone: '', zip: '', line1: '', line2: '',
};

export default function AddressFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { addresses, addAddress, updateAddress, selectAddress } = useDeliveryAddress();
  const { pendingResult, setPendingResult } = usePostcode();

  const editing = id && id !== 'new';
  const existing = editing ? addresses.find((a) => a.id === id) : null;

  const [form, setForm] = useState<Omit<DeliveryAddress, 'id'>>(() => {
    if (typeof window === 'undefined') return existing ?? EMPTY_FORM;
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw);
        if (draft.__id === (id ?? 'new')) return draft.form;
      }
    } catch {}
    return existing ? { ...existing } : EMPTY_FORM;
  });

  useEffect(() => {
    if (pendingResult) {
      setForm((prev) => ({
        ...prev,
        zip: pendingResult.zonecode,
        line1: pendingResult.roadAddress || pendingResult.jibunAddress || pendingResult.address,
        line2: '',
      }));
      setPendingResult(null);
    }
  }, [pendingResult, setPendingResult]);

  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ __id: id ?? 'new', form }));
    } catch {}
  }, [form, id]);

  const update = <K extends keyof Omit<DeliveryAddress, 'id'>>(key: K, value: Omit<DeliveryAddress, 'id'>[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const canSave = !!form.recipient && !!form.phone && !!form.zip && !!form.line1;

  const handleSave = () => {
    if (!canSave) return;
    if (existing) {
      updateAddress(existing.id, form);
    } else {
      const created = addAddress(form);
      selectAddress(created.id);
    }
    try { sessionStorage.removeItem(DRAFT_KEY); } catch {}
    navigate(-1);
  };

  const handleCancel = () => {
    try { sessionStorage.removeItem(DRAFT_KEY); } catch {}
    navigate(-1);
  };

  return (
    <PageShell
      title={editing ? '배송지 수정' : '배송지 추가'}
      description="받는 분 정보와 배송 주소를 입력해 주세요."
      actions={(
        <button onClick={handleCancel} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#DEE2E6] bg-white text-xs font-semibold text-[#495057] hover:border-[#4E7FFF] hover:text-[#4E7FFF] cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.5} /> 돌아가기
        </button>
      )}
    >
      <div className="max-w-[720px] mx-auto space-y-4">
        <section className="rounded-2xl border border-[#E9ECEF] bg-white p-6">
          <h2 className="text-base font-bold text-[#212529] mb-5">수령인 정보</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="약국명 / 장소">
              <Input value={form.name} onChange={(v) => update('name', v)} placeholder="예) 서울연세약국" />
            </Field>
            <Field label="수령인" required>
              <Input value={form.recipient} onChange={(v) => update('recipient', v)} placeholder="받는 분" />
            </Field>
            <Field label="연락처" required>
              <Input value={form.phone} onChange={(v) => update('phone', formatPhone(v))} placeholder="010-0000-0000" />
            </Field>
          </div>
        </section>

        <section className="rounded-2xl border border-[#E9ECEF] bg-white p-6">
          <h2 className="text-base font-bold text-[#212529] mb-5">배송 주소</h2>
          <Field label="주소" required>
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
              <Input value={form.line1} onChange={(v) => update('line1', v)} placeholder="기본 주소 (주소 찾기로 자동 입력)" />
            </div>
            <div className="mt-2">
              <Input value={form.line2} onChange={(v) => update('line2', v)} placeholder="상세 주소" />
            </div>
          </Field>
        </section>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="flex-1 h-12 rounded-xl bg-[#4E7FFF] hover:bg-[#3D6FEF] disabled:bg-[#CED4DA] disabled:cursor-not-allowed text-white text-sm font-bold cursor-pointer transition-colors"
          >
            {editing ? '수정 저장' : '배송지 추가'}
          </button>
          <button
            onClick={handleCancel}
            className="h-12 px-5 rounded-xl border border-[#DEE2E6] bg-white hover:border-[#4E7FFF] hover:text-[#4E7FFF] text-sm font-semibold text-[#495057] cursor-pointer transition-colors"
          >
            취소
          </button>
        </div>
      </div>
    </PageShell>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-xs font-semibold text-[#495057]">{label}</span>
        {required && <span className="text-[#FA5252] text-xs">*</span>}
      </div>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-11 px-3.5 rounded-xl border border-[#DEE2E6] text-sm text-[#212529] outline-none focus:border-[#4E7FFF] focus:ring-4 focus:ring-[#4E7FFF]/10 transition-all"
    />
  );
}
