import { TaskRepository } from '../repositories/task.repository';
import { STATUS_FLOW } from '../constants/task.constants';
import { redisClient } from '../config/redis';

const repo = new TaskRepository();

export class TaskService {

  private cacheKey(userId: number, filters: any) {
    return `tasks:${userId}:${JSON.stringify(filters || {})}`;
  }

  async createTask(data: any, user: any) {
    const result = await repo.create({
      ...data,
      status: 'TODO',
      createdBy: user.id,
    });

    await this.clearCache(user.id);
    return result;
  }

  async getTasks(filters: any, user: any) {
    const key = this.cacheKey(user.id, filters);

    const cached = await redisClient.get(key);
    if (cached) return JSON.parse(cached);

    const data = await repo.findAll(filters);

    await redisClient.setEx(key, 60, JSON.stringify(data));

    return data;
  }

  async updateStatus(taskId: number, newStatus: string, user: any) {
    const task = await repo.findById(taskId);

    if (!task) {
      throw {
        status: 404,
        code: 'TASK_NOT_FOUND',
        message: 'Task not found',
      };
    }

    const allowed = STATUS_FLOW[task.Status] || [];

    if (!allowed.includes(newStatus)) {
      throw {
        status: 400,
        code: 'INVALID_STATUS_TRANSITION',
        message: `Invalid transition ${task.Status} → ${newStatus}`,
      };
    }

    const isManager = user.role === 'MANAGER';
    const isAssignee = task.AssigneeId === user.id;

    if (!isManager && !isAssignee) {
      throw {
        status: 403,
        code: 'FORBIDDEN',
        message: 'Not allowed to update task status',
      };
    }

    await repo.updateStatus(taskId, newStatus);

    await this.clearCache(task.AssigneeId);

    return { message: 'Updated successfully' };
  }

  async clearCache(userId: number) {
    const keys = await redisClient.keys(`tasks:${userId}:*`);

    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  }
}