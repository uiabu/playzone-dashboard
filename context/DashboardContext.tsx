"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  TabType,
  Product,
  Order,
  OrderStatus,
  PaymentStatus,
  PreOrderItem,
  PreOrderStatus,
  Expert,
  ExpertBooking,
  BannerItem,
  CouponItem,
  BlogPost,
  CustomerReview,
  VideoTestimonial,
  StoreSettings,
} from "@/types";
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_PRE_ORDERS,
  INITIAL_EXPERTS,
  INITIAL_EXPERT_BOOKINGS,
  INITIAL_BANNERS,
  INITIAL_COUPONS,
  INITIAL_BLOG_POSTS,
  INITIAL_REVIEWS,
  INITIAL_VIDEO_TESTIMONIALS,
  INITIAL_SETTINGS,
} from "@/lib/initialData";
import { api } from "@/lib/api";

interface ToastInfo {
  id: string;
  text: string;
  type: "success" | "info" | "error";
}

export interface ConfirmModalConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
  onConfirm: () => void;
}

export type ConfirmModalState = ConfirmModalConfig & { isOpen: boolean };

interface DashboardContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  toasts: ToastInfo[];
  showToast: (text: string, type?: "success" | "info" | "error") => void;
  isBackendConnected: boolean;
  refreshData: () => Promise<void>;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductStock: (id: string) => void;
  updateProductStockCount: (id: string, count: number) => void;

  // Orders
  orders: Order[];
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  updatePaymentStatus: (id: string, status: PaymentStatus) => void;
  addOrder: (order: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt">) => void;
  deleteOrder: (id: string) => void;

  // Pre-Orders
  preOrders: PreOrderItem[];
  updatePreOrderStatus: (id: string, status: PreOrderStatus) => void;
  assignPreOrderQuote: (
    id: string,
    quote: number,
    deposit: number,
    eta: string,
    adminNotes?: string
  ) => void;
  addPreOrder: (preOrder: Omit<PreOrderItem, "id" | "refNumber" | "createdAt">) => void;
  deletePreOrder: (id: string) => void;

  // Experts
  experts: Expert[];
  addExpert: (expert: Omit<Expert, "id">) => void;
  updateExpert: (id: string, expert: Partial<Expert>) => void;
  deleteExpert: (id: string) => void;
  expertBookings: ExpertBooking[];
  updateBookingStatus: (id: string, status: ExpertBooking["status"]) => void;

  // Banners & Offers
  banners: BannerItem[];
  addBanner: (banner: Omit<BannerItem, "id">) => void;
  updateBanner: (id: string, b: Partial<BannerItem>) => void;
  deleteBanner: (id: string) => void;
  toggleBanner: (id: string) => void;
  coupons: CouponItem[];
  addCoupon: (coupon: Omit<CouponItem, "id" | "usedCount">) => void;
  toggleCoupon: (id: string) => void;
  deleteCoupon: (id: string) => void;

  // Blog
  blogPosts: BlogPost[];
  addBlogPost: (post: Omit<BlogPost, "id">) => void;
  updateBlogPost: (id: string, post: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;
  toggleBlogPublish: (id: string) => void;

  // Reviews
  reviews: CustomerReview[];
  updateReviewStatus: (id: string, status: CustomerReview["status"]) => void;
  deleteReview: (id: string) => void;
  videoTestimonials: VideoTestimonial[];
  toggleFeaturedVideo: (id: string) => void;

  // Settings
  settings: StoreSettings;
  updateSettings: (s: Partial<StoreSettings>) => void;
  resetToDefaults: () => void;

  // Confirm Modal
  confirmModal: ConfirmModalState;
  openConfirmModal: (config: ConfirmModalConfig) => void;
  closeConfirmModal: () => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [globalSearch, setGlobalSearch] = useState<string>("");
  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [preOrders, setPreOrders] = useState<PreOrderItem[]>(INITIAL_PRE_ORDERS);
  const [experts, setExperts] = useState<Expert[]>(INITIAL_EXPERTS);
  const [expertBookings, setExpertBookings] = useState<ExpertBooking[]>(INITIAL_EXPERT_BOOKINGS);
  const [banners, setBanners] = useState<BannerItem[]>(INITIAL_BANNERS);
  const [coupons, setCoupons] = useState<CouponItem[]>(INITIAL_COUPONS);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);
  const [reviews, setReviews] = useState<CustomerReview[]>(INITIAL_REVIEWS);
  const [videoTestimonials, setVideoTestimonials] = useState<VideoTestimonial[]>(INITIAL_VIDEO_TESTIMONIALS);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);

  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const openConfirmModal = (config: ConfirmModalConfig) => {
    setConfirmModal({
      ...config,
      isOpen: true,
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  const showToast = (text: string, type: "success" | "info" | "error" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  // Sync from Express Backend (http://localhost:5000/api)
  const refreshData = async () => {
    try {
      const [
        prodRes,
        ordRes,
        preRes,
        expRes,
        bookRes,
        banRes,
        coupRes,
        blogRes,
        revRes,
        vidRes,
        setRes,
      ] = await Promise.all([
        api.getProducts().catch(() => null),
        api.getOrders().catch(() => null),
        api.getPreOrders().catch(() => null),
        api.getExperts().catch(() => null),
        api.getExpertBookings().catch(() => null),
        api.getBanners().catch(() => null),
        api.getCoupons().catch(() => null),
        api.getBlogs().catch(() => null),
        api.getReviews().catch(() => null),
        api.getVideoTestimonials().catch(() => null),
        api.getSettings().catch(() => null),
      ]);

      if (prodRes?.data) setProducts(prodRes.data);
      if (ordRes?.data) setOrders(ordRes.data);
      if (preRes?.data) setPreOrders(preRes.data);
      if (expRes?.data) setExperts(expRes.data);
      if (bookRes?.data) setExpertBookings(bookRes.data);
      if (banRes?.data) setBanners(banRes.data);
      if (coupRes?.data) setCoupons(coupRes.data);
      if (blogRes?.data) setBlogPosts(blogRes.data);
      if (revRes?.data) setReviews(revRes.data);
      if (vidRes?.data) setVideoTestimonials(vidRes.data);
      if (setRes?.data) setSettings(setRes.data);

      setIsBackendConnected(true);
    } catch (err) {
      console.warn("Could not reach Express backend, using local state cache:", err);
      setIsBackendConnected(false);
    }
  };

  useEffect(() => {
    refreshData();
    const handleFocus = () => refreshData();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  // Product operations
  const addProduct = async (newProduct: Omit<Product, "id">) => {
    const tempId = "pz-" + Math.random().toString(36).substring(2, 9);
    const product: Product = { ...newProduct, id: tempId };
    setProducts((prev) => [product, ...prev]);

    try {
      const res = await api.createProduct(newProduct);
      if (res?.data) {
        setProducts((prev) =>
          prev.map((p) => (p.id === tempId ? res.data : p))
        );
      }
      showToast(`Product "${product.name}" added to database!`);
    } catch {
      showToast(`Product "${product.name}" added locally.`);
    }
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );

    try {
      await api.updateProduct(id, updatedFields);
      showToast("Product updated in backend!");
    } catch {
      showToast("Product updated locally.");
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      await api.deleteProduct(id);
      showToast("Product deleted from database.", "info");
    } catch {
      showToast("Product removed.", "info");
    }
  };

  const toggleProductStock = async (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const nextStock = !target.inStock;
    const nextCount = nextStock && target.stockCount === 0 ? 5 : target.stockCount;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, inStock: nextStock, stockCount: nextCount } : p
      )
    );

    try {
      await api.updateProductStock(id, nextCount, nextStock);
      showToast("Stock status synced to backend!");
    } catch {
      showToast("Stock status updated!");
    }
  };

  const updateProductStockCount = async (id: string, count: number) => {
    const safeCount = Math.max(0, count);
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, stockCount: safeCount, inStock: safeCount > 0 }
          : p
      )
    );

    try {
      await api.updateProductStock(id, safeCount, safeCount > 0);
    } catch {
      // Ignore background error
    }
  };

  // Order operations
  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o
      )
    );

    try {
      await api.updateOrderStatus(id, status);
      showToast(`Order status synced: ${status.toUpperCase()}!`);
    } catch {
      showToast(`Order status marked as ${status.toUpperCase()}!`);
    }
  };

  const updatePaymentStatus = async (id: string, paymentStatus: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? { ...o, paymentStatus, updatedAt: new Date().toISOString() }
          : o
      )
    );

    try {
      await api.updatePaymentStatus(id, paymentStatus);
      showToast(`Payment synced: ${paymentStatus.toUpperCase()}!`);
    } catch {
      showToast(`Payment marked as ${paymentStatus.toUpperCase()}!`);
    }
  };

  const addOrder = async (
    orderData: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt">
  ) => {
    const tempNum = Math.floor(1000 + Math.random() * 9000);
    const tempOrder: Order = {
      ...orderData,
      id: "ord-" + Math.random().toString(36).substring(2, 9),
      orderNumber: `PZ-2026-${tempNum}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setOrders((prev) => [tempOrder, ...prev]);

    try {
      const res = await api.createOrder(orderData);
      if (res?.data) {
        setOrders((prev) =>
          prev.map((o) => (o.id === tempOrder.id ? res.data : o))
        );
      }
      showToast(`Order ${tempOrder.orderNumber} created & stored in backend!`);
    } catch {
      showToast(`Order ${tempOrder.orderNumber} created.`);
    }
  };

  const deleteOrder = async (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    try {
      await api.deleteOrder(id);
    } catch {
      // Ignore
    }
    showToast("Order removed from list.", "info");
  };

  // Pre-Order operations
  const updatePreOrderStatus = async (id: string, status: PreOrderStatus) => {
    setPreOrders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );

    try {
      await api.updatePreOrderStatus(id, status);
      showToast(`Pre-order status updated to ${status.toUpperCase()}`);
    } catch {
      showToast(`Pre-order updated.`);
    }
  };

  const assignPreOrderQuote = async (
    id: string,
    quote: number,
    deposit: number,
    eta: string,
    adminNotes?: string
  ) => {
    setPreOrders((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              quotedPrice: quote,
              depositAmount: deposit,
              estimatedDeliveryDate: eta,
              status: "quoted",
              adminNotes: adminNotes || p.adminNotes,
            }
          : p
      )
    );

    try {
      await api.quotePreOrder(id, quote, deposit, eta, adminNotes);
      showToast(`Quote ৳${quote.toLocaleString()} saved in backend!`);
    } catch {
      showToast(`Quote assigned.`);
    }
  };

  const addPreOrder = async (
    preOrderData: Omit<PreOrderItem, "id" | "refNumber" | "createdAt">
  ) => {
    const tempRef = "PRE-2026-" + Math.floor(100 + Math.random() * 900);
    const item: PreOrderItem = {
      ...preOrderData,
      id: "pre-" + Math.random().toString(36).substring(2, 9),
      refNumber: tempRef,
      createdAt: new Date().toISOString(),
    };
    setPreOrders((prev) => [item, ...prev]);

    try {
      const res = await api.createPreOrder(preOrderData);
      if (res?.data) {
        setPreOrders((prev) =>
          prev.map((p) => (p.id === item.id ? res.data : p))
        );
      }
      showToast(`Pre-order ${tempRef} recorded in backend!`);
    } catch {
      showToast(`Pre-order ${tempRef} added.`);
    }
  };

  const deletePreOrder = async (id: string) => {
    setPreOrders((prev) => prev.filter((p) => p.id !== id));
    try {
      await api.deletePreOrder(id);
    } catch {
      // Ignore
    }
    showToast("Pre-order deleted.", "info");
  };

  // Expert operations
  const addExpert = async (newExpert: Omit<Expert, "id">) => {
    const tempId = "exp-" + Math.random().toString(36).substring(2, 9);
    const item: Expert = { ...newExpert, id: tempId };
    setExperts((prev) => [item, ...prev]);

    try {
      const res = await api.createExpert(newExpert);
      if (res?.data) {
        setExperts((prev) =>
          prev.map((e) => (e.id === tempId ? res.data : e))
        );
      }
      showToast(`Expert "${item.name}" registered in backend!`);
    } catch {
      showToast(`Expert "${item.name}" registered.`);
    }
  };

  const updateExpert = async (id: string, updated: Partial<Expert>) => {
    setExperts((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updated } : e))
    );

    try {
      await api.updateExpert(id, updated);
      showToast("Expert profile updated in backend!");
    } catch {
      showToast("Expert profile updated.");
    }
  };

  const deleteExpert = async (id: string) => {
    setExperts((prev) => prev.filter((e) => e.id !== id));
    try {
      await api.deleteExpert(id);
    } catch {
      // Ignore
    }
    showToast("Expert profile deleted.", "info");
  };

  const updateBookingStatus = async (
    id: string,
    status: ExpertBooking["status"]
  ) => {
    setExpertBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );

    try {
      await api.updateBookingStatus(id, status);
      showToast(`Booking marked as ${status.toUpperCase()}!`);
    } catch {
      showToast(`Booking marked as ${status.toUpperCase()}!`);
    }
  };

  // Banner & coupon operations
  const addBanner = async (bannerData: Omit<BannerItem, "id">) => {
    const tempId = "banner-" + Math.random().toString(36).substring(2, 9);
    const newBanner: BannerItem = {
      ...bannerData,
      id: tempId,
    };
    setBanners((prev) => [newBanner, ...prev]);

    try {
      const res = await api.createBanner(bannerData);
      if (res?.data) {
        setBanners((prev) =>
          prev.map((b) => (b.id === tempId ? res.data : b))
        );
      }
      showToast(`Banner "${newBanner.title}" saved in backend!`);
    } catch {
      showToast(`Banner "${newBanner.title}" created!`);
    }
  };

  const toggleBanner = async (id: string) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, active: !b.active } : b))
    );

    try {
      await api.toggleBanner(id);
      showToast("Banner visibility synced!");
    } catch {
      showToast("Banner visibility updated!");
    }
  };

  const updateBanner = async (id: string, b: Partial<BannerItem>) => {
    setBanners((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...b } : item))
    );

    try {
      await api.updateBanner(id, b);
      showToast("Banner content saved!");
    } catch {
      showToast("Banner saved.");
    }
  };

  const deleteBanner = async (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    try {
      await api.deleteBanner(id);
    } catch {
      // Ignore
    }
    showToast("Banner removed.", "info");
  };

  const addCoupon = async (couponData: Omit<CouponItem, "id" | "usedCount">) => {
    const tempId = "cp-" + Math.random().toString(36).substring(2, 9);
    const newCoupon: CouponItem = {
      ...couponData,
      id: tempId,
      usedCount: 0,
    };
    setCoupons((prev) => [newCoupon, ...prev]);

    try {
      const res = await api.createCoupon(couponData);
      if (res?.data) {
        setCoupons((prev) =>
          prev.map((c) => (c.id === tempId ? res.data : c))
        );
      }
      showToast(`Coupon ${newCoupon.code} created in backend!`);
    } catch {
      showToast(`Coupon ${newCoupon.code} created!`);
    }
  };

  const toggleCoupon = async (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );

    try {
      await api.toggleCoupon(id);
      showToast("Coupon status updated!");
    } catch {
      showToast("Coupon status updated!");
    }
  };

  const deleteCoupon = async (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    try {
      await api.deleteCoupon(id);
    } catch {
      // Ignore
    }
    showToast("Coupon deleted.", "info");
  };

  // Blog operations
  const addBlogPost = async (postData: Omit<BlogPost, "id">) => {
    const tempId = "blog-" + Math.random().toString(36).substring(2, 9);
    const post: BlogPost = { ...postData, id: tempId };
    setBlogPosts((prev) => [post, ...prev]);

    try {
      const res = await api.createBlog(postData);
      if (res?.data) {
        setBlogPosts((prev) =>
          prev.map((b) => (b.id === tempId ? res.data : b))
        );
      }
      showToast("Blog article published to backend!");
    } catch {
      showToast("Blog article created.");
    }
  };

  const updateBlogPost = async (id: string, postData: Partial<BlogPost>) => {
    setBlogPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...postData } : p))
    );

    try {
      await api.updateBlog(id, postData);
      showToast("Article updated!");
    } catch {
      showToast("Article updated.");
    }
  };

  const deleteBlogPost = async (id: string) => {
    setBlogPosts((prev) => prev.filter((p) => p.id !== id));
    try {
      await api.deleteBlog(id);
    } catch {
      // Ignore
    }
    showToast("Article deleted.", "info");
  };

  const toggleBlogPublish = async (id: string) => {
    setBlogPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isPublished: !p.isPublished } : p))
    );

    try {
      await api.toggleBlogPublish(id);
      showToast("Publish status synced!");
    } catch {
      showToast("Publish status toggled!");
    }
  };

  // Review operations
  const updateReviewStatus = async (
    id: string,
    status: CustomerReview["status"]
  ) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );

    try {
      await api.updateReviewStatus(id, status);
      showToast(`Review marked as ${status.toUpperCase()}!`);
    } catch {
      showToast(`Review status updated.`);
    }
  };

  const deleteReview = async (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    try {
      await api.deleteReview(id);
    } catch {
      // Ignore
    }
    showToast("Review deleted.", "info");
  };

  const toggleFeaturedVideo = async (id: string) => {
    setVideoTestimonials((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isFeatured: !v.isFeatured } : v))
    );

    try {
      await api.toggleVideoFeatured(id);
      showToast("Video feature status synced!");
    } catch {
      showToast("Video feature status updated!");
    }
  };

  // Settings
  const updateSettings = async (updated: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...updated }));

    try {
      await api.updateSettings(updated);
      showToast("Store settings saved in Express backend!");
    } catch {
      showToast("Settings saved locally.");
    }
  };

  const resetToDefaults = async () => {
    try {
      await api.resetDatabase();
      const [
        prodRes,
        ordRes,
        preRes,
        expRes,
        bookRes,
        banRes,
        coupRes,
        blogRes,
        revRes,
        vidRes,
        setRes,
      ] = await Promise.all([
        api.getProducts(),
        api.getOrders(),
        api.getPreOrders(),
        api.getExperts(),
        api.getExpertBookings(),
        api.getBanners(),
        api.getCoupons(),
        api.getBlogs(),
        api.getReviews(),
        api.getVideoTestimonials(),
        api.getSettings(),
      ]);

      if (prodRes?.data) setProducts(prodRes.data);
      if (ordRes?.data) setOrders(ordRes.data);
      if (preRes?.data) setPreOrders(preRes.data);
      if (expRes?.data) setExperts(expRes.data);
      if (bookRes?.data) setExpertBookings(bookRes.data);
      if (banRes?.data) setBanners(banRes.data);
      if (coupRes?.data) setCoupons(coupRes.data);
      if (blogRes?.data) setBlogPosts(blogRes.data);
      if (revRes?.data) setReviews(revRes.data);
      if (vidRes?.data) setVideoTestimonials(vidRes.data);
      if (setRes?.data) setSettings(setRes.data);

      showToast("Store database restored from seed data!", "info");
    } catch {
      setProducts(INITIAL_PRODUCTS);
      setOrders(INITIAL_ORDERS);
      setPreOrders(INITIAL_PRE_ORDERS);
      setExperts(INITIAL_EXPERTS);
      setExpertBookings(INITIAL_EXPERT_BOOKINGS);
      setBanners(INITIAL_BANNERS);
      setCoupons(INITIAL_COUPONS);
      setBlogPosts(INITIAL_BLOG_POSTS);
      setReviews(INITIAL_REVIEWS);
      setVideoTestimonials(INITIAL_VIDEO_TESTIMONIALS);
      setSettings(INITIAL_SETTINGS);
      showToast("Local state reset to defaults.", "info");
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        activeTab,
        setActiveTab,
        globalSearch,
        setGlobalSearch,
        toasts,
        showToast,
        isBackendConnected,
        refreshData,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStock,
        updateProductStockCount,
        orders,
        updateOrderStatus,
        updatePaymentStatus,
        addOrder,
        deleteOrder,
        preOrders,
        updatePreOrderStatus,
        assignPreOrderQuote,
        addPreOrder,
        deletePreOrder,
        experts,
        addExpert,
        updateExpert,
        deleteExpert,
        expertBookings,
        updateBookingStatus,
        banners,
        addBanner,
        updateBanner,
        deleteBanner,
        toggleBanner,
        coupons,
        addCoupon,
        toggleCoupon,
        deleteCoupon,
        blogPosts,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        toggleBlogPublish,
        reviews,
        updateReviewStatus,
        deleteReview,
        videoTestimonials,
        toggleFeaturedVideo,
        settings,
        updateSettings,
        resetToDefaults,
        confirmModal,
        openConfirmModal,
        closeConfirmModal,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
