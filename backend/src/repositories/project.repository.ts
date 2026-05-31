import { sqlPool } from '../config/database';

export class ProjectRepository {
  async create(project: any) {
    const pool = await sqlPool;
    const result = await pool.request()
      .input('name', project.name)
      .input('description', project.description)
      .input('status', project.status)
      .input('organizationId', project.organizationId)
      .input('createdBy', project.createdBy)
      .query(`
        INSERT INTO Projects
        (Name, Description, Status, OrganizationId, CreatedBy)
        OUTPUT INSERTED.*
        VALUES
        (@name, @description, @status, @organizationId, @createdBy)
      `);

    return result.recordset[0];
  }

  async findById(id: number) {
    const pool = await sqlPool;
    const result = await pool.request()
      .input('id', id)
      .query(`
        SELECT *
        FROM Projects
        WHERE Id = @id
      `);

    return result.recordset[0];
  }

  async findAll(filters: any) {
    const pool = await sqlPool;
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 10;
    const offset = (page - 1) * limit;

    let where = 'WHERE 1=1';
    const request = pool.request();

    if (filters.status) {
      where += ' AND Status = @status';
      request.input('status', filters.status);
    }

    if (filters.organizationId) {
      where += ' AND OrganizationId = @organizationId';
      request.input('organizationId', filters.organizationId);
    }

    const result = await request.query(`
      SELECT *
      FROM Projects
      ${where}
      ORDER BY CreatedAt DESC
      OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY
    `);

    return result.recordset;
  }
}
