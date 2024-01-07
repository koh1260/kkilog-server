import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CustomRepository } from '../../config/typeorm/custom-repository';
import { DetailPost, ListPost, OtherPost } from './type';

@CustomRepository(Post)
export class PostsRepository extends Repository<Post> {
  async findByCategoryId(categoryId: number): Promise<ListPost[]> {
    return await this.createQueryBuilder('post')
      .select([
        'post.id AS id',
        'post.title AS title',
        'post.introduction AS introduction',
        'post.thumbnail AS thumbnail',
        'post.createAt AS createAt',
        'post.likes AS likes',
      ])
      .addSelect('COUNT(*) AS commentCount')
      .leftJoin('post.comments', 'comment')
      .where('post.category = :categoryId', { categoryId: categoryId })
      .groupBy('post.id')
      .getRawMany<ListPost>();
  }

  async findByCategoryName(categoryName: string): Promise<ListPost[]> {
    return await this.createQueryBuilder('post')
      .select([
        'post.id AS id',
        'post.title AS title',
        'post.introduction AS introduction',
        'post.thumbnail AS thumbnail',
        'post.createAt AS createAt',
        'post.likes AS likes',
      ])
      .addSelect('COUNT(*) AS commentCount')
      .leftJoin('post.comments', 'comment')
      .leftJoin('post.category', 'category')
      .leftJoin('category.parentCategory', 'parentCategory')
      .where('category.categoryName = :categoryName', {
        categoryName: categoryName,
      })
      .orWhere('parentCategory.categoryName = :categoryName', {
        categoryName: categoryName,
      })
      .orderBy('post.createAt', 'DESC')
      .groupBy('post.id')
      .getRawMany<ListPost>();
  }

  async findAll(): Promise<ListPost[]> {
    return await this.createQueryBuilder('post')
      .select([
        'post.id AS id',
        'post.title AS title',
        'post.introduction AS introduction',
        'post.thumbnail AS thumbnail',
        'post.createAt AS createAt',
        'post.likes AS likes',
      ])
      .addSelect('COUNT(*) AS commentCount')
      .leftJoin('post.comments', 'comment')
      .orderBy('post.createAt', 'DESC')
      .groupBy('post.id')
      .getRawMany<ListPost>();
  }

  async findOneById(id: number): Promise<Post | null> {
    return this.findOne({ where: { id } });
  }

  async findDetailById(id: number): Promise<DetailPost | undefined> {
    return await this.createQueryBuilder('post')
      .select([
        'post.id AS id',
        'post.title AS title',
        'post.content AS content',
        'post.thumbnail AS thumbnail',
        'post.introduction AS introduction',
        'post.publicScope AS publicScope',
        'post.createAt AS createAt',
        'post.likes AS likes',
      ])
      .addSelect([
        'comment.id AS id',
        'comment.content AS content',
        'comment.createAt AS createAt',
      ])
      .addSelect([
        'postUser.nickname AS nickname',
        'postUser.profileImage AS profileImage',
      ])
      .addSelect(['category.categoryName AS categoryName'])
      .addSelect([
        'commentUser.nickname AS nickname',
        'commentUser.profileImage AS profileImage',
      ])
      .leftJoin('post.comments', 'comment')
      .leftJoin('post.writer', 'postUser')
      .leftJoin('post.category', 'category')
      .leftJoin('comment.writer', 'commentUser')
      .where('post.id=:id', { id })
      .getRawOne<DetailPost>();
  }

  async findPrevious(id: number): Promise<OtherPost | null> {
    return (
      (await this.createQueryBuilder('post')
        .select(['post.id AS id', 'post.title AS title'])
        .where('post.id<:id', { id })
        .orderBy('post.id', 'DESC')
        .limit(1)
        .getRawOne<OtherPost>()) || null
    );
  }

  async findNext(id: number): Promise<OtherPost | null> {
    return (
      (await this.createQueryBuilder('post')
        .select(['post.id AS id', 'post.title AS title'])
        .where('post.id>:id', { id })
        .orderBy('post.id', 'ASC')
        .limit(1)
        .getRawOne<OtherPost>()) || null
    );
  }
}
