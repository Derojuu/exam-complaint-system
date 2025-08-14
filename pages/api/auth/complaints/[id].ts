import { executeQuery } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    // Check authentication
    const cookies = parse(req.headers.cookie || "")
    const sessionCookie = cookies.session

    if (!sessionCookie) {
      return res.status(401).json({ message: "Not authenticated" })
    }

    const session = JSON.parse(decodeURIComponent(sessionCookie))
    
    if (!session?.userId || !session?.role) {
      return res.status(401).json({ message: "Invalid session" })
    }

    const { userId, role } = session
    const { id } = req.query

    // Role-based access control
    if (role === "admin") {
      // Get admin details to determine access permissions
      const adminResult = await executeQuery(`
        SELECT position, department, faculty FROM users WHERE id = $1 AND role = 'admin'
      `, [userId]);

      if (!adminResult.rows || adminResult.rows.length === 0) {
        return res.status(401).json({ message: "Admin not found" });
      }

      const admin = adminResult.rows[0] as any;
      const { position, department, faculty } = admin;

      // Build access control query based on position
      let accessWhereClause = '';
      let accessParams: any[] = [id];

      switch (position) {
        case 'lecturer':
          if (department) {
            accessWhereClause = 'AND c.department = $2';
            accessParams.push(department);
          } else {
            return res.status(403).json({ message: "Access denied: No department assigned" });
          }
          break;

        case 'hod':
          if (department) {
            accessWhereClause = 'AND c.department = $2';
            accessParams.push(department);
          } else {
            return res.status(403).json({ message: "Access denied: No department assigned" });
          }
          break;

        case 'dean':
          if (faculty) {
            accessWhereClause = 'AND c.faculty = $2';
            accessParams.push(faculty);
          } else {
            return res.status(403).json({ message: "Access denied: No faculty assigned" });
          }
          break;

        case 'system-administrator':
        case 'admin':
          // System administrators can access all complaints
          accessWhereClause = '';
          break;

        default:
          return res.status(403).json({ message: "Access denied: Unknown position" });
      }

      const query = `
        SELECT 
          c.*,
          u.first_name,
          u.last_name,
          u.email,
          u.phone,
          u.level,
          u.department as user_department,
          u.faculty as user_faculty,
          u.courses as user_courses,
          TO_CHAR(c.exam_date, 'YYYY-MM-DD') as exam_date,
          TO_CHAR(c.created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at
        FROM complaints c
        INNER JOIN users u ON c.user_id = u.id
        WHERE c.id = $1 ${accessWhereClause}
      `

      const result = await executeQuery(query, accessParams)

      if (!result.rows || result.rows.length === 0) {
        return res.status(404).json({ message: "Complaint not found or access denied" });
      }

      const complaint = result.rows[0] as any

      // Get responses
      const responseResult = await executeQuery(`
        SELECT 
          id,
          text,
          author,
          TO_CHAR(created_at, 'Mon DD, YYYY HH24:MI') as date
        FROM responses 
        WHERE complaint_id = $1 
        ORDER BY created_at DESC
      `, [id])

      // Get status history for admins
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

      complaint.responses = responseResult.rows
      complaint.statusHistory = historyResult.rows
      return res.status(200).json(complaint)
      
    } else {
      // Students can only see their own complaints
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
        WHERE c.id = $1 AND c.user_id = $2
      `, [id, userId])

      if (!result.rows || result.rows.length === 0) {
        return res.status(404).json({ message: "Complaint not found" })
      }

      const complaint = result.rows[0] as any

      // Get responses
      const responseResult = await executeQuery(`
        SELECT 
          id,
          text,
          author,
          TO_CHAR(created_at, 'Mon DD, YYYY HH24:MI') as date
        FROM responses 
        WHERE complaint_id = $1 
        ORDER BY created_at DESC
      `, [id])

      complaint.responses = responseResult.rows
      return res.status(200).json(complaint)
    }
  } catch (error) {
    console.error("Error fetching complaint:", error)
    return res.status(500).json({ message: "Failed to fetch complaint" })
  }
}