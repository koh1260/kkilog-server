import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  @ApiProperty({ description: '내용' })
  content?: string;
}
