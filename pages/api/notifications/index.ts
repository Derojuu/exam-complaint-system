import { NextApiRequest, NextApiResponse } from 'next'
import { executeQuery } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'
import { getSessionFromRequest } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Verify authentication using helper function
    const session = getSessionFromRequest(req)
    
    if (!session || !session.userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    if (req.method === 'GET') {
      // Get notifications for the user using executeQuery for better connection management
      const result = await executeQuery(`
        SELECT id, title, message, type, user_id as "userId", related_id as "relatedId", is_read as "isRead", read_at as "readAt", created_at as "createdAt", updated_at as "updatedAt"
        FROM notifications
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 20
      `, [session.userId])

      return res.status(200).json(result.rows)
    }

    if (req.method === 'POST') {
      // Create a new notification
      const { title, message, type, targetUserId, relatedId } = req.body
      const id = uuidv4()

      await executeQuery(`
        INSERT INTO notifications (id, title, message, type, user_id, related_id, is_read, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, FALSE, NOW())
      `, [id, title, message, type || 'info', targetUserId || session.userId, relatedId])

      const notification = {
        id,
        title,
        message,
        type: type || 'info',
        userId: targetUserId || session.userId,
        relatedId,
        isRead: false,
        createdAt: new Date()
      }

      return res.status(201).json(notification)
    }

    if (req.method === 'PATCH') {
      // Mark notification as read
      const { notificationId } = req.body

      await executeQuery(`
        UPDATE notifications 
        SET is_read = TRUE, read_at = NOW(), updated_at = NOW()
        WHERE id = $1 AND user_id = $2
      `, [notificationId, session.userId])

      return res.status(200).json({ success: true })
    }

    if (req.method === 'DELETE') {
      // Delete notification
      const { notificationId } = req.body

      await executeQuery(`
        DELETE FROM notifications
        WHERE id = $1 AND user_id = $2
      `, [notificationId, session.userId])

      return res.status(200).json({ success: true })
    }

    return res.status(405).json({ message: 'Method not allowed' })

  } catch (error: any) {
    console.error('Notifications API error:', error)
    
    // Handle specific connection errors
    if (error?.code === 'ER_CON_COUNT_ERROR') {
      return res.status(503).json({ 
        message: 'Service temporarily unavailable. Please try again in a moment.' 
      })
    }
    
    res.status(500).json({ message: 'Internal server error' })
  }
}
