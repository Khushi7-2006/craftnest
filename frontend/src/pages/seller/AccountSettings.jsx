import { useEffect, useState } from "react";
import { api } from "../../services/api";

function AccountSettings() {
  const [sellerId, setSellerId] = useState("");
  const [newSellerId, setNewSellerId] = useState("");
  const [newSellerPassword, setNewSellerPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

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

  const updateSellerCredentials = async ({
    sellerId,
    sellerPassword,
    successMessage,
  }) => {
    const data = await api.put(
      "/api/auth/seller/settings",
      {
        sellerId,
        sellerPassword,
      }
    );

    setSellerId(data.sellerId);
    setMessage(successMessage);
  };

  const handleChangeSellerId = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!newSellerId.trim()) {
      setError("Seller ID cannot be empty.");
      return;
    }

    try {
      setSavingId(true);

      await updateSellerCredentials({
        sellerId: newSellerId.trim(),
        sellerPassword: newSellerPassword.trim() || "KEEP_CURRENT",
        successMessage: "Seller ID updated successfully.",
      });
    } catch (err) {
      setError(
        err?.message || "Failed to update Seller ID."
      );
    } finally {
      setSavingId(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!newSellerPassword.trim()) {
      setError("Seller password cannot be empty.");
      return;
    }

    try {
      setSavingPassword(true);

      await updateSellerCredentials({
        sellerId: newSellerId.trim(),
        sellerPassword: newSellerPassword.trim(),
        successMessage: "Seller password updated successfully.",
      });

      setNewSellerPassword("");
    } catch (err) {
      setError(
        err?.message || "Failed to update Seller password."
      );
    } finally {
      setSavingPassword(false);
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

          <button type="submit" disabled={savingId}>
            {savingId ? "Updating..." : "Change Seller ID"}
          </button>
        </form>

        <br />

        <form onSubmit={handleChangePassword}>
          <label htmlFor="sellerPassword">
            Change Seller Password
          </label>

          <input
            id="sellerPassword"
            type="password"
            value={newSellerPassword}
            onChange={(e) =>
              setNewSellerPassword(e.target.value)
            }
            placeholder="Enter new Seller Password"
          />

          <button type="submit" disabled={savingPassword}>
            {savingPassword
              ? "Updating..."
              : "Change Seller Password"}
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
