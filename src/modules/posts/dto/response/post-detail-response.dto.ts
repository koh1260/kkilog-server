import { ApiProperty } from '@nestjs/swagger';
import {
  Category,
  DetailPostEntity,
  PostComment,
  Writer,
} from '../../entities/post-detail.entity';

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
  publicScope: 'PUBLIC' | 'PRIVATE';

  @ApiProperty()
  createAt: Date;

  @ApiProperty()
  likes: number;

  @ApiProperty()
  categorie: Category;

  @ApiProperty()
  writer: Writer;

  @ApiProperty()
  comments: PostComment[];

  constructor(postDetail: DetailPostEntity) {
    this.id = postDetail.id;
    this.title = postDetail.title;
    this.content = postDetail.content;
    this.thumbnail = postDetail.thumbnail;
    this.introduction = postDetail.introduction;
    this.publicScope = postDetail.publicScope;
    this.createAt = postDetail.createAt;
    this.likes = postDetail.likes;
    this.categorie = postDetail.categorie;
    this.writer = postDetail.writer;
    this.comments = postDetail.comments;
  }

  static from(postDetail: DetailPostEntity) {
    return new PostDetailResponseDto(postDetail);
  }
}
