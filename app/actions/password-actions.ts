"use server"

import { executeQuery } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"
import { sendPasswordResetEmail } from "@/lib/email"
import bcryptjs from "bcryptjs"

// Generate a reset token and store it in the database
export async function requestPasswordReset(email: string, role: string) {
  try {
    // All users are now in the users table with a role field
    const userResult = await executeQuery(
      'SELECT id, email FROM users WHERE email = $1 AND role = $2',
      [email, role]
    )
    const user = userResult.rows && userResult.rows.length > 0 ? userResult.rows[0] : null

    if (!user) {
      return {
        success: true, // Don't reveal if user exists
        message: "If an account exists with this email, you will receive a reset link."
      }
    }

    const token = uuidv4()
    const tokenId = uuidv4()
    const expiresAt = new Date(Date.now() + 3600000) // 1 hour

    await executeQuery(`
      INSERT INTO password_reset_tokens (id, user_id, token, expires_at, role)
      VALUES ($1, $2, $3, $4, $5)
    `, [tokenId, (user as any).id, token, expiresAt, role])

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}&userId=${(user as any).id}&role=${role}`
    await sendPasswordResetEmail(email, resetUrl, role)

    return {
      success: true,
      message: "Reset link sent successfully"
    }
  } catch (error) {
    console.error("Password reset request error:", error)
    return {
      success: false,
      message: "Failed to process reset request"
    }
  }
}

// Reset password using the token
export async function resetPassword(token: string, userId: string, newPassword: string) {
  try {
    const tokenResult = await executeQuery(`
      SELECT user_id, role 
      FROM password_reset_tokens 
      WHERE token = $1 
      AND user_id = $2 
      AND expires_at > NOW()
    `, [token, userId])

    if (!tokenResult.rows || tokenResult.rows.length === 0) {
      return {
        success: false,
        message: "Invalid or expired reset token"
      }
    }

    const resetRequest = tokenResult.rows[0] as any
    const hashedPassword = await bcryptjs.hash(newPassword, 12)

    // All users are now in the users table
    await executeQuery(
      'UPDATE users SET password = $1, password_updated_at = NOW(), updated_at = NOW() WHERE id = $2',
      [hashedPassword, userId]
    )

    await executeQuery(
      'DELETE FROM password_reset_tokens WHERE token = $1',
      [token]
    )

    return {
      success: true,
      message: "Password reset successful"
    }
  } catch (error) {
    console.error("Error resetting password:", error)
    return {
      success: false,
      message: "Failed to reset password"
    }
  }
}
