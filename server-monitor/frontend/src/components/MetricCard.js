import React from 'react';

const MetricCard = ({ title, value, unit, icon: Icon, color, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
    red: 'bg-red-50 border-red-200 text-red-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600'
  };

  return (
    <div className={`p-6 rounded-lg border-2 ${colorClasses[color]} transition-all hover:shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-600 uppercase">{title}</h3>
        {Icon && <Icon className="w-6 h-6" />}
      </div>
      
      <div className="flex items-baseline">
        <span className="text-4xl font-bold">{value}</span>
        {unit && <span className="ml-2 text-xl text-gray-500">{unit}</span>}
      </div>
      
      {trend !== undefined && (
        <div className="mt-2 text-sm">
          <span className={trend >= 0 ? 'text-green-600' : 'text-red-600'}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          <span className="text-gray-500 ml-1">vs last period</span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;