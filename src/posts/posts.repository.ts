import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CustomRepository } from '../common/custom-repository/custom-repository';

@CustomRepository(Post)
export class PostsRepository extends Repository<Post> {
  async findByCategory(categoryId: number): Promise<Post[]> {
    return await this.createQueryBuilder('post')
      .select([
        'post.id',
        'post.title',
        'post.introduction',
        'post.thumbnail',
        'post.createAt',
      ])
      .leftJoinAndSelect('post.comments', 'comment')
      .where('post.category = :categoryId', { categoryId: categoryId })
      .getMany();
  }

  async findAll() {
    return await this.createQueryBuilder('post')
      .select([
        'post.id',
        'post.title',
        'post.introduction',
        'post.thumbnail',
        'post.createAt',
      ])
      .leftJoinAndSelect('post.comments', 'comment')
      .getMany();
  }

  async findOneById(id: number) {
    return await this.createQueryBuilder('post')
      .select([
        'post.id',
        'post.title',
        'post.content',
        'post.thumbnail',
        'post.createAt',
      ])
      .addSelect(['comment.id', 'comment.content', 'comment.createAt'])
      .addSelect(['user.nickname'])
      .leftJoin('post.comments', 'comment')
      .leftJoin('comment.writer', 'user')
      .where('post.id=:id', { id })
      .getOne();
  }
}
