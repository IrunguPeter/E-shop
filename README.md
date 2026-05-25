# EntrepStore - Entrepreneur Website

A sleek, modern web application for an entrepreneur selling Rice, Digital Services, and Phones. Features a public catalog and a secure admin dashboard for product management and sales analytics.

## Tech Stack
- **Frontend:** React (TypeScript) via Vite
- **Backend:** Node.js (Express) with TypeScript
- **Database:** SQLite
- **Styling:** Vanilla CSS
- **Currency:** Kenyan Shillings (KSh)

## Getting Started

### Prerequisites
- Node.js installed on your machine.

### Setup Instructions

1. **Clone the repository** (or navigate to the folder).

2. **Backend Setup:**
   ```bash
   cd server
   npm install
   npm run seed  # This creates the database and adds sample data
   npm run dev   # Starts the server on http://localhost:5000
   ```

3. **Frontend Setup:**
   ```bash
   cd ../client
   npm install
   npm run dev   # Starts the frontend on http://localhost:5173
   ```

### Admin Credentials
- **Username:** `admin`
- **Password:** `admin123`
- **URL:** `http://localhost:5173/admin`

---

## Deployment to Vercel

Vercel is great for hosting the frontend, but hosting an Express server with SQLite requires specific considerations because Vercel Functions are **serverless** and the filesystem is **read-only**.

### Option A: The "Quick" Way (Limitations apply)
You can deploy the backend to Vercel, but **SQLite data will reset** every time the function restarts (it won't persist your changes permanently).

1. **Create a `vercel.json`** in the `server/` directory:
   ```json
   {
     "version": 2,
     "builds": [
       { "src": "src/index.ts", "use": "@vercel/node" }
     ],
     "routes": [
       { "src": "/(.*)", "dest": "src/index.ts" }
     ]
   }
   ```
2. Deploy the `client/` as a separate project on Vercel.
3. Update the `axios` base URL in the frontend to your Vercel backend URL.

### Option B: Professional Setup (Recommended for Production)
For a real business, you need a database that doesn't disappear.

1. **Database:** Switch from local SQLite to a hosted database:
   - **[Turso](https://turso.tech/):** Best if you want to keep using SQLite (Serverless SQLite).
   - **[Neon](https://neon.tech/):** Great if you want to switch to PostgreSQL (Serverless Postgres).
2. **Backend Hosting:**
   - Deploy the `server/` to **Render.com** or **Railway.app**. These services support permanent filesystems or long-running servers better than Vercel for traditional Express apps.
3. **Frontend Hosting:**
   - Keep the `client/` on **Vercel** for the best performance.

### Environment Variables
When deploying, make sure to set these in your hosting provider's dashboard:
- `JWT_SECRET`: A long random string.
- `PORT`: 5000 (usually handled by the provider).
- `DATABASE_URL`: (If using a hosted DB).
