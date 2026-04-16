import { Minus, Plus, Bell, BellRing } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '../../lib/products';

interface ProductRowProps {
  product: Product;
  cartQty?: number;
  onAddToCart: (qty: number) => void;
  onClick?: () => void;
}

const ROW_GRID = 'grid grid-cols-[minmax(160px,2fr)_100px_88px_72px_108px_108px_80px] items-center gap-x-4';

export function ProductRow({ product, cartQty = 0, onAddToCart, onClick }: ProductRowProps) {
  const [qty, setQty] = useState(product.moq);
  const [notified, setNotified] = useState(false);
  const disabled = product.stock === '품절';

  const nameColor = disabled ? 'text-[#ADB5BD]' : 'text-[#212529]';
  const primaryColor = disabled ? 'text-[#ADB5BD]' : 'text-[#495057]';
  const secondaryColor = disabled ? 'text-[#CED4DA]' : 'text-[#868E96]';
  const tertiaryColor = disabled ? 'text-[#CED4DA]' : 'text-[#ADB5BD]';
  const priceMain = disabled ? 'text-[#ADB5BD]' : 'text-[#212529]';

  return (
    <div
      onClick={onClick}
      className={`${ROW_GRID} px-4 py-3 border-b border-[#F1F3F5] transition-colors cursor-pointer ${
        disabled ? 'bg-[#F8F9FA]' : 'hover:bg-[#FAFBFC]'
      }`}
    >
      {/* 상품명 */}
      <div className="min-w-0">
        <p className={`text-sm font-semibold truncate ${nameColor}`}>{product.name}</p>
        <p className={`text-[11px] truncate ${tertiaryColor}`}>{product.spec}</p>
      </div>

      {/* 약제코드 */}
      <p className={`text-xs font-mono tabular-nums ${primaryColor}`}>{product.code}</p>

      {/* 제약사 */}
      <p className={`text-xs truncate ${primaryColor}`}>{product.supplier}</p>

      {/* 카테고리 */}
      <p className={`text-xs truncate ${secondaryColor}`}>{product.category}</p>

      {/* 가격 */}
      <div className="text-right">
        <p className={`text-sm font-bold tabular-nums ${priceMain}`}>₩{(product.unitPrice * product.packSize).toLocaleString()}</p>
        <p className={`text-[10px] truncate ${tertiaryColor}`}>{product.packLabel}</p>
      </div>

      {/* 수량 */}
      <div onClick={(e) => e.stopPropagation()} className="flex justify-center">
        {disabled ? (
          <span className={`text-xs ${tertiaryColor}`}>-</span>
        ) : (
          <div className="flex items-center border border-[#DEE2E6] rounded h-8 bg-white w-fit">
            <button
              onClick={() => setQty(Math.max(product.moq, qty - 1))}
              className="w-7 h-full flex items-center justify-center text-[#868E96] hover:text-[#212529] cursor-pointer"
              aria-label="수량 감소"
            >
              <Minus className="w-3 h-3" strokeWidth={2.5} />
            </button>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={qty}
              onChange={(e) => setQty(Math.max(product.moq, Number(e.target.value.replace(/[^0-9]/g, '')) || product.moq))}
              className="w-10 h-full text-center text-xs font-semibold text-[#212529] outline-none border-x border-[#DEE2E6] tabular-nums bg-transparent"
            />
            <button
              onClick={() => setQty(qty + 1)}
              className="w-7 h-full flex items-center justify-center text-[#868E96] hover:text-[#212529] cursor-pointer"
              aria-label="수량 증가"
            >
              <Plus className="w-3 h-3" strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>

      {/* 담기 / 재입고 알림 */}
      <div onClick={(e) => e.stopPropagation()} className="flex justify-center">
        {disabled ? (
          <button
            onClick={() => setNotified((v) => !v)}
            className={`h-8 px-3 rounded border text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap ${
              notified
                ? 'bg-[#4E7FFF] border-[#4E7FFF] text-white hover:bg-[#3D6FEF]'
                : 'bg-white border-[#DEE2E6] text-[#495057] hover:border-[#4E7FFF] hover:text-[#4E7FFF]'
            }`}
          >
            {notified ? <BellRing className="w-3.5 h-3.5" strokeWidth={2.5} /> : <Bell className="w-3.5 h-3.5" strokeWidth={2} />}
            {notified ? '알림 신청됨' : '재입고 알림'}
          </button>
        ) : (
          <div className="relative">
            <button
              onClick={() => { onAddToCart(qty); setQty(product.moq); }}
              className="h-8 px-4 rounded border border-[#4E7FFF] text-[#4E7FFF] hover:bg-[#4E7FFF] hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              담기
            </button>
            {cartQty > 0 && <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 bg-[#4E7FFF] text-white text-[10px] font-bold rounded-full flex items-center justify-center">{cartQty}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

export function ProductRowHeader() {
  return (
    <div className={`${ROW_GRID} px-4 py-2.5 bg-[#F8F9FA] border-b border-[#E9ECEF] text-[11px] font-bold text-[#495057]`}>
      <span>상품명</span>
      <span>약제코드</span>
      <span>제약사</span>
      <span>카테고리</span>
      <span className="text-right">가격</span>
      <span className="text-center">수량</span>
      <span className="text-center">담기</span>
    </div>
  );
}
