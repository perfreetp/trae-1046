import React from 'react';
import { Card } from 'antd';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface DataCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: number;
  trendText?: string;
  icon?: React.ReactNode;
  color?: string;
}

const DataCard: React.FC<DataCardProps> = ({
  title,
  value,
  unit,
  trend,
  trendText,
  icon,
  color = '#165DFF',
}) => {
  return (
    <Card className="stat-card border-0 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm mb-2">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-gray-800">{value}</span>
            {unit && <span className="text-gray-500 text-sm">{unit}</span>}
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
              <span>{Math.abs(trend)}%</span>
              {trendText && <span className="text-gray-400 ml-1">{trendText}</span>}
            </div>
          )}
        </div>
        {icon && (
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}15`, color }}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default DataCard;
