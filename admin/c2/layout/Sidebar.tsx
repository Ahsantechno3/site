"use client";

import React, { useState } from "react";
import { Home, X, Menu } from "lucide-react";
import SidebarItem from "@/c2/ui/SidebarItem";

export type IconType =
  | "home"
  | "dashboard"
  | "orders"
  | "products"
  | "customers"
  | "reports"
  | "discounts"
  | "integrations"
  | "help"
  | "settings"
  | "search"
  | "fullscreen"
  | "notifications"
  | "dropdown"
  | "sales"
  | "visitors"
  | "growth"
  | "more"
  | "group"
  |"media";

interface SidebarConfig {
  name: string;
  icon: IconType;
  iconsize: number;
  link: string;
  tailwindcss?: string;
}

const TOP_ITEMS: SidebarConfig[] = [
  { name: "Dashboard", icon: "dashboard", iconsize: 20, link: "/" },
  { name: "Customers", icon: "customers", iconsize: 20, link: "/customers" },
  { name: "Products", icon: "products", iconsize: 20, link: "/products" },
  { name: "Orders", icon: "orders", iconsize: 20, link: "/orders" },
  { name: "Category", icon: "group", iconsize: 20, link: "/categories" },
  { name: "Brands", icon: "sales", iconsize: 20, link: "/brands" },
  { name: "Coupons", icon: "discounts", iconsize: 20, link: "/coupons" },
  { name: "Media", icon: "media", iconsize: 20, link: "/media" },
  { name: "Reviews", icon: "reports", iconsize: 20, link: "/reviews" },
];

const BOTTOM_ITEMS: SidebarConfig[] = [
  // { name: "Integrations", icon: "integrations", iconsize: 20, link: "" },
  // { name: "Help", icon: "help", iconsize: 20, link: "" },
  { name: "Settings", icon: "settings", iconsize: 20, link: "/setting" },
];

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const renderSidebarItem = (item: SidebarConfig) => {
    const iconSizeCalculated = isOpen
      ? item.iconsize
      : item.iconsize + 8;

    const baseClasses = item.tailwindcss || "";
    const computedTailwind = isOpen
      ? baseClasses
      : `${baseClasses} flex justify-center text-2xl`;

    return (
      <SidebarItem
        key={item.name}
        name={isOpen ? item.name : ""}
        icon={item.icon}
        link={item.link}
        iconsize={Number(iconSizeCalculated)}
        tooltip={isOpen ? "" : item.name}
        tailwindcss={computedTailwind}
      />
    );
  };

  return (
    <aside
      className={`h-[calc(100dvh-24px)] sticky top-3 left-3 z-50 transition-all duration-300 ${
        isOpen ? " lg:w-53 w-15 " : "w-15 "
      }`}
    >
      <div
        className={`${
          isOpen ? "min-w-42 w-[40svw] md:w-64 lg:w-full" : "w-fit"
        } h-full flex flex-col shadow-xl p-2 bg-(--primary-light) rounded-md`}
      >
        {/* Logo Bar */}
        <div className="h-12 p-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-(--text) font-semibold">
            {isOpen && (
              <>
                <Home className="w-5 h-5" />
                <span>Ecom</span>
              </>
            )}
          </div>

          <button
            type="button"
            className={`${isOpen ? "ml-auto" : "mx-auto"} text-(--text) cursor-pointer focus:outline-none`}
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isOpen ? <X size={20} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Divider */}
        <hr className="border-(--border) my-2" />

        {/* Sidebar Items */}
        <div className="flex flex-col h-full justify-between">
          {/* Top Items */}
          <nav className="flex flex-col gap-1">
            {TOP_ITEMS.map(renderSidebarItem)}
          </nav>

          {/* Bottom Items */}
          <nav className="flex flex-col gap-1">
            {BOTTOM_ITEMS.map(renderSidebarItem)}
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
