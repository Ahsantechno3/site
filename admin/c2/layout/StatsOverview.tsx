import React from "react";
import StatCard, { StatCardProps } from "@/components/ui/StatCard";
import { DollarSign, ShoppingBag, Users } from "lucide-react";

interface StatsOverviewProps {
  statsData?: StatCardProps[];
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ statsData }) => {
  const iconsMap = [DollarSign, ShoppingBag, Users];

  // Agar data abhi nahi aaya, toh skeleton ya loading state dikha sakte hain
  if (!statsData || statsData.length === 0) {
    return (
      <div className="w-full flex flex-row flex-wrap sm:flex-nowrap gap-2">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="bg-(--background) p-4 rounded-xl border border-(--border) w-full animate-pulse h-24 flex flex-col justify-between">
            <div className="h-3 bg-(--primary-soft) rounded w-1/2"></div>
            <div className="h-6 bg-(--primary-soft) rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-row flex-wrap sm:flex-nowrap gap-2">
      {statsData.map((stat, index) => (
        <StatCard 
          key={index} 
          {...stat} 
          icon={iconsMap[index % iconsMap.length]} 
        />
      ))}
    </div>
  );
};

export default StatsOverview;