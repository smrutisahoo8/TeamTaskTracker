import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/task.service';
import { createSuccessResponse } from '../utils/response.util';

const service = new TaskService();

export class TaskController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.createTask(req.body, req.user);
      res.status(201).json(createSuccessResponse('Task created successfully', result));
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.getTasks(req.query, req.user);
      res.status(200).json(createSuccessResponse('Tasks retrieved successfully', result));
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.getTaskById(Number(req.params.id));
      res.status(200).json(createSuccessResponse('Task retrieved successfully', result));
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.updateTask(Number(req.params.id), req.body, req.user);
      res.status(200).json(createSuccessResponse('Task updated successfully', result));
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.updateStatus(Number(req.params.id), req.body.status, req.user);
      res.status(200).json(createSuccessResponse('Task status updated successfully', result));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.deleteTask(Number(req.params.id));
      res.status(200).json(createSuccessResponse('Task deleted successfully', result));
    } catch (error) {
      next(error);
    }
  }
}
