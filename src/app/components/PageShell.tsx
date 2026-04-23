import { useEffect, useState, type ReactNode } from 'react';
import { CleanHeader } from './CleanHeader';
import { CleanSidebar } from './CleanSidebar';
import { useCart } from '../lib/cart';

const isDesktop = () => typeof window !== 'undefined' && window.innerWidth >= 1024;

interface PageShellProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function PageShell({ title, description, actions, children }: PageShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(isDesktop);
  const { cartKindCount } = useCart();

  useEffect(() => {
    const handler = () => {
      if (!isDesktop()) setSidebarOpen(false);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      <CleanHeader
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        menuOpen={sidebarOpen}
        cartCount={cartKindCount}
      />
      <CleanSidebar collapsed={!sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main className={`${sidebarOpen ? 'lg:ml-56' : 'lg:ml-0'} mt-14 p-4 sm:p-6 lg:p-8 transition-all duration-300`}>
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-[#212529]">{title}</h1>
              {description && <p className="mt-1 text-sm text-[#868E96]">{description}</p>}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
