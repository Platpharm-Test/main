interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  highlight?: boolean;
  description?: string;
  onClick?: () => void;
}

export function StatCard({ label, value, sublabel, highlight, description, onClick }: StatCardProps) {
  const interactive = !!onClick;
  return (
    <div
      onClick={onClick}
      className={`min-w-0 p-4 sm:p-6 rounded-lg border bg-white border-[#DEE2E6] ${interactive ? 'cursor-pointer hover:border-[#4E7FFF] hover:shadow-sm transition-all' : ''}`}
    >
      <p className="text-[11px] sm:text-xs text-[#868E96] font-medium mb-2 sm:mb-3 truncate">{label}</p>
      <p className={`text-lg sm:text-2xl lg:text-3xl font-bold mb-1.5 sm:mb-2 tabular-nums break-all ${highlight ? 'text-[#4E7FFF]' : 'text-[#212529]'}`}>{value}</p>
      {sublabel && <p className="text-[11px] sm:text-sm text-[#495057] font-normal mb-1 truncate">{sublabel}</p>}
      {description && <p className="text-[11px] sm:text-xs text-[#ADB5BD] truncate">{description}</p>}
    </div>
  );
}
