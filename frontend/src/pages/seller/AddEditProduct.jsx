import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  category: "DIY Journals",
  image: "",
  stock: "",
  rating: "4.5",
};

const CATEGORIES = [
  "DIY Journals", "Scrapbooking Kits", "Sticker Packs", "Washi Tapes",
  "Handmade Notebooks", "Decorative Papers", "Art & Craft Kits",
  "Gift Stationery", "DIY Cards", "Bookmark Kits",
];

export default function AddEditProduct() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (!isEditing) return;
    (async () => {
      try {
        const data = await api.get(`/api/products/${id}`);
        setForm({
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          image: data.image,
          stock: data.stock,
          rating: data.rating,
        });
      } catch (err) {
        setApiError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEditing]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Product name is required.";
    if (!form.description.trim()) errs.description = "Description is required.";
    if (!form.price || Number(form.price) <= 0) errs.price = "Enter a valid price.";
    if (!form.image.trim()) errs.image = "Image URL is required.";
    if (form.stock === "" || Number(form.stock) < 0) errs.stock = "Enter a valid stock quantity.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setApiError("");
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      rating: Number(form.rating),
    };

    try {
      if (isEditing) {
        await api.put(`/api/products/${id}`, payload);
      } else {
        await api.post("/api/products", payload);
      }
      navigate("/seller/products");
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading product..." />;

  return (
    <div>
      <h1 className="section-title">{isEditing ? "Edit Product" : "Add Product"}</h1>

      <form className="card product-form" onSubmit={handleSubmit}>
        {apiError && <p className="form-error">{apiError}</p>}

        <div className="form-group">
          <label>Product Name</label>
          <input className="form-input" name="name" value={form.name} onChange={handleChange} />
          {errors.name && <p className="form-error">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea className="form-textarea" name="description" rows="3" value={form.description} onChange={handleChange} />
          {errors.description && <p className="form-error">{errors.description}</p>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price (₹)</label>
            <input className="form-input" type="number" name="price" value={form.price} onChange={handleChange} />
            {errors.price && <p className="form-error">{errors.price}</p>}
          </div>
          <div className="form-group">
            <label>Stock</label>
            <input className="form-input" type="number" name="stock" value={form.stock} onChange={handleChange} />
            {errors.stock && <p className="form-error">{errors.stock}</p>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select className="form-select" name="category" value={form.category} onChange={handleChange}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Rating (0-5)</label>
            <input className="form-input" type="number" step="0.1" min="0" max="5" name="rating" value={form.rating} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input className="form-input" name="image" value={form.image} onChange={handleChange} />
          {errors.image && <p className="form-error">{errors.image}</p>}
        </div>

        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? "Saving..." : isEditing ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
}
