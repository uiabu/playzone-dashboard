# PLAYZONE Operations & Admin Dashboard

Official Operations & Admin Control Center for **PLAYZONE Cricket Equipment Store Bangladesh**. Built with **Next.js 16 (App Router)**, **TypeScript**, and **Tailwind CSS**.

---

## 🏏 Brand Identity & Aesthetics

- **Primary Brand Accent**: Electric Sports Lime Green (`#84cc16` / `#a3e635`)
- **Secondary Accent**: Tournament Gold (`#facc15` / `#eab308`)
- **Theme**: Pitch Dark (`#09090b`), Obsidian slate panels (`#121217`), subtle neon glow accents, and responsive modern glassmorphism.
- **Brand Assets**: Official transparent Playzone logos (`playzone-logo-transparent-white.png`) integrated in the sidebar header and printable invoices.

---

## 🚀 Key Modules & Feature Controls

### 1. 📊 Dashboard Overview (`OverviewTab.tsx`)
- **Live KPIs**: Total Sales Volume (৳ BDT), Active Orders, Custom Overseas Pre-Orders, and Expert Coaching Sessions.
- **Match-day Revenue Chart**: Weekly sales performance visualization in BDT.
- **Stock Warnings**: Low-stock watchlist for bats and protective gear with ≤ 5 units left.
- **Recent Orders Table**: Real-time order queue with 1-click order confirmation and printable invoice preview.

### 2. 🏏 Products & Inventory Control (`ProductsTab.tsx`)
- **Full Catalog**: Preloaded with bats (SG Savage, SS TON Reserve, Kookaburra Kahuna, MRF Grand Edition), Shrey Titanium helmets, SG Test gloves, DSC pads, Adidas Vector spikes, and certified pre-owned bats.
- **Filters**: By category, brand, and stock status (In Stock, Low Stock, Out of Stock).
- **Inline Controls**: Quick `+` / `-` stock counter buttons and instant In-Stock / Out-of-Stock toggle switch.
- **Product Modal (`ProductModal.tsx`)**: Add or edit products with willow grade, selling price, original price, discount %, promo badges (`HOT`, `NEW`, `SALE`, `BESTSELLER`), image asset selector, and knocking-in service add-on.

### 3. 📦 Orders Management (`OrdersTab.tsx`)
- **Order Pipeline**: `Pending` → `Confirmed` → `Processing` → `Shipped` → `Delivered` → `Cancelled`.
- **Payment Tracking**: bKash, Cash on Delivery (COD), Nagad, Card / POS with quick Paid / Unpaid toggle.
- **Printable Tax Invoice (`OrderDetailsModal.tsx`)**: Professional itemized invoice layout with Mirpur-2 Stadium address, customer contact, itemized table, knocking add-ons, and `window.print()` support.
- **Manual Order Creation (`ManualOrderModal.tsx`)**: Record hotline phone orders and walk-in store sales.

### 4. ⏳ Custom Pre-Orders (`PreOrdersTab.tsx`)
- **Bespoke Gear Imports**: Manages player custom requests and direct overseas imports from UK, India, and Australia.
- **Verification**: OTP Verified badge indicators.
- **Lifecycle**: `New Request` → `Reviewing Spec` → `Quote Sent` → `Deposit Received` → `Sourced Overseas` → `In Transit to BD` → `Delivered`.
- **Pre-Order Modal (`PreOrderModal.tsx`)**: Assign quoted price (৳), advance deposit amount, and estimated arrival dates (ETA).
- **Instant Contact**: 1-click direct WhatsApp chat link (`https://wa.me/...`) for player communication.

### 5. 👥 Hire Cricket Experts (`ExpertsTab.tsx`)
- **Directory**: BCB certified coaches, 140+ km/h sidearm throwdown specialists, video analysts, match officials, and master bat-smiths.
- **Booking Management**: Sub-tab to track client coaching sessions, grounds, time slots, fees, and status.
- **Expert Registration (`ExpertModal.tsx`)**: Add or edit coaches, session rates, service modes (Ground, Home, Online), and verified credentials.

### 6. 🏷️ Deals, Banners & Promo Codes (`DealsBannersTab.tsx`)
- **Top Announcement Bar**: Edit and toggle the top marquee banner displayed on the website.
- **Discount Coupons**: Manage coupon codes (`PLAYZONE10`, `BPL2026`, `FREESHIP`), % or flat discounts, minimum spend, expiry date, and usage limits.
- **Store Banners**: Control Hero carousel slides and mid-page CTA banners.

### 7. 📰 Cricket Blog & Equipment Advice (`BlogTab.tsx`)
- Manage articles published on the store blog (bat knocking tutorials, pitch spike analysis, pre-owned bat inspection).
- Write and edit articles with author credits, read time, and publish/draft toggles.

### 8. ⭐ Customer Reviews & Endorsements (`ReviewsTab.tsx`)
- **National Player Endorsements**: Video testimonials featuring Tamim Iqbal, Taskin Ahmed, and Mehidy Hasan Miraz.
- **Customer Reviews**: Moderate product reviews (Approve, Pending, Reject) with verified purchaser badges.

### 9. ⚙️ Store & Brand Settings (`SettingsTab.tsx`)
- **Brand Info**: Hotline, WhatsApp support number, Mirpur-2 National Stadium & Chittagong showroom addresses.
- **Courier Pricing**: Delivery fees for inside Dhaka, express delivery, and outside Dhaka courier rates.
- **Operations**: Toggle Cash on Delivery, bKash gateway, and WhatsApp floating chat widget.
- **Data Backup**: One-click JSON backup export and factory reset.

---

## 🛠️ Running Locally

The dashboard is running locally on port **3000** (or **3001**):

```bash
# In the playzone-dashboard directory
npm run dev

# Or specify a custom port if the main website is running on 3000
npm run dev -- -p 3001
```

Visit [http://localhost:3000](http://localhost:3000) or [http://localhost:3001](http://localhost:3001) in your browser.
