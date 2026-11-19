# Radhey Radhey Girls Point - Premium Women's Fashion E-Commerce Platform

A production-ready, full-stack e-commerce solution engineered for **Radhey Radhey Girls Point**, a luxury Indian ethnic wear, suits, kurtis, dresses, and festive garments boutique based in Jaipur, Rajasthan.

---

## 🌟 Key Features

### 1. Public-Facing Storefront
- **Brand Identity & Extracted Insignia**: High-fidelity vector SVG and extracted raster brand assets featuring the royal crown, double "RR" serif monogram, lotus emblem, and tagline: *"Ethnic • Fusion • Casual • Festive"*.
- **Monochrome Luxury Design System**: Deep black (`#000000`), crisp ivory white (`#FFFFFF`), light grey (`#E5E5E5`), and subtle charcoal (`#171717`) palette with elegant serif typography.
- **Dynamic Homepage**:
  - Promotional announcement bar with WhatsApp concierge link.
  - Interactive hero banner slider dynamically fetched from database CMS.
  - Circular "Shop by Category" strip.
  - Curated "Featured Collection" grid with image hover zoom, discount badges, and instant quick view.
  - Best Sellers, Customer Reviews, and Instagram boutique gallery.
- **Shop & Category Listing (`/shop` & `/category/[slug]`)**:
  - Multi-filtering by category, subcategory, price slider, size (XS to XXL), fabric, and stock availability.
  - Dynamic sorting by Newest, Price: Low to High, Price: High to Low, and Popularity.
  - Responsive mobile filter slide-over.
- **Product Details (`/product/[slug]`)**:
  - Multi-image zoom gallery & thumbnails.
  - Size and color variant selector connected to real warehouse inventory.
  - Real-time stock alerts (*"Only 3 left in stock - order soon"*).
  - Measurement size guide modal (in inches and cm).
  - Pincode delivery estimator.
  - 1-Click WhatsApp inquiry button (*"Inquire on WhatsApp about this design"*).
  - Related product recommendations.
- **Cart & Secure Checkout (`/checkout`)**:
  - Slide-over cart drawer with Free Shipping progress indicator (Free delivery above ₹999).
  - Coupon code validator with instant discount calculation (e.g., `WELCOME10`, `FESTIVE500`).
  - Cash on Delivery (COD) and Razorpay online gateway options.
  - Atomic database transactions with safe stock deduction to prevent overselling.
- **Order Confirmation & Printable Invoices (`/order-success/[orderNumber]`)**:
  - Live status tracking and printable tax invoice formatted for customer printing.
- **Customer Account (`/account`)**:
  - Order history with live courier tracking status.
  - Saved wishlist with 1-click move to bag.
  - Profile and address book management.
- **Customer Support**: Contact Us form, FAQs, Shipping & Returns policy (7-day returns guarantee), Terms, and Privacy Policy.

---

### 2. Separate Secure Admin Dashboard (`/admin`)
- **Completely Independent Visual Architecture**: High-contrast dark sidebar navigation (`#141517`) with a clean, light-grey content workspace.
- **Role-Based Access Control**: Protected via JWT HTTP-only cookies; restricts unauthorized customers and redirects to dedicated Admin Login (`/admin/login`).
- **Dashboard Overview**:
  - Real-time stats: Total Orders, Total Revenue, Total Products, Low Stock Alerts.
  - Weekly Sales Overview SVG trend line chart.
  - Top Categories Donut distribution chart.
  - Recent orders table with real-time fulfillment status updates.
- **Product Management (`/admin/products`)**:
  - Add, edit, duplicate, and delete products.
  - Multi-variant management (sizes, colors, stock per SKU, price overrides).
  - Active/Draft status toggle for storefront visibility.
  - Featured, New Arrival, and Best Seller badges.
- **Dynamic Category Management (`/admin/categories`)**:
  - Create and manage parent categories and child subcategories.
  - Custom slugs, category images, and display order.
  - Automatic real-time reflection across storefront navigation, filters, and forms.
  - Safety check preventing accidental deletion of categories containing active products.
- **Inventory & Stock Control (`/admin/inventory`)**:
  - SKU-wise and size-wise stock monitoring.
  - Low-stock (&le; 10 units) and out-of-stock filtering.
  - Stock adjustment modal with adjustment types: `RESTOCK`, `DAMAGED`, `CORRECTION`, `CUSTOMER RETURN`.
  - Complete, tamper-evident inventory transaction audit log.
- **Order Fulfillment (`/admin/orders`)**:
  - Filter orders by status: `CONFIRMED`, `PROCESSING`, `PACKED`, `SHIPPED`, `DELIVERED`, `CANCELLED`, `RETURNED`.
  - Search by order number, customer name, email, or phone.
  - Assign courier name and tracking number / AWB.
  - Order cancellation with **automatic inventory restoration** back to warehouse stock.
  - Print invoice button.
- **Customer Directory (`/admin/customers`)**:
  - Customer profiles, registered addresses, order counts, and lifetime spend.
- **Offers & Coupons (`/admin/coupons`)**:
  - Create percentage or flat fixed discount coupons.
  - Minimum order amount, maximum discount cap, expiry dates, and usage limits.
- **Homepage Banner CMS (`/admin/banners`)**:
  - Create and manage hero slides, headings, subtitles, CTA links, and display order without touching code.
- **Reports & Analytics (`/admin/reports`)**:
  - Net revenue, inventory valuation, category contribution, and best-seller performance.
  - **One-click CSV Export** of all sales orders.
- **Store Settings (`/admin/settings`)**:
  - Business details, official WhatsApp number, shipping fees, free shipping threshold, and announcement bar.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons |
| **Backend** | Next.js API Routes (REST Architecture), Node.js |
| **Database & ORM** | Prisma ORM 5.x (SQLite for zero-config instant local testing, PostgreSQL ready for production) |
| **Authentication** | JWT (jsonwebtoken) stored in secure HTTP-only cookies, bcryptjs password hashing |
| **Payments** | Cash on Delivery (COD), Razorpay integration with server-side HMAC-SHA256 signature verification |
| **Image Storage** | Local storage / Cloudinary compatible |

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment Variables
Create a \`.env\` file in the root directory:
\`\`\`env
DATABASE_URL="file:./dev.db"
JWT_SECRET="radhey_radhey_girls_point_secure_jwt_token_auth_secret_key_2026"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_STORE_NAME="Radhey Radhey Girls Point"
NEXT_PUBLIC_STORE_TAGLINE="Ethnic • Fusion • Casual • Festive"
NEXT_PUBLIC_CURRENCY_SYMBOL="₹"
NEXT_PUBLIC_WHATSAPP_NUMBER="919876543210"
RAZORPAY_KEY_ID="rzp_test_mock_radhey123"
RAZORPAY_KEY_SECRET="mock_secret_radhey_point_secure_key"
\`\`\`

### 3. Initialize & Seed Database
\`\`\`bash
npx prisma generate
npx prisma db push
node prisma/seed.js
\`\`\`

### 4. Run Automated Test Suite
\`\`\`bash
npm test
\`\`\`
*(Verifies 21 critical business rules including authentication, inventory deductions, coupon engine, category creation, and order cancellation stock restoration).*

### 5. Start Development Server
\`\`\`bash
npm run dev
\`\`\`
- Public Storefront: [http://localhost:3000](http://localhost:3000)
- Admin Dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🔐 Default Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | \`admin@radheygirlspoint.com\` | \`Admin@123Password!\` |
| **Staff** | \`staff@radheygirlspoint.com\` | \`Staff@123Password!\` |
| **Customer** | \`customer@example.com\` | \`Customer@123!\` |

---

## 📦 Production Deployment (PostgreSQL + Vercel)

### Deploying Database to PostgreSQL (Supabase, Neon, Railway):
1. In `prisma/schema.prisma`, update the datasource provider:
   \`\`\`prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   \`\`\`
   *(Or copy from `prisma/schema.postgresql.prisma`)*
2. In production environment settings, set `DATABASE_URL` to your PostgreSQL connection string:
   \`\`\`env
   DATABASE_URL="postgresql://user:password@host:5432/radhey_radhey?sslmode=require"
   \`\`\`
3. Push schema and seed:
   \`\`\`bash
   npx prisma db push
   node prisma/seed.js
   \`\`\`

### Deploying to Vercel:
1. Connect repository to Vercel.
2. Add environment variables in Vercel Project Settings.
3. Build Command: `prisma generate && next build`.
4. Output Directory: `.next`.
