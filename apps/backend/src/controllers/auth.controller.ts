import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import prisma from "@/database";
import { generateId } from "@/utils/id.util";

const GoogleCallbackSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  avatar: z.string().url().optional(),
});

export const googleCallback = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { email, name, avatar } = GoogleCallbackSchema.parse(request.body);

    // Check if user exists
    let user = await prisma.users.findFirst({
      where: { email },
    });

    if (!user) {
      // Create user if not exist
      user = await prisma.users.create({
        data: {
          id: generateId(20),
          email,
          name,
          avatar,
          phone_number: "", // Mandatory in schema
          phone_code: "", // Mandatory in schema
          isVerified: false,
        },
      });
      request.log.info({ email }, "Created new user via Google OAuth");
    } else {
      request.log.info({ email }, "Existing user logged in via Google OAuth");
    }

    return reply.status(200).send({
      success: true,
      data: user,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        success: false,
        message: "Invalid input data",
        errors: error.errors,
      });
    }

    request.log.error(error);
    return reply.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};
