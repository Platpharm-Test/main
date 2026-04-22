import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { Building2, Check, ChevronDown, ChevronRight, CreditCard, Wallet } from 'lucide-react';
import { PageShell } from '../components/PageShell';
import { useCart } from '../lib/cart';
import { useOrders, type Order } from '../lib/orders';
import { PRODUCTS } from '../lib/products';

type PayType = 'money' | 'card' | 'account' | 'other';

interface BankAccount {
  id: string;
  bank: string;
  masked: string;
  holder: string;
  isDefault?: boolean;
}

const REGISTERED_ACCOUNTS: BankAccount[] = [
  { id: 'ACC-001', bank: '우리은행', masked: '1005-***-123456', holder: '서울연세약국', isDefault: true },
  { id: 'ACC-002', bank: '신한은행', masked: '110-***-987654', holder: '서울연세약국' },
  { id: 'ACC-003', bank: '국민은행', masked: '817-**-0112-345', holder: '서울연세약국' },
];

const CHARGE_PRESETS = [50000, 100000, 300000, 500000, 1000000, 3000000];
const MONEY_BALANCE = 124500;

const MEMO_PRESETS = [
  '배송 메모를 선택해주세요',
  '문 앞에 놓아주세요',
  '경비실에 맡겨주세요',
  '택배함에 넣어주세요',
  '배송 전 연락 부탁드립니다',
  '직접 입력',
] as const;

const DEFAULT_ADDRESS = {
  name: '서울연세약국',
  recipient: '조정건 약사',
  phone: '010-1234-5678',
  zip: '03161',
  line1: '서울특별시 종로구 종로 1길 50',
  line2: '연세빌딩 3층',
};

const AVAILABLE_POINTS = 12450;

interface RegisteredCard {
  id: string;
  brand: string;
  label: string;
  last4: string;
  color: string;
  isDefault?: boolean;
}

const REGISTERED_CARDS: RegisteredCard[] = [
  { id: 'CARD-001', brand: '신한', label: '신한 비즈카드', last4: '1234', color: '#0046FF', isDefault: true },
  { id: 'CARD-002', brand: '삼성', label: '삼성 법인카드', last4: '5678', color: '#1428A0' },
  { id: 'CARD-003', brand: 'KB국민', label: 'KB 사업자카드', last4: '9012', color: '#FFB400' },
];

interface OtherMethod {
  id: string;
  label: string;
  detail: string;
}

const OTHER_METHODS: OtherMethod[] = [
  { id: 'credit', label: '신용카드', detail: '결제 단계에서 카드사 선택 후 결제' },
  { id: 'mobile', label: '휴대폰', detail: '통신사 소액결제 · 한도 내 결제' },
  { id: 'virtual', label: '무통장입금', detail: '가상계좌 발급 후 입금 · 입금 확인 시 처리' },
  { id: 'tax', label: '세금계산서', detail: '사업자 123-45-67890 · 월말 마감' },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, setCart } = useCart();
  const { addOrder } = useOrders();

  const [payType, setPayType] = useState<PayType>('money');
  const [cardId, setCardId] = useState<string>(REGISTERED_CARDS.find((c) => c.isDefault)?.id ?? REGISTERED_CARDS[0].id);
  const [cardInstallment, setCardInstallment] = useState('일시불');
  const [chargeAccountId, setChargeAccountId] = useState<string>(REGISTERED_ACCOUNTS.find((a) => a.isDefault)?.id ?? REGISTERED_ACCOUNTS[0].id);
  const [chargeAmount, setChargeAmount] = useState<number>(CHARGE_PRESETS[1]);
  const [chargeCustom, setChargeCustom] = useState('');
  const [payAccountId, setPayAccountId] = useState<string>(REGISTERED_ACCOUNTS.find((a) => a.isDefault)?.id ?? REGISTERED_ACCOUNTS[0].id);
  const [otherExpanded, setOtherExpanded] = useState(false);
  const [otherId, setOtherId] = useState<string>(OTHER_METHODS[0].id);
  const [creditForm, setCreditForm] = useState({ cardNumber: '', exp: '', cvc: '', holder: '', installment: '일시불' });
  const [mobileForm, setMobileForm] = useState({ carrier: 'SKT', phone: '', birth: '', authSent: false, authCode: '' });
  const [virtualForm, setVirtualForm] = useState({ bank: REGISTERED_ACCOUNTS[0].bank, depositor: DEFAULT_ADDRESS.name, receipt: '미신청' as '미신청' | '개인소득공제' | '사업자지출증빙', receiptId: '' });
  const [taxForm, setTaxForm] = useState({ bizNumber: '123-45-67890', companyName: DEFAULT_ADDRESS.name, ceo: DEFAULT_ADDRESS.recipient, bizType: '도매 / 의약품', bizAddress: `${DEFAULT_ADDRESS.line1} ${DEFAULT_ADDRESS.line2}`, email: 'pharmacy@example.com' });
  const [memoPreset, setMemoPreset] = useState<string>(MEMO_PRESETS[0]);
  const [memoCustom, setMemoCustom] = useState('');
  const [rememberMemo, setRememberMemo] = useState(false);
  const [usePoints, setUsePoints] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const lines = useMemo(() => Object.entries(cart)
    .map(([id, qty]) => {
      const p = PRODUCTS.find((x) => x.id === Number(id));
      return p ? { product: p, qty } : null;
    })
    .filter((x): x is { product: typeof PRODUCTS[number]; qty: number } => !!x),
  [cart]);

  const subtotal = lines.reduce((s, l) => s + l.product.unitPrice * l.product.packSize * l.qty, 0);
  const vat = Math.round(subtotal * 0.1);
  const orderAmount = subtotal + vat;
  const pointsApplied = Math.min(usePoints, AVAILABLE_POINTS, orderAmount);
  const total = Math.max(0, orderAmount - pointsApplied);

  const empty = lines.length === 0;
  const finalMemo = memoPreset === '직접 입력' ? memoCustom : (memoPreset === MEMO_PRESETS[0] ? '' : memoPreset);

  const chosenCard = REGISTERED_CARDS.find((c) => c.id === cardId) ?? REGISTERED_CARDS[0];
  const chosenChargeAccount = REGISTERED_ACCOUNTS.find((a) => a.id === chargeAccountId) ?? REGISTERED_ACCOUNTS[0];
  const chosenPayAccount = REGISTERED_ACCOUNTS.find((a) => a.id === payAccountId) ?? REGISTERED_ACCOUNTS[0];
  const chosenOther = OTHER_METHODS.find((o) => o.id === otherId) ?? OTHER_METHODS[0];
  const payLabel: Record<PayType, string> = {
    money: `머니 충전 결제 (${chosenChargeAccount.bank})`,
    card: `카드 간편결제 (${chosenCard.label}${cardInstallment === '일시불' ? '' : ` · ${cardInstallment} 할부`})`,
    account: `계좌 간편결제 (${chosenPayAccount.bank})`,
    other: chosenOther.label,
  };

  const handleSubmit = () => {
    if (empty || submitting) return;
    setSubmitting(true);
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const id = `ORD-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(Math.floor(Math.random() * 9999))}`;
    const order: Order = {
      id,
      createdAt: now.toISOString(),
      lines: lines.map(({ product, qty }) => ({
        productId: product.id,
        qty,
        unitPrice: product.unitPrice,
        packSize: product.packSize,
        name: product.name,
        supplier: product.supplier,
        code: product.code,
      })),
      total,
      paymentMethod: payLabel[payType],
      status: '상품준비중',
      paid: payType !== 'other' || (otherId !== 'tax' && otherId !== 'virtual'),
    };
    addOrder(order);
    setCart({});
    navigate('/orders', { state: { justPlaced: id, memo: finalMemo } });
  };

  return (
    <PageShell title="결제 진행" description="배송지·결제수단을 확인하고 결제를 완료하세요.">
      {empty ? (
        <div className="rounded-lg border border-[#DEE2E6] bg-white px-6 py-16 text-center">
          <p className="text-sm text-[#868E96] mb-4">결제할 상품이 없습니다.</p>
          <button onClick={() => navigate('/products')} className="h-10 px-5 rounded-lg bg-[#4E7FFF] hover:bg-[#3D6FEF] text-white text-sm font-semibold cursor-pointer">상품 보러가기</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
          <div className="space-y-4">
            {/* 1. 배송지 */}
            <section className="rounded-lg border border-[#DEE2E6] bg-white p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-[#212529]">배송지</h2>
                <button className="inline-flex items-center gap-1 h-8 px-3 rounded-lg border border-[#DEE2E6] text-xs font-semibold text-[#495057] hover:border-[#4E7FFF] hover:text-[#4E7FFF] cursor-pointer">
                  배송지 변경 <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                </button>
              </div>
              <div className="flex items-start gap-2 mb-1">
                <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#EDF2FF] text-[#4E7FFF]">기본</span>
                <p className="text-sm font-semibold text-[#212529]">{DEFAULT_ADDRESS.name}</p>
              </div>
              <p className="text-xs text-[#495057]">{DEFAULT_ADDRESS.recipient} · {DEFAULT_ADDRESS.phone}</p>
              <p className="text-xs text-[#495057] mt-0.5">({DEFAULT_ADDRESS.zip}) {DEFAULT_ADDRESS.line1}</p>
              <p className="text-xs text-[#495057]">{DEFAULT_ADDRESS.line2}</p>
            </section>

            {/* 2. 배송 메모 */}
            <section className="rounded-lg border border-[#DEE2E6] bg-white p-5">
              <h2 className="text-sm font-bold text-[#212529] mb-3">배송 메모</h2>
              <MemoDropdown value={memoPreset} options={[...MEMO_PRESETS]} onChange={setMemoPreset} placeholder={MEMO_PRESETS[0]} />
              {memoPreset === '직접 입력' && (
                <textarea
                  value={memoCustom}
                  onChange={(e) => setMemoCustom(e.target.value)}
                  rows={2}
                  placeholder="배송 요청사항을 입력하세요"
                  className="mt-2 w-full rounded-lg border border-[#DEE2E6] px-3 py-2 text-sm outline-none focus:border-[#4E7FFF]"
                />
              )}
              <label className="mt-3 flex items-center gap-2 cursor-pointer select-none">
                <span
                  onClick={() => setRememberMemo((v) => !v)}
                  className={`inline-flex items-center justify-center w-5 h-5 rounded border-2 transition-colors ${rememberMemo ? 'bg-[#4E7FFF] border-[#4E7FFF]' : 'bg-white border-[#CED4DA] hover:border-[#ADB5BD]'}`}
                >
                  {rememberMemo && <Check className="w-3 h-3 text-white" strokeWidth={3.5} />}
                </span>
                <input
                  type="checkbox"
                  checked={rememberMemo}
                  onChange={(e) => setRememberMemo(e.target.checked)}
                  className="sr-only"
                />
                <span className="text-xs text-[#495057]">기본 배송 메모로 저장</span>
              </label>
            </section>

            {/* 3. 주문상품 + 4. 총 주문금액 */}
            <section className="rounded-lg border border-[#DEE2E6] bg-white">
              <div className="flex items-center justify-between px-5 py-3 border-b border-[#F1F3F5]">
                <h2 className="text-sm font-bold text-[#212529]">주문 상품</h2>
                <span className="text-xs text-[#868E96]">{lines.length}종 · 총 {lines.reduce((s, l) => s + l.qty, 0)}개</span>
              </div>
              <ul className="divide-y divide-[#F1F3F5]">
                {lines.map(({ product, qty }) => (
                  <li key={product.id} className="px-5 py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#212529] truncate">{product.name}</p>
                      <p className="text-[11px] text-[#868E96]">{product.supplier} · {qty}개 × ₩{(product.unitPrice * product.packSize).toLocaleString()}</p>
                    </div>
                    <p className="text-sm font-bold tabular-nums text-[#212529]">₩{(product.unitPrice * product.packSize * qty).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between px-5 py-3 bg-[#F8F9FA] border-t border-[#F1F3F5]">
                <span className="text-sm font-semibold text-[#212529]">총 주문금액</span>
                <span className="text-base font-bold tabular-nums text-[#212529]">₩{orderAmount.toLocaleString()}</span>
              </div>
            </section>

            {/* 5. 사용가능한 포인트 */}
            <section className="rounded-lg border border-[#DEE2E6] bg-white p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-[#212529]">사용가능한 포인트</h2>
                <span className="text-sm font-bold tabular-nums text-[#4E7FFF]">{AVAILABLE_POINTS.toLocaleString()} P</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  value={usePoints === 0 ? '' : usePoints.toLocaleString()}
                  onChange={(e) => {
                    const raw = Number(e.target.value.replace(/[^0-9]/g, '')) || 0;
                    setUsePoints(Math.min(raw, AVAILABLE_POINTS, orderAmount));
                  }}
                  placeholder="사용할 포인트"
                  className="flex-1 h-10 px-3 rounded-lg border border-[#DEE2E6] text-sm tabular-nums outline-none focus:border-[#4E7FFF]"
                />
                <button onClick={() => setUsePoints(Math.min(AVAILABLE_POINTS, orderAmount))} className="h-10 px-4 rounded-lg border border-[#DEE2E6] text-xs font-semibold text-[#495057] hover:border-[#4E7FFF] hover:text-[#4E7FFF] cursor-pointer whitespace-nowrap">전액 사용</button>
                {usePoints > 0 && (
                  <button onClick={() => setUsePoints(0)} className="h-10 px-3 rounded-lg text-xs font-semibold text-[#868E96] hover:text-[#495057] cursor-pointer">취소</button>
                )}
              </div>
              {pointsApplied > 0 && (
                <p className="mt-2 text-[11px] text-[#4E7FFF]">₩{pointsApplied.toLocaleString()} 포인트가 결제 금액에서 차감됩니다.</p>
              )}
            </section>

            {/* 6. 결제수단 */}
            <section className="rounded-lg border border-[#DEE2E6] bg-white p-5">
              <h2 className="text-sm font-bold text-[#212529] mb-3">결제수단</h2>
              <div className="space-y-2">
                <div className="rounded-lg border border-[#DEE2E6] bg-white">
                  <button
                    onClick={() => setPayType('money')}
                    className={`w-full flex items-center justify-between text-left px-4 py-3 cursor-pointer ${payType === 'money' ? '' : 'hover:bg-[#FAFBFC] rounded-lg'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${payType === 'money' ? 'bg-[#4E7FFF] text-white' : 'bg-[#F1F3F5] text-[#495057]'}`}>
                        <Wallet className="w-4 h-4" strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#212529]">머니 충전 결제</p>
                        <p className="text-[11px] text-[#868E96]">플랫팜 머니로 결제 · 현재 잔액 ₩{MONEY_BALANCE.toLocaleString()}</p>
                      </div>
                    </div>
                    <PayRadio active={payType === 'money'} />
                  </button>
                  {payType === 'money' && (
                    <div className="px-4 pb-4 pt-1 space-y-4">
                      <div>
                        <p className="text-[11px] font-semibold text-[#495057] mb-2">충전 계좌</p>
                        <div className="space-y-1.5">
                          {REGISTERED_ACCOUNTS.map((a) => {
                            const active = a.id === chargeAccountId;
                            return (
                              <button
                                key={a.id}
                                onClick={() => setChargeAccountId(a.id)}
                                className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg border transition-colors cursor-pointer ${active ? 'border-[#4E7FFF] bg-white' : 'border-[#DEE2E6] hover:border-[#ADB5BD] bg-white'}`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-lg bg-[#F1F3F5] flex items-center justify-center">
                                    <Building2 className="w-4 h-4 text-[#495057]" strokeWidth={2.5} />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <p className="text-sm font-semibold text-[#212529]">{a.bank}</p>
                                      {a.isDefault && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#EDF2FF] text-[#4E7FFF]">기본</span>}
                                    </div>
                                    <p className="text-[11px] text-[#868E96] tabular-nums">{a.masked} · {a.holder}</p>
                                  </div>
                                </div>
                                <PayRadio active={active} />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold text-[#495057] mb-2">충전 금액</p>
                        <MemoDropdown
                          value={chargeAmount === -1 ? '직접 입력' : `₩${chargeAmount.toLocaleString()}`}
                          options={['충전 금액을 선택해주세요', ...CHARGE_PRESETS.map((n) => `₩${n.toLocaleString()}`), '직접 입력']}
                          placeholder="충전 금액을 선택해주세요"
                          onChange={(v) => {
                            if (v === '직접 입력') { setChargeAmount(-1); return; }
                            if (v === '충전 금액을 선택해주세요') { setChargeAmount(0); return; }
                            const n = Number(v.replace(/[^0-9]/g, '')) || 0;
                            setChargeAmount(n);
                          }}
                        />
                        {chargeAmount === -1 && (
                          <input
                            type="text"
                            inputMode="numeric"
                            value={chargeCustom === '' ? '' : Number(chargeCustom).toLocaleString()}
                            onChange={(e) => setChargeCustom(e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder="충전할 금액을 입력하세요"
                            className="mt-2 w-full h-11 px-3 rounded-lg border border-[#DEE2E6] text-sm tabular-nums outline-none focus:border-[#4E7FFF]"
                          />
                        )}
                        <div className="mt-2 flex items-center justify-between text-[11px]">
                          <span className="text-[#868E96]">충전 후 예상 잔액</span>
                          <span className="font-semibold text-[#4E7FFF] tabular-nums">
                            ₩{(MONEY_BALANCE + (chargeAmount === -1 ? Number(chargeCustom || 0) : chargeAmount)).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-lg border border-[#DEE2E6] bg-white">
                  <button
                    onClick={() => setPayType('card')}
                    className={`w-full flex items-center justify-between text-left px-4 py-3 cursor-pointer ${payType === 'card' ? '' : 'hover:bg-[#FAFBFC] rounded-lg'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${payType === 'card' ? 'bg-[#4E7FFF] text-white' : 'bg-[#F1F3F5] text-[#495057]'}`}>
                        <CreditCard className="w-4 h-4" strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#212529]">카드 간편결제</p>
                        <p className="text-[11px] text-[#868E96]">등록된 카드로 원클릭 결제 · {chosenCard.label}</p>
                      </div>
                    </div>
                    <PayRadio active={payType === 'card'} />
                  </button>
                  {payType === 'card' && (
                    <div className="px-4 pb-4 pt-1">
                      <p className="text-[11px] font-semibold text-[#495057] mb-2">등록된 카드</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {REGISTERED_CARDS.map((c) => {
                          const active = c.id === cardId;
                          return (
                            <button
                              key={c.id}
                              onClick={() => setCardId(c.id)}
                              className={`relative text-left p-3 rounded-lg border transition-all cursor-pointer ${active ? 'border-[#4E7FFF] ring-2 ring-[#4E7FFF]/20 bg-white' : 'border-[#DEE2E6] hover:border-[#ADB5BD] bg-white'}`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <span className="inline-block w-7 h-4 rounded-sm" style={{ background: c.color }} />
                                <span className="text-[11px] font-bold text-[#495057]">{c.brand}</span>
                                {c.isDefault && <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#EDF2FF] text-[#4E7FFF]">기본</span>}
                              </div>
                              <p className="text-xs font-semibold text-[#212529] leading-tight">{c.label}</p>
                              <p className="text-[11px] text-[#868E96] tabular-nums mt-0.5">**** {c.last4}</p>
                              {active && (
                                <Check className="absolute top-2 right-2 w-3.5 h-3.5 text-[#4E7FFF]" strokeWidth={3} />
                              )}
                            </button>
                          );
                        })}
                      </div>
                      <button onClick={() => navigate('/payments/methods')} className="mt-3 text-[11px] font-semibold text-[#4E7FFF] hover:underline cursor-pointer">+ 새 카드 등록</button>
                      <div className="mt-4 pt-4 border-t border-[#F1F3F5]">
                        <Field label="할부 개월">
                          <MemoDropdown
                            value={cardInstallment}
                            options={['일시불', '2개월', '3개월', '6개월', '12개월']}
                            onChange={setCardInstallment}
                          />
                        </Field>
                        {cardInstallment !== '일시불' && (
                          <p className="mt-1.5 text-[11px] text-[#868E96]">※ 5만원 이상 결제 시에만 할부가 적용됩니다.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-lg border border-[#DEE2E6] bg-white">
                  <button
                    onClick={() => setPayType('account')}
                    className={`w-full flex items-center justify-between text-left px-4 py-3 cursor-pointer ${payType === 'account' ? '' : 'hover:bg-[#FAFBFC] rounded-lg'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${payType === 'account' ? 'bg-[#4E7FFF] text-white' : 'bg-[#F1F3F5] text-[#495057]'}`}>
                        <Building2 className="w-4 h-4" strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#212529]">계좌 간편결제</p>
                        <p className="text-[11px] text-[#868E96]">등록된 계좌로 즉시 출금 · {chosenPayAccount.bank}</p>
                      </div>
                    </div>
                    <PayRadio active={payType === 'account'} />
                  </button>
                  {payType === 'account' && (
                    <div className="px-4 pb-4 pt-1">
                      <p className="text-[11px] font-semibold text-[#495057] mb-2">등록된 계좌</p>
                      <div className="space-y-1.5">
                        {REGISTERED_ACCOUNTS.map((a) => {
                          const active = a.id === payAccountId;
                          return (
                            <button
                              key={a.id}
                              onClick={() => setPayAccountId(a.id)}
                              className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg border transition-colors cursor-pointer ${active ? 'border-[#4E7FFF] bg-white' : 'border-[#DEE2E6] hover:border-[#ADB5BD] bg-white'}`}
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-[#F1F3F5] flex items-center justify-center">
                                  <Building2 className="w-4 h-4 text-[#495057]" strokeWidth={2.5} />
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <p className="text-sm font-semibold text-[#212529]">{a.bank}</p>
                                    {a.isDefault && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#EDF2FF] text-[#4E7FFF]">기본</span>}
                                  </div>
                                  <p className="text-[11px] text-[#868E96] tabular-nums">{a.masked} · {a.holder}</p>
                                </div>
                              </div>
                              <PayRadio active={active} />
                            </button>
                          );
                        })}
                      </div>
                      <button onClick={() => navigate('/payments/methods')} className="mt-3 text-[11px] font-semibold text-[#4E7FFF] hover:underline cursor-pointer">+ 새 계좌 등록</button>
                    </div>
                  )}
                </div>

                <div className="rounded-lg border border-[#DEE2E6] bg-white">
                  <button
                    onClick={() => setOtherExpanded((v) => !v)}
                    className={`w-full flex items-center justify-between text-left px-4 py-3 cursor-pointer ${payType === 'other' ? '' : 'hover:bg-[#FAFBFC] rounded-lg'}`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#212529]">다른 결제수단 보기</p>
                      <p className="text-[11px] text-[#868E96]">{payType === 'other' ? chosenOther.label : '세금계산서 · 현금 결제 · 포인트 전액 결제'}</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-[#868E96] transition-transform ${otherExpanded ? 'rotate-180' : ''}`} strokeWidth={2.5} />
                  </button>
                  {otherExpanded && (
                    <div className="px-4 pb-4 pt-1 space-y-2">
                      {OTHER_METHODS.map((o) => {
                        const active = payType === 'other' && o.id === otherId;
                        return (
                          <div key={o.id} className={`rounded-lg border transition-colors ${active ? 'border-[#4E7FFF] bg-white' : 'border-[#DEE2E6] bg-white'}`}>
                            <button
                              onClick={() => { setPayType('other'); setOtherId(o.id); }}
                              className={`w-full flex items-center justify-between text-left px-3 py-2.5 cursor-pointer ${active ? '' : 'hover:bg-[#FAFBFC] rounded-lg'}`}
                            >
                              <div>
                                <p className="text-sm font-semibold text-[#212529]">{o.label}</p>
                                <p className="text-[11px] text-[#868E96]">{o.detail}</p>
                              </div>
                              <PayRadio active={active} />
                            </button>
                            {active && o.id === 'credit' && (
                              <div className="px-3 pb-3 pt-1 space-y-2.5 border-t border-[#F1F3F5]">
                                <Field label="카드 번호">
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    value={creditForm.cardNumber}
                                    onChange={(e) => setCreditForm({ ...creditForm, cardNumber: e.target.value.replace(/[^0-9 ]/g, '').slice(0, 19) })}
                                    placeholder="0000 0000 0000 0000"
                                    className="w-full h-10 px-3 rounded-lg border border-[#DEE2E6] text-sm tabular-nums outline-none focus:border-[#4E7FFF]"
                                  />
                                </Field>
                                <div className="grid grid-cols-2 gap-2">
                                  <Field label="유효기간">
                                    <input
                                      type="text"
                                      inputMode="numeric"
                                      value={creditForm.exp}
                                      onChange={(e) => setCreditForm({ ...creditForm, exp: e.target.value.replace(/[^0-9/]/g, '').slice(0, 5) })}
                                      placeholder="MM/YY"
                                      className="w-full h-10 px-3 rounded-lg border border-[#DEE2E6] text-sm tabular-nums outline-none focus:border-[#4E7FFF]"
                                    />
                                  </Field>
                                  <Field label="CVC">
                                    <input
                                      type="password"
                                      inputMode="numeric"
                                      value={creditForm.cvc}
                                      onChange={(e) => setCreditForm({ ...creditForm, cvc: e.target.value.replace(/[^0-9]/g, '').slice(0, 3) })}
                                      placeholder="***"
                                      className="w-full h-10 px-3 rounded-lg border border-[#DEE2E6] text-sm tabular-nums outline-none focus:border-[#4E7FFF]"
                                    />
                                  </Field>
                                </div>
                                <Field label="카드 소유자명">
                                  <input
                                    type="text"
                                    value={creditForm.holder}
                                    onChange={(e) => setCreditForm({ ...creditForm, holder: e.target.value })}
                                    placeholder="카드 뒷면에 표시된 이름"
                                    className="w-full h-10 px-3 rounded-lg border border-[#DEE2E6] text-sm outline-none focus:border-[#4E7FFF]"
                                  />
                                </Field>
                                <Field label="할부 개월">
                                  <MemoDropdown
                                    value={creditForm.installment}
                                    options={['일시불', '2개월', '3개월', '6개월', '12개월']}
                                    onChange={(v) => setCreditForm({ ...creditForm, installment: v })}
                                  />
                                </Field>
                              </div>
                            )}
                            {active && o.id === 'mobile' && (
                              <div className="px-3 pb-3 pt-1 space-y-2.5 border-t border-[#F1F3F5]">
                                <Field label="통신사">
                                  <div className="grid grid-cols-4 gap-1.5">
                                    {['SKT', 'KT', 'LG U+', '알뜰폰'].map((c) => (
                                      <button
                                        key={c}
                                        onClick={() => setMobileForm({ ...mobileForm, carrier: c })}
                                        className={`h-9 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${mobileForm.carrier === c ? 'border-[#4E7FFF] bg-[#EDF2FF] text-[#4E7FFF]' : 'border-[#DEE2E6] bg-white text-[#495057] hover:border-[#ADB5BD]'}`}
                                      >
                                        {c}
                                      </button>
                                    ))}
                                  </div>
                                </Field>
                                <Field label="휴대폰 번호">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      inputMode="numeric"
                                      value={mobileForm.phone}
                                      onChange={(e) => setMobileForm({ ...mobileForm, phone: e.target.value.replace(/[^0-9-]/g, '').slice(0, 13) })}
                                      placeholder="010-0000-0000"
                                      className="flex-1 h-10 px-3 rounded-lg border border-[#DEE2E6] text-sm tabular-nums outline-none focus:border-[#4E7FFF]"
                                    />
                                    <button
                                      onClick={() => setMobileForm({ ...mobileForm, authSent: true })}
                                      className="h-10 px-3 rounded-lg border border-[#DEE2E6] text-xs font-semibold text-[#495057] hover:border-[#4E7FFF] hover:text-[#4E7FFF] cursor-pointer whitespace-nowrap"
                                    >
                                      {mobileForm.authSent ? '재발송' : '인증번호 발송'}
                                    </button>
                                  </div>
                                </Field>
                                <Field label="생년월일 (YYMMDD)">
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    value={mobileForm.birth}
                                    onChange={(e) => setMobileForm({ ...mobileForm, birth: e.target.value.replace(/[^0-9]/g, '').slice(0, 6) })}
                                    placeholder="주민번호 앞 6자리"
                                    className="w-full h-10 px-3 rounded-lg border border-[#DEE2E6] text-sm tabular-nums outline-none focus:border-[#4E7FFF]"
                                  />
                                </Field>
                                {mobileForm.authSent && (
                                  <Field label="인증번호">
                                    <input
                                      type="text"
                                      inputMode="numeric"
                                      value={mobileForm.authCode}
                                      onChange={(e) => setMobileForm({ ...mobileForm, authCode: e.target.value.replace(/[^0-9]/g, '').slice(0, 6) })}
                                      placeholder="문자로 받은 6자리 숫자"
                                      className="w-full h-10 px-3 rounded-lg border border-[#DEE2E6] text-sm tabular-nums outline-none focus:border-[#4E7FFF]"
                                    />
                                  </Field>
                                )}
                                <p className="text-[11px] text-[#868E96]">※ 통신사 소액결제 한도 내에서만 결제됩니다.</p>
                              </div>
                            )}
                            {active && o.id === 'virtual' && (
                              <div className="px-3 pb-3 pt-1 space-y-2.5 border-t border-[#F1F3F5]">
                                <Field label="입금 은행">
                                  <MemoDropdown
                                    value={virtualForm.bank}
                                    options={['입금할 은행을 선택해주세요', '우리은행', '신한은행', '국민은행', '하나은행', '농협은행', 'IBK기업은행', '카카오뱅크']}
                                    placeholder="입금할 은행을 선택해주세요"
                                    onChange={(v) => setVirtualForm({ ...virtualForm, bank: v })}
                                  />
                                </Field>
                                <Field label="입금자명">
                                  <input
                                    type="text"
                                    value={virtualForm.depositor}
                                    onChange={(e) => setVirtualForm({ ...virtualForm, depositor: e.target.value })}
                                    placeholder="실제 입금하시는 분 이름"
                                    className="w-full h-10 px-3 rounded-lg border border-[#DEE2E6] text-sm outline-none focus:border-[#4E7FFF]"
                                  />
                                </Field>
                                <Field label="현금영수증">
                                  <div className="grid grid-cols-3 gap-1.5">
                                    {(['미신청', '개인소득공제', '사업자지출증빙'] as const).map((opt) => (
                                      <button
                                        key={opt}
                                        onClick={() => setVirtualForm({ ...virtualForm, receipt: opt })}
                                        className={`h-9 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${virtualForm.receipt === opt ? 'border-[#4E7FFF] bg-[#EDF2FF] text-[#4E7FFF]' : 'border-[#DEE2E6] bg-white text-[#495057] hover:border-[#ADB5BD]'}`}
                                      >
                                        {opt}
                                      </button>
                                    ))}
                                  </div>
                                </Field>
                                {virtualForm.receipt !== '미신청' && (
                                  <Field label={virtualForm.receipt === '개인소득공제' ? '휴대폰 번호' : '사업자등록번호'}>
                                    <input
                                      type="text"
                                      inputMode="numeric"
                                      value={virtualForm.receiptId}
                                      onChange={(e) => setVirtualForm({ ...virtualForm, receiptId: e.target.value.replace(/[^0-9-]/g, '') })}
                                      placeholder={virtualForm.receipt === '개인소득공제' ? '010-0000-0000' : '000-00-00000'}
                                      className="w-full h-10 px-3 rounded-lg border border-[#DEE2E6] text-sm tabular-nums outline-none focus:border-[#4E7FFF]"
                                    />
                                  </Field>
                                )}
                                <p className="text-[11px] text-[#868E96]">※ 결제 완료 후 24시간 이내 입금되지 않으면 주문이 자동 취소됩니다.</p>
                              </div>
                            )}
                            {active && o.id === 'tax' && (
                              <div className="px-3 pb-3 pt-1 space-y-2.5 border-t border-[#F1F3F5]">
                                <div className="grid grid-cols-2 gap-2">
                                  <Field label="사업자등록번호">
                                    <input
                                      type="text"
                                      value={taxForm.bizNumber}
                                      onChange={(e) => setTaxForm({ ...taxForm, bizNumber: e.target.value })}
                                      placeholder="000-00-00000"
                                      className="w-full h-10 px-3 rounded-lg border border-[#DEE2E6] text-sm tabular-nums outline-none focus:border-[#4E7FFF]"
                                    />
                                  </Field>
                                  <Field label="상호명">
                                    <input
                                      type="text"
                                      value={taxForm.companyName}
                                      onChange={(e) => setTaxForm({ ...taxForm, companyName: e.target.value })}
                                      className="w-full h-10 px-3 rounded-lg border border-[#DEE2E6] text-sm outline-none focus:border-[#4E7FFF]"
                                    />
                                  </Field>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <Field label="대표자명">
                                    <input
                                      type="text"
                                      value={taxForm.ceo}
                                      onChange={(e) => setTaxForm({ ...taxForm, ceo: e.target.value })}
                                      className="w-full h-10 px-3 rounded-lg border border-[#DEE2E6] text-sm outline-none focus:border-[#4E7FFF]"
                                    />
                                  </Field>
                                  <Field label="업태 / 종목">
                                    <input
                                      type="text"
                                      value={taxForm.bizType}
                                      onChange={(e) => setTaxForm({ ...taxForm, bizType: e.target.value })}
                                      className="w-full h-10 px-3 rounded-lg border border-[#DEE2E6] text-sm outline-none focus:border-[#4E7FFF]"
                                    />
                                  </Field>
                                </div>
                                <Field label="사업장 주소">
                                  <input
                                    type="text"
                                    value={taxForm.bizAddress}
                                    onChange={(e) => setTaxForm({ ...taxForm, bizAddress: e.target.value })}
                                    className="w-full h-10 px-3 rounded-lg border border-[#DEE2E6] text-sm outline-none focus:border-[#4E7FFF]"
                                  />
                                </Field>
                                <Field label="전자세금계산서 수신 이메일">
                                  <input
                                    type="email"
                                    value={taxForm.email}
                                    onChange={(e) => setTaxForm({ ...taxForm, email: e.target.value })}
                                    placeholder="tax@company.com"
                                    className="w-full h-10 px-3 rounded-lg border border-[#DEE2E6] text-sm outline-none focus:border-[#4E7FFF]"
                                  />
                                </Field>
                                <p className="text-[11px] text-[#868E96]">※ 결제일 기준 월말 마감, 다음 달 10일 이내 전자세금계산서가 발행됩니다.</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* 오른쪽 패널 — 그대로 유지 */}
          <aside className="rounded-lg border border-[#DEE2E6] bg-white p-5 h-fit lg:sticky lg:top-20">
            <h2 className="text-sm font-bold text-[#212529] mb-3">결제 요약</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-[#868E96]">상품 합계</dt><dd className="tabular-nums text-[#212529]">₩{subtotal.toLocaleString()}</dd></div>
              <div className="flex justify-between"><dt className="text-[#868E96]">부가세 (10%)</dt><dd className="tabular-nums text-[#212529]">₩{vat.toLocaleString()}</dd></div>
              <div className="flex justify-between"><dt className="text-[#868E96]">배송비</dt><dd className="tabular-nums text-[#495057]">무료</dd></div>
              {pointsApplied > 0 && (
                <div className="flex justify-between"><dt className="text-[#868E96]">포인트 사용</dt><dd className="tabular-nums text-[#4E7FFF]">-₩{pointsApplied.toLocaleString()}</dd></div>
              )}
            </dl>
            <div className="border-t border-[#F1F3F5] my-3" />
            <div className="flex items-baseline justify-between mb-4">
              <span className="text-sm font-semibold text-[#212529]">결제 금액</span>
              <span className="text-lg font-bold tabular-nums text-[#4E7FFF]">₩{total.toLocaleString()}</span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full h-11 rounded-lg bg-[#4E7FFF] hover:bg-[#3D6FEF] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold cursor-pointer"
            >
              {submitting ? '처리 중…' : `₩${total.toLocaleString()} 결제`}
            </button>
            <button onClick={() => navigate('/cart')} className="w-full h-10 mt-2 rounded-lg border border-[#DEE2E6] hover:border-[#4E7FFF] text-[#495057] hover:text-[#4E7FFF] text-sm font-semibold cursor-pointer transition-colors">장바구니로 돌아가기</button>
          </aside>
        </div>
      )}
    </PageShell>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold text-[#495057] mb-1">{label}</span>
      {children}
    </label>
  );
}

function PayRadio({ active }: { active: boolean }) {
  if (!active) {
    return <span className="inline-block w-5 h-5 rounded-full border-2 border-[#CED4DA] bg-white shrink-0" />;
  }
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#DBE6FF] shrink-0">
      <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-[#4E7FFF]">
        <Check className="w-3 h-3 text-white" strokeWidth={3.5} />
      </span>
    </span>
  );
}

function MemoDropdown({ value, options, onChange, placeholder }: { value: string; options: string[]; onChange: (v: string) => void; placeholder?: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const isPlaceholder = placeholder !== undefined && value === placeholder;

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`w-full h-11 pl-4 pr-3 rounded-lg border text-sm text-left flex items-center justify-between cursor-pointer transition-colors ${open ? 'border-[#4E7FFF] ring-2 ring-[#4E7FFF]/15' : 'border-[#DEE2E6] hover:border-[#ADB5BD]'} bg-white`}
      >
        <span className={isPlaceholder ? 'text-[#ADB5BD]' : 'text-[#212529] font-medium'}>{value}</span>
        <ChevronDown className={`w-4 h-4 text-[#868E96] transition-transform ${open ? 'rotate-180' : ''}`} strokeWidth={2.5} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 mt-1.5 z-20 rounded-lg border border-[#DEE2E6] bg-white shadow-lg py-1 max-h-72 overflow-y-auto"
        >
          {options.map((opt) => {
            const selected = opt === value;
            const isPh = placeholder !== undefined && opt === placeholder;
            return (
              <li key={opt}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => { onChange(opt); setOpen(false); }}
                  disabled={isPh}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors ${isPh ? 'text-[#ADB5BD] cursor-default' : selected ? 'text-[#4E7FFF] font-semibold bg-[#F5F8FF] cursor-pointer' : 'text-[#212529] hover:bg-[#F8F9FA] cursor-pointer'}`}
                >
                  <span>{opt}</span>
                  {selected && !isPh && <Check className="w-4 h-4 text-[#4E7FFF]" strokeWidth={3} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
