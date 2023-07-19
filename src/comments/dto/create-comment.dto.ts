import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
  @MinLength(1)
  postId!: number;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  content!: string;
}
