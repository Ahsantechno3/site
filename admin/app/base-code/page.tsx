"use client";

import TopBar from "@/components/ui/TopBar";
import StatsGrid from "@/components/models/StatsGrid";
import { RefreshCcwDot, Download, Plus } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import TabsBar, { HeaderActionButton } from "@/components/models/TabsBar";
import FilterBar from "@/components/models/FilterBar";
import { CreateTable } from "@/components/models/CreateTable";
import Pagination from "@/components/models/Pagination";
import { DetailPanel } from "@/components/models/DetailPanel";
import FormModal, { ItemFormData, SelectOption } from "@/components/models/FormModal";

interface ProductSpecification {
  key: string;
  value: string;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  brand: string;
  status: "published" | "draft" | "archived";
  image?: string;
  gallery?: string[];
  price: number;
  salePrice: number;
  discount?: number;
  rating?: number;
  reviewsCount?: number;
  stock: number;
  lowStockThreshold: number;
  weight?: number;
  dimensions?: string;
  featured?: boolean;
  createdAt?: string;
  shortDescription?: string;
  description?: string;
  tags?: string[];
  specifications?: ProductSpecification[];
}

const rawProducts: Product[] = [
  {
    id: 1,
    name: "SoundMax Headphones Pro",
    sku: "SM-HD-001",
    category: "electronics",
    brand: "soundmax",
    status: "published",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80",
    ],
    price: 199.99,
    salePrice: 149.99,
    discount: 25,
    rating: 4.8,
    reviewsCount: 124,
    stock: 45,
    lowStockThreshold: 10,
    weight: 0.35,
    dimensions: "18 x 15 x 8 cm",
    featured: true,
    createdAt: "2026-01-15",
    shortDescription: "High fidelity wireless noise cancelling headphones.",
    description:
      "Premium wireless headphones built with advanced noise cancellation technology and long-lasting battery life.",
    tags: ["Wireless", "Audio", "Noise-Cancelling"],
    specifications: [
      { key: "Battery Life", value: "30 Hours" },
      { key: "Bluetooth", value: "v5.3" },
    ],
  },
  {
    id: 2,
    name: "Nike Zoom Running Shoes",
    sku: "NK-SH-002",
    category: "fashion",
    brand: "nike",
    status: "draft",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
    ],
    price: 120.0,
    salePrice: 99.99,
    discount: 17,
    rating: 4.5,
    reviewsCount: 88,
    stock: 12,
    lowStockThreshold: 5,
    weight: 0.8,
    dimensions: "30 x 20 x 12 cm",
    featured: false,
    createdAt: "2026-02-01",
    shortDescription: "Lightweight and comfortable daily running shoes.",
    description:
      "Designed for ultimate marathon support and everyday comfort with breathable mesh fabric.",
    tags: ["Footwear", "Sports", "Running"],
    specifications: [
      { key: "Upper Material", value: "Mesh" },
      { key: "Sole", value: "Rubber" },
    ],
  },
  {
    id: 3,
    name: "iPhone 15 Pro",
    sku: "AP-IP15-003",
    category: "electronics",
    brand: "apple",
    status: "archived",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80",
    ],
    price: 999.0,
    salePrice: 949.0,
    discount: 5,
    rating: 4.9,
    reviewsCount: 310,
    stock: 8,
    lowStockThreshold: 10,
    weight: 0.18,
    dimensions: "14.6 x 7.1 x 0.8 cm",
    featured: true,
    createdAt: "2025-11-20",
    shortDescription: "Titanium design with A17 Pro chip.",
    description:
      "The most powerful iPhone ever with a lightweight aerospace-grade titanium body and advanced camera system.",
    tags: ["Mobile", "Apple", "Smartphone"],
    specifications: [
      { key: "Chip", value: "A17 Pro" },
      { key: "Display", value: "6.1 Super Retina XDR" },
    ],
  },
];

const tablist = ["All Products", "Published", "Draft", "Archived"];

const filtersConfig = [
  {
    id: "category",
    placeholder: "All Categories",
    options: [
      { label: "All Categories", value: "all" },
      { label: "Electronics", value: "electronics" },
      { label: "Fashion", value: "fashion" },
    ],
  },
  {
    id: "brand",
    placeholder: "All Brands",
    options: [
      { label: "All Brands", value: "all" },
      { label: "SoundMax", value: "soundmax" },
      { label: "Nike", value: "nike" },
      { label: "Apple", value: "apple" },
    ],
  },
];

// Simple custom select fallback element
const CustomSelect: React.FC<{
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  className?: string;
}> = ({ value, options, onChange, className }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`w-full px-3 py-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl text-xs text-[#111827] focus:ring-1 focus:ring-[#f97316] outline-none ${className}`}
  >
    <option value="" disabled>
      Select an option
    </option>
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);
const DashboardLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState("All Products");
  const [items, setItems] = useState<Product[]>(rawProducts);
  const [displayProducts, setDisplayProducts] =
    useState<Product[]>(rawProducts);
  const [selectedRow, setSelectedRow] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const totalPages = 20;

  // FormModal required state definitions
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState<ItemFormData>({});

  // FormModal select options definition
  const categoryOptions: SelectOption[] = [
    { label: "Electronics", value: "electronics" },
    { label: "Fashion", value: "fashion" },
  ];

  const brandOptions: SelectOption[] = [
    { label: "SoundMax", value: "soundmax" },
    { label: "Nike", value: "nike" },
    { label: "Apple", value: "apple" },
  ];

  const statusOptions: SelectOption[] = [
    { label: "Published", value: "published" },
    { label: "Draft", value: "draft" },
    { label: "Archived", value: "archived" },
  ];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      await new Promise((resolve) => setTimeout(resolve, 300));
      setItems(rawProducts);
    } catch (err) {
      console.error(err);
      setError("Products load nahi ho rahe.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const tabFilteredProducts = useMemo(() => {
    if (activeTab === "All Products") return items;
    return items.filter(
      (product) => product.status === activeTab.toLowerCase(),
    );
  }, [items, activeTab]);

  const handleTabChange = (selectedTab: string) => {
    setActiveTab(selectedTab);
    setSelectedRow(null);
  };

  useEffect(() => {
    setDisplayProducts(tabFilteredProducts);
  }, [tabFilteredProducts]);

  const handleFilterDataChange = (data: Product[]) => {
    setDisplayProducts(data);
    if (selectedRow && !data.some((item) => item.id === selectedRow.id)) {
      setSelectedRow(null);
    }
  };

  const handleSelectRow = (item: Product) => {
    setSelectedRow(item);
  };

  const handleSearchResults = (results: Product[]) => {
    setDisplayProducts(results);
    setSelectedRow(results.length > 0 ? results[0] : null);
  };

  const btnlist: HeaderActionButton[] = [
    { id: "export", label: "Export", icon: Download, variant: "secondary" },
    { id: "new-product", label: "New Product", icon: Plus, variant: "primary" },
    {
      id: "refresh",
      label: "Refresh",
      icon: RefreshCcwDot,
      variant: "primary",
    },
  ];

  const handleBtnClick = (btnId: string) => {
    switch (btnId) {
      case "export":
        console.log("Export clicked");
        break;
      case "new-product":
        setFormMode("add");
        setFormData({
          name: "",
          sku: "",
          category: "electronics",
          brand: "soundmax",
          status: "published",
          price: 0,
          salePrice: 0,
          stock: 0,
          lowStockThreshold: 5,
          featured: false,
          tags: [],
          specifications: [],
        });
        setIsModalOpen(true);
        break;
      case "refresh":
        fetchProducts();
        break;
    }
  };

  const handleEditProduct = (item: Product) => {
    setFormMode("edit");
    setFormData({
      id: item.id,
      name: item.name,
      sku: item.sku,
      category: item.category,
      brand: item.brand,
      status: item.status,
      price: item.price,
      salePrice: item.salePrice,
      discount: item.discount,
      stock: item.stock,
      lowStockThreshold: item.lowStockThreshold,
      weight: item.weight,
      dimensions: item.dimensions,
      featured: item.featured,
      shortDescription: item.shortDescription,
      description: item.description,
      tags: item.tags || [],
      specifications: item.specifications || [],
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (id: string | number) => {
    console.log("Delete product ID:", id);
    setItems((prev) => prev.filter((prod) => prod.id !== id));
    setSelectedRow(null);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (formMode === "add") {
      const newProduct: Product = {
        id: Date.now(),
        name: formData.name || "Untitled Product",
        sku: formData.sku || "",
        category: formData.category || "electronics",
        brand: formData.brand || "soundmax",
        status: (formData.status as Product["status"]) || "published",
        price: Number(formData.price) || 0,
        salePrice: Number(formData.salePrice) || 0,
        discount: Number(formData.discount) || 0,
        stock: Number(formData.stock) || 0,
        lowStockThreshold: Number(formData.lowStockThreshold) || 5,
        weight: Number(formData.weight) || 0,
        dimensions: formData.dimensions || "",
        featured: Boolean(formData.featured),
        shortDescription: formData.shortDescription || "",
        description: formData.description || "",
        tags: formData.tags || [],
        specifications: formData.specifications || [],
        createdAt: new Date().toISOString().split("T")[0],
      };
      setItems((prev) => [newProduct, ...prev]);
    } else {
      setItems((prev) =>
        prev.map((item) =>
          item.id === formData.id
            ? {
                ...item,
                ...formData,
                status: (formData.status as Product["status"]) || item.status,
              }
            : item,
        ),
      );

      if (selectedRow && selectedRow.id === formData.id) {
        setSelectedRow((prev) =>
          prev ? ({ ...prev, ...formData } as Product) : null,
        );
      }
    }

    setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen w-full flex-col text-slate-800 antialiased lg:h-screen lg:overflow-hidden">
      {/* Top Bar */}
      <header className="flex shrink-0 w-full items-center justify-between bg-white p-3 ">
        <TopBar
          title="Products"
          subtitle="Manage and organize all your products"
          user={{
            name: "Marcus George",
            role: "Admin",
            avatar: "https://via.placeholder.com/150",
          }}
          messages={[]}
          notifications={[]}
          searchPlaceholder="Search products..."
          searchData={items}
          searchFields={["name", "category", "brand"]}
          onSearchResults={(results) =>
            handleSearchResults(results as Product[])
          }
        />
      </header>

      {/* Main Container */}
      <div className="flex flex-1 flex-col min-h-0 w-full overflow-y-auto lg:flex-row lg:overflow-hidden">
        {/* Left Panel */}
        <section className="flex flex-1 flex-col min-w-156 min-h-0 bg-white p-4 sm:p-3 space-y-3 lg:overflow-hidden">
          {/* Stats Section */}
          <div className="w-full shrink-0">
            <StatsGrid pageUrl="customer" />
          </div>

          {/* Main Card Container */}
          <div className="flex flex-1 flex-col min-h-100 lg:min-h-0 w-full rounded-xl border border-gray-200 bg-white shadow-sm lg:overflow-hidden">
            {/* Tabs Header */}
            <div className="shrink-0 border-b border-gray-200 bg-white px-4 sm:px-3 pt-3 pb-1 overflow-x-auto rounded-t-xl">
              <TabsBar
                tablist={tablist}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                btnlist={btnlist}
                onBtnClick={handleBtnClick}
              />
            </div>

            {/* Filter Bar */}
            <div className="shrink-0 bg-white px-3 sm:px-3 pt-3 pb-1">
              <FilterBar
                sourceData={tabFilteredProducts}
                searchableFieldsKeys={["name", "category", "brand"]}
                searchPlaceholder="Search products..."
                filtersData={filtersConfig}
                onDataChange={handleFilterDataChange}
              />
            </div>

            {/* Table Area */}
            <div className="flex-1 min-h-0 border border-gray-200 rounded-xl overflow-auto bg-white mx-3">
              {loading ? (
                <div className="flex h-48 sm:h-full w-full items-center justify-center text-sm font-medium text-gray-400">
                  Loading products...
                </div>
              ) : error ? (
                <div className="flex h-48 sm:h-full w-full items-center justify-center text-sm font-medium text-red-500">
                  {error}
                </div>
              ) : (
                <div className="w-full pb-0.5 pr-0.5 h-full overflow-auto">
                  <CreateTable
                    data={displayProducts}
                    selectedItem={selectedRow}
                    onSelectItem={handleSelectRow}
                    columnHeaders={{
                      id: "ID",
                      name: "Product",
                      category: "Category",
                      brand: "Brand",
                      status: "Status",
                    }}
                  />
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="shrink-0 rounded-b-xl bg-white px-3">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={(page) => setCurrentPage(page)}
                onItemsPerPageChange={(limit) => {
                  setItemsPerPage(limit);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </section>

        {/* Detail Panel Component */}
        <DetailPanel
          selectedItem={
            selectedRow
              ? {
                  id: selectedRow.id,
                  title: selectedRow.name,
                  sku: selectedRow.sku,
                  status: selectedRow.status,
                  image: selectedRow.image,
                  gallery: selectedRow.gallery,
                  price: selectedRow.price,
                  salePrice: selectedRow.salePrice,
                  discount: selectedRow.discount,
                  rating: selectedRow.rating,
                  reviewsCount: selectedRow.reviewsCount,
                  shortDescription: selectedRow.shortDescription,
                  description: selectedRow.description,
                  tags: selectedRow.tags,
                  specifications: selectedRow.specifications,
                  attributes: {
                    category: selectedRow.category,
                    brand: selectedRow.brand,
                    stock: `${selectedRow.stock} units`,
                    lowStockAlert: `${selectedRow.lowStockThreshold} units`,
                    weight: selectedRow.weight
                      ? `${selectedRow.weight} kg`
                      : null,
                    dimensions: selectedRow.dimensions,
                    featured: selectedRow.featured,
                    createdAt: selectedRow.createdAt,
                  },
                }
              : null
          }
          panelTitle="Product Details"
          onClose={() => setSelectedRow(null)}
          onEdit={() => selectedRow && handleEditProduct(selectedRow)}
          onDelete={(id) => handleDeleteProduct(id)}
          editLabel="Edit Product"
          deleteLabel="Delete Product"
        />
      </div>

      {/* Form Modal Component Integration */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formMode={formMode}
        itemTypeLabel="Product"
        formData={formData}
        setFormData={setFormData}
        handleSave={handleSaveProduct}
        categoryOptions={categoryOptions}
        brandOptions={brandOptions}
        statusOptions={statusOptions}
        // CustomSelect={CustomSelect}
      />
    </div>
  );
};

export default DashboardLayout;
