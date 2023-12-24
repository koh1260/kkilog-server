import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';
import { User } from '../users/user.entity';
import { Post } from './entities/post.entity';
import { PostsService } from './posts.service';
import { Category } from '../categorys/entities/category.entity';
import { UsersRepository } from '../users/users.repository';
import { CategorysRepository } from '../categorys/categorys.repository';
import { PostLike } from './entities/post-like.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsServiceImp implements PostsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(PostLike)
    private readonly postLikeRepository: Repository<PostLike>,
    private readonly usersRepository: UsersRepository,
    private readonly categoryRepository: CategorysRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  async createPost(
    createPostDto: CreatePostDto,
    loginedUserId: number,
  ): Promise<Post> {
    const user = this.existUser(
      await this.usersRepository.findOneById(loginedUserId),
    );
    this.validateRole(user.role);
    const category = this.existCategory(
      await this.categoryRepository.findOneByName(createPostDto.categoryName),
    );

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

  private existUser(user: User | null): User {
    if (!user) {
      throw new NotFoundException('존재하지 않는 회원입니다.');
    }
    return user;
  }

  private existCategory(category: Category | null): Category {
    if (!category) {
      throw new NotFoundException('존재하지 않는 카테고리입니다.');
    }
    return category;
  }

  async findAll(): Promise<Post[]> {
    const posts = await this.postsRepository.findAll();
    posts.map((post) => {
      post['commentCount'] = post.comments?.length;
      delete post.comments;
      return post;
    });

    return posts;
  }

  async findOne(id: number): Promise<Post> {
    const findPost = this.existPost(await this.postsRepository.findOneById(id));

    return findPost;
  }

  async findByCategoryId(categoryId: number): Promise<Post[]> {
    const posts = await this.postsRepository.findByCategoryId(categoryId);
    posts.map((post) => {
      post['commentCount'] = post.comments?.length;
      delete post.comments;
      return post;
    });

    return posts;
  }

  async findByCategoryName(categoryName: string): Promise<Post[]> {
    const posts = await this.postsRepository.findByCategoryName(categoryName);
    posts.map((post) => {
      post['commentCount'] = post.comments?.length;
      delete post.comments;
      return post;
    });

    return posts;
  }

  async like(postId: number, userId: number) {
    // user, post 존재 확인.
    const user = this.existUser(await this.usersRepository.findOneById(userId));
    const post = this.existPost(await this.postsRepository.findOneById(postId));

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
    const post = this.existPost(await this.postsRepository.findOneById(postId));
    const count = post.likes;
    return count;
  }

  async getOtherPosts(id: number): Promise<[Post | null, Post | null]> {
    const prevPost = await this.postsRepository.findPrevious(id);
    const nextPost = await this.postsRepository.findNext(id);

    return [prevPost, nextPost];
  }

  private existPost(post: Post | null): Post {
    if (!post) {
      throw new NotFoundException('존재하지 않는 게시물입니다.');
    }
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    let post = this.existPost(
      await this.postsRepository.findOne({
        where: { id },
        relations: ['category'],
      }),
    );

    const category = this.existCategory(
      await this.categoryRepository.findOne({
        where: { categoryName: updatePostDto.categoryName },
      }),
    );

    post = {
      ...post,
      ...updatePostDto,
      category,
    };

    return this.postsRepository.save(post);
  }

  async remove(id: number): Promise<void> {
    this.existPost(await this.postsRepository.findOneById(id));
    await this.postsRepository.delete(id);
  }
}
