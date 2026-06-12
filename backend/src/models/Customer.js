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
