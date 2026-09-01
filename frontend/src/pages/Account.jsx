import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "./Login";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Account() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) return <LoadingSpinner label="Loading your account..." />;
  if (!user) return <Login />;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="container section">
      <h1 className="section-title">My Account</h1>
      <div className="card account-card">
        <div>
          <h3>{user.role === "seller" ? "Seller Account" : user.phone}</h3>
          <span className="badge badge-success">{user.role === "seller" ? "Seller" : "Buyer"}</span>
        </div>
        <div className="account-actions">
          <a href="/orders" className="btn btn-outline">Order History</a>
          {user.role === "seller" && (
            <a href="/seller" className="btn btn-outline">Seller Dashboard</a>
          )}
          <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
}
