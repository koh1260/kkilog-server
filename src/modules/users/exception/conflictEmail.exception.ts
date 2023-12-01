import { HttpException, HttpStatus } from '@nestjs/common';

export class ConflictEmailException extends HttpException {
  constructor() {
    super(
      {
        message: '이미 존재하는 이메일입니다.',
        error: 'Conflict email',
        statusCode: 409,
      },
      HttpStatus.CONFLICT,
    );
  }
}
