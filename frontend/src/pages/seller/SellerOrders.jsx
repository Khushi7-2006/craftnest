import { useEffect, useState } from "react";
import { api } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";

const STATUSES = ["Order Placed", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"];

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("loading");
  const [updatingId, setUpdatingId] = useState(null);

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

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const updated = await api.put(`/api/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (status === "loading") return <LoadingSpinner label="Loading orders..." />;
  if (status === "error") return <ErrorMessage message="Couldn't load orders." onRetry={loadOrders} />;

  return (
    <div>
      <h1 className="section-title">Customer Orders</h1>

      {orders.length === 0 ? (
        <div className="empty-state"><p>No orders yet.</p></div>
      ) : (
        <div className="table-wrap card">
          <table>
            <thead>
              <tr>
                <th>Order ID</th><th>Customer</th><th>Products</th><th>Total</th><th>Date</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>{o.orderId}</td>
                  <td>{o.user?.phone || "—"}</td>
                  <td>{o.products.map((p) => `${p.name} × ${p.quantity}`).join(", ")}</td>
                  <td>₹{o.totalAmount}</td>
                  <td>{new Date(o.orderDate).toLocaleDateString()}</td>
                  <td>
                    <select
                      className="form-select"
                      value={o.status}
                      disabled={updatingId === o._id}
                      onChange={(e) => handleStatusChange(o._id, e.target.value)}
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
