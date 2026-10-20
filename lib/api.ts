const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || `API error ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err: unknown) {
    console.warn(`[API] ${endpoint} request failed:`, err);
    throw err;
  }
}

export const api = {
  // Health
  checkHealth: () => request<{ status: string }>("/health"),

  // Products
  getProducts: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<{ success: boolean; data: any[] }>(`/products${qs}`);
  },
  getProduct: (idOrSlug: string) =>
    request<{ success: boolean; data: any }>(`/products/${idOrSlug}`),
  createProduct: (product: any) =>
    request<{ success: boolean; data: any }>("/products", {
      method: "POST",
      body: JSON.stringify(product),
    }),
  updateProduct: (id: string, updates: any) =>
    request<{ success: boolean; data: any }>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),
  updateProductStock: (id: string, stockCount: number, inStock?: boolean) =>
    request<{ success: boolean; data: any }>(`/products/${id}/stock`, {
      method: "PATCH",
      body: JSON.stringify({ stockCount, inStock }),
    }),
  deleteProduct: (id: string) =>
    request<{ success: boolean; message: string }>(`/products/${id}`, {
      method: "DELETE",
    }),

  // Orders
  getOrders: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<{ success: boolean; data: any[] }>(`/orders${qs}`);
  },
  createOrder: (order: any) =>
    request<{ success: boolean; data: any }>("/orders", {
      method: "POST",
      body: JSON.stringify(order),
    }),
  updateOrderStatus: (id: string, status: string) =>
    request<{ success: boolean; data: any }>(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  updatePaymentStatus: (id: string, paymentStatus: string) =>
    request<{ success: boolean; data: any }>(`/orders/${id}/payment`, {
      method: "PATCH",
      body: JSON.stringify({ paymentStatus }),
    }),
  deleteOrder: (id: string) =>
    request<{ success: boolean; message: string }>(`/orders/${id}`, {
      method: "DELETE",
    }),

  // Pre-Orders
  getPreOrders: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<{ success: boolean; data: any[] }>(`/pre-orders${qs}`);
  },
  createPreOrder: (preOrder: any) =>
    request<{ success: boolean; data: any }>("/pre-orders", {
      method: "POST",
      body: JSON.stringify(preOrder),
    }),
  quotePreOrder: (
    id: string,
    quotedPrice: number,
    depositAmount: number,
    estimatedDeliveryDate?: string,
    adminNotes?: string
  ) =>
    request<{ success: boolean; data: any }>(`/pre-orders/${id}/quote`, {
      method: "PATCH",
      body: JSON.stringify({
        quotedPrice,
        depositAmount,
        estimatedDeliveryDate,
        adminNotes,
      }),
    }),
  updatePreOrderStatus: (id: string, status: string, adminNotes?: string) =>
    request<{ success: boolean; data: any }>(`/pre-orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, adminNotes }),
    }),
  deletePreOrder: (id: string) =>
    request<{ success: boolean; message: string }>(`/pre-orders/${id}`, {
      method: "DELETE",
    }),

  // Experts
  getExperts: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<{ success: boolean; data: any[] }>(`/experts${qs}`);
  },
  createExpert: (expert: any) =>
    request<{ success: boolean; data: any }>("/experts", {
      method: "POST",
      body: JSON.stringify(expert),
    }),
  updateExpert: (id: string, updates: any) =>
    request<{ success: boolean; data: any }>(`/experts/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),
  deleteExpert: (id: string) =>
    request<{ success: boolean; message: string }>(`/experts/${id}`, {
      method: "DELETE",
    }),

  // Expert Bookings
  getExpertBookings: () =>
    request<{ success: boolean; data: any[] }>("/expert-bookings"),
  updateBookingStatus: (id: string, status: string) =>
    request<{ success: boolean; data: any }>(`/expert-bookings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  // Banners
  getBanners: () => request<{ success: boolean; data: any[] }>("/banners"),
  createBanner: (banner: any) =>
    request<{ success: boolean; data: any }>("/banners", {
      method: "POST",
      body: JSON.stringify(banner),
    }),
  toggleBanner: (id: string) =>
    request<{ success: boolean; data: any }>(`/banners/${id}/toggle`, {
      method: "PATCH",
    }),
  updateBanner: (id: string, updates: any) =>
    request<{ success: boolean; data: any }>(`/banners/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),
  deleteBanner: (id: string) =>
    request<{ success: boolean; message: string }>(`/banners/${id}`, {
      method: "DELETE",
    }),

  // Coupons
  getCoupons: () => request<{ success: boolean; data: any[] }>("/coupons"),
  createCoupon: (coupon: any) =>
    request<{ success: boolean; data: any }>("/coupons", {
      method: "POST",
      body: JSON.stringify(coupon),
    }),
  validateCoupon: (code: string, subtotal: number) =>
    request<{ success: boolean; message: string; data?: any }>(
      "/coupons/validate",
      {
        method: "POST",
        body: JSON.stringify({ code, subtotal }),
      }
    ),
  toggleCoupon: (id: string) =>
    request<{ success: boolean; data: any }>(`/coupons/${id}/toggle`, {
      method: "PATCH",
    }),
  deleteCoupon: (id: string) =>
    request<{ success: boolean; message: string }>(`/coupons/${id}`, {
      method: "DELETE",
    }),

  // Blogs
  getBlogs: (publishedOnly?: boolean) => {
    const qs = publishedOnly ? "?publishedOnly=true" : "";
    return request<{ success: boolean; data: any[] }>(`/blogs${qs}`);
  },
  createBlog: (post: any) =>
    request<{ success: boolean; data: any }>("/blogs", {
      method: "POST",
      body: JSON.stringify(post),
    }),
  updateBlog: (id: string, updates: any) =>
    request<{ success: boolean; data: any }>(`/blogs/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),
  toggleBlogPublish: (id: string) =>
    request<{ success: boolean; data: any }>(`/blogs/${id}/publish`, {
      method: "PATCH",
    }),
  deleteBlog: (id: string) =>
    request<{ success: boolean; message: string }>(`/blogs/${id}`, {
      method: "DELETE",
    }),

  // Reviews
  getReviews: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<{ success: boolean; data: any[] }>(`/reviews${qs}`);
  },
  updateReviewStatus: (id: string, status: string) =>
    request<{ success: boolean; data: any }>(`/reviews/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  deleteReview: (id: string) =>
    request<{ success: boolean; message: string }>(`/reviews/${id}`, {
      method: "DELETE",
    }),

  // Video Testimonials
  getVideoTestimonials: (featuredOnly?: boolean) => {
    const qs = featuredOnly ? "?featuredOnly=true" : "";
    return request<{ success: boolean; data: any[] }>(
      `/video-testimonials${qs}`
    );
  },
  toggleVideoFeatured: (id: string) =>
    request<{ success: boolean; data: any }>(
      `/video-testimonials/${id}/toggle`,
      { method: "PATCH" }
    ),

  // Settings
  getSettings: () => request<{ success: boolean; data: any }>("/settings"),
  updateSettings: (settings: any) =>
    request<{ success: boolean; data: any }>("/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    }),
  resetDatabase: () =>
    request<{ success: boolean; message: string }>("/settings/reset", {
      method: "POST",
    }),
};
