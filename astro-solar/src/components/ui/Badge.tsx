interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info' | 'error';
  size?: 'sm' | 'md';
}

const variantMap = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  info: 'bg-blue-100 text-blue-700',
  error: 'bg-red-100 text-red-700'
};

const sizeMap = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm'
};

export default function Badge({ 
  children, 
  variant = 'default',
  size = 'md'
}: BadgeProps) {
  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variantMap[variant]} ${sizeMap[size]}`}>
      {children}
    </span>
  );
}
