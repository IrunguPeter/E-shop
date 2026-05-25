# Entrepreneur Website - Design Document

## 1. Overview
A sleek, modern web application for an entrepreneur selling Rice, Digital Services, and Phones. Features a public catalog and a secure admin dashboard for product management and sales analytics.

## 2. Technical Stack
- **Frontend:** React (TypeScript) via Vite.
- **Styling:** Vanilla CSS (Custom components).
- **Backend:** Node.js (Express) with TypeScript.
- **Database:** SQLite (Better-sqlite3).
- **Authentication:** JWT (JSON Web Tokens) with bcrypt for password hashing.

## 3. Core Features
### Public Site
- **Landing Page:** High-impact hero section highlighting the three main categories.
- **Product Catalog:** Filterable list of products (Rice, Digital Services, Phones).
- **Product Details:** Simple modal or page showing product info and price.

### Admin Dashboard
- **Authentication:** Secure login for the business owner.
- **Product Management:**
  - Add new products (Image, Name, Category, Price, Description).
  - Edit existing products (Change prices, updates).
  - Delete products.
- **Sales Tracking:**
  - **Overview Stats:** Total Revenue, Total Sales.
  - **Sales Logging:** A way for the admin to record a sale manually (or simulate checkout).
  - **Analytics:**
    - Daily Revenue Chart.
    - Most Sold Items (Best sellers).
    - Least Sold Items (Underperformers).
    - Category breakdown (which category makes the most money).

## 4. Visual Identity
- **Themes:** Modern, clean, and bold.
- **Color Palette:**
  - Deep Navy (#0a192f) for professionalism.
  - Gold (#ffd700) or Amber for highlights (premium feel).
  - Soft Creams for background (Rice/Natural feel).
- **Typography:** Sans-serif (Inter or Montserrat) for a digital, clean look.

## 5. Database Schema
### admins
- `id` (INT, PK)
- `username` (TEXT, UNIQUE)
- `password_hash` (TEXT)

### products
- `id` (INT, PK)
- `name` (TEXT)
- `category` (TEXT) - ['Rice', 'Digital', 'Phones']
- `price` (DECIMAL)
- `description` (TEXT)
- `image_url` (TEXT)
- `created_at` (TIMESTAMP)

### sales
- `id` (INT, PK)
- `product_id` (INT, FK)
- `quantity` (INT)
- `total_price` (DECIMAL)
- `sale_date` (TIMESTAMP)

## 6. Implementation Plan
1. **Phase 1: Project Setup** (Initialize React, Node, and Database).
2. **Phase 2: Backend API** (Auth, Products CRUD, Sales Analytics).
3. **Phase 3: Public UI** (Landing page, Product listing).
4. **Phase 4: Admin UI** (Dashboard, Login, Product/Sales forms).
5. **Phase 5: Refinement** (Styling, responsiveness, and final testing).
