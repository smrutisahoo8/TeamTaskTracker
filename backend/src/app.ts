import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

dotenv.config();

import swaggerSpec from './config/swagger';
import { config } from './config';
import { initializeDatabase } from './config/database';
import { connectRedis } from './config/redis';

import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import userRoutes from './routes/user.routes';
import projectRoutes from './routes/project.routes';

import { requestLogger } from './middleware/logger.middleware';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

const app = express();

// ---------------- MIDDLEWARE ----------------
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// ---------------- ROUTES ----------------
app.use(`${config.app.basePath}/health`, healthRoutes);
app.use(`${config.app.basePath}/auth`, authRoutes);
app.use(`${config.app.basePath}/tasks`, taskRoutes);
app.use(`${config.app.basePath}/users`, userRoutes);
app.use(`${config.app.basePath}/projects`, projectRoutes);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ---------------- ERROR HANDLING ----------------
app.use(notFoundHandler);
app.use(errorHandler);

// ---------------- START SERVER ----------------
const startServer = async () => {
  try {
    await initializeDatabase();
    console.log('SQL Server connected');

    await connectRedis();
    console.log('Redis connected');

    const port = config.app.port;

    app.listen(port, () => {
      console.log(`API server running on port ${port}`);
    });
  } catch (err) {
    console.error('Server startup failed:', err);
    process.exit(1);
  }
};

startServer();

export default app;