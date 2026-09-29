import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import SellerSidebar from "./components/SellerSidebar";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Account from "./pages/Account";
import Signup from "./pages/Signup";
import OrderHistory from "./pages/OrderHistory";
import TrackOrder from "./pages/TrackOrder";

import Dashboard from "./pages/seller/Dashboard";
import SellerProducts from "./pages/seller/SellerProducts";
import AddEditProduct from "./pages/seller/AddEditProduct";
import SellerOrders from "./pages/seller/SellerOrders";
import SellerLogin from "./pages/seller/SellerLogin";
import Customers from "./pages/seller/Customers";

function SellerLayout({ children }) {
  return (
    <div className="container seller-layout">
      <SellerSidebar />
      <div className="seller-content">{children}</div>
    </div>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="app-main">
        <Routes>
          {/* Normal User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/account" element={<Account />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            }
          />

          <Route path="/track-order" element={<TrackOrder />} />

          {/* Seller Login */}
          <Route path="/seller/login" element={<SellerLogin />} />

          {/* Seller Dashboard */}
          <Route
            path="/seller"
            element={
              <ProtectedRoute sellerOnly>
                <SellerLayout>
                  <Dashboard />
                </SellerLayout>
              </ProtectedRoute>
            }
          />

          {/* Seller Products */}
          <Route
            path="/seller/products"
            element={
              <ProtectedRoute sellerOnly>
                <SellerLayout>
                  <SellerProducts />
                </SellerLayout>
              </ProtectedRoute>
            }
          />

          {/* Add Product */}
          <Route
            path="/seller/products/new"
            element={
              <ProtectedRoute sellerOnly>
                <SellerLayout>
                  <AddEditProduct />
                </SellerLayout>
              </ProtectedRoute>
            }
          />

          {/* Edit Product */}
          <Route
            path="/seller/products/edit/:id"
            element={
              <ProtectedRoute sellerOnly>
                <SellerLayout>
                  <AddEditProduct />
                </SellerLayout>
              </ProtectedRoute>
            }
          />

          {/* Seller Orders */}
          <Route
            path="/seller/orders"
            element={
              <ProtectedRoute sellerOnly>
                <SellerLayout>
                  <SellerOrders />
                </SellerLayout>
              </ProtectedRoute>
            }
          />

          {/* Seller Customers */}
          <Route
            path="/seller/customers"
            element={
              <ProtectedRoute sellerOnly>
                <SellerLayout>
                  <Customers />
                </SellerLayout>
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="container section empty-state">
                <p>Page not found.</p>
              </div>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
