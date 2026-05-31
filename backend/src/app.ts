import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import { config } from './config';
import healthRoutes from './routes/health.routes';
import { requestLogger } from './middleware/logger.middleware';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { connectDB } from './config/db';
import { connectRedis } from './config/redis';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use(config.app.basePath, healthRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(notFoundHandler);
app.use(errorHandler);

connectDB().catch((error) => {
  console.error('SQL Server connection failed:', error);
});

connectRedis().catch((error) => {
  console.error('Redis connection failed:', error);
});

const port = config.app.port;
app.listen(port, () => {
  console.info(`API server is running on port ${port}`);
});

export default app;
