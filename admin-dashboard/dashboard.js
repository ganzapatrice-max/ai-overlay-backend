const API_BASE = ''; // if served from same server set path; or set full URL like: http://localhost:4000

function getAdminKey() {
  return document.getElementById('adminKey').value.trim();
}

async function fetchUsers() {
  const key = getAdminKey();
  if (!key) return alert('Enter admin key in the field above');
  const res = await fetch(API_BASE + '/api/admin/users', {
    headers: { 'x-admin-key': key }
  });
  if (!res.ok) {
    const txt = await res.text();
    alert('Failed to fetch: ' + res.status + ' ' + txt);
    return;
  }
  const data = await res.json();
  renderUsers(data.users || []);
}

function renderUsers(users) {
  const container = document.getElementById('users');
  container.innerHTML = '';
  if (!users.length) {
    container.innerHTML = '<p>No users yet.</p>';
    return;
  }
  users.forEach((u) => {
    const div = document.createElement('div');
    div.className = 'user';
    const info = document.createElement('div');
    info.className = 'info';
    info.innerHTML = `<strong>${u.phone}</strong> ${u.email ? '- ' + u.email : ''} <br/>
      <small>Created: ${new Date(u.createdAt).toLocaleString()}</small>
      <span class="badge ${u.paid ? 'paid' : 'not-paid'}">${u.paid ? 'PAID' : 'NOT PAID'}</span>
      <span class="badge ${u.active ? 'active' : 'inactive'}">${u.active ? 'ACTIVE' : 'INACTIVE'}</span>
    `;
    const actions = document.createElement('div');
    actions.className = 'actions';
    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = 'Confirm Payment';
    confirmBtn.onclick = () => confirmPayment(u._id);
    const deactivateBtn = document.createElement('button');
    deactivateBtn.textContent = 'Deactivate';
    deactivateBtn.onclick = () => deactivateUser(u._id);
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteUser(u._id);
    actions.appendChild(confirmBtn);
    actions.appendChild(deactivateBtn);
    actions.appendChild(deleteBtn);

    div.appendChild(info);
    div.appendChild(actions);
    container.appendChild(div);
  });
}

async function confirmPayment(userId) {
  const key = getAdminKey();
  const res = await fetch(API_BASE + `/api/admin/users/${userId}/confirm-payment`, {
    method: 'POST',
    headers: { 'x-admin-key': key }
  });
  if (!res.ok) {
    const txt = await res.text();
    alert('Confirm failed: ' + res.status + ' ' + txt);
    return;
  }
  alert('User confirmed');
  fetchUsers();
}

async function deactivateUser(userId) {
  const key = getAdminKey();
  const res = await fetch(API_BASE + `/api/admin/users/${userId}/deactivate`, {
    method: 'PATCH',
    headers: { 'x-admin-key': key }
  });
  if (!res.ok) {
    const txt = await res.text();
    alert('Deactivate failed: ' + res.status + ' ' + txt);
    return;
  }
  alert('User deactivated');
  fetchUsers();
}

async function deleteUser(userId) {
  if (!confirm('Delete user permanently?')) return;
  const key = getAdminKey();
  const res = await fetch(API_BASE + `/api/admin/users/${userId}`, {
    method: 'DELETE',
    headers: { 'x-admin-key': key }
  });
  if (!res.ok) {
    const txt = await res.text();
    alert('Delete failed: ' + res.status + ' ' + txt);
    return;
  }
  alert('User deleted');
  fetchUsers();
}

document.getElementById('refreshBtn').addEventListener('click', fetchUsers);
