import { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import { uploadFile } from '@/lib/cloudinary'
import fs from 'fs'
import path from 'path'
import { getSessionFromRequest } from '@/lib/auth'

export const config = {
  api: {
    bodyParser: false,
  },
}

interface Session {
  userId: string
  role: string
}

interface UploadResponse {
  success: boolean
  url?: string
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UploadResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }
  
  console.log('Upload API called with type:', req.query.type)
  
  try {
    // Check authentication
    const session = getSessionFromRequest(req)
    
    console.log('Session check result:', session ? 'Found session' : 'No session')
    if (session) {
      console.log('Session details:', { userId: session.userId, role: session.role })
    }
    
    if (!session || !session.userId) {
      console.log('Authentication failed: No session found')
      return res.status(401).json({ success: false, message: 'Not authenticated' })
    }

    console.log('Authentication successful for user:', session.userId)

    // Get upload type from query
    const { type } = req.query
    
    if (!type || (type !== 'profile' && type !== 'evidence')) {
      return res.status(400).json({ success: false, message: 'Invalid upload type' })
    }

    // Configure formidable for serverless environment (no temp directory)
    const form = formidable({
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      // Don't specify uploadDir for serverless - use memory
      multiples: false,
    })
    
    // Define allowed file types
    const allowedFileTypes = type === 'profile' 
      ? ['.jpg', '.jpeg', '.png', '.gif']
      : ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx']

    // Parse the form
    const [fields, files] = await form.parse(req)
    
    console.log('Files received:', Object.keys(files))
    console.log('Fields received:', Object.keys(fields))

    const file = Array.isArray(files.file) ? files.file[0] : files.file

    if (!file) {
      console.log('No file found in upload')
      return res.status(400).json({ success: false, message: 'No file uploaded' })
    }

    console.log('File details:', {
      originalFilename: file.originalFilename,
      size: file.size,
      mimetype: file.mimetype,
      filepath: file.filepath
    })

    // Validate file type
    const ext = path.extname(file.originalFilename || '').toLowerCase()
    if (!allowedFileTypes.includes(ext)) {
      console.log(`File type validation failed: ${ext}`)
      return res.status(400).json({ 
        success: false, 
        message: `Invalid file type: ${ext}. Allowed types: ${allowedFileTypes.join(', ')}` 
      })
    }

    // Read the file buffer directly (formidable stores it in memory for serverless)
    let fileBuffer: Buffer
    
    if (file.filepath && fs.existsSync(file.filepath)) {
      // File was stored temporarily, read it
      fileBuffer = fs.readFileSync(file.filepath)
      // Clean up temp file immediately
      fs.unlinkSync(file.filepath)
    } else {
      // File should be in memory, but let's handle the error case
      return res.status(500).json({ success: false, message: 'File processing failed - no file data available' })
    }

    // Generate folder name for Cloudinary
    const folder = type === 'profile' ? 'profile-pics' : 'evidence'

    console.log('File buffer size:', fileBuffer.length, 'bytes')

    try {
      // Upload to Cloudinary
      console.log('Uploading to Cloudinary...')
      const uploadResult = await uploadFile(fileBuffer, file.originalFilename || 'file', folder) as any

      // Clean up temp file
      if (fs.existsSync(file.filepath)) {
        fs.unlinkSync(file.filepath)
      }

      console.log(`File uploaded successfully to Cloudinary: ${uploadResult.url}`)
      
      return res.status(200).json({
        success: true,
        url: uploadResult.url,
        message: 'File uploaded successfully'
      })

    } catch (uploadError: any) {
      console.error('Cloudinary upload error:', uploadError)
      
      return res.status(500).json({ 
        success: false, 
        message: `Failed to upload file to Cloudinary: ${uploadError.message || uploadError}` 
      })
    }

  } catch (error: any) {
    console.error('Upload API error:', error)
    return res.status(500).json({ 
      success: false, 
      message: `Internal server error: ${error.message || error}` 
    })
  }
}
