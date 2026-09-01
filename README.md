# CraftNest — DIY Stationery E-commerce App

**Create. Customize. Inspire.**

A full-stack e-commerce web app for a DIY stationery brand, built with React (Vite) on the
frontend and Node.js/Express + MongoDB on the backend, with Google login.

---

## 1. Project Structure

```
craftnest/
├── backend/
│   ├── controllers/     # Route logic (auth, products, orders, users)
│   ├── models/          # Mongoose schemas: User, Product, Order
│   ├── routes/          # Express routers
│   ├── middleware/      # auth guards + error handler
│   ├── config/          # db.js (Mongo connection), passport.js (Google OAuth)
│   ├── server.js        # App entry point
│   ├── seed.js          # Seeds 12 demo products
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/  # Navbar, ProductCard, CartItem, OrderTracker, etc.
    │   ├── pages/        # Home, Shop, Cart, Checkout, Account, seller/*
    │   ├── context/      # AuthContext, CartContext
    │   ├── services/     # api.js (fetch wrapper)
    │   ├── styles/       # index.css (design tokens), layout.css
    │   ├── App.jsx        # Routes
    │   └── main.jsx       # Entry point
    ├── index.html
    ├── vite.config.js
    ├── .env.example
    └── package.json
```

---

## 2. Prerequisites

- Node.js 18+
- MongoDB (local install, or a free MongoDB Atlas cluster)
- A Google Cloud project for OAuth credentials (see Step 8 below)

---

## 3. Installation

Open two terminals, one for each half of the app.

**Backend**
```bash
cd backend
npm install
cp .env.example .env
# now edit .env and fill in your real values (see Step 8 for Google OAuth)
```

**Frontend**
```bash
cd frontend
npm install
cp .env.example .env
```

---

## 4. MongoDB Setup

**Option A — Local MongoDB**
1. Install MongoDB Community Server and start it (`mongod`).
2. Keep the default in `backend/.env`:
   `MONGO_URI=mongodb://127.0.0.1:27017/craftnest`

**Option B — MongoDB Atlas (cloud, free tier)**
1. Create a cluster at https://www.mongodb.com/cloud/atlas
2. Create a database user and allow your IP address.
3. Copy the connection string into `backend/.env`:
   `MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/craftnest`

---

## 5. Seed Demo Data

With MongoDB running and `backend/.env` configured:

```bash
cd backend
npm run seed
```

This inserts 12 demo DIY stationery products so the shop works immediately.

---

## 6. Running the Project

**Start the backend** (from `backend/`):
```bash
npm run dev
```
Runs on http://localhost:5000

**Start the frontend** (from `frontend/`, in a separate terminal):
```bash
npm run dev
```
Runs on http://localhost:5173 and proxies `/api` calls to the backend automatically.

Open http://localhost:5173 in your browser.

---

## 7. Environment Variables

### backend/.env
| Variable | Description |
|---|---|
| `PORT` | Backend port (default 5000) |
| `FRONTEND_URL` | Used for CORS + OAuth redirect after login |
| `BACKEND_URL` | Used to build the Google OAuth callback URL |
| `MONGO_URI` | MongoDB connection string |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | From Google Cloud Console (Step 8) |
| `SESSION_SECRET` / `JWT_SECRET` | Any long random strings — used to sign sessions |
| `SELLER_EMAIL` | The Google account email that should get seller access |

### frontend/.env
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL. Leave blank in dev (the Vite proxy handles it); set to your deployed backend URL in production. |

Never commit your real `.env` files — only `.env.example` is checked into GitHub.

---

## 8. Google OAuth Setup

1. Go to https://console.cloud.google.com/apis/credentials
2. Create a new project (or select an existing one).
3. Click **Create Credentials → OAuth client ID**.
4. Choose **Web application**.
5. Under **Authorized redirect URIs**, add:
   `http://localhost:5000/api/auth/google/callback`
6. Under **Authorized JavaScript origins**, add:
   `http://localhost:5173`
7. Click Create. Copy the **Client ID** and **Client Secret**.
8. Paste them into `backend/.env`:
   ```
   GOOGLE_CLIENT_ID=<your client id>
   GOOGLE_CLIENT_SECRET=<your client secret>
   ```
9. In `backend/.env`, set `SELLER_EMAIL` to the Gmail address you want to log in with
   as the seller — that account will automatically get the "seller" role and access to
   `/seller` on first login. Every other Google account becomes a regular "buyer".

For production, add your deployed frontend/backend URLs as additional authorized
origins/redirect URIs, and update `FRONTEND_URL` / `BACKEND_URL` in `.env` accordingly.

---

## 9. Testing Checklist

- [ ] Login with Google (as buyer) — profile shows in navbar
- [ ] Login with Google (as SELLER_EMAIL) — "Seller Dashboard" link appears
- [ ] Search products by name / category / description on the Shop page
- [ ] Filter by category and price, sort by price/popularity
- [ ] Open a product details page, view related products
- [ ] Add to cart, change quantities, remove an item
- [ ] Try adding more than available stock — it's capped automatically
- [ ] Checkout with valid and invalid form data (see validation messages)
- [ ] Place an order — see "Order placed successfully!" and an Order ID
- [ ] View Order History as the buyer who placed it
- [ ] Track an order by ID from the Track Order page
- [ ] As seller: view dashboard stats and low-stock list
- [ ] As seller: add a new product, edit it, then delete it
- [ ] As seller: view all customer orders and update an order's status
- [ ] Confirm the updated status appears on the buyer's tracking page
- [ ] Resize the browser to mobile width — navbar collapses, grids adjust, no horizontal scroll

---

## 10. Notes

- This project uses a **demo checkout flow** (no real payment gateway) — orders are
  confirmed immediately, as requested. Swapping in a real payment provider (Stripe,
  Razorpay, etc.) later only touches `Checkout.jsx` and `orderController.js`.
- Roles: the first Google login using `SELLER_EMAIL` becomes a seller; everyone else
  is a buyer. You can also manually change a user's `role` field in MongoDB if needed.
- Cart is stored in `localStorage`, so it survives page refreshes.
