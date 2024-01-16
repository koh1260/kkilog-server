import { Categorie, Comment, User } from '@prisma/client';

export interface DetailPostEntity {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  introduction: string;
  publicScope: 'PUBLIC' | 'PRIVATE';
  createAt: Date;
  likes: number;
  categorie: Category;
  writer: Writer;
  comments: PostComment[];
}

export interface PostComment
  extends Pick<Comment, 'id' | 'content' | 'createAt'> {
  writer: Writer;
}

export interface Writer extends Pick<User, 'nickname' | 'profileImage'> {
  nickname: string;
  profileImage: string;
}

export type Category = Pick<Categorie, 'categoryName'>;
