import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

// Wraps a page and only renders it for logged-in users.
// If sellerOnly is set, buyers are redirected away too.
export default function ProtectedRoute({ children, sellerOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner label="Checking your session..." />;

  if (!user) {
    return (
      <div className="empty-state">
        <p>Please log in to view this page.</p>
        <a className="btn btn-primary" href={sellerOnly ? "/seller/login" : "/account"}>
          Go to Login
        </a>
      </div>
    );
  }

  if (sellerOnly && user.role !== "seller") {
    return <Navigate to="/" replace />;
  }

  return children;
}
