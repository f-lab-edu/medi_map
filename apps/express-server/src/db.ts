import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// PostgreSQL 연결 설정
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
});

const initializeDB = async () => {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL.');
    client.release();
  } catch (err) {
    console.error('PostgreSQL connection error:', err);
    process.exit(1);
  }
};

initializeDB();

export default pool;
