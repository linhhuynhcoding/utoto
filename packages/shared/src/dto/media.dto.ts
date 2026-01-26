import z from 'zod'

export const UploadImageRes = z.object({
  data: z.string(),
  message: z.string()
})

export type UploadImageResType = z.TypeOf<typeof UploadImageRes>

// Avatar upload response
export const UploadAvatarRes = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    url: z.string(),
    filename: z.string(),
  })
})

export type UploadAvatarResType = z.TypeOf<typeof UploadAvatarRes>