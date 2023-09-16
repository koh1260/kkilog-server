import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from '../../comments/comment.service';
import { CommentsServiceImpl } from '../../comments/comments-impl.service';
import { UsersRepository } from '../../users/users.repository';
import { PostsRepository } from '../../posts/posts.repository';
import { CommentsRepository } from '../../comments/comments.repository';
import { TestTypeOrmModule } from '../../common/test-database/test-db.module';
import { Comment } from '../../comments/entities/comment.entity';
import { User } from '../../users/user.entity';
import { Category } from '../../categorys/entities/category.entity';
import { Post } from '../../posts/entities/post.entity';
import { CustomTypeOrmModule } from '../../common/custom-repository/custom-typeorm-module';
import { CreateCommentDto } from '../../comments/dto/create-comment.dto';
import { UserInfo } from '../../auth/jwt.strategy';
import { CategorysRepository } from '../../categorys/categorys.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UpdateCommentDto } from '../../comments/dto/update-comment.dto';

describe('CommentsService', () => {
  let commentsService: CommentsService;
  let commentsRepository: CommentsRepository;
  let usersRepository: UsersRepository;
  let postsRepository: PostsRepository;
  let categorysRepository: CategorysRepository;
  let testWriter: User;
  let testPost: Post;
  let testCategoty: Category;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestTypeOrmModule,
        CustomTypeOrmModule.forCustomRepository([
          UsersRepository,
          PostsRepository,
          CommentsRepository,
          CategorysRepository,
        ]),
      ],
      providers: [{ provide: CommentsService, useClass: CommentsServiceImpl }],
    }).compile();

    commentsService = module.get<CommentsService>(CommentsService);
    commentsRepository = module.get<CommentsRepository>(CommentsRepository);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    postsRepository = module.get<PostsRepository>(PostsRepository);
    categorysRepository = module.get<CategorysRepository>(CategorysRepository);

    testWriter = createUser(3, 'test@test.com', 'nickname');
    await usersRepository.save(testWriter);
    testCategoty = Category.of('Test-category');
    testCategoty.icon = 'test';
    await categorysRepository.save(testCategoty);
    testPost = createPost(7, 'title', 'content', testWriter, testCategoty);
    await postsRepository.save(testPost);
  });

  it('should be defined', () => {
    expect(commentsService).toBeDefined();
  });

  it('댓글 생성', async () => {
    // given
    const dto = createCommentDtoFactory('content', testPost.id);
    const loginedUser = createUserInfo(3, 'test@test.com', 'nickname');

    // when
    const comment = await commentsService.createComment(dto, loginedUser.id);

    // then
    expect(comment.content).toEqual(dto.content);
  });

  it('존재하지 않는 회원으로 생성 시 예외 발생', async () => {
    // given
    const dto = createCommentDtoFactory('content', testPost.id);
    const nonExistUserId = 122;

    // when
    // then
    await expect(
      async () => await commentsService.createComment(dto, nonExistUserId),
    ).rejects.toThrowError(new NotFoundException('존재하지 않는 회원입니다.'));
  });

  it('특정 게시글 댓글 전체 조회', async () => {
    // given
    const comment1 = createComment(1, 'content', testWriter, testPost);
    const comment2 = createComment(2, 'content', testWriter, testPost);
    const comment3 = createComment(3, 'content', testWriter, testPost);
    await commentsRepository.save([comment1, comment2, comment3]);

    // when
    const comments = await commentsService.findAll(testPost.id);

    // then
    expect(comments).toHaveLength(3);
  });

  it('존재하지 않는 게시글의 댓글 조회 시 예외 발생', async () => {
    // given
    const nonExistPostId = 3421;

    // when
    // then
    await expect(
      async () => await commentsService.findAll(nonExistPostId),
    ).rejects.toThrowError(
      new NotFoundException('존재하지 않는 게시글입니다.'),
    );
  });

  it('댓글 정보 업데이트', async () => {
    // given
    const originalComment = createComment(2, 'content', testWriter, testPost);
    await commentsRepository.save(originalComment);
    const dto = new UpdateCommentDto();
    dto.content = 'updated content';

    // when
    const updatedComment = await commentsService.update(
      originalComment.id,
      testWriter.email,
      dto,
    );

    // then
    expect(updatedComment.content).toEqual(dto.content);
  });

  it('존재하지 않는 댓글 업데이트 시 예외 발생', async () => {
    // given
    const nonExistCommentId = 3122;
    const dto = updateCommentDtoFactory('updated content');

    // when
    // then
    await expect(
      async () =>
        await commentsService.update(nonExistCommentId, testWriter.email, dto),
    ).rejects.toThrowError(new NotFoundException('존재하지 않는 댓글입니다.'));
  });

  it('작성자가 아닌 회원이 댓글 업데이트 시 예외 발생', async () => {
    // given
    const comment = await commentsRepository.save(
      createComment(2, 'content', testWriter, testPost),
    );
    const nonAuthorEmail = 'nonauthor@test.com';
    const dto = updateCommentDtoFactory('updated content');

    // when
    // then
    await expect(
      async () => await commentsService.update(comment.id, nonAuthorEmail, dto),
    ).rejects.toThrowError(new ForbiddenException('작성자가 아닙니다.'));
  });

  it('댓글 삭제', async () => {
    // given
    const dto = createCommentDtoFactory('content', testPost.id);
    const loginedUser = createUserInfo(3, 'test@test.com', 'nickname');
    const comment = await commentsService.createComment(dto, loginedUser.id);

    // when
    await commentsService.remove(comment.id, testWriter.email);

    // then
    expect(await commentsRepository.findOneById(comment.id)).toBeNull();
  });

  it('작성자가 아닌 회원이 댓글 삭세 시 예외 발생', async () => {
    // given
    const dto = createCommentDtoFactory('content', testPost.id);
    const loginedUser = createUserInfo(3, 'test@test.com', 'nickname');
    const comment = await commentsService.createComment(dto, loginedUser.id);
    const nonAuthorEmail = 'nonauthor@test.com';

    // when
    // then
    await expect(
      async () => await commentsService.remove(comment.id, nonAuthorEmail),
    ).rejects.toThrowError(new ForbiddenException('작성자가 아닙니다.'));
  });
});

const createCommentDtoFactory = (content: string, postId: number) => {
  const dto = new CreateCommentDto();
  dto.content = content;
  dto.postId = postId;

  return dto;
};

const updateCommentDtoFactory = (content: string) => {
  const dto = new UpdateCommentDto();
  dto.content = content;

  return dto;
};

const createComment = (
  id: number,
  content: string,
  writer: User,
  post: Post,
) => {
  const comment = Comment.createMember(content, post, writer);
  comment.id = id;

  return comment;
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

const createUser = (id: number, email: string, nickname: string) => {
  const user = User.of(email, nickname, 'password');
  user.id = id;

  return user;
};

const createUserInfo = (id: number, email: string, nickname: string) => {
  return {
    id: id,
    email: email,
    nickname: nickname,
  } as UserInfo;
};
