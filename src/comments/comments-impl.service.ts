import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentsRepository } from './comments.repository';
import { Comment } from './entities/comment.entity';
import { UsersRepository } from '../users/users.repository';
import { PostsRepository } from '../posts/posts.repository';
import { CommentsService } from './comment.service';
import { Post } from '../posts/entities/post.entity';
import { User } from '../users/user.entity';

@Injectable()
export class CommentsServiceImpl implements CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  async createComment(createCommentDto: CreateCommentDto, email: string) {
    const writer = this.existUser(
      await this.usersRepository.findOneByEmail(email),
    );
    const post = this.existPost(
      await this.postsRepository.findOneById(createCommentDto.postId),
    );
    const comment = new Comment(createCommentDto.content, writer, post);

    return await this.commentsRepository.save(comment);
  }

  async findAll() {
    return await this.commentsRepository.findAll();
  }

  async update(
    id: number,
    email: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = this.existComment(
      await this.commentsRepository.findOneById(id),
    );
    await this.validateWriter(comment, email);
    const updatedPost = {
      ...comment,
      ...updateCommentDto,
    };

    return this.commentsRepository.save(updatedPost);
  }

  /**
   * 작성자인지 검증.
   * @param comment 검증할 댓글
   * @param email 작성자와 비교할 이메일
   */
  private async validateWriter(comment: Comment, email: string) {
    const writerEmail = comment.writer.email;
    if (writerEmail !== email) {
      throw new BadRequestException('작성자가 아닙니다.');
    }
  }

  async remove(id: number, email: string) {
    const comment = await this.existComment(
      await this.commentsRepository.findOneById(id),
    );
    await this.validateWriter(comment, email);
    await this.commentsRepository.delete(id);
  }

  /**
   * User 존재 여부 검사.
   * @param user 검사할 회원
   * @returns 검사를 통과한 User 객체
   */
  private existUser(user: User | null): User {
    if (!user) {
      throw new NotFoundException('존재하지 않는 회원입니다.');
    }
    return user;
  }

  /**
   * Post 존재 여부 검사.
   * @param post 검사할 게시글
   * @returns 검사를 통과한 Post 객체
   */
  private existPost(post: Post | null): Post {
    if (!post) {
      throw new NotFoundException('존재하지 않는 게시글입니다.');
    }
    return post;
  }

  /**
   * Comment 존재 여부 검사.
   * @param comment 검사할 댓글
   * @returns 검사를 통과한 Comment 객체
   */
  private existComment(comment: Comment | null): Comment {
    if (!comment) {
      throw new NotFoundException('존재하지 않는 댓글입니다.');
    }
    return comment;
  }
}
