import { useCart } from "../context/CartContext";

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} className="cart-item-img" />
      <div className="cart-item-info">
        <h4>{item.name}</h4>
        <p className="cart-item-price">₹{item.price}</p>
      </div>
      <div className="cart-item-qty">
        <button
          className="btn btn-outline"
          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          −
        </button>
        <span>{item.quantity}</span>
        <button
          className="btn btn-outline"
          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
          disabled={item.quantity >= item.stock}
        >
          +
        </button>
      </div>
      <div className="cart-item-subtotal">₹{item.price * item.quantity}</div>
      <button className="cart-item-remove" onClick={() => removeFromCart(item.productId)} aria-label="Remove item">
        ✕
      </button>
    </div>
  );
}
