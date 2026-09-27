"use client";

import React, { useState } from "react";
import CustomSelect from "@/c2/ui/Select";

interface StepData {
  label: string;
  value: number;
  percentageChange: number;
  barColor: string;
}

interface ConversionRateProps {
  timePeriods?: Record<string, { label: string; steps: StepData[] }>;
}

export const ConversionRateCard: React.FC<ConversionRateProps> = ({
  timePeriods,
}) => {
  const [selectedKey, setSelectedKey] = useState<string>("thisWeek");

  const isLoading = !timePeriods || Object.keys(timePeriods).length === 0;

  if (isLoading) {
    return (
      <div className="bg-[var(--background)] p-4 rounded-2xl shadow-xl border border-[var(--border)] flex flex-col justify-between h-full w-full select-none animate-pulse">
        <div className="flex items-center justify-between mb-3">
          <div className="h-4 bg-[var(--primary-soft)] rounded w-32"></div>
          <div className="h-7 bg-[var(--primary-soft)] rounded w-28"></div>
        </div>
        <div className="grid grid-cols-5 h-full items-end pt-2 gap-2">
          {[1, 2, 3, 4, 5].map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between h-full border-r border-[var(--border)] last:border-r-0 px-1.5"
            >
              <div className="space-y-1.5">
                <div className="h-3 bg-[var(--primary-soft)] rounded w-full"></div>
                <div className="h-4 bg-[var(--primary-soft)] rounded w-3/4"></div>
                <div className="h-3 bg-[var(--primary-soft)] rounded w-1/2"></div>
              </div>
              <div className="w-full flex items-end mt-2">
                <div
                  className="w-full bg-[var(--primary-soft)] rounded-t-md"
                  style={{ height: `${Math.max(30, (5 - idx) * 15 + 20)}px` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const timePeriodOptions = Object.keys(timePeriods).map((key) => ({
    label: timePeriods[key].label,
    value: key,
  }));

  const currentDataset =
    timePeriods[selectedKey] || timePeriods[Object.keys(timePeriods)[0]];

  // Yahan steps ko value ke mutabiq Max to Min (Descending) sort kar diya hai
  const sortedSteps = [...currentDataset.steps].sort(
    (a, b) => b.value - a.value,
  );

  const maxValue = Math.max(...sortedSteps.map((s) => s.value));

  return (
    <div className="bg-[var(--background)] p-4 rounded-2xl shadow-xl border border-[var(--border)] flex flex-col justify-between h-full w-full select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-[var(--text)]">
          Conversion Rate
        </h3>

        <CustomSelect
          value={selectedKey}
          options={timePeriodOptions}
          onChange={(value) => setSelectedKey(value)}
          className="w-28 shrink-0"
        />
      </div>

      {/* Funnel Grid */}
      <div className="grid grid-cols-5 h-full items-end pt-2">
        {sortedSteps.map((step, idx) => {
          const isNegative = step.percentageChange < 0;

          const heightPercent = Math.max(
            15,
            Math.round((step.value / maxValue) * 100),
          );

          return (
            <div
              key={idx}
              className="flex flex-col justify-between h-full border-r border-[var(--border)] last:border-r-0 px-2"
            >
              <div>
                <span className="text-[9px] text-[var(--text-muted)] font-medium leading-tight h-5 line-clamp-2 block">
                  {step.label}
                </span>

                <div className="mt-1">
                  <span className="text-xs font-extrabold text-[var(--text)] leading-none block">
                    {step.value.toLocaleString()}
                  </span>

                  <span
                    className={`text-[9px] font-semibold mt-0.5 inline-block ${
                      isNegative
                        ? "text-[var(--primary-dark)] bg-[var(--primary-light)] px-1 py-0.2 rounded"
                        : "text-[var(--primary-dark)] bg-[var(--primary-soft)] px-1 py-0.2 rounded"
                    }`}
                  >
                    {isNegative ? "" : "+"}
                    {step.percentageChange}%
                  </span>
                </div>
              </div>

              <div className="w-full h-20 flex items-end mt-2">
                <div
                  className="w-full rounded-t-md transition-all duration-300"
                  style={{
                    height: `${heightPercent}%`,
                    backgroundColor: step.barColor,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConversionRateCard;
