import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import { config } from './config';
import { initializeDatabase } from './config/database';
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import { requestLogger } from './middleware/logger.middleware';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { connectRedis } from './config/redis';
import dotenv from 'dotenv';
dotenv.config();
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use(`${config.app.basePath}/health`, healthRoutes);
app.use(`${config.app.basePath}/auth`, authRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(notFoundHandler);
app.use(errorHandler);

initializeDatabase().catch((error) => {
  console.error('SQL Server connection failed:', error);
  process.exit(1);
});

connectRedis();

const port = config.app.port;
app.listen(port, () => {
  console.info(`API server is running on port ${port}`);
});

export default app;
