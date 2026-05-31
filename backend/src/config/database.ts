import { ConnectionPool, config as SqlConfig } from 'mssql';
import { config } from './index';

const sqlConfig: SqlConfig = {
  user: config.db.user,
  password: config.db.password,
  server: config.db.server,
  port: config.db.port,
  database: config.db.database,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

let sqlPool: ConnectionPool | null = null;

export const initializeDatabase = async (): Promise<ConnectionPool> => {
  try {
    if (!sqlPool) {
      sqlPool = new ConnectionPool(sqlConfig);
      await sqlPool.connect();
      console.info('Connected to SQL Server successfully (Windows Authentication)');
    }
    return sqlPool;
  } catch (error) {
    console.error('Failed to connect to SQL Server:', error);
    process.exit(1);
  }
};

export const getConnection = (): ConnectionPool => {
  if (!sqlPool || !sqlPool.connected) {
    throw new Error('Database connection not initialized. Call initializeDatabase() first.');
  }
  return sqlPool;
};

export const closeDatabase = async (): Promise<void> => {
  if (sqlPool && sqlPool.connected) {
    await sqlPool.close();
    console.info('Database connection closed');
  }
};
