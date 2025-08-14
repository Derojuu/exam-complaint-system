import { NextApiRequest, NextApiResponse } from "next"
import { executeQuery } from "@/lib/db"
import bcryptjs from "bcryptjs"
import { verifyAdminAuth } from "@/lib/auth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    // Verify admin authentication
    const userId = verifyAdminAuth(req)
    
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

    // Get current admin
    const result = await executeQuery(`
      SELECT id, password
      FROM users
      WHERE id = $1 AND role = 'admin'
    `, [userId])

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ message: "Admin not found" })
    }

    const user = result.rows[0] as any

    // Verify current password
    const isCurrentPasswordValid = await bcryptjs.compare(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" })
    }

    // Hash new password
    const hashedNewPassword = await bcryptjs.hash(newPassword, 12)

    // Update password in database
    await executeQuery(`
      UPDATE users
      SET password = $1, updated_at = NOW()
      WHERE id = $2 AND role = 'admin'
    `, [hashedNewPassword, userId])

    return res.status(200).json({ 
      message: "Password updated successfully" 
    })

  } catch (error) {
    console.error("Error changing password:", error)
    return res.status(500).json({ 
      message: "Failed to change password",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}
