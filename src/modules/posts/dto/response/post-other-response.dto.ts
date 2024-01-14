import { OtherPostEntity } from '../../entities/post-other.entity';

export class PostOtherResponseDto {
  id: number;
  title: string;

  constructor(otherPost: OtherPostEntity) {
    this.id = otherPost.id;
    this.title = otherPost.title;
  }

  static from(otherPost: OtherPostEntity) {
    return new PostOtherResponseDto(otherPost);
  }
}
