import { TrendingUp, Package } from 'lucide-react';

const products = [
  { name: '아스피린 100mg', company: '바이엘코리아', sales: '₩12,450,000', growth: 24, stock: 85 },
  { name: '타이레놀 500mg', company: '한국얀센', sales: '₩9,820,000', growth: 18, stock: 62 },
  { name: '게보린 정', company: '삼진제약', sales: '₩8,340,000', growth: 15, stock: 45 },
  { name: '판피린 큐', company: '동아제약', sales: '₩7,120,000', growth: 12, stock: 38 },
];

export function TopProductsWidget() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] hover:border-[#097969]/20 transition-all duration-500 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F59E0B]/20 to-[#F59E0B]/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-[#F59E0B]" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1F2937]">인기 의약품</h3>
            <p className="text-sm text-[#6B7280]">이번 주 판매 순위</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {products.map((product, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#F9FAFB] transition-all duration-300 cursor-pointer group border border-transparent hover:border-[#E5E7EB]"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#097969]/10 to-[#0A8F7C]/5 font-bold text-[#097969] text-sm">
              #{index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#1F2937] mb-0.5 truncate">{product.name}</p>
              <p className="text-xs text-[#6B7280] truncate">{product.company}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-[#1F2937] mb-0.5">{product.sales}</p>
              <div className="flex items-center gap-1 justify-end">
                <TrendingUp className="w-3 h-3 text-[#10B981]" strokeWidth={3} />
                <span className="text-xs font-bold text-[#10B981]">{product.growth}%</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-[#6B7280]" strokeWidth={2.5} />
              <span className={`text-xs font-bold ${product.stock > 50 ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>
                {product.stock}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-3 rounded-xl bg-[#F9FAFB] hover:bg-[#097969] text-[#6B7280] hover:text-white text-sm font-bold transition-all duration-300">
        전체 카탈로그 보기
      </button>
    </div>
  );
}
