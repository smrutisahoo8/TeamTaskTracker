import { getConnection } from '../config/database';
import { IRefreshToken } from '../interfaces/domain.interface';

export class RefreshTokenRepository {
  async create(token: Omit<IRefreshToken, 'id' | 'createdAt'>): Promise<IRefreshToken> {
    const connection = getConnection();
    const result = await connection.request()
      .input('userId', token.userId)
      .input('token', token.token)
      .input('expiresAt', token.expiresAt)
      .input('isRevoked', token.isRevoked)
      .query(
        `INSERT INTO RefreshTokens (userId, token, expiresAt, isRevoked)
         VALUES (@userId, @token, @expiresAt, @isRevoked);
         SELECT * FROM RefreshTokens WHERE id = SCOPE_IDENTITY()`
      );
    
    return result.recordset[0];
  }

  async getByToken(token: string): Promise<IRefreshToken | null> {
    const connection = getConnection();
    const result = await connection.request()
      .input('token', token)
      .query('SELECT * FROM RefreshTokens WHERE token = @token');
    
    return result.recordset[0] || null;
  }

  async revoke(token: string): Promise<void> {
    const connection = getConnection();
    await connection.request()
      .input('token', token)
      .query('UPDATE RefreshTokens SET isRevoked = 1 WHERE token = @token');
  }

  async revokeByUserId(userId: number): Promise<void> {
    const connection = getConnection();
    await connection.request()
      .input('userId', userId)
      .query('UPDATE RefreshTokens SET isRevoked = 1 WHERE userId = @userId AND isRevoked = 0');
  }
}
