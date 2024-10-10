export interface LoginResponseDto {
  id: number;
  email: string;
  accessToken: string;
  message?: string;
}
