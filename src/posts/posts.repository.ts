import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CustomRepository } from '../common/custom-repository/custom-repository';

@CustomRepository(Post)
export class PostsRepository extends Repository<Post> {
  async findByCategory(categoryId: number): Promise<Post[]> {
    return await this.createQueryBuilder('posts')
      .select([
        'posts.id',
        'posts.title',
        'posts.introduction',
        'posts.thumbnail',
        'posts.createAt',
      ])
      .where('posts.categoryId = :categoryId', { categoryId: categoryId })
      .getMany();
  }

  async findAll() {
    return await this.find({
      select: {
        id: true,
        title: true,
        introduction: true,
        thumbnail: true,
        createAt: true,
      },
    });
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
