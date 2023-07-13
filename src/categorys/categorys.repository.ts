import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CustomRepository } from '../common/custom-repository/custom-repository';

@CustomRepository(Category)
export class CategorysRepository extends Repository<Category> {
  async findOneByName(categoryName: string) {
    return await this.findOneBy({
      name: categoryName,
    });
  }
}
