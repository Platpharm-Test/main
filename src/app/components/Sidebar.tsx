import { LayoutDashboard, FileText, ShoppingCart, CreditCard, RotateCcw, Settings, Package, BarChart3 } from 'lucide-react';

const navItems = [
  { name: '대시보드', icon: LayoutDashboard, active: true, badge: null },
  { name: '의약품 카탈로그', icon: Package, active: false, badge: null },
  { name: '계약 관리', icon: FileText, active: false, badge: 3 },
  { name: '주문 처리', icon: ShoppingCart, active: false, badge: 12 },
  { name: '결제·수금', icon: CreditCard, active: false, badge: null },
  { name: '반품·클레임', icon: RotateCcw, active: false, badge: 5 },
  { name: '장부·분석', icon: BarChart3, active: false, badge: null },
  { name: '설정', icon: Settings, active: false, badge: null },
];

export function Sidebar() {
  return (
    <aside className="w-72 bg-gradient-to-b from-white to-[#FAFBFC] border-r border-[#E5E7EB] h-screen flex flex-col fixed left-0 top-0 shadow-sm">
      {/* Logo */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#097969] to-[#0A8F7C] flex items-center justify-center shadow-lg shadow-[#097969]/25">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#10B981] rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1F2937] tracking-tight">파마테크</h1>
            <p className="text-xs text-[#6B7280] font-semibold">B2B 제약 플랫폼</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-br from-[#097969] to-[#0A8F7C] rounded-2xl p-4 shadow-lg shadow-[#097969]/20">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-white/80">이번 달 매출</p>
            <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full font-bold">+18%</span>
          </div>
          <p className="text-2xl font-bold text-white mb-1">₩1.2억</p>
          <p className="text-xs text-white/70">목표: ₩1.5억</p>
          <div className="mt-3 bg-white/20 rounded-full h-1.5 overflow-hidden">
            <div className="bg-white h-full rounded-full" style={{ width: '80%' }}></div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative
                ${
                  item.active
                    ? 'bg-gradient-to-r from-[#097969] to-[#0A8F7C] text-white shadow-md shadow-[#097969]/20'
                    : 'text-[#6B7280] hover:bg-white hover:text-[#1F2937] hover:shadow-sm'
                }
              `}
            >
              <Icon className="w-5 h-5" strokeWidth={item.active ? 2.5 : 2} />
              <span className="font-semibold text-sm flex-1 text-left">{item.name}</span>
              {item.badge && (
                <span className={`
                  text-xs font-bold px-2 py-0.5 rounded-full
                  ${item.active ? 'bg-white/30 text-white' : 'bg-[#EF4444] text-white'}
                `}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-4 pb-4">
        <div className="bg-gradient-to-br from-[#F0FDF9] via-[#E6F7F4] to-[#D1FAE5] rounded-xl p-4 border border-[#097969]/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#097969]/5 rounded-full -mr-10 -mt-10"></div>
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#097969] to-[#0A8F7C] flex items-center justify-center mb-3 shadow-lg shadow-[#097969]/20">
              <span className="text-white text-lg">💡</span>
            </div>
            <p className="text-sm font-bold text-[#1F2937] mb-1">도움이 필요하세요?</p>
            <p className="text-xs text-[#6B7280] mb-3 leading-relaxed">24/7 지원팀이 대기중입니다</p>
            <button className="w-full bg-white hover:bg-[#097969] text-[#097969] hover:text-white text-xs font-bold py-2 px-4 rounded-lg transition-all duration-300 border border-[#097969]/20">
              문의하기
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
