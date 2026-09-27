import {
  Home,
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  FileText,
  Percent,
  Blocks,
  HelpCircle,
  Settings,
  Search,
  Maximize,
  Bell,
  ChevronDown,
  DollarSign,
  Eye,
  TrendingUp,
  MoreHorizontal,
  Group,
  Image, // Media ke liye Image use kiya hai
} from "lucide-react";

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
  | "media";

type SidebarItemProps = {
  name: string;
  icon: IconType;
  iconsize: number;
  tooltip?: string;
  link?: string;
  tailwindcss?: string;
};

const icons = {
  // Navigation
  home: Home,
  dashboard: LayoutDashboard,
  orders: ShoppingCart,
  products: Package,
  customers: Users,
  reports: FileText,
  discounts: Percent,
  integrations: Blocks,
  help: HelpCircle,
  settings: Settings,

  // Header
  search: Search,
  fullscreen: Maximize,
  notifications: Bell,
  dropdown: ChevronDown,

  // Dashboard / Analytics
  sales: DollarSign,
  visitors: Eye,
  growth: TrendingUp,
  more: MoreHorizontal,
  group: Group,
  media: Image,
};

const SidebarItem = ({
  name,
  icon,
  iconsize,
  tooltip,
  tailwindcss = "",
  link,
}: SidebarItemProps) => {
  const Icon = icons[icon];

  return (
    <a
      title={tooltip || undefined}
      href={link}
      className={`
        flex
        items-center
        gap-3
        rounded-md
        p-2
        text-xl
        cursor-pointer
        text-(--text)
        hover:bg-(--primary)
        hover:text-(--text-soft)
        ${tailwindcss}
      `}
    >
      {Icon && <Icon size={iconsize} />}

      {name && <h2>{name}</h2>}
    </a>
  );
};

export default SidebarItem;