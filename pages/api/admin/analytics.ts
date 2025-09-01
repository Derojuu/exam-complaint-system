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

    // Initialize default values
    let trends: any[] = []
    let typeDistribution: any[] = []
    let statusDistribution: any[] = []
    let resolutionTimes: any = { avg_resolution_days: 0, min_resolution_days: 0, max_resolution_days: 0 }
    let monthlyComparison: any[] = []
    let hourlyDistribution: any[] = []
    let topExamTypes: any[] = []
    let responseStats: any = { complaints_with_responses: 0, total_responses: 0, avg_first_response_time: 0 }

    // Complaint trends (last 30 days by default)
    try {
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
      trends = trendResult.rows as any[]
      console.log('Trends result:', trends)
    } catch (error) {
      console.error('Error fetching trends:', error)
      trends = []
    }

    // Complaint types distribution
    try {
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
      typeDistribution = typeResult.rows as any[]
      console.log('Type distribution result:', typeDistribution)
    } catch (error) {
      console.error('Error fetching type distribution:', error)
      typeDistribution = []
    }

    // Status distribution
    try {
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
      statusDistribution = statusResult.rows as any[]
      console.log('Status distribution result:', statusDistribution)
    } catch (error) {
      console.error('Error fetching status distribution:', error)
      statusDistribution = []
    }

    // Average resolution time
    try {
      const resolutionTimeQuery = `
        SELECT 
          AVG(EXTRACT(DAY FROM (resolved_at - created_at))) as avg_resolution_days,
          MIN(EXTRACT(DAY FROM (resolved_at - created_at))) as min_resolution_days,
          MAX(EXTRACT(DAY FROM (resolved_at - created_at))) as max_resolution_days
        FROM complaints 
        ${whereClause} AND status = 'resolved' AND resolved_at IS NOT NULL
      `
      console.log('Executing resolution time query:', resolutionTimeQuery)
      const resolutionResult = await executeQuery(resolutionTimeQuery, params)
      resolutionTimes = resolutionResult.rows[0] || { avg_resolution_days: 0, min_resolution_days: 0, max_resolution_days: 0 }
      console.log('Resolution times result:', resolutionTimes)
    } catch (error) {
      console.error('Error fetching resolution times:', error)
      resolutionTimes = { avg_resolution_days: 0, min_resolution_days: 0, max_resolution_days: 0 }
    }

    // Monthly comparison (current month vs previous month)
    try {
      const monthlyComparisonQuery = `
        SELECT 
          EXTRACT(MONTH FROM created_at) as month,
          EXTRACT(YEAR FROM created_at) as year,
          COUNT(*) as count
        FROM complaints 
        WHERE created_at >= CURRENT_DATE - INTERVAL '2 months'
        GROUP BY EXTRACT(YEAR FROM created_at), EXTRACT(MONTH FROM created_at)
        ORDER BY year DESC, month DESC
        LIMIT 2
      `
      console.log('Executing monthly comparison query:', monthlyComparisonQuery)
      const monthlyResult = await executeQuery(monthlyComparisonQuery, [])
      monthlyComparison = monthlyResult.rows as any[]
      console.log('Monthly comparison result:', monthlyComparison)
    } catch (error) {
      console.error('Error fetching monthly comparison:', error)
      monthlyComparison = []
    }

    // Most active hours
    try {
      const hourlyDistributionQuery = `
        SELECT 
          EXTRACT(HOUR FROM created_at) as hour,
          COUNT(*) as count
        FROM complaints 
        ${whereClause}
        GROUP BY EXTRACT(HOUR FROM created_at)
        ORDER BY hour
      `
      console.log('Executing hourly distribution query:', hourlyDistributionQuery)
      const hourlyResult = await executeQuery(hourlyDistributionQuery, params)
      hourlyDistribution = hourlyResult.rows as any[]
      console.log('Hourly distribution result:', hourlyDistribution)
    } catch (error) {
      console.error('Error fetching hourly distribution:', error)
      hourlyDistribution = []
    }

    // Top exam types with most complaints
    try {
      const topExamTypesQuery = `
        SELECT 
          exam_name,
          COUNT(*) as complaint_count,
          AVG(CASE WHEN status = 'resolved' THEN EXTRACT(DAY FROM (resolved_at - created_at)) ELSE NULL END) as avg_resolution_time
        FROM complaints 
        ${whereClause}
        GROUP BY exam_name
        ORDER BY complaint_count DESC
        LIMIT 10
      `
      console.log('Executing top exam types query:', topExamTypesQuery)
      const examResult = await executeQuery(topExamTypesQuery, params)
      topExamTypes = examResult.rows as any[]
      console.log('Top exam types result:', topExamTypes)
    } catch (error) {
      console.error('Error fetching top exam types:', error)
      topExamTypes = []
    }

    // Response statistics - simplified to avoid complex JOINs
    try {
      const responseStatsQuery = `
        SELECT 
          COUNT(DISTINCT c.id) as complaints_with_responses,
          COUNT(r.id) as total_responses
        FROM complaints c
        LEFT JOIN responses r ON c.id = r.complaint_id
        WHERE c.id IS NOT NULL
        ${whereClause !== 'WHERE 1=1' ? ' AND ' + whereClause.replace('WHERE 1=1 AND ', '').replace(/created_at/g, 'c.created_at') : ''}
      `
      console.log('Executing response stats query:', responseStatsQuery)
      const responseResult = await executeQuery(responseStatsQuery, whereClause !== 'WHERE 1=1' ? params : [])
      responseStats = responseResult.rows[0] || { complaints_with_responses: 0, total_responses: 0, avg_first_response_time: 0 }
      console.log('Response stats result:', responseStats)
    } catch (error) {
      console.error('Error fetching response stats:', error)
      responseStats = { complaints_with_responses: 0, total_responses: 0, avg_first_response_time: 0 }
    }

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

    console.log('Analytics data compiled successfully:', Object.keys(analytics))
    res.status(200).json(analytics)
  } catch (error) {
    console.error('Analytics API error:', error)
    res.status(500).json({ error: 'Failed to fetch analytics data', details: error instanceof Error ? error.message : 'Unknown error' })
  }
}
