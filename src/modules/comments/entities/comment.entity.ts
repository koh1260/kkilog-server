import { Comment } from '@prisma/client';
import { Writer } from '../type';

export interface CommentEntity
  extends Pick<Comment, 'id' | 'content' | 'createAt'> {
  user: Writer;
}
