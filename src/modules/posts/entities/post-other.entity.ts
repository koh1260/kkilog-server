import { Post } from '@prisma/client';

export type OtherPostEntity = Pick<Post, 'id' | 'title'>;
