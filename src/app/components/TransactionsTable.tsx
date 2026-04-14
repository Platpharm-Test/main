import { Download, Filter, Eye, MoreVertical } from 'lucide-react';

const transactions = [
  { id: 'ORD-2451', company: '메드코프', date: '2026. 4. 14', time: '14:32', amount: '₩45,230,000', items: 12, status: '완료' },
  { id: 'ORD-2450', company: '헬스플러스', date: '2026. 4. 14', time: '13:15', amount: '₩32,100,000', items: 8, status: '대기중' },
  { id: 'ORD-2449', company: '큐어파마', date: '2026. 4. 13', time: '16:45', amount: '₩28,450,000', items: 6, status: '완료' },
  { id: 'ORD-2448', company: '바이탈메드', date: '2026. 4. 13', time: '11:20', amount: '₩19,800,000', items: 5, status: '반품됨' },
  { id: 'ORD-2447', company: '바이오케어', date: '2026. 4. 12', time: '15:10', amount: '₩52,900,000', items: 15, status: '완료' },
  { id: 'ORD-2446', company: '메디서플라이', date: '2026. 4. 12', time: '10:30', amount: '₩38,750,000', items: 10, status: '대기중' },
];

const statusConfig = {
  '완료': { bg: 'bg-[#ECFDF5]', text: 'text-[#059669]', border: 'border-[#A7F3D0]', dot: 'bg-[#10B981]' },
  '대기중': { bg: 'bg-[#FEF3C7]', text: 'text-[#D97706]', border: 'border-[#FDE68A]', dot: 'bg-[#F59E0B]' },
  '반품됨': { bg: 'bg-[#FEE2E2]', text: 'text-[#DC2626]', border: 'border-[#FECACA]', dot: 'bg-[#EF4444]' },
};

export function TransactionsTable() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] hover:border-[#097969]/20 transition-all duration-500 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-[#1F2937] mb-1">최근 거래 내역</h3>
          <p className="text-sm text-[#6B7280]">총 {transactions.length}건의 주문</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-[#6B7280] text-sm font-bold hover:bg-[#F9FAFB] hover:border-[#097969]/30 transition-all flex items-center gap-2 group">
            <Filter className="w-4 h-4 group-hover:text-[#097969]" strokeWidth={2.5} />
            필터
          </button>
          <button className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-[#6B7280] text-sm font-bold hover:bg-[#F9FAFB] hover:border-[#097969]/30 transition-all flex items-center gap-2 group">
            <Download className="w-4 h-4 group-hover:text-[#097969]" strokeWidth={2.5} />
            내보내기
          </button>
          <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#097969] to-[#0A8F7C] text-white text-sm font-bold shadow-lg shadow-[#097969]/25 hover:shadow-xl transition-all flex items-center gap-2">
            <Eye className="w-4 h-4" strokeWidth={2.5} />
            전체 보기
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-[#E5E7EB]">
              <th className="text-left py-4 px-4 text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                주문번호
              </th>
              <th className="text-left py-4 px-4 text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                회사명
              </th>
              <th className="text-left py-4 px-4 text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                일시
              </th>
              <th className="text-left py-4 px-4 text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                항목 수
              </th>
              <th className="text-left py-4 px-4 text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                총 금액
              </th>
              <th className="text-left py-4 px-4 text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                상태
              </th>
              <th className="text-right py-4 px-4 text-xs font-bold text-[#6B7280] uppercase tracking-wider">

              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => {
              const statusStyle = statusConfig[transaction.status as keyof typeof statusConfig];
              return (
                <tr
                  key={transaction.id}
                  className="border-b border-[#F3F4F6] hover:bg-gradient-to-r hover:from-[#F9FAFB] hover:to-transparent transition-all cursor-pointer group"
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`,
                  }}
                >
                  <td className="py-4 px-4">
                    <span className="text-sm font-bold text-[#097969] group-hover:text-[#075F54] transition-colors">
                      {transaction.id}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#097969]/10 to-[#0A8F7C]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-sm font-bold text-[#097969]">
                          {transaction.company.substring(0, 2)}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-[#1F2937]">{transaction.company}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm font-semibold text-[#1F2937]">{transaction.date}</p>
                      <p className="text-xs text-[#9CA3AF] font-medium">{transaction.time}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-semibold text-[#6B7280]">{transaction.items}개 품목</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-bold text-[#1F2937]">{transaction.amount}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot} animate-pulse`}></div>
                      {transaction.status}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="w-8 h-8 rounded-lg hover:bg-[#F3F4F6] flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-4 h-4 text-[#6B7280]" strokeWidth={2.5} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#E5E7EB]">
        <p className="text-sm text-[#6B7280] font-medium">1-6 of 156 건</p>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg border border-[#E5E7EB] text-[#6B7280] text-sm font-bold hover:bg-[#F9FAFB] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            이전
          </button>
          <button className="px-4 py-2 rounded-lg bg-[#097969] text-white text-sm font-bold">1</button>
          <button className="px-4 py-2 rounded-lg border border-[#E5E7EB] text-[#6B7280] text-sm font-bold hover:bg-[#F9FAFB] transition-all">2</button>
          <button className="px-4 py-2 rounded-lg border border-[#E5E7EB] text-[#6B7280] text-sm font-bold hover:bg-[#F9FAFB] transition-all">3</button>
          <button className="px-4 py-2 rounded-lg border border-[#E5E7EB] text-[#6B7280] text-sm font-bold hover:bg-[#F9FAFB] transition-all">
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
