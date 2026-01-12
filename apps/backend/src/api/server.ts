import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import { UserSchema, CreateUserSchema } from '@utoto/shared';

const fastify = Fastify({ logger: true });
const prisma = new PrismaClient();

fastify.get('/', async (request, reply) => {
  return { hello: 'world' };
});

fastify.get('/users', async (request, reply) => {
  const users = await prisma.user.findMany();
  return users;
});

fastify.post('/users', async (request, reply) => {
  const body = CreateUserSchema.parse(request.body);
  const user = await prisma.user.create({
    data: body,
  });
  return user;
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
