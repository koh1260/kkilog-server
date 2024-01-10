import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';
import { User } from '../users/entities/user.entity';
import { Post } from './entities/post.entity';
import { UsersRepository } from '../users/users.repository';
import { CategorysRepository } from '../categorys/categorys.repository';
import { PostLike } from './entities/post-like.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  OtherPostResponseDto,
  PostResponseDto,
} from './dto/response/post-response.dto';
import { PostsPrismaRepository } from './posts-prisma.repository';

@Injectable()
export class PostsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(PostLike)
    private readonly postLikeRepository: Repository<PostLike>,
    private readonly usersRepository: UsersRepository,
    private readonly categoryRepository: CategorysRepository,
    private readonly postsRepository: PostsRepository,
    private readonly postsPrismaRepo: PostsPrismaRepository,
  ) {}

  async createPost(
    createPostDto: CreatePostDto,
    loginedUserId: number,
  ): Promise<Post> {
    const user = await this.usersRepository.findOneById(loginedUserId);

    this.validateUser(user);
    this.validateRole(user.role);

    const category = await this.categoryRepository.findOneByName(
      createPostDto.categoryName,
    );
    if (!category) throw new NotFoundException('존재하지 않는 카테고리입니다.');

    return this.postsRepository.save(
      Post.of(
        createPostDto.title,
        createPostDto.content,
        createPostDto.introduction,
        createPostDto.thumbnail,
        user,
        category,
      ),
    );
  }

  private validateRole(role: 'USER' | 'ADMIN') {
    if (role !== 'ADMIN')
      throw new UnauthorizedException('관리자 권한이 없습니다.');
  }

  // private validateUser(user: User | null): User {
  //   if (!user) throw new NotFoundException('존재하지 않는 회원입니다.');
  //   return user;
  // }

  private validateUser(user: User | null): asserts user is User {
    if (!user) throw new NotFoundException('존재하지 않는 회원입니다.');
  }

  private validatePost(post: Post | null): asserts post is Post {
    if (!post) throw new NotFoundException('존재하지 않는 게시물입니다.');
  }

  // private existCategory(category: Category | null): Category {
  //   if (!category) {
  //     throw new NotFoundException('존재하지 않는 카테고리입니다.');
  //   }
  //   return category;
  // }

  // async findAll(): Promise<ListPost[]> {
  //   return await this.postsRepository.findAll();
  // }

  async findAll() {
    return (await this.postsPrismaRepo.findAll()).map((p) => {
      const { _count, ...rest } = p;
      return {
        ...rest,
        commentCount: _count.comment,
      };
    });
  }

  async findOne(id: number) {
    // const findPost = await this.postsRepository.findDetailById(id);
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

  async findByCategoryId(categoryId: number): Promise<PostResponseDto[]> {
    return await this.postsRepository.findByCategoryId(categoryId);
  }

  async findByCategoryName(categoryName: string): Promise<PostResponseDto[]> {
    return await this.postsRepository.findByCategoryName(categoryName);
  }

  async like(postId: number, userId: number) {
    const user = await this.usersRepository.findOneById(userId);
    this.validateUser(user);

    const post = await this.postsRepository.findOneById(postId);
    this.validatePost(post);

    const liked = await this.postLikeRepository.findOne({
      where: {
        post: { id: postId },
        user: { id: userId },
      },
    });

    const likeCount = await this.postLikeRepository.count({
      where: {
        post: { id: postId },
      },
    });

    await this.dataSource.transaction(async (manager) => {
      if (liked) {
        await manager.delete(PostLike, liked.id);
        post.likes = likeCount - 1;
      } else {
        const like = new PostLike();
        like.user = user;
        like.post = post;
        await manager.save(PostLike, like);
        post.likes = likeCount + 1;
      }
      await manager.save(Post, post);
    });

    return post.likes;
  }

  async likeCheck(postId: number, userId: number) {
    const liked = await this.postLikeRepository.findOne({
      where: {
        post: { id: postId },
        user: { id: userId },
      },
    });

    if (liked) return true;
    return false;
  }

  async likeCount(postId: number) {
    const post = await this.postsRepository.findOneById(postId);
    this.validatePost(post);

    const count = post.likes;
    return count;
  }

  async getOtherPosts(id: number): Promise<OtherPostResponseDto> {
    const prevPost = await this.postsRepository.findPrevious(id);
    const nextPost = await this.postsRepository.findNext(id);

    return [prevPost, nextPost];
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    userId: number,
  ): Promise<Post> {
    const user = await this.usersRepository.findOneById(userId);
    this.validateUser(user);
    this.validateRole(user.role);

    let post = await this.postsRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    this.validatePost(post);

    const category = await this.categoryRepository.findOne({
      where: { categoryName: updatePostDto.categoryName },
    });
    if (!category) throw new NotFoundException('존재하지 않는 카테고리입니다.');

    post = {
      ...post,
      ...updatePostDto,
      category,
    };

    return this.postsRepository.save(post);
  }

  async remove(id: number, userId: number): Promise<void> {
    const user = await this.usersRepository.findOneById(userId);
    if (!user) throw new UnauthorizedException('관리자 권한이 없습니다.');

    this.validateRole(user.role);
    this.validatePost(await this.postsRepository.findOneById(id));
    await this.postsRepository.delete(id);
  }
}
