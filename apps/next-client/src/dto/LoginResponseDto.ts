export interface LoginResponseDto {
  id: string;
  email: string;
  token: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    email: string;
  }
}