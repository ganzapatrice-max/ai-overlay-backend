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
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadUsers() {
    try {
      setLoading(true);
      const res = await getUsers();
      setUsers(res.data);
      setError("");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("❌ Failed to load users. Make sure you are logged in as admin.");
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id) {
    try {
      await approveUser(id);
      setMessage("✅ User approved successfully");
      loadUsers();
    } catch (err) {
      setError("❌ Failed to approve user");
    }
  }

  async function handleDeactivate(id) {
    try {
      await deactivateUser(id);
      setMessage("⚠️ User deactivated");
      loadUsers();
    } catch (err) {
      setError("❌ Failed to deactivate user");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      await deleteUser(id);
      setMessage("🗑️ User deleted successfully");
      loadUsers();
    } catch (err) {
      setError("❌ Failed to delete user");
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>🛠 Admin Dashboard</h2>

      {loading && <p>Loading users...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      <table border="1" cellPadding="6" width="100%">
        <thead>
          <tr>
            <th>Email</th>
            <th>Paid</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 && !loading && (
            <tr>
              <td colSpan="4" align="center">
                No users found
              </td>
            </tr>
          )}

          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.email}</td>
              <td>{u.paid ? "Yes" : "No"}</td>
              <td>{u.active ? "Active" : "Inactive"}</td>
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

                <button
                  onClick={() => handleDelete(u._id)}
                  style={{ marginLeft: 5, color: "red" }}
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
