import { executeQuery } from "../lib/db";
import bcrypt from "bcryptjs";

async function main() {
  try {
    console.log("Setting up database with test users...");

    // Hash passwords
    const adminPasswordHash = await bcrypt.hash("admin123", 10);
    const studentPasswordHash = await bcrypt.hash("student123", 10);

    // Check if admin exists, if not create one
    const adminResult = await executeQuery(
      "SELECT id FROM users WHERE email = $1",
      ["admin@example.com"]
    );

    if (!adminResult.rows || adminResult.rows.length === 0) {
      await executeQuery(`
        INSERT INTO users (
          email, password, first_name, last_name, student_id, role
        ) VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        "admin@example.com",
        adminPasswordHash,
        "Admin",
        "User",
        "ADMIN001",
        "admin"
      ]);
      console.log("✅ Admin user created");
    } else {
      console.log("Admin user already exists");
    }

    // Check if student exists, if not create one
    const studentResult = await executeQuery(
      "SELECT id FROM users WHERE email = $1",
      ["student@example.com"]
    );

    if (!studentResult.rows || studentResult.rows.length === 0) {
      await executeQuery(`
        INSERT INTO users (
          email, password, first_name, last_name, student_id, role
        ) VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        "student@example.com",
        studentPasswordHash,
        "Student",
        "User",
        "ST12345",
        "student"
      ]);
      console.log("✅ Student user created");
    } else {
      console.log("Student user already exists");
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });