import { Building2, TrendingUp } from 'lucide-react';

const companies = [
  { name: '메드코프', orders: 45, revenue: '₩125,430,000', growth: 24, color: '#097969' },
  { name: '헬스플러스', orders: 38, revenue: '₩98,720,000', growth: 18, color: '#3B82F6' },
  { name: '큐어파마', orders: 32, revenue: '₩87,340,000', growth: 15, color: '#8B5CF6' },
  { name: '바이탈메드', orders: 28, revenue: '₩74,120,000', growth: 12, color: '#F59E0B' },
  { name: '바이오케어', orders: 24, revenue: '₩65,900,000', growth: 8, color: '#10B981' },
];

export function CompanyPerformance() {
  const maxRevenue = Math.max(...companies.map(c => parseInt(c.revenue.replace(/[^0-9]/g, ''))));

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] hover:border-[#097969]/20 transition-all duration-500 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B82F6]/20 to-[#3B82F6]/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-[#3B82F6]" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1F2937]">제약사별 거래 현황</h3>
            <p className="text-sm text-[#6B7280]">이번 달 상위 5개사</p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {companies.map((company, index) => {
          const revenueNum = parseInt(company.revenue.replace(/[^0-9]/g, ''));
          const percentage = (revenueNum / maxRevenue) * 100;

          return (
            <div key={index} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-md"
                    style={{ background: `linear-gradient(135deg, ${company.color}, ${company.color}dd)` }}
                  >
                    {company.name.substring(0, 2)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[#1F2937] mb-0.5">{company.name}</p>
                    <p className="text-xs text-[#6B7280]">{company.orders}건 주문</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#1F2937] mb-0.5">{company.revenue}</p>
                  <div className="flex items-center gap-1 justify-end">
                    <TrendingUp className="w-3 h-3 text-[#10B981]" strokeWidth={3} />
                    <span className="text-xs font-bold text-[#10B981]">{company.growth}%</span>
                  </div>
                </div>
              </div>
              <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${percentage}%`,
                    background: `linear-gradient(90deg, ${company.color}, ${company.color}cc)`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-5 py-3 rounded-xl bg-[#F9FAFB] hover:bg-[#097969] text-[#6B7280] hover:text-white text-sm font-bold transition-all duration-300 border border-[#E5E7EB] hover:border-[#097969]">
        전체 제약사 보기
      </button>
    </div>
  );
}
