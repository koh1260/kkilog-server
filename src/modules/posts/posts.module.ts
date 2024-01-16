import { Logger, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { PrismaModule } from '../../prisma/prisma.module';
import { UsersRepository } from '../users/users.repository';
import { PostsLikeRepository } from './posts-like.repository';
import { CategorysRepository } from '../categorys/categorys.repository';

@Module({
  imports: [PrismaModule],
  controllers: [PostsController],
  providers: [
    Logger,
    PostsService,
    PostsRepository,
    UsersRepository,
    PostsLikeRepository,
    CategorysRepository,
  ],
})
export class PostsModule {}
