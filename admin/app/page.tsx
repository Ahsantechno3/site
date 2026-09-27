// /app/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import StatsOverview from "@/c2/layout/StatsOverview";
import TopCategories from "@/c2/layout/TopCategories";
import RevenueAnalytics from "@/c2/layout/RevenueAnalytics";
import MonthlyTargetCard from "@/c2/layout/MonthlyTargetCard";
import ActiveUserCard from "@/c2/layout/ActiveUserCard";
import ConversionRateCard from "@/c2/layout/ConversionRateCard";
import TrafficSourcesCard from "@/c2/layout/TrafficSourcesCard";
import RecentOrdersCard from "@/c2/layout/RecentOrdersCard";
import TopBar from "@/c2/ui/TopBar";
import { getDashboardAllData } from "@/services/dashboardService";

export default function Page() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [period, setPeriod] = useState<string>("month");

  const [productsList] = useState([
    { id: 1, name: "Wireless Earbuds", category: "Audio", sku: "AUD-01" },
    { id: 2, name: "Mechanical Keyboard", category: "Accessories", sku: "KB-09" },
  ]);

  const [filteredProducts, setFilteredProducts] = useState(productsList);

  const currentUser = {
    name: "Marcus George",
    role: "Admin",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  };

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getDashboardAllData(period);
        if (!cancelled) setDashboardData(data);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [period]);

  return (
    <div className="flex-1 min-w-0 p-3 bg-[var(--background)] text-[var(--text)] transition-colors duration-200">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_1fr_1.1fr]">
        {/* TopBar */}
        <section className="md:col-span-4 lg:col-span-4 lg:row-start-1">
          <div className="rounded-xl">
            <TopBar
              title="Dashboard"
              subtitle="Manage inventory and store items"
              user={currentUser}
              searchPlaceholder="Search products or SKU..."
              searchData={productsList}
              searchFields={["name", "category", "sku"]}
              onSearchResults={(results) => setFilteredProducts(results)}
            />
          </div>
        </section>

        {/* Box 1: Stats Overview */}
        <section className="md:col-span-4 lg:col-span-3 lg:row-start-2">
          <StatsOverview statsData={dashboardData?.overview} />
        </section>

        {/* Box 5: Active User Card */}
        <section className="md:col-span-1 md:row-start-4 lg:col-start-1 lg:row-start-4">
          <ActiveUserCard
            totalUsers={dashboardData?.activeUserMetrics?.dailyActiveUsers}
            countriesData={dashboardData?.activeUserMetrics?.countryBreakdown}
          />
        </section>

        {/* Box 3: Revenue Analytics */}
        <section className="h-full md:col-span-2 md:row-start-3 lg:col-start-1 lg:row-start-3 lg:col-span-2">
          <RevenueAnalytics timePeriodData={dashboardData?.overview} />
        </section>

        {/* Box 4: Monthly Target Card */}
        <section className="md:col-span-1 md:row-start-3 lg:col-start-3 lg:row-start-3">
          <MonthlyTargetCard
            targetAmount={dashboardData?.overview?.monthlyTarget}
            revenueAmount={dashboardData?.overview?.monthlyTargetAchieved}
          />
        </section>

        {/* Box 2: Categories Performance */}
        <section className="md:col-span-1 md:row-span-2 md:row-start-3 lg:col-start-4 lg:row-start-2 lg:row-span-2">
          <TopCategories categoriesData={dashboardData?.categoryPerformance} />
        </section>

        {/* Box 6: Conversion Rate Funnel */}
        <section className="md:col-span-2 md:row-start-4 lg:col-start-2 lg:row-start-4 lg:col-span-2">
          <ConversionRateCard timePeriods={dashboardData?.conversionFunnel} />
        </section>

        {/* Box 7: Traffic Sources */}
        <section className="md:col-span-1 md:row-start-5 lg:col-start-4 lg:row-start-4">
          <TrafficSourcesCard sources={dashboardData?.trafficSources} />
        </section>

        {/* Box 8: Recent Orders */}
        <section className="md:col-start-2 md:col-span-3 md:row-start-5 lg:col-start-1 lg:row-start-5 lg:col-span-4">
          <RecentOrdersCard orders={dashboardData?.recentOrders} />
        </section>
      </div>
    </div>
  );
}