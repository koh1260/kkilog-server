import { Category } from '../../categorys/entities/category.entity';
import { Post } from '../entities/post.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { User } from '../../users/entities/user.entity';

export interface ListPost extends PostPick {
  commentCount: number;
}

export interface DetailPost extends PostDetailPick {
  comments: PostComment[];
  writer: Writer;
  category: Pick<Category, 'categoryName'>;
}

export type OtherPost = Pick<Post, 'id' | 'title'>;

interface PostComment extends CommentPick {
  writer: Writer;
}

type PostPick = Pick<
  Post,
  'id' | 'title' | 'introduction' | 'thumbnail' | 'createAt' | 'likes'
>;

type PostDetailPick = Pick<
  Post,
  | 'id'
  | 'title'
  | 'content'
  | 'thumbnail'
  | 'introduction'
  | 'publicScope'
  | 'createAt'
  | 'likes'
>;

type Writer = Pick<User, 'role' | 'nickname' | 'profileImage'>;

type CommentPick = Pick<Comment, 'id' | 'createAt' | 'content'>;
