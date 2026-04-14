import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area, AreaChart } from 'recharts';
import { TrendingUp, DollarSign } from 'lucide-react';

const data = [
  { month: '1월', orders: 245, revenue: 125000, target: 130000 },
  { month: '2월', orders: 312, revenue: 158000, target: 145000 },
  { month: '3월', orders: 289, revenue: 142000, target: 150000 },
  { month: '4월', orders: 367, revenue: 189000, target: 160000 },
  { month: '5월', orders: 421, revenue: 215000, target: 170000 },
  { month: '6월', orders: 398, revenue: 198000, target: 180000 },
];

export function OrdersRevenueChart() {
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const avgGrowth = 18.5;

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] hover:border-[#097969]/20 transition-all duration-500 h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#097969]/20 to-[#0A8F7C]/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#097969]" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1F2937]">주문 및 매출 현황</h3>
              <p className="text-sm text-[#6B7280]">최근 6개월 실적 지표</p>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gradient-to-br from-[#F0FDF9] to-[#E6F7F4] rounded-xl p-4 border border-[#097969]/10">
              <p className="text-xs font-bold text-[#6B7280] mb-1">총 매출</p>
              <p className="text-2xl font-bold text-[#097969]">₩{(totalRevenue / 10000).toFixed(0)}만</p>
            </div>
            <div className="bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] rounded-xl p-4 border border-[#3B82F6]/10">
              <p className="text-xs font-bold text-[#6B7280] mb-1">평균 성장률</p>
              <p className="text-2xl font-bold text-[#3B82F6]">+{avgGrowth}%</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#097969] to-[#0A8F7C] text-white text-sm font-bold shadow-lg shadow-[#097969]/25 hover:shadow-xl transition-all">
            6개월
          </button>
          <button className="px-4 py-2.5 rounded-xl bg-[#F9FAFB] text-[#6B7280] text-sm font-bold hover:bg-white border border-[#E5E7EB] hover:border-[#097969]/30 transition-all">
            1년
          </button>
          <button className="px-4 py-2.5 rounded-xl bg-[#F9FAFB] text-[#6B7280] text-sm font-bold hover:bg-white border border-[#E5E7EB] hover:border-[#097969]/30 transition-all">
            전체
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#097969" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#097969" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 13, fontWeight: 700 }}
              dy={12}
            />
            <YAxis
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 700 }}
              dx={-10}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 700 }}
              dx={10}
              tickFormatter={(value) => `₩${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '16px',
                padding: '16px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              }}
              labelStyle={{ fontWeight: 800, color: '#1F2937', marginBottom: '12px', fontSize: '14px' }}
              itemStyle={{ fontSize: '13px', fontWeight: 700, padding: '4px 0' }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '24px' }}
              iconType="circle"
              formatter={(value) => <span style={{ color: '#1F2937', fontWeight: 700, fontSize: '13px' }}>{value}</span>}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              fill="url(#revenueGradient)"
              stroke="none"
            />
            <Bar
              yAxisId="left"
              dataKey="orders"
              fill="url(#barGradient)"
              radius={[10, 10, 0, 0]}
              name="주문 건수"
              maxBarSize={50}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="#097969"
              strokeWidth={4}
              dot={{ fill: '#097969', r: 7, strokeWidth: 3, stroke: 'white' }}
              activeDot={{ r: 10, fill: '#097969', strokeWidth: 4, stroke: 'white' }}
              name="매출액"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="target"
              stroke="#9CA3AF"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="목표"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
