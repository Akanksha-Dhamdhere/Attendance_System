
import React, { useState } from "react";
import "./Login.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function TeacherLogin({ onBack, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login failed.");
      }

      if (!data.user || !["admin", "teacher"].includes(data.user.role)) {
        throw new Error("Admin or Teacher account required.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (typeof onLoginSuccess === "function") {
        onLoginSuccess(data.user, data.token);
      } else {
        setError("Login callback missing. Please check App.jsx.");
      }
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Backend is not running. Please start your backend."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <button className="back-button" type="button" onClick={onBack}>
        ← Back
      </button>

      <form className="login-card" onSubmit={handleLogin}>
        <div className="login-icon">🎓</div>

        <h2>Teacher Login</h2>
        <p className="login-subtitle">
          Sign in to manage college attendance
        </p>

        <label htmlFor="staff-email">Email Address</label>
        <input
          id="staff-email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          required
        />

        <label htmlFor="staff-password">Password</label>

        <div className="password-wrapper">
          <input
            id="staff-password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <button
            className="show-password"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {error && <p className="login-error">{error}</p>}

        <button
          className="login-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="login-footer">
          Authorized Admin and Teacher accounts only
        </p>
      </form>
    </div>
  );
}
