import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UsersTypeormRepository } from '../users/users-typeorm.repository';
import { CategorysRepository } from '../categorys/categorys.repository';
import { OtherPostResponseDto } from './dto/response/post-response.dto';
import { PostsPrismaRepository } from './posts-prisma.repository';
import { PostResponseDto } from './entities/post-entity';
import { PostCreateEntity } from './entities/post-create.entity';
import { UsersRepository } from '../users/users.repository';
import { PostsLikeRepository } from './posts-like.repository';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsLikeRepository: PostsLikeRepository,
    private readonly usersRepository: UsersRepository,
    private readonly UsersTypeormRepository: UsersTypeormRepository,
    private readonly categoryRepository: CategorysRepository,
    private readonly postsPrismaRepo: PostsPrismaRepository,
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
    const category = await this.categoryRepository.findOneByName(categoryName);
    if (!category) throw new NotFoundException('존재하지 않는 카테고리입니다.');

    const postCreateEntity: PostCreateEntity = {
      ...rest,
      writerId: loginedUserId,
      categoryId: category.id,
    };

    await this.postsPrismaRepo.create(postCreateEntity);
  }

  /**
   * @returns 게시글 리스트
   */
  async findAll() {
    const postList = await this.postsPrismaRepo.findAll();
    return postList.map((p) => PostResponseDto.from(p));
  }

  /**
   * @param id 게시글 번호
   * @returns 게시글 상세 정보
   */
  async findOne(id: number) {
    const findPost = await this.postsPrismaRepo.findDetailById(id);

    if (!findPost) throw new NotFoundException('존재하지 않는 게시물입니다.');

    const { comment, user, ...rest } = findPost;
    const writer = { ...user };
    const comments =
      comment.length > 0
        ? comment.map((c) => {
            const { user, ...rest } = c;
            const writer = { ...user };
            return { ...rest, writer };
          })
        : [];

    return { ...rest, writer, comments };
  }

  /**
   * @param categoryId 카테고리 번호
   * @returns 해당 카테고리의 게시글 리스트
   */
  async findByCategoryId(categoryId: number) {
    const postList = await this.postsPrismaRepo.findByCategoryId(categoryId);
    return postList.map((p) => PostResponseDto.from(p));
  }

  /**
   * @param categoryName 카테고리 이름
   * @returns 해당 카테고리의 게시글 리스트
   */
  async findByCategoryName(categoryName: string) {
    const postList = await this.postsPrismaRepo.findByCategoryName(
      categoryName,
    );
    return postList.map((p) => PostResponseDto.from(p));
  }

  /**
   * 좋아요 토글 기능.
   * @param postId 게시글 번호
   * @param userId 회원 번호
   */
  async like(postId: number, userId: number) {
    const user = await this.usersRepository.findOneById(userId);
    if (!user) throw new BadRequestException('존재하지 않는 회원입니다');

    const post = await this.postsPrismaRepo.findOneById(postId);
    if (!post) throw new BadRequestException('존재하지 않는 게시물입니다.');

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
    if (await this.postsLikeRepository.findOne(postId, userId)) return true;
    return false;
  }

  /**
   * 좋아요 수 조회.
   * @param postId 게시글 번호
   * @returns 해당 게시글의 좋아요 수
   */
  async likeCount(postId: number) {
    const post = await this.postsPrismaRepo.findOneById(postId);
    if (!post) throw new BadRequestException('존재하지 않는 게시물입니다.');

    const count = post.likes;
    return count;
  }

  /**
   * 이전, 다음 게시글 정보 간단 조회.
   * @param id 게시글 번호
   * @returns 이전, 다음 게시글 정보
   */
  async getOtherPosts(id: number): Promise<OtherPostResponseDto> {
    const prevPost = await this.postsPrismaRepo.findPrevious(id);
    const nextPost = await this.postsPrismaRepo.findNext(id);

    return [prevPost, nextPost];
  }

  /**
   * @param id 게시글 번호
   * @param userId 회원 번호
   * @param updatePostDto 업데이트 DTO
   * @returns 변경된 게시글 정보
   */
  async update(id: number, userId: number, updatePostDto: UpdatePostDto) {
    const user = await this.UsersTypeormRepository.findOneById(userId);
    if (!user) throw new BadRequestException('존재하지 않는 회원입니다.');
    if (user.role != 'ADMIN')
      throw new UnauthorizedException('권한이 없습니다.');

    const post = await this.postsPrismaRepo.findOneById(id);
    if (!post) throw new BadRequestException('존재하지 않는 게시물입니다.');

    return await this.postsPrismaRepo.update(id, updatePostDto);
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

    const post = await this.postsPrismaRepo.findOneById(id);
    if (!post) throw new BadRequestException('존재하지 않는 게시물입니다.');
    await this.postsPrismaRepo.delete(id);
  }
}
