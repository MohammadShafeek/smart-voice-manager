import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import Logo from "../assets/logo.png";
import Navbar from "../components/Navbar";
import { signupUser } from "../services/api";
import "./signup.css";

function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Validate the form and create a new account.
  const handleSignup = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    if (!password) {
      alert("Please enter a password.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const data = await signupUser({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      alert(data.message);

      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="signup-page">
      {/* Navbar */}
      <Navbar />

      {/* Background Waves */}
      <div className="wave wave-one"></div>
      <div className="wave wave-two"></div>
      <div className="wave wave-three"></div>

      {/* Signup Card */}
      <div className="signup-card">
        {/* Brand / Logo */}
        <div className="signup-brand">
          <div className="signup-logo-box">
            <img
              src={Logo}
              alt="Smart Voice Manager"
              className="signup-logo"
            />
          </div>

          <h1>Create Account</h1>

          <p>
            Start managing your voice notes
          </p>
        </div>

        {/* Signup Form */}
        <form className="signup-form" onSubmit={handleSignup}>
          {/* Full Name */}
          <div className="form-field">
            <label>Full Name</label>

            <div className="input-box">
              <User size={22} />

              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-field">
            <label>Email</label>

            <div className="input-box">
              <Mail size={22} />

              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-field">
            <label>Password</label>

            <div className="input-box">
              <Lock size={22} />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Create a password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? (
                  <EyeOff size={21} />
                ) : (
                  <Eye size={21} />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-field">
            <label>Confirm Password</label>

            <div className="input-box">
              <Lock size={22} />

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={21} />
                ) : (
                  <Eye size={21} />
                )}
              </button>
            </div>
          </div>

          {/* Create Account Button */}
          <button
            type="submit"
            className="create-account-btn"
          >
            <span>Create Account</span>
            <ArrowRight size={23} />
          </button>
        </form>

        {/* OR */}
        <div className="or-divider">
          <span></span>
          <p>OR</p>
          <span></span>
        </div>

        {/* Login */}
        <p className="login-text">
          Already have an account?

          <NavLink to="/login">
            Login
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Signup;