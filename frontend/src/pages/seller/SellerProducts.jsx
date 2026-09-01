import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");

  const loadProducts = async () => {
    setStatus("loading");
    try {
      const data = await api.get("/api/products");
      setProducts(data);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    try {
      await api.delete(`/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (status === "loading") return <LoadingSpinner label="Loading products..." />;
  if (status === "error") return <ErrorMessage message="Couldn't load products." onRetry={loadProducts} />;

  return (
    <div>
      <div className="seller-page-header">
        <h1 className="section-title">Manage Products</h1>
        <Link to="/seller/products/new" className="btn btn-primary">+ Add Product</Link>
      </div>

      {products.length === 0 ? (
        <div className="empty-state"><p>No products yet. Add your first product.</p></div>
      ) : (
        <div className="table-wrap card">
          <table>
            <thead>
              <tr>
                <th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td><img src={p.image} alt={p.name} className="table-thumb" /></td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>₹{p.price}</td>
                  <td>{p.stock}</td>
                  <td className="table-actions">
                    <Link to={`/seller/products/edit/${p._id}`} className="btn btn-outline">Edit</Link>
                    <button className="btn btn-danger" onClick={() => handleDelete(p._id)}>Delete</button>
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
