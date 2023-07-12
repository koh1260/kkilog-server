import { CreatePostDto } from './create-post.dto';
import { PublicScope } from '../enumerate/public-scope';
import { PartialType } from '@nestjs/mapped-types';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  publicScope?: PublicScope;
}
