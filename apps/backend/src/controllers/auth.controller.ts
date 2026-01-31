import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import prisma from "@/database";
import { generateId } from "@/utils/id.util";
import jwt from "jsonwebtoken";
import envConfig from "@/config";
import { UserResponse } from "@utoto/shared";

const GoogleCallbackSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  avatar: z.string().url().optional(),
});

export const googleCallback = async (
  request: FastifyRequest,
  reply: FastifyReply,
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

    // Generate JWT token
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      envConfig.JWT_SECRET,
      { expiresIn: "7d" },
    );

    const userDto: UserResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
      phone_code: user.phone_code,
      dob: user.dob ? user.dob.toISOString() : null,
      avatar: user.avatar,
      isVerified: user.isVerified || !!user.driver_license_code,
      driver_license_code: user.driver_license_code,
      driver_license_name: user.driver_license_name,
      driver_license_dob: user.driver_license_dob,
      address: null,
    };

    return reply.status(200).send({
      success: true,
      data: {
        user: userDto,
        accessToken,
      },
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
