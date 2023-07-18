import { HttpStatus } from '@nestjs/common';

export class CustomResponse<T> {
  statusCode: HttpStatus;
  message: string;
  result?: T;

  constructor(statusCode: HttpStatus, message: string, result?: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.result = result;
  }

  static create<T>(statusCode: HttpStatus, message: string, result?: T) {
    return new CustomResponse<T>(statusCode, message, result);
  }
}
