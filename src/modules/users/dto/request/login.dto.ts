import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsString()
  @MinLength(1)
  @MaxLength(60)
  @IsEmail()
  @ApiProperty({ description: '이메일' })
  readonly email: string;

  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  @ApiProperty({ description: '비밀번호' })
  readonly password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  static create(email: string, password: string) {
    return new LoginDto(email, password);
  }
}
