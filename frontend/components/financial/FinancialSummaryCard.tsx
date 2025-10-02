import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FinancialSummaryCardProps {
  title: string;
  icon: LucideIcon;
  currentValue: number | string;
  projectedValue?: number | string;
  growthPercentage?: number;
  borderColor: string;
  iconColor: string;
  className?: string;
  formatCurrency?: boolean;
  formatPercentage?: boolean;
}

const FinancialSummaryCard: React.FC<FinancialSummaryCardProps> = ({
  title,
  icon: Icon,
  currentValue,
  projectedValue,
  growthPercentage,
  borderColor,
  iconColor,
  className = '',
  formatCurrency = true,
  formatPercentage = false
}) => {
  const formatValue = (value: number | string) => {
    if (typeof value === 'string') return value;
    
    if (formatCurrency) {
      return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    
    if (formatPercentage) {
      return `${value.toFixed(2)}%`;
    }
    
    return value.toString();
  };

  const getColorClass = (value: number | undefined) => {
    if (value === undefined) return '';
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className={`p-6 bg-white rounded-xl border-l-4 ${borderColor} shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-center">
        <Icon className={`h-6 w-6 ${iconColor} mr-4`} />
        <div className="flex-1">
          <p className="text-base text-gray-600">{title}</p>
          <div className="mt-3 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">
                {projectedValue !== undefined ? 'Initial:' : 'Current:'}
              </span>
              <span className="font-medium text-base">
                {formatValue(currentValue)}
              </span>
            </div>
            
            {projectedValue !== undefined && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Projected:</span>
                <span className="font-medium text-base text-green-600">
                  {formatValue(projectedValue)}
                </span>
              </div>
            )}
            
            {growthPercentage !== undefined && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Growth:</span>
                <span className={`font-medium text-base ${getColorClass(growthPercentage)}`}>
                  {growthPercentage >= 0 ? '+' : ''}{growthPercentage.toFixed(2)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummaryCard;