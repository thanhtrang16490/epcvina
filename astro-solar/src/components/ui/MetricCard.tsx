import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'orange' | 'purple';
}

const colorMap = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    border: 'border-blue-100'
  },
  green: {
    bg: 'bg-green-50',
    icon: 'text-green-600',
    border: 'border-green-100'
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'text-orange-600',
    border: 'border-orange-100'
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    border: 'border-purple-100'
  }
};

export default function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  color = 'blue' 
}: MetricCardProps) {
  const colors = colorMap[color];

  return (
    <div className={`bg-white rounded-xl p-6 border ${colors.border} shadow-sm`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-gray-400">so với tháng trước</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colors.bg}`}>
          <Icon className={`h-6 w-6 ${colors.icon}`} />
        </div>
      </div>
    </div>
  );
}
