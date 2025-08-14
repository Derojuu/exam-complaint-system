// Importing the sendPasswordResetEmail function
import { sendPasswordResetEmail } from "@/lib/email"
import { executeQuery } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }
  const { email, role } = req.body

  const result = await executeQuery(
    "SELECT id FROM users WHERE email = $1",
    [email]
  )
  
  if (!result.rows || result.rows.length === 0) {
    return res.status(404).json({ message: "User not found" })
  }

  const user = result.rows[0] as any
  const token = uuidv4()
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
  await executeQuery(`
    INSERT INTO password_reset_tokens (id, user_id, role, token, expires_at)
    VALUES ($1, $2, $3, $4, $5)
  `, [uuidv4(), user.id, role || 'student', token, expiresAt])

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}&userId=${user.id}`

  await sendPasswordResetEmail(email, resetUrl, role)

  res.status(200).json({ message: "Password reset email sent" })
}

