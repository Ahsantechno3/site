"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import CustomSelect from "@/c2/ui/Select";
import SearchBar from "@/components/ui/SearchBar";
import Pagination from "@/components/ui/Pagination";
import { CreateTable } from "@/components/ui/CreateTable";
import {
  Filter,
  Download,
  Plus,
  X,
  Star,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  UploadCloud,
  Tag as TagIcon,
  PlusCircle,
  Package,
} from "lucide-react";

export interface Specification {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  shortDescription?: string;
  image: string;
  gallery?: string[];
  category: string;
  brand: string;
  price: number;
  salePrice: number;
  discount?: number;
  stock: number;
  lowStockThreshold: number;
  tags: string[];
  rating?: number;
  reviewsCount?: number;
  specifications: Specification[];
  weight?: number;
  dimensions?: string;
  status: "published" | "draft" | "archived";
  featured: boolean;
  createdAt: string;
}

const initialProductsData: Product[] = (
  [
    {
      name: "Bone Conduction Open-Ear Headphones",
      sku: "ELEC-BCH-018",
      category: "Electronics",
      brand: "SoundMax",
      price: 109.99,
      salePrice: 89.99,
      discount: 18,
      stock: 4,
      lowStockThreshold: 5,
      status: "published",
      featured: false,
      weight: 0.03,
      dimensions: "13 x 10 x 4 cm",
      tags: ["bone-conduction", "running", "sports", "open-ear"],
      specifications: [
        { key: "Battery Life", value: "8 hours" },
        { key: "Water Rating", value: "IP67 Waterproof" },
      ],
      shortDescription:
        "Open-ear headphones designed for situational awareness during sports.",
      description:
        "Delivers sound through cheekbones so you stay aware of ambient surroundings while jogging or cycling.",
    },
    {
      name: "Active Stylus Pen for Touchscreen",
      sku: "ELEC-ASP-019",
      category: "Mobile Accessories",
      brand: "KeyCrafter",
      price: 29.99,
      salePrice: 24.99,
      discount: 16,
      stock: 110,
      lowStockThreshold: 10,
      status: "published",
      featured: false,
      weight: 0.02,
      dimensions: "16.5 x 0.9 x 0.9 cm",
      tags: ["stylus", "drawing", "tablet", "pen"],
      specifications: [
        { key: "Charging", value: "USB Type-C" },
        { key: "Palm Rejection", value: "Yes" },
      ],
      shortDescription:
        "Precision stylus pen for drawing, sketching, and note-taking.",
      description:
        "High precision nib with tilt sensitivity and zero lag performance for iOS and Android tablets.",
    },
    {
      name: "Bluetooth Smart Key Finder Tracker",
      sku: "ELEC-KFT-020",
      category: "Mobile Accessories",
      brand: "SecureView",
      price: 19.99,
      salePrice: 14.99,
      discount: 25,
      stock: 0,
      lowStockThreshold: 5,
      status: "archived",
      featured: false,
      weight: 0.01,
      dimensions: "3.8 x 3.8 x 0.6 cm",
      tags: ["tracker", "key-finder", "bluetooth", "tag"],
      specifications: [
        { key: "Battery", value: "CR2032 Replaceable" },
        { key: "Range", value: "200 ft Bluetooth" },
      ],
      shortDescription:
        "Locate lost keys, wallet, or bag using your phone app.",
      description:
        "Compact Bluetooth tracker tag with loud buzzer and reverse phone finder function.",
    },
  ] as Omit<Product, "id" | "image" | "createdAt">[]
).map((product, index) => ({
  ...product,
  id: `${index + 1}`,
  image: `https://placehold.co/300x300/f97316/ffffff?text=Product+${index + 1}`,
  gallery: [
    `https://placehold.co/300x300/f97316/ffffff?text=Product+${index + 1}`,
    `https://placehold.co/300x300/f97316/ffffff?text=Product+${index + 2}`,
    `https://placehold.co/300x300/f97316/ffffff?text=Product+${index + 3}`,
  ],
  createdAt: String(new Date().toLocaleDateString("en-GB").replace(/\//g, "-")),
}));

export const ProductsView: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProductsData);
  const [searchResults, setSearchResults] =
    useState<Product[]>(initialProductsData);
  const [activeTab, setActiveTab] = useState<string>("All Products");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    initialProductsData[0],
  );
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  // PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(5);
  const [paginatedProducts, setPaginatedProducts] = useState<Product[]>([]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [tagInput, setTagInput] = useState("");

  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    sku: "",
    category: "Electronics",
    brand: "SoundMax",
    price: 0,
    salePrice: 0,
    discount: 0,
    stock: 0,
    lowStockThreshold: 5,
    status: "published",
    featured: false,
    weight: 0,
    dimensions: "",
    tags: [],
    specifications: [{ key: "", value: "" }],
    shortDescription: "",
    description: "",
  });

  const categoriesOptions = [
    { label: "All Categories", value: "All Categories" },
    { label: "Electronics", value: "Electronics" },
    { label: "Fashion", value: "Fashion" },
    { label: "Home & Kitchen", value: "Home & Kitchen" },
    { label: "Wearables", value: "Wearables" },
  ];

  const statusFilterOptions = [
    { label: "All Status", value: "All Status" },
    { label: "Published", value: "Published" },
    { label: "Draft", value: "Draft" },
    { label: "Archived", value: "Archived" },
  ];

  const modalCategoryOptions = categoriesOptions.filter(
    (o) => o.value !== "All Categories",
  );

  const brandOptions = [
    { label: "SoundMax", value: "SoundMax" },
    { label: "TechGear", value: "TechGear" },
    { label: "Nike", value: "Nike" },
    { label: "Apple", value: "Apple" },
  ];

  const modalStatusOptions = [
    { label: "Published", value: "published" },
    { label: "Draft", value: "draft" },
    { label: "Archived", value: "archived" },
  ];

  // Specific column headers definition
  const columnHeaders: { [key in keyof Product]?: string } = {
    id: "ID",
    sku: "SKU",
    name: "Product Name",
    category: "Category",
    brand: "Brand",
    price: "Cost Price",
    salePrice: "Sale Price",
    stock: "Stock",
    status: "Status",
  };

  // Extract only the fields present in columnHeaders for table rendering
  const tableData = useMemo(() => {
    const fieldsToInclude = Object.keys(columnHeaders) as (keyof Product)[];
    return paginatedProducts.map((product) => {
      const filteredItem: Record<string, any> = {};
      fieldsToInclude.forEach((key) => {
        filteredItem[key] = product[key];
      });
      return filteredItem;
    });
  }, [paginatedProducts]);

  const filteredProducts = useMemo(() => {
    return searchResults.filter((p) => {
      if (activeTab === "Published" && p.status !== "published") return false;
      if (activeTab === "Draft" && p.status !== "draft") return false;
      if (activeTab === "Archived" && p.status !== "archived") return false;

      if (
        selectedCategory !== "All Categories" &&
        p.category !== selectedCategory
      )
        return false;

      if (
        selectedStatus !== "All Status" &&
        p.status.toLowerCase() !== selectedStatus.toLowerCase()
      )
        return false;

      return true;
    });
  }, [searchResults, activeTab, selectedCategory, selectedStatus]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchResults, selectedCategory, selectedStatus, activeTab]);

  const handlePaginatedDataChange = useCallback((slicedData: Product[]) => {
    setPaginatedProducts(slicedData);
  }, []);

  const handleOpenAddModal = () => {
    setFormMode("add");
    setFormData({
      name: "",
      sku: "",
      category: "Electronics",
      brand: "SoundMax",
      price: 0,
      salePrice: 0,
      discount: 0,
      stock: 0,
      lowStockThreshold: 5,
      status: "published",
      featured: false,
      weight: 0,
      dimensions: "",
      tags: ["Wireless", "Audio"],
      specifications: [{ key: "Color", value: "Black" }],
      shortDescription: "",
      description: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setFormMode("edit");
    setFormData({ ...product });
    setIsModalOpen(true);
  };

  const handleAddSpecRow = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...(prev.specifications || []), { key: "", value: "" }],
    }));
  };

  const handleRemoveSpecRow = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications?.filter((_, i) => i !== index),
    }));
  };

  const handleSpecChange = (
    index: number,
    field: "key" | "value",
    val: string,
  ) => {
    setFormData((prev) => {
      const updated = [...(prev.specifications || [])];
      updated[index][field] = val;
      return { ...prev, specifications: updated };
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tagToRemove),
    }));
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (formMode === "add") {
      const created: Product = {
        id: Date.now().toString(),
        name: formData.name || "Untitled Product",
        sku: formData.sku || `SKU-${Date.now().toString().slice(-4)}`,
        category: formData.category || "Electronics",
        brand: formData.brand || "Generic",
        price: Number(formData.price) || 0,
        salePrice: Number(formData.salePrice) || 0,
        discount: Number(formData.discount) || 0,
        stock: Number(formData.stock) || 0,
        lowStockThreshold: Number(formData.lowStockThreshold) || 5,
        status: (formData.status as Product["status"]) || "published",
        featured: Boolean(formData.featured),
        weight: Number(formData.weight) || 0,
        dimensions: formData.dimensions || "",
        tags: formData.tags || [],
        rating: 5,
        reviewsCount: 1,
        specifications:
          formData.specifications?.filter((s) => s.key && s.value) || [],
        shortDescription: formData.shortDescription,
        description: formData.description,
        createdAt: "18 Aug 2024",
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
      };

      setProducts((prev) => [created, ...prev]);
      setSelectedProduct(created);
      setCurrentPage(1);
    } else {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === formData.id ? ({ ...p, ...formData } as Product) : p,
        ),
      );

      if (selectedProduct?.id === formData.id) {
        setSelectedProduct({ ...selectedProduct, ...formData } as Product);
      }
    }

    setIsModalOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (selectedProduct?.id === id) {
      setSelectedProduct(null);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-24px)] lg:h-[calc(100vh-24px)] lg:overflow-hidden bg-[#ffffff] select-none text-xs m-3">
      <div className="flex w-full flex-col lg:flex-row gap-3">
        {/* MAIN CONTENT */}
        <div className="w-full lg:flex-1 flex flex-col pt-3 min-w-0 overflow-hidden">
          {/* TOP BAR */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-4 sm:gap-6 border-b border-[#e5e7eb] pb-2 overflow-x-auto">
              {["All Products", "Published", "Draft", "Archived"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`font-semibold pb-2 whitespace-nowrap transition-all relative cursor-pointer ${
                    activeTab === tab
                      ? "text-[#f97316] font-bold"
                      : "text-[#6b7280] hover:text-[#111827]"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f97316] rounded-full" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex w-full xl:w-auto items-center gap-2 sm:gap-3">
              <button className="flex-1 xl:flex-none justify-center flex items-center gap-1.5 px-3 py-2 font-medium text-[#111827] bg-[#f9fafb] border border-[#e5e7eb] rounded-xl hover:bg-[#e5e7eb]/50 transition-colors shadow-2xs cursor-pointer">
                <Download className="w-3.5 h-3.5 text-[#6b7280]" />
                Export
              </button>

              <button
                onClick={handleOpenAddModal}
                className="flex-1 xl:flex-none justify-center flex items-center gap-1.5 px-4 py-2 font-bold text-white bg-[#f97416e6] rounded-xl hover:bg-[#ea580c] shadow-2xs cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                New Product
              </button>
            </div>
          </div>

          {/* FILTER BAR */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-3 mb-3">
            <SearchBar
              data={products}
              searchFields={["name", "sku", "category", "brand"]}
              onSearchResults={setSearchResults}
              placeholder="Search by product name, SKU..."
            />

            <CustomSelect
              value={selectedCategory}
              options={categoriesOptions}
              onChange={setSelectedCategory}
              className="w-full sm:w-auto min-w-[140px]"
            />

            <CustomSelect
              value={selectedStatus}
              options={statusFilterOptions}
              onChange={setSelectedStatus}
              className="w-full sm:w-auto min-w-[130px]"
            />

            <button className="w-full sm:w-auto justify-center flex items-center gap-1.5 px-3 py-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl text-xs text-[#111827] hover:bg-[#e5e7eb]/50 transition-colors cursor-pointer font-medium">
              <Filter className="w-3.5 h-3.5 text-[#6b7280]" />
              Filter
            </button>
          </div>

          {/* TABLE CONTAINER */}
          <div className="producttable flex flex-col flex-1 min-h-0 bg-[#ffffff] border border-[#e5e7eb] rounded-2xl shadow-2xs overflow-hidden">
            <CreateTable
              data={tableData}
              selectedItem={selectedProduct}
              onSelectItem={(item) => {
                const fullProd = products.find((p) => p.id === item.id) || null;
                setSelectedProduct(fullProd);
                setActiveImage(null);
              }}
              columnHeaders={columnHeaders}
            />

            {/* SEPARATED PAGINATION COMPONENT */}
            <Pagination
              data={filteredProducts}
              currentPage={currentPage}
              itemsPerPage={productsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setProductsPerPage}
              onPaginatedDataChange={handlePaginatedDataChange}
            />
          </div>
        </div>

        {/* Right Column (Product Details & Specs) */}
        <aside className="w-full lg:w-96 lg:h-full lg:shrink-0 bg-[#ffffff] border border-[#e5e7eb] flex flex-col rounded-xl shadow-xs z-10 overflow-hidden">
          {selectedProduct ? (
            <>
              {/* SCROLLABLE AREA WITH PRIMARY SCROLLBAR COLOR */}
              <div className="p-3 overflow-y-auto flex flex-col space-y-3 flex-1 [scrollbar-color:#f97316_#f9fafb] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#f9fafb] [&::-webkit-scrollbar-thumb]:bg-[#f97316] [&::-webkit-scrollbar-thumb]:rounded-full">
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-[#e5e7eb] shrink-0">
                  <h3 className="font-bold text-[#1f2937] text-sm">
                    Product Details
                  </h3>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="text-[#6b7280] hover:text-[#111827] cursor-pointer p-1 rounded-lg hover:bg-[#f9fafb]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* 2-Column Split Layout for md to lg screens */}
                <div className="flex flex-col md:flex-row lg:flex-col border border-[#e5e7eb] rounded-xl ">
                  {/* Left Column: Image & Gallery */}
                  <div className="w-full md:w-5/12 lg:w-full space-y-2 shrink-0 bg-[#f9fafb] px-3 pt-3 rounded-2xl">
                    <div className="h-44 md:h-48  flex items-center justify-center overflow-hidden  border border-[#e5e7eb] rounded-2xl ">
                      <img
                        src={activeImage || selectedProduct.image}
                        alt={selectedProduct.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    {selectedProduct.gallery &&
                      selectedProduct.gallery.length > 0 && (
                        <div className="flex items-center gap-2 overflow-x-auto pt-1">
                          {selectedProduct.gallery.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              onClick={() => setActiveImage(img)}
                              className={`w-10 h-10 shrink-0 rounded-lg object-cover border cursor-pointer transition-all ${
                                (activeImage || selectedProduct.image) === img
                                  ? "border-[#f97316] ring-2 ring-[#fed7aa]"
                                  : "border-[#e5e7eb] hover:border-gray-400"
                              }`}
                              alt=""
                            />
                          ))}
                        </div>
                      )}

                    {/* Title, SKU & Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4
                          className="font-bold text-[#111827] text-sm truncate"
                          title={selectedProduct.name}
                        >
                          {selectedProduct.name}
                        </h4>
                        <div className="text-[10px] text-[#6b7280] flex items-center gap-2">
                          <span>ID: #{selectedProduct.id}</span>
                          <span>•</span>
                          <span
                            className="truncate"
                            title={selectedProduct.sku}
                          >
                            SKU: {selectedProduct.sku}
                          </span>
                        </div>
                      </div>

                      <span className="shrink-0 px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full font-bold text-[10px] capitalize">
                        {selectedProduct.status}
                      </span>
                    </div>

                    {/* Price & Rating */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-xl font-extrabold text-[#f97316]">
                          ${selectedProduct.salePrice.toFixed(2)}
                        </span>

                        {selectedProduct.price > 0 && (
                          <span className="text-[#6b7280] line-through text-[10px]">
                            ${selectedProduct.price.toFixed(2)}
                          </span>
                        )}

                        {selectedProduct.discount ? (
                          <span className="bg-red-50 text-red-500 text-[9px] font-bold px-1.5 py-0.5 rounded">
                            -{selectedProduct.discount}%
                          </span>
                        ) : null}
                      </div>

                      {selectedProduct.rating && (
                        <span className="flex items-center gap-1 font-semibold text-[#111827] text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {selectedProduct.rating} (
                          {selectedProduct.reviewsCount || 0})
                        </span>
                      )}
                    </div>

                    {/* Short Description */}
                    {selectedProduct.shortDescription && (
                      <div className="bg-[#f9fafb] p-2 rounded-lg border border-[#e5e7eb]">
                        <span className="text-[10px] font-bold text-[#6b7280] block mb-0.5 uppercase tracking-wider">
                          Short Description
                        </span>
                        <p
                          className="text-xs text-[#374151] line-clamp-2 cursor-help"
                          title={selectedProduct.shortDescription}
                        >
                          {selectedProduct.shortDescription}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Title, Prices, Specs & Descriptions */}
                  <div className="w-full md:w-7/12 lg:w-full space-y-3 p-3">
                    {/* All Fields List */}
                    <span className="text-[10px] font-bold text-[#6b7280] block mb-1 uppercase tracking-wider border-t md:border-transparent lg:border-[#e5e7eb] border-[#e5e7eb] pt-2 md:p-0 lg:pt-2">
                      Basic Info
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-2 text-xs">
                      <div className="flex justify-between gap-3 bg-[#f9fafb] p-1.5 rounded border border-[#e5e7eb]">
                        <span className="text-[#6b7280]">Category</span>
                        <span
                          className="font-semibold text-[#111827] text-right truncate max-w-[140px]"
                          title={selectedProduct.category}
                        >
                          {selectedProduct.category}
                        </span>
                      </div>

                      <div className="flex justify-between gap-3 bg-[#f9fafb] p-1.5 rounded border border-[#e5e7eb]">
                        <span className="text-[#6b7280]">Brand</span>
                        <span
                          className="font-semibold text-[#111827] text-right truncate max-w-[140px]"
                          title={selectedProduct.brand}
                        >
                          {selectedProduct.brand}
                        </span>
                      </div>

                      <div className="flex justify-between gap-3 bg-[#f9fafb] p-1.5 rounded border border-[#e5e7eb]">
                        <span className="text-[#6b7280]">Stock</span>
                        <span className="font-semibold text-[#111827] text-right">
                          {selectedProduct.stock} units
                        </span>
                      </div>

                      <div className="flex justify-between gap-3 bg-[#f9fafb] p-1.5 rounded border border-[#e5e7eb]">
                        <span className="text-[#6b7280]">Low Stock Alert</span>
                        <span className="font-semibold text-[#111827] text-right">
                          {selectedProduct.lowStockThreshold} units
                        </span>
                      </div>

                      {selectedProduct.weight !== undefined && (
                        <div className="flex justify-between gap-3 bg-[#f9fafb] p-1.5 rounded border border-[#e5e7eb]">
                          <span className="text-[#6b7280]">Weight</span>
                          <span className="font-semibold text-[#111827] text-right">
                            {selectedProduct.weight} kg
                          </span>
                        </div>
                      )}

                      {selectedProduct.dimensions && (
                        <div className="flex justify-between gap-3 bg-[#f9fafb] p-1.5 rounded border border-[#e5e7eb]">
                          <span className="text-[#6b7280]">Dimensions</span>
                          <span
                            className="font-semibold text-[#111827] text-right truncate max-w-[140px]"
                            title={selectedProduct.dimensions}
                          >
                            {selectedProduct.dimensions}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between gap-3 bg-[#f9fafb] p-1.5 rounded border border-[#e5e7eb]">
                        <span className="text-[#6b7280]">Featured</span>
                        <span className="font-semibold text-[#111827] text-right">
                          {selectedProduct.featured ? "Yes" : "No"}
                        </span>
                      </div>

                      <div className="flex justify-between gap-3 bg-[#f9fafb] p-1.5 rounded border border-[#e5e7eb]">
                        <span className="text-[#6b7280]">Created At</span>
                        <span className="font-semibold text-[#111827] text-right">
                          {selectedProduct.createdAt}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    {selectedProduct.tags &&
                      selectedProduct.tags.length > 0 && (
                        <div className="flex justify-between items-start gap-2 pt-1">
                          <span className="text-[#6b7280] shrink-0 text-xs">
                            Tags
                          </span>
                          <div className="flex flex-wrap gap-1 justify-end max-w-[220px]">
                            {selectedProduct.tags.map((t) => (
                              <span
                                key={t}
                                title={t}
                                className="bg-[#f9fafb] text-[#1f2937] px-1.5 py-0.5 rounded text-[10px] font-semibold border border-[#e5e7eb] truncate max-w-[100px]"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Specifications */}
                    {selectedProduct.specifications &&
                      selectedProduct.specifications.length > 0 && (
                        <div className="pt-2 border-t border-[#e5e7eb]">
                          <span className="text-[10px] font-bold text-[#6b7280] block mb-1 uppercase tracking-wider">
                            Specifications
                          </span>
                          <div className="space-y-1">
                            {selectedProduct.specifications.map((spec, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between gap-2 text-[11px] bg-[#f9fafb] px-2 py-1 rounded border border-[#e5e7eb]"
                              >
                                <span
                                  className="font-medium text-[#6b7280] truncate max-w-[120px]"
                                  title={spec.key}
                                >
                                  {spec.key}
                                </span>
                                <span
                                  className="font-bold text-[#111827] truncate max-w-[140px]"
                                  title={spec.value}
                                >
                                  {spec.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Full Description */}
                    {selectedProduct.description && (
                      <div className="pt-2 border-t border-[#e5e7eb]">
                        <span className="text-[10px] font-bold text-[#6b7280] block mb-0.5 uppercase tracking-wider">
                          Full Description
                        </span>
                        <p
                          className="text-[11px] text-[#4b5563] leading-relaxed line-clamp-3 cursor-help bg-[#f9fafb] p-2 rounded border border-[#e5e7eb]"
                          title={selectedProduct.description}
                        >
                          {selectedProduct.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 border-t border-[#e5e7eb] flex flex-col sm:flex-row lg:flex-row items-center gap-2 bg-[#ffffff] shrink-0">
                <button
                  onClick={() => handleOpenEditModal(selectedProduct)}
                  className="w-full sm:flex-1 py-2 text-center font-semibold text-[#111827] bg-[#f9fafb] border border-[#e5e7eb] rounded-xl hover:bg-[#e5e7eb]/50 transition-colors cursor-pointer"
                >
                  Edit Product
                </button>

                <button
                  onClick={() => handleDeleteProduct(selectedProduct.id)}
                  className="w-full sm:flex-1 py-2 text-center font-semibold text-red-600 bg-[#ffffff] border border-red-200 rounded-xl hover:bg-red-50 cursor-pointer"
                >
                  Delete Product
                </button>
              </div>
            </>
          ) : (
            <div className="p-6 flex flex-col items-center justify-center text-center flex-1">
              <div className="w-14 h-14 bg-[#fff7ed] text-[#f97316] rounded-2xl flex items-center justify-center mb-3">
                <Package className="w-7 h-7" />
              </div>

              <h4 className="font-bold text-[#1f2937] text-sm mb-1">
                No Product Selected
              </h4>

              <p className="text-[#6b7280] text-[11px] max-w-50">
                Click on any product row from the table to view its full
                details, images & attributes.
              </p>
            </div>
          )}
        </aside>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#ffffff] rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col border border-[#e5e7eb]">
            <div className="p-4 sm:p-5 border-b border-[#e5e7eb] flex items-start justify-between gap-3 bg-[#f9fafb] shrink-0">
              <div className="min-w-0">
                <h3 className="font-bold text-[#111827] text-base">
                  {formMode === "add"
                    ? "Add New Product"
                    : "Edit Product Details"}
                </h3>
                <p className="text-[11px] text-[#6b7280]">
                  Provide product details, pricing, inventory, specs & media in
                  one place.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-[#6b7280] hover:text-[#111827] hover:bg-[#f9fafb] cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              id="productFormModal"
              onSubmit={handleSaveProduct}
              className="p-4 sm:p-6 space-y-6 overflow-y-auto"
            >
              {/* BASIC INFO */}
              <div className="space-y-3">
                <h4 className="font-bold border-b border-[#e5e7eb] pb-1.5 uppercase tracking-wider text-[10px] text-[#f97316]">
                  Basic Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="sm:col-span-2">
                    <label className="font-bold text-[#111827] block mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g. Wireless Headphones"
                      className="w-full px-3 py-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl focus:ring-1 focus:ring-[#f97316] text-xs text-[#111827]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#111827] block mb-1">
                      SKU *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.sku || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                      }
                      placeholder="e.g. WH-1024"
                      className="w-full px-3 py-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl focus:ring-1 focus:ring-[#f97316] text-xs text-[#111827]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#111827] block mb-1">
                      Category *
                    </label>
                    <CustomSelect
                      value={formData.category || "Electronics"}
                      options={modalCategoryOptions}
                      onChange={(val) =>
                        setFormData({ ...formData, category: val })
                      }
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-[#111827] block mb-1">
                      Brand *
                    </label>
                    <CustomSelect
                      value={formData.brand || "SoundMax"}
                      options={brandOptions}
                      onChange={(val) =>
                        setFormData({ ...formData, brand: val })
                      }
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#111827] block mb-1">
                      Status *
                    </label>
                    <CustomSelect
                      value={formData.status || "published"}
                      options={modalStatusOptions}
                      onChange={(val) =>
                        setFormData({
                          ...formData,
                          status: val as Product["status"],
                        })
                      }
                      className="w-full"
                    />
                  </div>

                  <div className="flex items-center gap-3 sm:pt-5">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured || false}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            featured: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-[#e5e7eb] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-[#ffffff] after:border-[#e5e7eb] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#f97316]" />
                    </label>
                    <span className="font-bold text-[#111827] text-xs">
                      Featured Product
                    </span>
                  </div>
                </div>
              </div>

              {/* PRICING */}
              <div className="space-y-3">
                <h4 className="font-bold border-b border-[#e5e7eb] pb-1.5 uppercase tracking-wider text-[10px] text-[#f97316]">
                  Pricing & Inventory
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    ["Cost Price ($)", "price"],
                    ["Sale Price ($) *", "salePrice"],
                    ["Discount (%)", "discount"],
                    ["Stock Quantity *", "stock"],
                  ].map(([label, field]) => (
                    <div key={field}>
                      <label className="font-bold text-[#111827] block mb-1">
                        {label}
                      </label>
                      <input
                        type="number"
                        required={field === "salePrice" || field === "stock"}
                        value={Number(formData[field as keyof Product]) || 0}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [field]: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl text-xs text-[#111827]"
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-[#111827] block mb-1">
                      Low Stock Threshold
                    </label>
                    <input
                      type="number"
                      value={formData.lowStockThreshold || 5}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lowStockThreshold: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl text-xs text-[#111827]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#111827] block mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.weight || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          weight: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl text-xs text-[#111827]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#111827] block mb-1">
                      Dimensions (L x W x H)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 20 x 15 x 8 cm"
                      value={formData.dimensions || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dimensions: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl text-xs text-[#111827]"
                    />
                  </div>
                </div>
              </div>

              {/* TAGS + SPECS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-bold text-[#111827] block mb-1">
                    Product Tags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add tag and press Enter"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      className="flex-1 min-w-0 px-3 py-1.5 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl text-xs text-[#111827]"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-3 py-1.5 bg-[#f9fafb] hover:bg-[#e5e7eb] rounded-xl font-bold cursor-pointer shrink-0 text-[#111827]"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {formData.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-[#fff7ed] border border-[#fed7aa] text-[#f97316] rounded-lg text-[10px] font-bold flex items-center gap-1"
                      >
                        <TagIcon className="w-2.5 h-2.5" />
                        {tag}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-red-500"
                          onClick={() => handleRemoveTag(tag)}
                        />
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <label className="font-bold text-[#111827]">
                      Specifications / Attributes
                    </label>

                    <button
                      type="button"
                      onClick={handleAddSpecRow}
                      className="text-[#f97316] font-bold hover:underline text-[10px] flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <PlusCircle className="w-3 h-3" />
                      Add Row
                    </button>
                  </div>

                  <div className="space-y-2 max-h-28 overflow-y-auto pr-1">
                    {formData.specifications?.map((spec, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Key"
                          value={spec.key}
                          onChange={(e) =>
                            handleSpecChange(idx, "key", e.target.value)
                          }
                          className="flex-1 min-w-0 px-2.5 py-1 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg text-xs text-[#111827]"
                        />

                        <input
                          type="text"
                          placeholder="Value"
                          value={spec.value}
                          onChange={(e) =>
                            handleSpecChange(idx, "value", e.target.value)
                          }
                          className="flex-1 min-w-0 px-2.5 py-1 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg text-xs text-[#111827]"
                        />

                        <button
                          type="button"
                          onClick={() => handleRemoveSpecRow(idx)}
                          className="text-red-400 hover:text-red-600 cursor-pointer shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* MEDIA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#111827] block mb-1">
                    Short Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.shortDescription || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shortDescription: e.target.value,
                      })
                    }
                    placeholder="Short summary..."
                    className="w-full px-3 py-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl text-xs text-[#111827]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#111827] block mb-1">
                    Product Gallery / Images
                  </label>
                  <div className="border-2 border-dashed border-[#e5e7eb] rounded-xl p-3 flex flex-col items-center justify-center text-center min-h-[76px] bg-[#f9fafb] hover:bg-[#fff7ed]/50 cursor-pointer transition-colors">
                    <UploadCloud className="w-5 h-5 text-[#f97316] mb-0.5" />
                    <span className="font-semibold text-[#111827] text-[11px]">
                      Upload images
                    </span>
                    <span className="text-[9px] text-[#6b7280]">
                      PNG, JPG, WEBP
                    </span>
                  </div>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="font-bold text-[#111827] block mb-1">
                  Detailed Description
                </label>
                <div className="border border-[#e5e7eb] rounded-xl overflow-hidden">
                  <div className="flex items-center gap-3 p-1.5 bg-[#f9fafb] border-b border-[#e5e7eb] text-[#6b7280]">
                    <Bold className="w-3.5 h-3.5 cursor-pointer hover:text-[#111827]" />
                    <Italic className="w-3.5 h-3.5 cursor-pointer hover:text-[#111827]" />
                    <Underline className="w-3.5 h-3.5 cursor-pointer hover:text-[#111827]" />
                    <span className="w-px h-3 bg-[#e5e7eb]" />
                    <List className="w-3.5 h-3.5 cursor-pointer hover:text-[#111827]" />
                    <ListOrdered className="w-3.5 h-3.5 cursor-pointer hover:text-[#111827]" />
                  </div>

                  <textarea
                    rows={3}
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Enter item details and technical specifications..."
                    className="w-full p-2.5 text-xs text-[#111827] focus:outline-none resize-none bg-[#ffffff]"
                  />
                </div>
              </div>
            </form>

            {/* MODAL ACTIONS */}
            <div className="p-3 sm:p-4 border-t border-[#e5e7eb] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 bg-[#f9fafb] shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 font-bold text-[#6b7280] bg-[#ffffff] border border-[#e5e7eb] rounded-xl hover:bg-[#f9fafb] text-xs cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                form="productFormModal"
                className="px-6 py-2 font-bold text-white bg-[#f97316] rounded-xl hover:bg-[#ea580c] shadow-2xs text-xs cursor-pointer transition-colors"
              >
                {formMode === "add" ? "Create Product" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsView;
