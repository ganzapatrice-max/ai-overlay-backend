import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    try {
      await axios.post("/api/auth/register", {
        phone,
        password,
      });
      alert("Registered successfully. Wait for admin approval.");
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Register</h1>
      <input
        className="border p-2 w-full mb-2"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="bg-black text-white px-4 py-2" onClick={submit}>
        Register
      </button>
    </div>
  );
}
