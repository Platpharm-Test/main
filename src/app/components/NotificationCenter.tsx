import { AlertCircle, PackageX, TrendingDown, Clock, CheckCircle2, Bell, X } from 'lucide-react';

const notifications = [
  {
    id: 1,
    title: '새로운 반품 요청',
    description: '주문번호 #ORD-2451 - 메드코프',
    time: '5분 전',
    icon: PackageX,
    color: 'text-[#F59E0B]',
    bg: 'bg-[#FEF3C7]',
    priority: 'high',
    unread: true,
  },
  {
    id: 2,
    title: '재고 부족 알림',
    description: '아스피린 100mg - 45개 남음',
    time: '12분 전',
    icon: TrendingDown,
    color: 'text-[#EF4444]',
    bg: 'bg-[#FEE2E2]',
    priority: 'urgent',
    unread: true,
  },
  {
    id: 3,
    title: '결제 완료',
    description: '헬스플러스 - ₩32,100,000',
    time: '35분 전',
    icon: CheckCircle2,
    color: 'text-[#10B981]',
    bg: 'bg-[#ECFDF5]',
    priority: 'normal',
    unread: true,
  },
  {
    id: 4,
    title: '결제 대기 중',
    description: '청구서 #INV-8821 기한 초과',
    time: '1시간 전',
    icon: Clock,
    color: 'text-[#3B82F6]',
    bg: 'bg-[#DBEAFE]',
    priority: 'high',
    unread: false,
  },
  {
    id: 5,
    title: '계약 만료 임박',
    description: '헬스플러스 - 7일 남음',
    time: '2시간 전',
    icon: AlertCircle,
    color: 'text-[#8B5CF6]',
    bg: 'bg-[#EDE9FE]',
    priority: 'normal',
    unread: false,
  },
];

export function NotificationCenter() {
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] hover:border-[#097969]/20 transition-all duration-500 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EF4444]/20 to-[#EF4444]/10 flex items-center justify-center relative">
            <Bell className="w-5 h-5 text-[#EF4444]" strokeWidth={2.5} />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#EF4444] rounded-full flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">{unreadCount}</span>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1F2937]">알림</h3>
            <p className="text-sm text-[#6B7280]">{unreadCount}개 읽지 않음</p>
          </div>
        </div>
        <button className="text-xs font-bold text-[#097969] hover:text-[#075F54] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#F0FDF9]">
          전체 보기
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-2 flex-1 overflow-y-auto">
        {notifications.map((notification, index) => {
          const Icon = notification.icon;
          return (
            <div
              key={notification.id}
              className={`relative p-4 rounded-xl border transition-all duration-300 cursor-pointer group ${
                notification.unread
                  ? 'bg-gradient-to-r from-[#F0FDF9] to-white border-[#097969]/20 hover:border-[#097969]/40'
                  : 'bg-white border-[#F3F4F6] hover:border-[#E5E7EB] hover:bg-[#F9FAFB]'
              }`}
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.08}s both`,
              }}
            >
              {/* Priority indicator */}
              {notification.priority === 'urgent' && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-[#EF4444] rounded-full animate-pulse"></div>
              )}

              <div className="flex gap-3">
                <div className={`w-11 h-11 rounded-xl ${notification.bg} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
                  <Icon className={`w-5 h-5 ${notification.color}`} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className={`text-sm font-bold truncate ${notification.unread ? 'text-[#1F2937]' : 'text-[#6B7280]'}`}>
                      {notification.title}
                    </p>
                    {notification.unread && (
                      <div className="w-2 h-2 bg-[#097969] rounded-full flex-shrink-0 mt-1"></div>
                    )}
                  </div>
                  <p className="text-xs text-[#6B7280] mb-2 line-clamp-2">
                    {notification.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#9CA3AF] font-semibold">{notification.time}</p>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3.5 h-3.5 text-[#9CA3AF] hover:text-[#EF4444]" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-[#E5E7EB] space-y-2">
        <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#097969] to-[#0A8F7C] hover:from-[#0A8F7C] hover:to-[#097969] text-white text-sm font-bold transition-all duration-300 shadow-md shadow-[#097969]/20 hover:shadow-lg">
          모두 읽음으로 표시
        </button>
      </div>
    </div>
  );
}
