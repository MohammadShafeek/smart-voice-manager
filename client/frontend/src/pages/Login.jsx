import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import Logo from "../assets/logo.png";
import Navbar from "../components/Navbar";
import "./login.css";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      // Send login details to the backend.
      const data = await loginUser({
        email,
        password,
      });

      // Save the logged-in user and token in AuthContext.
      login(data.user, data.token);

      navigate("/dashboard");
    } catch (error) {
      setError(error.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Navbar />

      <div className="wave wave-one"></div>
      <div className="wave wave-two"></div>
      <div className="wave wave-three"></div>

      <div className="login-card">
        <div className="login-brand">
          <div className="login-logo-box">
            <img
              src={Logo}
              alt="Smart Voice Manager"
              className="login-logo"
            />
          </div>

          <h1>Welcome Back</h1>

          <p>
            Log in to your Smart Voice Manager account
          </p>
        </div>

        {error && (
          <div className="login-error-message">
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-field">
            <label htmlFor="login-email">Email</label>

            <div className="input-box">
              <Mail size={22} />

              <input
                id="login-email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                }}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="login-password">Password</label>

            <div className="input-box">
              <Lock size={22} />

              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                disabled={loading}
              />

              {/* Toggle between password and plain text. */}
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff size={21} />
                ) : (
                  <Eye size={21} />
                )}
              </button>
            </div>
          </div>

          <div className="forgot-password">
            <NavLink to="/forgot-password">
              Forgot Password?
            </NavLink>
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            <span>
              {loading ? "Logging in..." : "Login"}
            </span>

            {!loading && <ArrowRight size={23} />}
          </button>
        </form>

        <div className="or-divider">
          <span></span>
          <p>OR</p>
          <span></span>
        </div>

        <p className="login-text">
          Don't have an account?

          <NavLink to="/signup">
            Sign Up
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Login;