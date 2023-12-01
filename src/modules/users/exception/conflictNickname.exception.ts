import { HttpException, HttpStatus } from '@nestjs/common';

export class ConflictNicknameException extends HttpException {
  constructor() {
    super(
      {
        message: '이미 존재하는 닉네임입니다.',
        error: 'Conflict nickname',
        statusCode: 409,
      },
      HttpStatus.CONFLICT,
    );
  }
}
