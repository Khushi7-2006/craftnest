import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <h3 className="footer-logo">CraftNest</h3>
          <p>Create. Customize. Inspire.</p>
        </div>
        <div>
          <h4>Shop</h4>
          <Link to="/shop">All Products</Link>
          <Link to="/orders">Order History</Link>
          <Link to="/track-order">Track Order</Link>
        </div>
        <div>
          <h4>Account</h4>
          <Link to="/account">My Account</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/seller/login">Seller Login</Link>
        </div>
      </div>
      <p className="footer-copy">© {new Date().getFullYear()} CraftNest. All rights reserved.</p>
    </footer>
  );
}
