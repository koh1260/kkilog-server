import { DetailPost, ListPost, OtherPost } from '../../type';

export type PostResponseDto = ListPost;
export type PostDetailResponseDto = DetailPost;
export type OtherPostResponseDto = [OtherPost | null, OtherPost | null];
