export class AppError extends Error {
  statusCode: number;
  data?: any;

  constructor(message: string, statusCode: number = 500, data?: any) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
    this.name = "AppError";
  }
}
