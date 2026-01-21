import { useEffect, useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";
import AdminDashboard from "../components/AdminDashboard";
import Chat from "../components/Chat";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAdmin, setIsAdmin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  // Decode JWT and determine admin status
  useEffect(() => {
    if (!token) {
      setIsAdmin(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setIsAdmin(payload.isAdmin === true); // ✅ correct field
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      setToken(null);
      setIsAdmin(false);
    }
  }, [token]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsAdmin(false);
  };

  // If not logged in → show Login or Signup
  if (!token) {
    return showSignup ? (
      <Signup onBack={() => setShowSignup(false)} />
    ) : (
      <Login
        onLogin={(t) => {
          localStorage.setItem("token", t);
          setToken(t);
        }}
        onSignup={() => setShowSignup(true)}
      />
    );
  }

  // Logged in → show Admin Dashboard or Chat
  return (
    <div id="container">
      <button
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: 6,
          right: 8,
          padding: "4px 10px",
          background: "rgba(255,255,255,0.15)",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          fontSize: 12,
        }}
      >
        Logout
      </button>

      {isAdmin ? <AdminDashboard /> : <Chat />}
    </div>
  );
}
