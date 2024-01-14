import { ApiProperty } from '@nestjs/swagger';

export class PostLikeCheckResponseDto {
  @ApiProperty()
  liked: boolean;

  constructor(liked: boolean) {
    this.liked = liked;
  }
}
