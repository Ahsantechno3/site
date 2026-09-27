import React from "react";
import { OrderItem } from "@/c2/layout/RecentOrdersCard";

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  Shipped: {
    bg: "bg-[var(--primary-light)]",
    text: "text-(--primary-dark)",
    dot: "bg-(--primary)",
  },
  Processing: {
    bg: "bg-(--primary-soft)",
    text: "text-(--primary-dark)",
    dot: "bg-(--primary)",
  },
  Delivered: {
    bg: "bg-[var(--primary-light)]",
    text: "text-(--primary-dark)",
    dot: "bg-(--primary)",
  },
  Pending: {
    bg: "bg-(--surface)",
    text: "text-(--text-muted)",
    dot: "bg-[var(--text-muted)]",
  },
};

interface TableListItemProps {
  order: OrderItem;
  index: number;
}

export const TableListItem: React.FC<TableListItemProps> = ({ order, index }) => {
  const status = statusStyles[order.status] || statusStyles.Pending;

  return (
    <tr className="odd:bg-(--primary-soft) even:bg-(--background) hover:bg-(--primary-light)/40 transition-colors">
      <td className="py-3 px-1.5 text-(--text-muted) font-medium">
        {index + 1}
      </td>
      <td className="py-3 px-1.5 text-(--text-muted) font-semibold">
        {order.orderId}
      </td>
      <td className="py-3 px-1.5 text-(--text) font-semibold whitespace-nowrap">
        {order.customer}
      </td>
      <td className="py-3 px-1.5">
        <div className="flex items-center justify-center gap-1 whitespace-nowrap">
          <span className="text-base">{order.productImage}</span>
          <span className="text-(--text) font-medium">
            {order.productName}
          </span>
        </div>
      </td>
      <td className="py-3 px-1.5 text-center text-(--text-muted) font-medium">
        {order.qty}
      </td>
      <td className="py-3 px-1.5 text-(--text) font-extrabold">
        ${order.total}
      </td>
      <td className="py-3 px-3">
        <span
          className={`inline-flex items-center gap-1.5 px-1.5 py-1 rounded-full text-[10px] font-bold ${status.bg} ${status.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {order.status}
        </span>
      </td>
    </tr>
  );
};