import { NextApiRequest, NextApiResponse } from 'next'
import { executeQuery } from '@/lib/db'
import { verifyAdminAuth } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  try {
    // Verify admin authentication
    const userId = verifyAdminAuth(req)
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { startDate, endDate, status, type } = req.query

    // Build base query with filters
    let whereClause = 'WHERE 1=1'
    const params: any[] = []
    let paramIndex = 1

    if (startDate) {
      whereClause += ` AND created_at >= $${paramIndex}`
      params.push(startDate)
      paramIndex++
    }

    if (endDate) {
      whereClause += ` AND created_at <= $${paramIndex}`
      params.push(endDate)
      paramIndex++
    }

    if (status && status !== 'all') {
      whereClause += ` AND status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    if (type && type !== 'all') {
      whereClause += ` AND complaint_type = $${paramIndex}`
      params.push(type)
      paramIndex++
    }

    console.log('Analytics query parameters:', { whereClause, params })

    // Complaint trends (last 30 days by default)
    const trendQuery = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'under-review' THEN 1 ELSE 0 END) as under_review,
        SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved
      FROM complaints 
      ${whereClause}
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `
    
    console.log('Executing trend query:', trendQuery)
    const trendResult = await executeQuery(trendQuery, params)
    const trends = trendResult.rows as any[]
    console.log('Trends result:', trends)    // Complaint types distribution
    const typeDistributionQuery = `
      SELECT 
        complaint_type as type,
        COUNT(*) as count,
        ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM complaints ${whereClause})), 2) as percentage
      FROM complaints 
      ${whereClause}
      GROUP BY complaint_type
      ORDER BY count DESC
    `
    // For subqueries, we need to duplicate the parameters for both main query and subquery
    const typeParams = [...params, ...params]
    console.log('Executing type distribution query:', typeDistributionQuery)
    const typeResult = await executeQuery(typeDistributionQuery, typeParams)
    const typeDistribution = typeResult.rows as any[]
    console.log('Type distribution result:', typeDistribution)

    // Status distribution
    const statusDistributionQuery = `
      SELECT 
        status,
        COUNT(*) as count,
        ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM complaints ${whereClause})), 2) as percentage
      FROM complaints 
      ${whereClause}
      GROUP BY status
      ORDER BY 
        CASE status 
          WHEN 'pending' THEN 1 
          WHEN 'under-review' THEN 2 
          WHEN 'resolved' THEN 3 
          ELSE 4 
        END
    `
    // For subqueries, we need to duplicate the parameters for both main query and subquery
    const statusParams = [...params, ...params]
    console.log('Executing status distribution query:', statusDistributionQuery)
    const statusResult = await executeQuery(statusDistributionQuery, statusParams)
    const statusDistribution = statusResult.rows as any[]
    console.log('Status distribution result:', statusDistribution)    // Average resolution time
    const resolutionTimeQuery = `
      SELECT 
        AVG(EXTRACT(DAY FROM (updated_at - created_at))) as avg_resolution_days,
        MIN(EXTRACT(DAY FROM (updated_at - created_at))) as min_resolution_days,
        MAX(EXTRACT(DAY FROM (updated_at - created_at))) as max_resolution_days
      FROM complaints 
      ${whereClause} AND status = 'resolved' AND updated_at IS NOT NULL
    `
    const resolutionResult = await executeQuery(resolutionTimeQuery, params)
    const resolutionTimes = resolutionResult.rows[0] || { avg_resolution_days: 0, min_resolution_days: 0, max_resolution_days: 0 }    // Monthly comparison (current month vs previous month)
    const monthlyComparisonQuery = `
      SELECT 
        EXTRACT(MONTH FROM created_at) as month,
        EXTRACT(YEAR FROM created_at) as year,
        COUNT(*) as count
      FROM complaints 
      WHERE created_at >= NOW() - INTERVAL '2 months'
      GROUP BY EXTRACT(YEAR FROM created_at), EXTRACT(MONTH FROM created_at)
      ORDER BY year DESC, month DESC
      LIMIT 2
    `
    const monthlyResult = await executeQuery(monthlyComparisonQuery, [])
    const monthlyComparison = monthlyResult.rows as any[]

    // Most active hours
    const hourlyDistributionQuery = `
      SELECT 
        EXTRACT(HOUR FROM created_at) as hour,
        COUNT(*) as count
      FROM complaints 
      ${whereClause}
      GROUP BY EXTRACT(HOUR FROM created_at)
      ORDER BY hour
    `
    const hourlyResult = await executeQuery(hourlyDistributionQuery, params)
    const hourlyDistribution = hourlyResult.rows as any[]    // Top exam types with most complaints
    const topExamTypesQuery = `
      SELECT 
        exam_name,
        COUNT(*) as complaint_count,
        AVG(CASE WHEN status = 'resolved' THEN EXTRACT(DAY FROM (updated_at - created_at)) ELSE NULL END) as avg_resolution_time
      FROM complaints 
      ${whereClause}
      GROUP BY exam_name
      ORDER BY complaint_count DESC
      LIMIT 10
    `
    const examResult = await executeQuery(topExamTypesQuery, params)
    const topExamTypes = examResult.rows as any[]

    // Response statistics
    const responseStatsQuery = `
      SELECT 
        COUNT(DISTINCT c.id) as complaints_with_responses,
        COUNT(r.id) as total_responses,
        AVG(EXTRACT(DAY FROM (r.created_at - c.created_at))) as avg_first_response_time
      FROM complaints c
      LEFT JOIN responses r ON c.id = r.complaint_id
      ${whereClause.replace('WHERE 1=1', 'WHERE c.id IS NOT NULL').replace(/created_at/g, 'c.created_at')}
    `
    const responseResult = await executeQuery(responseStatsQuery, params)
    const responseStats = responseResult.rows[0] || { complaints_with_responses: 0, total_responses: 0, avg_first_response_time: 0 }

    const analytics = {
      trends: trends.reverse(), // Show chronological order
      typeDistribution,
      statusDistribution,
      resolutionTimes,
      monthlyComparison,
      hourlyDistribution,
      topExamTypes,
      responseStats,
      summary: {
        totalComplaints: trends.reduce((sum: number, day: any) => sum + (day.count || 0), 0),
        avgDailyComplaints: trends.length > 0 ? parseFloat((trends.reduce((sum: number, day: any) => sum + (day.count || 0), 0) / trends.length).toFixed(1)).toString() : "0",
        resolutionRate: parseFloat((statusDistribution.find((s: any) => s.status === 'resolved')?.percentage || 0).toString()),
        pendingRate: parseFloat((statusDistribution.find((s: any) => s.status === 'pending')?.percentage || 0).toString())
      }
    }

    res.status(200).json(analytics)
  } catch (error) {
    console.error('Analytics API error:', error)
    res.status(500).json({ error: 'Failed to fetch analytics data' })
  }
}
