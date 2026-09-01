import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import OrderTracker from "../components/OrderTracker";
import LoadingSpinner from "../components/LoadingSpinner";

export default function TrackOrder() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orderIdInput, setOrderIdInput] = useState(searchParams.get("id") || "");
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("idle");

  const trackOrder = async (id) => {
    if (!id) return;
    setStatus("loading");
    try {
      const data = await api.get(`/api/orders/${id}`);
      setOrder(data);
      setStatus("ready");
    } catch (err) {
      setOrder(null);
      setStatus("error");
    }
  };

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) trackOrder(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ id: orderIdInput });
    trackOrder(orderIdInput);
  };

  return (
    <div className="container section">
      <h1 className="section-title">Track Your Order</h1>

      <form className="track-order-form" onSubmit={handleSubmit}>
        <input
          className="form-input"
          placeholder="Enter your Order ID (e.g. CN-8F3K2Q)"
          value={orderIdInput}
          onChange={(e) => setOrderIdInput(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">Track</button>
      </form>

      {status === "loading" && <LoadingSpinner label="Looking up your order..." />}
      {status === "error" && (
        <div className="empty-state">
          <p>Invalid Order ID. Please check and try again.</p>
        </div>
      )}

      {status === "ready" && order && (
        <div className="card track-order-result">
          <div className="track-order-header">
            <div>
              <h3>Order #{order.orderId}</h3>
              <p>Placed on {new Date(order.orderDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p>Expected Delivery</p>
              <strong>{new Date(order.expectedDelivery).toLocaleDateString()}</strong>
            </div>
          </div>

          <OrderTracker status={order.status} />

          <div className="order-card-products">
            {order.products.map((p) => (
              <div key={p.product} className="order-card-product">
                <img src={p.image} alt={p.name} />
                <span>{p.name} × {p.quantity}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
