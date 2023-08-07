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
import { DataSource } from 'typeorm';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { PostLike } from '../../posts/entities/post-like.entity';
import { repositoryMockFactory } from '../../common/mock-data-sourec';

const mockPostsRepository = {
  save: jest.fn((value) => value),
  findOneById: jest.fn(),
};

const mockDataSource = {
  transaction: jest.fn(),
};

const mockPostLikeRepository = {
  save: jest.fn(),
};

describe('PostsService', () => {
  let postsService: PostsService;
  let postsRepository: PostsRepository;
  let usersRepository: UsersRepository;
  let categorysRepository: CategorysRepository;
  let user: User;
  let category: Category;

  beforeEach(async () => {
    user = new User();
    user.email = 'EMAIL@example.com';
    user.nickname = 'NICKNAME';
    user.password = 'PASSWORD';
    category = new Category();
    category.categoryName = 'Nest.js';
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        CategorysRepository,
        { provide: PostsRepository, useValue: mockPostsRepository },
        { provide: PostsService, useClass: PostsServiceImp },
        { provide: DataSource, useValue: mockDataSource },
        {
          provide: getRepositoryToken(PostLike),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    postsService = module.get<PostsService>(PostsService);
    postsRepository = module.get<PostsRepository>(PostsRepository);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    categorysRepository = module.get<CategorysRepository>(CategorysRepository);
  });

  it('should be defined', () => {
    expect(postsService).toBeDefined();
  });

  it('createPost 정상 작동', async () => {
    // given
    const createPostDto = createPostDtoFactory('Nest.js');
    const loginedUserId = 1;
    jest.spyOn(usersRepository, 'findOneById').mockResolvedValue(user);
    jest
      .spyOn(categorysRepository, 'findOneByName')
      .mockResolvedValue(category);

    // when
    const post = await postsService.createPost(createPostDto, loginedUserId);

    // then
    expect(post.title).toEqual(createPostDto.title);
  });

  it('createPost 존재하지 않는 회원', async () => {
    // given
    const createPostDto = createPostDtoFactory('Nest.js');
    jest.spyOn(usersRepository, 'findOneById').mockResolvedValue(null);

    // when
    await expect(async () => {
      await postsService.createPost(createPostDto, 1);
    }).rejects.toThrowError(new NotFoundException('존재하지 않는 회원입니다.'));
  });

  it('createPost 존재하지 않는 카테고리', async () => {
    // given
    const createPostDto = createPostDtoFactory('Nest.js');
    const loginedUserId = 1;
    jest.spyOn(usersRepository, 'findOneById').mockResolvedValue(user);
    jest.spyOn(categorysRepository, 'findOneByName').mockResolvedValue(null);

    // when
    await expect(async () => {
      await postsService.createPost(createPostDto, loginedUserId);
    }).rejects.toThrowError(
      new NotFoundException('존재하지 않는 카테고리입니다.'),
    );
  });

  it('findOne 존재하지 않는 게시글', async () => {
    // given
    const id = 1;
    jest.spyOn(postsRepository, 'findOneById').mockResolvedValue(null);

    // when
    // then
    await expect(async () => {
      await postsService.findOne(id);
    }).rejects.toThrowError(
      new NotFoundException('존재하지 않는 게시물입니다.'),
    );
  });

  it('게시글 정보 업데이트', async () => {
    // given
    const id = 1;
    const updatePostDto = new UpdatePostDto();
    updatePostDto.title = 'updated post';
    const originalPost = new Post();
    originalPost.title = 'title';
    originalPost.content = 'nestjs 재밌군';
    originalPost.introduction = 'intro';
    originalPost.thumbnail = 'thumb';
    originalPost.writer = user;
    originalPost.category = category;

    jest.spyOn(postsRepository, 'findOneById').mockResolvedValue(originalPost);

    // when
    const updatedPost = await postsService.update(id, updatePostDto);

    // then
    expect(updatedPost.title).toEqual('updated post');
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
