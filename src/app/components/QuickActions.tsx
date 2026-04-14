export function QuickActions() {
  return (
    <div className="bg-white rounded-lg border border-[#DEE2E6] p-6">
      <h3 className="text-base font-bold text-[#212529] mb-1">빠른 작업</h3>
      <p className="text-sm text-[#868E96] mb-5">자주 사용하는 기능 바로가기</p>
      <div className="space-y-2">
        <button className="w-full px-4 py-3 rounded-lg bg-[#4E7FFF] text-white text-sm font-semibold hover:bg-[#3D6FEF] transition-colors text-left">
          의약품 주문하기
        </button>
        <button className="w-full px-4 py-3 rounded-lg border border-[#DEE2E6] text-[#495057] text-sm font-medium hover:bg-[#F8F9FA] transition-colors text-left">
          공급사 거래 신청
        </button>
        <button className="w-full px-4 py-3 rounded-lg border border-[#DEE2E6] text-[#495057] text-sm font-medium hover:bg-[#F8F9FA] transition-colors text-left">
          장바구니 확인
        </button>
        <button className="w-full px-4 py-3 rounded-lg border border-[#DEE2E6] text-[#495057] text-sm font-medium hover:bg-[#F8F9FA] transition-colors text-left">
          결제수단 관리
        </button>
      </div>
    </div>
  );
}
