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
    const user = this.existUser(
      await this.usersRepository.findOneByEmail(email),
    );
    const category = this.existCategory(
      await this.categoryRepository.findOneByName(createPostDto.categoryName),
    );

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

  async findByCategory(categoryId: number): Promise<Post[]> {
    const posts = await this.postsRepository.findByCategory(categoryId);
    posts.map((post) => {
      post['commentCount'] = post.comments?.length;
      delete post.comments;
      return post;
    });

    return posts;
  }

  private existPost(post: Post | null): Post {
    if (!post) {
      throw new NotFoundException('존재하지 않는 게시물입니다.');
    }
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    let post = this.existPost(await this.postsRepository.findOneById(id));
    post = {
      ...post,
      ...updatePostDto,
    };

    return this.postsRepository.save(post);
  }

  async remove(id: number): Promise<void> {
    this.existPost(await this.postsRepository.findOneById(id));
    await this.postsRepository.delete(id);
  }
}
