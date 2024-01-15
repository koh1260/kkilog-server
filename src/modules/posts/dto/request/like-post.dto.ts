import { MinLength } from 'class-validator';

export class LikePostDto {
  @MinLength(1)
  readonly postId: number;

  @MinLength(1)
  readonly userId: number;

  constructor(postId: number, userId: number) {
    this.postId = postId;
    this.userId = userId;
  }

  static create(postId: number, userId: number) {
    return new LikePostDto(postId, userId);
  }
}
