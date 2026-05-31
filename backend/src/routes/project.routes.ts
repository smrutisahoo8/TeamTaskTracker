import { Router, Request, Response, NextFunction } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { authenticate } from '../middleware/authenticate';
import { authorizeRoles } from '../middleware/rbac.middleware';
import { validateProjectCreate, validateProjectQuery, validateProjectId, validationErrorHandler } from '../validators/project.validator';

const router = Router();
const controller = new ProjectController();

router.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN', 'MANAGER'),
  validateProjectCreate,
  validationErrorHandler,
  (req: Request, res: Response, next: NextFunction) => controller.create(req, res, next)
);

router.get(
  '/',
  authenticate,
  validateProjectQuery,
  validationErrorHandler,
  (req: Request, res: Response, next: NextFunction) => controller.getAll(req, res, next)
);

router.get(
  '/:id',
  authenticate,
  validateProjectId,
  validationErrorHandler,
  (req: Request, res: Response, next: NextFunction) => controller.getById(req, res, next)
);

export default router;
