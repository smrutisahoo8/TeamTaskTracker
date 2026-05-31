import { TaskRepository } from '../repositories/task.repository';
import { STATUS_FLOW } from '../constants/task.constants';
import { redisClient } from '../config/redis';

const repo = new TaskRepository();

export class TaskService {
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
    const key = `tasks:${user.id}:${JSON.stringify(filters)}`;

    const cached = await redisClient.get(key);
    if (cached) return JSON.parse(cached);

    const data = await repo.findAll(filters);

    await redisClient.setEx(key, 60, JSON.stringify(data));

    return data;
  }

  async updateStatus(taskId: number, newStatus: string, user: any) {
    const task = await repo.findById(taskId);

    if (!task) throw new Error('TASK_NOT_FOUND');

    const allowed = STATUS_FLOW[task.Status] || [];

    if (!allowed.includes(newStatus)) {
      throw new Error(`Invalid transition ${task.Status} → ${newStatus}`);
    }

    if (user.role !== 'MANAGER' && task.AssigneeId !== user.id) {
      throw new Error('FORBIDDEN');
    }

    await repo.updateStatus(taskId, newStatus);

    await this.clearCache(task.AssigneeId);

    return { message: 'Updated successfully' };
  }

  async clearCache(userId: number) {
    const keys = await redisClient.keys(`tasks:${userId}:*`);
    if (keys.length) {
      await redisClient.del(keys);
    }
  }
}
