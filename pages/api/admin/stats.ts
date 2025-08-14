import { NextApiRequest, NextApiResponse } from 'next'
import { executeQuery } from '@/lib/db'
import { getSessionFromRequest } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Verify admin authentication using helper function
    const session = getSessionFromRequest(req)
    
    if (!session || !session.userId || session.role !== 'admin') {
      return res.status(401).json({ message: 'Admin access required' })
    }

    // Get current date for filtering
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Fetch total students
    const studentResult = await executeQuery(
      'SELECT COUNT(*) as count FROM users WHERE role = $1',
      ['student']
    )
    const totalStudents = studentResult.rows[0]?.count || 0

    // Fetch total complaints
    const complaintResult = await executeQuery(
      'SELECT COUNT(*) as count FROM complaints'
    )
    const totalComplaints = complaintResult.rows[0]?.count || 0

    // Fetch pending complaints
    const pendingResult = await executeQuery(
      'SELECT COUNT(*) as count FROM complaints WHERE status = $1',
      ['pending']
    )
    const pendingReview = pendingResult.rows[0]?.count || 0

    // Fetch resolved this month
    const resolvedResult = await executeQuery(`
      SELECT COUNT(*) as count 
      FROM complaints 
      WHERE status = $1 
      AND updated_at >= $2
    `, ['resolved', startOfMonth.toISOString()])
    const resolvedThisMonth = resolvedResult.rows[0]?.count || 0

    // Fetch active admins (those who exist in the system)
    const adminResult = await executeQuery(
      'SELECT COUNT(*) as count FROM users WHERE role = $1',
      ['admin']
    )
    const activeAdmins = adminResult.rows[0]?.count || 0

    // Calculate average resolution time
    const resolutionResult = await executeQuery(`
      SELECT 
        ROUND(AVG(EXTRACT(DAY FROM (updated_at - created_at))), 1) as avg_days
      FROM complaints 
      WHERE status = $1
    `, ['resolved'])
    const avgDays = resolutionResult.rows[0]?.avg_days || 0
    const avgResolutionTime = avgDays > 0 ? `${avgDays} days` : 'N/A'

    // Get recent activity (today)
    const activityResult = await executeQuery(`
      SELECT COUNT(*) as count
      FROM complaints
      WHERE DATE(created_at) = CURRENT_DATE OR DATE(updated_at) = CURRENT_DATE
    `)
    const recentActivity = activityResult.rows[0]?.count || 0

    // Get admin's last login (mock data since we don't track this yet)
    const lastLogin = 'Just now' // You can implement proper last login tracking

    // System uptime (mock - in real app this would come from monitoring)
    const systemUptime = '99.8%'

    const stats = {
      totalStudents,
      totalComplaints,
      pendingReview,
      resolvedThisMonth,
      avgResolutionTime,
      activeAdmins,
      systemUptime,
      lastLogin,
      recentActivity
    }

    res.status(200).json(stats)

  } catch (error) {
    console.error('Error fetching admin stats:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
