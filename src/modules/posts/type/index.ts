import { Post } from '@prisma/client';

export type CreatePostData = Pick<
  Post,
  'title' | 'content' | 'introduction' | 'thumbnail' | 'categoryId' | 'writerId'
>;

export type OtherPost = Pick<Post, 'id' | 'title'>;
