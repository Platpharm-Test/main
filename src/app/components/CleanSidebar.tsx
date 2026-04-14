import { ChevronDown, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useState } from 'react';

const menuSections = [
  {
    title: '대시보드',
    items: [
      { name: '전체 현황', active: true },
    ]
  },
  {
    title: '거래처 관리',
    items: [
      { name: '거래 신청 내역' },
      { name: '승인된 공급사' },
    ]
  },
  {
    title: '의약품 구매',
    items: [
      { name: '전체 상품' },
      { name: '장바구니' },
      { name: '주문 내역' },
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
      { name: '결제 내역' },
      { name: '미결제 내역' },
      { name: '결제수단 관리' },
    ]
  },
  {
    title: '장부·반품관리',
    items: [
      { name: '구매 장부' },
      { name: '반품 신청' },
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
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true,
  });

  const toggleSection = (index: number) => {
    setExpandedSections(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <aside className={`${collapsed ? '-translate-x-full' : 'translate-x-0'} w-56 bg-white border-r border-[#DEE2E6] h-screen fixed left-0 top-14 flex flex-col transition-transform duration-300`}>
      {/* 접기/펼치기 버튼 - 사이드바 바깥 오른쪽 */}
      <button
        onClick={onToggle}
        className="absolute top-0 -right-8 w-8 h-8 bg-white border-b border-l border-r border-[#DEE2E6] rounded-br-md flex items-center justify-center hover:bg-[#F8F9FA] transition-colors z-10"
      >
        {collapsed ? (
          <ChevronsRight className="w-4 h-4 text-[#868E96]" strokeWidth={2.5} />
        ) : (
          <ChevronsLeft className="w-4 h-4 text-[#868E96]" strokeWidth={2.5} />
        )}
      </button>

      <nav className="flex-1 px-3 pt-4 overflow-y-auto">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-4">
            <button
              onClick={() => toggleSection(sectionIndex)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm font-bold text-[#495057] hover:text-[#212529] transition-colors"
            >
              <span>{section.title}</span>
              {section.items.length > 0 && (
                expandedSections[sectionIndex] ? (
                  <ChevronDown className="w-3.5 h-3.5" strokeWidth={2.5} />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                )
              )}
            </button>
            {expandedSections[sectionIndex] && section.items.length > 0 && (
              <div className="mt-1 space-y-0.5">
                {section.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    className={`
                      w-full flex items-center px-3 py-2 rounded-md text-xs transition-colors
                      ${item.active
                        ? 'bg-[#EDF2FF] text-[#4E7FFF] font-semibold'
                        : 'text-[#868E96] hover:bg-[#F8F9FA] hover:text-[#495057] font-medium'
                      }
                    `}
                  >
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
