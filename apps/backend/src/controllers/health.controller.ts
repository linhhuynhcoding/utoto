import { FastifyReply, FastifyRequest } from "fastify";

export async function check(request: FastifyRequest, reply: FastifyReply) {
  return reply.send({ status: "ok", timestamp: new Date().toISOString() });
}
