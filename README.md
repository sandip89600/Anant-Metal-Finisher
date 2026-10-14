# Anant Metal Finishers (AMF) - Industrial Web Application

A production-ready full-stack industrial web portal and management system for **Anant Metal Finishers (AMF)**, situated in **G-8, MIDC Ambad, Nashik, Maharashtra, India – 422010**.

Built with **React.js**, **Vite**, **Tailwind CSS**, **Node.js**, **Express.js**, and **MongoDB / Mongoose**.

---

## 1. Project Overview & Business Focus

- **Company Name:** Anant Metal Finishers
- **Brand Abbreviation:** AMF
- **Business Category:** Industrial metal finishing and electroplating job work
- **Workshop Location:** Plot G-8, MIDC Ambad, Nashik, Maharashtra, India – 422010
- **Target Audience:** Industrial manufacturers, engineering jobbing shops, component suppliers, and procurement teams looking for surface finishing job work.
- **Strict Factual Accuracy Policy:**
  - The initially confirmed capability is **Electroplating Job Work / Industrial Metal Finishing**.
  - All specific bath types (such as zinc plating, barrel plating) are held in draft state until confirmed by shop personnel.
  - No fabricated owner histories, fake reviews, or unverified ISO certifications are shown.
  - Contact information, business descriptions, and capabilities are completely manageable through the Admin Dashboard.

---

## 2. Technology Stack

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS (industrial design tokens, responsive typography, accessible contrast)
- **Routing:** React Router DOM v6
- **Forms & Validation:** React Hook Form & Zod
- **Icons:** Lucide React
- **API Client:** Axios with credentials and interceptors
- **SEO & Discovery:** Dynamic document titles, OpenGraph, Canonical URLs, Schema.org LocalBusiness JSON-LD

### Backend
- **Runtime:** Node.js (v18+) & Express.js
- **Database:** MongoDB & Mongoose (indexing, constraints, text search)
- **Authentication:** JWT in HttpOnly secure cookies + bcryptjs password hashing
- **Validation:** Zod request schema validation
- **Security Headers:** Helmet
- **CORS:** Strict origin allowlist
- **Rate Limiting:** `express-rate-limit` for authentication and enquiry endpoints
- **Sanitization:** `sanitize-html` for rich article content
- **Notifications:** Nodemailer SMTP email integration with graceful failure handling

---

## 3. Directory Layout

```
Anant Metal Finisher/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection, env variables, SMTP transporter
│   │   ├── controllers/     # Auth, Products, Blogs, Enquiries, Settings, Dashboard
│   │   ├── middleware/      # Auth JWT, Rate Limiters, Zod Validate, Error Handlers
│   │   ├── models/          # Admin, Product, Blog, Enquiry, Category, Settings
│   │   ├── routes/          # API v1 route definitions
│   │   ├── services/        # Email dispatcher, enquiry processing
│   │   ├── utils/           # Logger, slugify, reference generator, sanitizer
│   │   ├── validators/      # Zod validation schemas
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Server listener and graceful shutdown
│   ├── scripts/
│   │   ├── seedAdmin.js     # Secure admin user setup
│   │   └── seedData.js      # Initial factual settings and verified services
│   ├── tests/
│   │   └── api.test.js      # Automated Jest/Supertest integration suite
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/              # Favicon SVG, robots.txt, sitemap.xml
│   ├── src/
│   │   ├── components/      # Header, Footer, SEO, Skeletons, Visuals
│   │   ├── context/         # AuthContext, SettingsContext
│   │   ├── pages/           # Home, About, Products, Blog, Contact, Quote, Legal
│   │   │   └── admin/       # Dashboard, Product CRUD, Blog CRUD, Enquiries, Settings
│   │   ├── services/        # Axios API client
│   │   ├── App.jsx          # Route definitions
│   │   ├── main.jsx         # Application entry
│   │   └── index.css        # Tailwind directives
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
├── package.json             # Root monorepo scripts
├── README.md                # Full setup & deployment documentation
├── API_DOCUMENTATION.md     # Detailed API endpoints & curl examples
└── PRE_LAUNCH_VERIFICATION_CHECKLIST.md # Pre-launch owner verification checklist
```

---

## 4. Local Development Setup

### Prerequisites
- **Node.js** (v18 or v20+ recommended)
- **MongoDB** running locally on `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI

### 1. Clone & Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` in both folders:

**Backend (`backend/.env`):**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/anant_metal_finishers
JWT_SECRET=amp_nashik_dev_jwt_secret_key_super_secure_987654321
JWT_EXPIRES_IN=7d
COOKIE_SECRET=amp_nashik_cookie_secret_dev_2026
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# Initial Admin Creation credentials
INITIAL_ADMIN_EMAIL=admin@anantmetalfinishers.com
INITIAL_ADMIN_PASSWORD=AmpNashik@2026AdminSecure!
INITIAL_ADMIN_NAME=AMF Operations Desk
```

**Frontend (`frontend/.env`):**
```env
VITE_API_BASE_URL=/api/v1
```

### 3. Initialize Database & Admin User
Run the setup scripts from the root directory:
```bash
# Seed initial administrator account
npm run seed:admin

# Seed factual company settings, confirmed service, and educational guides
npm run seed:initial
```

### 4. Run Development Servers
```bash
# Terminal 1: Run Backend API (Port 5000)
npm run dev:backend

# Terminal 2: Run Frontend (Port 5173 with API proxy)
npm run dev:frontend
```

Now open `http://localhost:5173` in your browser.
To access the Admin Portal, visit `http://localhost:5173/admin/login`.

---

## 5. Testing & Quality Assurance

### Run Backend Automated Integration Tests
The project includes a 15-point automated integration test suite covering health, auth, catalogue verification filtering, quote submissions, rate limiting, and admin CRUD.

```bash
npm run test:backend
```

### Run Frontend Production Build
```bash
npm run build
```

---

## 6. Production Deployment Guide

### A. Database (MongoDB Atlas)
1. Create a free or dedicated cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a database user and whitelist your server's IP address (or `0.0.0.0/0` if hosting on serverless platforms).
3. Copy the connection string:
   `mongodb+srv://<user>:<password>@cluster0.mongodb.net/anant_metal_finishers?retryWrites=true&w=majority`

### B. Backend Deployment (e.g. Render / DigitalOcean)
1. Set the Root Directory to `backend`.
2. Build Command: `npm install`
3. Start Command: `node src/server.js`
4. Set Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000` (or host provided)
   - `MONGODB_URI`: Atlas connection string
   - `JWT_SECRET`: Random 64-character secret
   - `COOKIE_SECRET`: Random 32-character secret
   - `ALLOWED_ORIGINS`: `https://anantmetalfinishers.com,https://www.anantmetalfinishers.com`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (for email dispatch)
5. Run the seed scripts once against your Atlas database:
   ```bash
   node scripts/seedAdmin.js
   node scripts/seedData.js
   ```

### C. Frontend Deployment (e.g. Vercel)
1. Set the Root Directory to `frontend`.
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Set Environment Variables:
   - `VITE_API_BASE_URL`: `https://api.anantmetalfinishers.com/api/v1`
5. Configure custom domain `anantmetalfinishers.com` in DNS.

---

## 7. Security Highlights

- **HttpOnly, SameSite Cookies:** Authentication tokens are stored in secure cookies preventing XSS access.
- **Cross-Site Scripting Protection:** All blog HTML is sanitized with `sanitize-html` before database persistence.
- **Rate Limiting:** Protects sensitive login and public enquiry submission endpoints from brute-force and spam abuse.
- **Anti-Duplication:** Contact and quotation submissions reject duplicate payloads submitted within 2 minutes.
- **Reference Numbers:** Every enquiry generates a unique audit code (`AMF-ENQ-2026-XXXXX` or `AMF-QUO-2026-XXXXX`).

---

## 8. Pre-Launch Verification
Before launching publicly, review [`PRE_LAUNCH_VERIFICATION_CHECKLIST.md`](./PRE_LAUNCH_VERIFICATION_CHECKLIST.md) to confirm contact telephone numbers, operating hours, and active chemical bath capabilities.
