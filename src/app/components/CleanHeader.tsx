import { ShoppingCart, Settings } from 'lucide-react';

export function CleanHeader() {
  return (
    <header className="h-14 bg-[#2B2D31] border-b border-[#1A1C1F] flex items-center px-6 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between w-full">
        <img src="/Logo.png" alt="PlatPharm" className="h-7 brightness-0 invert" />
        <div className="flex items-center gap-3">
          <button className="relative p-1.5 hover:bg-white/10 rounded-md transition-colors">
            <ShoppingCart className="w-5 h-5 text-white/80" strokeWidth={2} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#4E7FFF] text-white text-[10px] font-bold rounded-full flex items-center justify-center">8</span>
          </button>
          <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors">
            <Settings className="w-5 h-5 text-white/80" strokeWidth={2} />
          </button>
          <div className="w-px h-5 bg-white/20 mx-1" />
          <span className="text-white/70 text-sm">서울연세의원님</span>
          <button className="text-white/90 hover:text-white text-sm font-medium transition-colors">
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
}
