import { sqlPool } from '../config/database';

export class TaskRepository {
  async create(task: any) {
    const pool = await sqlPool;

    const result = await pool.request()
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
        OUTPUT INSERTED.*
        VALUES
        (@title, @description, @priority, @status, @assigneeId, @projectId, @createdBy, @dueDate)
      `);

    return result.recordset[0];
  }

  async findById(id: number) {
    const pool = await sqlPool;

    const result = await pool.request()
      .input('id', id)
      .query(`
        SELECT * 
        FROM Tasks 
        WHERE Id = @id AND IsDeleted = 0
      `);

    return result.recordset[0];
  }

  async updateStatus(id: number, status: string) {
    const pool = await sqlPool;

    const result = await pool.request()
      .input('id', id)
      .input('status', status)
      .query(`
        UPDATE Tasks
        SET Status = @status,
            UpdatedAt = GETUTCDATE()
        WHERE Id = @id
        SELECT * FROM Tasks WHERE Id = @id
      `);

    return result.recordset[0];
  }

  async updateTask(id: number, updates: any) {
    const pool = await sqlPool;
    const request = pool.request().input('id', id);
    const fields: string[] = [];

    if (updates.title !== undefined) {
      request.input('title', updates.title);
      fields.push('Title = @title');
    }
    if (updates.description !== undefined) {
      request.input('description', updates.description);
      fields.push('Description = @description');
    }
    if (updates.priority !== undefined) {
      request.input('priority', updates.priority);
      fields.push('Priority = @priority');
    }
    if (updates.assigneeId !== undefined) {
      request.input('assigneeId', updates.assigneeId);
      fields.push('AssigneeId = @assigneeId');
    }
    if (updates.projectId !== undefined) {
      request.input('projectId', updates.projectId);
      fields.push('ProjectId = @projectId');
    }
    if (updates.dueDate !== undefined) {
      request.input('dueDate', updates.dueDate);
      fields.push('DueDate = @dueDate');
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    const updateClause = fields.join(', ');
    const result = await request.query(`
      UPDATE Tasks
      SET ${updateClause}, UpdatedAt = GETUTCDATE()
      WHERE Id = @id
      SELECT * FROM Tasks WHERE Id = @id
    `);

    return result.recordset[0];
  }

  async deleteTask(id: number) {
    const pool = await sqlPool;

    await pool.request()
      .input('id', id)
      .query(`
        UPDATE Tasks
        SET IsDeleted = 1,
            UpdatedAt = GETUTCDATE()
        WHERE Id = @id
      `);
  }

  async findAll(filters: any) {
    const pool = await sqlPool;

    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 10;
    const offset = (page - 1) * limit;

    let where = `WHERE IsDeleted = 0`;
    const request = pool.request();

    if (filters.status) {
      where += ` AND Status = @status`;
      request.input('status', filters.status);
    }

    if (filters.priority) {
      where += ` AND Priority = @priority`;
      request.input('priority', filters.priority);
    }

    if (filters.assigneeId) {
      where += ` AND AssigneeId = @assigneeId`;
      request.input('assigneeId', filters.assigneeId);
    }

    if (filters.projectId) {
      where += ` AND ProjectId = @projectId`;
      request.input('projectId', filters.projectId);
    }

    const result = await request.query(`
      SELECT *
      FROM Tasks
      ${where}
      ORDER BY CreatedAt DESC
      OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY
    `);

    return result.recordset;
  }
}
