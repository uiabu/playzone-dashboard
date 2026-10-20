"use client";

import React, { useState, useEffect } from "react";
import { X, Package, Check, Sparkles } from "lucide-react";
import { Product } from "@/types";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Omit<Product, "id">, editId?: string) => void;
  initialProduct?: Product | null;
}

const DEFAULT_IMAGES = [
  { label: "SG Savage Bat", path: "/images/products/bats/sg_bat.png" },
  { label: "SS Ton Reserve Bat", path: "/images/products/bats/ss_ton.png" },
  { label: "Kookaburra Kahuna Bat", path: "/images/products/bats/kookaburra_kahuna.png" },
  { label: "MRF Grand Edition Bat", path: "/images/products/bats/mrf_grand.png" },
  { label: "Shrey Titanium Helmet", path: "/images/products/batting/shrey_helmet.png" },
  { label: "SG Test Gloves", path: "/images/products/batting/sg_gloves.png" },
  { label: "DSC Legguards / Pads", path: "/images/products/batting/dsc_pads.png" },
  { label: "Adidas Vector Spikes", path: "/images/products/shoes_bags/adidas_spikes.png" },
  { label: "Gunn & Moore Tour Bag", path: "/images/products/shoes_bags/gm_bag.png" },
  { label: "Kookaburra Match Balls", path: "/images/products/bowling/kookaburra_ball.png" },
  { label: "Sidearm Speed Thrower", path: "/images/experts/sidearm_thrower.png" },
];

export default function ProductModal({
  isOpen,
  onClose,
  onSave,
  initialProduct,
}: ProductModalProps) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("SG Cricket");
  const [category, setCategory] = useState("Cricket Bats");
  const [willowGrade, setWillowGrade] = useState("Grade 2 English Willow");
  const [price, setPrice] = useState(8500);
  const [originalPrice, setOriginalPrice] = useState(10500);
  const [stockCount, setStockCount] = useState(10);
  const [inStock, setInStock] = useState(true);
  const [badge, setBadge] = useState<string>("NEW");
  const [imageSrc, setImageSrc] = useState(DEFAULT_IMAGES[0].path);
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [includeKnocking, setIncludeKnocking] = useState(true);

  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name);
      setBrand(initialProduct.brand);
      setCategory(initialProduct.category);
      setWillowGrade(initialProduct.willowGrade || "Grade 2 English Willow");
      setPrice(initialProduct.price);
      setOriginalPrice(initialProduct.originalPrice || initialProduct.price);
      setStockCount(initialProduct.stockCount);
      setInStock(initialProduct.inStock);
      setBadge(initialProduct.badge || "NEW");
      setImageSrc(initialProduct.images?.[0] || DEFAULT_IMAGES[0].path);
      setShortDescription(initialProduct.shortDescription || "");
      setDescription(initialProduct.description || "");
      setIncludeKnocking(Boolean(initialProduct.extraServices?.length));
    } else {
      setName("");
      setBrand("SG Cricket");
      setCategory("Cricket Bats");
      setWillowGrade("Grade 2 English Willow");
      setPrice(8500);
      setOriginalPrice(10500);
      setStockCount(10);
      setInStock(true);
      setBadge("NEW");
      setImageSrc(DEFAULT_IMAGES[0].path);
      setShortDescription("");
      setDescription("");
      setIncludeKnocking(true);
    }
  }, [initialProduct, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const discountPercent =
      originalPrice > price
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : undefined;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const productPayload: Omit<Product, "id"> = {
      slug,
      name,
      brand,
      category,
      categorySlug: category.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      discountPercent,
      stockCount: Number(stockCount),
      inStock: Boolean(inStock && stockCount > 0),
      badge: badge === "NONE" ? undefined : badge,
      rating: initialProduct ? initialProduct.rating : 4.8,
      reviewsCount: initialProduct ? initialProduct.reviewsCount : 1,
      images: [imageSrc],
      shortDescription:
        shortDescription ||
        `Premium ${brand} ${category} engineered for Bangladesh pitch conditions.`,
      description:
        description ||
        `Handpicked professional grade equipment. Tested for maximum performance and balance.`,
      highlights: [
        "100% Genuine Brand Certified Equipment",
        "Direct from Authorized Distributor",
        "Tested under Dhaka & Bangladesh pitch standards",
      ],
      specs: [
        { label: "Brand", value: brand },
        { label: "Category", value: category },
        ...(willowGrade ? [{ label: "Willow", value: willowGrade }] : []),
      ],
      extraServices: includeKnocking
        ? [
            {
              id: "knocking",
              label: "Machine Knocking (15k strikes)",
              price: 600,
            },
          ]
        : [],
      willowGrade: category.includes("Bats") ? willowGrade : undefined,
      warranty: "1 Year Official Warranty",
      deliveryDaysDhaka: "24 Hours Express",
      deliveryDaysNationwide: "2 - 3 Days",
    };

    onSave(productPayload, initialProduct?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#121217] border border-[#202028] rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#84cc16]/10 text-[#84cc16] flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">
                {initialProduct ? "Edit Product" : "Add New Cricket Equipment"}
              </h2>
              <p className="text-xs text-zinc-400">
                Update prices, willow grade, discount, and stock count
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Product Name */}
          <div>
            <label className="text-xs font-bold text-zinc-400 block mb-1">
              Product Title *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., SG Savage Edition English Willow Bat"
              className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2.5 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
            />
          </div>

          {/* Brand & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Brand
              </label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2.5 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              >
                <option value="SG Cricket">SG Cricket</option>
                <option value="SS Sunridges">SS Sunridges</option>
                <option value="Kookaburra">Kookaburra</option>
                <option value="MRF">MRF</option>
                <option value="Gray-Nicolls">Gray-Nicolls</option>
                <option value="DSC">DSC</option>
                <option value="Adidas">Adidas</option>
                <option value="Shrey">Shrey</option>
                <option value="Gunn & Moore">Gunn & Moore</option>
                <option value="CA Sports">CA Sports</option>
                <option value="Sidearm UK">Sidearm UK</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2.5 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              >
                <option value="Cricket Bats">Cricket Bats</option>
                <option value="Batting Protection">Batting Protection</option>
                <option value="Bowling & Fielding">Bowling & Fielding</option>
                <option value="Shoes & Kit Bags">Shoes & Kit Bags</option>
                <option value="Pre-Owned Gear">Pre-Owned Gear</option>
              </select>
            </div>
          </div>

          {/* Willow Grade (if Bat) */}
          {category === "Cricket Bats" && (
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Willow Grade
              </label>
              <select
                value={willowGrade}
                onChange={(e) => setWillowGrade(e.target.value)}
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2.5 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              >
                <option value="Grade 1+ English Willow">Grade 1+ English Willow</option>
                <option value="Grade 1 English Willow">Grade 1 English Willow</option>
                <option value="Grade 2 English Willow">Grade 2 English Willow</option>
                <option value="Grade 3 English Willow">Grade 3 English Willow</option>
                <option value="Kashmir Willow">Kashmir Willow</option>
                <option value="Tape Ball Willow">Tape Ball Willow</option>
              </select>
            </div>
          )}

          {/* Pricing & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Selling Price (৳) *
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2.5 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Regular / Orig. Price (৳)
              </label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2.5 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                value={stockCount}
                onChange={(e) => setStockCount(Number(e.target.value))}
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2.5 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              />
            </div>
          </div>

          {/* Image Selector */}
          <div>
            <label className="text-xs font-bold text-zinc-400 block mb-1">
              Product Image Asset
            </label>
            <select
              value={imageSrc}
              onChange={(e) => setImageSrc(e.target.value)}
              className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2.5 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
            >
              {DEFAULT_IMAGES.map((img) => (
                <option key={img.path} value={img.path}>
                  {img.label} ({img.path})
                </option>
              ))}
            </select>
          </div>

          {/* Badge & Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Promotional Badge
              </label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2.5 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              >
                <option value="NONE">No Badge</option>
                <option value="NEW">NEW</option>
                <option value="HOT">HOT</option>
                <option value="SALE">SALE</option>
                <option value="BESTSELLER">BESTSELLER</option>
                <option value="CERTIFIED">CERTIFIED</option>
              </select>
            </div>

            <div className="flex items-center gap-6 pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="w-4 h-4 accent-[#84cc16] rounded"
                />
                <span className="text-xs font-bold text-zinc-200">In Stock</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeKnocking}
                  onChange={(e) => setIncludeKnocking(e.target.checked)}
                  className="w-4 h-4 accent-[#84cc16] rounded"
                />
                <span className="text-xs font-bold text-zinc-200">
                  Offer Knocking Add-on
                </span>
              </label>
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="text-xs font-bold text-zinc-400 block mb-1">
              Short Summary Description
            </label>
            <textarea
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Highlights for quick product card display..."
              className="w-full bg-[#181820] text-sm text-white rounded-xl p-3 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#84cc16] hover:bg-[#a3e635] text-black text-xs font-bold shadow-md shadow-[#84cc16]/15 transition-all"
            >
              {initialProduct ? "Update Product" : "Save Product to Catalog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
