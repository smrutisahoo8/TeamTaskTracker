import { Router, Request, Response, NextFunction } from 'express';
import { TaskController } from '../controllers/task.controller';
import { authenticate } from '../middleware/authenticate';
import { authorizeRoles } from '../middleware/rbac.middleware';
import { authorizeTaskAccess } from '../middleware/taskAccess.middleware';
import {
  validateTaskCreate,
  validateTaskUpdate,
  validateTaskStatusUpdate,
  validateTaskQuery,
  validationErrorHandler,
} from '../validators/task.validator';

const router = Router();
const controller = new TaskController();

router.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN', 'MANAGER'),
  validateTaskCreate,
  validationErrorHandler,
  (req: Request, res: Response, next: NextFunction) => controller.create(req, res, next)
);

router.get(
  '/',
  authenticate,
  validateTaskQuery,
  validationErrorHandler,
  (req: Request, res: Response, next: NextFunction) => controller.getAll(req, res, next)
);

router.get(
  '/:id',
  authenticate,
  authorizeTaskAccess('ADMIN', 'MANAGER'),
  (req: Request, res: Response, next: NextFunction) => controller.getById(req, res, next)
);

router.put(
  '/:id',
  authenticate,
  authorizeTaskAccess('ADMIN', 'MANAGER'),
  validateTaskUpdate,
  validationErrorHandler,
  (req: Request, res: Response, next: NextFunction) => controller.update(req, res, next)
);

router.patch(
  '/:id/status',
  authenticate,
  authorizeTaskAccess('ADMIN', 'MANAGER'),
  validateTaskStatusUpdate,
  validationErrorHandler,
  (req: Request, res: Response, next: NextFunction) => controller.updateStatus(req, res, next)
);

router.delete(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN', 'MANAGER'),
  (req: Request, res: Response, next: NextFunction) => controller.delete(req, res, next)
);

export default router;
