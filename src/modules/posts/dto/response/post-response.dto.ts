import { FindOneDto, ListPost, OtherPost } from '../../type';

export type PostResponseDto = ListPost;
export type PostDetailResponseDto = FindOneDto;
export type OtherPostResponseDto = [OtherPost | null, OtherPost | null];
