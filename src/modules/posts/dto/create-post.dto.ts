import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @MinLength(1)
  @MaxLength(60)
  @ApiProperty({ description: '제목' })
  readonly title: string;

  @MinLength(1)
  @MaxLength(30000)
  @ApiProperty({ description: '내용' })
  readonly content: string;

  @MinLength(1)
  @MaxLength(255)
  @ApiProperty({ description: '소개글' })
  readonly introduction: string;

  @MinLength(1)
  @MaxLength(3000)
  @ApiProperty({ description: '썸네일' })
  readonly thumbnail: string;

  @MinLength(1)
  @MaxLength(15)
  @ApiProperty({ description: '카테고리 이름' })
  readonly categoryName: string;

  constructor(
    title: string,
    content: string,
    introduction: string,
    thumbnail: string,
    categoryName: string,
  ) {
    this.title = title;
    this.content = content;
    this.introduction = introduction;
    this.thumbnail = thumbnail;
    this.categoryName = categoryName;
  }

  static create(
    title: string,
    content: string,
    introduction: string,
    thumbnail: string,
    categoryName: string,
  ) {
    return new CreatePostDto(
      title,
      content,
      introduction,
      thumbnail,
      categoryName,
    );
  }
}
