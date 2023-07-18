import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';
import { User } from '../users/user.entity';
import { Post } from './entities/post.entity';
import { PostsService } from './posts.service';
import { Category } from '../categorys/entities/category.entity';
import { UsersRepository } from '../users/users.repository';
import { CategorysRepository } from '../categorys/categorys.repository';

@Injectable()
export class PostsServiceImp implements PostsService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly categoryRepository: CategorysRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  async createPost(createPostDto: CreatePostDto, email: string): Promise<Post> {
    const user = await this.usersRepository.findOneByEmail(email);
    this.existUser(user);

    const category = await this.categoryRepository.findOneByName(
      createPostDto.categoryName,
    );
    this.existCategory(category);

    return this.postsRepository.save(
      Post.create(
        createPostDto.title,
        createPostDto.content,
        createPostDto.introduction,
        createPostDto.thumbnail,
        user,
        category,
      ),
    );
  }

  private existUser(user: User | null): asserts user is User {
    if (!user) {
      throw new NotFoundException('존재하지 않는 회원입니다.');
    }
  }

  private existCategory(
    category: Category | null,
  ): asserts category is Category {
    if (!category) {
      throw new NotFoundException('존재하지 않는 카테고리입니다.');
    }
  }

  async findAll(): Promise<Post[]> {
    return await this.postsRepository.findAll();
  }

  async findOne(id: number): Promise<Post> {
    const findPost = await this.postsRepository.findOneById(id);
    this.existPost(findPost);

    return findPost;
  }

  async findByCategory(categoryId: number): Promise<Post[]> {
    return await this.postsRepository.findByCategory(categoryId);
  }

  private existPost(post: Post | null): asserts post is Post {
    if (!post) {
      throw new NotFoundException('존재하지 않는 게시물입니다.');
    }
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    let post = await this.postsRepository.findOneById(id);
    this.existPost(post);
    post = {
      ...post,
      ...updatePostDto,
    };

    return this.postsRepository.save(post);
  }

  async remove(id: number): Promise<void> {
    const post = await this.postsRepository.findOneById(id);
    this.existPost(post);

    await this.postsRepository.delete(id);
  }
}
