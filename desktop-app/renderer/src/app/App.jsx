import { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";

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
