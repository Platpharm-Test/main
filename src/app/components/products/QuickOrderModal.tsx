import { useState } from 'react';
import { X, Zap } from 'lucide-react';
import { PRODUCTS } from '../../lib/products';

interface QuickOrderModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (lines: { code: string; qty: number; ok: boolean; name?: string }[]) => void;
}

export function QuickOrderModal({ open, onClose, onAdd }: QuickOrderModalProps) {
  const [text, setText] = useState('');

  if (!open) return null;

  const submit = () => {
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean).map((line) => {
      const [codeRaw, qtyRaw] = line.split(/[\s,\t]+/);
      const code = (codeRaw || '').toUpperCase();
      const qty = Math.max(1, Number(qtyRaw) || 1);
      const product = PRODUCTS.find((p) => p.code.toUpperCase() === code);
      return { code, qty, ok: !!product, name: product?.name };
    });
    onAdd(lines);
    setText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/40" />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F3F5]">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#4E7FFF]" strokeWidth={2.5} />
            <h3 className="text-sm font-bold text-[#212529]">빠른 주문</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#F1F3F5] rounded cursor-pointer" aria-label="닫기">
            <X className="w-4 h-4 text-[#495057]" strokeWidth={2.5} />
          </button>
        </div>
        <div className="p-5">
          <p className="text-xs text-[#495057] mb-2">
            한 줄에 <span className="font-mono text-[#212529]">SKU 수량</span> 형식으로 입력하세요. (예: <span className="font-mono">YUH-001 5</span>)
          </p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            placeholder={'YUH-001 5\nHAN-002 3\nDAE-005 10'}
            className="w-full p-3 text-xs font-mono bg-[#F8F9FA] rounded-lg border border-[#E9ECEF] focus:bg-white focus:border-[#4E7FFF] focus:outline-none resize-none"
          />
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-3 bg-[#F8F9FA] border-t border-[#F1F3F5]">
          <button onClick={onClose} className="h-9 px-4 rounded-lg text-xs font-semibold text-[#495057] hover:bg-white cursor-pointer">
            취소
          </button>
          <button onClick={submit} className="h-9 px-4 rounded-lg bg-[#4E7FFF] hover:bg-[#3D6FEF] text-white text-xs font-semibold cursor-pointer">
            장바구니 일괄 담기
          </button>
        </div>
      </div>
    </div>
  );
}
