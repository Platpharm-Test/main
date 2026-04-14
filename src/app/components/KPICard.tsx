import { LucideIcon, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  subtitle?: string;
  sparklineData?: number[];
}

export function KPICard({ title, value, trend, icon: Icon, iconColor, iconBg, subtitle, sparklineData }: KPICardProps) {
  const isPositive = trend && trend > 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] hover:border-[#097969]/30 transition-all duration-500 hover:shadow-xl hover:shadow-[#097969]/5 hover:-translate-y-1 group cursor-pointer relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#097969]/5 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl`}>
            <Icon className={`w-7 h-7 ${iconColor}`} strokeWidth={2.5} />
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-sm ${isPositive ? 'bg-[#ECFDF5] text-[#059669]' : 'bg-[#FEF2F2] text-[#DC2626]'}`}>
              <TrendIcon className="w-4 h-4" strokeWidth={3} />
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-4">
          <p className="text-sm font-bold text-[#6B7280] mb-2 uppercase tracking-wide">{title}</p>
          <p className="text-4xl font-bold text-[#1F2937] tracking-tight group-hover:text-[#097969] transition-colors">{value}</p>
          {subtitle && (
            <p className="text-xs text-[#9CA3AF] font-medium mt-1">{subtitle}</p>
          )}
        </div>

        {/* Sparkline or bottom info */}
        {sparklineData ? (
          <div className="h-12 flex items-end gap-1">
            {sparklineData.map((height, index) => (
              <div
                key={index}
                className="flex-1 bg-gradient-to-t from-[#097969] to-[#0A8F7C] rounded-t opacity-30 group-hover:opacity-100 transition-opacity duration-500"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-between pt-4 border-t border-[#F3F4F6]">
            <p className="text-xs text-[#9CA3AF] font-semibold">지난주 대비</p>
            <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#097969] group-hover:translate-x-1 transition-all" strokeWidth={2.5} />
          </div>
        )}
      </div>
    </div>
  );
}
