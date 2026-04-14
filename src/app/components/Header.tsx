import { Search, Bell, Calendar, Filter, Download, Plus } from 'lucide-react';

export function Header() {
  return (
    <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-[#E5E7EB] flex items-center px-8 gap-6 fixed top-0 right-0 left-72 z-10">
      <div className="flex items-center justify-between w-full">
        {/* Left section */}
        <div className="flex items-center gap-4 flex-1">
          {/* Search Bar */}
          <div className="flex-1 max-w-xl relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280] transition-colors group-focus-within:text-[#097969]" strokeWidth={2.5} />
            <input
              type="text"
              placeholder="의약품명, 회사명, 주문번호 검색..."
              className="w-full h-12 pl-12 pr-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-sm text-[#1F2937] placeholder:text-[#9CA3AF] font-medium
                         focus:outline-none focus:ring-2 focus:ring-[#097969]/20 focus:border-[#097969] focus:bg-white
                         transition-all duration-300 hover:border-[#D1D5DB]"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
              <kbd className="px-2 py-1 bg-white border border-[#E5E7EB] rounded text-xs text-[#6B7280] font-bold shadow-sm">⌘</kbd>
              <kbd className="px-2 py-1 bg-white border border-[#E5E7EB] rounded text-xs text-[#6B7280] font-bold shadow-sm">K</kbd>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button className="h-12 px-4 rounded-xl bg-[#F9FAFB] hover:bg-white border border-[#E5E7EB] hover:border-[#097969]/30 flex items-center gap-2 transition-all duration-300 hover:shadow-md group">
              <Filter className="w-4 h-4 text-[#6B7280] group-hover:text-[#097969] transition-colors" strokeWidth={2.5} />
              <span className="text-sm font-semibold text-[#6B7280] group-hover:text-[#1F2937]">필터</span>
            </button>
            <button className="h-12 px-4 rounded-xl bg-[#F9FAFB] hover:bg-white border border-[#E5E7EB] hover:border-[#097969]/30 flex items-center gap-2 transition-all duration-300 hover:shadow-md group">
              <Calendar className="w-4 h-4 text-[#6B7280] group-hover:text-[#097969] transition-colors" strokeWidth={2.5} />
              <span className="text-sm font-semibold text-[#6B7280] group-hover:text-[#1F2937]">기간</span>
            </button>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Export Button */}
          <button className="h-12 px-4 rounded-xl border border-[#E5E7EB] hover:border-[#097969]/30 bg-white hover:bg-[#F9FAFB] flex items-center gap-2 transition-all duration-300 hover:shadow-md group">
            <Download className="w-4 h-4 text-[#6B7280] group-hover:text-[#097969] transition-colors" strokeWidth={2.5} />
            <span className="text-sm font-semibold text-[#6B7280] group-hover:text-[#1F2937]">내보내기</span>
          </button>

          {/* New Order Button */}
          <button className="h-12 px-5 rounded-xl bg-gradient-to-r from-[#097969] to-[#0A8F7C] hover:from-[#0A8F7C] hover:to-[#097969] text-white flex items-center gap-2 transition-all duration-300 shadow-lg shadow-[#097969]/25 hover:shadow-xl hover:shadow-[#097969]/30 font-semibold text-sm">
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            새 주문
          </button>

          {/* Divider */}
          <div className="w-px h-8 bg-[#E5E7EB]"></div>

          {/* Notification Bell */}
          <button className="relative w-12 h-12 rounded-xl bg-[#F9FAFB] hover:bg-white border border-[#E5E7EB] hover:border-[#097969]/30 flex items-center justify-center transition-all duration-300 hover:shadow-md group">
            <Bell className="w-5 h-5 text-[#6B7280] group-hover:text-[#097969] transition-colors" strokeWidth={2.5} />
            <span className="absolute top-1 right-1 w-5 h-5 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-lg animate-pulse">
              8
            </span>
          </button>

          {/* User Profile */}
          <button className="flex items-center gap-3 pl-2 pr-4 py-2 h-12 rounded-xl hover:bg-[#F9FAFB] border border-transparent hover:border-[#E5E7EB] transition-all duration-300 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#097969] to-[#0A8F7C] flex items-center justify-center shadow-md shadow-[#097969]/20">
                <span className="text-white font-bold text-sm">김</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#10B981] rounded-full border-2 border-white"></div>
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-[#1F2937] group-hover:text-[#097969] transition-colors">김철수</p>
              <p className="text-xs text-[#6B7280] font-medium">관리자</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
