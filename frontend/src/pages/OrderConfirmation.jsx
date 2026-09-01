import { Link, useSearchParams } from "react-router-dom";

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <div className="container section empty-state">
      <h1>🎉 Order placed successfully!</h1>
      <p>Your Order ID is <strong>{orderId}</strong>. Save it to track your order anytime.</p>
      <div className="confirmation-actions">
        <Link to={`/track-order?id=${orderId}`} className="btn btn-primary">
          Track Order
        </Link>
        <Link to="/shop" className="btn btn-outline">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
