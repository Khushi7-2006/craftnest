import { Link } from "react-router-dom";

export default function OrderCard({ order }) {
  return (
    <div className="card order-card">
      <div className="order-card-header">
        <div>
          <h4>Order #{order.orderId}</h4>
          <p className="order-card-date">{new Date(order.orderDate).toLocaleDateString()}</p>
        </div>
        <span className="badge badge-success">{order.status}</span>
      </div>

      <div className="order-card-products">
        {order.products.map((p) => (
          <div key={p.product} className="order-card-product">
            <img src={p.image} alt={p.name} />
            <span>{p.name} × {p.quantity}</span>
          </div>
        ))}
      </div>

      <div className="order-card-footer">
        <span>Total: <strong>₹{order.totalAmount}</strong></span>
        <span>Payment: {order.paymentStatus}</span>
        <Link to={`/track-order?id=${order.orderId}`} className="btn btn-outline">
          Track Order
        </Link>
      </div>
    </div>
  );
}
