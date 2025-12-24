import { signup } from "../utils/api";

export default function Signup({ onBack }) {
  const handleSignup = async () => {
    await signup();
    alert("Payment instructions sent. Wait for admin approval.");
    onBack();
  };

  return (
    <div className="card">
      <h2>Sign Up</h2>
      <p>Pay manually, then wait for admin approval.</p>
      <button onClick={handleSignup}>Submit</button>
      <p onClick={onBack} className="link">Back to login</p>
    </div>
  );
}
