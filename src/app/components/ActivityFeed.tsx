import { CheckCircle2, Clock, XCircle, AlertCircle, Package, FileText } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'success',
    icon: CheckCircle2,
    title: '주문 #ORD-2451 승인 완료',
    description: '메드코프 - 아스피린 100mg 외 3건',
    time: '2분 전',
    color: 'text-[#10B981]',
    bg: 'bg-[#ECFDF5]',
  },
  {
    id: 2,
    type: 'pending',
    icon: Clock,
    title: '결제 대기 중',
    description: '헬스플러스 - 청구서 #INV-8821',
    time: '15분 전',
    color: 'text-[#F59E0B]',
    bg: 'bg-[#FEF3C7]',
  },
  {
    id: 3,
    type: 'info',
    icon: Package,
    title: '재고 자동 주문',
    description: '타이레놀 500mg - 200박스 발주',
    time: '1시간 전',
    color: 'text-[#3B82F6]',
    bg: 'bg-[#DBEAFE]',
  },
  {
    id: 4,
    type: 'warning',
    icon: AlertCircle,
    title: '계약 갱신 알림',
    description: '바이탈메드 - 7일 후 만료 예정',
    time: '2시간 전',
    color: 'text-[#F59E0B]',
    bg: 'bg-[#FEF3C7]',
  },
  {
    id: 5,
    type: 'error',
    icon: XCircle,
    title: '반품 요청',
    description: '큐어파마 - 주문 #ORD-2448',
    time: '3시간 전',
    color: 'text-[#EF4444]',
    bg: 'bg-[#FEE2E2]',
  },
  {
    id: 6,
    type: 'success',
    icon: FileText,
    title: '계약 체결',
    description: '글로벌헬스 - 연간 공급 계약',
    time: '4시간 전',
    color: 'text-[#10B981]',
    bg: 'bg-[#ECFDF5]',
  },
];

export function ActivityFeed() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] hover:border-[#097969]/20 transition-all duration-500 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-[#1F2937] mb-1">최근 활동</h3>
          <p className="text-sm text-[#6B7280]">실시간 시스템 업데이트</p>
        </div>
        <button className="text-xs font-semibold text-[#097969] hover:text-[#075F54] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#F0FDF9]">
          전체 보기
        </button>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div
              key={activity.id}
              className="flex gap-3 p-3 rounded-xl hover:bg-[#F9FAFB] transition-all duration-300 cursor-pointer group border border-transparent hover:border-[#E5E7EB]"
              style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both` }}
            >
              <div className={`w-10 h-10 rounded-xl ${activity.bg} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                <Icon className={`w-5 h-5 ${activity.color}`} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#1F2937] mb-0.5 truncate">
                  {activity.title}
                </p>
                <p className="text-xs text-[#6B7280] mb-1 truncate">
                  {activity.description}
                </p>
                <p className="text-xs text-[#9CA3AF] font-medium">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
