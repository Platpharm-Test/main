import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Search, X } from 'lucide-react';
import { CATEGORIES } from '../lib/products';

const RECENT_KEY = 'platpharm:recentSearches';

export default function ProductSearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [recents, setRecents] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const saveRecent = (q: string) => {
    const next = [q, ...recents.filter((r) => r !== q)].slice(0, 10);
    setRecents(next);
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch {}
  };

  const submit = (q?: string) => {
    const v = (q ?? query).trim();
    if (!v) return;
    saveRecent(v);
    navigate(`/products?q=${encodeURIComponent(v)}`);
  };

  const removeRecent = (q: string) => {
    const next = recents.filter((r) => r !== q);
    setRecents(next);
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch {}
  };

  const clearAllRecent = () => {
    setRecents([]);
    try { localStorage.removeItem(RECENT_KEY); } catch {}
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 상단 바 */}
      <div className="flex items-center gap-2 px-3 py-3 border-b border-[#F1F3F5]">
        <button onClick={() => navigate(-1)} className="p-2 cursor-pointer" aria-label="뒤로가기">
          <ArrowLeft className="w-5 h-5 text-[#495057]" strokeWidth={2} />
        </button>
        <form
          onSubmit={(e) => { e.preventDefault(); submit(); }}
          className="flex-1 relative"
        >
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#868E96]" strokeWidth={2.5} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="의약품명, SKU, 제약사 검색"
            className="w-full h-11 pl-10 pr-10 text-sm bg-[#F8F9FA] border-2 border-[#4E7FFF] rounded-full focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-[#CED4DA] hover:bg-[#ADB5BD] cursor-pointer"
              aria-label="지우기"
            >
              <X className="w-3 h-3 text-white" strokeWidth={3} />
            </button>
          )}
        </form>
      </div>

      {/* 본문 */}
      <div className="flex-1 overflow-y-auto">
        {/* 최근 검색어 */}
        <div className="px-5 py-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-bold text-[#212529]">최근 검색어</h3>
            {recents.length > 0 && (
              <button onClick={clearAllRecent} className="text-[13px] text-[#868E96] cursor-pointer">전체 삭제</button>
            )}
          </div>
          {recents.length === 0 ? (
            <p className="text-[13px] text-[#ADB5BD] py-4">최근 검색한 내역이 없습니다.</p>
          ) : (
            <ul className="space-y-2">
              {recents.map((r) => (
                <li key={r} className="flex items-center justify-between py-2">
                  <button onClick={() => submit(r)} className="flex-1 text-left text-[14px] text-[#212529] cursor-pointer truncate">
                    {r}
                  </button>
                  <button onClick={() => removeRecent(r)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#F1F3F5] cursor-pointer shrink-0" aria-label="삭제">
                    <X className="w-3.5 h-3.5 text-[#ADB5BD]" strokeWidth={2.5} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 추천 카테고리 */}
        <div className="px-5 py-5 border-t-8 border-[#F8F9FA]">
          <h3 className="text-[15px] font-bold text-[#212529] mb-3">카테고리로 찾기</h3>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.slice(0, 12).map((c) => (
              <button
                key={c}
                onClick={() => navigate(`/products?category=${encodeURIComponent(c)}`)}
                className="h-9 px-3.5 rounded-full bg-[#F1F3F5] text-[13px] text-[#495057] cursor-pointer active:bg-[#E9ECEF]"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
