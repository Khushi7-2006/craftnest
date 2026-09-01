import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const CATEGORIES = [
  "DIY Journals",
  "Scrapbooking Kits",
  "Sticker Packs",
  "Washi Tapes",
  "Handmade Notebooks",
  "Decorative Papers",
  "Art & Craft Kits",
  "Gift Stationery",
  "DIY Cards",
  "Bookmark Kits",
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");

  const loadFeatured = async () => {
    setStatus("loading");
    try {
      const data = await api.get("/api/products?sort=popularity");
      setProducts(data.slice(0, 4));
      setStatus("ready");
    } catch (err) {
      setStatus("error");
    }
  };

  useEffect(() => {
    loadFeatured();
  }, []);

  return (
    <div>
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <h1>CraftNest</h1>
            <p className="hero-tagline">Create. Customize. Inspire.</p>
            <p className="hero-desc">
              Handpicked DIY stationery, scrapbooking kits, journals and craft supplies to bring
              your creative ideas to life.
            </p>
            <Link to="/shop" className="btn btn-primary btn-lg">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      <section className="section container">
        <h2 className="section-title">Popular Categories</h2>
        <p className="section-subtitle">Find exactly what your next project needs.</p>
        <div className="category-grid">
          {CATEGORIES.map((cat) => (
            <Link key={cat} to={`/shop?category=${encodeURIComponent(cat)}`} className="category-chip">
              {cat}
            </Link>
          ))}
        </div>
      </section>

      <section className="section container">
        <h2 className="section-title">Featured Products</h2>
        <p className="section-subtitle">Loved by our creative community.</p>

        {status === "loading" && <LoadingSpinner label="Loading featured products..." />}
        {status === "error" && <ErrorMessage message="Couldn't load featured products." onRetry={loadFeatured} />}
        {status === "ready" && (
          <div className="grid grid-products">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className="section why-us">
        <div className="container">
          <h2 className="section-title">Why Choose CraftNest?</h2>
          <div className="why-us-grid">
            <div className="card why-us-item">
              <h3>Handpicked Quality</h3>
              <p>Every kit is curated for durability and everyday creativity.</p>
            </div>
            <div className="card why-us-item">
              <h3>Fast Delivery</h3>
              <p>Track every order from placement to your doorstep.</p>
            </div>
            <div className="card why-us-item">
              <h3>Beginner Friendly</h3>
              <p>Clear instructions and beginner-safe materials in every kit.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section cta">
        <div className="container cta-inner">
          <h2>Ready to start your next DIY project?</h2>
          <Link to="/shop" className="btn btn-secondary btn-lg">
            Browse the Shop
          </Link>
        </div>
      </section>
    </div>
  );
}
