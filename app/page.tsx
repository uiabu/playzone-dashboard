"use client";

import React, { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import Header from "@/components/header/Header";
import OverviewTab from "@/components/dashboard/OverviewTab";
import TopBannersTab from "@/components/dashboard/TopBannersTab";
import ProductsTab from "@/components/dashboard/ProductsTab";
import OrdersTab from "@/components/dashboard/OrdersTab";
import PreOrdersTab from "@/components/dashboard/PreOrdersTab";
import ExpertsTab from "@/components/dashboard/ExpertsTab";
import DealsBannersTab from "@/components/dashboard/DealsBannersTab";
import BlogTab from "@/components/dashboard/BlogTab";
import ReviewsTab from "@/components/dashboard/ReviewsTab";
import SettingsTab from "@/components/dashboard/SettingsTab";

import ProductModal from "@/components/modals/ProductModal";
import OrderDetailsModal from "@/components/modals/OrderDetailsModal";
import PreOrderModal from "@/components/modals/PreOrderModal";
import ExpertModal from "@/components/modals/ExpertModal";
import CouponModal from "@/components/modals/CouponModal";
import BlogModal from "@/components/modals/BlogModal";
import ManualOrderModal from "@/components/modals/ManualOrderModal";
import ConfirmModal from "@/components/modals/ConfirmModal";
import BannerModal from "@/components/modals/BannerModal";

import { useDashboard } from "@/context/DashboardContext";
import { Product, Order, PreOrderItem, Expert, BlogPost, BannerItem } from "@/types";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

export default function DashboardPage() {
  const {
    activeTab,
    toasts,
    addProduct,
    updateProduct,
    addPreOrder,
    assignPreOrderQuote,
    addExpert,
    updateExpert,
    addCoupon,
    addBlogPost,
    updateBlogPost,
    addBanner,
    updateBanner,
    confirmModal,
    closeConfirmModal,
  } = useDashboard();

  // Mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modal states
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [orderDetailsModalOpen, setOrderDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [manualOrderModalOpen, setManualOrderModalOpen] = useState(false);

  const [preOrderModalOpen, setPreOrderModalOpen] = useState(false);
  const [editingPreOrder, setEditingPreOrder] = useState<PreOrderItem | null>(null);

  const [expertModalOpen, setExpertModalOpen] = useState(false);
  const [editingExpert, setEditingExpert] = useState<Expert | null>(null);

  const [couponModalOpen, setCouponModalOpen] = useState(false);

  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);

  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);

  // Handlers
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductModalOpen(true);
  };

  const handleSaveProduct = (
    productData: Omit<Product, "id">,
    editId?: string
  ) => {
    if (editId) {
      updateProduct(editId, productData);
    } else {
      addProduct(productData);
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setOrderDetailsModalOpen(true);
  };

  const handleOpenAddPreOrder = () => {
    setEditingPreOrder(null);
    setPreOrderModalOpen(true);
  };

  const handleEditPreOrder = (item: PreOrderItem) => {
    setEditingPreOrder(item);
    setPreOrderModalOpen(true);
  };

  const handleSavePreOrder = (
    data: Omit<PreOrderItem, "id" | "refNumber" | "createdAt">,
    editId?: string
  ) => {
    if (editId && data.quotedPrice) {
      assignPreOrderQuote(
        editId,
        data.quotedPrice,
        data.depositAmount || 0,
        data.estimatedDeliveryDate || "",
        data.adminNotes
      );
    } else if (editId) {
      // General update if any
    } else {
      addPreOrder(data);
    }
  };

  const handleOpenAddExpert = () => {
    setEditingExpert(null);
    setExpertModalOpen(true);
  };

  const handleEditExpert = (expert: Expert) => {
    setEditingExpert(expert);
    setExpertModalOpen(true);
  };

  const handleSaveExpert = (
    expertData: Omit<Expert, "id">,
    editId?: string
  ) => {
    if (editId) {
      updateExpert(editId, expertData);
    } else {
      addExpert(expertData);
    }
  };

  const handleOpenAddBlog = () => {
    setEditingBlogPost(null);
    setBlogModalOpen(true);
  };

  const handleOpenAddBanner = () => {
    setEditingBanner(null);
    setBannerModalOpen(true);
  };

  const handleEditBanner = (banner: BannerItem) => {
    setEditingBanner(banner);
    setBannerModalOpen(true);
  };

  const handleSaveBanner = (
    bannerData: Omit<BannerItem, "id">,
    editId?: string
  ) => {
    if (editId) {
      updateBanner(editId, bannerData);
    } else {
      addBanner(bannerData);
    }
  };

  const handleEditBlog = (post: BlogPost) => {
    setEditingBlogPost(post);
    setBlogModalOpen(true);
  };

  const handleSaveBlog = (
    postData: Omit<BlogPost, "id">,
    editId?: string
  ) => {
    if (editId) {
      updateBlogPost(editId, postData);
    } else {
      addBlogPost(postData);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col lg:flex-row font-sans">
      {/* 1. Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 2. Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen min-w-0">
        {/* Top Header */}
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onOpenAddProduct={handleOpenAddProduct}
          onOpenAddPreOrder={handleOpenAddPreOrder}
          onOpenAddCoupon={() => setCouponModalOpen(true)}
          onOpenAddBanner={handleOpenAddBanner}
        />

        {/* Tab View Container */}
        <main className="flex-1 p-4 sm:p-8 max-w-[1500px] w-full mx-auto">
          {activeTab === "overview" && (
            <OverviewTab
              onViewOrder={handleViewOrder}
              onOpenAddProduct={handleOpenAddProduct}
              onOpenAddPreOrder={handleOpenAddPreOrder}
            />
          )}

          {activeTab === "top-banners" && (
            <TopBannersTab
              onOpenAddBanner={handleOpenAddBanner}
              onEditBanner={handleEditBanner}
            />
          )}

          {activeTab === "products" && (
            <ProductsTab
              onOpenAddProduct={handleOpenAddProduct}
              onEditProduct={handleEditProduct}
            />
          )}

          {activeTab === "orders" && (
            <OrdersTab
              onViewOrder={handleViewOrder}
              onOpenAddOrder={() => setManualOrderModalOpen(true)}
            />
          )}

          {activeTab === "pre-orders" && (
            <PreOrdersTab
              onOpenAddPreOrder={handleOpenAddPreOrder}
              onEditPreOrder={handleEditPreOrder}
            />
          )}

          {activeTab === "experts" && (
            <ExpertsTab
              onOpenAddExpert={handleOpenAddExpert}
              onEditExpert={handleEditExpert}
            />
          )}

          {activeTab === "deals" && (
            <DealsBannersTab
              onOpenAddCoupon={() => setCouponModalOpen(true)}
              onOpenAddBanner={handleOpenAddBanner}
              onEditBanner={handleEditBanner}
            />
          )}

          {activeTab === "blog" && (
            <BlogTab
              onOpenAddBlog={handleOpenAddBlog}
              onEditBlog={handleEditBlog}
            />
          )}

          {activeTab === "reviews" && <ReviewsTab />}

          {activeTab === "settings" && <SettingsTab />}
        </main>
      </div>

      {/* 3. Global Modals */}
      <ProductModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        onSave={handleSaveProduct}
        initialProduct={editingProduct}
      />

      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setOrderDetailsModalOpen(false)}
      />

      <ManualOrderModal
        isOpen={manualOrderModalOpen}
        onClose={() => setManualOrderModalOpen(false)}
      />

      <PreOrderModal
        isOpen={preOrderModalOpen}
        onClose={() => setPreOrderModalOpen(false)}
        onSave={handleSavePreOrder}
        initialItem={editingPreOrder}
      />

      <ExpertModal
        isOpen={expertModalOpen}
        onClose={() => setExpertModalOpen(false)}
        onSave={handleSaveExpert}
        initialExpert={editingExpert}
      />

      <CouponModal
        isOpen={couponModalOpen}
        onClose={() => setCouponModalOpen(false)}
        onSave={addCoupon}
      />

      <BlogModal
        isOpen={blogModalOpen}
        onClose={() => setBlogModalOpen(false)}
        onSave={handleSaveBlog}
        initialPost={editingBlogPost}
      />

      <BannerModal
        isOpen={bannerModalOpen}
        onClose={() => setBannerModalOpen(false)}
        onSave={handleSaveBanner}
        initialBanner={editingBanner}
      />

      <ConfirmModal
        {...confirmModal}
        onClose={closeConfirmModal}
      />

      {/* 4. Global Toast Notifications */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-3.5 rounded-2xl shadow-2xl border text-xs font-bold flex items-center gap-2.5 pointer-events-auto animate-fadeIn backdrop-blur-md ${
              toast.type === "success"
                ? "bg-[#14141a]/95 text-white border-[#84cc16]/40"
                : toast.type === "error"
                ? "bg-red-950/90 text-red-200 border-red-500/40"
                : "bg-zinc-900/90 text-zinc-200 border-zinc-700"
            }`}
          >
            {toast.type === "success" && (
              <CheckCircle2 className="w-4 h-4 text-[#84cc16] flex-shrink-0" />
            )}
            {toast.type === "error" && (
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            )}
            {toast.type === "info" && (
              <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
            )}
            <span className="flex-1">{toast.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
