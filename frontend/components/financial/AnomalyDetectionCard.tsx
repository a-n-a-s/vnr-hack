import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface AnomalyDetectionCardProps {
  title: string;
  icon: LucideIcon;
  description: string;
  anomalyCount: number;
  borderColor: string;
  iconColor: string;
  onViewDetails: () => void;
}

const AnomalyDetectionCard: React.FC<AnomalyDetectionCardProps> = ({
  title,
  icon: Icon,
  description,
  anomalyCount,
  borderColor,
  iconColor,
  onViewDetails
}) => {
  // Determine color based on anomaly count
  const getCountColor = () => {
    if (anomalyCount === 0) return 'text-gray-700';
    if (anomalyCount <= 3) return 'text-yellow-700';
    if (anomalyCount <= 10) return 'text-orange-700';
    return 'text-red-700';
  };

  const getBgColor = () => {
    if (anomalyCount === 0) return 'bg-gray-50';
    if (anomalyCount <= 3) return 'bg-yellow-50';
    if (anomalyCount <= 10) return 'bg-orange-50';
    return 'bg-red-50';
  };

  return (
    <Card className={`p-6 border-l-4 ${borderColor}`}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon className={`h-5 w-5 ${iconColor} mr-2`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">{description}</p>
          <div className={`p-4 ${getBgColor()} rounded-lg`}>
            <p className={`text-lg font-semibold ${getCountColor()}`}>{anomalyCount}</p>
            <p className="text-xs text-gray-600">anomalies found</p>
          </div>
          <button 
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
            onClick={onViewDetails}
          >
            View Details
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnomalyDetectionCard;