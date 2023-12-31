import { Module, Post } from '@nestjs/common';
// import { CommentsService } from './comment.service';
import { CommentsController } from './comments.controller';
import { CustomTypeOrmModule } from '../../config/typeorm/custom-typeorm-module';
import { Comment } from './entities/comment.entity';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
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
  providers: [CommentsService],
})
export class CommentsModule {}
