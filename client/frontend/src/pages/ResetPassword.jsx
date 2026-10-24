import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../services/api";
import "./resetpassword.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Validate and submit the new password.
  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // Send the reset token and new password to the backend.
      const data = await resetPassword(token, newPassword);

      setMessage(data.message);

      setNewPassword("");
      setConfirmPassword("");

      // Redirect to login after successful reset.
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setError(error.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-card">
        <div className="reset-password-icon">
          🔑
        </div>

        <h1>Reset Password</h1>

        <p className="reset-password-description">
          Create a new password for your Smart Voice Manager account.
        </p>

        {message && (
          <div className="reset-success-message">
            ✓ {message}
            <br />
            <span>Redirecting you to login...</span>
          </div>
        )}

        {error && (
          <div className="reset-error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="reset-input-group">
            <label htmlFor="newPassword">
              New Password
            </label>

            <input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(event) =>
                setNewPassword(event.target.value)
              }
              disabled={loading}
            />
          </div>

          <div className="reset-input-group">
            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="reset-submit-button"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;