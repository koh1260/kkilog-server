import { ApiProperty } from '@nestjs/swagger';

export class PostLikeCountResponseDto {
  @ApiProperty()
  likeCount: number;

  constructor(likeCount: number) {
    this.likeCount = likeCount;
  }
}
