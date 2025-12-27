import { useState } from "react";

export default function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h1>{showSignup ? "Signup Form" : "Login Form"}</h1>
        <button onClick={() => setShowSignup(!showSignup)}>
          {showSignup ? "Back to Login" : "Go to Signup"}
        </button>
        <button onClick={() => setUser({ name: "Test User" })}>
          Simulate Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Dashboard</h1>
      <p>Welcome, {user.name}!</p>
      <button onClick={() => setUser(null)}>Logout</button>
    </div>
  );
}
