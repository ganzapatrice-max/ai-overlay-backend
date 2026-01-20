import { useState } from "react";
import API from "../utils/api";

export default function Signup() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSignup(e) {
    e.preventDefault();
    try {
      await API.post("/auth/signup", {
        phone,
        email,
        password,
      });
      alert("Signup successful! Wait for admin approval.");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  }

  return (
    <form onSubmit={handleSignup}>
      <h2>Sign Up</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">Sign Up</button>
    </form>
  );
}
