"use client";

import React, { useState } from "react";
import { X, ShoppingBag, Plus, Trash2 } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { OrderItem, PaymentMethod, PaymentStatus } from "@/types";

interface ManualOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ManualOrderModal({
  isOpen,
  onClose,
}: ManualOrderModalProps) {
  const { products, addOrder, settings } = useDashboard();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [city, setCity] = useState("Dhaka");
  const [selectedProductId, setSelectedProductId] = useState(
    products[0]?.id || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [deliveryFee, setDeliveryFee] = useState(settings.deliveryInsideDhaka);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("unpaid");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !selectedProduct) return;

    const item: OrderItem = {
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      productImage: selectedProduct.images[0] || "",
      price: selectedProduct.price,
      quantity: Number(quantity),
    };

    const subtotal = item.price * item.quantity;
    const totalAmount = Math.max(0, subtotal + Number(deliveryFee) - Number(discount));

    addOrder({
      customerName,
      customerPhone,
      customerEmail: customerEmail || undefined,
      shippingAddress,
      city,
      items: [item],
      subtotal,
      deliveryFee: Number(deliveryFee),
      discount: Number(discount),
      totalAmount,
      paymentMethod,
      paymentStatus,
      status: "confirmed",
      notes: notes || "Manual phone/walk-in order recorded by admin.",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#121217] border border-[#202028] rounded-3xl shadow-2xl overflow-hidden my-8">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#84cc16]/10 text-[#84cc16] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Create Manual Order</h2>
              <p className="text-xs text-zinc-400">
                For hotline phone orders, store walk-ins, and WhatsApp sales
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Player name"
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Mobile Number *
              </label>
              <input
                type="text"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="017xxxxxxxx"
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Delivery Address
              </label>
              <input
                type="text"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="House, Road, Area..."
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                City / Division
              </label>
              <select
                value={city}
                onChange={(e) => {
                  const c = e.target.value;
                  setCity(c);
                  setDeliveryFee(
                    c === "Dhaka"
                      ? settings.deliveryInsideDhaka
                      : settings.deliveryOutsideDhaka
                  );
                }}
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-3 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              >
                <option value="Dhaka">Dhaka</option>
                <option value="Chittagong">Chittagong</option>
                <option value="Sylhet">Sylhet</option>
                <option value="Rajshahi">Rajshahi</option>
                <option value="Khulna">Khulna</option>
                <option value="Bogura">Bogura</option>
              </select>
            </div>
          </div>

          {/* Select Product */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Select Gear Item
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-zinc-400 block mb-1">
                  Product
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-[#181820] text-sm text-white rounded-xl px-3 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none truncate"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ৳{p.price.toLocaleString()} ({p.stockCount} in stock)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-[#181820] text-sm text-white rounded-xl px-3 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment & Totals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(e.target.value as PaymentMethod)
                }
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              >
                <option value="cod">Cash on Delivery (COD)</option>
                <option value="bkash">bKash</option>
                <option value="nagad">Nagad</option>
                <option value="card">Card / POS</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) =>
                  setPaymentStatus(e.target.value as PaymentStatus)
                }
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-4 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              >
                <option value="unpaid">Unpaid (Pay on Delivery)</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Delivery Fee (৳)
              </label>
              <input
                type="number"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(Number(e.target.value))}
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-3 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Discount (৳)
              </label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-full bg-[#181820] text-sm text-white rounded-xl px-3 py-2 border border-zinc-800 focus:border-[#84cc16] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-[#84cc16] hover:bg-[#a3e635] text-black text-xs font-bold shadow-md shadow-[#84cc16]/15 transition-all"
            >
              Place & Confirm Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
