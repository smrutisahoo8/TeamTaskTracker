import { Request, Response, NextFunction } from 'express';
import { TaskRepository } from '../repositories/task.repository';
import { createErrorResponse } from '../utils/response.util';
import { ROLES } from '../constants/roles.constants';

const taskRepository = new TaskRepository();

export const authorizeTaskAccess = (...allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json(createErrorResponse(401, 'UNAUTHORIZED', 'User not authenticated'));
    }

    const taskId = Number(req.params.id);
    if (!Number.isInteger(taskId) || taskId <= 0) {
      return res.status(400).json(createErrorResponse(400, 'INVALID_TASK_ID', 'Task ID must be a positive integer'));
    }

    const task = await taskRepository.findById(taskId);
    if (!task) {
      return res.status(404).json(createErrorResponse(404, 'TASK_NOT_FOUND', 'Task not found'));
    }

    const isAssignee = task.AssigneeId === user.userId;
    const isAllowedRole = allowedRoles.includes(user.role) || user.role === ROLES.ADMIN;

    if (!isAllowedRole && !isAssignee) {
      return res.status(403).json(createErrorResponse(403, 'FORBIDDEN', 'Access denied to this task'));
    }

    next();
  };
};
