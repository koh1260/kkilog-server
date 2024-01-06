import { HttpStatus } from '@nestjs/common';

export class ResponseEntity<T> {
  statusCode: HttpStatus;
  message: string;
  result?: T;

  constructor(statusCode: HttpStatus, message: string, result?: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.result = result;
  }

  static create<T>(statusCode: HttpStatus, message: string, result?: T) {
    return new ResponseEntity<T>(statusCode, message, result);
  }
}
