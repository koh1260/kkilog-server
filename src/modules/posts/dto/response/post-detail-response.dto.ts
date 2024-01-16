import { ApiProperty } from '@nestjs/swagger';
import {
  Category,
  DetailPostEntity,
  Writer,
} from '../../entities/post-detail.entity';
import { Comment } from '@prisma/client';

interface ConvertedComment
  extends Pick<Comment, 'id' | 'content' | 'createAt'> {
  writer: Writer;
}

export class PostDetailResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  thumbnail: string;

  @ApiProperty()
  introduction: string;

  @ApiProperty()
  publicScope: string;

  @ApiProperty()
  createAt: Date;

  @ApiProperty()
  likes: number;

  @ApiProperty()
  categorie: Category;

  @ApiProperty()
  writer: Writer;

  @ApiProperty()
  comments: ConvertedComment[];

  constructor(
    postDetail: Omit<DetailPostEntity, 'comment'> & {
      comments: ConvertedComment[];
    },
  ) {
    this.id = postDetail.id;
    this.title = postDetail.title;
    this.content = postDetail.content;
    this.thumbnail = postDetail.thumbnail;
    this.introduction = postDetail.introduction;
    this.publicScope = postDetail.publicScope;
    this.createAt = postDetail.createAt;
    this.likes = postDetail.likes;
    this.categorie = postDetail.categorie;
    this.writer = postDetail.user;
    this.comments = postDetail.comments;
  }

  static from(postDetail: DetailPostEntity) {
    const { comment, ...rest } = postDetail;
    const comments =
      comment.length !== 0
        ? comment.map((c) => {
            const { user, ...rest } = c;
            return { writer: { ...user }, ...rest };
          })
        : [];
    return new PostDetailResponseDto({ ...rest, comments });
  }
}
