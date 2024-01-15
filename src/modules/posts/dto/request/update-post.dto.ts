import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import { PartialType } from '@nestjs/mapped-types';

@ApiExtraModels(CreatePostDto)
export class UpdatePostDto extends PartialType(CreatePostDto) {
  categoryId?: number;

  @ApiProperty({ description: '공개 범위' })
  readonly publicScope?: 'PUBLIC' | 'PRIVATE';
}
