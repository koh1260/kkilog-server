import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  @ApiProperty({ description: '내용' })
  content!: string;

  @MinLength(1)
  @IsString()
  @ApiProperty({ description: '게시글 번호' })
  postId!: string;

  @IsOptional()
  @MinLength(1)
  @IsString()
  @ApiProperty({ description: '작성자 회원 번호' })
  userId!: string;

  @MinLength(1)
  @IsOptional()
  @ApiProperty({ description: '부모 댓글 번호' })
  parentId?: number;
}
