"use client";

import React, { useState } from "react";
import {CreateTable} from "@/components/models/CreateTable";
import { SearchBar } from "@/components/ui/SearchBar";
import CustomSelect from "@/components/ui/Select";

export interface OrderItem {
  id: string;
  orderId: string;
  customer: string;
  category: string;
  productName: string;
  productImage?: string;
  qty: number;
  total: number;
  status: "Shipped" | "Processing" | "Delivered" | "Pending";
}

interface RecentOrdersProps {
  orders?: OrderItem[];
}

export const RecentOrdersCard: React.FC<RecentOrdersProps> = ({ orders }) => {
  const isLoading = !orders;

  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  // Safe fallback agar orders undefined hon
  const activeOrders = orders || [];

  // Search results state
  const [searchResults, setSearchResults] = useState<OrderItem[]>(activeOrders);

  // Jab orders props update ho jayein to search results ko bhi sync kar lein
  React.useEffect(() => {
    if (orders) {
      setSearchResults(orders);
    }
  }, [orders]);

  if (isLoading) {
    return (
      <div className="bg-(--background) p-5 rounded-2xl shadow-sm border border-(--border) flex flex-col justify-between h-full w-full select-none animate-pulse">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="h-5 bg-(--primary-soft) rounded w-32"></div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="h-9 bg-(--primary-soft) rounded w-48"></div>
            <div className="h-9 bg-(--primary-soft) rounded w-36"></div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4].map((_, idx) => (
            <div key={idx} className="h-10 bg-(--primary-soft) rounded-lg w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  const categoryOptions = [
    { label: "All Categories", value: "All Categories" },
    { label: "Electronics", value: "Electronics" },
    { label: "Footwear", value: "Footwear" },
    { label: "Appliances", value: "Appliances" },
  ];

  // Category ke hisab se filtered data nikalain
  const categoryFilteredOrders = activeOrders.filter(
    (order) => selectedCategory === "All Categories" || order.category === selectedCategory
  );

  return (
    <div className="bg-(--background) p-5 rounded-2xl shadow-sm border border-(--border) flex flex-col justify-between h-full w-full select-none">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <h3 className="text-base font-bold text-(--text)">Recent Orders</h3>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* SearchBar ko categoryFilteredOrders pass karein taake search usi category ke andar ho */}
          <SearchBar<OrderItem>
            searchSourceData={categoryFilteredOrders}
            searchableFieldsKeys={["customer", "productName", "orderId"]}
            onSearchResultsUpdate={setSearchResults}
            searchPlaceholder="Search customer or product..."
          />

          <CustomSelect
            value={selectedCategory}
            options={categoryOptions}
            onChange={(val) => {
              setSelectedCategory(val);
              // Jab category change ho to search results ko bhi us category ke data se reset kar dein
              const filtered = activeOrders.filter(
                (order) => val === "All Categories" || order.category === val
              );
              setSearchResults(filtered);
            }}
            className="w-36 shrink-0"
          />
        </div>
      </div>

      <CreateTable<OrderItem>
        data={searchResults}
        onSelectItem={() => undefined}
      />
    </div>
  );
};

export default RecentOrdersCard;