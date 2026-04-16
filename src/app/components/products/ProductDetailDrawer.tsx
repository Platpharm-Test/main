import { X } from 'lucide-react';
import type { Product } from '../../lib/products';
import { STOCK_DOT, STOCK_LABEL_COLOR } from '../../lib/products';

interface ProductDetailDrawerProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (qty: number) => void;
  onToggleCompare: () => void;
  inCompare: boolean;
}

export function ProductDetailDrawer({ product, onClose, onAddToCart, onToggleCompare, inCompare }: ProductDetailDrawerProps) {
  const open = !!product;
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[55] bg-black/30 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />
      <aside
        className={`fixed top-0 right-0 bottom-0 z-[56] w-full max-w-[420px] bg-white shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col`}
      >
        {product && (
          <>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F3F5]">
              <h3 className="text-sm font-bold text-[#212529]">상품 상세</h3>
              <button onClick={onClose} className="p-1 hover:bg-[#F1F3F5] rounded cursor-pointer" aria-label="닫기">
                <X className="w-4 h-4 text-[#495057]" strokeWidth={2.5} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <p className="text-xs text-[#868E96] mb-1">{product.supplier}</p>
              <h2 className="text-lg font-bold text-[#212529] mb-1">{product.name}</h2>
              <p className="text-xs text-[#ADB5BD] font-mono mb-4">{product.code}</p>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <Row label="분류" value={product.drugClass} />
                <Row label="형태" value={product.form} />
                <Row label="카테고리" value={product.category} />
                <Row label="규격" value={product.spec} />
                <Row label="MOQ" value={`${product.moq}${product.packLabel.includes('박스') ? '박스' : '단위'}`} />
                <Row label="포장 단위" value={product.packLabel} />
              </div>

              <div className="bg-[#F8F9FA] rounded-lg p-4 mb-5">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xs text-[#868E96]">단가</span>
                  <span className="text-lg font-bold text-[#212529] tabular-nums">₩{product.unitPrice.toLocaleString()}<span className="text-xs font-medium text-[#868E96]">/개</span></span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#868E96]">박스가 ({product.packLabel})</span>
                  <span className="text-sm font-semibold text-[#495057] tabular-nums">₩{(product.unitPrice * product.packSize).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-5">
                <span className={`w-2 h-2 rounded-full ${STOCK_DOT[product.stock]}`} />
                <span className={`text-sm font-semibold ${STOCK_LABEL_COLOR[product.stock]}`}>{product.stock}</span>
                <span className="text-xs text-[#868E96]">· 재고 {product.stockCount.toLocaleString()}개</span>
              </div>
            </div>
            <div className="px-5 py-3 border-t border-[#F1F3F5] flex items-center gap-2">
              <button
                onClick={onToggleCompare}
                className={`h-10 px-4 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                  inCompare
                    ? 'border-[#4E7FFF] bg-[#EDF2FF] text-[#4E7FFF]'
                    : 'border-[#DEE2E6] text-[#495057] hover:bg-[#F8F9FA]'
                }`}
              >
                {inCompare ? '비교에서 제거' : '비교에 추가'}
              </button>
              <button
                onClick={() => onAddToCart(product.moq)}
                disabled={product.stock === '품절'}
                className="flex-1 h-10 rounded-lg bg-[#4E7FFF] hover:bg-[#3D6FEF] text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                장바구니 담기
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-[#ADB5BD] uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm text-[#212529]">{value}</p>
    </div>
  );
}
