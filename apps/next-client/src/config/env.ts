import { EnvError } from '@/error/EnvError';

export function checkEnvVariables() {
  const requiredEnvVars = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'NEXTAUTH_URL', 'NEXTAUTH_SECRET', 'NEXT_PUBLIC_LOCAL_BACKEND_URL', 'NEXT_PUBLIC_KAKAO_MAP_KEY', 'DATA_API_KEY'];

  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new EnvError(varName);
    }
  });
}