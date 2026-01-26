import { MultipartFile } from '@fastify/multipart'
import path from 'path'
import fs from 'fs'
import util from 'util'
import { pipeline } from 'stream'
import envConfig, { API_URL } from '@/config'
import { generateId } from '@/utils/id.util'
const pump = util.promisify(pipeline)

// Allowed image types for avatar
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
const MAX_AVATAR_SIZE = 5 * 1024 * 1024 // 5MB

export const uploadImage = async (data: MultipartFile) => {
  const uniqueId = generateId()
  const ext = path.extname(data.filename)
  const id = uniqueId + ext
  const filepath = path.resolve(envConfig.UPLOAD_FOLDER, id)
  await pump(data.file, fs.createWriteStream(filepath))
  if (data.file.truncated) {
    // Xóa file nếu file bị trucated
    await fs.unlinkSync(filepath)
    throw new Error('Giới hạn file là 10MB')
  }
  const url = `${API_URL}` + '/static/' + id
  return url
}

/**
 * Upload avatar với validation image type
 */
export const uploadAvatar = async (data: MultipartFile) => {
  // Validate file type
  if (!ALLOWED_IMAGE_TYPES.includes(data.mimetype)) {
    throw new Error(`Chỉ chấp nhận file ảnh: ${ALLOWED_IMAGE_TYPES.join(', ')}`)
  }

  // Generate unique filename
  const uniqueId = generateId()
  const ext = path.extname(data.filename)
  const filename = `avatar_${uniqueId}${ext}`
  const filepath = path.resolve(envConfig.UPLOAD_FOLDER, filename)

  // Save file
  await pump(data.file, fs.createWriteStream(filepath))

  // Check if file was truncated (exceeded size limit)
  if (data.file.truncated) {
    // Delete file if truncated
    await fs.unlinkSync(filepath)
    throw new Error('Giới hạn file avatar là 5MB')
  }

  // Return URL
  const url = `${API_URL}/static/${filename}`
  return { url, filename }
}
