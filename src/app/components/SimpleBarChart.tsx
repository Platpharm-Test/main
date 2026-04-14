const data = [
  { month: '19일', value: 8, color: '#FFB3BA' },
  { month: '20일', value: 12, color: '#BAE1FF' },
  { month: '21일', value: 10, color: '#BAE1FF' },
  { month: '22일', value: 14, color: '#BAE1FF' },
  { month: '23일', value: 11, color: '#BAE1FF' },
  { month: '24일', value: 6, color: '#E9ECEF' },
  { month: '25일', value: 4, color: '#E9ECEF' },
];

export function SimpleBarChart() {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-white rounded-lg p-6 border border-[#DEE2E6]">
      <div className="mb-6">
        <h3 className="text-base font-bold text-[#212529] mb-2">라이언(Ryan) 님</h3>
        <p className="text-sm text-[#868E96]">
          금주 근무 현황 -{' '}
          <span className="text-[#FFB3BA]">
            블록에서 제외되신 분을 하루/날 *근무 근무 개수는 즉, 근무 근무를 한 후 (포함)(기간별 근무량계산 반영)
          </span>
        </p>
      </div>

      <div className="flex items-end justify-between gap-3 h-48 pb-8">
        {data.map((item, index) => {
          const heightPercent = (item.value / maxValue) * 100;
          return (
            <div key={index} className="flex flex-col items-center flex-1 gap-2">
              <div className="relative w-full flex items-end justify-center" style={{ height: '160px' }}>
                <div
                  className="w-full rounded-t-md transition-all duration-500 ease-out"
                  style={{
                    height: `${heightPercent}%`,
                    backgroundColor: item.color,
                  }}
                />
                <span className="absolute -top-6 text-xs font-medium text-[#212529]">
                  {item.value}
                </span>
              </div>
              <span className="text-xs text-[#868E96] font-medium">{item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
