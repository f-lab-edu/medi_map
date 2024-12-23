import dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET!;
export const PORT = parseInt(process.env.PORT || '5000', 10);
export const ENV = process.env.NODE_ENV || 'development';
