import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from '../../modules/posts/posts.controller';
import { PostsService } from '../../modules/posts/posts.service';
import { PostsRepository } from '../../modules/posts/posts-typeorm.repository';
import { HttpStatus } from '@nestjs/common';
import { UsersRepository } from '../../modules/users/users-typeorm.repository';
import { CategorysRepository } from '../../modules/categorys/categorys-typeorm.repository';
import { UserInfo } from '../../auth/jwt.strategy';
import { Post } from '../../modules/posts/entities/post.entity';
import { Category } from '../../modules/categorys/entities/category.entity';
import { User } from '../../modules/users/entities/user.entity';
import { DataSource } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostLike } from '../../modules/posts/entities/post-like.entity';
import { repositoryMockFactory } from '../mock-data-sourec';
import { CreatePostDto } from '../../modules/posts/dto/create-post.dto';
import { UpdatePostDto } from '../../modules/posts/dto/update-post.dto';
import { DetailPost, ListPost } from '../../modules/posts/type';

const mockDataSource = {};

describe('PostsController', () => {
  let postsController: PostsController;
  let postsService: PostsService;
  let user: User;
  let category: Category;

  beforeEach(async () => {
    user = new User();
    user.email = 'EMAIL@example.com';
    user.nickname = 'NICKNAME';
    user.password = 'PASSWORD';
    category = new Category();
    category.id = 3;
    category.categoryName = 'Nest.js';

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        PostsRepository,
        UsersRepository,
        CategorysRepository,
        PostsService,
        { provide: DataSource, useValue: mockDataSource },
        {
          provide: getRepositoryToken(PostLike),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    postsController = module.get<PostsController>(PostsController);
    postsService = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(postsController).toBeDefined();
  });

  it('게시글 생성', async () => {
    // given
    const createPostDto = createPostDtoFactory('Nest.js');
    const userInfo: UserInfo = {
      id: 1,
      email: 'EMAIL@example.com',
      nickname: 'NICKNAME',
    };
    const createdPost = createPost(2, 'title', user, category);
    jest.spyOn(postsService, 'createPost').mockResolvedValue(createdPost);

    // when
    const response = await postsController.createPost(createPostDto, userInfo);

    // then
    expect(postsService.createPost).toHaveBeenCalledWith(
      createPostDto,
      userInfo.id,
    );
    expect(response.statusCode).toEqual(HttpStatus.CREATED);
    expect(response.message).toEqual('게시글 작성 완료.');
  });

  it('전체 조회', async () => {
    // given
    const mockPost1 = createListPost(1, 'title', 'introduction');
    const mockPost2 = createListPost(2, 'title', 'introduction');
    const mockPost3 = createListPost(3, 'title', 'introduction');

    jest
      .spyOn(postsService, 'findAll')
      .mockResolvedValue([mockPost1, mockPost2, mockPost3]);

    // when
    const response = await postsController.findAll();

    // then
    expect(postsService.findAll).toHaveBeenCalledTimes(1);
    expect(response.result?.length).toEqual(3);
    expect(response.result?.[0]).toMatchObject(mockPost1);
    expect(response.result?.[1]).toMatchObject(mockPost2);
    expect(response.result?.[2]).toMatchObject(mockPost3);
  });

  it('한 건 조회', async () => {
    // given
    const mockPost = createPost(3, 'title', user, category);
    jest
      .spyOn(postsService, 'findOne')
      .mockResolvedValue(mockPost as DetailPost);

    // when
    const response = await postsController.findOne(3);

    // then
    expect(postsService.findOne).toHaveBeenCalledTimes(1);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(response.result!).toMatchObject(mockPost);
  });

  it('카테고리 번호로 조회', async () => {
    // given
    const mockPost1 = createListPost(1, 'title', 'introduction');
    const mockPost2 = createListPost(2, 'title', 'introduction');
    const mockPost3 = createListPost(3, 'title', 'introduction');

    jest
      .spyOn(postsService, 'findByCategoryId')
      .mockImplementation(async (categoryId: number) => [
        mockPost1,
        mockPost2,
        mockPost3,
      ]);

    // when
    const response = await postsController.findByCategoryId(category.id);

    // then
    expect(postsService.findByCategoryId).toHaveBeenCalledTimes(1);
    expect(postsService.findByCategoryId).toHaveBeenCalledWith(category.id);
    expect(response.result?.length).toEqual(3);
    expect(response.result?.[0]).toMatchObject(mockPost1);
    expect(response.result?.[1]).toMatchObject(mockPost2);
    expect(response.result?.[2]).toMatchObject(mockPost3);
  });

  it('업데이트', async () => {
    // given
    const originalPost = createPost(1, 'title', user, category);
    const updatedPost = createPost(1, 'updated post', user, category);
    const updateDto: UpdatePostDto = { title: 'updated title' };
    jest
      .spyOn(postsService, 'update')
      .mockImplementation(
        async (id: number, dto: UpdatePostDto) => updatedPost,
      );

    // when
    const response = await postsController.update(originalPost.id, updateDto);

    // then
    expect(postsService.update).toHaveBeenCalledTimes(1);
    expect(postsService.update).toHaveBeenCalledWith(
      originalPost.id,
      updateDto,
    );
    expect(response.statusCode).toEqual(HttpStatus.NO_CONTENT);
  });

  it('삭제', async () => {
    // given
    jest.spyOn(postsService, 'remove').mockResolvedValue();

    // when
    await postsController.remove(2);

    // then
    expect(postsService.remove).toHaveBeenCalledTimes(1);
    expect(postsService.remove).toHaveBeenCalledWith(2);
  });
});

const createPostDtoFactory = (categoryName: string) => {
  return CreatePostDto.create(
    'title',
    'content',
    'introduction',
    'thumbnail',
    categoryName,
  );
};

const createListPost = (
  id: number,
  title: string,
  introduction: string,
): ListPost => {
  return {
    id,
    title,
    introduction,
    likes: 3,
    thumbnail: 'thumbnail.png',
    createAt: new Date(),
    commentCount: 10,
  };
};

const createPost = (
  id: number,
  title: string,
  writer: User,
  category: Category,
) => {
  const post = Post.of(title, 'content', 'intro', 'thumb', writer, category);
  post.id = id;

  return post;
};
