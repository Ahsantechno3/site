"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CustomSelect from "@/components/ui/Select";

interface DataPoint {
  date: string;
  revenue: number;
  order: number;
}

// Support both structured dictionary format and raw array format
interface RevenueAnalyticsProps {
  timePeriodData?:
    | Record<string, { label: string; data: DataPoint[] }>
    | DataPoint[];
}

// Crash-proof getYTicks with array safeguards
function getYTicks(data: DataPoint[] = []): number[] {
  const safeData = Array.isArray(data) ? data : [];

  if (safeData.length === 0) return [0, 50, 100];

  const max = Math.max(...safeData.map((d) => d?.revenue || 0));

  const step = Math.pow(10, Math.floor(Math.log10(max || 1))) / 2 || 1;
  const roundedMax = Math.ceil(max / step) * step;

  const ticks: number[] = [];
  for (let value = 0; value <= roundedMax; value += step) {
    ticks.push(value);
  }

  return ticks;
}

const CustomActiveDotWithTooltip = (props: any) => {
  const { cx, cy, payload } = props;

  if (cx == null || cy == null || !payload) return null;

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill="var(--primary)"
        stroke="var(--background)"
        strokeWidth={2.5}
      />

      <foreignObject
        x={cx - 45}
        y={cy - 35}
        width={90}
        height={50}
        className="overflow-visible pointer-events-none"
      >
        <div className="flex flex-col items-center justify-center">
          <div className="bg-(--background) px-2 py-0.5 rounded-xl shadow-md border border-(--border) flex flex-col items-center min-w-15">
            <span className="text-[8px] text-(--text-muted) font-medium leading-none mb-0.5">
              Revenue
            </span>

            <span className="text-[10px] font-bold text-(--text) leading-none">
              ${payload.revenue?.toLocaleString() ?? 0}
            </span>
          </div>

          <div className="w-1.5 h-1.5 bg-(--background) rotate-45 border-r border-b border-(--border) -mt-1 shadow-sm" />
        </div>
      </foreignObject>
    </g>
  );
};

export const RevenueAnalyticsCard: React.FC<RevenueAnalyticsProps> = ({
  timePeriodData,
}) => {
  const [selectedKey, setSelectedKey] = useState<string>("8days");

  // Normalize data whether passed as Object or Array
  const isArrayData = Array.isArray(timePeriodData);
  const isObjectData =
    Boolean(timePeriodData) &&
    !isArrayData &&
    Object.keys(timePeriodData as object).length > 0;

  const isLoading = !timePeriodData || (!isArrayData && !isObjectData);

  if (isLoading) {
    return (
      <div className="p-5 md:p-3 lg:p-5 bg-(--background) rounded-2xl shadow-xl border border-(--border) flex flex-col justify-between h-68 md:h-full w-full select-none animate-pulse">
        <div className="flex items-center justify-between mb-2">
          <div className="h-5 bg-(--primary-soft) rounded w-36"></div>
          <div className="h-7 bg-(--primary-soft) rounded w-32"></div>
        </div>

        <div className="flex items-center gap-3 mb-1">
          <div className="h-3 bg-(--primary-soft) rounded w-16"></div>
          <div className="h-3 bg-(--primary-soft) rounded w-16"></div>
        </div>

        <div className="w-full flex-1 h-full min-h-0 flex items-end pt-6">
          <div className="w-full h-36 bg-(--primary-soft) rounded-lg"></div>
        </div>
      </div>
    );
  }

  // Extract graph points safely
  let chartPoints: DataPoint[] = [];
  let timePeriodOptions: { label: string; value: string }[] = [];

  if (isArrayData) {
    chartPoints = timePeriodData as DataPoint[];
  } else if (isObjectData) {
    const objData = timePeriodData as Record<
      string,
      { label: string; data: DataPoint[] }
    >;
    timePeriodOptions = Object.keys(objData).map((key) => ({
      label: objData[key]?.label || key,
      value: key,
    }));

    const activeDataset =
      objData[selectedKey] || objData[Object.keys(objData)[0]];
    chartPoints = activeDataset?.data || [];
  }

  const yTicks = getYTicks(chartPoints);

  const formatTick = (value: number) => {
    if (value === 0) return "0";
    return value >= 1000 ? `${value / 1000}K` : `${value}`;
  };

  return (
    <div className="p-5 md:p-3 lg:p-5 bg-(--background) rounded-2xl shadow-xl border border-(--border) flex flex-col h-68 md:h-full w-full select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-bold text-(--text)">
          Revenue Analytics
        </h3>

        {timePeriodOptions.length > 0 && (
          <CustomSelect
            value={selectedKey}
            options={timePeriodOptions}
            onChange={(value) => setSelectedKey(value)}
            className="w-32 shrink-0"
          />
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mb-1 text-xs font-medium text-(--text-muted)">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-(--primary) rounded-full" />
          <span>Revenue</span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex flex-row gap-0.5">
            <span className="w-1 h-0.5 bg-(--primary-light) rounded-full" />
            <span className="w-1 h-0.5 bg-(--primary-light) rounded-full" />
            <span className="w-1 h-0.5 bg-(--primary-light) rounded-full" />
          </div>
          <span>Order</span>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full flex-1 h-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartPoints}
            margin={{
              top: 35,
              right: 0,
              left: 0,
              bottom: -17,
            }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--primary)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="100%"
                  stopColor="var(--primary)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "var(--text-muted)",
                fontSize: 9,
              }}
              dy={-5}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "var(--text-muted)",
                fontSize: 9,
              }}
              ticks={yTicks}
              tickFormatter={(value, index) => {
                if (index === 0) return "";
                return formatTick(value);
              }}
              width={40}
              dx={5}
            />

            <Tooltip
              content={() => null}
              cursor={false}
              wrapperStyle={{
                display: "none",
              }}
            />

            <Area
              type="monotone"
              dataKey="order"
              stroke="var(--primary-light)"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              fill="none"
              activeDot={false}
              isAnimationActive={true}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--primary)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#revenueGradient)"
              activeDot={<CustomActiveDotWithTooltip />}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueAnalyticsCard;