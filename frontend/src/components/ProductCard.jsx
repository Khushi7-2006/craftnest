import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const inStock = product.stock > 0;

  const handleBuyNow = () => {
    addToCart(product, 1);
    navigate("/cart");
  };

  return (
    <div className="card product-card">
      <Link to={`/product/${product._id}`}>
        <img src={product.image} alt={product.name} className="product-card-img" />
      </Link>
      <div className="product-card-body">
        <span className="product-card-category">{product.category}</span>
        <Link to={`/product/${product._id}`}>
          <h3 className="product-card-name">{product.name}</h3>
        </Link>
        <p className="product-card-desc">{product.description}</p>
        <div className="product-card-meta">
          <span className="product-card-price">₹{product.price}</span>
          <span className="product-card-rating">⭐ {product.rating}</span>
        </div>
        <span className={`badge ${inStock ? "badge-success" : "badge-danger"}`}>
          {inStock ? `In Stock (${product.stock})` : "Out of Stock"}
        </span>
        <div className="product-card-actions">
          <button className="btn btn-outline" disabled={!inStock} onClick={() => addToCart(product, 1)}>
            Add to Cart
          </button>
          <button className="btn btn-primary" disabled={!inStock} onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
