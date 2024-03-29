import { Test, TestingModule } from '@nestjs/testing';
import { CustomTypeOrmModule } from '../../config/typeorm/custom-typeorm-module';
import { Category } from '../../modules/categorys/entities/category-typeorm.entity';
import { CategorysRepository } from '../../modules/categorys/categorys-typeorm.repository';
import { TestTypeOrmModule } from '../db/test-db.module';

describe('CategoryRepository', () => {
  let repository: CategorysRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestTypeOrmModule,
        CustomTypeOrmModule.forCustomRepository([CategorysRepository]),
      ],
    }).compile();

    repository = module.get<CategorysRepository>(CategorysRepository);
  });

  it('전체 조회', async () => {
    // given
    const category1 = createCategory(1, 'Back-end');
    const category2 = createCategory(2, 'Front-end');
    const category3 = createCategory(3, 'DevOps');
    const childCategory1 = createCategory(4, 'Nest.js');
    const childCategory2 = createCategory(5, 'Express.js');
    childCategory1.parentCategory = category1;
    childCategory2.parentCategory = category1;
    await repository.save([category1, category2, category3]);
    await repository.save([childCategory1, childCategory2, category3]);

    // when
    const foundCategorys = await repository.findAll();

    // then
    expect(foundCategorys).toHaveLength(3);
    expect(foundCategorys[0].childCategories).toHaveLength(2);
  });

  it('이름으로 조회', async () => {
    // given
    const category = createCategory(2, 'Back-end');
    await repository.save(category);

    // when
    const foundCategory = await repository.findOneByName('Back-end');

    // then
    expect(foundCategory?.id).toEqual(category.id);
    expect(foundCategory?.categoryName).toEqual(category.categoryName);
  });
});

const createCategory = (id: number, name: string) => {
  const category = new Category();
  category.id = id;
  category.categoryName = name;
  category.icon = 'test';

  return category;
};
