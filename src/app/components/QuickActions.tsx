import ReplayIcon from '@mui/icons-material/Replay';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import HandshakeIcon from '@mui/icons-material/Handshake';
import AddIcon from '@mui/icons-material/Add';
import { useState, type ReactNode } from 'react';

interface Action {
  icon: ReactNode;
  label: string;
  iconBg: string;
  iconColor: string;
}

const actions: Action[] = [
  {
    icon: <ReplayIcon fontSize="inherit" />,
    label: '재주문',
    iconBg: 'bg-[#EDF2FF]',
    iconColor: 'text-[#4E7FFF]',
  },
  {
    icon: <ReceiptLongIcon fontSize="inherit" />,
    label: '영수증 발급',
    iconBg: 'bg-[#E6FCF5]',
    iconColor: 'text-[#0CA678]',
  },
  {
    icon: <AssignmentReturnIcon fontSize="inherit" />,
    label: '반품 신청',
    iconBg: 'bg-[#FFF4E6]',
    iconColor: 'text-[#F76707]',
  },
  {
    icon: <HandshakeIcon fontSize="inherit" />,
    label: '거래 신청',
    iconBg: 'bg-[#F3F0FF]',
    iconColor: 'text-[#7048E8]',
  },
  {
    icon: <SupportAgentIcon fontSize="inherit" />,
    label: '문의하기',
    iconBg: 'bg-[#F1F3F5]',
    iconColor: 'text-[#495057]',
  },
];

export function QuickActions() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 어두운 오버레이 - 클릭 시 닫힘 */}
      <div
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-30 bg-black/40 transition-opacity duration-300"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
      />

      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {/* 서브 액션들 */}
      {actions.map((action, i) => (
        <div
          key={i}
          className="flex items-center gap-4 transition-all"
          style={{
            opacity: open ? 1 : 0,
            transform: open ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.9)',
            pointerEvents: open ? 'auto' : 'none',
            transitionDuration: '300ms',
            transitionDelay: open ? `${i * 40}ms` : `${(actions.length - 1 - i) * 30}ms`,
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <span className="text-white text-base font-bold whitespace-nowrap drop-shadow-md">
            {action.label}
          </span>
          <button
            aria-label={action.label}
            className="w-14 h-14 rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.2)] flex items-center justify-center hover:scale-105 transition-transform"
          >
            <span className="text-[#212529] inline-flex" style={{ fontSize: '24px' }}>
              {action.icon}
            </span>
          </button>
        </div>
      ))}

      {/* 메인 FAB */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? '빠른 액션 닫기' : '빠른 액션 열기'}
        className="w-14 h-14 rounded-full bg-[#4E7FFF] hover:bg-[#3D6FEF] text-white shadow-[0_4px_12px_rgba(78,127,255,0.4)] flex items-center justify-center"
      >
        <span
          className="inline-flex transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{
            fontSize: '28px',
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          <AddIcon fontSize="inherit" />
        </span>
      </button>
      </div>
    </>
  );
}
