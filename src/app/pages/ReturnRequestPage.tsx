import { useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Check, Search, X } from 'lucide-react';
import { PageShell } from '../components/PageShell';
import { ProductImage } from '../components/products/ProductImage';
import { PURCHASE_RECORDS, type ReturnRequest } from '../lib/ledger';
import { useReturns } from '../lib/returnsContext';
import { PRODUCTS } from '../lib/products';

const REASONS: ReturnRequest['reason'][] = ['파손', '오배송', '유통기한', '품질불량', '기타'];

interface ItemForm {
  qty: number;
  reason: ReturnRequest['reason'] | null;
  note: string;
}

const EMPTY_ITEM: ItemForm = { qty: 1, reason: null, note: '' };

export default function ReturnRequestPage() {
  const navigate = useNavigate();
  const { addReturn } = useReturns();

  const [query, setQuery] = useState('');
  const [forms, setForms] = useState<Record<string, ItemForm>>({});
  const [submitting, setSubmitting] = useState(false);

  const selectedIds = Object.keys(forms);
  const selectedRecords = PURCHASE_RECORDS.filter((r) => selectedIds.includes(r.id));

  const records = useMemo(() => {
    const sorted = [...PURCHASE_RECORDS].sort((a, b) => b.date.localeCompare(a.date));
    if (!query.trim()) return sorted;
    const q = query.toLowerCase();
    return sorted.filter((r) =>
      r.productName.toLowerCase().includes(q) ||
      r.productCode.toLowerCase().includes(q) ||
      r.supplier.toLowerCase().includes(q) ||
      r.orderId.toLowerCase().includes(q),
    );
  }, [query]);

  const togglePick = (id: string) => {
    setForms((prev) => {
      if (prev[id]) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: { ...EMPTY_ITEM } };
    });
  };

  const updateItem = (id: string, patch: Partial<ItemForm>) => {
    setForms((prev) => {
      const current = prev[id];
      if (!current) return prev;
      return { ...prev, [id]: { ...current, ...patch } };
    });
  };

  const removeItem = (id: string) => {
    setForms((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const allValid =
    selectedIds.length > 0 &&
    selectedRecords.every((r) => {
      const f = forms[r.id];
      return f && !!f.reason && f.qty > 0 && f.qty <= r.qty;
    });

  const totalRefund = selectedRecords.reduce((sum, r) => {
    const f = forms[r.id];
    if (!f) return sum;
    return sum + r.unitPrice * Math.min(f.qty, r.qty);
  }, 0);

  const handleSubmit = () => {
    if (!allValid || submitting) return;
    setSubmitting(true);
    selectedRecords.forEach((r) => {
      const f = forms[r.id];
      if (!f || !f.reason) return;
      const refund = r.unitPrice * Math.min(f.qty, r.qty);
      addReturn({
        orderId: r.orderId,
        supplier: r.supplier,
        product: r.productName,
        productId: r.productId,
        qty: f.qty,
        unitPrice: r.unitPrice,
        reason: f.reason,
        refundAmount: refund,
        note: f.note || undefined,
      });
    });
    navigate('/returns');
  };

  const submitLabel = submitting
    ? '제출 중…'
    : selectedIds.length === 0
    ? '제품 선택'
    : !allValid
    ? '반품 정보 입력'
    : `${selectedIds.length}건 반품 신청`;

  return (
    <PageShell
      title="반품 신청"
      actions={(
        <button onClick={() => navigate('/returns')} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#DEE2E6] bg-white text-xs font-semibold text-[#495057] hover:border-[#4E7FFF] hover:text-[#4E7FFF] cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.5} /> 목록으로
        </button>
      )}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] items-start gap-4 lg:gap-6 max-w-[1100px] mx-auto pb-24 lg:pb-0">
        {/* 좌측: 제품 선택 + 제품별 폼 */}
        <div className="space-y-4">
          <Section
            title="반품할 제품 선택"
            hint={`여러 제품을 동시에 선택할 수 있습니다. 선택됨: ${selectedIds.length}건`}
          >
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#868E96]" strokeWidth={2} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="상품명 · 코드 · 거래처 검색"
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#DEE2E6] text-sm outline-none focus:border-[#4E7FFF]"
              />
            </div>
            <div className="rounded-xl border border-[#E9ECEF] bg-white divide-y divide-[#F1F3F5] max-h-[320px] sm:max-h-[420px] overflow-y-auto">
              {records.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-[#868E96]">검색 결과가 없습니다.</div>
              ) : records.map((r) => {
                const active = !!forms[r.id];
                const prod = PRODUCTS.find((p) => p.id === r.productId);
                return (
                  <button
                    key={r.id}
                    onClick={() => togglePick(r.id)}
                    className={`w-full flex items-start gap-3 px-3 sm:px-4 py-3 text-left cursor-pointer transition-colors ${active ? 'bg-[#F5F8FF]' : 'hover:bg-[#FAFBFC]'}`}
                  >
                    <span className={`mt-1 inline-flex items-center justify-center w-4 h-4 rounded transition-colors shrink-0 ${active ? 'bg-[#4E7FFF]' : 'border-2 border-[#CED4DA] bg-white'}`}>
                      {active && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3.5} />}
                    </span>
                    {prod ? (
                      <ProductImage form={prod.form} category={prod.category} name={prod.name} code={prod.code} image={prod.image} size="sm" />
                    ) : (
                      <div className="w-10 h-10 rounded bg-[#F1F3F5] shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${active ? 'text-[#4E7FFF]' : 'text-[#212529]'}`}>{r.productName}</p>
                      <p className="text-[11px] text-[#868E96] tabular-nums truncate">{r.supplier} · {r.productCode}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#495057] tabular-nums">
                        <span>{r.date}</span>
                        <span className="w-px h-3 bg-[#DEE2E6]" />
                        <span>{r.qty}개</span>
                        <span className="w-px h-3 bg-[#DEE2E6]" />
                        <span>₩{r.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Section>

          {/* 제품별 반품 정보 카드 리스트 */}
          {selectedIds.length === 0 ? (
            <Section title="반품 정보" hint="먼저 반품할 제품을 선택해 주세요.">
              <div className="py-6 text-center text-sm text-[#ADB5BD]">선택된 제품이 없습니다.</div>
            </Section>
          ) : (
            selectedRecords.map((r, idx) => {
              const f = forms[r.id];
              const prod = PRODUCTS.find((p) => p.id === r.productId);
              return (
                <section key={r.id} className="rounded-2xl border border-[#E9ECEF] bg-white p-4 sm:p-6">
                  <header className="flex items-start justify-between gap-2 mb-4 sm:mb-5">
                    <div className="flex items-start gap-2.5 sm:gap-3 min-w-0 flex-1">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#EDF2FF] text-[#4E7FFF] text-xs font-bold tabular-nums shrink-0 mt-0.5">{idx + 1}</span>
                      {prod ? (
                        <ProductImage form={prod.form} category={prod.category} name={prod.name} code={prod.code} image={prod.image} size="sm" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-[#F1F3F5] shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-[#212529] truncate">{r.productName}</p>
                        <p className="text-[11px] text-[#868E96] tabular-nums truncate">{r.supplier} · {r.productCode}</p>
                        <p className="text-[11px] text-[#868E96] tabular-nums">구매 {r.qty}개</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(r.id)}
                      aria-label="선택 해제"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#868E96] hover:bg-[#F1F3F5] hover:text-[#495057] cursor-pointer shrink-0 transition-colors"
                    >
                      <X className="w-4 h-4" strokeWidth={2.5} />
                    </button>
                  </header>

                  <Field label="반품 수량" required>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={f.qty}
                        onChange={(e) => {
                          const n = Number(e.target.value.replace(/[^0-9]/g, '')) || 0;
                          updateItem(r.id, { qty: Math.min(Math.max(1, n), r.qty) });
                        }}
                        className="w-24 sm:w-28 h-11 px-3 rounded-xl border border-[#DEE2E6] text-sm text-center tabular-nums outline-none focus:border-[#4E7FFF] focus:ring-4 focus:ring-[#4E7FFF]/10 transition-all"
                      />
                      <span className="text-xs text-[#868E96]">개 · 최대 <span className="font-semibold tabular-nums">{r.qty}</span>개</span>
                    </div>
                  </Field>

                  <div className="mt-4">
                    <Field label="반품 사유" required>
                      <div className="flex flex-wrap gap-1.5">
                        {REASONS.map((reason) => {
                          const active = f.reason === reason;
                          return (
                            <button
                              key={reason}
                              type="button"
                              onClick={() => updateItem(r.id, { reason })}
                              className={`inline-flex items-center gap-1 h-9 px-3.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${active ? 'bg-[#4E7FFF] text-white border border-[#4E7FFF]' : 'bg-white border border-[#DEE2E6] text-[#495057] hover:border-[#4E7FFF] hover:text-[#4E7FFF]'}`}
                            >
                              {active && <Check className="w-3 h-3" strokeWidth={3} />}
                              {reason}
                            </button>
                          );
                        })}
                      </div>
                    </Field>
                  </div>

                  <div className="mt-4">
                    <Field label="상세 사유 (선택)">
                      <textarea
                        value={f.note}
                        onChange={(e) => updateItem(r.id, { note: e.target.value })}
                        rows={2}
                        placeholder="예) 배송 중 외부 박스 파손 및 용기 균열 발견"
                        className="w-full rounded-xl border border-[#DEE2E6] px-3 py-2 text-sm outline-none focus:border-[#4E7FFF] focus:ring-4 focus:ring-[#4E7FFF]/10 transition-all"
                      />
                    </Field>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#F1F3F5] flex items-baseline justify-between">
                    <span className="text-xs text-[#868E96]">이 제품 예상 환불액</span>
                    <span className="text-sm font-bold tabular-nums text-[#4E7FFF]">₩{(r.unitPrice * Math.min(f.qty, r.qty)).toLocaleString()}</span>
                  </div>
                </section>
              );
            })
          )}
        </div>

        {/* 우측(데스크톱) 요약 */}
        <aside className="hidden lg:block lg:sticky lg:top-20 h-fit space-y-3">
          <div className="rounded-2xl border border-[#E9ECEF] bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold text-[#868E96] uppercase tracking-wide">신청 요약</p>
              <p className="text-[11px] text-[#495057] tabular-nums">{selectedIds.length}건</p>
            </div>
            {selectedRecords.length === 0 ? (
              <p className="text-xs text-[#868E96]">좌측에서 반품할 제품을 선택하세요.</p>
            ) : (
              <ul className="space-y-2.5 max-h-72 overflow-y-auto">
                {selectedRecords.map((r) => {
                  const f = forms[r.id];
                  const refund = r.unitPrice * Math.min(f.qty, r.qty);
                  return (
                    <li key={r.id} className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#212529] truncate">{r.productName}</p>
                        <p className="text-[10px] text-[#868E96] tabular-nums">{r.supplier} · {f.qty}개 × ₩{r.unitPrice.toLocaleString()}</p>
                        {!f.reason && <p className="text-[10px] text-[#FA5252] mt-0.5">사유 미선택</p>}
                      </div>
                      <p className="text-xs font-bold tabular-nums text-[#495057] shrink-0">₩{refund.toLocaleString()}</p>
                    </li>
                  );
                })}
              </ul>
            )}
            {selectedRecords.length > 0 && (
              <div className="mt-3 pt-3 border-t border-[#F1F3F5] flex items-baseline justify-between">
                <span className="text-sm font-semibold text-[#212529]">총 예상 환불액</span>
                <span className="text-lg font-bold tabular-nums text-[#4E7FFF]">₩{totalRefund.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[#E9ECEF] bg-white p-5">
            <button
              onClick={handleSubmit}
              disabled={!allValid || submitting}
              className="w-full h-12 rounded-xl bg-[#4E7FFF] hover:bg-[#3D6FEF] disabled:bg-[#CED4DA] disabled:cursor-not-allowed text-white text-sm font-bold cursor-pointer transition-colors"
            >
              {submitLabel}
            </button>
            <p className="mt-2 text-[11px] text-[#ADB5BD] text-center">제출 후 제약사 검토에 보통 1~3영업일이 소요됩니다.</p>
          </div>
        </aside>
      </div>

      {/* 모바일 하단 고정 신청 바 */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#E9ECEF] px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-[11px] text-[#868E96]">총 예상 환불액 · {selectedIds.length}건</span>
          <span className="text-base font-bold tabular-nums text-[#4E7FFF]">₩{totalRefund.toLocaleString()}</span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={!allValid || submitting}
          className="w-full h-12 rounded-xl bg-[#4E7FFF] hover:bg-[#3D6FEF] disabled:bg-[#CED4DA] disabled:cursor-not-allowed text-white text-sm font-bold cursor-pointer transition-colors"
        >
          {submitLabel}
        </button>
      </div>
    </PageShell>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#E9ECEF] bg-white p-4 sm:p-6">
      <header className="mb-4 sm:mb-5">
        <h2 className="text-base font-bold text-[#212529]">{title}</h2>
        {hint && <p className="text-xs text-[#868E96] mt-1">{hint}</p>}
      </header>
      {children}
    </section>
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
