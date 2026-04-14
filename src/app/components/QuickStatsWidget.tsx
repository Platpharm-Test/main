import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const stats = [
  { label: '오늘 주문', value: '24', change: '+12%', positive: true, detail: '어제 대비' },
  { label: '대기 중 승인', value: '8', change: '-3', positive: false, detail: '처리 필요' },
  { label: '활성 계약', value: '156', change: '+5%', positive: true, detail: '이번 달' },
  { label: '평균 처리시간', value: '2.4h', change: '-0.3h', positive: true, detail: '지난주 대비' },
];

export function QuickStatsWidget() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-5 border border-[#E5E7EB] hover:border-[#097969]/30 hover:shadow-lg transition-all duration-300 group"
          style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both` }}
        >
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wide">{stat.label}</p>
            <div className={`flex items-center gap-0.5 px-2 py-1 rounded-lg ${stat.positive ? 'bg-[#ECFDF5]' : 'bg-[#FEF2F2]'}`}>
              {stat.positive ? (
                <ArrowUpRight className="w-3 h-3 text-[#10B981]" strokeWidth={3} />
              ) : (
                <ArrowDownRight className="w-3 h-3 text-[#EF4444]" strokeWidth={3} />
              )}
              <span className={`text-xs font-bold ${stat.positive ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                {stat.change}
              </span>
            </div>
          </div>
          <p className="text-3xl font-bold text-[#1F2937] mb-1 group-hover:text-[#097969] transition-colors">{stat.value}</p>
          <p className="text-xs text-[#9CA3AF] font-medium">{stat.detail}</p>
        </div>
      ))}
    </div>
  );
}
