import type { NextApiRequest, NextApiResponse } from "next"
import { executeQuery } from "@/lib/db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === "PATCH") {
    try {
      const { firstName, lastName, email, phone, bio, profilePicUrl, department, position } = req.body

      // Update user profile
      const result = await executeQuery(`
        UPDATE users 
        SET 
          first_name = $1,
          last_name = $2,
          email = $3,
          phone = $4,
          bio = $5,
          profile_pic_url = $6,
          department = $7,
          position = $8,
          updated_at = NOW()
        WHERE id = $9
        RETURNING *
      `, [firstName, lastName, email, phone, bio, profilePicUrl, department, position, id])

      if (result.rows && result.rows.length > 0) {
        const user = result.rows[0]
        res.status(200).json({
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          phone: user.phone,
          bio: user.bio,
          profilePicUrl: user.profile_pic_url,
          department: user.department,
          position: user.position,
          role: user.role,
          studentId: user.student_id,
          staffId: user.staff_id
        })
      } else {
        res.status(404).json({ message: "User not found" })
      }
    } catch (error) {
      console.error("Error updating user profile:", error)
      res.status(500).json({ message: "Failed to update profile" })
    }
  } else {
    res.setHeader("Allow", ["PATCH"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}