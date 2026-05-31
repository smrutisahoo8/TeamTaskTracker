import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { createSuccessResponse } from '../utils/response.util';

const service = new UserService();

export class UserController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.getUsers();
      res.status(200).json(createSuccessResponse('Users retrieved successfully', result));
    } catch (error) {
      next(error);
    }
  }

  async updateRole(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.updateRole(Number(req.params.id), req.body.role);
      res.status(200).json(createSuccessResponse('User role updated successfully', result));
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.setStatus(Number(req.params.id), req.body.isActive);
      res.status(200).json(createSuccessResponse('User status updated successfully', result));
    } catch (error) {
      next(error);
    }
  }
}
