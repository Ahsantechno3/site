import React from "react";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";

export interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  period?: string;
  icon?: LucideIcon;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive,
  period = "vs last week",
  icon: Icon,
}) => {
  return (
    <div
      className="
        w-full
        min-w-0
        h-full
        flex
        flex-col
        justify-between
        p-3
        lg:p-4
        rounded-2xl
        bg-(--background)
        border
        border-(--border)
        shadow-xl
        transition-all
        duration-200
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <span className="min-w-0 truncate text-sm font-medium text-(--text-muted)">
          {title}
        </span>

        {Icon && (
          <div
            className="
              shrink-0
              flex
              items-center
              justify-center
              rounded-xl
              p-2
              md:p-2.5
              bg-(--primary-soft)
              text-(--primary)
            "
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-4 flex items-end justify-between gap-3">
        <h3
          className="
            min-w-0
            truncate
            text-lg
            font-bold
            tracking-tight
            text-(--text)
            lg:text-xl
          "
        >
          {value}
        </h3>

        <div className="shrink-0 flex flex-col items-end">
          <div
            className={`
              inline-flex
              items-center
              gap-0.5
              rounded-full
              px-2
              py-0.5
              text-[9px]
              lg:text-[10px]
              font-semibold
              ${
                isPositive
                  ? "bg-(--primary-soft) text-(--primary-dark)"
                  : "bg-(--surface) text-(--text-muted)"
              }
            `}
          >
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}

            <span>{change}</span>
          </div>

          <span className="mt-1 text-[9px] text-(--text-muted) lg:text-[11px]">
            {period}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
