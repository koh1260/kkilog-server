import { Post } from '@prisma/client';

export interface PostEntity
  extends Pick<
    Post,
    'id' | 'title' | 'thumbnail' | 'createAt' | 'likes' | 'introduction'
  > {
  id: number;
  title: string;
  thumbnail: string;
  createAt: Date;
  likes: number;
  introduction: string;
  _count: {
    comment: number;
  };
}
