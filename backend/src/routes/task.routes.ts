import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { authenticate } from '../middleware/authenticate';
import { authorizeRoles } from '../middleware/rbac.middleware';

const router = Router();
const controller = new TaskController();

// Create Task (ADMIN / MANAGER only)
router.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN', 'MANAGER'),
  (req, res, next) => controller.create(req, res, next)
);

// Get all tasks (all authenticated users)
router.get(
  '/',
  authenticate,
  (req, res, next) => controller.getAll(req, res, next)
);

// Update task status (assignee or manager logic inside controller/service)
router.patch(
  '/:id/status',
  authenticate,
  (req, res, next) => controller.updateStatus(req, res, next)
);

export default router;