import { Module, Post } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CustomTypeOrmModule } from '../../config/typeorm/custom-typeorm-module';
import { Comment } from './entities/comment-typeorm.entity';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { CommentsRepository as CommentTypeormRepo } from './comments-typeorm.repository';
import { UsersTypeormRepository } from '../users/users-typeorm.repository';
import { PrismaModule } from '../../prisma/prisma.module';
import { CommentsRepository } from './comments.repository';
import { UsersRepository } from '../users/users.repository';
import { PostsRepository } from '../posts/posts.repository';

@Module({
  imports: [PrismaModule],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    CommentsRepository,
    UsersRepository,
    PostsRepository,
  ],
})
export class CommentsModule {}
