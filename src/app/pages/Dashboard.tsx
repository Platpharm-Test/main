import { CleanSidebar } from '../components/CleanSidebar';
import { CleanHeader } from '../components/CleanHeader';
import { CleanBarChart } from '../components/CleanBarChart';
import { CleanTable } from '../components/CleanTable';
import { StatCard } from '../components/StatCard';
import { CompanyList } from '../components/CompanyList';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useCart } from '../lib/cart';

const isDesktop = () => typeof window !== 'undefined' && window.innerWidth >= 1024;

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return '안녕하세요, 좋은 아침입니다!';
  if (hour >= 12 && hour < 14) return '안녕하세요, 좋은 점심입니다!';
  if (hour >= 14 && hour < 18) return '안녕하세요, 좋은 오후입니다!';
  return '안녕하세요, 좋은 밤입니다!';
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(isDesktop);
  const navigate = useNavigate();
  const { cartKindCount } = useCart();

  useEffect(() => {
    const handler = () => {
      if (!isDesktop()) setSidebarOpen(false);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <CleanHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} menuOpen={sidebarOpen} cartCount={cartKindCount} />
      <CleanSidebar collapsed={!sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <main className={`${sidebarOpen ? 'ml-56' : 'ml-0'} mt-14 p-8 transition-all duration-300`}>
        <div className="max-w-[1400px] mx-auto">
          {/* Page Header */}
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-sm text-[#868E96] mb-1">{getGreeting()}</p>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#212529]">서울연세약국님</h2>
                <span className="px-2.5 py-1 bg-[#EDF2FF] text-[#4E7FFF] text-xs font-semibold rounded">개국약사</span>
              </div>
            </div>
            <button onClick={() => navigate('/products')} className="px-5 py-2.5 bg-[#4E7FFF] text-white text-sm font-semibold rounded-lg hover:bg-[#3D6FEF] transition-colors cursor-pointer">
              의약품 주문하기
            </button>
          </div>

          {/* Top Stats - Core Features */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="거래처 현황"
              value="24"
              sublabel="승인된 공급사"
              highlight={true}
              description="신규 신청 대기 3건"
              onClick={() => navigate('/partners')}
            />
            <StatCard
              label="의약품 구매"
              value="156"
              sublabel="이번 달 주문"
              description="배송 중 8건"
              onClick={() => navigate('/products')}
            />
            <StatCard
              label="결제 관리"
              value="₩2.48억"
              sublabel="이번 달 결제액"
              description="미결제 ₩1,245만"
              onClick={() => navigate('/payments')}
            />
            <StatCard
              label="장부·반품관리"
              value="12"
              sublabel="반품 신청 중"
              description="승인 대기 5건"
              onClick={() => navigate('/ledger')}
            />
          </div>

          {/* Chart Section */}
          <div className="mb-6">
            <CleanBarChart />
          </div>

          {/* Transaction Table - Full Width */}
          <div className="mb-6">
            <CleanTable />
          </div>

          {/* Company List */}
          <div className="mb-6">
            <CompanyList />
          </div>
        </div>
      </main>
    </div>
  );
}
