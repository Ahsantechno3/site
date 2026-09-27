import React from "react";
import { MoreHorizontal } from "lucide-react";

interface TrafficSourceItem {
  label: string;
  percentage: number;
  color: string;
}

interface TrafficSourcesProps {
  sources?: TrafficSourceItem[];
}

export const TrafficSourcesCard: React.FC<TrafficSourcesProps> = ({
  sources,
}) => {
  const isLoading = !sources || sources.length === 0;

  // Agar data abhi load nahi hua, toh professional skeleton loader dikhayein
  if (isLoading) {
    return (
      <div className="bg-(--background) p-5 md:p-3 lg:p-5 rounded-2xl shadow-xl border border-(--border) flex flex-col justify-between h-full w-full select-none animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-3 md:mb-0 lg:mb-3">
          <div className="h-4 bg-(--primary-soft) rounded w-28"></div>
          <div className="w-4 h-4 bg-(--primary-soft) rounded"></div>
        </div>

        {/* Segmented Bar Skeleton */}
        <div className="w-full h-7 my-2 bg-(--primary-soft) rounded-md"></div>

        {/* Traffic Legend List Skeleton */}
        <div className="space-y-2 mt-1">
          {[1, 2, 3, 4, 5].map((_, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-(--primary-soft)" />
                <span className="h-3 bg-(--primary-soft) rounded w-24"></span>
              </div>
              <span className="h-3 bg-(--primary-soft) rounded w-8"></span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-(--background) p-5 md:p-3 lg:p-5 rounded-2xl shadow-xl border border-(--border) flex flex-col justify-between h-full w-full select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 md:mb-0 lg:mb-3">
        <h3 className="text-sm font-bold text-(--text)">
          Traffic Sources
        </h3>

        <button
          type="button"
          className="text-(--text-muted) hover:text-(--text) transition-colors p-0.5 focus:outline-none"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Segmented Bar */}
      <div className="w-full flex gap-0.5 h-7 my-2">
        {sources.map((item, idx) => (
          <div
            key={idx}
            className="h-full rounded-md transition-all duration-300"
            style={{
              width: `${item.percentage}%`,
              backgroundColor: item.color,
            }}
            title={`${item.label}: ${item.percentage}%`}
          />
        ))}
      </div>

      {/* Traffic Legend List */}
      <div className="space-y-2 mt-1">
        {sources.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between text-xs font-medium"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: item.color }}
              />

              <span className="text-(--text-muted) text-[10px]">
                {item.label}
              </span>
            </div>

            <span className="text-(--text) font-bold text-xs">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrafficSourcesCard;