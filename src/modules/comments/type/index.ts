import { Comment, User } from '@prisma/client';

export type CreateCommentData = Pick<
  Comment,
  'content' | 'postId' | 'writerId' | 'parent'
>;

export interface UpdateCommentData extends Pick<Comment, 'id' | 'writerId'> {
  content?: string;
}

export interface CommentEntity
  extends Pick<Comment, 'id' | 'content' | 'createAt'> {
  user: Writer;
}

export interface ChildComment
  extends Pick<Comment, 'id' | 'content' | 'createAt'> {
  user: Writer;
}

export type Writer = Pick<User, 'nickname' | 'profileImage'>;
