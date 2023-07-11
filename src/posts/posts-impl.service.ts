import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { PostsService } from './posts.service';
import { Category } from '../categorys/entities/category.entity';

@Injectable()
export class PostsServiceImp implements PostsService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly postsRepository: PostsRepository,
  ) {}

  async createPost(createPostDto: CreatePostDto, email: string): Promise<void> {
    const user = await this.usersRepository.findOneBy({
      email: email,
    });
    this.existUser(user);

    const category = await this.categoryRepository.findOneBy({
      name: createPostDto.categoryName,
    });
    this.existCategory(category);

    this.postsRepository.save(
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

  private existUser(user: User) {
    if (!user) {
      throw new NotFoundException('존재하지 않는 회원입니다.');
    }
  }

  private existCategory(category: Category) {
    if (!category) {
      throw new NotFoundException('존재하지 않는 카테고리입니다.');
    }
  }

  async findAll(): Promise<Post[]> {
    console.log('post service');
    return await this.postsRepository.find({
      select: {
        id: true,
        title: true,
        introduction: true,
        thumbnail: true,
        createAt: true,
      },
    });
  }

  async findOne(id: number): Promise<Post> {
    const findPost = await this.postsRepository.findOne({
      select: {
        id: true,
        title: true,
        content: true,
        thumbnail: true,
        createAt: true,
      },
      where: { id: id },
    });
    this.existPost(findPost);

    return findPost;
  }

  async findByCategory(categoryId: number): Promise<Post[]> {
    return await this.postsRepository.findByCategory(categoryId);
  }

  private existPost(post: Post): void {
    if (!post) {
      throw new NotFoundException('존재하지 않는 게시물입니다.');
    }
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  async remove(id: number) {
    await this.postsRepository.delete(id);
  }
}
