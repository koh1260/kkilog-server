import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

export interface PostsService {
  /**
   * 게시글 작성.
   * @param createPostDto 게시글 작성에 필요한 데이터
   * @param id accessToken으로 얻은 회원번호
   * @return 생성한 게시글
   */
  createPost(createPostDto: CreatePostDto, id: number): Promise<Post>;

  /**
   * 모든 게시글 조회.
   * @return 게시글 목록
   */
  findAll(): Promise<Post[]>;

  /**
   * 게시글 한 건 조회.
   * @param id 게시글 번호
   * @return 게시글
   */
  findOne(id: number): Promise<Post>;

  /**
   * 카테고리별 게시글 전체 조회.
   * @param categoryId 카테고리 번호
   * @return 해당 카테고리의 게시글 목록
   */
  findByCategoryId(categoryId: number): Promise<Post[]>;

  /**
   * 카테고리별 게시글 전체 조회.
   * @param categoryName 카테고리 이름
   * @return 해당 카테고리의 게시글 목록
   */
  findByCategoryName(categoryName: string): Promise<Post[]>;

  /**
   * 게시글 좋아요.
   * @param postId 게시글 번호
   */
  like(postId: number, userId: number): void;

  /**
   * 이전, 다음 게시글 제목.
   * @param id 게시글 번호
   */
  getOtherPosts(id: number): Promise<[Post | null, Post | null]>;

  /**
   * 게시글 정보 수정.
   * @param id 게시글 번호
   * @param updatePostDto 수정할 내용
   * @return 수정된 게시글
   */
  update(id: number, updatePostDto: UpdatePostDto): Promise<Post>;

  /**
   * 게시글 삭제.
   * @param id 게시글 번호
   */
  remove(id: number): Promise<void>;
}
export const PostsService = Symbol('PostsService');
