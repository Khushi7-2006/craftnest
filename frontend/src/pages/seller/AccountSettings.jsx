import { useEffect, useState } from "react";
import { api } from "../../services/api";

function AccountSettings() {
  const [sellerId, setSellerId] = useState("");
  const [newSellerId, setNewSellerId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSellerSettings = async () => {
      try {
        const data = await api.get("/api/auth/seller/settings");

        setSellerId(data.sellerId || "");
        setNewSellerId(data.sellerId || "");
      } catch (err) {
        setError(
          err?.message || "Failed to load seller settings."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSellerSettings();
  }, []);

  const handleChangeSellerId = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!newSellerId.trim()) {
      setError("Seller ID cannot be empty.");
      return;
    }

    try {
      setSaving(true);

      const data = await api.put(
        "/api/auth/seller/settings",
        {
          sellerId: newSellerId.trim(),
        }
      );

      setSellerId(data.sellerId);
      setNewSellerId(data.sellerId);
      setMessage("Seller ID updated successfully.");
    } catch (err) {
      setError(
        err?.message || "Failed to update Seller ID."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Loading account settings...</p>;
  }

  return (
    <div className="page-container">
      <h1>Account Settings</h1>

      <div className="settings-card">
        <h2>Seller Account</h2>

        <p>
          <strong>Current Seller ID:</strong>{" "}
          {sellerId || "Not available"}
        </p>

        <form onSubmit={handleChangeSellerId}>
          <label htmlFor="sellerId">
            Change Seller ID
          </label>

          <input
            id="sellerId"
            type="text"
            value={newSellerId}
            onChange={(e) => setNewSellerId(e.target.value)}
            placeholder="Enter new Seller ID"
          />

          <button type="submit" disabled={saving}>
            {saving ? "Updating..." : "Change Seller ID"}
          </button>
        </form>

        {message && (
          <p className="success-message">{message}</p>
        )}

        {error && (
          <p className="error-message">{error}</p>
        )}
      </div>
    </div>
  );
}

export default AccountSettings;
