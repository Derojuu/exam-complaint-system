import { NextApiRequest, NextApiResponse } from "next"
import { executeQuery } from "@/lib/db"
import bcrypt from "bcryptjs"
import { verifyStudentAuth } from "@/lib/auth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    // Verify student authentication
    const userId = verifyStudentAuth(req)
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters long" })
    }

    // Get current user
    const result = await executeQuery(`
      SELECT password FROM users WHERE id = $1
    `, [userId])

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" })
    }

    const user = result.rows[0] as any

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password)
    if (!isValidPassword) {
      return res.status(400).json({ message: "Current password is incorrect" })
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    await executeQuery(`
      UPDATE users SET password = $1 WHERE id = $2
    `, [hashedNewPassword, userId])

    return res.status(200).json({ message: "Password updated successfully" })

  } catch (error) {
    console.error("Password change error:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}
