import { executeQuery } from '@/lib/db'
import bcryptjs from 'bcryptjs'
import type { NextApiRequest, NextApiResponse } from 'next'

interface ResetPasswordRequestBody {
    token: string
    password: string
    userId: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') return res.status(405).end()
    const { token, userId, password }: ResetPasswordRequestBody = req.body

    const result = await executeQuery(
      "SELECT * FROM password_reset_tokens WHERE token = $1 AND user_id = $2",
      [token, userId]
    )

    if (!result.rows || result.rows.length === 0) {
        return res.status(400).json({ message: "Invalid or expired token" })
    }

    const record = result.rows[0] as any
    if (new Date(record.expires_at) < new Date()) {
        return res.status(400).json({ message: "Token expired" })
    }

    const hashedPassword = await bcryptjs.hash(password, 12)
    await executeQuery(
      `UPDATE users SET password = $1, password_updated_at = NOW(), updated_at = NOW() WHERE id = $2`,
      [hashedPassword, userId]
    )

    await executeQuery(
      "DELETE FROM password_reset_tokens WHERE token = $1 AND user_id = $2",
      [token, userId]
    )

    res.status(200).json({ message: "Password updated successfully" })
}