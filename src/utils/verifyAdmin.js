// small helper if you prefer to programmatically check admin key
function verifyAdminKey(headerKey) {
  const ADMIN_KEY = process.env.ADMIN_KEY;
  if (!ADMIN_KEY) return false;
  return headerKey === ADMIN_KEY;
}

module.exports = { verifyAdminKey };
