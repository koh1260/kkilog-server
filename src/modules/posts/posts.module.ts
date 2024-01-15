import { Logger, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { CustomTypeOrmModule } from '../../config/typeorm/custom-typeorm-module';
import { PostsRepository as PostTypeormRepo } from './posts-typeorm.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Category } from '../categorys/entities/category-typeorm.entity';
import { UsersTypeormRepository } from '../users/users-typeorm.repository';
import { PostLike } from './entities/post-like.entity';
import { PostsRepository } from './posts.repository';
import { PrismaModule } from '../../prisma/prisma.module';
import { UsersRepository } from '../users/users.repository';
import { PostsLikeRepository } from './posts-like.repository';
import { CategorysRepository } from '../categorys/categorys.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Category, PostLike]),
    CustomTypeOrmModule.forCustomRepository([
      PostTypeormRepo,
      UsersTypeormRepository,
    ]),
    PrismaModule,
  ],
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
