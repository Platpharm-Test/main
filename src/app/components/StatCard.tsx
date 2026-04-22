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
      className={`p-6 rounded-lg border bg-white border-[#DEE2E6] ${interactive ? 'cursor-pointer hover:border-[#4E7FFF] hover:shadow-sm transition-all' : ''}`}
    >
      <p className="text-xs text-[#868E96] font-medium mb-3">{label}</p>
      <p className={`text-3xl font-bold mb-2 ${highlight ? 'text-[#4E7FFF]' : 'text-[#212529]'}`}>{value}</p>
      {sublabel && <p className="text-sm text-[#495057] font-normal mb-1">{sublabel}</p>}
      {description && <p className="text-xs text-[#ADB5BD]">{description}</p>}
    </div>
  );
}
