import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';

// 월별 데이터 (2026년 전체)
const allMonthlyData = [
  { month: '1월', revenue: 125 },
  { month: '2월', revenue: 158 },
  { month: '3월', revenue: 142 },
  { month: '4월', revenue: 189 },
  { month: '5월', revenue: null },
  { month: '6월', revenue: null },
  { month: '7월', revenue: null },
  { month: '8월', revenue: null },
  { month: '9월', revenue: null },
  { month: '10월', revenue: null },
  { month: '11월', revenue: null },
  { month: '12월', revenue: null },
];

// 일별 데이터 생성 (4월 1일부터 시작하여 5월까지 이어지도록)
const generateAllDailyData = () => {
  const data = [];
  const currentDate = new Date(2026, 3, 14); // 2026년 4월 14일 (현재)

  // 4월 1일부터 5월 7일까지 (총 37일, 7일씩 5주 이상)
  for (let i = 0; i < 37; i++) {
    const date = new Date(2026, 3, 1 + i); // 4월 1일부터 시작
    const isPast = date <= currentDate;
    const isToday = date.getTime() === currentDate.getTime();

    const month = date.getMonth() + 1;
    const day = date.getDate();

    // 4월은 "1일", "2일", ...
    // 5월 1일만 "5월 1일", 그 이후는 "2일", "3일", ...
    let label;
    if (day === 1) {
      label = `${month}월 ${day}일`;
    } else {
      label = `${day}일`;
    }

    data.push({
      label,
      revenue: isPast ? Math.floor(Math.random() * 10) + 5 : null,
      color: isToday ? '#BAE1FF' : '#E9ECEF',
    });
  }

  return data;
};

const allDailyData = generateAllDailyData();

export function CleanBarChart() {
  const [viewMode, setViewMode] = useState<'monthly' | 'daily'>('monthly');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // 현재 월(4월 = 인덱스 3)이 포함된 페이지 (6개월씩 나눔)
  const [monthlyPage, setMonthlyPage] = useState(() => Math.floor(3 / 6));
  const [dailyPage, setDailyPage] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const triggerAnim = () => setAnimKey(prev => prev + 1);

  const handlePrevPeriod = () => {
    if (viewMode === 'monthly') {
      if (monthlyPage > 0) {
        setMonthlyPage(monthlyPage - 1);
        triggerAnim();
      }
    } else {
      if (dailyPage > 0) {
        setDailyPage(dailyPage - 1);
        triggerAnim();
      }
    }
  };

  const handleNextPeriod = () => {
    if (viewMode === 'monthly') {
      if (monthlyPage < 1) {
        setMonthlyPage(monthlyPage + 1);
        triggerAnim();
      }
    } else {
      const maxDailyPage = Math.floor(allDailyData.length / 7);
      if (dailyPage < maxDailyPage) {
        setDailyPage(dailyPage + 1);
        triggerAnim();
      }
    }
  };

  // 데이터 가져오기
  const getMonthlyData = () => {
    const startIndex = monthlyPage * 6;
    const endIndex = startIndex + 6;
    return allMonthlyData.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      color: (startIndex + index) === 3 ? '#BAE1FF' : '#E9ECEF', // 4월(인덱스 3)만 파란색
    }));
  };

  const getDailyData = () => {
    const startIndex = dailyPage * 7;
    const endIndex = startIndex + 7;
    return allDailyData.slice(startIndex, endIndex);
  };

  const data = viewMode === 'monthly' ? getMonthlyData() : getDailyData();

  // Y축 설정
  const maxValue = viewMode === 'monthly' ? 240 : 20;
  const yAxisStep = viewMode === 'monthly' ? 40 : 4;
  const yAxisValues = [];
  for (let i = 0; i <= maxValue; i += yAxisStep) {
    yAxisValues.push(i);
  }

  const chartHeight = 200; // 차트 높이(px)

  // 현재 기간 표시
  const getPeriodLabel = () => {
    if (viewMode === 'monthly') {
      return monthlyPage === 0 ? '2026년 1~6월' : '2026년 7~12월';
    } else {
      const startIndex = dailyPage * 7;
      const currentData = allDailyData.slice(startIndex, startIndex + 7);
      if (currentData.length > 0) {
        const firstLabel = currentData[0].label;
        const lastLabel = currentData[currentData.length - 1].label;
        return `2026년 4월 ${firstLabel} ~ ${lastLabel}`;
      }
      return '2026년 4월';
    }
  };

  const periodLabel = getPeriodLabel();

  return (
    <div className="bg-white rounded-lg p-6 border border-[#DEE2E6]">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-base font-bold text-[#212529]">구매 현황</h3>
              <span className="text-sm text-[#868E96] font-medium">{periodLabel}</span>
            </div>
            <p className="text-sm text-[#868E96]">
              {viewMode === 'monthly' ? '월별' : '일별'} 구매 금액 추이 (단위: 백만원)
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* 이전/다음 버튼 */}
            <div className="flex items-center gap-1 border border-[#DEE2E6] rounded-lg">
              <button
                onClick={handlePrevPeriod}
                className="p-2 hover:bg-[#F8F9FA] transition-colors rounded-l-lg"
              >
                <ChevronLeft className="w-4 h-4 text-[#868E96]" strokeWidth={2.5} />
              </button>
              <div className="w-px h-6 bg-[#DEE2E6]"></div>
              <button
                onClick={handleNextPeriod}
                className="p-2 hover:bg-[#F8F9FA] transition-colors rounded-r-lg"
              >
                <ChevronRight className="w-4 h-4 text-[#868E96]" strokeWidth={2.5} />
              </button>
            </div>

            {/* 월별/일별 드롭다운 */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="px-4 py-2 rounded-lg border border-[#DEE2E6] text-[#495057] text-sm font-medium hover:bg-[#F8F9FA] transition-colors flex items-center gap-2"
              >
                {viewMode === 'monthly' ? '월별' : '일별'}
                <ChevronDown className="w-4 h-4" strokeWidth={2.5} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-[#DEE2E6] rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => {
                      setViewMode('monthly');
                      setMonthlyPage(Math.floor(3 / 6)); // 현재 월(4월=인덱스3) 페이지로
                      setDropdownOpen(false);
                      triggerAnim();
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-[#F8F9FA] transition-colors rounded-t-lg ${
                      viewMode === 'monthly' ? 'text-[#4E7FFF] font-semibold' : 'text-[#495057]'
                    }`}
                  >
                    월별
                  </button>
                  <button
                    onClick={() => {
                      setViewMode('daily');
                      // 현재 날짜(4월 14일 = 인덱스 13)가 포함된 페이지로 이동
                      const todayIndex = allDailyData.findIndex((_, i) => {
                        const date = new Date(2026, 3, 1 + i);
                        return date.getTime() === new Date(2026, 3, 14).getTime();
                      });
                      setDailyPage(Math.floor(todayIndex / 7));
                      setDropdownOpen(false);
                      triggerAnim();
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-[#F8F9FA] transition-colors rounded-b-lg ${
                      viewMode === 'daily' ? 'text-[#4E7FFF] font-semibold' : 'text-[#495057]'
                    }`}
                  >
                    일별
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Y축 레이블 */}
        <div className="flex flex-col-reverse justify-between" style={{ height: `${chartHeight}px` }}>
          {yAxisValues.map((value) => (
            <div key={value} className="text-xs text-[#ADB5BD] font-medium">
              {value}
            </div>
          ))}
        </div>

        {/* 차트 영역 */}
        <div className="flex-1">
          {/* 그리드 라인 */}
          <div className="relative" style={{ height: `${chartHeight}px` }}>
            <div className="absolute inset-0 flex flex-col-reverse">
              {yAxisValues.map((value, index) => (
                <div
                  key={value}
                  className="flex-1 border-t border-[#F1F3F5] first:border-t-0"
                />
              ))}
            </div>

            {/* 차트 바 */}
            <div key={animKey} className="absolute inset-0 flex items-end gap-3">
              {data.map((item, index) => {
                const barHeight = item.revenue ? (item.revenue / maxValue) * chartHeight : 0;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full relative" style={{ height: `${chartHeight}px` }}>
                      <div className="absolute bottom-0 w-full flex flex-col items-center">
                        {item.revenue !== null && item.revenue !== undefined && (
                          <>
                            <span
                              className="text-sm font-semibold text-[#212529] mb-2"
                              style={{
                                animation: `barFadeIn 400ms ease-out ${index * 100 + 400}ms both`,
                              }}
                            >
                              {item.revenue}
                            </span>
                            <div
                              className="w-full rounded-t-md"
                              style={{
                                height: `${barHeight}px`,
                                backgroundColor: item.color,
                                transformOrigin: 'bottom',
                                animation: `barGrow 600ms ease-out ${index * 100}ms both`,
                              }}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* X축 레이블 */}
          <div className="flex gap-3 mt-3">
            {data.map((item: any, index: number) => (
              <div key={index} className="flex-1 text-center">
                <span className="text-sm text-[#495057] font-medium">
                  {'month' in item ? item.month : item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
