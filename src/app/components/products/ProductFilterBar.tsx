import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronDown, ChevronRight, Filter, Search, SlidersHorizontal, X, Zap } from 'lucide-react';
import { CATEGORIES, PRODUCTS, SUPPLIERS } from '../../lib/products';

export interface FilterState {
  categories: string[];
  suppliers: string[];
  priceMin: number;
  priceMax: number;
  excludeSoldOut: boolean;
}

export const EMPTY_FILTER: FilterState = {
  categories: [],
  suppliers: [],
  priceMin: 0,
  priceMax: 10000,
  excludeSoldOut: false,
};

export interface ActiveChip {
  key: string;
  label: string;
  onRemove: () => void;
}

interface ProductFilterBarProps {
  filter: FilterState;
  onChange: (f: FilterState) => void;
  search: string;
  onSearchChange: (v: string) => void;
  onQuickOrderClick: () => void;
  activeChips?: ActiveChip[];
  resultCount?: number;
}

export function ProductFilterBar({ filter, onChange, search, onSearchChange, onQuickOrderClick, activeChips = [], resultCount = 0 }: ProductFilterBarProps) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  // 모바일 모달 안에서 임시 필터 상태
  const [draft, setDraft] = useState<FilterState>(filter);

  // draft 기준 실시간 결과 카운트 (검색어도 반영)
  const draftResultCount = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        const hit = [p.name, p.code, p.supplier, p.category].some((v) => v.toLowerCase().includes(q));
        if (!hit) return false;
      }
      if (draft.categories.length && !draft.categories.includes(p.category)) return false;
      if (draft.suppliers.length && !draft.suppliers.includes(p.supplier)) return false;
      if (p.unitPrice < draft.priceMin || p.unitPrice > draft.priceMax) return false;
      if (draft.excludeSoldOut && p.stock === '품절') return false;
      return true;
    }).length;
  }, [draft, search]);

  const openMobileFilter = () => {
    setDraft(filter);
    setMobileSection(null);
    setMobileOpen(true);
  };

  const applyMobileFilter = () => {
    onChange(draft);
    setMobileOpen(false);
  };

  const toggle = <K extends keyof FilterState>(key: K, value: FilterState[K] extends Array<infer U> ? U : never) => {
    const arr = filter[key] as unknown as Array<typeof value>;
    const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    onChange({ ...filter, [key]: next });
  };

  const toggleDraft = <K extends keyof FilterState>(key: K, value: FilterState[K] extends Array<infer U> ? U : never) => {
    const arr = draft[key] as unknown as Array<typeof value>;
    const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    setDraft({ ...draft, [key]: next });
  };

  const anyActive =
    filter.categories.length ||
    filter.suppliers.length ||
    filter.priceMin > 0 ||
    filter.priceMax !== EMPTY_FILTER.priceMax ||
    filter.excludeSoldOut;

  const activeCount = filter.categories.length + filter.suppliers.length + (filter.excludeSoldOut ? 1 : 0) + (filter.priceMin > 0 || filter.priceMax !== EMPTY_FILTER.priceMax ? 1 : 0);

  return (
    <>
      <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-4 overflow-hidden">
        {/* 검색바 */}
        <div className="flex items-center gap-2 px-4 sm:px-5 py-3 sm:py-3.5 border-b border-[#F1F3F5]">
          {/* 모바일: 검색 페이지로 이동하는 버튼 */}
          <button
            type="button"
            onClick={() => navigate('/products/search')}
            className="lg:hidden flex-1 relative h-10 pl-10 pr-4 text-sm bg-[#F8F9FA] rounded-lg border border-transparent flex items-center text-left cursor-pointer"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#868E96]" strokeWidth={2.5} />
            {search ? (
              <span className="text-[#212529] truncate">{search}</span>
            ) : (
              <span className="text-[#868E96]">의약품명·SKU·제약사 검색</span>
            )}
            {search && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => { e.stopPropagation(); onSearchChange(''); }}
                aria-label="검색어 지우기"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-[#CED4DA] hover:bg-[#ADB5BD] cursor-pointer"
              >
                <X className="w-3 h-3 text-white" strokeWidth={3} />
              </span>
            )}
          </button>

          {/* 데스크톱: 실제 검색 입력 */}
          <div className="hidden lg:block relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#868E96]" strokeWidth={2.5} />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="의약품명·성분·SKU·제약사 검색"
              className={`w-full h-10 pl-10 ${search ? 'pr-10' : 'pr-4'} text-sm bg-[#F8F9FA] rounded-lg border border-transparent focus:bg-white focus:border-[#4E7FFF] focus:outline-none transition-colors`}
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="검색어 지우기"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-[#CED4DA] hover:bg-[#ADB5BD] cursor-pointer"
              >
                <X className="w-3 h-3 text-white" strokeWidth={3} />
              </button>
            )}
          </div>
          {/* 모바일: 상세검색 버튼 */}
          <button
            onClick={openMobileFilter}
            className="lg:hidden h-10 px-3 rounded-lg border border-[#DEE2E6] bg-white text-sm font-semibold text-[#495057] flex items-center gap-1.5 cursor-pointer shrink-0 relative"
          >
            <SlidersHorizontal className="w-4 h-4" strokeWidth={2.5} />
            {activeCount > 0 && <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-[#4E7FFF] text-white text-[10px] font-bold rounded-full flex items-center justify-center">{activeCount}</span>}
          </button>
          <button
            onClick={onQuickOrderClick}
            className="h-10 px-4 rounded-lg border border-[#DEE2E6] bg-white text-sm font-semibold text-[#495057] hover:border-[#4E7FFF] hover:text-[#4E7FFF] transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Zap className="w-4 h-4" strokeWidth={2.5} />
            <span className="hidden lg:inline">빠른 주문</span>
          </button>
        </div>

        {/* 모바일: 필터 칩 가로 스크롤 */}
        <div className="lg:hidden flex items-center gap-2 px-4 py-2.5 overflow-x-auto no-scrollbar border-b border-[#F1F3F5]">
          {filter.categories.map((c) => (
            <button key={`mc-${c}`} onClick={() => toggle('categories', c)} className="inline-flex items-center gap-1 h-7 pl-2.5 pr-1.5 rounded-full bg-[#EDF2FF] text-[11px] font-semibold text-[#4E7FFF] shrink-0 cursor-pointer">
              {c}
              <X className="w-3 h-3" strokeWidth={2.5} />
            </button>
          ))}
          {filter.suppliers.map((s) => (
            <button key={`ms-${s}`} onClick={() => toggle('suppliers', s)} className="inline-flex items-center gap-1 h-7 pl-2.5 pr-1.5 rounded-full bg-[#EDF2FF] text-[11px] font-semibold text-[#4E7FFF] shrink-0 cursor-pointer">
              {s}
              <X className="w-3 h-3" strokeWidth={2.5} />
            </button>
          ))}
          {filter.excludeSoldOut && (
            <button onClick={() => onChange({ ...filter, excludeSoldOut: false })} className="inline-flex items-center gap-1 h-7 pl-2.5 pr-1.5 rounded-full bg-[#EDF2FF] text-[11px] font-semibold text-[#4E7FFF] shrink-0 cursor-pointer">
              품절 제외
              <X className="w-3 h-3" strokeWidth={2.5} />
            </button>
          )}
          {anyActive && (
            <button onClick={() => onChange(EMPTY_FILTER)} className="text-[11px] text-[#868E96] shrink-0 cursor-pointer whitespace-nowrap">초기화</button>
          )}
        </div>

        {/* 데스크톱: 기존 필터 행 */}
        <div className="hidden lg:block">
          <Row label="카테고리" collapsible>
            {CATEGORIES.map((c) => (
              <CheckItem key={c} label={c} checked={filter.categories.includes(c)} onChange={() => toggle('categories', c)} />
            ))}
          </Row>

          <Row label="제약사" collapsible>
            {SUPPLIERS.map((s) => (
              <CheckItem key={s} label={s} checked={filter.suppliers.includes(s)} onChange={() => toggle('suppliers', s)} />
            ))}
          </Row>

          <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-[#F1F3F5] last:border-b-0">
            <div className="flex items-start gap-4">
              <p className="w-16 shrink-0 text-xs font-bold text-[#212529] pt-2">가격대</p>
              <div className="flex items-center gap-2">
                <input type="number" value={filter.priceMin} onChange={(e) => onChange({ ...filter, priceMin: Number(e.target.value) || 0 })} className="w-28 h-9 px-2.5 text-xs bg-white rounded border border-[#DEE2E6] focus:border-[#4E7FFF] focus:outline-none tabular-nums" placeholder="최소" />
                <span className="text-xs text-[#868E96]">~</span>
                <input type="number" value={filter.priceMax} onChange={(e) => onChange({ ...filter, priceMax: Number(e.target.value) || 0 })} className="w-28 h-9 px-2.5 text-xs bg-white rounded border border-[#DEE2E6] focus:border-[#4E7FFF] focus:outline-none tabular-nums" placeholder="최대" />
                <span className="text-[11px] text-[#ADB5BD] ml-1">원</span>
              </div>
            </div>
            <CheckItem label="품절 제외" checked={filter.excludeSoldOut} onChange={() => onChange({ ...filter, excludeSoldOut: !filter.excludeSoldOut })} />
          </div>

          {anyActive && (
            <div className="flex items-center gap-2 flex-wrap px-5 py-3 bg-[#F8F9FA] border-t border-[#F1F3F5]">
              {activeChips.map((c) => (
                <button key={c.key} onClick={c.onRemove} className="inline-flex items-center gap-1 h-7 pl-3 pr-2 rounded-full bg-white border border-[#E9ECEF] text-xs text-[#495057] hover:border-[#CED4DA] cursor-pointer">
                  {c.label}
                  <X className="w-3 h-3 text-[#868E96]" strokeWidth={2.5} />
                </button>
              ))}
              <div className="flex-1" />
              <button onClick={() => onChange(EMPTY_FILTER)} className="text-xs text-[#868E96] hover:text-[#495057] underline cursor-pointer">모두 초기화</button>
            </div>
          )}
        </div>
      </div>

      {/* 모바일 바텀시트 오버레이 */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`lg:hidden fixed inset-0 z-[55] bg-black/40 transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      {/* 모바일 바텀시트 */}
      <div className={`lg:hidden fixed inset-x-0 bottom-0 z-[60] bg-white rounded-t-2xl flex flex-col transition-transform duration-300 ease-out overflow-hidden ${mobileOpen ? 'translate-y-0' : 'translate-y-full'}`} style={{ maxHeight: '85vh' }}>
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          {mobileSection ? (
            <button onClick={() => setMobileSection(null)} className="text-sm text-[#495057] cursor-pointer inline-flex items-center gap-1">
              <ChevronDown className="w-4 h-4 rotate-90" strokeWidth={2} />
            </button>
          ) : (
            <div className="w-6" />
          )}
          <h3 className="text-[15px] font-bold text-[#212529]">{mobileSection === 'categories' ? '카테고리' : mobileSection === 'suppliers' ? '제약사' : mobileSection === 'price' ? '가격대' : '상세검색'}</h3>
          <button onClick={() => setMobileOpen(false)} className="p-0.5 cursor-pointer">
            <X className="w-5 h-5 text-[#868E96]" strokeWidth={1.5} />
          </button>
        </div>

        {!mobileSection && (
          <div className="flex items-center justify-center gap-1.5 text-[13px] text-[#868E96] py-2.5 bg-[#F8F9FA] border-y border-[#F1F3F5]">
            <Filter className="w-3.5 h-3.5 text-[#868E96] fill-current" strokeWidth={2} />
            <span>상세조건은 모든 상품에 적용됩니다.</span>
          </div>
        )}

        {/* 본문 */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {!mobileSection ? (
            <div className="py-2">
              <MobileFilterRow label="카테고리" count={draft.categories.length} onClick={() => setMobileSection('categories')} />
              <MobileFilterRow label="제약사" count={draft.suppliers.length} onClick={() => setMobileSection('suppliers')} />
              <MobileFilterRow label="가격대" count={draft.priceMin > 0 || draft.priceMax !== EMPTY_FILTER.priceMax ? 1 : 0} onClick={() => setMobileSection('price')} />
              <MobileFilterRow label="품절 제외" count={0} onClick={() => setDraft({ ...draft, excludeSoldOut: !draft.excludeSoldOut })} toggle checked={draft.excludeSoldOut} />
            </div>
          ) : mobileSection === 'categories' ? (
            <div className="py-1">
              {CATEGORIES.map((c) => (
                <MobileCheckItem key={c} label={c} checked={draft.categories.includes(c)} onChange={() => toggleDraft('categories', c)} />
              ))}
            </div>
          ) : mobileSection === 'suppliers' ? (
            <div className="py-1">
              {SUPPLIERS.map((s) => (
                <MobileCheckItem key={s} label={s} checked={draft.suppliers.includes(s)} onChange={() => toggleDraft('suppliers', s)} />
              ))}
            </div>
          ) : mobileSection === 'price' ? (
            <div className="px-5 py-5">
              <p className="text-[13px] text-[#868E96] mb-4">가격 범위를 입력하세요 (원)</p>
              <div className="flex items-center gap-3">
                <input type="number" value={draft.priceMin} onChange={(e) => setDraft({ ...draft, priceMin: Number(e.target.value) || 0 })} className="flex-1 h-12 px-4 text-sm bg-white rounded-xl border border-[#DEE2E6] focus:border-[#4E7FFF] focus:outline-none tabular-nums" placeholder="최소" />
                <span className="text-sm text-[#ADB5BD]">~</span>
                <input type="number" value={draft.priceMax} onChange={(e) => setDraft({ ...draft, priceMax: Number(e.target.value) || 0 })} className="flex-1 h-12 px-4 text-sm bg-white rounded-xl border border-[#DEE2E6] focus:border-[#4E7FFF] focus:outline-none tabular-nums" placeholder="최대" />
              </div>
            </div>
          ) : null}
        </div>

        {/* 선택 카운트 (drill-down일 때) */}
        {mobileSection && mobileSection !== 'price' && (
          <div className="px-5 py-2 border-t border-[#F1F3F5]">
            <p className="text-[13px] text-[#495057]">
              선택한 {mobileSection === 'categories' ? '카테고리' : '제약사'}{' '}
              <span className="font-bold text-[#4E7FFF]">{mobileSection === 'categories' ? draft.categories.length : draft.suppliers.length}</span>
            </p>
          </div>
        )}

        {/* 하단 버튼 */}
        <div className="flex items-center gap-3 px-5 py-4 border-t border-[#E9ECEF]">
          <button onClick={() => { if (mobileSection) { if (mobileSection === 'categories') setDraft({ ...draft, categories: [] }); else if (mobileSection === 'suppliers') setDraft({ ...draft, suppliers: [] }); else if (mobileSection === 'price') setDraft({ ...draft, priceMin: 0, priceMax: 10000 }); } else { setDraft(EMPTY_FILTER); } }} className="h-[50px] px-6 rounded-xl border border-[#DEE2E6] text-[15px] font-semibold text-[#495057] cursor-pointer">
            초기화
          </button>
          <button onClick={() => { if (mobileSection) setMobileSection(null); else applyMobileFilter(); }} className="flex-1 h-[50px] rounded-xl bg-[#4E7FFF] text-white text-[15px] font-semibold cursor-pointer">
            {mobileSection ? '선택완료' : `${draftResultCount}건 상품보기`}
          </button>
        </div>
      </div>
    </>
  );
}

/* ── 데스크톱 Row ── */
function Row({ label, children, collapsible = false }: { label: string; children: React.ReactNode; collapsible?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!collapsible || !contentRef.current) return;
    const el = contentRef.current;
    const check = () => setOverflows(el.scrollHeight > 40);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [collapsible, children]);

  return (
    <div className="flex items-start gap-4 px-5 py-3.5 border-b border-[#F1F3F5] last:border-b-0">
      <p className="w-16 shrink-0 text-xs font-bold text-[#212529] pt-2">{label}</p>
      <div
        ref={contentRef}
        className={`flex-1 flex items-center gap-1.5 flex-wrap min-w-0 transition-all duration-200 ${
          collapsible && !expanded ? 'max-h-[36px] overflow-hidden' : ''
        }`}
      >
        {children}
      </div>
      {collapsible && overflows && (
        <button onClick={() => setExpanded((v) => !v)} className="shrink-0 flex items-center gap-0.5 text-xs text-[#868E96] hover:text-[#495057] pt-2 cursor-pointer whitespace-nowrap">
          {expanded ? '접기' : '펼치기'}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}

/* ── 데스크톱 체크 아이템 ── */
function CheckItem({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={onChange} className="inline-flex items-center gap-1.5 cursor-pointer select-none py-1 pr-4">
      <span className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-[#4E7FFF] border-[#4E7FFF]' : 'bg-white border-[#DEE2E6]'}`}>
        {checked && (
          <svg viewBox="0 0 16 16" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 8 7 12 13 4" />
          </svg>
        )}
      </span>
      <span className={`text-sm ${checked ? 'text-[#212529]' : 'text-[#495057]'}`}>{label}</span>
    </button>
  );
}

/* ── 모바일 필터 행 ── */
function MobileFilterRow({ label, count, onClick, toggle, checked }: { label: string; count: number; onClick: () => void; toggle?: boolean; checked?: boolean }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between px-5 py-[18px] border-b border-[#F1F3F5] cursor-pointer active:bg-[#F8F9FA]">
      <div className="flex items-center gap-2.5">
        <span className="text-[15px] font-bold text-[#212529]">{label}</span>
        {count > 0 && !toggle && <span className="text-[13px] text-[#4E7FFF] font-semibold">{count}개</span>}
      </div>
      {toggle ? (
        <span className={`relative w-[46px] h-[26px] rounded-full transition-colors duration-200 shrink-0 ${checked ? 'bg-[#4E7FFF]' : 'bg-[#DEE2E6]'}`}>
          <span className={`absolute top-[3px] left-[3px] w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out ${checked ? 'translate-x-[20px]' : 'translate-x-0'}`} />
        </span>
      ) : (
        <ChevronRight className="w-5 h-5 text-[#CED4DA]" strokeWidth={1.5} />
      )}
    </button>
  );
}

/* ── 모바일 체크 아이템 (사라민 스타일 체크마크) ── */
function MobileCheckItem({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={onChange} className="w-full flex items-center justify-between px-5 py-[14px] border-b border-[#F8F9FA] cursor-pointer active:bg-[#F8F9FA]">
      <span className={`text-[15px] ${checked ? 'text-[#212529] font-semibold' : 'text-[#495057]'}`}>{label}</span>
      {checked && (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#4E7FFF]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 12 10 18 20 6" />
        </svg>
      )}
    </button>
  );
}
