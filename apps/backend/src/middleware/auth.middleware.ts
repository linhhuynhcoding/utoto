import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const authHeader = request.headers.authorization;
  if (authHeader) {
    try {
      const token = authHeader.replace("Bearer ", "");
      if (token) {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "fallback_secret",
        );
        request.user = decoded as { id: string; email: string };
      }
    } catch (error) {
      request.log.error(error);
      return reply.status(401).send({ message: "Invalid or expired token" });
    }
  }
};
