import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// PostgreSQL 데이터베이스 연결 설정
const pool = new Pool({
  user: process.env.DB_USER as string,
  host: process.env.DB_HOST as string,
  database: process.env.DB_NAME as string,
  password: process.env.DB_PASSWORD as string,
  port: Number(process.env.DB_PORT),
});

export default pool;
