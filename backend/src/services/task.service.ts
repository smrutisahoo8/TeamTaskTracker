import { TaskRepository } from '../repositories/task.repository';
import { STATUS_FLOW } from '../constants/task.constants';
import { getRedisClient } from '../config/redis';

const repo = new TaskRepository();

export class TaskService {
  private cacheKey(userId: number, filters: any) {
    return `tasks:${userId}:${JSON.stringify(filters || {})}`;
  }

  async createTask(data: any, user: any) {
    const result = await repo.create({
      ...data,
      status: 'TODO',
      createdBy: user.userId,
    });

    await this.clearCache(result.AssigneeId);
    return result;
  }

  async getTasks(filters: any, user: any) {
    const requestFilters = { ...filters };
    if (user.role === 'MEMBER') {
      requestFilters.assigneeId = user.userId;
    }

    const key = this.cacheKey(user.userId, requestFilters);
    const redisClient = getRedisClient();

    if (redisClient) {
      const cached = await redisClient.get(key);
      if (cached) return JSON.parse(cached);
    }

    const data = await repo.findAll(requestFilters);

    if (redisClient) {
      await redisClient.setEx(key, 60, JSON.stringify(data));
    }

    return data;
  }

  async getTaskById(taskId: number) {
    const task = await repo.findById(taskId);
    if (!task) {
      throw {
        status: 404,
        code: 'TASK_NOT_FOUND',
        message: 'Task not found',
      };
    }
    return task;
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

    await repo.updateStatus(taskId, newStatus);
    await this.clearCache(task.AssigneeId);

    return { message: 'Status updated successfully' };
  }

  async updateTask(taskId: number, updates: any, user: any) {
    const task = await repo.findById(taskId);

    if (!task) {
      throw {
        status: 404,
        code: 'TASK_NOT_FOUND',
        message: 'Task not found',
      };
    }

    const isManager = user.role === 'MANAGER' || user.role === 'ADMIN';
    const isAssignee = task.AssigneeId === user.userId;

    if (!isManager && !isAssignee) {
      throw {
        status: 403,
        code: 'FORBIDDEN',
        message: 'Not allowed to update this task',
      };
    }

    const updatedTask = await repo.updateTask(taskId, updates);
    await this.clearCache(task.AssigneeId);
    if (updates.assigneeId && updates.assigneeId !== task.AssigneeId) {
      await this.clearCache(updates.assigneeId);
    }

    return updatedTask;
  }

  async deleteTask(taskId: number) {
    const task = await repo.findById(taskId);
    if (!task) {
      throw {
        status: 404,
        code: 'TASK_NOT_FOUND',
        message: 'Task not found',
      };
    }

    await repo.deleteTask(taskId);
    await this.clearCache(task.AssigneeId);

    return { message: 'Task deleted successfully' };
  }

  async clearCache(userId: number) {
    const redisClient = getRedisClient();
    if (!redisClient || !userId) {
      return;
    }

    const keys = await redisClient.keys(`tasks:${userId}:*`);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  }
}
