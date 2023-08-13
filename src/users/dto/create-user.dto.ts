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
  email!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(15)
  @ApiProperty({ description: '닉네임' })
  nickname!: string;

  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  @ApiProperty({ description: '비밀번호' })
  password!: string;
}
