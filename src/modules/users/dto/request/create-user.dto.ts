import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  @MaxLength(60)
  @IsEmail()
  @ApiProperty({ description: '이메일' })
  readonly email: string;

  @IsString()
  @MinLength(1)
  @MaxLength(15)
  @ApiProperty({ description: '닉네임' })
  readonly nickname: string;

  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  @ApiProperty({ description: '비밀번호' })
  readonly password: string;

  constructor(email: string, nickname: string, password: string) {
    this.email = email;
    this.nickname = nickname;
    this.password = password;
  }

  static create(email: string, nickname: string, password: string) {
    return new CreateUserDto(email, nickname, password);
  }
}
