import { ChildComment, Writer } from '../../type';

export class ChildCommentsResponseDto {
  id: number;
  content: string;
  createAt: Date;
  writer: Writer;

  constructor(comment: ChildComment) {
    this.id = comment.id;
    this.content = comment.content;
    this.createAt = comment.createAt;
    this.writer = comment.user;
  }

  static from(comment: ChildComment) {
    return new ChildCommentsResponseDto(comment);
  }
}
