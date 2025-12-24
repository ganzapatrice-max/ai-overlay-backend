import { login } from "../utils/api";

export default function Login({ onLogin, onSignup }) {
  const handleLogin = async () => {
    const user = await login();
    if (user.active) onLogin(user);
    else alert("Account not activated by admin");
  };

  return (
    <div className="card">
      <h2>Login</h2>
      <button onClick={handleLogin}>Login</button>
      <p onClick={onSignup} className="link">Create account</p>
    </div>
  );
}
