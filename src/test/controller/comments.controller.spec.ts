import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from '../../modules/comments/comments.controller';
// import { CommentsService } from '../../modules/comments/comment.service';
import { CommentsService } from '../../modules/comments/comments.service';
import { CommentsRepository } from '../../modules/comments/comments.repository';
import { UsersRepository } from '../../modules/users/users.repository';
import { PostsRepository } from '../../modules/posts/posts.repository';

describe('CommentsController', () => {
  let controller: CommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        CommentsService,
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
