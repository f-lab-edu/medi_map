export class EnvError extends Error {
  constructor(variableName: string) {
    super(`Environment variable ${variableName} is not set.`);
    this.name = 'EnvError';
  }
}
