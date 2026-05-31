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
    encrypt: true,
    trustServerCertificate: true,
  },
};

export const sqlPool = new ConnectionPool(sqlConfig);

export const connectDB = async () => {
  if (!sqlPool.connected) {
    await sqlPool.connect();
    console.info('Connected to SQL Server successfully');
  }
  return sqlPool;
};
