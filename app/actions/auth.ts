"use server"

import { executeQuery } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { serialize } from "cookie"
import bcryptjs from "bcryptjs"

// Register a new admin user
export async function registerAdmin(data: {
  firstName: string
  lastName: string
  email: string
  staffId: string
  password: string
  position: string
  department?: string
  faculty?: string
  courses?: string
}) {
  try {
    // Check if admin already exists (email or staffId)
    const emailResult = await executeQuery(
      "SELECT id FROM users WHERE email = $1 AND role = 'admin'",
      [data.email]
    )

    if (emailResult.rows && emailResult.rows.length > 0) {
      return {
        success: false,
        message: "An admin with this email already exists.",
      }
    }

    // Check if staffId already exists
    const staffResult = await executeQuery(
      "SELECT id FROM users WHERE staff_id = $1",
      [data.staffId]
    )

    if (staffResult.rows && staffResult.rows.length > 0) {
      return {
        success: false,
        message: "An admin with this Staff ID already exists.",
      }
    }

    const hashedPassword = await bcryptjs.hash(data.password, 10)

    await executeQuery(`
      INSERT INTO users (
        email, password, first_name, last_name, staff_id,
        position, department, faculty, courses, role
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `, [
      data.email,
      hashedPassword,
      data.firstName,
      data.lastName,
      data.staffId,
      data.position || null,
      data.department || null,
      data.faculty || null,
      data.courses || null,
      "admin"
    ])

    return {
      success: true,
      message: "Admin registered successfully",
    }
  } catch (error) {
    console.error("Error registering admin:", error)
    return {
      success: false,
      message: "Failed to register admin. Please try again later.",
    }
  }
}

// Hash password function
export async function hashPassword(password: string) {
  return bcryptjs.hash(password, 10)
}

// Register a new student user
export async function registerStudent(data: {
  firstName: string
  lastName: string
  email: string
  password: string
  studentId: string
  department: string
  faculty: string
  level: string
  role: string
}) {
  try {
    const hashedPassword = await bcryptjs.hash(data.password, 10)

    // Check if email or studentId already exists
    const result = await executeQuery(
      "SELECT id FROM users WHERE email = $1 OR student_id = $2",
      [data.email, data.studentId]
    )

    if (result.rows && result.rows.length > 0) {
      return { 
        success: false, 
        message: "Email or Student ID already registered" 
      }
    }

    await executeQuery(`
      INSERT INTO users (
        email, password, first_name, last_name, 
        student_id, department, faculty, level, role
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      data.email,
      hashedPassword,
      data.firstName,
      data.lastName,
      data.studentId,
      data.department,
      data.faculty,
      data.level,
      "student"
    ])

    return {
      success: true,
      message: "Registration successful"
    }

  } catch (error) {
    console.error("Database error during registration:", error)
    return {
      success: false,
      message: "Registration failed"
    }
  }
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return bcryptjs.compare(password, hashedPassword)
}

export async function loginUser(email: string, password: string, role: string) {
  try {
    const query = role === 'admin' 
      ? "SELECT * FROM users WHERE email = $1 AND role = 'admin'"
      : "SELECT * FROM users WHERE email = $1 AND role = 'student'"

    const params = [email]
    const result = await executeQuery(query, params)

    if (!result.rows || result.rows.length === 0) {
      return { success: false, message: "Invalid email or password." }
    }

    const user = result.rows[0] as any

    const isValid = await bcryptjs.compare(password, user.password)
    
    console.log('Password comparison:', {
      inputPassword: password,
      hashedPassword: user.password,
      isValid
    })

    if (!isValid) {
      return { success: false, message: "Invalid email or password." }
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role // Use the role from the database, not the request
      }
    }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, message: "Login failed" }
  }
}

// Login function
export async function login(data: { email: string; password: string; role: string }, res: any) {
  try {
    const query = data.role === 'admin' 
      ? "SELECT * FROM users WHERE email = $1 AND role = 'admin'"
      : "SELECT * FROM users WHERE email = $1 AND role = 'student'"

    const result = await executeQuery(query, [data.email])

    if (!result.rows || result.rows.length === 0) {
      return {
        success: false,
        message: "Invalid email or password.",
      }
    }

    const user = result.rows[0] as any

    const isPasswordValid = await bcryptjs.compare(data.password, user.password)

    if (!isPasswordValid) {
      return {
        success: false,
        message: "Invalid email or password.",
      }
    }

    // Create a session
    const sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
    const session = {
      id: sessionId,
      userId: user.id,
      role: data.role,
      position: user.position || null,
      department: user.department || null,
      faculty: user.faculty || null,
      courses: user.courses || null,
    }

    // Set the session cookie
    const cookie = serialize("session", JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    res.setHeader("Set-Cookie", cookie)

    return {
      success: true,
      role: data.role,
      position: user.position || null,
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      message: "Login failed",
    }
  }
}

// Logout function
export async function logout() {
  try {
    return { success: true }
  } catch (error) {
    console.error("Logout error:", error)
    return { success: false }
  }
}

// Get current user
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      return null
    }

    const session = JSON.parse(sessionCookie.value)

    // All users are in the users table, but verify role matches session
    const table = "users"
    const columns = "id, email, first_name, last_name, student_id, staff_id, phone, position, department, faculty, courses, profile_pic_url, role"

    console.log(`Querying table: ${table} for userId: ${session.userId}`)

    const result = await executeQuery(
      `SELECT ${columns} FROM ${table} WHERE id = $1 AND role = $2`,
      [session.userId, session.role]
    )

    if (!result.rows || result.rows.length === 0) {
      return null
    }

    const user = result.rows[0] as any

    return {
      ...user,
      firstName: user.first_name,
      lastName: user.last_name,
      studentId: user.student_id,
      staffId: user.staff_id,
      profilePicUrl: user.profile_pic_url,
      role: session.role,
      password: undefined, // Don't return the password
    }
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}
