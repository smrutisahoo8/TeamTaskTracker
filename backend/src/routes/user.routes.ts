import { Router, Request, Response, NextFunction } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/authenticate';
import { authorizeRoles } from '../middleware/rbac.middleware';
import { validateUserRoleUpdate, validateUserStatusUpdate, validationErrorHandler } from '../validators/user.validator';

const router = Router();
const controller = new UserController();

router.get('/', authenticate, authorizeRoles('ADMIN'), validationErrorHandler, (req: Request, res: Response, next: NextFunction) => controller.getAll(req, res, next));

router.patch(
  '/:id/role',
  authenticate,
  authorizeRoles('ADMIN'),
  validateUserRoleUpdate,
  validationErrorHandler,
  (req: Request, res: Response, next: NextFunction) => controller.updateRole(req, res, next)
);

router.patch(
  '/:id/status',
  authenticate,
  authorizeRoles('ADMIN'),
  validateUserStatusUpdate,
  validationErrorHandler,
  (req: Request, res: Response, next: NextFunction) => controller.updateStatus(req, res, next)
);

export default router;
