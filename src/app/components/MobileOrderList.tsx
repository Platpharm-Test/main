const orders = [
  { category: '최근 주문', medicine: '리바푸라빈 디뮤코정', supplier: '유한양행', date: '26/04/14', quantity: '60개', total: '₩77,220', status: '배송중' },
  { category: '결제 대기', medicine: '아스피린 100mg', supplier: '바이엘코리아', date: '26/04/14', quantity: '200개', total: '₩90,000', status: '대기' },
  { category: '최근 주문', medicine: '파모큐정 20정', supplier: '한미약품', date: '26/04/13', quantity: '30개', total: '₩73,500', status: '완료' },
  { category: '결제 대기', medicine: '타이레놀 500mg', supplier: '한국얀센', date: '26/04/13', quantity: '150개', total: '₩102,000', status: '대기' },
  { category: '최근 주문', medicine: '미니베스트 디펙션성정', supplier: '대웅제약', date: '26/04/12', quantity: '120개', total: '₩102,000', status: '완료' },
];

const statusStyle: Record<string, string> = {
  '배송중': 'bg-[#EDF2FF] text-[#4E7FFF]',
  '완료': 'bg-[#E6FCF5] text-[#10B981]',
  '대기': 'bg-[#F1F3F5] text-[#868E96]',
  '처리중': 'bg-[#FFE3E3] text-[#FA5252]',
};

export function MobileOrderList() {
  return (
    <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-[#212529]">주문 내역</h3>
          <p className="text-xs text-[#868E96] mt-0.5">최근 주문 및 배송 현황</p>
        </div>
        <button className="shrink-0 text-xs text-[#4E7FFF] font-semibold hover:text-[#3D6FEF] transition-colors cursor-pointer flex items-center gap-0.5">
          전체보기
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="space-y-2.5">
        {orders.map((o, i) => (
          <button key={i} className="w-full text-left bg-[#F8F9FA] rounded-lg p-3 active:bg-[#F1F3F5] transition-colors cursor-pointer">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <p className="text-sm font-semibold text-[#212529] truncate flex-1">{o.medicine}</p>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${statusStyle[o.status]}`}>
                {o.status}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <p className="text-xs text-[#868E96] truncate">{o.category} · {o.supplier} · {o.quantity}</p>
              <p className="text-xs text-[#ADB5BD] shrink-0">{o.date}</p>
            </div>
            <p className="text-sm font-bold text-[#212529]">{o.total}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
