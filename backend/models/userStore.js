const users = [];

module.exports = {
  users,

  create(user) {
    users.push(user);
    return user;
  },

  findByEmail(email) {
    return users.find(user => user.email === email);
  },

  findAll() {
    return users;
  },

  update(email, updates) {
    const user = users.find(user => user.email === email);
    if (!user) return null;

    Object.assign(user, updates);
    return user;
  }
};
