import { ApiProperty } from '@nestjs/swagger';
import { PostEntity } from '../../entities/post-entity';

export class PostResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  introduction: string;

  @ApiProperty()
  thumbnail: string;

  @ApiProperty()
  createAt: Date;

  @ApiProperty()
  likes: number;

  @ApiProperty()
  commentCount: number;

  constructor(
    postEntity: Omit<PostEntity, '_count'> & { commentCount: number },
  ) {
    this.id = postEntity.id;
    this.title = postEntity.title;
    this.thumbnail = postEntity.thumbnail;
    this.createAt = postEntity.createAt;
    this.likes = postEntity.likes;
    this.introduction = postEntity.introduction;
    this.commentCount = postEntity.commentCount;
  }

  static from(postEntity: PostEntity) {
    const { _count, ...rest } = postEntity;
    const filteredEntity = {
      ...rest,
      commentCount: _count.comment,
    };

    return new PostResponseDto(filteredEntity);
  }
}
