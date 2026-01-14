import Fastify from 'fastify';
import { healthRoutes } from './routes/health.route';

const buildApp = () => {
  const app = Fastify({ logger: true });

  // Register routes
  app.register(healthRoutes);

  return app;
};

export default buildApp;
