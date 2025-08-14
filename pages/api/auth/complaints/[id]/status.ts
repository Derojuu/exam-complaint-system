import type { NextApiRequest, NextApiResponse } from "next"
import { executeQuery } from "@/lib/db"
import { createNotification } from "@/lib/notifications"
import { verifyAdminAuth } from "@/lib/auth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    // Verify admin authentication
    const userId = verifyAdminAuth(req)
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const { id } = req.query
    const { status, notes } = req.body

    // Get current status
    const currentStatusResult = await executeQuery(
      "SELECT status FROM complaints WHERE id = $1",
      [id]
    )
    const oldStatus = currentStatusResult.rows[0]?.status

    // Get admin info from users table
    const adminResult = await executeQuery(
      "SELECT first_name, last_name FROM users WHERE id = $1 AND role = 'admin'",
      [userId]
    )
    const admin = adminResult.rows[0]

    if (!admin) {
      return res.status(404).json({ message: "Admin user not found" })
    }

    // Update complaint status
    await executeQuery(
      "UPDATE complaints SET status = $1, updated_at = NOW() WHERE id = $2",
      [status, id]
    )

    // Record in history
    await executeQuery(`
      INSERT INTO complaint_status_history (
        id, complaint_id, old_status, new_status, 
        changed_by, changed_by_name, notes
      ) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6)
    `, [
      id, 
      oldStatus, 
      status, 
      userId,
      `${admin.first_name} ${admin.last_name}`,
      notes
    ])

    // Get complaint details for notification
    const complaintResult = await executeQuery(
      "SELECT user_id, exam_name FROM complaints WHERE id = $1",
      [id]
    )
    const complaint = complaintResult.rows[0]

    // Create notification for student
    if (complaint) {
      try {
        await createNotification({
          title: 'Complaint Status Updated',
          message: `Your complaint about ${complaint.exam_name} status has been changed to "${status}".`,
          type: status === 'resolved' ? 'success' : 'info',
          userId: complaint.user_id,
          relatedId: id as string
        })
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError)
        // Don't fail the status update if notification fails
      }
    }

    // Get updated history
    const historyResult = await executeQuery(`
      SELECT 
        id,
        old_status,
        new_status,
        changed_by_name,
        notes,
        TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as formatted_date
      FROM complaint_status_history 
      WHERE complaint_id = $1
      ORDER BY created_at DESC
    `, [id])

    return res.status(200).json({
      success: true,
      status,
      history: historyResult.rows
    })

  } catch (error) {
    console.error("Error updating status:", error)
    return res.status(500).json({ message: "Failed to update status" })
  }
}