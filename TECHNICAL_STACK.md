# Technical Specification & Architectural Overview
**Project:** EntrepStore (Rice & Digital Services Platform)  
**Author:** Gemini CLI Agent  
**Date:** May 25, 2026

---

## 1. Executive Summary
This document outlines the technical architecture, technology stack, and implementation details of the EntrepStore web application. The platform is designed as a full-stack solution to facilitate the sale of physical goods (Rice, Phones) and Digital Services, featuring a secure administrative dashboard for real-time inventory management and sales analytics.

---

## 2. The Technology Stack

### 2.1 Frontend: React (TypeScript) + Vite
*   **Why React?** Chosen for its component-based architecture, which allows for a modular and maintainable UI. The "stand-out" requirement was met by creating custom, reusable components rather than relying on generic UI libraries.
*   **Why TypeScript?** To ensure type safety across the application, reducing runtime errors and improving the developer experience through strict interfaces for Products and Sales data.
*   **Why Vite?** Provides a lightning-fast development environment and optimized production builds compared to traditional bundlers like Webpack.

### 2.2 Backend: Node.js + Express (TypeScript)
*   **Architecture:** A RESTful API design.
*   **TypeScript Integration:** Used to share data models between the frontend and backend, ensuring that the API responses always match the frontend's expectations.
*   **Middleware:** 
    *   `cors`: Managed cross-origin resource sharing between the Vite dev server (port 5173) and the Express API (port 5000).
    *   `jsonwebtoken (JWT)`: Implemented for stateless administrative authentication.

### 2.3 Database: SQLite (via `sqlite3` & `sqlite` wrappers)
*   **Rationale:** SQLite was chosen for its "zero-config" nature, making it perfect for a standalone entrepreneur's site. It stores the entire database as a single file (`database.sqlite`), simplifying local backups and initial development.
*   **Schema Design:**
    *   `admins`: Stores hashed credentials.
    *   `products`: Contains catalog items with support for three distinct categories.
    *   `sales`: Relational table linking transactions to products for analytics.

### 2.4 Security: Bcrypt.js & JWT
*   **Password Hashing:** Administrative passwords are never stored in plain text. We use `bcryptjs` with a salt factor of 10 to ensure high security against rainbow table attacks.
*   **Session Management:** JWTs are issued upon login, allowing the admin to stay authenticated without the server needing to store session state in memory.

---

## 3. Key Features Implementation

### 3.1 Custom Vanilla CSS Engine
Instead of using a utility-first framework like Tailwind, we used **scoped Vanilla CSS**. This ensures the site has a unique visual identity ("stands out") and avoids the "generic" look often associated with CSS frameworks. We utilized CSS Variables (`:root`) for consistent branding (Navy & Gold).

### 3.2 Sales Analytics Engine
The **SalesTracker** component utilizes `recharts` to transform raw SQL data into visual insights:
*   **Daily Revenue:** A Line Chart showing growth trends over the last 7 days.
*   **Best Sellers:** A Bar Chart identifying high-performing inventory.
*   **REL (Relational Error Logging):** The system handles "Least Sold" items by performing a `LEFT JOIN` between products and sales, identifying items that have moved zero units—critical for business decisions.

### 3.3 Localization
The system is fully localized for the Kenyan market, using `KSh` as the currency symbol and `toLocaleString()` for professional formatting of large numbers (e.g., `KSh 185,000`).

---

## 4. Developer Handoff: Setup & Extension

### Environment Variables
Ensure the following are set in a `.env` file in the `/server` directory:
- `JWT_SECRET`: Used to sign authentication tokens.
- `PORT`: Defaults to 5000.

### Database Persistence on Deployment
As noted in the README, if deploying to a serverless environment like Vercel, the internal SQLite file will reset. 
*   **Developer Tip:** To scale this to a permanent production environment, simply replace the `sqlite3` driver in `server/src/db/setup.ts` with a connection string to a hosted PostgreSQL (Neon) or Serverless SQLite (Turso) instance.

---

## 5. Conclusion
The EntrepStore architecture prioritizes **simplicity, performance, and clear data visualization**. By utilizing a modern TypeScript stack, we have created a robust foundation that is easy to extend as the business grows.

---
*End of Document*
