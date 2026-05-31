import dotenv from 'dotenv';

dotenv.config();

const parseNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const config = {
  app: {
    port: parseNumber(process.env.PORT, 4000),
    basePath: process.env.APP_BASE_PATH || '/api',
  },
  db: {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || '',
    server: process.env.DB_SERVER || 'localhost',
    port: parseNumber(process.env.DB_PORT, 1433),
    database: process.env.DB_NAME || 'TeamTaskTracker',
  },
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseNumber(process.env.REDIS_PORT, 6379),
    password: process.env.REDIS_PASSWORD || '',
  },
  swagger: {
    title: process.env.SWAGGER_TITLE || 'Team Task Tracker API',
    version: process.env.SWAGGER_VERSION || '1.0.0',
  },
};
