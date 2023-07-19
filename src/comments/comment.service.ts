import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

export interface CommentsService {
  /**
   * 댓글 생성 기능.
   * @param createCommentDto 댓글 생성에 필요한 데이터
   * @param user accessToken으로 얻은 회원 정보
   * @return 생성한 댓글 객체
   */
  createComment(
    createCommentDto: CreateCommentDto,
    email: string,
  ): Promise<Comment>;

  /**
   * 특정 게시물 모든 댓글 조회.
   * @returns 댓글 목록
   */
  findAll(): Promise<Comment[]>;

  /**
   * 댓글 정보 업데이트.
   * @param id 댓글 번호
   * @param email accessToken으로 얻은 회원 email
   * @param updateCommentDto 업데이트할 내용
   * @returns 업데이트된 댓글 객체
   */
  update(
    id: number,
    email: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment>;

  /**
   * 댓글 삭제.
   * @param id 댓글 번호
   * @param email accessToken에서 얻은 회원 이메일
   */
  remove(id: number, email: string): Promise<void>;
}

export const CommentsService = Symbol('CommentsService');
