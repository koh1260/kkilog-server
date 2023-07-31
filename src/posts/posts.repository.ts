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
      .where('posts.categoryId = :categoryId', { categoryId: categoryId })
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
    return await this.findOne({
      select: {
        id: true,
        title: true,
        content: true,
        thumbnail: true,
        createAt: true,
      },
      where: { id: id },
    });
  }
}
