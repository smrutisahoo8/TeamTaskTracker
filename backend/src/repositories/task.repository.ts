import { sqlPool } from '../config/database';

export class TaskRepository {
  async create(task: any) {
    const pool = await sqlPool;

    return pool.request()
      .input('title', task.title)
      .input('description', task.description)
      .input('priority', task.priority)
      .input('status', task.status)
      .input('assigneeId', task.assigneeId)
      .input('projectId', task.projectId)
      .input('createdBy', task.createdBy)
      .input('dueDate', task.dueDate)
      .query(`
        INSERT INTO Tasks
        (Title, Description, Priority, Status, AssigneeId, ProjectId, CreatedBy, DueDate)
        VALUES
        (@title, @description, @priority, @status, @assigneeId, @projectId, @createdBy, @dueDate)
      `);
  }

  async findById(id: number) {
    const pool = await sqlPool;

    const result = await pool.request()
      .input('id', id)
      .query('SELECT * FROM Tasks WHERE Id = @id AND IsDeleted = 0');

    return result.recordset[0];
  }

  async updateStatus(id: number, status: string) {
    const pool = await sqlPool;

    return pool.request()
      .input('id', id)
      .input('status', status)
      .query(`
        UPDATE Tasks
        SET Status = @status, UpdatedAt = GETUTCDATE()
        WHERE Id = @id
      `);
  }

  async findAll(filters: any) {
    const pool = await sqlPool;

    let query = `SELECT * FROM Tasks WHERE IsDeleted = 0`;
    const request = pool.request();

    if (filters.status) {
      query += ` AND Status = @status`;
      request.input('status', filters.status);
    }

    if (filters.priority) {
      query += ` AND Priority = @priority`;
      request.input('priority', filters.priority);
    }

    if (filters.assigneeId) {
      query += ` AND AssigneeId = @assigneeId`;
      request.input('assigneeId', filters.assigneeId);
    }

    query += ` ORDER BY CreatedAt DESC`;

    const result = await request.query(query);
    return result.recordset;
  }
}