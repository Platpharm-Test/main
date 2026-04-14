interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  highlight?: boolean;
  description?: string;
}

export function StatCard({ label, value, sublabel, highlight, description }: StatCardProps) {
  return (
    <div className="p-6 rounded-lg border bg-white border-[#DEE2E6]">
      <p className="text-xs text-[#868E96] font-medium mb-3">{label}</p>
      <p className={`text-3xl font-bold mb-2 ${highlight ? 'text-[#4E7FFF]' : 'text-[#212529]'}`}>{value}</p>
      {sublabel && <p className="text-sm text-[#495057] font-normal mb-1">{sublabel}</p>}
      {description && <p className="text-xs text-[#ADB5BD]">{description}</p>}
    </div>
  );
}
