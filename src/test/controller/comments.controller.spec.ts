import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from '../../comments/comments.controller';
import { CommentsService } from '../../comments/comment.service';
import { CommentsServiceImpl } from '../../comments/comments-impl.service';
import { CommentsRepository } from '../../comments/comments.repository';
import { UsersRepository } from '../../users/users.repository';
import { PostsRepository } from '../../posts/posts.repository';

describe('CommentsController', () => {
  let controller: CommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        { provide: CommentsService, useClass: CommentsServiceImpl },
        CommentsRepository,
        UsersRepository,
        PostsRepository,
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
