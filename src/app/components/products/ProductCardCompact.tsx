import { Minus, Plus, Bell, BellRing } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '../../lib/products';
import { ProductImage } from './ProductImage';

interface ProductCardCompactProps {
  product: Product;
  cartQty?: number;
  onAddToCart: (qty: number) => void;
  onClick?: () => void;
}

export function ProductCardCompact({ product, cartQty = 0, onAddToCart, onClick }: ProductCardCompactProps) {
  const [qty, setQty] = useState(product.moq);
  const [notified, setNotified] = useState(false);
  const disabled = product.stock === '품절';

  return (
    <div
      onClick={onClick}
      className={`rounded-lg border p-3.5 transition-colors cursor-pointer flex flex-col ${
        disabled ? 'bg-[#F8F9FA] border-[#E9ECEF]' : 'bg-white border-[#E9ECEF] hover:border-[#CED4DA]'
      }`}
    >
      <div className="flex justify-center mb-3">
        <ProductImage form={product.form} category={product.category} name={product.name} code={product.code} image={product.image} size="md" />
      </div>
      <p className={`text-[11px] mb-0.5 ${disabled ? 'text-[#CED4DA]' : 'text-[#868E96]'}`}>{product.supplier}</p>
      <p className={`text-sm font-bold line-clamp-2 leading-tight mb-1 ${disabled ? 'text-[#ADB5BD]' : 'text-[#212529]'}`}>{product.name}</p>
      <p className={`text-[11px] font-mono mb-2 ${disabled ? 'text-[#CED4DA]' : 'text-[#ADB5BD]'}`}>{product.code}</p>

      <div className="border-t border-[#F1F3F5] pt-2.5 mt-auto">
        <div className="flex items-baseline justify-between mb-1">
          <p className={`text-base font-bold tabular-nums ${disabled ? 'text-[#ADB5BD]' : 'text-[#212529]'}`}>
            ₩{(product.unitPrice * product.packSize).toLocaleString()}
          </p>
        </div>
        <p className={`text-[11px] mb-2.5 ${disabled ? 'text-[#CED4DA]' : 'text-[#868E96]'}`}>
          {product.packLabel}
        </p>

        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {disabled ? (
            <button
              onClick={() => setNotified((v) => !v)}
              className={`flex-1 h-8 rounded border text-xs font-semibold inline-flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                notified
                  ? 'bg-[#4E7FFF] border-[#4E7FFF] text-white hover:bg-[#3D6FEF]'
                  : 'bg-white border-[#DEE2E6] text-[#495057] hover:border-[#4E7FFF] hover:text-[#4E7FFF]'
              }`}
            >
              {notified ? <BellRing className="w-3.5 h-3.5" strokeWidth={2.5} /> : <Bell className="w-3.5 h-3.5" strokeWidth={2} />}
              {notified ? '알림 신청됨' : '재입고 알림'}
            </button>
          ) : (
            <>
              <div className="flex items-center border border-[#DEE2E6] rounded h-8 bg-white">
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
              <div className="relative flex-1">
                <button
                  onClick={() => { onAddToCart(qty); setQty(product.moq); }}
                  className="w-full h-8 rounded border border-[#4E7FFF] text-[#4E7FFF] hover:bg-[#4E7FFF] hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  담기
                </button>
                {cartQty > 0 && <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 bg-[#4E7FFF] text-white text-[10px] font-bold rounded-full flex items-center justify-center">{cartQty}</span>}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
