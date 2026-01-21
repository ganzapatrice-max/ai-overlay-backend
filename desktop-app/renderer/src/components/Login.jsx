import { useState } from "react";
import { login } from "../utils/api";

export default function Login({ onLogin, onSignup }) {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    if (!phone || !email || !password) {
      setMessage("Phone, Email and Password are required ❌");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await login({ phone, email, password });
      const { token, user } = res.data;

      if (!user.active) {
        setMessage("Account not activated by admin ⏳");
        return;
      }

      localStorage.setItem("token", token);
      onLogin(token);
    } catch (err) {
      console.error("Login error:", err);
      setMessage(
        err.response?.data?.message ||
        "Login failed. Check your phone, email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>

      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

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

      <p
        onClick={onSignup}
        style={{ cursor: "pointer", marginTop: 10, color: "#7aa2ff" }}
      >
        Create account
      </p>
    </div>
  );
}
