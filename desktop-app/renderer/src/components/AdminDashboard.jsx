import { useEffect, useState } from "react";
import { getUsers, updateUser } from "../utils/api";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    getUsers(token).then(setUsers);
  }, []);

  const toggle = (id, field, value) => {
    updateUser(id, { [field]: value }, token).then(() =>
      setUsers(u =>
        u.map(x => (x.id === id ? { ...x, [field]: value } : x))
      )
    );
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {users.map(u => (
        <div key={u.id}>
          {u.email}
          <button onClick={() => toggle(u.id, "paid", !u.paid)}>
            Paid: {String(u.paid)}
          </button>
          <button onClick={() => toggle(u.id, "active", !u.active)}>
            Active: {String(u.active)}
          </button>
        </div>
      ))}
    </div>
  );
}
