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
  email!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(15)
  nickname!: string;

  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  password!: string;
}
