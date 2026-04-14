import { ChevronDown } from 'lucide-react';

const menuItems = [
  {
    name: '관제관리',
    active: true,
    submenu: ['서울시 관리', '인천시 관리', '그룹 계약관리 (KR)']
  },
  {
    name: '평가 현황',
    submenu: ['근무 제출 상태']
  },
  {
    name: '근무 계약 상태',
    submenu: []
  },
  {
    name: '구성원 근무 상세 상황',
    submenu: []
  },
  {
    name: '영업 상황',
    submenu: []
  },
  {
    name: '세무조 상황',
    submenu: []
  },
];

export function MinimalSidebar() {
  return (
    <aside className="w-56 bg-white border-r border-[#DEE2E6] h-screen fixed left-0 top-16 flex flex-col">
      <div className="p-6">
        <h2 className="text-sm font-bold text-[#212529] mb-1">관제관리</h2>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item, index) => (
          <div key={index}>
            <button
              className={`
                w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm transition-colors
                ${item.active ? 'text-[#212529] font-medium' : 'text-[#868E96] font-normal hover:text-[#212529]'}
              `}
            >
              <span>{item.name}</span>
              {item.submenu.length > 0 && (
                <ChevronDown className="w-4 h-4" strokeWidth={2} />
              )}
            </button>
            {item.active && item.submenu.length > 0 && (
              <div className="ml-3 mt-1 space-y-1">
                {item.submenu.map((sub, subIndex) => (
                  <button
                    key={subIndex}
                    className="w-full text-left px-3 py-2 text-sm text-[#868E96] hover:text-[#212529] transition-colors"
                  >
                    {sub}
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
