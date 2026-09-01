import { useEffect, useState } from "react";
import { api } from "../services/api";
import OrderCard from "../components/OrderCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("loading");

  const loadOrders = async () => {
    setStatus("loading");
    try {
      const data = await api.get("/api/orders");
      setOrders(data);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="container section">
      <h1 className="section-title">Order History</h1>

      {status === "loading" && <LoadingSpinner label="Loading your orders..." />}
      {status === "error" && <ErrorMessage message="Couldn't load your orders." onRetry={loadOrders} />}
      {status === "ready" && orders.length === 0 && (
        <div className="empty-state">
          <p>You haven't placed any orders yet.</p>
        </div>
      )}
      {status === "ready" && orders.length > 0 && (
        <div className="order-list">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
