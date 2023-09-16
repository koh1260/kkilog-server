import { Repository } from 'typeorm';
import { CustomRepository } from '../common/custom-repository/custom-repository';
import { Comment } from './entities/comment.entity';

@CustomRepository(Comment)
export class CommentsRepository extends Repository<Comment> {
  async findAll(postId: number) {
    return await this.createQueryBuilder('comment')
      .select([
        'comment.id',
        'comment.content',
        'comment.createAt',
        'comment.nickname',
        'user.nickname',
        'user.profileImage',
      ])
      .leftJoin('comment.writer', 'user')
      .where('comment.post=:postId', { postId })
      .andWhere('comment.parent IS NULL')
      .getMany();
  }

  async findOneById(id: number) {
    return await this.createQueryBuilder('comments')
      .select(['comments', 'users.email'])
      .leftJoin('comments.writer', 'users')
      .where('comments.id=:id', { id: id })
      .getOne();
  }

  async findChildCommentByParentId(parentId: number) {
    return this.createQueryBuilder('comment')
      .select([
        'comment.id',
        'comment.content',
        'comment.createAt',
        'user.nickname',
        'user.profileImage',
      ])
      .leftJoin('comment.writer', 'user')
      .where('comment.parent=:id', { id: parentId })
      .getMany();
  }
}
