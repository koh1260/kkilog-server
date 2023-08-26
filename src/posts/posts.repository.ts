import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CustomRepository } from '../common/custom-repository/custom-repository';

@CustomRepository(Post)
export class PostsRepository extends Repository<Post> {
  async findByCategoryId(categoryId: number): Promise<Post[]> {
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

  async findByCategoryName(categoryName: string): Promise<Post[]> {
    return await this.createQueryBuilder('post')
      .select([
        'post.id',
        'post.title',
        'post.introduction',
        'post.thumbnail',
        'post.createAt',
        'post.likes',
      ])
      .leftJoinAndSelect('post.comments', 'comment')
      .leftJoin('post.category', 'category')
      .leftJoin('category.parentCategory', 'parentCategory')
      .where('category.categoryName = :categoryName', {
        categoryName: categoryName,
      })
      .orWhere('parentCategory.categoryName = :categoryName', {
        categoryName: categoryName,
      })
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
        'post.likes',
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
      .addSelect(['postUser.nickname'])
      .addSelect(['commentUser.nickname'])
      .leftJoin('post.comments', 'comment')
      .leftJoin('post.writer', 'postUser')
      .leftJoin('comment.writer', 'commentUser')
      .where('post.id=:id', { id })
      .getOne();
  }

  async findPrevious(id: number) {
    return await this.createQueryBuilder('post')
      .select(['post.id', 'post.title'])
      .where('post.id<:id', { id })
      .orderBy('post.id', 'DESC')
      .limit(1)
      .getOne();
  }

  async findNext(id: number) {
    return await this.createQueryBuilder('post')
      .select(['post.id', 'post.title'])
      .where('post.id>:id', { id })
      .orderBy('post.id', 'ASC')
      .limit(1)
      .getOne();
  }
}
