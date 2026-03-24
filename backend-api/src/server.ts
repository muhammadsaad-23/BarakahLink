import { createApp } from './app';
import { env } from './config/env';
import { prisma } from './lib/prisma';
import { logger } from './lib/logger';

async function main() {
  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info(`BarakahLink API running`, {
      port: env.PORT,
      env: env.NODE_ENV,
      frontend: env.FRONTEND_URL,
    });
  });

  // Connect to DB after server is already listening (so healthcheck passes immediately)
  try {
    await prisma.$connect();
    logger.info('Database connected');
  } catch (err) {
    logger.error('Failed to connect to database', { error: String(err) });
    // Don't exit — keep server up so healthcheck passes; DB queries will fail gracefully
  }

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    logger.info('SIGTERM received — shutting down gracefully');
    server.close(async () => {
      await prisma.$disconnect();
      logger.info('Server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', async () => {
    logger.info('SIGINT received — shutting down gracefully');
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  });
}

main().catch((err) => {
  logger.error('Unhandled startup error', { error: String(err) });
  process.exit(1);
});
