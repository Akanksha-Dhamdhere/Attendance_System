
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function createAdmin() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from .env");
    }

    const email = (
      process.env.ADMIN_EMAIL || "admin@attendance.com"
    ).trim().toLowerCase();

    const password =
      process.env.ADMIN_PASSWORD || "Admin@12345";

    await mongoose.connect(process.env.MONGO_URI);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.role !== "admin") {
        throw new Error(
          "This email already belongs to a non-admin account."
        );
      }

      console.log("Admin account already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name: "System Admin",
      email,
      password: hashedPassword,
      role: "admin",
      mustChangePassword: true,
    });

    console.log("Admin account created successfully.");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Change the temporary password after login.");
  } catch (error) {
    console.error("Admin setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
