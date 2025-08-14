import { NextApiRequest, NextApiResponse } from "next"
import { executeQuery } from "@/lib/db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { id } = req.query

    const result = await executeQuery(`
      SELECT 
        c.*,
        u.department AS user_department,
        u.faculty AS user_faculty,
        u.level AS user_level,
        TO_CHAR(c.exam_date, 'YYYY-MM-DD') as exam_date,
        TO_CHAR(c.created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at
      FROM complaints c
      INNER JOIN users u ON c.user_id = u.id
      WHERE c.id = $1
    `, [id])

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ message: "Complaint not found" })
    }

    const complaint = result.rows[0] as any
    return res.status(200).json({
      ...complaint,
      department: complaint.user_department,
      faculty: complaint.user_faculty,
      level: complaint.user_level
    })
  } catch (error) {
    console.error("Error fetching complaint:", error)
    return res.status(500).json({ message: "Failed to fetch complaint" })
  }
}