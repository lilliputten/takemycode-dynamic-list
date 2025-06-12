export class ArgumentsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ArgumentsError';
  }
}
