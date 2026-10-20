"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { Product } from "@/types";

interface ProductsTabProps {
  onOpenAddProduct: () => void;
  onEditProduct: (product: Product) => void;
}

export default function ProductsTab({
  onOpenAddProduct,
  onEditProduct,
}: ProductsTabProps) {
  const {
    products,
    deleteProduct,
    toggleProductStock,
    updateProductStockCount,
    globalSearch,
    openConfirmModal,
  } = useDashboard();

  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [localSearch, setLocalSearch] = useState<string>("");

  // Categories list
  const categories = [
    { id: "all", label: "All Categories" },
    { id: "Cricket Bats", label: "Cricket Bats" },
    { id: "Batting Protection", label: "Batting Protection" },
    { id: "Bowling & Fielding", label: "Bowling & Fielding" },
    { id: "Shoes & Kit Bags", label: "Shoes & Kit Bags" },
    { id: "Pre-Owned Gear", label: "Pre-Owned Gear" },
  ];

  // Brands list
  const brands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand));
    return ["all", ...Array.from(set)];
  }, [products]);

  // Filtering
  const filteredProducts = useMemo(() => {
    const q = (globalSearch || localSearch).toLowerCase().trim();
    return products.filter((p) => {
      // Search
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.willowGrade && p.willowGrade.toLowerCase().includes(q));

      // Category
      const matchesCat =
        categoryFilter === "all" || p.category === categoryFilter;

      // Brand
      const matchesBrand =
        brandFilter === "all" || p.brand === brandFilter;

      // Stock
      let matchesStock = true;
      if (stockFilter === "in_stock") matchesStock = p.inStock && p.stockCount > 0;
      if (stockFilter === "low_stock") matchesStock = p.stockCount > 0 && p.stockCount <= 5;
      if (stockFilter === "out_of_stock") matchesStock = !p.inStock || p.stockCount === 0;

      return matchesSearch && matchesCat && matchesBrand && matchesStock;
    });
  }, [products, globalSearch, localSearch, categoryFilter, brandFilter, stockFilter]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <span>Inventory & Products</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#84cc16]/10 text-[#84cc16] border border-[#84cc16]/20 font-bold">
              {products.length} Items Total
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Control pricing, stock count, knocking services, and catalog visibility.
          </p>
        </div>

        <button
          onClick={onOpenAddProduct}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#84cc16] hover:bg-[#a3e635] text-black font-bold text-sm shadow-lg shadow-[#84cc16]/15 transition-all"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* 2. Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#121217] border border-[#202028] flex flex-wrap items-center gap-3">
        {/* Local Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search bat name, brand, grade..."
            className="w-full bg-[#181820] text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 rounded-xl pl-9 pr-3 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
          />
        </div>

        {/* Category Selector */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-[#181820] text-xs text-zinc-300 rounded-xl px-3 py-2.5 border border-zinc-800 focus:outline-none focus:border-[#84cc16]"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>

        {/* Brand Selector */}
        <select
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          className="bg-[#181820] text-xs text-zinc-300 rounded-xl px-3 py-2.5 border border-zinc-800 focus:outline-none focus:border-[#84cc16]"
        >
          <option value="all">All Brands</option>
          {brands
            .filter((b) => b !== "all")
            .map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
        </select>

        {/* Stock Filter */}
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="bg-[#181820] text-xs text-zinc-300 rounded-xl px-3 py-2.5 border border-zinc-800 focus:outline-none focus:border-[#84cc16]"
        >
          <option value="all">All Stock Levels</option>
          <option value="in_stock">In Stock</option>
          <option value="low_stock">Low Stock (≤ 5)</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
      </div>

      {/* 3. Products Table */}
      <div className="rounded-2xl bg-[#121217] border border-[#202028] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-zinc-400 text-xs uppercase bg-[#181820]/60 border-b border-zinc-800">
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price (৳)</th>
                <th className="py-3.5 px-4">Discount</th>
                <th className="py-3.5 px-4">Stock Count</th>
                <th className="py-3.5 px-4">In Stock</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredProducts.map((product) => {
                const isLow = product.stockCount > 0 && product.stockCount <= 5;
                const isOut = !product.inStock || product.stockCount === 0;

                return (
                  <tr
                    key={product.id}
                    className="hover:bg-zinc-900/50 transition-colors group"
                  >
                    {/* Product Name & Image */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {product.images && product.images[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-contain p-1"
                            />
                          ) : (
                            <Package className="w-5 h-5 text-zinc-600" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-zinc-100 group-hover:text-[#84cc16] transition-colors line-clamp-1">
                              {product.name}
                            </span>
                            {product.badge && (
                              <span className="text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider bg-zinc-800 text-amber-400 border border-amber-400/20">
                                {product.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-zinc-500 mt-0.5">
                            {product.brand} {product.willowGrade && `• ${product.willowGrade}`}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300">
                        {product.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">
                        ৳ {product.price.toLocaleString()}
                      </div>
                      {product.originalPrice && (
                        <div className="text-xs text-zinc-500 line-through">
                          ৳ {product.originalPrice.toLocaleString()}
                        </div>
                      )}
                    </td>

                    {/* Discount */}
                    <td className="py-3.5 px-4">
                      {product.discountPercent ? (
                        <span className="text-xs font-bold text-[#84cc16] bg-[#84cc16]/10 px-2 py-0.5 rounded">
                          -{product.discountPercent}%
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-600">—</span>
                      )}
                    </td>

                    {/* Stock Adjuster */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateProductStockCount(
                              product.id,
                              product.stockCount - 1
                            )
                          }
                          className="w-6 h-6 rounded bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 flex items-center justify-center text-xs font-bold"
                        >
                          -
                        </button>
                        <span
                          className={`text-xs font-bold min-w-[28px] text-center ${
                            isOut
                              ? "text-red-400"
                              : isLow
                              ? "text-amber-400"
                              : "text-zinc-200"
                          }`}
                        >
                          {product.stockCount}
                        </span>
                        <button
                          onClick={() =>
                            updateProductStockCount(
                              product.id,
                              product.stockCount + 1
                            )
                          }
                          className="w-6 h-6 rounded bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 flex items-center justify-center text-xs font-bold"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* In Stock Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleProductStock(product.id)}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors ${
                          product.inStock && product.stockCount > 0
                            ? "bg-[#84cc16]/10 text-[#84cc16] border border-[#84cc16]/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}
                      >
                        {product.inStock && product.stockCount > 0 ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>In Stock</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Out of Stock</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEditProduct(product)}
                          className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-[#84cc16] hover:text-black transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            openConfirmModal({
                              title: "Delete Product?",
                              message: `Are you sure you want to delete "${product.name}"? This action will remove it from the store catalog.`,
                              confirmText: "Delete Product",
                              type: "danger",
                              onConfirm: () => deleteProduct(product.id),
                            });
                          }}
                          className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-red-500/20 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500 text-sm">
                    No products found matching your search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
