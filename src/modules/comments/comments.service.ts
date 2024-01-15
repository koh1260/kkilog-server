import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentsRepository } from './comments.repository';
import { UsersRepository } from '../users/users.repository';
import { PostsRepository } from '../posts/posts.repository';
import { CreateCommentData, UpdateCommentData } from './type';
import { CommentsResponseDto } from './dto/response/comment-response.dto';
import { ChildCommentsResponseDto } from './dto/response/comment-child-response.dto';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  async createComment(createCommentDto: CreateCommentDto) {
    const { postId, userId, parentId, content } = createCommentDto;

    const post = await this.postsRepository.findOneById(postId);
    if (!post) throw new BadRequestException('존재하지 않는 게시물입니다.');

    const writer = await this.usersRepository.findOneById(userId);
    if (!writer) throw new BadRequestException('존재하지 않는 회원입니다.');

    const commentData: CreateCommentData = {
      writerId: userId,
      postId,
      content,
      parent: parentId,
    };

    return await this.commentsRepository.create(commentData);
  }

  async findAll(postId: number) {
    const post = await this.postsRepository.findOneById(postId);
    if (!post) throw new BadRequestException('존재하지 않는 게시물입니다.');

    return (await this.commentsRepository.findAll(postId)).map((c) =>
      CommentsResponseDto.from(c),
    );
  }

  async findChildComment(parentId: number) {
    return (
      await this.commentsRepository.findChildCommentByParentId(parentId)
    ).map((c) => ChildCommentsResponseDto.from(c));
  }

  async update(id: number, userId: number, updateCommentDto: UpdateCommentDto) {
    const { content } = updateCommentDto;

    const comment = await this.commentsRepository.findOneById(id);
    if (!comment) throw new BadRequestException('존재하지 않는 댓글입니다.');

    const user = await this.usersRepository.findOneById(userId);
    if (!user) throw new BadRequestException('존재하지 않는 회원입니다.');
    if (comment.writerId !== user.id)
      throw new UnauthorizedException('권한이 없습니다.');

    const updateData: UpdateCommentData = {
      id,
      content,
      writerId: userId,
    };

    await this.commentsRepository.update(updateData);
  }

  async remove(id: number, userId: number) {
    const comment = await this.commentsRepository.findOneById(id);
    if (!comment) throw new BadRequestException('존재하지 않는 댓글입니다.');

    const user = await this.usersRepository.findOneById(userId);
    if (!user) throw new BadRequestException('존재하지 않는 회원입니다.');
    if (comment.writerId !== user.id)
      throw new UnauthorizedException('권한이 없습니다.');

    await this.commentsRepository.delete(id);
  }
}
