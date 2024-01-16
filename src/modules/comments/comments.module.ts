import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
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
