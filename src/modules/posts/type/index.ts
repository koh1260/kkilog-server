import { Post } from '../entities/post.entity';
import { Comment } from '../../comments/entities/comment-typeorm.entity';

export interface ListPost extends PostPick {
  commentCount: number;
}

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

type CommentPick = Pick<Comment, 'id' | 'createAt' | 'content'>;

export type FindAllDto = ListPostItem[];
export type PostLikeCountDto = {
  likeCount: number;
};
export type FindOneDto = DetailPost;
export type OtherPostDto = [OtherPost, OtherPost];

interface ListPostItem {
  id: number;
  title: string;
  introduction: string;
  thumbnail: string;
  createAt: Date;
  likes: number;
  commentCount: number;
}

export interface DetailPost {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  introduction: string;
  publicScope: 'PUBLIC' | 'PRIVATE';
  createAt: Date;
  likes: number;
  categorie: {
    categoryName: string;
  };
  writer: Writer;
  comments: PostComment[];
}

interface PostComment {
  id: number;
  content: string;
  createAt: Date;
  writer: Writer;
}

interface Writer {
  nickname: string;
  profileImage: string;
}

export interface OtherPost {
  id: number;
  title: string;
}
