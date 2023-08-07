import { Test, TestingModule } from '@nestjs/testing';
import { CustomTypeOrmModule } from '../common/custom-repository/custom-typeorm-module';
import { Category } from './entities/category.entity';
import { CategorysRepository } from './categorys.repository';
import { TestTypeOrmModule } from '../common/test-database/test-db.module';

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
    await repository.save([
      category1,
      category2,
      category3,
      childCategory1,
      childCategory2,
    ]);

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

  return category;
};
