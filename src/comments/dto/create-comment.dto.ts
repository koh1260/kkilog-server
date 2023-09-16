import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

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

  @IsString()
  @MaxLength(10)
  @MinLength(2)
  @ApiProperty({ description: '비회원 닉네임' })
  nickname?: string;

  @IsString()
  @MaxLength(6)
  @MinLength(2)
  @ApiProperty({ description: '비회원 비밀번호' })
  password?: string;
}
