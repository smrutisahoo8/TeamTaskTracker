import { body, query, param, validationResult } from 'express-validator';

export const validateProjectCreate = [
  body('name').trim().notEmpty().withMessage('Project name is required'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('status')
    .optional()
    .isIn(['ACTIVE', 'ARCHIVED'])
    .withMessage('Status must be either ACTIVE or ARCHIVED'),
];

export const validateProjectQuery = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be an integer >= 1'),
  query('limit').optional().isInt({ min: 1 }).withMessage('limit must be an integer >= 1'),
  query('status')
    .optional()
    .isIn(['ACTIVE', 'ARCHIVED'])
    .withMessage('Status must be either ACTIVE or ARCHIVED'),
];

export const validateProjectId = [
  param('id').isInt({ min: 1 }).withMessage('Project ID must be a positive integer'),
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
