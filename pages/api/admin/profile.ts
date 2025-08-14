import type { NextApiRequest, NextApiResponse } from "next"
import { executeQuery } from "@/lib/db"
import { getSessionFromRequest } from "@/lib/auth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Verify admin authentication using helper function
    const session = getSessionFromRequest(req)
    
    if (!session || !session.userId || session.role !== 'admin') {
      return res.status(401).json({ message: 'Admin access required' })
    }

    if (req.method === "GET") {
      const result = await executeQuery(
        "SELECT id, email, first_name, last_name, role, phone, department, position, faculty, profile_pic_url, created_at, updated_at FROM users WHERE id = $1 AND role = 'admin'",
        [session.userId]
      )

      if (!result.rows || result.rows.length === 0) {
        return res.status(404).json({ message: "Admin not found" })
      }

      // Return user data
      const user = result.rows[0] as any
      res.status(200).json({
        ...user,
        firstName: user.first_name,
        lastName: user.last_name,
        profilePicUrl: user.profile_pic_url,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        bio: null, // This field doesn't exist in DB
        adminLevel: "Standard" // This is a computed field
      })
    } else if (req.method === "PUT") {
      const { firstName, lastName, email, phone, department, position, faculty, profilePicUrl } = req.body

      // Validate required fields
      if (!firstName || !lastName || !email) {
        return res.status(400).json({ message: "First name, last name, and email are required" })
      }

      // Update the fields in the database
      await executeQuery(
        `UPDATE users SET 
         first_name = $1, 
         last_name = $2, 
         email = $3, 
         phone = $4,
         department = $5,
         position = $6,
         faculty = $7,
         profile_pic_url = $8,
         updated_at = NOW() 
         WHERE id = $9 AND role = 'admin'`,
        [firstName, lastName, email, phone, department, position, faculty, profilePicUrl, session.userId]
      )

      // Fetch and return the updated user data
      const result = await executeQuery(
        "SELECT id, email, first_name, last_name, role, phone, department, position, faculty, profile_pic_url, created_at, updated_at FROM users WHERE id = $1 AND role = 'admin'",
        [session.userId]
      )

      if (!result.rows || result.rows.length === 0) {
        return res.status(404).json({ message: "Admin not found after update" })
      }

      // Return user data
      const user = result.rows[0] as any
      res.status(200).json({
        ...user,
        firstName: user.first_name,
        lastName: user.last_name,
        profilePicUrl: user.profile_pic_url,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        bio: null, // This field doesn't exist in DB
        adminLevel: "Standard" // This is a computed field
      })
    } else {
      return res.status(405).json({ message: "Method not allowed" })
    }
  } catch (error) {
    console.error('Admin profile API error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}