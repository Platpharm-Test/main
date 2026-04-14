import { CleanSidebar } from './components/CleanSidebar';
import { CleanHeader } from './components/CleanHeader';
import { CleanBarChart } from './components/CleanBarChart';
import { CleanTable } from './components/CleanTable';
import { StatCard } from './components/StatCard';
import { CompanyList } from './components/CompanyList';
import { ShoppingCart, Settings } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <CleanHeader />
      <CleanSidebar />

      {/* Main Content */}
      <main className="ml-56 mt-14 p-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Page Header */}
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-sm text-[#868E96] mb-1">안녕하세요!</p>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#212529]">서울연세의원님</h2>
                <span className="px-2.5 py-1 bg-[#EDF2FF] text-[#4E7FFF] text-xs font-semibold rounded">병/의원 의사</span>
              </div>
            </div>
            <button className="px-5 py-2.5 bg-[#4E7FFF] text-white text-sm font-semibold rounded-lg hover:bg-[#3D6FEF] transition-colors">
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
            />
            <StatCard
              label="의약품 구매"
              value="156"
              sublabel="이번 달 주문"
              description="배송 중 8건"
            />
            <StatCard
              label="결제 관리"
              value="₩2.48억"
              sublabel="이번 달 결제액"
              description="미결제 ₩1,245만"
            />
            <StatCard
              label="장부·반품관리"
              value="12"
              sublabel="반품 신청 중"
              description="승인 대기 5건"
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

          {/* Ledger Section */}
          <div className="mb-6">
            <div className="bg-white rounded-lg border border-[#DEE2E6] p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-bold text-[#212529] mb-0.5">구매 장부</h3>
                  <p className="text-sm text-[#868E96]">구매 내역 및 결제 현황</p>
                </div>
                <button className="text-sm text-[#4E7FFF] font-semibold hover:text-[#3D6FEF] transition-colors">
                  전체 보기
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* 이번 주 구매액 */}
                <div className="bg-[#F8F9FA] rounded-lg p-4">
                  <p className="text-xs text-[#868E96] font-medium mb-2">이번 주 구매액</p>
                  <p className="text-xl font-bold text-[#212529] mb-1">₩1.58억</p>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-[#40C057]">+12.3%</span>
                    <span className="text-xs text-[#ADB5BD]">전주 대비</span>
                  </div>
                </div>

                {/* 이번 달 구매액 */}
                <div className="bg-[#F8F9FA] rounded-lg p-4">
                  <p className="text-xs text-[#868E96] font-medium mb-2">이번 달 구매액</p>
                  <p className="text-xl font-bold text-[#212529] mb-1">₩6.25억</p>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-[#40C057]">+8.7%</span>
                    <span className="text-xs text-[#ADB5BD]">전월 대비</span>
                  </div>
                </div>

                {/* 미결제 금액 */}
                <div className="bg-[#FFF5F5] rounded-lg p-4">
                  <p className="text-xs text-[#868E96] font-medium mb-2">미결제 금액</p>
                  <p className="text-xl font-bold text-[#FA5252] mb-1">₩1,245만</p>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-[#FA5252]">3건</span>
                    <span className="text-xs text-[#ADB5BD]">결제 기한 임박</span>
                  </div>
                </div>
              </div>
            </div>
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