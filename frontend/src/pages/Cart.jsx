import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";

export default function Cart() {
  const { items, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="container section empty-state">
        <p>Your cart is empty.</p>
        <Link to="/shop" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container section">
      <h1 className="section-title">Your Cart</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <CartItem key={item.productId} item={item} />
          ))}
        </div>

        <div className="card cart-summary">
          <h3>Order Summary</h3>
          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="cart-summary-row">
            <span>Shipping</span>
            <span>{subtotal >= 500 ? "Free" : "₹49"}</span>
          </div>
          <div className="cart-summary-row total">
            <span>Total</span>
            <span>₹{subtotal >= 500 ? subtotal : subtotal + 49}</span>
          </div>
          <Link to="/checkout" className="btn btn-primary btn-block">
            Checkout
          </Link>
          <Link to="/shop" className="btn btn-outline btn-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
