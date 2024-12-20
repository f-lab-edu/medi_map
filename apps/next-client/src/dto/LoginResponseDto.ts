export interface LoginResponseDto {
  id: string;
  email: string;
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  }
}