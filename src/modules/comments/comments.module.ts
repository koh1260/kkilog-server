import { Module, Post } from '@nestjs/common';
import { CommentsService } from './comment.service';
import { CommentsController } from './comments.controller';
import { CustomTypeOrmModule } from '../../config/typeorm/custom-typeorm-module';
import { Comment } from './entities/comment.entity';
import { CommentsServiceImpl } from './comments-impl.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { CommentsRepository } from './comments.repository';
import { UsersRepository } from '../users/users.repository';
import { PostsRepository } from '../posts/posts.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Post, Comment]),
    CustomTypeOrmModule.forCustomRepository([
      CommentsRepository,
      UsersRepository,
      PostsRepository,
    ]),
  ],
  controllers: [CommentsController],
  providers: [{ provide: CommentsService, useClass: CommentsServiceImpl }],
})
export class CommentsModule {}
