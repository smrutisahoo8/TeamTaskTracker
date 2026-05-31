import { getConnection } from '../config/database';
import { IUser } from '../interfaces/domain.interface';

export class UserRepository {
  async getById(id: number): Promise<IUser | null> {
    const connection = getConnection();
    const result = await connection.request()
      .input('id', id)
      .query('SELECT * FROM Users WHERE id = @id');
    
    return result.recordset[0] || null;
  }

  async getByEmail(email: string): Promise<IUser | null> {
    const connection = getConnection();
    const result = await connection.request()
      .input('email', email)
      .query('SELECT * FROM Users WHERE email = @email');
    
    return result.recordset[0] || null;
  }

  async create(user: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<IUser> {
    const connection = getConnection();
    const result = await connection.request()
      .input('organizationId', user.organizationId)
      .input('fullName', user.fullName)
      .input('email', user.email)
      .input('passwordHash', user.passwordHash)
      .input('role', user.role)
      .input('isActive', user.isActive)
      .query(
        `INSERT INTO Users (organizationId, fullName, email, passwordHash, role, isActive)
         VALUES (@organizationId, @fullName, @email, @passwordHash, @role, @isActive);
         SELECT * FROM Users WHERE id = SCOPE_IDENTITY()`
      );
    
    return result.recordset[0];
  }

  async updateLastLogin(id: number): Promise<void> {
    const connection = getConnection();
    await connection.request()
      .input('id', id)
      .query('UPDATE Users SET updatedAt = GETUTCDATE() WHERE id = @id');
  }

  async findAll(): Promise<IUser[]> {
    const connection = getConnection();
    const result = await connection.request().query('SELECT * FROM Users');
    return result.recordset;
  }

  async updateRole(id: number, role: string): Promise<IUser> {
    const connection = getConnection();
    const result = await connection.request()
      .input('id', id)
      .input('role', role)
      .query(`
        UPDATE Users
        SET role = @role,
            updatedAt = GETUTCDATE()
        WHERE id = @id;
        SELECT * FROM Users WHERE id = @id;
      `);

    return result.recordset[0];
  }

  async updateStatus(id: number, isActive: boolean): Promise<IUser> {
    const connection = getConnection();
    const result = await connection.request()
      .input('id', id)
      .input('isActive', isActive)
      .query(`
        UPDATE Users
        SET isActive = @isActive,
            updatedAt = GETUTCDATE()
        WHERE id = @id;
        SELECT * FROM Users WHERE id = @id;
      `);

    return result.recordset[0];
  }

  async checkEmailExists(email: string): Promise<boolean> {
    const connection = getConnection();
    const result = await connection.request()
      .input('email', email)
      .query('SELECT COUNT(*) as count FROM Users WHERE email = @email');
    
    return result.recordset[0].count > 0;
  }
}
