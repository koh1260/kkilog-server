import { Test, TestingModule } from '@nestjs/testing';
import { CustomTypeOrmModule } from '../../common/custom-repository/custom-typeorm-module';
import { CommentsRepository } from '../../comments/comments.repository';
import { UsersRepository } from '../../users/users.repository';
import { TestTypeOrmModule } from '../../common/test-database/test-db.module';
import { User } from '../../users/user.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { PostsRepository } from '../../posts/posts.repository';
import { Post } from '../../posts/entities/post.entity';

describe('CommentsRepository', () => {
  let commentsRepository: CommentsRepository;
  let usersRepository: UsersRepository;
  let postsRepository: PostsRepository;
  let writer: User;
  let post: Post;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestTypeOrmModule,
        CustomTypeOrmModule.forCustomRepository([
          CommentsRepository,
          UsersRepository,
          PostsRepository,
        ]),
      ],
    }).compile();

    commentsRepository = module.get<CommentsRepository>(CommentsRepository);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    postsRepository = module.get<PostsRepository>(PostsRepository);

    writer = new User();
    writer.id = 2;
    writer.email = 'test@test.com';
    writer.nickname = 'nickname';
    writer.password = 'password';
    await usersRepository.save(writer);

    post = new Post();
    post.id = 2;
    post.title = 'title';
    post.content = 'content';
    post.introduction = 'intro';
    post.thumbnail = 'thumb';
    post.writer = writer;
    await postsRepository.save(post);
  });

  it('게시글 번호로 전체 조회', async () => {
    // given
    const comment1 = createComment(1, '네스트 짱1', writer, post);
    const comment2 = createComment(2, '네스트 짱2', writer, post);
    const comment3 = createComment(3, '네스트 짱3', writer, post);
    await commentsRepository.save([comment1, comment2, comment3]);

    // when
    const foundComments = await commentsRepository.findAll(post.id);

    // then
    expect(foundComments).toHaveLength(3);
  });

  it('댓글 번호로 조회', async () => {
    // given
    const comment = createComment(3, '네스트 짱3', writer, post);
    await commentsRepository.save(comment);

    // when
    const foundComment = await commentsRepository.findOneById(comment.id);

    // then
    expect(foundComment?.id).toEqual(comment.id);
  });

  it('부모 번호로 자식 조회', async () => {
    // given
    const parentComment = createComment(1, '네스트 짱1', writer, post);
    const childComment1 = createComment(2, '네스트 짱2', writer, post);
    const childComment2 = createComment(3, '네스트 짱3', writer, post);
    childComment1.parent = parentComment.id;
    childComment2.parent = parentComment.id;
    await commentsRepository.save([
      parentComment,
      childComment1,
      childComment2,
    ]);

    // when
    const foundComments = await commentsRepository.findChildCommentByParentId(
      parentComment.id,
    );

    // then
    expect(foundComments).toHaveLength(2);
  });
});

const createComment = (
  id: number,
  content: string,
  writer: User,
  post: Post,
) => {
  const comment = new Comment();
  comment.id = id;
  comment.content = content;
  comment.writer = writer;
  comment.post = post;

  return comment;
};
