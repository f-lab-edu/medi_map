import pool from '../db';

// 데이터베이스에서 사용자 생성
export const createUser = async (username: string, email: string, password: string) => {
  const result = await pool.query(
    'INSERT INTO "Users" (username, email, password, "createdAt", "updatedAt") VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *',
    [username, email, password]
  );
  return result.rows[0];
};

// 이메일을 통해 사용자 조회
export const findUserByEmail = async (email: string) => {
  const result = await pool.query('SELECT * FROM "Users" WHERE email = $1', [email]);
  return result.rows[0];
};
