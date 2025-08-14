import { NextApiRequest, NextApiResponse } from "next"
import { executeQuery } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"
import { sendResponseNotification } from "@/lib/email"
import { createNotification } from "@/lib/notifications"
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

    const complaintId = req.query.id as string
    const { text } = req.body

    const complaintResult = await executeQuery(`
      SELECT c.*, u.email, c.exam_name, c.user_id
      FROM complaints c
      INNER JOIN users u ON c.user_id = u.id
      WHERE c.id = $1
    `, [complaintId])

    if (!complaintResult.rows || complaintResult.rows.length === 0) {
      return res.status(404).json({ message: "Complaint not found" })
    }

    const complaint = complaintResult.rows[0] as any

    const adminResult = await executeQuery(`
      SELECT id, first_name, last_name 
      FROM users 
      WHERE id = $1 AND role = 'admin'
    `, [userId])

    if (!adminResult.rows || adminResult.rows.length === 0) {
      return res.status(401).json({ message: "Unauthorized - Admin not found" })
    }

    const admin = adminResult.rows[0] as any
    const responseId = uuidv4()
    const adminFullName = `${admin.first_name} ${admin.last_name}`

    await executeQuery(`
      INSERT INTO responses (
        id, text, author, author_id, complaint_id, created_at
      ) VALUES ($1, $2, $3, $4, $5, NOW())
    `, [responseId, text, adminFullName, admin.id, complaintId])

    // Create notification for student
    try {
      await createNotification({
        title: 'New Response to Your Complaint',
        message: `An administrator has responded to your complaint about ${complaint.exam_name}.`,
        type: 'info',
        userId: complaint.user_id,
        relatedId: complaintId
      })
    } catch (notificationError) {
      console.error('Error creating notification:', notificationError)
      // Don't fail the response if notification fails
    }

    await sendResponseNotification(
      complaint.email,
      {
        examName: complaint.exam_name,
        responseText: text,
        adminName: adminFullName,
        complaintId: complaintId
      }
    )

    const newResponseResult = await executeQuery(`
      SELECT 
        r.id,
        r.text,
        r.author,
        TO_CHAR(r.created_at, 'Mon DD, YYYY HH24:MI') as date
      FROM responses r
      WHERE r.id = $1
    `, [responseId])

    const newResponse = newResponseResult.rows[0]
    return res.status(200).json(newResponse)

  } catch (error) {
    console.error("Error adding response:", error)
    return res.status(500).json({ 
      message: "Failed to add response",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}