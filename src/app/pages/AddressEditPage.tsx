import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Check, MapPin, Pencil, Plus, Trash2 } from 'lucide-react';
import { PageShell } from '../components/PageShell';
import { useDeliveryAddress, type DeliveryAddress } from '../lib/addressContext';

export default function AddressEditPage() {
  const navigate = useNavigate();
  const { addresses, selectedId, selectAddress, removeAddress } = useDeliveryAddress();
  const [tempSelectedId, setTempSelectedId] = useState(selectedId);

  const handleConfirm = () => {
    selectAddress(tempSelectedId);
    navigate(-1);
  };

  const handleRemove = (id: string) => {
    if (!window.confirm('이 배송지를 삭제하시겠습니까?')) return;
    removeAddress(id);
    if (tempSelectedId === id) {
      const remain = addresses.find((a) => a.id !== id);
      if (remain) setTempSelectedId(remain.id);
    }
  };

  const selected = addresses.find((a) => a.id === tempSelectedId) ?? addresses[0];

  return (
    <PageShell
      title="배송지 관리"
      description="배송받을 주소를 선택하거나 새 배송지를 추가할 수 있습니다."
      actions={(
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#DEE2E6] bg-white text-xs font-semibold text-[#495057] hover:border-[#4E7FFF] hover:text-[#4E7FFF] cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.5} /> 돌아가기
        </button>
      )}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 max-w-[1100px] mx-auto">
        {/* 좌측: 배송지 목록 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#495057]">저장된 배송지 <span className="text-[#868E96] tabular-nums ml-1">{addresses.length}</span></p>
            <button
              onClick={() => navigate('/address/form/new')}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-white border border-[#4E7FFF] text-[#4E7FFF] text-xs font-semibold hover:bg-[#EDF2FF] cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
              배송지 추가
            </button>
          </div>

          <div className="space-y-2">
            {addresses.map((a) => {
              const active = a.id === tempSelectedId;
              const isDefault = a.id === selectedId;
              return (
                <label
                  key={a.id}
                  className="flex items-start gap-3 p-5 rounded-2xl border border-[#F1F3F5] bg-white cursor-pointer transition-colors hover:border-[#E9ECEF]"
                >
                  <input
                    type="radio"
                    name="address"
                    checked={active}
                    onChange={() => setTempSelectedId(a.id)}
                    className="sr-only"
                  />
                  <span className={`mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full transition-colors shrink-0 ${active ? 'bg-[#4E7FFF]' : 'border-2 border-[#CED4DA] bg-white'}`}>
                    {active && <Check className="w-3 h-3 text-white" strokeWidth={3.5} />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                      <p className={`text-sm font-bold ${active ? 'text-[#4E7FFF]' : 'text-[#212529]'}`}>{a.name || '배송지'}</p>
                      {isDefault && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#EDF2FF] text-[#4E7FFF]">기본</span>}
                    </div>
                    <p className="text-xs text-[#495057]">{a.recipient} · {a.phone}</p>
                    <p className="text-xs text-[#495057] mt-0.5">({a.zip}) {a.line1}</p>
                    {a.line2 && <p className="text-xs text-[#495057]">{a.line2}</p>}
                  </div>
                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.preventDefault()}>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); navigate(`/address/form/${a.id}`); }}
                      aria-label="편집"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#868E96] hover:bg-[#F1F3F5] hover:text-[#495057] cursor-pointer transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </button>
                    {addresses.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleRemove(a.id); }}
                        aria-label="삭제"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#868E96] hover:bg-[#FFF5F5] hover:text-[#FA5252] cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                      </button>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* 우측: 선택 배송지 요약 + 확정 */}
        <aside className="lg:sticky lg:top-20 h-fit space-y-3">
          <div className="rounded-2xl border border-[#E9ECEF] bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-[#4E7FFF]" strokeWidth={2.5} />
              <p className="text-xs font-bold text-[#495057]">선택된 배송지</p>
            </div>
            <AddressPreview address={selected} />
          </div>
          <div className="rounded-2xl border border-[#E9ECEF] bg-white p-5">
            <button
              onClick={handleConfirm}
              className="w-full h-12 rounded-xl bg-[#4E7FFF] hover:bg-[#3D6FEF] text-white text-sm font-bold cursor-pointer transition-colors"
            >
              이 배송지로 설정
            </button>
            <p className="mt-2 text-[11px] text-[#ADB5BD] text-center">선택한 배송지가 결제 화면에 반영됩니다.</p>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}

function AddressPreview({ address }: { address: DeliveryAddress }) {
  return (
    <div className="space-y-0.5">
      {address.name && <p className="text-sm font-semibold text-[#212529]">{address.name}</p>}
      <p className="text-xs text-[#495057]">{address.recipient || '수령인 미입력'} · {address.phone || '연락처 미입력'}</p>
      <p className="text-xs text-[#495057] mt-1">{address.zip ? `(${address.zip}) ` : ''}{address.line1 || '주소 미입력'}</p>
      {address.line2 && <p className="text-xs text-[#495057]">{address.line2}</p>}
    </div>
  );
}
