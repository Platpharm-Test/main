import { ChevronDown, ChevronRight, ChevronsLeft, ChevronsRight, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

interface MenuItem {
  name: string;
  path?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  {
    title: '대시보드',
    items: [
      { name: '전체 현황', path: '/' },
    ]
  },
  {
    title: '거래처 관리',
    items: [
      { name: '제약사 목록', path: '/partners' },
      { name: '거래 신청 내역', path: '/partners/requests' },
      { name: '승인된 거래처', path: '/partners/approved' },
    ]
  },
  {
    title: '의약품 구매',
    items: [
      { name: '전체 상품', path: '/products' },
      { name: '장바구니', path: '/cart' },
      { name: '주문 내역', path: '/orders' },
    ]
  },
  {
    title: '재고 관리',
    items: [
      { name: '재고 현황' },
      { name: '입고 내역' },
    ]
  },
  {
    title: '결제 관리',
    items: [
      { name: '결제 진행', path: '/checkout' },
      { name: '결제 내역', path: '/payments/history' },
      { name: '미결제 내역', path: '/payments/unpaid' },
      { name: '결제수단 관리', path: '/payments/methods' },
    ]
  },
  {
    title: '장부·반품관리',
    items: [
      { name: '구매 장부', path: '/ledger/purchases' },
      { name: '반품 신청', path: '/returns' },
    ]
  },
  {
    title: '분석',
    items: [
      { name: '구매 분석' },
      { name: '지출 통계' },
    ]
  },
];

export function CleanSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // 현재 경로가 속한 섹션 인덱스
  const activeSectionIndex = menuSections.findIndex((section) =>
    section.items.some((item) => !!item.path && (currentPath === item.path || currentPath.startsWith(item.path + '/'))),
  );

  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>(() => {
    const init: Record<number, boolean> = { 0: true, 1: true, 2: true };
    if (activeSectionIndex >= 0) init[activeSectionIndex] = true;
    return init;
  });

  // 경로 변경 시 해당 섹션 자동 펼침 (유지)
  useEffect(() => {
    if (activeSectionIndex >= 0) {
      setExpandedSections((prev) => (prev[activeSectionIndex] ? prev : { ...prev, [activeSectionIndex]: true }));
    }
  }, [activeSectionIndex]);

  const toggleSection = (index: number) => {
    setExpandedSections(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.path) {
      navigate(item.path);
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        onToggle();
      }
    }
  };

  const isActive = (item: MenuItem) => !!item.path && currentPath === item.path;

  return (
    <aside
      className={`
        ${collapsed ? 'translate-x-full lg:-translate-x-full' : 'translate-x-0'}
        fixed top-14 bottom-0 right-0 lg:left-0 lg:right-auto
        w-full lg:w-56
        bg-[#2B2D31] border-l lg:border-l-0 lg:border-r border-[#1A1C1F]
        flex flex-col transition-transform duration-300 z-40
      `}
    >
      {/* 데스크탑 접기/펼치기 버튼 */}
      <button
        onClick={onToggle}
        aria-label={collapsed ? '사이드바 펼치기' : '사이드바 접기'}
        className="hidden lg:flex absolute top-0 -right-8 w-8 h-8 bg-[#2B2D31] hover:bg-[#3A3D42] border-b border-l border-r border-[#1A1C1F] rounded-br-md items-center justify-center transition-colors z-10 cursor-pointer"
      >
        {collapsed ? (
          <ChevronsRight className="w-4 h-4 text-white/70" strokeWidth={2.5} />
        ) : (
          <ChevronsLeft className="w-4 h-4 text-white/70" strokeWidth={2.5} />
        )}
      </button>

      {/* 모바일 사용자 정보 */}
      <div className="lg:hidden flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
        <span className="text-[17px] font-bold text-white">서울연세약국님</span>
        <span className="px-2 py-0.5 bg-[#4E7FFF]/20 text-[#8BADFF] text-[12px] font-semibold rounded">개국약사</span>
      </div>

      {/* 모바일: 섹션 제목 + 플랫 리스트 */}
      <nav
        className="lg:hidden flex-1 overflow-y-auto pb-4 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="pt-5">
            <p className="px-5 pb-2 text-[13px] text-white/50 font-medium">{section.title}</p>
            <div>
              {section.items.map((item, itemIndex) => {
                const active = isActive(item);
                return (
                  <button
                    key={itemIndex}
                    onClick={() => handleItemClick(item)}
                    className={`
                      w-full flex items-center justify-between px-5 py-[14px] transition-colors cursor-pointer
                      ${active
                        ? 'bg-white/5 text-[#8BADFF] font-bold'
                        : 'text-white hover:bg-white/5 font-bold'
                      }
                    `}
                  >
                    <span className="text-[16px]">{item.name}</span>
                    <ChevronRight className="w-5 h-5 text-white/40" strokeWidth={2} />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* 데스크탑: 기존 접기/펼치기 리스트 */}
      <nav className="hidden lg:block flex-1 px-3 pt-4 overflow-y-auto">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-4">
            <button
              onClick={() => toggleSection(sectionIndex)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm font-bold text-white/90 hover:text-white transition-colors cursor-pointer"
            >
              <span>{section.title}</span>
              {section.items.length > 0 && (
                expandedSections[sectionIndex] ? (
                  <ChevronDown className="w-3.5 h-3.5 text-white/60" strokeWidth={2.5} />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-white/60" strokeWidth={2.5} />
                )
              )}
            </button>
            {expandedSections[sectionIndex] && section.items.length > 0 && (
              <div className="mt-1 space-y-0.5">
                {section.items.map((item, itemIndex) => {
                  const active = isActive(item);
                  return (
                    <button
                      key={itemIndex}
                      onClick={() => handleItemClick(item)}
                      className={`
                        w-full flex items-center px-3 py-2 rounded-md text-xs transition-colors cursor-pointer
                        ${active
                          ? 'bg-[#4E7FFF]/20 text-[#8BADFF] font-semibold'
                          : 'text-white/60 hover:bg-white/10 hover:text-white/90 font-medium'
                        }
                      `}
                    >
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* 모바일 로그아웃 */}
      <div className="lg:hidden border-t border-white/10 px-5 py-4">
        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-white/20 text-[15px] font-semibold text-white/90 hover:bg-white/10 transition-colors cursor-pointer">
          <LogOut className="w-[18px] h-[18px]" strokeWidth={2} />
          로그아웃
        </button>
      </div>
    </aside>
  );
}
