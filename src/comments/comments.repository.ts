import { Repository } from 'typeorm';
import { CustomRepository } from '../common/custom-repository/custom-repository';
import { Comment } from './entities/comment.entity';

@CustomRepository(Comment)
export class CommentsRepository extends Repository<Comment> {
  async findAll() {
    return await this.createQueryBuilder('comments')
      .select([
        'comments.id',
        'comments.content',
        'comments.createAt',
        'users.nickname',
        'users.profileImage',
      ])
      .leftJoin('comments.writer', 'users')
      .getMany();
  }

  async findOneById(id: number) {
    return await this.createQueryBuilder('comments')
      .select(['comments', 'users.email'])
      .leftJoin('comments.writer', 'users')
      .where('comments.id=:id', { id: id })
      .getOne();
  }
}
