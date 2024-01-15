import { Test, TestingModule } from '@nestjs/testing';
import { PostsRepository } from '../../modules/posts/posts.repository';
import { PrismaService } from '../../prisma/prisma.service';

describe('PostsRepository', () => {
  let postRepository: PostsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, PostsRepository],
    }).compile();

    postRepository = module.get<PostsRepository>(PostsRepository);
  });

  it('게시글 전체 조회', async () => {
    // given
    // when
    const postList = await postRepository.findAll();
    // then
    expect(postList.length).toBe(0);
  });
});
