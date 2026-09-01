const STEPS = ["Order Placed", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"];

export default function OrderTracker({ status }) {
  const currentIndex = STEPS.indexOf(status);

  return (
    <div className="order-tracker">
      {STEPS.map((step, index) => (
        <div key={step} className={`tracker-step ${index <= currentIndex ? "done" : ""}`}>
          <div className="tracker-dot" />
          <span className="tracker-label">{step}</span>
          {index < STEPS.length - 1 && <div className="tracker-line" />}
        </div>
      ))}
    </div>
  );
}
