const companies = [
  { name: '유한양행', code: 'YUH001', orders: 45, amount: '₩1.25억', rank: 1, trend: '+5.2%', status: '활성' },
  { name: '한미약품', code: 'HAN002', orders: 38, amount: '₩9,872만', rank: 2, trend: '+3.1%', status: '활성' },
  { name: '대웅제약', code: 'DAE003', orders: 32, amount: '₩8,734만', rank: 3, trend: '-1.4%', status: '활성' },
  { name: '삼진제약', code: 'SAM004', orders: 28, amount: '₩7,412만', rank: 4, trend: '+0.8%', status: '보류' },
  { name: '한국얀센', code: 'JAN005', orders: 24, amount: '₩6,590만', rank: 5, trend: '+2.6%', status: '활성' },
];

const rankColors = ['bg-[#4E7FFF] text-white', 'bg-[#212529] text-white', 'bg-[#868E96] text-white', 'bg-[#E9ECEF] text-[#495057]', 'bg-[#E9ECEF] text-[#495057]'];

export function CompanyList() {
  return (
    <div className="bg-white rounded-lg border border-[#DEE2E6] overflow-hidden">
      <div className="px-6 py-5 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#212529]">공급사 거래 현황</h3>
          <p className="text-sm text-[#868E96] mt-0.5">거래 금액 기준 상위 공급사</p>
        </div>
        <button className="text-sm text-[#4E7FFF] font-semibold hover:text-[#3D6FEF] transition-colors">
          전체 보기
        </button>
      </div>

      <div className="px-6 pb-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#DEE2E6]">
              <th className="py-3 text-left text-xs font-bold text-[#868E96] w-12">순위</th>
              <th className="py-3 text-left text-xs font-bold text-[#868E96]">공급사</th>
              <th className="py-3 text-center text-xs font-bold text-[#868E96]">상태</th>
              <th className="py-3 text-right text-xs font-bold text-[#868E96]">주문 건수</th>
              <th className="py-3 text-right text-xs font-bold text-[#868E96]">거래 금액</th>
              <th className="py-3 text-right text-xs font-bold text-[#868E96]">전월 대비</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company, index) => (
              <tr key={index} className="border-b border-[#F1F3F5] last:border-b-0 hover:bg-[#F8F9FA] transition-colors cursor-pointer">
                <td className="py-4">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${rankColors[index]}`}>
                    {company.rank}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#212529]">{company.name}</span>
                    <span className="text-xs text-[#ADB5BD] font-mono">{company.code}</span>
                  </div>
                </td>
                <td className="py-4 text-center">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    company.status === '활성'
                      ? 'bg-[#D3F9D8] text-[#2B8A3E]'
                      : 'bg-[#FFE3E3] text-[#C92A2A]'
                  }`}>
                    {company.status}
                  </span>
                </td>
                <td className="py-4 text-right text-sm text-[#495057]">{company.orders}건</td>
                <td className="py-4 text-right text-sm font-bold text-[#212529]">{company.amount}</td>
                <td className="py-4 text-right">
                  <span className={`text-sm font-semibold ${company.trend.startsWith('+') ? 'text-[#40C057]' : 'text-[#FA5252]'}`}>
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
