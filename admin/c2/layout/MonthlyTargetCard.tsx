import React from "react";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { MoreHorizontal } from "lucide-react";

interface MonthlyTargetProps {
  percentage?: number;
  growthPercentage?: number;
  targetAmount?: number;
  revenueAmount?: number;
}

export const MonthlyTargetCard: React.FC<MonthlyTargetProps> = ({
  percentage,
  growthPercentage,
  targetAmount,
  revenueAmount,
}) => {
  const isLoading = percentage === undefined;

  // Agar data abhi nahi aaya, toh professional skeleton loader dikhayein
  if (isLoading) {
    return (
      <div className="bg-(--background) p-5 md:p-3 lg:p-5 rounded-2xl shadow-xl border border-(--border) flex flex-col justify-between h-full w-full select-none animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-(--primary-soft) rounded w-28"></div>
          <div className="w-4 h-4 bg-(--primary-soft) rounded"></div>
        </div>

        {/* Chart Skeleton Box */}
        <div className="relative w-full h-20 md:h-22 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border-4 border-(--primary-soft) border-t-transparent animate-spin"></div>
        </div>

        {/* Message Skeleton */}
        <div className="text-center space-y-1.5 py-1">
          <div className="h-3 bg-(--primary-soft) rounded w-3/4 mx-auto"></div>
          <div className="h-2.5 bg-(--primary-soft) rounded w-5/6 mx-auto"></div>
        </div>

        {/* Target & Revenue Box Skeleton */}
        <div className="grid grid-cols-2 bg-(--primary-soft) p-3 rounded-xl gap-2">
          <div className="h-7 bg-(--background)/50 rounded"></div>
          <div className="h-7 bg-(--background)/50 rounded"></div>
        </div>
      </div>
    );
  }

  const chartData = [{ value: percentage }];

  return (
    <div className="bg-(--background) p-5 md:p-3 lg:p-5 rounded-2xl shadow-xl border border-(--border) flex flex-col justify-between h-full w-full select-none ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-(--text)">Monthly Target</h3>

        <button
          type="button"
          className="text-(--text-muted) hover:text-(--text) transition-colors p-0.5 focus:outline-none"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Semi-Circle Donut Gauge Chart */}
      <div className="relative w-full h-20 md:h-22 flex items-center justify-center overflow-hidden ">
        <div className="absolute top-0 w-full h-35">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="75%"
              outerRadius="100%"
              data={chartData}
              startAngle={180}
              endAngle={0}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
              />

              <RadialBar
                background={{ fill: "var(--primary-light)" }}
                dataKey="value"
                cornerRadius={4}
                fill="var(--primary)"
              />
            </RadialBarChart>
          </ResponsiveContainer>

          {/* Center Text Over Gauge */}
          <div className="absolute top-[28%] lg:top-[33%] md:top-[28%] left-1/2 -translate-x-1/2 flex flex-col items-center text-center">
            <span className="text-xl lg:text-2xl md:text-md font-extrabold text-(--text) leading-none">
              {percentage}%
            </span>

            <span className="text-[9px] font-semibold text-(--primary-dark) mt-1 whitespace-nowrap flex flex-row lg:flex-row w-fit md:flex-col">
              +{growthPercentage}%
              <span className="text-(--text-muted) font-normal ml-1">
                from last month
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="text-center">
        <h4 className="text-[11px] font-bold text-(--text) flex items-center justify-center gap-1">
          Great Progress! 🎉
        </h4>

        <p className="text-[9px] text-(--text-muted) leading-tight mb-0.5">
          Our achievement increased by $200,000,
          <br />
          let's reach 100% next month.
        </p>
      </div>

      {/* Target & Revenue Box */}
      <div className="grid grid-cols-2 bg-(--primary-soft) p-2 rounded-xl border border-(--primary-light)">
        <div className="flex flex-col items-center justify-center border-r border-(--primary-light)">
          <span className="text-[9px] font-medium text-(--text-muted)">
            Target
          </span>

          <span className="text-[11px] font-bold text-(--text) mt-0.5">
            ${targetAmount?.toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center">
          <span className="text-[9px] font-medium text-(--text-muted)">
            Revenue
          </span>

          <span className="text-[11px] font-bold text-(--text) mt-0.5">
            ${revenueAmount?.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MonthlyTargetCard;