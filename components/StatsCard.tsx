
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  colorClass?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, trend, trendUp, colorClass = "bg-blue-500" }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl backdrop-blur-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 text-${colorClass.replace('bg-', '')}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-lg ${trendUp ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm text-slate-400 font-medium mb-1">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
