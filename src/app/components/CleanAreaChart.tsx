import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts';

// 월별 데이터 (2026년)
const allMonthlyData = [
  { month: '1월', revenue: 125 },
  { month: '2월', revenue: 158 },
  { month: '3월', revenue: 142 },
  { month: '4월', revenue: 189 },
  { month: '5월', revenue: 0 },
  { month: '6월', revenue: 0 },
  { month: '7월', revenue: 0 },
  { month: '8월', revenue: 0 },
  { month: '9월', revenue: 0 },
  { month: '10월', revenue: 0 },
  { month: '11월', revenue: 0 },
  { month: '12월', revenue: 0 },
];

const generateAllDailyData = () => {
  const data: { label: string; revenue: number }[] = [];
  const currentDate = new Date(2026, 3, 14);
  for (let i = 0; i < 37; i++) {
    const date = new Date(2026, 3, 1 + i);
    const isPast = date <= currentDate;
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const label = day === 1 ? `${month}월 ${day}일` : `${day}일`;
    data.push({
      label,
      revenue: isPast ? Math.floor(Math.random() * 10) + 5 : 0,
    });
  }
  return data;
};

const allDailyData = generateAllDailyData();

export function CleanAreaChart() {
  const [viewMode, setViewMode] = useState<'monthly' | 'daily'>('monthly');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [monthlyPage, setMonthlyPage] = useState(() => Math.floor(3 / 6));
  const [dailyPage, setDailyPage] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const triggerAnim = () => setAnimKey(prev => prev + 1);

  const handlePrev = () => {
    if (viewMode === 'monthly') {
      if (monthlyPage > 0) {
        setMonthlyPage(monthlyPage - 1);
        triggerAnim();
      }
    } else if (dailyPage > 0) {
      setDailyPage(dailyPage - 1);
      triggerAnim();
    }
  };

  const handleNext = () => {
    if (viewMode === 'monthly') {
      if (monthlyPage < 1) {
        setMonthlyPage(monthlyPage + 1);
        triggerAnim();
      }
    } else {
      const maxPage = Math.floor(allDailyData.length / 7);
      if (dailyPage < maxPage) {
        setDailyPage(dailyPage + 1);
        triggerAnim();
      }
    }
  };

  const getMonthlyData = () => {
    const start = monthlyPage * 6;
    return allMonthlyData.slice(start, start + 6);
  };
  const getDailyData = () => {
    const start = dailyPage * 7;
    return allDailyData.slice(start, start + 7);
  };

  const data = viewMode === 'monthly' ? getMonthlyData() : getDailyData();
  const xKey = viewMode === 'monthly' ? 'month' : 'label';
  const maxValue = viewMode === 'monthly' ? 240 : 20;

  const periodLabel = viewMode === 'monthly'
    ? (monthlyPage === 0 ? '2026년 1~6월' : '2026년 7~12월')
    : (() => {
        const start = dailyPage * 7;
        const cur = allDailyData.slice(start, start + 7);
        if (cur.length > 0) return `2026년 4월 ${cur[0].label} ~ ${cur[cur.length - 1].label}`;
        return '2026년 4월';
      })();

  return (
    <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="text-[#4E7FFF] inline-flex" style={{ fontSize: '20px' }}>
            <TrendingUpIcon fontSize="inherit" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#212529]">구매 현황</h3>
              <span className="text-xs text-[#ADB5BD]">{periodLabel}</span>
            </div>
            <p className="text-xs text-[#868E96] mt-0.5">
              {viewMode === 'monthly' ? '월별' : '일별'} 구매 금액 추이 (단위: 백만원)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center border border-[#DEE2E6] rounded-lg overflow-hidden">
            <button onClick={handlePrev} className="p-2 hover:bg-[#F8F9FA] transition-colors">
              <ChevronLeft className="w-3.5 h-3.5 text-[#868E96]" strokeWidth={2.5} />
            </button>
            <div className="w-px h-5 bg-[#DEE2E6]" />
            <button onClick={handleNext} className="p-2 hover:bg-[#F8F9FA] transition-colors">
              <ChevronRight className="w-3.5 h-3.5 text-[#868E96]" strokeWidth={2.5} />
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="px-3 py-2 rounded-lg border border-[#DEE2E6] text-[#495057] text-xs font-semibold hover:bg-[#F8F9FA] transition-colors flex items-center gap-1.5"
            >
              {viewMode === 'monthly' ? '월별' : '일별'}
              <ChevronDown className="w-3.5 h-3.5" strokeWidth={2.5} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-28 bg-white border border-[#DEE2E6] rounded-lg shadow-lg z-10 overflow-hidden">
                <button
                  onClick={() => {
                    setViewMode('monthly');
                    setMonthlyPage(Math.floor(3 / 6));
                    setDropdownOpen(false);
                    triggerAnim();
                  }}
                  className={`w-full px-3 py-2 text-left text-xs hover:bg-[#F8F9FA] ${viewMode === 'monthly' ? 'text-[#4E7FFF] font-semibold' : 'text-[#495057]'}`}
                >
                  월별
                </button>
                <button
                  onClick={() => {
                    setViewMode('daily');
                    const todayIdx = 13;
                    setDailyPage(Math.floor(todayIdx / 7));
                    setDropdownOpen(false);
                    triggerAnim();
                  }}
                  className={`w-full px-3 py-2 text-left text-xs hover:bg-[#F8F9FA] ${viewMode === 'daily' ? 'text-[#4E7FFF] font-semibold' : 'text-[#495057]'}`}
                >
                  일별
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full h-64" key={animKey}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4E7FFF" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#4E7FFF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F5" vertical={false} />
            <XAxis
              dataKey={xKey}
              tick={{ fontSize: 12, fill: '#868E96' }}
              axisLine={{ stroke: '#DEE2E6' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#ADB5BD' }}
              axisLine={false}
              tickLine={false}
              domain={[0, maxValue]}
            />
            <Tooltip
              contentStyle={{
                background: '#fff',
                border: '1px solid #DEE2E6',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(v: number) => [`${v} 백만원`, '구매액']}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#4E7FFF"
              strokeWidth={2.5}
              fill="url(#areaFill)"
              animationDuration={700}
              dot={{ fill: '#4E7FFF', r: 4, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
