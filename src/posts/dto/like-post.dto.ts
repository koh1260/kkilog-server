import { MinLength } from 'class-validator';

export class LikePostDto {
  @MinLength(1)
  postId!: number;

  @MinLength(1)
  userId!: number;
}
