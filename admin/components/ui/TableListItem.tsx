import React from "react";
import { OrderItem } from "@/components/layout/RecentOrdersCard";

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  Shipped: {
    bg: "bg-[var(--primary-light,#fff7ed)]",
    text: "text-[var(--primary)]",
    dot: "bg-[var(--primary)]",
  },
  Processing: {
    bg: "bg-[var(--surface-muted)]",
    text: "text-[var(--primary)]",
    dot: "bg-[var(--primary)]",
  },
  Delivered: {
    bg: "bg-[var(--primary-light,#fff7ed)]",
    text: "text-[var(--primary)]",
    dot: "bg-[var(--primary)]",
  },
  Pending: {
    bg: "bg-[var(--surface-muted)]",
    text: "text-[var(--text-muted)]",
    dot: "bg-[var(--text-muted)]",
  },
};

interface TableListItemProps {
  order: OrderItem;
  index: number;
}

export const TableListItem: React.FC<TableListItemProps> = ({ order, index }) => {
  const status = statusStyles[order.status] || statusStyles.Pending;

  const isImageUrl =
    typeof order.productImage === "string" &&
    (order.productImage.startsWith("http") ||
      order.productImage.startsWith("/") ||
      order.productImage.startsWith("data:image"));

  return (
    <tr className="odd:bg-[var(--surface-muted)] even:bg-[var(--surface)] hover:bg-[var(--surface-hover,var(--surface-muted))] transition-colors">
      <td className="py-3 px-1.5 text-[var(--text-muted)] font-medium">
        {index + 1}
      </td>
      <td className="py-3 px-1.5 text-[var(--text-muted)] font-semibold">
        {order.orderId}
      </td>
      <td className="py-3 px-1.5 text-[var(--text)] font-semibold whitespace-nowrap">
        {order.customer}
      </td>
      <td className="py-3 px-1.5">
        <div className="flex items-center justify-start gap-2 whitespace-nowrap">
          {/* Only render image box if productImage exists */}
          {order.productImage ? (
            isImageUrl ? (
              <img
                src={order.productImage}
                alt={order.productName || "Product"}
                className="w-8 h-8 rounded-md object-cover border border-[var(--border)] shrink-0"
                onError={(e) => {
                  // Fallback if URL is broken
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/32?text=IMG";
                }}
              />
            ) : (
              <span className="text-base shrink-0">{order.productImage}</span>
            )
          ) : null}

          <span className="text-[var(--text)] font-medium truncate">
            {order.productName}
          </span>
        </div>
      </td>
      <td className="py-3 px-1.5 text-center text-[var(--text-muted)] font-medium">
        {order.qty}
      </td>
      <td className="py-3 px-1.5 text-[var(--text)] font-extrabold">
        ${order.total}
      </td>
      <td className="py-3 px-3">
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${status.bg} ${status.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {order.status}
        </span>
      </td>
    </tr>
  );
};

export default TableListItem;