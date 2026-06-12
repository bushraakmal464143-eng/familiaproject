const { createHmac } = require("crypto");

const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const SESSION_MAX_AGE_SEC = SESSION_MAX_AGE_MS / 1000;

const COOKIES = {
  customer: "customer_session",
  camping: "camping_session",
};

function getSecret() {
  return (
    process.env.ADMIN_SECRET ??
    process.env.ADMIN_PASSWORD ??
    "cambiar-en-produccion"
  );
}

function sign(payload) {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

function createRoleToken(role, subjectId) {
  const expires = Date.now() + SESSION_MAX_AGE_MS;
  const payload = `${role}:${subjectId}:${expires}`;
  return `${payload}.${sign(payload)}`;
}

function setRoleCookie(res, role, subjectId) {
  const token = createRoleToken(role, subjectId);
  res.cookie(COOKIES[role], token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC * 1000,
  });
}

function clearRoleCookie(res, role) {
  res.clearCookie(COOKIES[role], { path: "/" });
}

module.exports = { setRoleCookie, clearRoleCookie, COOKIES };
