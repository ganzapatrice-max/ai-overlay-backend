import { useState } from "react";
import { signup } from "../utils/api";

export default function Signup({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await signup({ email, password });
      console.log("Signup response:", res);
      setMessage(res.data?.message || "Signup successful");
    } catch (err) {
      console.error("Signup error:", err);
      setMessage(
        err.response?.data?.message || err.message || "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Sign Up</h2>

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

      <button onClick={handleSignup} disabled={loading}>
        {loading ? "Submitting..." : "Sign Up"}
      </button>

      {message && (
        <p style={{ marginTop: 10, color: "#ff7070" }}>{message}</p>
      )}

      <p onClick={onLogin} style={{ cursor: "pointer", marginTop: 10 }}>
        Back to login
      </p>
    </div>
  );
}
