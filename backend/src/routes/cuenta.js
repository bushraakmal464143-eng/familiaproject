const express = require("express");
const Customer = require("../models/Customer");
const { verifyAdminCredentials, getAdminEmail } = require("../utils/adminAuth");
const { setAdminCookie, clearAdminCookie } = require("../utils/adminSession");
const { hashPassword, verifyPassword } = require("../utils/password");
const { isStrongPassword, STRONG_PASSWORD_MESSAGE } = require("../utils/strongPassword");
const {
  setRoleCookie,
  clearRoleCookie,
  getCustomerIdFromRequest,
} = require("../utils/session");
const { syncCustomerToJson, generateCustomerId } = require("../utils/jsonSync");

const router = express.Router();

function stripCustomer(customer) {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    createdAt: customer.createdAt,
  };
}

router.post("/register", async (req, res) => {
  try {
    const name = (req.body.name ?? "").trim();
    const email = (req.body.email ?? "").trim().toLowerCase();
    const password = req.body.password ?? "";

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Nombre, email y contraseña son obligatorios." });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Email no válido." });
    }

    if (email === getAdminEmail()) {
      return res.status(400).json({ error: "Este email está reservado para administración." });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({ error: STRONG_PASSWORD_MESSAGE });
    }

    const existing = await Customer.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "Ya existe una cuenta con este email." });
    }

    const id = await generateCustomerId(Customer);
    const createdAt = new Date().toISOString();
    const passwordHash = hashPassword(password);

    const customer = await Customer.create({
      id,
      name,
      email,
      passwordHash,
      createdAt,
    });

    await syncCustomerToJson(customer);

    setRoleCookie(res, "customer", customer.id);
    return res.status(201).json({
      ok: true,
      user: stripCustomer(customer),
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ error: "Ya existe una cuenta con este email." });
    }
    console.error("Register error:", err);
    return res.status(500).json({ error: "Error al crear la cuenta." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = (req.body.email ?? "").trim().toLowerCase();
    const password = req.body.password ?? "";

    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña son obligatorios." });
    }

    if (verifyAdminCredentials(email, password)) {
      setAdminCookie(res);
      return res.json({
        ok: true,
        redirect: "/admin",
        role: "admin",
      });
    }

    const customer = await Customer.findOne({ email });
    if (!customer?.passwordHash || !verifyPassword(password, customer.passwordHash)) {
      return res.status(401).json({ error: "Email o contraseña incorrectos." });
    }

    await syncCustomerToJson(customer);
    setRoleCookie(res, "customer", customer.id);
    return res.json({
      ok: true,
      user: stripCustomer(customer),
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Error al iniciar sesión." });
  }
});

router.post("/logout", (req, res) => {
  clearRoleCookie(res, "customer");
  clearAdminCookie(res);
  return res.json({ ok: true });
});

router.get("/me", async (req, res) => {
  try {
    const customerId = getCustomerIdFromRequest(req);
    if (!customerId) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const customer = await Customer.findOne({ id: customerId });
    if (!customer) {
      return res.status(401).json({ error: "No autorizado" });
    }

    return res.json({ user: stripCustomer(customer) });
  } catch (err) {
    console.error("Me error:", err);
    return res.status(500).json({ error: "Error al obtener la sesión." });
  }
});

module.exports = router;
