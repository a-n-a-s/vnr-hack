import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricDisplayProps {
  title: string;
  icon: LucideIcon;
  value: number | string;
  borderColor: string;
  iconColor: string;
  className?: string;
  formatCurrency?: boolean;
  formatPercentage?: boolean;
  prefix?: string;
  suffix?: string;
}

const MetricDisplay: React.FC<MetricDisplayProps> = ({
  title,
  icon: Icon,
  value,
  borderColor,
  iconColor,
  className = '',
  formatCurrency = false,
  formatPercentage = false,
  prefix = '',
  suffix = ''
}) => {
  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return `${prefix}${val}${suffix}`;
    
    if (formatCurrency) {
      return `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    
    if (formatPercentage) {
      return `${val.toFixed(2)}%`;
    }
    
    return `${prefix}${val.toLocaleString()}${suffix}`;
  };

  return (
    <div className={`p-6 bg-white rounded-xl border-l-4 ${borderColor} shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-center">
        <Icon className={`h-8 w-8 ${iconColor} mr-4`} />
        <div>
          <p className="text-lg text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatValue(value)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MetricDisplay;