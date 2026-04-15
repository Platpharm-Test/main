import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useEffect, useState, type ReactNode } from 'react';

type FeatureColor = 'blue' | 'violet' | 'emerald' | 'orange';

const colorMap: Record<FeatureColor, { main: string; bg: string; iconText: string; ctaHover: string }> = {
  blue: {
    main: '#4E7FFF',
    bg: '#EDF2FF',
    iconText: 'text-[#4E7FFF]',
    ctaHover: 'group-hover:text-[#3D6FEF]',
  },
  violet: {
    main: '#7048E8',
    bg: '#F3F0FF',
    iconText: 'text-[#7048E8]',
    ctaHover: 'group-hover:text-[#5F3DC4]',
  },
  emerald: {
    main: '#0CA678',
    bg: '#E6FCF5',
    iconText: 'text-[#0CA678]',
    ctaHover: 'group-hover:text-[#099268]',
  },
  orange: {
    main: '#F76707',
    bg: '#FFF4E6',
    iconText: 'text-[#F76707]',
    ctaHover: 'group-hover:text-[#E8590C]',
  },
};

interface Stat {
  label: string;
  value: string;
  dot: string;
}

interface FeatureDonutCardProps {
  color: FeatureColor;
  icon: ReactNode;
  title: string;
  rightTitle: string;
  rightSubtitle: string;
  percentage: number;
  centerLabel: string;
  stats: Stat[];
}

export function FeatureDonutCard({
  color,
  icon,
  title,
  rightTitle,
  rightSubtitle,
  percentage,
  centerLabel,
  stats,
}: FeatureDonutCardProps) {
  const c = colorMap[color];
  const [animatedPct, setAnimatedPct] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 900;
    let rafId: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setAnimatedPct(percentage * eased);
      if (t < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [percentage]);

  return (
    <div className="group bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* 좌측: 제목 + 도넛 + 레전드 */}
        <div className="flex-1 flex flex-col items-center">
          {/* 제목 */}
          <div className="w-full mb-1">
            <div className="flex items-center gap-1.5">
              <span className={`${c.iconText} inline-flex`} style={{ fontSize: '18px' }}>
                {icon}
              </span>
              <h3 className="text-sm font-bold text-[#212529]">{title}</h3>
            </div>
          </div>

          {/* 도넛 */}
          <div className="relative w-[180px] h-[180px] [&_*]:outline-none my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                {/* 배경 (남은 부분) - 라운드 없음 */}
                <Pie
                  data={[{ value: 100 }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={82}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                  isAnimationActive={false}
                >
                  <Cell fill={c.bg} style={{ outline: 'none' }} />
                </Pie>
                {/* 완료된 부분 - 라운드 있음 */}
                {animatedPct > 1 && (
                  <Pie
                    data={[{ value: animatedPct }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={82}
                    startAngle={90}
                    endAngle={90 - (animatedPct / 100) * 360}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={12}
                    isAnimationActive={false}
                  >
                    <Cell fill={c.main} style={{ outline: 'none' }} />
                  </Pie>
                )}
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-[13px] text-[#495057] font-semibold mb-0.5">{centerLabel}</p>
              <p className="text-[26px] font-bold leading-tight" style={{ color: c.main }}>{percentage}%</p>
            </div>
          </div>

          {/* 레전드 */}
          <div className="flex items-center justify-center gap-2.5 flex-wrap mt-1">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: stat.dot }} />
                <span className="text-[11px] text-[#868E96]">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 우측: 제목 + 2x2 스탯 */}
        <div className="flex-1 flex flex-col">
          <div className="mb-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#212529]">{rightTitle}</h4>
              <button className="flex items-center gap-1 text-xs font-semibold text-[#4E7FFF] hover:text-[#3D6FEF] transition-colors cursor-pointer">
                바로가기
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <p className="text-[11px] text-[#ADB5BD] mt-0.5">{rightSubtitle}</p>
          </div>

          <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-3">
            {stats.map((stat, i) => (
              <div key={i} className="bg-[#F8F9FA] rounded-lg p-4 flex flex-col justify-center gap-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stat.dot }} />
                  <span className="text-xs text-[#868E96] font-medium">{stat.label}</span>
                </div>
                <p className="text-xl font-bold text-[#212529] leading-none whitespace-nowrap">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
