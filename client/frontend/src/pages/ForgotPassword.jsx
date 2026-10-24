import React, { useState } from "react";
import { forgotPassword } from "../services/api";
import "./forgotpassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    // Email is required before sending the reset request.
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      // Send the reset request to the backend.
      await forgotPassword(email);

      setMessage(
        "Password reset link has been sent to your email. Please check your inbox."
      );

      setEmail("");
    } catch (error) {
      setError(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        <div className="forgot-password-icon">🔐</div>

        <h1>Forgot Password?</h1>

        <p className="forgot-password-description">
          Enter your registered email address and we'll send you
          a link to reset your password.
        </p>

        {message && (
          <div className="forgot-success-message">
            ✓ {message}
          </div>
        )}

        {error && (
          <div className="forgot-error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="forgot-input-group">
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="forgot-submit-button"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <p className="forgot-check-email">
            Didn't receive the email? Please check your spam or
            junk folder.
          </p>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;