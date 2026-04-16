import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { CATEGORIES, CLASSES, FORMS, PRODUCTS, SUPPLIERS, type DrugClass, type DrugForm, type Stock } from '../../lib/products';

const STOCKS: Stock[] = ['충분', '보통', '품절 임박', '품절'];

export interface FilterState {
  classes: DrugClass[];
  categories: string[];
  suppliers: string[];
  stocks: Stock[];
  forms: DrugForm[];
  priceMin: number;
  priceMax: number;
  favoritesOnly: boolean;
  recentOnly: boolean;
}

export const EMPTY_FILTER: FilterState = {
  classes: [],
  categories: [],
  suppliers: [],
  stocks: [],
  forms: [],
  priceMin: 0,
  priceMax: 10000,
  favoritesOnly: false,
  recentOnly: false,
};

interface ProductFilterSidebarProps {
  filter: FilterState;
  onChange: (f: FilterState) => void;
}

export function ProductFilterSidebar({ filter, onChange }: ProductFilterSidebarProps) {
  const [supplierQuery, setSupplierQuery] = useState('');

  const counts = useMemo(() => {
    const cat: Record<string, number> = {};
    const sup: Record<string, number> = {};
    for (const p of PRODUCTS) {
      cat[p.category] = (cat[p.category] || 0) + 1;
      sup[p.supplier] = (sup[p.supplier] || 0) + 1;
    }
    return { cat, sup };
  }, []);

  const toggle = <K extends keyof FilterState>(key: K, value: FilterState[K] extends Array<infer U> ? U : never) => {
    const arr = filter[key] as unknown as Array<typeof value>;
    const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    onChange({ ...filter, [key]: next });
  };

  const reset = () => onChange(EMPTY_FILTER);

  const filteredSuppliers = SUPPLIERS.filter((s) => s.toLowerCase().includes(supplierQuery.toLowerCase()));

  return (
    <aside className="w-[260px] shrink-0 bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 self-start sticky top-[7.5rem] max-h-[calc(100vh-9rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-[#212529]">필터</h3>
        <button onClick={reset} className="text-xs text-[#868E96] hover:text-[#495057] cursor-pointer">초기화</button>
      </div>

      <Group title="분류">
        {CLASSES.map((c) => (
          <Check key={c} label={c} checked={filter.classes.includes(c)} onChange={() => toggle('classes', c)} />
        ))}
      </Group>

      <Group title="카테고리">
        {CATEGORIES.map((c) => (
          <Check key={c} label={c} count={counts.cat[c]} checked={filter.categories.includes(c)} onChange={() => toggle('categories', c)} />
        ))}
      </Group>

      <Group title="제약사">
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#868E96]" strokeWidth={2.5} />
          <input
            value={supplierQuery}
            onChange={(e) => setSupplierQuery(e.target.value)}
            placeholder="제약사 검색"
            className="w-full h-8 pl-8 pr-2 text-xs bg-[#F8F9FA] rounded border border-transparent focus:bg-white focus:border-[#DEE2E6] focus:outline-none"
          />
        </div>
        <div className="max-h-40 overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
          {filteredSuppliers.map((s) => (
            <Check key={s} label={s} count={counts.sup[s]} checked={filter.suppliers.includes(s)} onChange={() => toggle('suppliers', s)} />
          ))}
        </div>
      </Group>

      <Group title="가격대 (단가)">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={filter.priceMin}
            onChange={(e) => onChange({ ...filter, priceMin: Number(e.target.value) || 0 })}
            className="w-full h-8 px-2 text-xs bg-[#F8F9FA] rounded border border-transparent focus:bg-white focus:border-[#DEE2E6] focus:outline-none"
          />
          <span className="text-xs text-[#868E96]">~</span>
          <input
            type="number"
            value={filter.priceMax}
            onChange={(e) => onChange({ ...filter, priceMax: Number(e.target.value) || 0 })}
            className="w-full h-8 px-2 text-xs bg-[#F8F9FA] rounded border border-transparent focus:bg-white focus:border-[#DEE2E6] focus:outline-none"
          />
        </div>
      </Group>

      <Group title="재고 상태">
        {STOCKS.map((s) => (
          <Check key={s} label={s} dot stockColor={s} checked={filter.stocks.includes(s)} onChange={() => toggle('stocks', s)} />
        ))}
      </Group>

      <Group title="형태">
        {FORMS.map((f) => (
          <Check key={f} label={f} checked={filter.forms.includes(f)} onChange={() => toggle('forms', f)} />
        ))}
      </Group>

      <div className="pt-2 border-t border-[#F1F3F5] space-y-1">
        <Check label="⭐ 즐겨찾기만 보기" checked={filter.favoritesOnly} onChange={() => onChange({ ...filter, favoritesOnly: !filter.favoritesOnly })} />
        <Check label="최근 주문 품목만" checked={filter.recentOnly} onChange={() => onChange({ ...filter, recentOnly: !filter.recentOnly })} />
      </div>
    </aside>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5 pb-4 border-b border-[#F1F3F5] last:border-b-0">
      <p className="text-[11px] font-bold text-[#868E96] uppercase tracking-wide mb-2.5">{title}</p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

const STOCK_DOT_COLOR: Record<Stock, string> = {
  '충분': 'bg-[#0CA678]',
  '보통': 'bg-[#4E7FFF]',
  '품절 임박': 'bg-[#F76707]',
  '품절': 'bg-[#FA5252]',
};

interface CheckProps {
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
  dot?: boolean;
  stockColor?: Stock;
}

function Check({ label, count, checked, onChange, dot, stockColor }: CheckProps) {
  return (
    <label className="flex items-center gap-2 px-1 py-1 rounded hover:bg-[#F8F9FA] cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-3.5 h-3.5 accent-[#4E7FFF] cursor-pointer"
      />
      {dot && stockColor && <span className={`w-2 h-2 rounded-full ${STOCK_DOT_COLOR[stockColor]}`} />}
      <span className="text-xs text-[#495057] flex-1">{label}</span>
      {typeof count === 'number' && <span className="text-[10px] text-[#ADB5BD]">{count}</span>}
    </label>
  );
}
