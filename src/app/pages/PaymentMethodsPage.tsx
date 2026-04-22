import { Plus, Star } from 'lucide-react';
import { PageShell } from '../components/PageShell';
import { PAYMENT_METHODS } from '../lib/payments';

export default function PaymentMethodsPage() {
  return (
    <PageShell title="결제수단 관리" description="결제에 사용할 카드·계좌·세금계산서 정보를 관리합니다." actions={(
      <button className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#4E7FFF] hover:bg-[#3D6FEF] text-white text-sm font-semibold cursor-pointer">
        <Plus className="w-4 h-4" strokeWidth={2.5} /> 결제수단 추가
      </button>
    )}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PAYMENT_METHODS.map((m) => (
          <div key={m.id} className={`rounded-lg border p-5 bg-white ${m.isDefault ? 'border-[#4E7FFF] ring-1 ring-[#4E7FFF]/30' : 'border-[#DEE2E6]'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#868E96]">{m.type}</span>
              {m.isDefault && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4E7FFF]">
                  <Star className="w-3 h-3 fill-[#4E7FFF] text-[#4E7FFF]" /> 기본
                </span>
              )}
            </div>
            <p className="text-base font-bold text-[#212529] mb-1">{m.label}</p>
            <p className="text-xs text-[#868E96]">{m.detail}</p>
            <div className="mt-4 flex items-center gap-2">
              {!m.isDefault && <button className="h-8 px-3 text-xs font-semibold rounded border border-[#DEE2E6] text-[#495057] hover:border-[#4E7FFF] hover:text-[#4E7FFF] cursor-pointer">기본 설정</button>}
              <button className="h-8 px-3 text-xs font-semibold rounded border border-[#DEE2E6] text-[#495057] hover:border-[#4E7FFF] hover:text-[#4E7FFF] cursor-pointer">수정</button>
              {!m.isDefault && <button className="h-8 px-3 text-xs font-semibold rounded border border-[#DEE2E6] text-[#FA5252] hover:border-[#FA5252] cursor-pointer">삭제</button>}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
