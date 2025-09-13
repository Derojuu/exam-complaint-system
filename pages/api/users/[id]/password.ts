import type { NextApiRequest, NextApiResponse } from "next"
import { executeQuery } from "@/lib/db"
import bcryptjs from "bcryptjs"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === "PATCH") {
    try {
      const { currentPassword, newPassword } = req.body

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required" })
      }

      // Get user's current password hash
      const userResult = await executeQuery(
        "SELECT password FROM users WHERE id = $1",
        [id]
      )

      if (!userResult.rows || userResult.rows.length === 0) {
        return res.status(404).json({ message: "User not found" })
      }

      const user = userResult.rows[0]

      // Verify current password
      const isCurrentPasswordValid = await bcryptjs.compare(currentPassword, user.password)
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: "Current password is incorrect" })
      }

      // Hash new password
      const hashedNewPassword = await bcryptjs.hash(newPassword, 10)

      // Update password
      await executeQuery(
        "UPDATE users SET password = $1 WHERE id = $2",
        [hashedNewPassword, id]
      )

      res.status(200).json({ message: "Password updated successfully" })
    } catch (error) {
      console.error("Error updating password:", error)
      res.status(500).json({ message: "Failed to update password" })
    }
  } else {
    res.setHeader("Allow", ["PATCH"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}