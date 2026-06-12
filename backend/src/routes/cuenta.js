const express = require("express");
const Customer = require("../models/Customer");
const { hashPassword, verifyPassword } = require("../utils/password");
const { isStrongPassword, STRONG_PASSWORD_MESSAGE } = require("../utils/strongPassword");
const { setRoleCookie, clearRoleCookie } = require("../utils/session");
const { syncCustomerToJson, generateCustomerId } = require("../utils/jsonSync");

const router = express.Router();

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

    console.log(`Registered: ${customer.email} → familiaproject.customers (${customer.id})`);

    setRoleCookie(res, "customer", customer.id);
    return res.json({
      ok: true,
      user: { id: customer.id, name: customer.name, email: customer.email },
    });
  } catch (err) {
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

    const customer = await Customer.findOne({ email });
    if (!customer || !verifyPassword(password, customer.passwordHash)) {
      return res.status(401).json({ error: "Email o contraseña incorrectos." });
    }

    await syncCustomerToJson(customer);
    setRoleCookie(res, "customer", customer.id);
    return res.json({
      ok: true,
      user: { id: customer.id, name: customer.name, email: customer.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Error al iniciar sesión." });
  }
});

router.post("/logout", (_req, res) => {
  clearRoleCookie(res, "customer");
  return res.json({ ok: true });
});

module.exports = router;
