import WarningIcon from '@mui/icons-material/Warning';

const alerts = [
  { name: '리바푸라빈 디뮤코정', date: '26/04/14', type: '품절 임박' },
  { name: '아스피린 100mg', date: '26/04/14', type: '재고 부족' },
  { name: '타이레놀 500mg', date: '26/04/13', type: '품절 임박' },
  { name: '파모큐정 20정', date: '26/04/12', type: '재고 부족' },
  { name: '게보린 정', date: '26/04/11', type: '품절' },
];

export function AlertList() {
  return (
    <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[#F76707] inline-flex" style={{ fontSize: '20px' }}>
            <WarningIcon fontSize="inherit" />
          </span>
          <h3 className="text-sm font-bold text-[#212529]">재고 알림</h3>
        </div>
        <button className="group flex items-center gap-1 text-xs text-[#4E7FFF] font-semibold hover:text-[#3D6FEF] transition-colors">
          전체 보기
          <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        {alerts.map((alert, i) => (
          <div key={i} className="flex items-center justify-between pb-3 border-b border-[#F1F3F5] last:border-b-0 last:pb-0">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#212529] truncate">{alert.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                    alert.type === '품절'
                      ? 'bg-[#FFE3E3] text-[#FA5252]'
                      : alert.type === '품절 임박'
                      ? 'bg-[#FFF4E6] text-[#F76707]'
                      : 'bg-[#FFF9DB] text-[#F59F00]'
                  }`}
                >
                  {alert.type}
                </span>
                <span className="text-xs text-[#ADB5BD]">{alert.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
