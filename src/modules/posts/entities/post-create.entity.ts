import { Post } from '@prisma/client';

export type PostCreateEntity = Pick<
  Post,
  'title' | 'content' | 'introduction' | 'thumbnail' | 'categoryId' | 'writerId'
>;
