import { Request, Response } from 'express';
import { createSuccessResponse } from '../utils/response.util';

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
export const healthCheck = (_req: Request, res: Response) => {
  return res.status(200).json(createSuccessResponse('API running'));
};
