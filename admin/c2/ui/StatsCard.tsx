import React from "react";
import { LucideIcon } from "lucide-react";

// Theme types
export type CardTheme = "green" | "purple" | "orange" | "blue";

export interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  period?: string;
  icon?: LucideIcon;
  theme?: CardTheme;
}

// Color Styles Mapping using theme variables with fallback Tailwind classes
const themeStyles: Record<
  CardTheme,
  { dotBg: string; iconBg: string; iconColor: string }
> = {
  green: {
    dotBg: "bg-emerald-500",
    iconBg: "bg-emerald-50 dark:bg-emerald-950/30",
    iconColor: "text-emerald-500",
  },
  purple: {
    dotBg: "bg-purple-500",
    iconBg: "bg-purple-50 dark:bg-purple-950/30",
    iconColor: "text-purple-500",
  },
  orange: {
    dotBg: "bg-[var(--primary)]",
    iconBg: "bg-[var(--primary-light,rgba(249,115,22,0.1))]",
    iconColor: "text-[var(--primary)]",
  },
  blue: {
    dotBg: "bg-blue-500",
    iconBg: "bg-blue-50 dark:bg-blue-950/30",
    iconColor: "text-blue-500",
  },
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive,
  period = "vs last week",
  icon: Icon,
  theme = "green",
}) => {
  const currentTheme = themeStyles[theme] || themeStyles.green;

  return (
    <div className="w-full min-w-0 flex flex-col justify-between p-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xl transition-all">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5">
          {/* Live Indicator Dot */}
          <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${currentTheme.dotBg}`} />

          <span className="text-xs font-medium text-[var(--text-muted)] truncate">
            {title}
          </span>
        </div>

        {/* Dynamic Icon Background */}
        {Icon && (
          <div
            className={`shrink-0 flex items-center justify-center rounded-xl p-2.5 ${currentTheme.iconBg} ${currentTheme.iconColor}`}
          >
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="mt-2">
        <h3 className="text-xl font-bold tracking-tight text-[var(--text)]">
          {value}
        </h3>

        <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{period}</p>
      </div>
    </div>
  );
};

export default StatCard;