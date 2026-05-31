import { body, param, validationResult } from 'express-validator';
import { ROLES } from '../constants/roles.constants';

const roleValues = Object.values(ROLES);

export const validateUserRoleUpdate = [
  param('id').isInt({ min: 1 }).withMessage('User ID must be a positive integer'),
  body('role')
    .trim()
    .notEmpty()
    .withMessage('Role is required')
    .isIn(roleValues)
    .withMessage(`Role must be one of: ${roleValues.join(', ')}`),
];

export const validateUserStatusUpdate = [
  param('id').isInt({ min: 1 }).withMessage('User ID must be a positive integer'),
  body('isActive')
    .notEmpty()
    .withMessage('isActive is required')
    .isBoolean()
    .withMessage('isActive must be a boolean value'),
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
