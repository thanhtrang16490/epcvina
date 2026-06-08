

import { Home, Factory, Building2, Check } from 'lucide-react';

type RoofType = 'tile' | 'metal' | 'flat';

interface RoofTypeSelectorProps {
  selected: RoofType | null;
  onSelect: (type: RoofType) => void;
}

const ROOF_TYPES: {
  id: RoofType;
  label: string;
  description: string;
  Icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}[] = [
  {
    id: 'tile',
    label: 'Mái ngói',
    description: 'Mái ngói truyền thống, cần khung đỡ chuyên dụng',
    Icon: Home,
    iconColor: 'text-orange-600',
    iconBg: 'bg-orange-50',
  },
  {
    id: 'metal',
    label: 'Mái tôn',
    description: 'Mái tôn, lắp đặt nhanh với kẹp tôn',
    Icon: Factory,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
  },
  {
    id: 'flat',
    label: 'Mái bằng',
    description: 'Mái bằng/sân thượng, sử dụng khung nghiêng',
    Icon: Building2,
    iconColor: 'text-green-600',
    iconBg: 'bg-green-50',
  },
];

export default function RoofTypeSelector({ selected, onSelect }: RoofTypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {ROOF_TYPES.map(({ id, label, description, Icon, iconColor, iconBg }) => {
        const isSelected = selected === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 text-left w-full ${
              isSelected
                ? 'border-blue-600 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Icon circle */}
              <div
                className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center flex-shrink-0`}
              >
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 leading-snug">{label}</p>
                <p className="text-sm text-gray-500 mt-0.5 leading-snug">{description}</p>
              </div>

              {/* Check mark */}
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
