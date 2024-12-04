import { EnvError } from '@/error/EnvError';

export const checkEnvVariables = () => {
  const requiredEnvVars = [
    'JWT_SECRET',
    'PORT',
    'DB_USER',
    'DB_HOST',
    'DB_NAME',
    'DB_PASSWORD',
    'DB_PORT',
    'FRONTEND_URL',
    'DATA_API_KEY',
  ];

  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      throw new EnvError(varName);
    }
  });
};
