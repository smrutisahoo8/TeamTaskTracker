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

let sqlPoolInstance: ConnectionPool | null = null;
let sqlPoolPromise: Promise<ConnectionPool> | null = null;

export const initializeDatabase = async (): Promise<ConnectionPool> => {
  try {
    if (!sqlPoolPromise) {
      sqlPoolInstance = new ConnectionPool(sqlConfig);
      sqlPoolPromise = sqlPoolInstance.connect().then(() => sqlPoolInstance as ConnectionPool);
      await sqlPoolPromise;
      console.info('Connected to SQL Server successfully (Windows Authentication)');
    }
    return sqlPoolPromise;
  } catch (error) {
    console.error('Failed to connect to SQL Server:', error);
    process.exit(1);
  }
};

export const getConnection = (): ConnectionPool => {
  if (!sqlPoolInstance || !sqlPoolInstance.connected) {
    throw new Error('Database connection not initialized. Call initializeDatabase() first.');
  }
  return sqlPoolInstance;
};

export const sqlPool = initializeDatabase();

export const closeDatabase = async (): Promise<void> => {
  if (sqlPoolPromise && (await sqlPoolPromise).connected) {
    await (await sqlPoolPromise).close();
    console.info('Database connection closed');
  }
};
