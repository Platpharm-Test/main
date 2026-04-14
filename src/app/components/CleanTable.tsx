const rawTransactionData = [
  {
    category: '최근 주문',
    medicine: '리바푸라빈 디뮤코정',
    supplier: '유한양행',
    date: '26/04/14',
    quantity: '60개',
    unitPrice: '₩1,287',
    total: '₩77,220',
    status: '배송중'
  },
  {
    category: '최근 주문',
    medicine: '파모큐정 20정',
    supplier: '한미약품',
    date: '26/04/13',
    quantity: '30개',
    unitPrice: '₩2,450',
    total: '₩73,500',
    status: '완료'
  },
  {
    category: '최근 주문',
    medicine: '미니베스트 디펙션성정',
    supplier: '대웅제약',
    date: '26/04/12',
    quantity: '120개',
    unitPrice: '₩850',
    total: '₩102,000',
    status: '완료'
  },
  {
    category: '결제 대기',
    medicine: '아스피린 100mg',
    supplier: '바이엘코리아',
    date: '26/04/14',
    quantity: '200개',
    unitPrice: '₩450',
    total: '₩90,000',
    status: '대기'
  },
  {
    category: '결제 대기',
    medicine: '타이레놀 500mg',
    supplier: '한국얀센',
    date: '26/04/13',
    quantity: '150개',
    unitPrice: '₩680',
    total: '₩102,000',
    status: '대기'
  },
  {
    category: '반품 처리',
    medicine: '게보린 정',
    supplier: '삼진제약',
    date: '26/04/11',
    quantity: '20개',
    unitPrice: '₩1,200',
    total: '₩24,000',
    status: '처리중'
  },
];

// 날짜순 정렬 (최신순)
const transactionData = [...rawTransactionData].sort((a, b) => {
  const dateA = new Date('20' + a.date.replace(/\//g, '-'));
  const dateB = new Date('20' + b.date.replace(/\//g, '-'));
  return dateB.getTime() - dateA.getTime();
});

const statusStyles: Record<string, string> = {
  '배송중': 'text-[#4E7FFF]',
  '완료': 'text-[#10B981]',
  '대기': 'text-[#868E96]',
  '처리중': 'text-[#FA5252]',
};

export function CleanTable() {
  return (
    <div className="bg-white rounded-lg border border-[#DEE2E6] overflow-hidden">
      <div className="px-6 py-5 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#212529]">주문 내역</h3>
          <p className="text-sm text-[#868E96] mt-1">최근 주문 및 배송 현황</p>
        </div>
        <button className="text-sm text-[#4E7FFF] font-semibold hover:text-[#3D6FEF] transition-colors">
          전체 보기
        </button>
      </div>

      <div className="px-6 pb-6">
        <table className="w-full table-fixed">
          <colgroup>
            <col style={{ width: '8%' }} />
            <col style={{ width: '11%' }} />
            <col style={{ width: '27%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '11%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '10%' }} />
          </colgroup>
          <thead className="bg-[#F8F9FA]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-[#495057]">경과구분</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-[#495057]">공급사</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-[#495057]">의약품명</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-[#495057]">주문일</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-[#495057]">수량</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-[#495057]">단가</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-[#495057]">합계</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-[#495057]">상태</th>
            </tr>
          </thead>
          <tbody>
            {transactionData.map((item, index) => (
              <tr key={index} className="border-t border-[#F1F3F5] hover:bg-[#F8F9FA] transition-colors">
                <td className="px-6 py-4 text-sm text-[#495057] truncate">{item.category}</td>
                <td className="px-6 py-4 text-sm text-[#868E96] truncate">{item.supplier}</td>
                <td className="px-6 py-4 text-sm text-[#212529] font-semibold truncate">{item.medicine}</td>
                <td className="px-6 py-4 text-sm text-[#868E96] truncate">{item.date}</td>
                <td className="px-6 py-4 text-sm text-[#495057] text-right truncate">{item.quantity}</td>
                <td className="px-6 py-4 text-sm text-[#868E96] text-right truncate">{item.unitPrice}</td>
                <td className="px-6 py-4 text-sm text-[#212529] font-bold text-right truncate">{item.total}</td>
                <td className="px-6 py-4 text-sm text-center truncate">
                  <span className={`font-semibold ${statusStyles[item.status]}`}>
                    {item.status}
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
