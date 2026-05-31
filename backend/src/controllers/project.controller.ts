import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/project.service';
import { createSuccessResponse } from '../utils/response.util';

const service = new ProjectService();

export class ProjectController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.createProject(req.body, req.user);
      res.status(201).json(createSuccessResponse('Project created successfully', result));
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.getProjects(req.query, req.user);
      res.status(200).json(createSuccessResponse('Projects retrieved successfully', result));
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.getProjectById(Number(req.params.id));
      res.status(200).json(createSuccessResponse('Project retrieved successfully', result));
    } catch (error) {
      next(error);
    }
  }
}
