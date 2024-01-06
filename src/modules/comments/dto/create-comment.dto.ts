import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  @ApiProperty({ description: '내용' })
  readonly content: string;

  @MinLength(1)
  @IsString()
  @ApiProperty({ description: '게시글 번호' })
  readonly postId: number;

  @IsOptional()
  @MinLength(1)
  @IsString()
  @ApiProperty({ description: '작성자 회원 번호' })
  readonly userId: number;

  @MinLength(1)
  @IsOptional()
  @ApiProperty({ description: '부모 댓글 번호' })
  readonly parentId?: number;

  constructor(
    content: string,
    postId: number,
    userId: number,
    parentId?: number,
  ) {
    this.content = content;
    this.postId = postId;
    this.userId = userId;
    this.parentId = parentId;
  }

  static create(
    content: string,
    postId: number,
    userId: number,
    parentId?: number,
  ) {
    return new CreateCommentDto(content, postId, userId, parentId);
  }
}
