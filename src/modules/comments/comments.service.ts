import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentsRepository } from './comments.repository';
import { Comment } from './entities/comment.entity';
import { UsersTypeormRepository } from '../users/users-typeorm.repository';
import { PostsRepository } from '../posts/posts-typeorm.repository';
import { Post } from '../posts/entities/post.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly UsersTypeormRepository: UsersTypeormRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  async createComment(createCommentDto: CreateCommentDto) {
    const post = this.existPost(
      await this.postsRepository.findOneById(+createCommentDto.postId),
    );

    const writer = this.existUser(
      await this.UsersTypeormRepository.findOneById(+createCommentDto.userId),
    );

    const comment = Comment.create(createCommentDto.content, post, writer);

    if (createCommentDto.parentId) {
      comment.parent = createCommentDto.parentId;
    }

    return await this.commentsRepository.save(comment);
  }

  async findAll(postId: number) {
    this.existPost(await this.postsRepository.findOneById(postId));

    return await this.commentsRepository.findAll(postId);
  }

  async findChildComment(parentId: number): Promise<Comment[]> {
    return this.commentsRepository.findChildCommentByParentId(parentId);
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
      throw new ForbiddenException('작성자가 아닙니다.');
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
