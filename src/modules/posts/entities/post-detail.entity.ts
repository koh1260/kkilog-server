import { Categorie, Comment, User } from '@prisma/client';

export interface DetailPostEntity {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  introduction: string;
  publicScope: string;
  createAt: Date;
  likes: number;
  categorie: Category;
  user: Writer;
  comment: PostComment[];
}

export interface PostComment
  extends Pick<Comment, 'id' | 'content' | 'createAt'> {
  user: Writer;
}

export interface Writer extends Pick<User, 'nickname' | 'profileImage'> {
  nickname: string;
  profileImage: string | null;
}

export type Category = Pick<Categorie, 'categoryName'>;
