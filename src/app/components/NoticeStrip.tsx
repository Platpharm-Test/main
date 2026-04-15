import CampaignIcon from '@mui/icons-material/Campaign';
import { useEffect, useState } from 'react';

const notices = [
  { message: '4월 배송 스케줄 안내', date: '26/04/10' },
  { message: '신규 공급사 3곳 입점 완료', date: '26/04/12' },
  { message: '정기 점검 안내 (04.20 02시~04시)', date: '26/04/08' },
  { message: '결제 시스템 업데이트 완료', date: '26/04/05' },
];

const ROW_HEIGHT = 20;
const TRANSITION_MS = 500;

export function NoticeStrip() {
  const [idx, setIdx] = useState(0);
  const [animating, setAnimating] = useState(true);

  // 4초마다 다음으로 이동
  useEffect(() => {
    const id = setInterval(() => {
      setIdx((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  // 마지막(복제본)에 도달하면 애니메이션 끄고 0으로 리셋
  useEffect(() => {
    if (idx === notices.length) {
      const timer = setTimeout(() => {
        setAnimating(false);
        setIdx(0);
        // 다음 프레임에 다시 애니메이션 활성화
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setAnimating(true));
        });
      }, TRANSITION_MS);
      return () => clearTimeout(timer);
    }
  }, [idx]);

  // 복제본 포함 리스트
  const list = [...notices, notices[0]];

  return (
    <div className="bg-[#2B2D31] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] px-5 h-14 flex items-center gap-4">
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[#4E7FFF] inline-flex" style={{ fontSize: '20px' }}>
          <CampaignIcon fontSize="inherit" />
        </span>
        <span className="text-sm font-bold text-white">공지사항</span>
      </div>

      {/* 티커 컨테이너 */}
      <div
        className="flex-1 relative overflow-hidden"
        style={{ height: `${ROW_HEIGHT}px` }}
      >
        <div
          style={{
            transform: `translateY(-${idx * ROW_HEIGHT}px)`,
            transition: animating
              ? `transform ${TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`
              : 'none',
          }}
        >
          {list.map((notice, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4"
              style={{ height: `${ROW_HEIGHT}px` }}
            >
              <p className="text-sm text-white/80 truncate leading-none">{notice.message}</p>
              <span className="text-xs text-white/40 shrink-0 leading-none">{notice.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
