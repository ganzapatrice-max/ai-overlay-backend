import { useState } from "react";
import { signup } from "../utils/api";

export default function Signup({ onBack }) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !phone || !password) {
      setMessage("Phone and password are required ❌");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await signup({ email, phone, password });
      setMessage("Account created. Wait for admin approval ⏳");
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Signup failed. Try again."
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
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleSignup} disabled={loading}>
        {loading ? "Creating..." : "Sign Up"}
      </button>

      {message && (
        <p style={{ color: "#ff7070", marginTop: 10 }}>{message}</p>
      )}

      {/* THIS is the Back to Login */}
      <p
        onClick={onBack}
        style={{
          cursor: "pointer",
          marginTop: 12,
          color: "#7aa2ff",
          textAlign: "center",
        }}
      >
        Back to login
      </p>
    </div>
  );
}
