import sql from 'mssql';
import { config } from './index';

const sqlConfig: sql.config = {
  user: config.db.user,
  password: config.db.password,
  server: config.db.server,
  database: config.db.database,
  port: config.db.port,

  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

export const sqlPool = new sql.ConnectionPool(sqlConfig);

export const connectDB = async () => {
  try {
    console.log("DB CONFIG CHECK:", sqlConfig); // 🔥 IMPORTANT DEBUG

    await sqlPool.connect();

    console.log('Connected to SQL Server successfully');
  } catch (error) {
    console.error('SQL Connection Failed:', error);
    throw error;
  }
};