import { Test, TestingModule } from '@nestjs/testing';
import { Category } from '../../modules/categorys/entities/category.entity';
import { User } from '../../modules/users/user.entity';
import { Post } from '../../modules/posts/entities/post.entity';
import { PostsRepository } from '../../modules/posts/posts.repository';
import { TestTypeOrmModule } from '../db/test-db.module';
import { CustomTypeOrmModule } from '../../config/typeorm/custom-typeorm-module';
import { UsersRepository } from '../../modules/users/users.repository';
import { CategorysRepository } from '../../modules/categorys/categorys.repository';

describe('PostsRepository', () => {
  let postsRepository: PostsRepository;
  let usersRepository: UsersRepository;
  let categorysRepository: CategorysRepository;
  let writer: User;
  let category: Category;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestTypeOrmModule,
        CustomTypeOrmModule.forCustomRepository([
          PostsRepository,
          UsersRepository,
          CategorysRepository,
        ]),
      ],
    }).compile();

    postsRepository = module.get<PostsRepository>(PostsRepository);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    categorysRepository = module.get<CategorysRepository>(CategorysRepository);

    writer = User.create('test@test.com', 'nickname', 'password');
    await usersRepository.save(writer);
    category = createCategory(7, 'Nest.js');
    category.icon = 'test';
    await categorysRepository.save(category);
  });

  it('카테고리 번호로 전체 조회', async () => {
    // given
    const post1 = createPost(1, writer, category);
    const post2 = createPost(2, writer, category);
    const post3 = createPost(3, writer, category);
    await postsRepository.save([post1, post2, post3]);

    // when
    const posts = await postsRepository.findByCategoryId(category.id);

    // then
    expect(posts).toHaveLength(3);
  });

  it('카테고리 이름으로 전체 조회', async () => {
    // given
    const post1 = createPost(1, writer, category);
    const post2 = createPost(2, writer, category);
    const post3 = createPost(3, writer, category);
    await postsRepository.save([post1, post2, post3]);

    // when
    const posts = await postsRepository.findByCategoryName(
      category.categoryName,
    );

    // then
    expect(posts).toHaveLength(3);
  });

  it('한 건 조회', async () => {
    // given
    const post = createPost(3, writer, category);
    await postsRepository.save(post);

    // when
    const foundPost = await postsRepository.findOneById(3);

    // then
    expect(foundPost?.title).toEqual(post.title);
  });

  it('전체 조회', async () => {
    // given
    const post1 = createPost(1, writer, category);
    const post2 = createPost(2, writer, category);
    const post3 = createPost(3, writer, category);
    await postsRepository.save([post1, post2, post3]);

    // when
    const posts = await postsRepository.findAll();

    // then
    expect(posts).toHaveLength(3);
  });

  it('이전 글 조회', async () => {
    // given
    const post1 = createPost(1, writer, category);
    const post2 = createPost(2, writer, category);
    const post3 = createPost(4, writer, category);
    const post4 = createPost(8, writer, category);
    await postsRepository.save([post1, post2, post3, post4]);

    // when
    const post = await postsRepository.findPrevious(4);

    // then
    expect(post?.id).toEqual(2);
  });

  it('다음 글 조회', async () => {
    // given
    const post1 = createPost(2, writer, category);
    const post2 = createPost(4, writer, category);
    const post3 = createPost(8, writer, category);
    const post4 = createPost(10, writer, category);
    await postsRepository.save([post1, post2, post3, post4]);

    // when
    const post = await postsRepository.findNext(4);

    // then
    expect(post?.id).toEqual(8);
  });
});

const createPost = (id: number, writer: User, category: Category) => {
  const post = new Post();
  post.id = id;
  post.title = 'title';
  post.content = 'cotent';
  post.introduction = 'intro';
  post.thumbnail = 'thumb';
  post.writer = writer;
  post.category = category;

  return post;
};

const createCategory = (id: number, categoryName: string) => {
  const category = new Category();
  category.id = id;
  category.categoryName = categoryName;

  return category;
};
