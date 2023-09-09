import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from '../../posts/posts.controller';
import { PostsServiceImp } from '../../posts/posts-impl.service';
import { PostsRepository } from '../../posts/posts.repository';
import { PostsService } from '../../posts/posts.service';
import { HttpStatus } from '@nestjs/common';
import { UsersRepository } from '../../users/users.repository';
import { CategorysRepository } from '../../categorys/categorys.repository';
import { UserInfo } from '../../auth/jwt.strategy';
import { Post } from '../../posts/entities/post.entity';
import { Category } from '../../categorys/entities/category.entity';
import { User } from '../../users/user.entity';
import { DataSource } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostLike } from '../../posts/entities/post-like.entity';
import { repositoryMockFactory } from '../../common/mock-data-sourec';
import { CreatePostDto } from '../../posts/dto/create-post.dto';
import { UpdatePostDto } from '../../posts/dto/update-post.dto';

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
        {
          provide: PostsService,
          useClass: PostsServiceImp,
        },
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
    const mockPost1 = createPost(1, 'title1', user, category);
    const mockPost2 = createPost(2, 'title2', user, category);
    const mockPost3 = createPost(3, 'title3', user, category);
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
    jest.spyOn(postsService, 'findOne').mockResolvedValue(mockPost);

    // when
    const response = await postsController.findOne(3);

    // then
    expect(postsService.findOne).toHaveBeenCalledTimes(1);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(response.result!).toMatchObject(mockPost);
  });

  it('카테고리 번호로 조회', async () => {
    // given
    const mockPost1 = createPost(1, 'title1', user, category);
    const mockPost2 = createPost(2, 'title2', user, category);
    const mockPost3 = createPost(3, 'title3', user, category);
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
    const updateDto = createUpdatePostDtoFactory('updated title');
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
  const dto = new CreatePostDto();
  dto.title = 'title';
  dto.content = 'content';
  dto.introduction = 'introduction';
  dto.thumbnail = 'thumbnail';
  dto.categoryName = categoryName;

  return dto;
};

const createUpdatePostDtoFactory = (title?: string, content?: string) => {
  const dto = new UpdatePostDto();
  dto.title = title;
  dto.content = content;

  return dto;
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
