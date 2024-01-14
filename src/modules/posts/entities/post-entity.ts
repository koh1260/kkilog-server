import { ApiProperty } from '@nestjs/swagger';
import { Post } from '@prisma/client';

interface PostEntity
  extends Pick<
    Post,
    'id' | 'title' | 'thumbnail' | 'createAt' | 'likes' | 'introduction'
  > {
  id: number;
  title: string;
  thumbnail: string;
  createAt: Date;
  likes: number;
  introduction: string;
  _count: {
    comment: number;
  };
}

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
