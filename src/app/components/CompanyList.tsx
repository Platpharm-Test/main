const companies = [
  { name: '유한양행', code: 'YUH001', orders: 45, amount: '₩1.25억', rank: 1, trend: '+5.2%', status: '활성', lastOrder: '26/04/14' },
  { name: '한미약품', code: 'HAN002', orders: 38, amount: '₩9,872만', rank: 2, trend: '+3.1%', status: '활성', lastOrder: '26/04/13' },
  { name: '대웅제약', code: 'DAE003', orders: 32, amount: '₩8,734만', rank: 3, trend: '-1.4%', status: '활성', lastOrder: '26/04/12' },
  { name: '삼진제약', code: 'SAM004', orders: 28, amount: '₩7,412만', rank: 4, trend: '+0.8%', status: '보류', lastOrder: '26/04/10' },
  { name: '한국얀센', code: 'JAN005', orders: 24, amount: '₩6,590만', rank: 5, trend: '+2.6%', status: '활성', lastOrder: '26/04/13' },
];

const rankColors = ['bg-[#4E7FFF] text-white', 'bg-[#212529] text-white', 'bg-[#868E96] text-white', 'bg-[#E9ECEF] text-[#495057]', 'bg-[#E9ECEF] text-[#495057]'];

export function CompanyList() {
  return (
    <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-[#212529]">공급사 거래 현황</h3>
          <p className="text-xs sm:text-sm text-[#868E96] mt-1">거래 금액 기준 상위 공급사</p>
        </div>
        <button className="flex items-center gap-1 text-sm text-[#4E7FFF] font-semibold hover:text-[#3D6FEF] transition-colors cursor-pointer">
          전체보기
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="px-4 sm:px-6 pb-4 sm:pb-6 overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead className="bg-[#F8F9FA]">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-bold text-[#495057] w-16">순위</th>
              <th className="px-4 py-4 text-left text-xs font-bold text-[#495057]">공급사</th>
              <th className="px-4 py-4 text-center text-xs font-bold text-[#495057] w-20">상태</th>
              <th className="px-4 py-4 text-left text-xs font-bold text-[#495057] w-28">최근 주문일</th>
              <th className="px-4 py-4 text-right text-xs font-bold text-[#495057] w-24">주문 건수</th>
              <th className="px-4 py-4 text-right text-xs font-bold text-[#495057] w-28">거래 금액</th>
              <th className="px-4 py-4 text-right text-xs font-bold text-[#495057] w-24">전월 대비</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company, index) => (
              <tr key={index} className="border-t border-[#F1F3F5] hover:bg-[#F8F9FA] transition-colors">
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${rankColors[index]}`}>
                    {company.rank}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#212529]">{company.name}</span>
                    <span className="text-xs text-[#ADB5BD] font-mono">{company.code}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    company.status === '활성'
                      ? 'bg-[#EDF2FF] text-[#4E7FFF]'
                      : 'bg-[#FFE3E3] text-[#C92A2A]'
                  }`}>
                    {company.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-[#868E96]">{company.lastOrder}</td>
                <td className="px-4 py-4 text-right text-sm text-[#495057]">{company.orders}건</td>
                <td className="px-4 py-4 text-right text-sm font-bold text-[#212529]">{company.amount}</td>
                <td className="px-4 py-4 text-right">
                  <span className={`text-sm font-semibold ${company.trend.startsWith('+') ? 'text-[#4E7FFF]' : 'text-[#FA5252]'}`}>
                    {company.trend}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
