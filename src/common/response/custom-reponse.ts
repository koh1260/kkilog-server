import { HttpStatus } from '@nestjs/common';

export class CustomResponse<T> {
  statusCode: HttpStatus;
  message: string;
  result?: T;

  static create<T>(statusCode: HttpStatus, message: string, result?: T) {
    const response = new CustomResponse<T>();
    response.statusCode = statusCode;
    response.message = message;
    response.result = result;

    return response;
  }
}
