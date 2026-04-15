import HistoryIcon from '@mui/icons-material/History';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaidIcon from '@mui/icons-material/Paid';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ChevronRight } from 'lucide-react';
import { useState, type ReactNode } from 'react';

type Category = '전체' | '주문' | '배송' | '결제' | '반품';

interface Activity {
  time: string;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  category: Exclude<Category, '전체'>;
  title: string;
  detail: string;
}

const activities: Activity[] = [
  {
    time: '09:23',
    icon: <LocalShippingIcon fontSize="inherit" />,
    iconBg: 'bg-[#F3F0FF]',
    iconColor: 'text-[#7048E8]',
    category: '배송',
    title: '배송 출발',
    detail: '유한양행 · 리바푸라빈 디뮤코정',
  },
  {
    time: '09:15',
    icon: <PaidIcon fontSize="inherit" />,
    iconBg: 'bg-[#EDF2FF]',
    iconColor: 'text-[#4E7FFF]',
    category: '결제',
    title: '결제 완료',
    detail: '₩3,400,000',
  },
  {
    time: '08:47',
    icon: <AssignmentReturnIcon fontSize="inherit" />,
    iconBg: 'bg-[#FFF4E6]',
    iconColor: 'text-[#F76707]',
    category: '반품',
    title: '반품 승인',
    detail: '게보린 정 20개',
  },
  {
    time: '08:30',
    icon: <ShoppingCartIcon fontSize="inherit" />,
    iconBg: 'bg-[#F3F0FF]',
    iconColor: 'text-[#7048E8]',
    category: '주문',
    title: '주문 접수',
    detail: '한미약품 · 파모큐정 20정',
  },
  {
    time: '08:12',
    icon: <CheckCircleIcon fontSize="inherit" />,
    iconBg: 'bg-[#E6FCF5]',
    iconColor: 'text-[#0CA678]',
    category: '주문',
    title: '공급사 승인',
    detail: '삼진제약 · 거래 시작',
  },
  {
    time: '07:45',
    icon: <LocalShippingIcon fontSize="inherit" />,
    iconBg: 'bg-[#F3F0FF]',
    iconColor: 'text-[#7048E8]',
    category: '배송',
    title: '배송 완료',
    detail: '대웅제약 · 미니베스트 디펙션성정',
  },
];

const categories: Category[] = ['전체', '주문', '배송', '결제', '반품'];

export function ActivityFeed() {
  const [filter, setFilter] = useState<Category>('전체');

  const filtered = (filter === '전체' ? activities : activities.filter((a) => a.category === filter)).slice(0, 4);
  const totalCount = activities.length;

  return (
    <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 h-full flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[#4E7FFF] inline-flex" style={{ fontSize: '20px' }}>
            <HistoryIcon fontSize="inherit" />
          </span>
          <h3 className="text-sm font-bold text-[#212529]">실시간 활동</h3>
        </div>
        <span className="text-xs text-[#868E96] font-medium">오늘 {totalCount}건</span>
      </div>

      {/* 필터 탭 */}
      <div className="flex items-center gap-1.5 mb-4 flex-wrap">
        {categories.map((cat) => {
          const active = filter === cat;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                active
                  ? 'bg-[#4E7FFF] text-white'
                  : 'bg-[#F8F9FA] text-[#868E96] hover:bg-[#F1F3F5]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 타임라인 */}
      <div className="relative flex-1 overflow-y-auto min-h-[260px]">
        {filtered.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-xs text-[#ADB5BD]">해당 항목의 활동이 없습니다</p>
          </div>
        ) : (
          <>
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-[#F1F3F5]" />
            <div className="space-y-3">
              {filtered.map((activity, i) => (
                <button
                  key={i}
                  className="w-full group flex items-start gap-3 relative hover:bg-[#F8F9FA] -mx-2 px-2 py-1.5 rounded-lg transition-colors text-left"
                >
                  <div className={`w-8 h-8 rounded-full ${activity.iconBg} flex items-center justify-center shrink-0 relative z-10`}>
                    <span className={`${activity.iconColor} inline-flex`} style={{ fontSize: '16px' }}>
                      {activity.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-[#212529]">{activity.title}</p>
                      <span className="text-xs text-[#ADB5BD]">{activity.time}</span>
                    </div>
                    <p className="text-xs text-[#868E96] truncate">{activity.detail}</p>
                  </div>
                  <ChevronRight
                    className="w-4 h-4 text-[#CED4DA] opacity-0 group-hover:opacity-100 transition-opacity mt-2.5"
                    strokeWidth={2.5}
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 푸터 - 전체 보기 */}
      <div className="mt-3 pt-3 border-t border-[#F1F3F5] flex justify-center">
        <button className="text-xs text-[#4E7FFF] font-semibold hover:text-[#3D6FEF] transition-colors inline-flex items-center gap-1 cursor-pointer">
          전체 활동 내역 보기
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
