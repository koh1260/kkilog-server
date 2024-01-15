import { Repository } from 'typeorm';
import { Category } from './entities/category-typeorm.entity';
import { CustomRepository } from '../../config/typeorm/custom-repository';

@CustomRepository(Category)
export class CategorysRepository extends Repository<Category> {
  async findAll() {
    return await this.createQueryBuilder('category')
      .select(['category.id', 'category.categoryName', 'category.icon'])
      .addSelect([
        'childCategories.id',
        'childCategories.categoryName',
        'childCategories.icon',
      ])
      .leftJoin('category.childCategories', 'childCategories')
      .where('category.parentCategory IS NULL')
      .getMany();
  }

  async findOneByName(categoryName: string) {
    return await this.findOneBy({
      categoryName: categoryName,
    });
  }
}
