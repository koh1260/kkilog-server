import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @MinLength(1)
  @MaxLength(30)
  @ApiProperty({ description: '제목' })
  title!: string;

  @MinLength(1)
  @MaxLength(30000)
  @ApiProperty({ description: '내용' })
  content!: string;

  @MinLength(1)
  @MaxLength(255)
  @ApiProperty({ description: '소개글' })
  introduction!: string;

  @MinLength(1)
  @MaxLength(3000)
  @ApiProperty({ description: '썸네일' })
  thumbnail!: string;

  @MinLength(1)
  @MaxLength(15)
  @ApiProperty({ description: '카테고리 이름' })
  categoryName!: string;
}
