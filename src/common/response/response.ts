import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseEntity<T> {
  @ApiProperty()
  statusCode: HttpStatus;

  @ApiProperty()
  message: string;

  @ApiProperty()
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
