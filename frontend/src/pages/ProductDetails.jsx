import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useCart } from "../context/CartContext";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import ProductCard from "../components/ProductCard";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState("loading");

  const loadProduct = async () => {
    setStatus("loading");
    try {
      const data = await api.get(`/api/products/${id}`);
      setProduct(data);
      setQuantity(1);
      setStatus("ready");

      const relatedData = await api.get(`/api/products?category=${encodeURIComponent(data.category)}`);
      setRelated(relatedData.filter((p) => p._id !== data._id).slice(0, 4));
    } catch (err) {
      setStatus("error");
    }
  };

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (status === "loading") return <LoadingSpinner label="Loading product..." />;
  if (status === "error" || !product)
    return <ErrorMessage message="Product not found." onRetry={loadProduct} />;

  const inStock = product.stock > 0;

  return (
    <div className="container section">
      <div className="product-details">
        <img src={product.image} alt={product.name} className="product-details-img" />

        <div className="product-details-info">
          <span className="product-card-category">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="product-details-rating">⭐ {product.rating} rating</p>
          <p className="product-details-price">₹{product.price}</p>
          <p className="product-details-desc">{product.description}</p>

          <span className={`badge ${inStock ? "badge-success" : "badge-danger"}`}>
            {inStock ? `In Stock (${product.stock} available)` : "Out of Stock"}
          </span>

          {inStock && (
            <div className="qty-selector">
              <label>Quantity</label>
              <div>
                <button className="btn btn-outline" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
                <span>{quantity}</span>
                <button
                  className="btn btn-outline"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="product-details-actions">
            <button
              className="btn btn-outline"
              disabled={!inStock}
              onClick={() => addToCart(product, quantity)}
            >
              Add to Cart
            </button>
            <button
              className="btn btn-primary"
              disabled={!inStock}
              onClick={() => {
                addToCart(product, quantity);
                navigate("/cart");
              }}
            >
              Buy Now
            </button>
          </div>

          <div className="product-specs">
            <h4>Specifications</h4>
            <ul>
              <li>Category: {product.category}</li>
              <li>Rating: {product.rating} / 5</li>
              <li>Stock: {product.stock} units</li>
            </ul>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="section">
          <h2 className="section-title">Related Products</h2>
          <div className="grid grid-products">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
