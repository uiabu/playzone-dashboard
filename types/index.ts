export type TabType =
  | "overview"
  | "top-banners"
  | "products"
  | "orders"
  | "pre-orders"
  | "experts"
  | "deals"
  | "blog"
  | "reviews"
  | "settings";

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductExtraService {
  id: string;
  label: string;
  price: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  badge?: "NEW" | "SALE" | "HOT" | "BESTSELLER" | string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  images: string[];
  shortDescription: string;
  description: string;
  highlights: string[];
  specs: ProductSpec[];
  sizes?: string[];
  weights?: string[];
  extraServices?: ProductExtraService[];
  warranty?: string;
  deliveryDaysDhaka?: string;
  deliveryDaysNationwide?: string;
  willowGrade?: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "cod" | "bkash" | "nagad" | "card";
export type PaymentStatus = "paid" | "unpaid" | "partial";

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  selectedWeight?: string;
  selectedServices?: string[];
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  city: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type PreOrderStatus =
  | "new"
  | "reviewing"
  | "quoted"
  | "deposit_paid"
  | "sourced"
  | "in_transit"
  | "delivered"
  | "cancelled";

export interface PreOrderItem {
  id: string;
  refNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  productInfo: string;
  referenceUrl?: string;
  attachedImageUrl?: string;
  isOtpVerified: boolean;
  quotedPrice?: number;
  depositAmount?: number;
  estimatedDeliveryDate?: string;
  status: PreOrderStatus;
  adminNotes?: string;
  createdAt: string;
}

export interface Expert {
  id: string;
  name: string;
  role: string;
  imageSrc: string;
  rating: number;
  reviewsCount: number;
  location: string;
  bio: string;
  tags: string[];
  price: number;
  priceUnit: "/hour" | "/match" | "/session" | "/service" | "/event";
  category:
    | "coaching"
    | "practice"
    | "analysis"
    | "officials"
    | "ground"
    | "fitness"
    | "equipment"
    | "media";
  experienceYears: number;
  experienceLabel: string;
  verified: boolean;
  serviceModes: ("ground" | "home" | "online")[];
  fullBio: string;
  certifications: string[];
  availableDays: string[];
}

export interface ExpertBooking {
  id: string;
  expertId: string;
  expertName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string;
  timeSlot: string;
  serviceMode: "ground" | "home" | "online";
  locationDetails: string;
  notes?: string;
  totalFee: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  badgeText?: string;
  buttonText: string;
  buttonLink: string;
  imageSrc: string;
  active: boolean;
  type: "hero" | "cta" | "promo";
}

export interface CouponItem {
  id: string;
  code: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  minSpend: number;
  expiresAt: string;
  usageLimit: number;
  usedCount: number;
  active: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  imageSrc: string;
  excerpt: string;
  content?: string;
  isPublished: boolean;
}

export interface CustomerReview {
  id: string;
  author: string;
  verified: boolean;
  rating: number;
  date: string;
  productName: string;
  title: string;
  comment: string;
  location: string;
  status: "approved" | "pending" | "rejected";
}

export interface VideoTestimonial {
  id: string;
  cricketerName: string;
  role: string;
  batUsed: string;
  videoUrl: string;
  thumbnailSrc: string;
  rating: number;
  isFeatured: boolean;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  dhakaAddress: string;
  chittagongAddress: string;
  deliveryInsideDhaka: number;
  deliveryExpressDhaka: number;
  deliveryOutsideDhaka: number;
  freeShippingThreshold: number;
  announcementText: string;
  announcementActive: boolean;
  whatsappWidgetActive: boolean;
  cashOnDeliveryEnabled: boolean;
  bkashPaymentEnabled: boolean;
  currency: string;
}
