import { NextApiRequest, NextApiResponse } from "next"
import { executeQuery } from "@/lib/db"
import { getSessionFromRequest } from "@/lib/auth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    // Verify authentication
    const session = getSessionFromRequest(req)
    
    if (!session || !session.userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const userId = req.query.userId as string

    // Verify user can access these stats (either own stats or admin)
    if (session.userId !== userId && session.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" })
    }

    // Get complaint statistics for the user
    const statsResult = await executeQuery(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'under-review' THEN 1 END) as under_review,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected
      FROM complaints 
      WHERE user_id = $1
    `, [userId])

    const stats = statsResult.rows[0]

    return res.status(200).json({
      total: parseInt(stats.total) || 0,
      pending: parseInt(stats.pending) || 0,
      underReview: parseInt(stats.under_review) || 0,
      resolved: parseInt(stats.resolved) || 0,
      rejected: parseInt(stats.rejected) || 0
    })

  } catch (error) {
    console.error("Error fetching student stats:", error)
    return res.status(500).json({ 
      message: "Failed to fetch stats",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}
