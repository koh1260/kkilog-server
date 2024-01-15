import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  @ApiProperty({ description: '내용' })
  readonly content?: string;

  constructor(content: string) {
    this.content = content;
  }

  static create(content: string) {
    return new UpdateCommentDto(content);
  }
}
