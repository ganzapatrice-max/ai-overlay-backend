const API = "http://localhost:5000";

export async function login(data) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function signup(data) {
  const res = await fetch(`${API}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function getUsers(token) {
  const res = await fetch(`${API}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function updateUser(id, updates, token) {
  const res = await fetch(`${API}/admin/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(updates)
  });
  return res.json();
}
