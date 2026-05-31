import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';

const service = new TaskService();

export class TaskController {
  async create(req: Request, res: Response) {
    const result = await service.createTask(req.body, (req as any).user);

    res.json({
      status: 201,
      data: result,
    });
  }

  async getAll(req: Request, res: Response) {
    const result = await service.getTasks(req.query, (req as any).user);

    res.json({
      status: 200,
      data: result,
    });
  }

  async updateStatus(req: Request, res: Response) {
    const result = await service.updateStatus(
      Number(req.params.id),
      req.body.status,
      (req as any).user
    );

    res.json({
      status: 200,
      data: result,
    });
  }
}