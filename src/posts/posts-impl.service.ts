import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { PostsService } from './posts.service';

@Injectable()
export class PostsServiceImp implements PostsService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly postsRepository: PostsRepository,
  ) {}

  async createPost(createPostDto: CreatePostDto, email: string): Promise<void> {
    const user = await this.usersRepository.findOneBy({
      email: email,
    });
    this.existUser(user);

    this.postsRepository.save(
      Post.create(
        createPostDto.title,
        createPostDto.content,
        createPostDto.introdution,
        createPostDto.thumbnail,
        user,
      ),
    );
  }

  private existUser(user: User) {
    if (!user) {
      throw new NotFoundException('존재하지 않는 회원입니다.');
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

  private existPost(post: Post): void {
    if (!post) {
      throw new NotFoundException('존재하지 않는 게시물입니다.');
    }
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
