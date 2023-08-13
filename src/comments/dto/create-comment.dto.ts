import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
  @MinLength(1)
  @ApiProperty({ description: '게시글 번호' })
  postId!: number;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  @ApiProperty({ description: '내용' })
  content!: string;

  @MinLength(1)
  @IsOptional()
  @ApiProperty({ description: '부모 댓글 번호' })
  parentId?: number;
}
