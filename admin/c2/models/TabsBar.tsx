import React from "react";
import Button from "../ui/Button";

export interface TabItem {
  id: string;
  label: string;
}

export interface HeaderActionButton {
  id: string;
  label: string;
  icon?: React.ElementType;
  variant?: "primary" | "secondary";
}

interface TabsBarProps {
  tablist: (string | TabItem)[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  btnlist?: HeaderActionButton[];
  onBtnClick?: (btnId: string) => void;
}

const TabsBar: React.FC<TabsBarProps> = ({
  tablist = [],
  activeTab,
  onTabChange,
  btnlist = [],
  onBtnClick,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 bg-[var(--surface)]">
      {/* Left Tabs Section */}
      <div className="flex items-center gap-3 flex-wrap">
        {tablist.map((tab) => {
          const tabId = typeof tab === "string" ? tab : tab.id;
          const tabLabel = typeof tab === "string" ? tab : tab.label;
          const isActive = activeTab === tabId;

          return (
            <button
              key={tabId}
              onClick={() => onTabChange && onTabChange(tabId)}
              className={`text-sm sm:text-md whitespace-nowrap transition-all relative cursor-pointer pb-1 ${
                isActive
                  ? "text-[var(--primary)] font-semibold"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              {tabLabel}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Right Buttons Section */}
      {btnlist.length > 0 && (
        <div className="flex w-full flex-wrap md:w-auto items-center gap-3 sm:gap-3">
          {btnlist.map((btn) => (
            <Button
              key={btn.id}
              variant={btn.variant || "secondary"}
              size="md"
              icon={btn.icon}
              className="flex-1 px-[8.2px] md:flex-none whitespace-nowrap"
              onClick={() => onBtnClick && onBtnClick(btn.id)}
            >
              {btn.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TabsBar;