export interface LoginResponseDto {
  success: boolean;
  email?: string;
  accessToken?: string;
  message?: string;
  status?: number;
}