import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "All";
  const sort = searchParams.get("sort") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  const loadProducts = async () => {
    setStatus("loading");
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category && category !== "All") params.set("category", category);
      if (sort) params.set("sort", sort);
      if (maxPrice) params.set("maxPrice", maxPrice);

      const data = await api.get(`/api/products?${params.toString()}`);
      setProducts(data);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, sort, maxPrice]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  return (
    <div className="container section">
      <h1 className="section-title">Shop DIY Stationery</h1>

      <div className="shop-toolbar">
        <SearchBar initialValue={search} onSearch={(val) => updateParam("search", val)} />
        <CategoryFilter value={category} onChange={(val) => updateParam("category", val)} />
        <select className="form-select" value={sort} onChange={(e) => updateParam("sort", e.target.value)}>
          <option value="">Sort: Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="popularity">Popularity</option>
        </select>
        <select className="form-select" value={maxPrice} onChange={(e) => updateParam("maxPrice", e.target.value)}>
          <option value="">Any Price</option>
          <option value="200">Under ₹200</option>
          <option value="500">Under ₹500</option>
          <option value="1000">Under ₹1000</option>
        </select>
      </div>

      {status === "loading" && <LoadingSpinner label="Loading products..." />}
      {status === "error" && <ErrorMessage message="Couldn't load products." onRetry={loadProducts} />}
      {status === "ready" && products.length === 0 && (
        <div className="empty-state">
          <p>No products found. Try another search.</p>
        </div>
      )}
      {status === "ready" && products.length > 0 && (
        <div className="grid grid-products">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
