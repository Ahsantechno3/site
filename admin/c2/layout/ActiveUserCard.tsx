import React from "react";
import { MoreHorizontal } from "lucide-react";

interface CountryStat {
  country: string;
  percentage: number;
}

interface ActiveUserProps {
  totalUsers?: number;
  growthPercentage?: number;
  countriesData?: CountryStat[];
}

export const ActiveUserCard: React.FC<ActiveUserProps> = ({
  totalUsers,
  growthPercentage,
  countriesData,
}) => {
  const isLoading = totalUsers === undefined;

  // Agar data abhi nahi aaya, toh professional skeleton loader dikhayein
  if (isLoading) {
    return (
      <div className="bg-(--background) p-5 md:p-3 lg:p-5 rounded-2xl shadow-xl border border-(--border) flex flex-col justify-between h-full w-full select-none animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-4 bg-(--primary-soft) rounded w-24"></div>
          <div className="w-4 h-4 bg-(--primary-soft) rounded"></div>
        </div>

        {/* Main Stat Skeleton */}
        <div className="flex items-baseline justify-between my-2">
          <div className="space-y-1">
            <div className="h-6 bg-(--primary-soft) rounded w-20"></div>
            <div className="h-2 bg-(--primary-soft) rounded w-10"></div>
          </div>
          <div className="space-y-1 flex flex-col items-end">
            <div className="h-5 bg-(--primary-soft) rounded w-12"></div>
            <div className="h-2 bg-(--primary-soft) rounded w-16"></div>
          </div>
        </div>

        {/* Country Progress Bars Skeleton */}
        <div className="space-y-3 mt-1">
          {[1, 2, 3, 4].map((_, index) => (
            <div key={index} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="h-3 bg-(--primary-soft) rounded w-20"></div>
                <div className="h-3 bg-(--primary-soft) rounded w-8"></div>
              </div>
              <div className="w-full h-1.5 bg-(--primary-soft) rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-(--background) p-5 md:p-3 lg:p-5 rounded-2xl shadow-xl border border-(--border) flex flex-col justify-between h-full w-full select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-(--text)">Active User</h3>
        <button type="button" className="text-(--text-muted) hover:text-(--text) transition-colors p-0.5 focus:outline-none">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-baseline justify-between my-2">
        <div>
          <span className="text-xl md:text-md lg:text-xl font-extrabold text-(--text) leading-none block">
            {totalUsers?.toLocaleString()}
          </span>
          <span className="text-[9px] text-(--text-muted) font-medium">Users</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-semibold text-(--primary-dark) bg-(--primary-soft) px-1.3 py-0.4 rounded-md">
            +{growthPercentage}%
          </span>
          <span className="text-[9px] text-(--text-muted) mt-0.5">from last month</span>
        </div>
      </div>

      <div className="space-y-3 mt-1">
        {countriesData?.map((item, index) => (
          <div key={index} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px] font-medium">
              <span className="text-(--text-muted)">{item.country}</span>
              <span className="text-(--text) font-bold">{item.percentage}%</span>
            </div>
            <div className="w-full h-1.5 bg-(--primary-soft) rounded-full overflow-hidden">
              <div
                className="h-full bg-(--primary) rounded-full transition-all duration-500"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveUserCard;