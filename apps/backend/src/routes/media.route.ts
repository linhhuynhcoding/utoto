import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fastifyMultipart from "@fastify/multipart";
import { UploadImageResType } from "@utoto/shared";
import { authenticate } from "@/middleware/auth.middleware";
import { uploadImage } from "@/controllers/media.controller";

export default async function mediaRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
) {
  fastify.register(fastifyMultipart, {
    limits: {
      fileSize: 1024 * 1024 * 10, // 10MB
      files: 1,
      fields: 1,
    },
  });

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
}
