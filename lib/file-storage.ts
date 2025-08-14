import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

// Ensure upload directory exists
export function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true })
  }
}

// Local file storage as fallback
export async function saveFileLocally(
  fileBuffer: Buffer, 
  originalFilename: string, 
  folder: string = 'general'
): Promise<string> {
  ensureUploadDir()
  
  const folderPath = path.join(UPLOAD_DIR, folder)
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true })
  }
  
  const ext = path.extname(originalFilename)
  const filename = `${uuidv4()}${ext}`
  const filePath = path.join(folderPath, filename)
  
  fs.writeFileSync(filePath, fileBuffer)
  
  // Return the public URL
  return `/uploads/${folder}/${filename}`
}

// Delete local file
export function deleteLocalFile(url: string): boolean {
  try {
    const filePath = path.join(process.cwd(), 'public', url)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      return true
    }
    return false
  } catch (error) {
    console.error('Error deleting local file:', error)
    return false
  }
}
