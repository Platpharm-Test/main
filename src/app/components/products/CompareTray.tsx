import { X } from 'lucide-react';
import type { Product } from '../../lib/products';

interface CompareTrayProps {
  items: Product[];
  onRemove: (id: number) => void;
  onClear: () => void;
  onCompare: () => void;
}

export function CompareTray({ items, onRemove, onClear, onCompare }: CompareTrayProps) {
  if (items.length === 0) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#212529] text-white rounded-xl shadow-2xl px-4 py-3 flex items-center gap-3 max-w-[calc(100vw-2rem)]">
      <span className="text-xs font-semibold text-white/70">비교 ({items.length}/3)</span>
      <div className="flex items-center gap-2">
        {items.map((p) => (
          <div key={p.id} className="flex items-center gap-1.5 bg-white/10 rounded-md pl-2.5 pr-1 py-1">
            <span className="text-xs font-medium max-w-[120px] truncate">{p.name}</span>
            <button onClick={() => onRemove(p.id)} className="w-5 h-5 flex items-center justify-center hover:bg-white/10 rounded cursor-pointer" aria-label="제거">
              <X className="w-3 h-3" strokeWidth={2.5} />
            </button>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 ml-2 pl-3 border-l border-white/10">
        <button onClick={onClear} className="text-xs text-white/60 hover:text-white px-2 py-1 cursor-pointer">초기화</button>
        <button
          onClick={onCompare}
          disabled={items.length < 2}
          className="h-8 px-3 rounded bg-[#4E7FFF] hover:bg-[#3D6FEF] text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          비교하기
        </button>
      </div>
    </div>
  );
}
