import { MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @MinLength(1)
  @MaxLength(30)
  title: string;

  @MinLength(1)
  @MaxLength(30000)
  content: string;

  @MinLength(1)
  @MaxLength(255)
  introduction: string;

  @MinLength(1)
  @MaxLength(3000)
  thumbnail: string;

  @MinLength(1)
  @MaxLength(15)
  categoryName: string;
}
