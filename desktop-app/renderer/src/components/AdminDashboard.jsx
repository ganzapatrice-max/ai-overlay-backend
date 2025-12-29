import { useEffect, useState } from "react";
import {
  getUsers,
  approveUser,
  deactivateUser,
  deleteUser,
} from "../utils/api";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  async function loadUsers() {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      setError("Failed to load users");
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Email</th>
            <th>Paid</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.email}</td>
              <td>{String(u.paid)}</td>
              <td>{String(u.active)}</td>
              <td>
                {!u.active && (
                  <button onClick={() => approveUser(u._id).then(loadUsers)}>
                    Approve
                  </button>
                )}
                {u.active && (
                  <button onClick={() => deactivateUser(u._id).then(loadUsers)}>
                    Deactivate
                  </button>
                )}
                <button
                  onClick={() => deleteUser(u._id).then(loadUsers)}
                  style={{ color: "red" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
