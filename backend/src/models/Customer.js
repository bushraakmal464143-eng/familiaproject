const fs = require("fs/promises");
const path = require("path");

function normalizeEmail(email) {
  return String(email ?? "").trim().toLowerCase();
}

const DATA_DIR = path.join(__dirname, "..", "..", "..", "data");
const CUSTOMERS_FILE = path.join(DATA_DIR, "customers.json");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readCustomers() {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(CUSTOMERS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeCustomers(customers) {
  await ensureDataDir();
  await fs.writeFile(CUSTOMERS_FILE, JSON.stringify(customers, null, 2), "utf-8");
}

function createJsonCustomerModel() {
  return {
    async findOne(query) {
      const customers = await readCustomers();
      if (query?.email) {
        const email = normalizeEmail(query.email);
        return customers.find((c) => normalizeEmail(c.email) === email) ?? null;
      }
      if (query?.id) {
        const id = String(query.id);
        return customers.find((c) => String(c.id) === id) ?? null;
      }
      return null;
    },

    async create(doc) {
      const customers = await readCustomers();
      const email = normalizeEmail(doc?.email);
      if (!email) throw new Error("Email is required");
      if (customers.some((c) => normalizeEmail(c.email) === email)) {
        const err = new Error("Duplicate email");
        err.code = 11000;
        throw err;
      }

      const entry = {
        id: String(doc.id),
        name: String(doc.name ?? "").trim(),
        email,
        passwordHash: String(doc.passwordHash ?? ""),
        googleId: doc.googleId ? String(doc.googleId) : undefined,
        createdAt: String(doc.createdAt ?? new Date().toISOString()),
      };

      customers.push(entry);
      await writeCustomers(customers);
      return entry;
    },

    find(_filter = {}, _projection = {}) {
      return {
        async lean() {
          return await readCustomers();
        },
      };
    },
  };
}

if (process.env.DB_MODE === "json") {
  module.exports = createJsonCustomerModel();
} else {
  const mongoose = require("mongoose");

  const customerSchema = new mongoose.Schema(
    {
      id: { type: String, required: true, unique: true },
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, unique: true, lowercase: true, trim: true },
      passwordHash: { type: String, required: true },
      googleId: { type: String },
      createdAt: { type: String, required: true },
    },
    { versionKey: false }
  );

  module.exports = mongoose.model("Customer", customerSchema, "customers");
}
