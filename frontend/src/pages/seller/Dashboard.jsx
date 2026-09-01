import { useEffect, useState } from "react";
import { api } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState("loading");

  const loadStats = async () => {
    setStatus("loading");
    try {
      const [products, orders] = await Promise.all([
        api.get("/api/products"),
        api.get("/api/orders"),
      ]);

      const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
      const customers = new Set(orders.map((o) => o.user?._id || o.user)).size;
      const lowStock = products.filter((p) => p.stock <= 5);

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalCustomers: customers,
        totalSales,
        lowStock,
      });
      setStatus("ready");
    } catch (err) {
      setStatus("error");
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (status === "loading") return <LoadingSpinner label="Loading dashboard..." />;
  if (status === "error") return <ErrorMessage message="Couldn't load dashboard data." onRetry={loadStats} />;

  return (
    <div>
      <h1 className="section-title">Seller Dashboard</h1>

      <div className="stats-grid">
        <div className="card stat-card">
          <p>Total Products</p>
          <h2>{stats.totalProducts}</h2>
        </div>
        <div className="card stat-card">
          <p>Total Orders</p>
          <h2>{stats.totalOrders}</h2>
        </div>
        <div className="card stat-card">
          <p>Total Customers</p>
          <h2>{stats.totalCustomers}</h2>
        </div>
        <div className="card stat-card">
          <p>Total Sales</p>
          <h2>₹{stats.totalSales}</h2>
        </div>
      </div>

      <div className="card">
        <h3>Low Stock Products</h3>
        {stats.lowStock.length === 0 ? (
          <p>All products are well stocked.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Product</th><th>Stock</th></tr>
              </thead>
              <tbody>
                {stats.lowStock.map((p) => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td><span className="badge badge-danger">{p.stock} left</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
