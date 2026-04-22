import { ShoppingCart, Settings } from 'lucide-react';
import { useNavigate } from 'react-router';

interface CleanHeaderProps {
  onMenuClick?: () => void;
  menuOpen?: boolean;
  cartCount?: number;
}

function MorphMenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="28"
      height="20"
      viewBox="0 0 28 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="text-white/90"
    >
      <line
        x1="3"
        x2="25"
        y1="4"
        y2="4"
        style={{
          transformOrigin: '14px 4px',
          transform: open ? 'translateY(6px) rotate(45deg)' : 'none',
          transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
      <line
        x1="3"
        x2="25"
        y1="10"
        y2="10"
        style={{
          opacity: open ? 0 : 1,
          transition: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
      <line
        x1="3"
        x2="25"
        y1="16"
        y2="16"
        style={{
          transformOrigin: '14px 16px',
          transform: open ? 'translateY(-6px) rotate(-45deg)' : 'none',
          transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
    </svg>
  );
}

export function CleanHeader({ onMenuClick, menuOpen, cartCount = 0 }: CleanHeaderProps) {
  const navigate = useNavigate();
  return (
    <header className="h-14 bg-[#2B2D31] border-b border-[#1A1C1F] flex items-center px-4 sm:px-6 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between w-full">
        <button onClick={() => navigate('/1')} aria-label="대시보드로 이동" className="cursor-pointer">
          <img src="/Logo.png" alt="PlatPharm" className="h-6 sm:h-7 brightness-0 invert" />
        </button>
        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={() => navigate('/cart')} aria-label="장바구니로 이동" className="relative p-1.5 hover:bg-white/10 rounded-md transition-colors cursor-pointer">
            <ShoppingCart className="w-5 h-5 text-white/80" strokeWidth={2} />
            {cartCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#4E7FFF] text-white text-[10px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>}
          </button>
          <button className="hidden lg:inline-flex p-1.5 hover:bg-white/10 rounded-md transition-colors cursor-pointer">
            <Settings className="w-5 h-5 text-white/80" strokeWidth={2} />
          </button>
          <div className="hidden lg:block w-px h-5 bg-white/20 mx-1" />
          <span className="hidden lg:inline text-white/70 text-sm">서울연세약국님</span>
          <button className="hidden lg:inline text-white/90 hover:text-white text-sm font-medium transition-colors cursor-pointer">
            로그아웃
          </button>
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
              className="lg:hidden p-1.5 hover:bg-white/10 rounded-md transition-colors cursor-pointer"
            >
              <MorphMenuIcon open={!!menuOpen} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
