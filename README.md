# CraftNest — DIY Stationery E-commerce App

**Create. Customize. Inspire.**

CraftNest is a full-stack DIY stationery e-commerce web application built as a **BCA college project**.

The project uses:

- **Frontend:** React 18 + Vite
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Authentication:** Simple phone/password login for customers and fixed Seller ID/password login
- **Deployment:** Vercel (frontend) + Render (backend) + MongoDB Atlas (database)

> **Important:** Google OAuth has been completely removed from the project. This version uses simple credentials only.

---

## 1. Main Features

### Customer

- Customer signup using phone number and password
- Country-code selector for phone number
- Customer login/logout
- Product browsing
- Product search
- Category filtering
- Price filtering
- Product sorting
- Product details
- Related products
- Shopping cart
- Quantity management
- Stock validation
- Checkout
- Order confirmation
- Order history
- Order tracking
- Account page

### Seller

- Dedicated seller login
- Seller dashboard
- View products
- Add products
- Edit products
- Delete products
- View customer orders
- Update order status
- Low-stock information
- Seller logout

### Authentication

Customer:

```text
Phone Number + Password
```

Seller:

```text
Seller ID: seller
Password: seller 123
```

There is **no Google login, OTP, email verification, or social authentication**.

---

## 2. Project Structure

```text
craftnest/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   └── userRoutes.js
│   ├── .env.example
│   ├── package.json
│   ├── seed.js
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   │   └── seller/
│   │   ├── services/
│   │   └── styles/
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 3. Prerequisites

Install:

- Node.js 18+ recommended
- npm
- MongoDB Atlas account or local MongoDB
- Git/GitHub account for deployment

Check Node.js:

```bash
node -v
```

Check npm:

```bash
npm -v
```

---

## 4. Clone or Download the Project

If using Git:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd craftnest
```

Or extract the ZIP and open the project folder in VS Code.

---

## 5. Backend Installation

Open a terminal:

```bash
cd backend
npm install
```

Create:

```text
backend/.env
```

Copy the values from `backend/.env.example` and update them.

Example:

```env
PORT=5000
NODE_ENV=development

FRONTEND_URL=http://localhost:5173

MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/craftnest

JWT_SECRET=replace_with_your_secret

SELLER_ID=seller
SELLER_PASSWORD=seller 123
```

### Environment variables

| Variable | Purpose |
|---|---|
| `PORT` | Backend port. Render provides this automatically in production. |
| `NODE_ENV` | Use `development` locally and `production` on Render. |
| `FRONTEND_URL` | Exact frontend origin used by CORS. |
| `MONGO_URI` | MongoDB Atlas/local MongoDB connection string. |
| `JWT_SECRET` | Secret used to sign login JWTs. |
| `SELLER_ID` | Fixed seller login ID. |
| `SELLER_PASSWORD` | Fixed seller login password. |

**Never commit your real `.env` file to GitHub.**

---

## 6. Frontend Installation

Open a second terminal:

```bash
cd frontend
npm install
```

Create:

```text
frontend/.env
```

For local development:

```env
VITE_API_URL=http://localhost:5000
```

For production, this should be your Render backend URL:

```env
VITE_API_URL=https://YOUR-BACKEND.onrender.com
```

---

## 7. MongoDB Setup

### Option A — MongoDB Atlas

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Add the IP address required for your environment.
4. Copy the MongoDB connection string.
5. Put it in `backend/.env` as `MONGO_URI`.

Example:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/craftnest
```

For a simple college-project deployment on Render, the Atlas network access configuration must allow the Render backend to connect.

### Option B — Local MongoDB

Use:

```env
MONGO_URI=mongodb://127.0.0.1:27017/craftnest
```

---

## 8. Seed Demo Products

The project includes a seed script for demo products.

After configuring MongoDB:

```bash
cd backend
npm run seed
```

This inserts the project's demo stationery products into MongoDB.

Run the seed command only when you need to populate the database.

---

## 9. Run Locally

You need two terminals.

### Terminal 1 — Backend

```bash
cd backend
npm run dev
```

Backend:

```text
http://localhost:5000
```

Test it by opening:

```text
http://localhost:5000
```

Expected response:

```json
{
  "message": "CraftNest API is running."
}
```

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Open:

```text
http://localhost:5173
```

---

## 10. Customer Authentication

### Create an account

Use:

```text
Country Code: +91
Phone: 9876543210
Password: test123
Confirm Password: test123
```

The phone number is used as the customer's login identifier.

The application combines the country code and phone number, for example:

```text
+919876543210
```

### Login

Use the registered phone number and password.

Example:

```text
Phone: +919876543210
Password: test123
```

### Logout

Use the existing Logout option in the application.

---

## 11. Seller Login

There is one fixed seller account.

```text
Seller ID: seller
Password: seller 123
```

There is no seller signup.

Seller login opens the existing Seller Dashboard.

---

## 12. Authentication Architecture

CraftNest uses a simple JWT-based authentication system.

### Customer

```text
Signup
   ↓
Phone + Password
   ↓
MongoDB User
   ↓
JWT
   ↓
Authentication cookie
```

### Seller

```text
Seller ID + Password
   ↓
Backend checks environment variables
   ↓
JWT
   ↓
Authentication cookie
```

The seller account does not require a MongoDB user record.

Google OAuth and Passport are not used.

---

## 13. API Overview

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/seller/login
GET  /api/auth/current-user
POST /api/auth/logout
```

### Products

```text
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Orders

The order routes handle:

- Creating orders
- Customer order history
- Order details/tracking
- Seller order management
- Updating order status

### Users

The user routes handle customer-related account operations used by the existing application.

The exact request/response structure should be checked in the corresponding route/controller files before integrating another frontend or API client.

---

## 14. CORS Configuration

The project is designed for:

```text
Vercel frontend
       ↓
Render backend
       ↓
MongoDB Atlas
```

The backend uses the `FRONTEND_URL` environment variable for CORS.

Example production value:

```env
FRONTEND_URL=https://craftnest.vercel.app
```

Do not use:

```text
*
```

as the CORS origin when credentialed requests are being used.

The frontend uses:

```env
VITE_API_URL=https://YOUR-BACKEND.onrender.com
```

This keeps the production API URL separate from the frontend source code.

---

# 15. Deploy Backend to Render

## Step 1 — Push the project to GitHub

Make sure `.env` files are ignored.

Your repository should contain:

```text
backend/.env.example
frontend/.env.example
```

but NOT:

```text
backend/.env
frontend/.env
```

## Step 2 — Create Render Web Service

On Render:

1. Create a new Web Service.
2. Connect your GitHub repository.
3. Set the backend root directory to:

```text
backend
```

4. Build command:

```bash
npm install
```

5. Start command:

```bash
npm start
```

6. Deploy the service.

Render provides a public URL similar to:

```text
https://craftnest-backend.onrender.com
```

---

## 16. Render Environment Variables

Add these to the Render service:

```env
NODE_ENV=production
FRONTEND_URL=https://YOUR-VERCEL-APP.vercel.app
MONGO_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING
JWT_SECRET=YOUR_JWT_SECRET
SELLER_ID=seller
SELLER_PASSWORD=seller 123
```

Do not normally set `PORT` manually on Render. The application uses:

```js
process.env.PORT || 5000
```

so it can use Render's assigned port.

---

# 17. Deploy Frontend to Vercel

1. Create a new Vercel project.
2. Import the GitHub repository.
3. Set the Root Directory to:

```text
frontend
```

4. Framework:

```text
Vite
```

5. Build command:

```bash
npm run build
```

6. Output directory:

```text
dist
```

---

## 18. Vercel Environment Variable

Add:

```env
VITE_API_URL=https://YOUR-BACKEND.onrender.com
```

Do not put:

```text
MONGO_URI
JWT_SECRET
SELLER_PASSWORD
```

in Vercel.

These are backend variables and must remain on Render.

After changing Vercel environment variables, redeploy the frontend.

---

# 19. Final Production Configuration

The final application should work like this:

```text
                    CraftNest
                       |
                       v
              +------------------+
              | Vercel           |
              | React + Vite     |
              +--------+---------+
                       |
                       | HTTPS API
                       v
              +------------------+
              | Render           |
              | Node + Express   |
              +--------+---------+
                       |
                       | Mongoose
                       v
              +------------------+
              | MongoDB Atlas    |
              +------------------+
```

Environment configuration:

```text
Vercel
└── VITE_API_URL
    └── https://YOUR-BACKEND.onrender.com

Render
├── FRONTEND_URL
│   └── https://YOUR-FRONTEND.vercel.app
├── MONGO_URI
├── JWT_SECRET
├── SELLER_ID
├── SELLER_PASSWORD
└── NODE_ENV=production
```

---

# 20. Production Testing Checklist

After deployment, test the following.

### Customer

- [ ] Homepage loads
- [ ] Products load from MongoDB
- [ ] Search works
- [ ] Category filter works
- [ ] Product details work
- [ ] Customer signup works
- [ ] Customer login works
- [ ] Refresh while logged in
- [ ] Logout works
- [ ] Add product to cart
- [ ] Update cart quantity
- [ ] Checkout
- [ ] Create order
- [ ] Order confirmation
- [ ] Order history
- [ ] Track order

### Seller

- [ ] Seller login page loads
- [ ] Login with `seller` / `seller 123`
- [ ] Seller dashboard loads
- [ ] Product list loads
- [ ] Add product
- [ ] Edit product
- [ ] Delete product
- [ ] View customer orders
- [ ] Update order status
- [ ] Seller logout

### Deployment

- [ ] Vercel frontend loads
- [ ] Render backend responds
- [ ] MongoDB Atlas connects
- [ ] No CORS error
- [ ] No localhost API requests in production
- [ ] Customer authentication works
- [ ] Seller authentication works
- [ ] Orders work between Vercel and Render

---

# 21. Common Deployment Problems

### CORS error

Check:

```env
FRONTEND_URL=https://YOUR-VERCEL-APP.vercel.app
```

The URL must match the actual Vercel origin.

Do not include a trailing slash:

```text
Correct:
https://craftnest.vercel.app

Incorrect:
https://craftnest.vercel.app/
```

After changing the Render environment variable, redeploy/restart the backend.

### Frontend calling localhost

Check the Vercel environment variable:

```env
VITE_API_URL=https://YOUR-BACKEND.onrender.com
```

Then redeploy Vercel.

### MongoDB connection error

Check:

- MongoDB username
- MongoDB password
- Cluster URL
- Database name
- Atlas Network Access
- Render `MONGO_URI`

### Authentication not staying logged in

Check:

- Browser cookies
- Backend CORS
- `credentials: true`
- Frontend API requests
- Production cookie configuration
- `FRONTEND_URL`
- HTTPS frontend/backend URLs

---

# 22. Security / College Project Note

This project intentionally uses a **simple authentication design** suitable for a BCA college project.

It is not intended to be an enterprise-grade authentication system.

The project does use basic password hashing and JWT authentication, but it does not implement:

- Google OAuth
- OTP
- Email verification
- Password reset
- Two-factor authentication
- Social login
- Payment authentication

The fixed seller credentials are configured through backend environment variables.

---

# 23. Demo Seller Credentials

For demonstration:

```text
Seller ID: seller
Password: seller 123
```

Change these environment variables if you want different seller credentials.

---

# 24. Demo Checkout

The checkout system is a **demo checkout flow** for the college project.

There is no real payment gateway.

Orders are created directly through the application.

A real payment gateway such as Stripe or Razorpay can be integrated later if required.

---

# 25. Data Storage

MongoDB stores the application's persistent data, including:

- Customers
- Products
- Orders

The shopping cart is handled by the existing frontend cart context and is stored in browser `localStorage`, allowing the cart to survive page refreshes.

---

# 26. Technologies Used

### Frontend

- React
- Vite
- React Router
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- Mongoose
- MongoDB
- JWT
- bcryptjs
- CORS
- cookie-parser
- dotenv

### Deployment

- Vercel
- Render
- MongoDB Atlas

---

# 27. Project Purpose

CraftNest was developed as a **BCA college full-stack web development project** to demonstrate:

- Frontend development
- React component architecture
- REST API development
- MongoDB database integration
- User authentication
- Seller/admin-style functionality
- E-commerce functionality
- CRUD operations
- Order management
- Cloud deployment

---

## Author

**CraftNest — BCA College Project**

Built with React, Node.js, Express and MongoDB.
