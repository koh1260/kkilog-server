import { Test, TestingModule } from '@nestjs/testing';
import { PostsServiceImp } from '../../modules/posts/posts-impl.service';
import { PostsRepository } from '../../modules/posts/posts.repository';
import { User } from '../../modules/users/entities/user.entity';
import { PostsService } from '../../modules/posts/posts.service';
import { CreatePostDto } from '../../modules/posts/dto/create-post.dto';
import { Category } from '../../modules/categorys/entities/category.entity';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../../modules/users/users.repository';
import { CategorysRepository } from '../../modules/categorys/categorys.repository';
import { Post } from '../../modules/posts/entities/post.entity';
import { UpdatePostDto } from '../../modules/posts/dto/update-post.dto';
import { TestTypeOrmModule } from '../db/test-db.module';
import { CustomTypeOrmModule } from '../../config/typeorm/custom-typeorm-module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostLike } from '../../modules/posts/entities/post-like.entity';
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

    testWriter = User.create('test@test.com', 'nickname', 'password');
    testWriter.role = 'ADMIN';
    await usersRepository.save(testWriter);
    testCategory = Category.of('Back-end');
    testCategory.icon = 'test';
    await categorysRepository.save(testCategory);
  });

  it('should be defined', () => {
    expect(postsService).toBeDefined();
  });

  it('게시글 생성', async () => {
    // given
    const dto = createPostDtoFactory(testCategory.categoryName);
    const loginedUser = createUserInfo(1, 'test@test.com', 'nickname');

    // when
    const post = await postsService.createPost(dto, loginedUser.id);

    // then
    expect(post.title).toEqual(dto.title);
  });

  it('관리자 권한이 없는 회원이 게시글 생성 시 예외 발생', async () => {
    // given
    const nonAdminUser = User.create(
      'nonadmin@test.com',
      'nickname',
      'password',
    );
    await usersRepository.save(nonAdminUser);
    const dto = createPostDtoFactory(testCategory.categoryName);
    const loginedUser = createUserInfo(2, 'test@test.com', 'nickname');

    // when
    // then
    await expect(
      async () => await postsService.createPost(dto, loginedUser.id),
    ).rejects.toThrowError(
      new UnauthorizedException('관리자 권한이 없습니다.'),
    );
  });

  it('존재하지 않는 회원으로 생성 시 예외 발생', async () => {
    // given
    const dto = createPostDtoFactory(testCategory.categoryName);
    const nonExistUserId = 122;

    // when
    // then
    try {
      await postsService.createPost(dto, nonExistUserId);
    } catch (e) {
      expect(e).toEqual(new NotFoundException('존재하지 않는 회원입니다.'));
    }
  });

  it('존재하지 않는 카테고리로 생성 시 예외 발생', async () => {
    // given
    const nonExistCategoryName = '고양이';
    const dto = createPostDtoFactory(nonExistCategoryName);
    const loginedUser = createUserInfo(1, 'test@test.com', 'nickname');

    // when
    await expect(async () => {
      await postsService.createPost(dto, loginedUser.id);
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
    const dto = new UpdatePostDto();
    dto.content = 'updated content';
    dto.title = 'updated post';
    const originalPost = createPost(
      1,
      'title',
      'content',
      testWriter,
      testCategory,
    );
    await postsRepository.save(originalPost);

    // when
    const updatedPost = await postsService.update(originalPost.id, dto);

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
