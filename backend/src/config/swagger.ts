import swaggerJSDoc from 'swagger-jsdoc';
import { config } from './index';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: config.swagger.title,
    version: config.swagger.version,
    description: 'Team Task Tracker API - Phase 2 with Authentication & RBAC.',
  },
  servers: [
    {
      url: 'http://localhost:4000',
      description: 'Local development server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
export default swaggerSpec;
