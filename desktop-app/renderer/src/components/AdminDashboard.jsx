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

  async function handleApprove(id) {
    await approveUser(id);
    loadUsers();
  }

  async function handleDeactivate(id) {
    await deactivateUser(id);
    loadUsers();
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this user?")) return;
    await deleteUser(id);
    loadUsers();
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table border="1" cellPadding="6">
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
                  <button onClick={() => handleApprove(u._id)}>
                    Approve
                  </button>
                )}

                {u.active && (
                  <button onClick={() => handleDeactivate(u._id)}>
                    Deactivate
                  </button>
                )}

                <button onClick={() => handleDelete(u._id)}>
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
