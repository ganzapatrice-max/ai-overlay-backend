import { useState } from "react";
import Login from "../components/Login.jsx";
import Signup from "../components/Signup.jsx";
import Dashboard from "../components/AdminDashboard.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  if (!user) {
    return showSignup ? (
      <Signup onBack={() => setShowSignup(false)} />
    ) : (
      <Login
        onLogin={setUser}
        onSignup={() => setShowSignup(true)}
      />
    );
  }

  return <Dashboard user={user} onLogout={() => setUser(null)} />;
}
