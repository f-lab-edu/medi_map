export class EnvError extends Error {
  constructor(variableName: string) {
    super(`환경 변수 ${variableName}가 설정되지 않았습니다.`);
    this.name = 'EnvError';
  }
}