import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

const EMPTY_FORM = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pinCode: "",
};

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);
  const [apiError, setApiError] = useState("");

  const shipping = subtotal >= 500 ? 0 : 49;
  const total = subtotal + shipping;

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email address.";
    if (!/^\d{10}$/.test(form.phone)) errs.phone = "Enter a valid 10-digit phone number.";
    if (!form.address.trim()) errs.address = "Address is required.";
    if (!form.city.trim()) errs.city = "City is required.";
    if (!form.state.trim()) errs.state = "State is required.";
    if (!/^\d{6}$/.test(form.pinCode)) errs.pinCode = "Enter a valid 6-digit PIN code.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/account");
      return;
    }
    if (!validate()) return;

    setPlacing(true);
    setApiError("");
    try {
      const order = await api.post("/api/orders", {
        products: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        shippingAddress: form,
      });
      clearCart();
      navigate(`/order-confirmation?id=${order.orderId}`);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container section empty-state">
        <p>Your cart is empty, so there's nothing to check out.</p>
        <Link to="/shop" className="btn btn-primary">Go to Shop</Link>
      </div>
    );
  }

  return (
    <div className="container section">
      <h1 className="section-title">Checkout</h1>

      <div className="checkout-layout">
        <form className="card checkout-form" onSubmit={handleSubmit}>
          <h3>Shipping Details</h3>

          {apiError && <p className="form-error">{apiError}</p>}

          {[
            ["fullName", "Full Name", "text"],
            ["email", "Email", "email"],
            ["phone", "Phone Number", "tel"],
            ["address", "Address", "text"],
            ["city", "City", "text"],
            ["state", "State", "text"],
            ["pinCode", "PIN Code", "text"],
          ].map(([name, label, type]) => (
            <div className="form-group" key={name}>
              <label htmlFor={name}>{label}</label>
              <input
                id={name}
                name={name}
                type={type}
                className="form-input"
                value={form[name]}
                onChange={handleChange}
              />
              {errors[name] && <p className="form-error">{errors[name]}</p>}
            </div>
          ))}

          <button className="btn btn-primary btn-block" type="submit" disabled={placing}>
            {placing ? "Placing Order..." : `Place Order — ₹${total}`}
          </button>
        </form>

        <div className="card cart-summary">
          <h3>Order Summary</h3>
          {items.map((item) => (
            <div key={item.productId} className="cart-summary-row">
              <span>{item.name} × {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="cart-summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
          </div>
          <div className="cart-summary-row total">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
