import { Test, TestingModule } from '@nestjs/testing';
import { PostsServiceImp } from './posts-impl.service';
import { PostsRepository } from './posts.repository';
import { User } from '../users/user.entity';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Category } from '../categorys/entities/category.entity';
import { NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { CategorysRepository } from '../categorys/categorys.repository';
import { Post } from './entities/post.entity';
import { UpdatePostDto } from './dto/update-post.dto';

const mockPostsRepository = {
  save: jest.fn((value) => value),
  findOneById: jest.fn(),
};

const mockUsersRepository = {
  findOneByEmail: jest.fn(),
};

const mockCategorysRepository = {
  findOneByName: jest.fn(),
};

describe('PostsService', () => {
  let postsService: PostsService;
  let postsRepository: PostsRepository;
  let usersRepository: UsersRepository;
  let categorysRepository: CategorysRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: UsersRepository, useValue: mockUsersRepository },
        { provide: PostsRepository, useValue: mockPostsRepository },
        { provide: CategorysRepository, useValue: mockCategorysRepository },
        { provide: PostsService, useClass: PostsServiceImp },
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
    const createPostDto = createPostDtoFactory(
      'TITLE',
      'CONTENT',
      'INTRO',
      'THUMBNAIL',
    );

    jest.spyOn(usersRepository, 'findOneByEmail').mockResolvedValue(new User());
    jest
      .spyOn(categorysRepository, 'findOneByName')
      .mockResolvedValue(new Category());

    // when
    const post = await postsService.createPost(createPostDto, 'EMAIL');

    // then
    expect(post.title).toEqual(createPostDto.title);
  });

  it('createPost 존재하지 않는 회원', async () => {
    // given
    const createPostDto = createPostDtoFactory(
      'TITLE',
      'CONTENT',
      'INTRO',
      'THUMBNAIL',
    );

    jest.spyOn(usersRepository, 'findOneByEmail').mockResolvedValue(null);

    // when
    await expect(async () => {
      await postsService.createPost(createPostDto, 'EMAIL');
    }).rejects.toThrowError(new NotFoundException('존재하지 않는 회원입니다.'));
  });

  it('createPost 존재하지 않는 카테고리', async () => {
    // given
    const createPostDto = createPostDtoFactory(
      'TITLE',
      'CONTENT',
      'INTRO',
      'THUMBNAIL',
    );

    jest.spyOn(usersRepository, 'findOneByEmail').mockResolvedValue(new User());
    jest.spyOn(categorysRepository, 'findOneByName').mockResolvedValue(null);

    // when
    await expect(async () => {
      await postsService.createPost(createPostDto, 'EMAIL');
    }).rejects.toThrowError(
      new NotFoundException('존재하지 않는 카테고리입니다.'),
    );
  });

  it('findOne 정상 작동', async () => {
    // given
    const id = 1;
    jest
      .spyOn(postsRepository, 'findOneById')
      .mockImplementation(async (id) => {
        const post = new Post();
        post.id = id;

        return post;
      });

    // when
    const post = await postsService.findOne(id);

    // then
    expect(post.id).toEqual(id);
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
    updatePostDto.title = 'TITLE';

    jest
      .spyOn(postsRepository, 'findOneById')
      .mockImplementation(async (id) => {
        const post = new Post();
        post.id = id;

        return post;
      });

    // when
    const updatedPost = await postsService.update(id, updatePostDto);

    // then
    expect(updatedPost.title).toEqual('TITLE');
  });
});

const createPostDtoFactory = (
  title: string,
  content: string,
  introduction: string,
  thumbnail: string,
) => {
  const dto = new CreatePostDto();
  dto.title = title;
  dto.content = content;
  dto.introduction = introduction;
  dto.thumbnail = thumbnail;

  return dto;
};
