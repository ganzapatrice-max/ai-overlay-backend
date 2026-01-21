import { useState } from "react";
import { login } from "../utils/api";

export default function Login({ onLogin, onSignup, onAdminLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Please fill all fields");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await login({ email, password });
      const { token, user } = res.data;

      if (!user.active) {
        setMessage("Account not activated by admin");
        return;
      }

      // Save token
      localStorage.setItem("token", token);
      localStorage.setItem("isAdmin", user.isAdmin);

      // Route based on role
      if (user.isAdmin) {
        onAdminLogin(token);   // Go to Admin Dashboard
      } else {
        onLogin(token);        // Go to normal user dashboard
      }

    } catch (err) {
      console.error("Login error:", err);
      setMessage(
        err.response?.data?.message ||
        err.message ||
        "Login failed. Check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      {message && (
        <p style={{ marginTop: 10, color: "#ff7070", fontWeight: "bold" }}>
          {message}
        </p>
      )}

      <p onClick={onSignup} style={{ cursor: "pointer", marginTop: 10 }}>
        Create account
      </p>
    </div>
  );
}
