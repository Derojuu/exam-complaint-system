import { executeQuery } from './db'
import { v4 as uuidv4 } from 'uuid'

export interface NotificationData {
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  userId: string
  relatedId?: string
}

export async function createNotification(data: NotificationData) {
  try {
    const id = uuidv4()

    await executeQuery(`
      INSERT INTO notifications (id, title, message, type, user_id, related_id, is_read, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, FALSE, NOW())
    `, [id, data.title, data.message, data.type, data.userId, data.relatedId])

    return { id, ...data, isRead: false }
  } catch (error) {
    console.error('Error creating notification:', error)
    throw error
  }
}

export async function createSystemNotification(
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info'
) {
  try {
    // Get all admin users
    const adminResult = await executeQuery(`
      SELECT id FROM users WHERE role = 'admin'
    `)

    const admins = adminResult.rows as any[]

    // Create notifications for all admins
    const notifications = await Promise.all(
      admins.map(admin => 
        createNotification({
          title,
          message,
          type,
          userId: admin.id
        })
      )
    )

    return notifications
  } catch (error) {
    console.error('Error creating system notification:', error)
    throw error
  }
}

export async function getUserNotifications(userId: string, limit: number = 20) {
  try {
    // Ensure limit is a safe integer
    const safeLimit = Math.max(1, Math.min(100, Math.floor(limit)))
    
    const result = await executeQuery(`
      SELECT id, title, message, type, user_id, related_id, is_read, read_at, created_at, updated_at
      FROM notifications 
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `, [userId, safeLimit])

    return result.rows as any[]
  } catch (error) {
    console.error('Error fetching notifications:', error)
    throw error
  }
}

// Alias for getUserNotifications for compatibility
export async function getNotifications(userId: string, limit: number = 20) {
  return getUserNotifications(userId, limit)
}

export async function markNotificationAsRead(notificationId: string, userId: string) {
  try {
    await executeQuery(`
      UPDATE notifications 
      SET is_read = TRUE, read_at = NOW(), updated_at = NOW()
      WHERE id = $1 AND user_id = $2
    `, [notificationId, userId])

    return { success: true }
  } catch (error) {
    console.error('Error marking notification as read:', error)
    throw error
  }
}

export async function deleteNotification(notificationId: string, userId: string) {
  try {
    await executeQuery(`
      DELETE FROM notifications 
      WHERE id = $1 AND user_id = $2
    `, [notificationId, userId])

    return { success: true }
  } catch (error) {
    console.error('Error deleting notification:', error)
    throw error
  }
}

export async function getUnreadNotificationCount(userId: string) {
  try {
    const result = await executeQuery(`
      SELECT COUNT(*) as count
      FROM notifications
      WHERE user_id = $1 AND is_read = FALSE
    `, [userId])

    const rows = result.rows as any[]
    return rows[0]?.count || 0
  } catch (error) {
    console.error('Error getting unread notification count:', error)
    throw error
  }
}

// Cleanup function to remove old notifications (older than 30 days)
export async function cleanupOldNotifications() {
  try {
    const result = await executeQuery(`
      DELETE FROM notifications
      WHERE created_at < NOW() - INTERVAL '30 days'
      AND is_read = TRUE
    `)

    console.log(`Cleaned up ${result.rowCount} old notifications`)
    return { count: result.rowCount }
  } catch (error) {
    console.error('Error cleaning up notifications:', error)
    throw error
  }
}
