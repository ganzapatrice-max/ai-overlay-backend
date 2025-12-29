import { useEffect, useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";
import AdminDashboard from "../components/AdminDashboard";
import Chat from "../components/Chat";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAdmin, setIsAdmin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    if (!token) return;
    const payload = JSON.parse(atob(token.split(".")[1]));
    setIsAdmin(payload.role === "admin");
  }, [token]);

  function handleLogin(token) {
    localStorage.setItem("token", token);
    setToken(token);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
  }

  if (!token) {
    return (
      <div className="app-container">
        {showSignup ? (
          <>
            <Signup onSuccess={() => setShowSignup(false)} />
            <button onClick={() => setShowSignup(false)}>
              Back to Login
            </button>
          </>
        ) : (
          <>
            <Login onLogin={handleLogin} />
            <button onClick={() => setShowSignup(true)}>
              Go to Signup
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="app-container">
      <button onClick={logout}>Logout</button>
      {isAdmin ? <AdminDashboard /> : <Chat />}
    </div>
  );
}
