import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/request/create-post.dto';
import { UpdatePostDto } from './dto/request/update-post.dto';
import { PostsRepository } from './posts.repository';
import { UsersRepository } from '../users/users.repository';
import { PostsLikeRepository } from './posts-like.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { CategorysRepository } from '../categorys/categorys.repository';
import { CreatePostData } from './type';
import { PostResponseDto } from './dto/response/post-response.dto';
import { PostDetailResponseDto } from './dto/response/post-detail-response.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsLikeRepository: PostsLikeRepository,
    private readonly usersRepository: UsersRepository,
    private readonly categorysRepository: CategorysRepository,
    private readonly postsRepository: PostsRepository,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * @param createPostDto 게시글 작성 DTO
   * @param loginedUserId accessToken에서 추출한 userId
   */
  async createPost(createPostDto: CreatePostDto, loginedUserId: number) {
    const user = await this.usersRepository.findOneById(loginedUserId);
    if (!user) throw new BadRequestException('존재하지 않는 회원입니다.');
    if (user.role != 'ADMIN')
      throw new UnauthorizedException('권한이 없습니다.');

    const { categoryName, ...rest } = createPostDto;
    const category = await this.categorysRepository.findOneByName(categoryName);
    if (!category) throw new NotFoundException('존재하지 않는 카테고리입니다.');

    const postCreateEntity: CreatePostData = {
      ...rest,
      writerId: loginedUserId,
      categoryId: category.id,
    };

    await this.postsRepository.create(postCreateEntity);
  }

  /**
   * @returns 게시글 리스트
   */
  async findAll() {
    const postList = await this.postsRepository.findAll();
    return postList.map((p) => PostResponseDto.from(p));
  }

  /**
   * @param id 게시글 번호
   * @returns 게시글 상세 정보
   */
  async findOne(id: number) {
    const findPost = await this.postsRepository.findDetailById(id);
    if (!findPost) throw new NotFoundException('존재하지 않는 게시물입니다.');

    return PostDetailResponseDto.from(findPost);
  }

  /**
   * @param categoryId 카테고리 번호
   * @returns 해당 카테고리의 게시글 리스트
   */
  async findByCategoryId(categoryId: number) {
    const postList = await this.postsRepository.findByCategoryId(categoryId);
    return postList.map((p) => PostResponseDto.from(p));
  }

  /**
   * @param categoryName 카테고리 이름
   * @returns 해당 카테고리의 게시글 리스트
   */
  async findByCategoryName(categoryName: string) {
    const postList = await this.postsRepository.findByCategoryName(
      categoryName,
    );

    return postList.map((p) => PostResponseDto.from(p));
  }

  /**
   * 좋아요 토글 기능.
   * @param postId 게시글 번호
   * @param userId 회원 번호
   * @returns 변경된 좋아요 수
   */
  async like(postId: number, userId: number) {
    await this.getUserByIdOrThrow(userId);
    await this.getPostByIdOrThrow(postId);

    const liked = await this.postsLikeRepository.findOne(postId, userId);
    let likeCount = await this.postsLikeRepository.count(postId);

    await this.prisma.$transaction(async (prisma) => {
      if (liked) {
        await prisma.postLike.deleteMany({
          where: { postId },
        });
        likeCount--;
      } else {
        await prisma.postLike.create({
          data: {
            postId,
            userId,
          },
        });
        likeCount++;
      }
      await prisma.post.update({
        where: { id: postId },
        data: {
          likes: likeCount,
        },
      });
    });

    return likeCount;
  }

  /**
   * 좋아요 여부 조회.
   * @param postId 게시글 번호
   * @param userId 회원 번호
   * @returns 회원의 해당 게시글 좋아요 여부
   */
  async likeCheck(postId: number, userId: number) {
    await this.getPostByIdOrThrow(postId);
    const liked = await this.postsLikeRepository.findOne(postId, userId);

    return liked ? true : false;
  }

  /**
   * 좋아요 수 조회.
   * @param postId 게시글 번호
   * @returns 해당 게시글의 좋아요 수
   */
  async likeCount(postId: number) {
    const count = (await this.getPostByIdOrThrow(postId)).likes;
    return count;
  }

  /**
   * 이전, 다음 게시글 정보 간단 조회.
   * @param id 게시글 번호
   * @returns 이전, 다음 게시글 정보
   */
  async getOtherPosts(id: number) {
    const prevPost = await this.postsRepository.findPrevious(id);
    const nextPost = await this.postsRepository.findNext(id);

    return [prevPost, nextPost];
  }

  /**
   * @param id 게시글 번호
   * @param userId 회원 번호
   * @param updatePostDto 업데이트 DTO
   * @returns 변경된 게시글 정보
   */
  async update(id: number, userId: number, updatePostDto: UpdatePostDto) {
    const user = await this.getUserByIdOrThrow(userId);
    if (user.role != 'ADMIN')
      throw new UnauthorizedException('권한이 없습니다.');

    await this.getPostByIdOrThrow(id);

    return await this.postsRepository.update(id, updatePostDto);
  }

  /**
   * @param id 게시글 번호
   * @param userId 회원 번호
   */
  async remove(id: number, userId: number): Promise<void> {
    const user = await this.usersRepository.findOneById(userId);
    if (!user) throw new BadRequestException('존재하지 않는 회원입니다.');
    if (user.role !== 'ADMIN')
      throw new UnauthorizedException('권한이 없습니다.');

    await this.getPostByIdOrThrow(id);
    await this.postsRepository.delete(id);
  }

  async getUserByIdOrThrow(userId: number) {
    const user = await this.usersRepository.findOneById(userId);
    if (!user) throw new BadRequestException('존재하지 않는 회원입니다.');

    return user;
  }

  async getPostByIdOrThrow(postId: number) {
    const post = await this.postsRepository.findOneById(postId);
    if (!post) throw new BadRequestException('존재하지 않는 게시물입니다.');

    return post;
  }

  async getCategoryByName(categoryName: string) {
    const category = this.categorysRepository.findOneByName(categoryName);
    if (!category)
      throw new BadRequestException('존재하지 않는 카테고리입니다.');

    return category;
  }
}
