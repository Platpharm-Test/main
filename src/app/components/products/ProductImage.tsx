import { Pill, Droplets, Syringe, FlaskConical, TestTube, Package } from 'lucide-react';
import type { DrugForm } from '../../lib/products';

const FORM_ICON: Record<DrugForm, typeof Pill> = {
  '정': Pill,
  '캡슐': FlaskConical,
  '시럽': Droplets,
  '연고': TestTube,
  '주사': Syringe,
  '기타': Package,
};

const CATEGORY_COLORS: Record<string, { bg: string; icon: string; border: string }> = {
  '해열진통소염제': { bg: 'bg-red-50', icon: 'text-red-400', border: 'border-red-100' },
  '소화기계약': { bg: 'bg-amber-50', icon: 'text-amber-400', border: 'border-amber-100' },
  '순환기계약': { bg: 'bg-rose-50', icon: 'text-rose-400', border: 'border-rose-100' },
  '호흡기계약': { bg: 'bg-sky-50', icon: 'text-sky-400', border: 'border-sky-100' },
  '항생제': { bg: 'bg-emerald-50', icon: 'text-emerald-400', border: 'border-emerald-100' },
  '비타민·영양제': { bg: 'bg-orange-50', icon: 'text-orange-400', border: 'border-orange-100' },
  '감기약': { bg: 'bg-blue-50', icon: 'text-blue-400', border: 'border-blue-100' },
  '알레르기약': { bg: 'bg-purple-50', icon: 'text-purple-400', border: 'border-purple-100' },
  '외용제': { bg: 'bg-teal-50', icon: 'text-teal-400', border: 'border-teal-100' },
  '안과약': { bg: 'bg-cyan-50', icon: 'text-cyan-400', border: 'border-cyan-100' },
  '한방제제': { bg: 'bg-lime-50', icon: 'text-lime-500', border: 'border-lime-100' },
  '건강기능식품': { bg: 'bg-green-50', icon: 'text-green-400', border: 'border-green-100' },
  '측정기기': { bg: 'bg-slate-50', icon: 'text-slate-400', border: 'border-slate-100' },
  '치아·구강용품': { bg: 'bg-indigo-50', icon: 'text-indigo-400', border: 'border-indigo-100' },
  '반창고·밴드·파스': { bg: 'bg-pink-50', icon: 'text-pink-400', border: 'border-pink-100' },
};

const DEFAULT_COLOR = { bg: 'bg-gray-50', icon: 'text-gray-400', border: 'border-gray-100' };

interface ProductImageProps {
  form: DrugForm;
  category: string;
  name: string;
  image?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ProductImage({ form, category, name, image, size = 'md' }: ProductImageProps) {
  const Icon = FORM_ICON[form] || Package;
  const color = CATEGORY_COLORS[category] || DEFAULT_COLOR;

  const sizeMap = {
    sm: { wrapper: 'w-10 h-10 rounded-lg', img: 'w-10 h-10 rounded-lg', icon: 'w-5 h-5', text: 'hidden' },
    md: { wrapper: 'w-full aspect-square rounded-xl max-w-[180px]', img: 'w-full aspect-square rounded-xl max-w-[180px]', icon: 'w-10 h-10', text: 'text-[11px] mt-2' },
    lg: { wrapper: 'w-full aspect-square rounded-xl max-w-[220px]', img: 'w-full aspect-square rounded-xl max-w-[220px]', icon: 'w-16 h-16', text: 'text-xs mt-3' },
  };

  const s = sizeMap[size];

  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className={`${s.img} object-contain bg-[#F8F9FA]`}
        loading="lazy"
      />
    );
  }

  return (
    <div className={`${s.wrapper} ${color.bg} border ${color.border} flex flex-col items-center justify-center`}>
      <Icon className={`${s.icon} ${color.icon}`} strokeWidth={1.5} />
      {s.text !== 'hidden' && (
        <p className={`${s.text} ${color.icon} font-semibold text-center px-2 truncate max-w-full`}>{name}</p>
      )}
    </div>
  );
}
