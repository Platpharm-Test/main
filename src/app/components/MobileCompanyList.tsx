const companies = [
  { name: '유한양행', code: 'YUH001', orders: 45, amount: '₩1.25억', rank: 1, trend: '+5.2%', status: '활성', lastOrder: '26/04/14' },
  { name: '한미약품', code: 'HAN002', orders: 38, amount: '₩9,872만', rank: 2, trend: '+3.1%', status: '활성', lastOrder: '26/04/13' },
  { name: '대웅제약', code: 'DAE003', orders: 32, amount: '₩8,734만', rank: 3, trend: '-1.4%', status: '활성', lastOrder: '26/04/12' },
  { name: '삼진제약', code: 'SAM004', orders: 28, amount: '₩7,412만', rank: 4, trend: '+0.8%', status: '보류', lastOrder: '26/04/10' },
  { name: '한국얀센', code: 'JAN005', orders: 24, amount: '₩6,590만', rank: 5, trend: '+2.6%', status: '활성', lastOrder: '26/04/13' },
];

const rankColors = ['bg-[#4E7FFF] text-white', 'bg-[#212529] text-white', 'bg-[#868E96] text-white', 'bg-[#E9ECEF] text-[#495057]', 'bg-[#E9ECEF] text-[#495057]'];

export function MobileCompanyList() {
  return (
    <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-[#212529]">공급사 거래 현황</h3>
          <p className="text-xs text-[#868E96] mt-0.5">거래 금액 기준 상위 공급사</p>
        </div>
        <button className="shrink-0 text-xs text-[#4E7FFF] font-semibold hover:text-[#3D6FEF] transition-colors cursor-pointer flex items-center gap-0.5">
          전체보기
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="space-y-2.5">
        {companies.map((c, i) => (
          <button key={i} className="w-full text-left bg-[#F8F9FA] rounded-lg p-3 active:bg-[#F1F3F5] transition-colors cursor-pointer">
            <div className="flex items-center gap-2.5 mb-2">
              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0 ${rankColors[i]}`}>
                {c.rank}
              </span>
              <p className="text-sm font-semibold text-[#212529] flex-1 truncate">{c.name}</p>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${
                c.status === '활성' ? 'bg-[#EDF2FF] text-[#4E7FFF]' : 'bg-[#FFE3E3] text-[#C92A2A]'
              }`}>
                {c.status}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <p className="text-[#868E96]">{c.orders}건 · {c.lastOrder}</p>
              <div className="flex items-center gap-2">
                <span className={`font-semibold ${c.trend.startsWith('+') ? 'text-[#4E7FFF]' : 'text-[#FA5252]'}`}>
                  {c.trend}
                </span>
                <span className="font-bold text-[#212529]">{c.amount}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
