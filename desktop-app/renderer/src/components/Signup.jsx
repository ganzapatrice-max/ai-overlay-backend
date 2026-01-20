import { useState } from "react";
import API from "../utils/api";

export default function Signup() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setError("");

    if (!phone || !email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await API.post("/auth/signup", {
        phone,
        email,
        password,
      });

      alert("Signup successful! Wait for admin approval.");

      // Optional: clear form
      setPhone("");
      setEmail("");
      setPassword("");

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSignup} className="auth-form">
      <h2>Sign Up</h2>

      {error && (
        <div className="error-box">
          {error}
        </div>
      )}

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

      <button type="submit" disabled={loading}>
        {loading ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  );
}
