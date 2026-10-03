import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export interface CategoryItem {
  name: string;
  value: number;
  formattedValue: string;
  color: string;
}

interface TopCategoriesProps {
  categoriesData?: CategoryItem[];
}

export const TopCategories: React.FC<TopCategoriesProps> = ({ categoriesData }) => {
  const isLoading = !categoriesData || categoriesData.length === 0;

  // Agar data load na hua ho toh professional skeleton loader dikhayein
  if (isLoading) {
    return (
      <div className="p-5 md:p-3 lg:p-5 w-full min-w-47 bg-(--background) rounded-2xl shadow-xl flex flex-col justify-between h-full border border-(--border) animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 bg-(--primary-soft) rounded w-28"></div>
          <div className="h-4 bg-(--primary-soft) rounded w-12"></div>
        </div>

        {/* Donut Chart Skeleton */}
        <div className="relative w-full h-40 md:h-38 lg:h-45 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border-8 border-(--primary-soft)"></div>
        </div>

        {/* Categories Legend List Skeleton */}
        <div className="mt-4 space-y-3">
          {[1, 2, 3, 4].map((_, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-(--primary-soft)" />
                <span className="h-3 bg-(--primary-soft) rounded w-24"></span>
              </div>
              <span className="h-3 bg-(--primary-soft) rounded w-16"></span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const TOTAL_SALES = categoriesData.reduce(
    (acc: number, e: CategoryItem): number => acc + e.value,
    0
  );

  return (
    <div className="p-5 md:p-3 lg:p-5 w-full min-w-47 bg-(--background) rounded-2xl shadow-xl flex flex-col justify-between h-full border border-(--border)">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-(--text)">
          Top Categories
        </h3>

        <button type="button" className="text-xs font-medium text-(--text-muted) hover:text-(--text) transition-colors">
          See All
        </button>
      </div>

      {/* Donut Chart */}
      <div className="relative w-full h-40 md:h-38 lg:h-45 recharts-wrapper flex items-center justify-center border-0 outline-none focus:border-0 focus:outline-none">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoriesData}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={75}
              paddingAngle={2}
              cornerRadius={4}
              dataKey="value"
            >
              {categoriesData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[11px] font-medium text-(--text-muted)">
            Total Sales
          </span>

          <span className="text-base font-bold text-(--text)">
            ${TOTAL_SALES.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Categories Legend List */}
      <div className="mt-4 space-y-3">
        {categoriesData.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-sm shrink-0"
                style={{ backgroundColor: item.color }}
              />

              <span className="font-medium text-(--text-muted) sm:text-sm md:text-xs text-md truncate">
                {item.name}
              </span>
            </div>

            <span className="font-semibold text-(--text) shrink-0 ml-2">
              {item.formattedValue}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCategories;