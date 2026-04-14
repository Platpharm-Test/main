export function MinimalHeader() {
  return (
    <header className="h-16 bg-[#2B2D31] border-b border-[#1A1C1F] flex items-center px-6 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-8">
          <h1 className="text-white text-base font-bold">관제관리</h1>
          <nav className="flex items-center gap-6">
            <button className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              아카데미장
            </button>
            <button className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              사업자정보
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-white/80 hover:text-white text-sm font-medium">
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
}
