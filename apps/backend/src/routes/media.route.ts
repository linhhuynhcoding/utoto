import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { UploadImageResType, UploadAvatarResType } from "@utoto/shared";

import { authenticate } from "@/middleware/auth.middleware";
import { uploadImage, uploadAvatar } from "@/controllers/media.controller";

export default async function mediaRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
) {



  fastify.post<{ Reply: UploadImageResType }>(
    "/upload",
    {
      preHandler: [authenticate],
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              message: { type: "string" },
              data: { type: "string" },
            },
            required: ["message", "data"],
          },
        },
      },
    },
    async (request, reply) => {
      const data = await request.file(); // đọc file từ multipart
      if (!data) {
        return reply
          .status(400)
          .send({ message: "Không tìm thấy file", data: "" });
      }

      const url = await uploadImage(data);
      return reply.send({ message: "Upload ảnh thành công", data: url });
    },
  );

  // Upload avatar (with specific validation)
  fastify.post<{ Reply: UploadAvatarResType }>(
    "/upload-avatar",
    {
      preHandler: [authenticate],
    },
    async (request, reply) => {
      try {
        const data = await request.file();
        if (!data) {
          return reply.status(400).send({
            success: false,
            message: "Không tìm thấy file",
            data: { url: "", filename: "" },
          });
        }

        const result = await uploadAvatar(data);
        return reply.send({
          success: true,
          message: "Upload avatar thành công",
          data: result,
        });
      } catch (error) {
        request.log.error(error);
        const message =
          error instanceof Error
            ? error.message
            : "Upload avatar thất bại";
        return reply.status(400).send({
          success: false,
          message,
          data: { url: "", filename: "" },
        });
      }
    },
  );
}
