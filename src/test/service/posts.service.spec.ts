import { Test, TestingModule } from '@nestjs/testing';
import { PostsServiceImp } from '../../posts/posts-impl.service';
import { PostsRepository } from '../../posts/posts.repository';
import { User } from '../../users/user.entity';
import { PostsService } from '../../posts/posts.service';
import { CreatePostDto } from '../../posts/dto/create-post.dto';
import { Category } from '../../categorys/entities/category.entity';
import { NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../../users/users.repository';
import { CategorysRepository } from '../../categorys/categorys.repository';
import { Post } from '../../posts/entities/post.entity';
import { UpdatePostDto } from '../../posts/dto/update-post.dto';
import { TestTypeOrmModule } from '../../common/test-database/test-db.module';
import { CustomTypeOrmModule } from '../../common/custom-repository/custom-typeorm-module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostLike } from '../../posts/entities/post-like.entity';
import { Repository } from 'typeorm';
import { UserInfo } from '../../auth/jwt.strategy';

describe('PostsService', () => {
  let postsService: PostsService;
  let postsRepository: PostsRepository;
  let usersRepository: UsersRepository;
  let categorysRepository: CategorysRepository;
  let testWriter: User;
  let testCategory: Category;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestTypeOrmModule,
        CustomTypeOrmModule.forCustomRepository([
          UsersRepository,
          CategorysRepository,
          PostsRepository,
        ]),
      ],
      providers: [
        { provide: PostsService, useClass: PostsServiceImp },
        {
          provide: getRepositoryToken(PostLike),
          useClass: Repository<PostLike>,
        },
      ],
    }).compile();

    postsService = module.get<PostsService>(PostsService);
    postsRepository = module.get<PostsRepository>(PostsRepository);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    categorysRepository = module.get<CategorysRepository>(CategorysRepository);

    testWriter = User.of('test@test.com', 'nickname', 'password');
    await usersRepository.save(testWriter);
    testCategory = Category.of('Back-end');
    await categorysRepository.save(testCategory);
  });

  it('should be defined', () => {
    expect(postsService).toBeDefined();
  });

  it('게시글 생성', async () => {
    // given
    const createPostDto = createPostDtoFactory(testCategory.categoryName);
    const loginedUser = createUserInfo(1, 'test@test.com', 'nickname');

    // when
    const post = await postsService.createPost(createPostDto, loginedUser.id);

    // then
    expect(post.title).toEqual(createPostDto.title);
  });

  it('존재하지 않는 회원으로 생성 시 예외 발생', async () => {
    // given
    const createPostDto = createPostDtoFactory(testCategory.categoryName);
    const nonExistUserId = 122;

    // when
    // then
    try {
      await postsService.createPost(createPostDto, nonExistUserId);
    } catch (e) {
      expect(e).toEqual(new NotFoundException('존재하지 않는 회원입니다.'));
    }
  });

  it('존재하지 않는 카테고리로 생성 시 예외 발생', async () => {
    // given
    const nonExistCategoryName = '고양이';
    const createPostDto = createPostDtoFactory(nonExistCategoryName);
    const loginedUser = createUserInfo(1, 'test@test.com', 'nickname');

    // when
    await expect(async () => {
      await postsService.createPost(createPostDto, loginedUser.id);
    }).rejects.toThrowError(
      new NotFoundException('존재하지 않는 카테고리입니다.'),
    );
  });

  it('존재하지 않는 게시글 조회 시 예외 발생', async () => {
    // given
    const nonExistPostId = 423;

    // when
    // then
    await expect(
      async () => await postsService.findOne(nonExistPostId),
    ).rejects.toThrowError(
      new NotFoundException('존재하지 않는 게시물입니다.'),
    );
  });

  it('게시글 정보 업데이트', async () => {
    // given
    const updatePostDto = new UpdatePostDto();
    updatePostDto.content = 'updated content';
    updatePostDto.title = 'updated post';
    const originalPost = createPost(
      1,
      'title',
      'content',
      testWriter,
      testCategory,
    );
    await postsRepository.save(originalPost);

    // when
    const updatedPost = await postsService.update(
      originalPost.id,
      updatePostDto,
    );

    // then
    expect(updatedPost.content).toEqual('updated content');
  });
});

const createPostDtoFactory = (categoryName: string) => {
  const dto = new CreatePostDto();
  dto.title = 'title';
  dto.content = 'content';
  dto.introduction = 'introduction';
  dto.thumbnail = 'thumbnail';
  dto.categoryName = categoryName;

  return dto;
};

const createPost = (
  id: number,
  title: string,
  content: string,
  writer: User,
  category: Category,
) => {
  const post = Post.of(title, content, 'intro', 'thumb', writer, category);
  post.id = id;

  return post;
};

const createUserInfo = (id: number, email: string, nickname: string) => {
  return {
    id: id,
    email: email,
    nickname: nickname,
  } as UserInfo;
};