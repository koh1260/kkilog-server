import { ApiProperty } from '@nestjs/swagger';
import { OtherPost } from '../../type';

export class PostOtherResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  constructor(otherPost: OtherPost) {
    this.id = otherPost.id;
    this.title = otherPost.title;
  }

  static from(otherPost: OtherPost) {
    return new PostOtherResponseDto(otherPost);
  }
}
