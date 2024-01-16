import { ApiProperty } from '@nestjs/swagger';
import { CommentEntity, Writer } from '../../type';

export class CommentsResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createAt: Date;

  @ApiProperty()
  writer: Writer;

  constructor(comment: CommentEntity) {
    this.id = comment.id;
    this.content = comment.content;
    this.createAt = comment.createAt;
    this.writer = comment.user;
  }

  static from(comment: CommentEntity) {
    return new CommentsResponseDto(comment);
  }
}
