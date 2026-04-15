import TodayIcon from '@mui/icons-material/Today';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import type { ReactNode } from 'react';

interface StatLineProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function StatLine({ label, value, highlight }: StatLineProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#F1F3F5] last:border-b-0">
      <span className="text-sm text-[#868E96]">{label}</span>
      <span className={`text-sm font-bold ${highlight ? 'text-[#FA5252]' : 'text-[#212529]'}`}>
        {value}
      </span>
    </div>
  );
}

interface CardHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  iconColor: string;
}

function CardHeader({ icon, title, subtitle, iconColor }: CardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <span className={`${iconColor} inline-flex`} style={{ fontSize: '20px' }}>
          {icon}
        </span>
        <h3 className="text-sm font-bold text-[#212529]">{title}</h3>
      </div>
      <span className="text-xs text-[#ADB5BD]">{subtitle}</span>
    </div>
  );
}

const inventoryTop = [
  { name: '리바푸라빈 디뮤코정', qty: 248 },
  { name: '파모큐정 20정', qty: 186 },
  { name: '아스피린 100mg', qty: 152 },
  { name: '타이레놀 500mg', qty: 94 },
  { name: '게보린 정', qty: 52 },
];

export function BottomStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
        <CardHeader
          icon={<TodayIcon fontSize="inherit" />}
          title="오늘의 주문"
          subtitle="26/04/15"
          iconColor="text-[#4E7FFF]"
        />
        <StatLine label="오늘 접수" value="8건" />
        <StatLine label="배송 예정" value="3건" />
        <StatLine label="오늘 결제액" value="₩4,280,000" />
      </div>

      <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
        <CardHeader
          icon={<Inventory2Icon fontSize="inherit" />}
          title="재고 TOP 5"
          subtitle="현재 수량 기준"
          iconColor="text-[#0CA678]"
        />
        <div>
          {inventoryTop.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-1.5 border-b border-[#F1F3F5] last:border-b-0"
            >
              <span className="text-xs text-[#495057] truncate flex-1 pr-2">{item.name}</span>
              <span className="text-xs font-bold text-[#212529] shrink-0">{item.qty}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
