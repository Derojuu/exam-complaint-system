// pages/api/profile/update.ts
import type { NextApiRequest, NextApiResponse } from "next"
import { executeQuery } from "@/lib/db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" })

  try {
    const {
      id,
      firstName,
      lastName,
      email,
      phone,
      department,
      position,
      profilePicUrl
    } = req.body

    await executeQuery(`
      UPDATE users
      SET first_name=$1, last_name=$2, email=$3, phone=$4,
          department=$5, position=$6, profile_pic_url=$7, updated_at=NOW()
      WHERE id=$8
    `, [firstName, lastName, email, phone, department, position, profilePicUrl, id])

    res.status(200).json({ success: true })
  } catch (error) {
    console.error("Update error:", error)
    res.status(500).json({ success: false, message: "Error updating profile" })
  }
}
