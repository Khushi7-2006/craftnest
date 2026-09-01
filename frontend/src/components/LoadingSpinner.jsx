export default function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="empty-state" role="status">
      <div className="spinner" />
      <p>{label}</p>
    </div>
  );
}
