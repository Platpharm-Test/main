const schedules = [
  { title: '근무자의 반환 안함', dates: [
    { date: '2020/08/12', time: '04:00-20:00', status: '대기' },
    { date: '2020/5/18', time: '10:00-39:00', status: '승인' },
    { date: '2020/8/31', time: '10:00-22:30', status: '대기' },
  ]},
  { title: '블록 오전 안함', dates: [
    { date: '2020/10/2', time: '22:00-23:00', status: '안함' },
    { date: '2020/10/18', time: '22:00-23:00', status: '안함' },
  ]},
  { title: '특이사항 안함', dates: [
    { date: '2020.08.29', time: '2020 08.30', status: '' },
    { date: '2020.08.29', time: '2020 08.30', status: '' },
  ]},
];

const statusColors: Record<string, string> = {
  '대기': 'text-[#FA5252]',
  '승인': 'text-[#4E7FFF]',
  '안함': 'text-[#868E96]',
};

export function ScheduleTable() {
  return (
    <div className="bg-white rounded-lg border border-[#DEE2E6] overflow-hidden">
      <div className="p-6 border-b border-[#DEE2E6]">
        <h3 className="text-base font-bold text-[#212529]">근무 시간 근무 현황</h3>
      </div>

      <div className="divide-y divide-[#DEE2E6]">
        {schedules.map((schedule, index) => (
          <div key={index} className="grid grid-cols-4 gap-4 p-6">
            <div className="font-medium text-sm text-[#212529]">
              {schedule.title}
            </div>
            <div className="col-span-3 space-y-3">
              {schedule.dates.map((date, dateIndex) => (
                <div key={dateIndex} className="flex items-center gap-8">
                  <span className="text-sm text-[#495057] min-w-[100px]">{date.date}</span>
                  <span className="text-sm text-[#495057] min-w-[120px]">{date.time}</span>
                  {date.status && (
                    <span className={`text-sm font-medium ${statusColors[date.status] || 'text-[#868E96]'}`}>
                      {date.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
