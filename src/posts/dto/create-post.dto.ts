import { PublicScope } from '../enumerate/public-scope';

export class CreatePostDto {
  title: string;
  content: string;
  introdution: string;
  thumbnail: string;
  publicScope: PublicScope;
}
