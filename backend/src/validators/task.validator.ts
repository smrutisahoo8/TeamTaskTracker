import { body, param, query, validationResult } from 'express-validator';
import { TaskPriority, TaskStatus } from '../constants/task.constants';

const priorityValues = Object.values(TaskPriority);
const statusValues = Object.values(TaskStatus);

export const validateTaskCreate = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('priority')
    .trim()
    .notEmpty()
    .withMessage('Priority is required')
    .isIn(priorityValues)
    .withMessage(`Priority must be one of: ${priorityValues.join(', ')}`),
  body('assigneeId').optional().isInt({ min: 1 }).withMessage('assigneeId must be a valid user ID'),
  body('projectId').optional().isInt({ min: 1 }).withMessage('projectId must be a valid project ID'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('dueDate must be a valid ISO date')
    .custom((value) => new Date(value) > new Date())
    .withMessage('dueDate must be a future date'),
];

export const validateTaskUpdate = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('priority')
    .optional()
    .isIn(priorityValues)
    .withMessage(`Priority must be one of: ${priorityValues.join(', ')}`),
  body('assigneeId').optional().isInt({ min: 1 }).withMessage('assigneeId must be a valid user ID'),
  body('projectId').optional().isInt({ min: 1 }).withMessage('projectId must be a valid project ID'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('dueDate must be a valid ISO date')
    .custom((value) => new Date(value) > new Date())
    .withMessage('dueDate must be a future date'),
];

export const validateTaskStatusUpdate = [
  param('id').isInt({ min: 1 }).withMessage('Task ID must be a positive integer'),
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .isIn(statusValues)
    .withMessage(`Status must be one of: ${statusValues.join(', ')}`),
];

export const validateTaskQuery = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be an integer >= 1'),
  query('limit').optional().isInt({ min: 1 }).withMessage('limit must be an integer >= 1'),
  query('status')
    .optional()
    .isIn(statusValues)
    .withMessage(`Status must be one of: ${statusValues.join(', ')}`),
  query('priority')
    .optional()
    .isIn(priorityValues)
    .withMessage(`Priority must be one of: ${priorityValues.join(', ')}`),
  query('assigneeId').optional().isInt({ min: 1 }).withMessage('assigneeId must be a valid user ID'),
];

export const validationErrorHandler = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 400,
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      errors: errors.array().map((err: any) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};
