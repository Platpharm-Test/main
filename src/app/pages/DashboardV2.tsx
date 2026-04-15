import { CleanSidebar } from '../components/CleanSidebar';
import { CleanHeader } from '../components/CleanHeader';
import { CleanTable } from '../components/CleanTable';
import { CompanyList } from '../components/CompanyList';
import { FeatureDonutCard } from '../components/FeatureDonutCard';
import { NoticeStrip } from '../components/NoticeStrip';
import { CleanAreaChart } from '../components/CleanAreaChart';
import { AlertList } from '../components/AlertList';
import { QuickActions } from '../components/QuickActions';
import { ActivityFeed } from '../components/ActivityFeed';
import { MobileOrderList } from '../components/MobileOrderList';
import { MobileCompanyList } from '../components/MobileCompanyList';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DescriptionIcon from '@mui/icons-material/Description';
import { useEffect, useState } from 'react';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return '안녕하세요, 좋은 아침입니다!';
  if (hour >= 12 && hour < 14) return '안녕하세요, 좋은 점심입니다!';
  if (hour >= 14 && hour < 18) return '안녕하세요, 좋은 오후입니다!';
  return '안녕하세요, 좋은 밤입니다!';
}

export default function DashboardV2() {
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024);

  useEffect(() => {
    if (sidebarOpen && typeof window !== 'undefined' && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      <CleanHeader onMenuClick={() => setSidebarOpen((v) => !v)} menuOpen={sidebarOpen} />
      <CleanSidebar collapsed={!sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />


      <main className={`${sidebarOpen ? 'lg:ml-56' : 'lg:ml-0'} mt-14 p-4 sm:p-6 lg:p-8 transition-all duration-300`}>
        <div className="max-w-[1400px] mx-auto">
          {/* Page Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <p className="text-xs sm:text-sm text-[#868E96] mb-1">{getGreeting()}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-[#212529]">서울연세의원님</h2>
                <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-[#EDF2FF] text-[#4E7FFF] text-[10px] sm:text-xs font-semibold rounded">병/의원 의사</span>
              </div>
            </div>
            <button className="w-full sm:w-auto h-14 sm:h-auto px-4 sm:px-5 sm:py-2.5 bg-[#4E7FFF] text-white text-sm font-semibold rounded-xl sm:rounded-lg hover:bg-[#3D6FEF] transition-colors cursor-pointer">
              의약품 주문하기
            </button>
          </div>

          {/* 공지 스트립 */}
          <div className="mb-6">
            <NoticeStrip />
          </div>

          {/* Hero: 4 Feature Donut Cards */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
            <FeatureDonutCard
              color="blue"
              icon={<AccountBalanceWalletIcon fontSize="inherit" />}
              title="결제 현황"
              rightTitle="결제 누적"
              rightSubtitle="26/04/01 ~ 26/04/30"
              percentage={85}
              centerLabel="결제 완료율"
              stats={[
                { label: '결제완료', value: '₩2.12억', dot: '#4E7FFF' },
                { label: '미결제', value: '₩1,245만', dot: '#FA5252' },
                { label: '처리중', value: '₩340만', dot: '#FFD43B' },
                { label: '취소', value: '-', dot: '#ADB5BD' },
              ]}
            />
            <FeatureDonutCard
              color="violet"
              icon={<LocalShippingIcon fontSize="inherit" />}
              title="배송 현황"
              rightTitle="배송 누적"
              rightSubtitle="26/04/01 ~ 26/04/30"
              percentage={75}
              centerLabel="배송 완료율"
              stats={[
                { label: '배송 완료', value: '118', dot: '#7048E8' },
                { label: '배송 중', value: '8', dot: '#B197FC' },
                { label: '배송 대기', value: '15', dot: '#FFD43B' },
                { label: '취소', value: '2', dot: '#FA5252' },
              ]}
            />
            <FeatureDonutCard
              color="emerald"
              icon={<StorefrontIcon fontSize="inherit" />}
              title="공급사 현황"
              rightTitle="거래 누적"
              rightSubtitle="26/04/01 ~ 26/04/30"
              percentage={80}
              centerLabel="승인 완료율"
              stats={[
                { label: '활성', value: '24', dot: '#0CA678' },
                { label: '대기', value: '3', dot: '#FFD43B' },
                { label: '거절', value: '2', dot: '#FA5252' },
                { label: '신규 신청', value: '5', dot: '#ADB5BD' },
              ]}
            />
            <FeatureDonutCard
              color="orange"
              icon={<DescriptionIcon fontSize="inherit" />}
              title="반품 현황"
              rightTitle="반품 누적"
              rightSubtitle="26/04/01 ~ 26/04/30"
              percentage={29}
              centerLabel="처리 완료율"
              stats={[
                { label: '완료', value: '5', dot: '#F76707' },
                { label: '처리중', value: '12', dot: '#FFA94D' },
                { label: '대기', value: '5', dot: '#FFD43B' },
                { label: '거절', value: '1', dot: '#FA5252' },
              ]}
            />
          </div>

          {/* Area Chart (full width) */}
          <div className="mb-6">
            <CleanAreaChart />
          </div>

          {/* 재고 관리 + 실시간 활동 (2 columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <AlertList />
            <ActivityFeed />
          </div>

          {/* Transaction Table */}
          <div className="mb-6">
            <div className="hidden lg:block">
              <CleanTable />
            </div>
            <div className="lg:hidden">
              <MobileOrderList />
            </div>
          </div>

          {/* Company List */}
          <div className="mb-6">
            <div className="hidden lg:block">
              <CompanyList />
            </div>
            <div className="lg:hidden">
              <MobileCompanyList />
            </div>
          </div>
        </div>
      </main>

      {/* 플로팅 빠른 액션 */}
      <div className={sidebarOpen ? 'hidden lg:block' : ''}>
        <QuickActions />
      </div>
    </div>
  );
}
