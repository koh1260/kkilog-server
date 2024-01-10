import { Logger, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { CustomTypeOrmModule } from '../../config/typeorm/custom-typeorm-module';
import { PostsRepository } from './posts.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Category } from '../categorys/entities/category.entity';
import { UsersRepository } from '../users/users.repository';
import { CategorysRepository } from '../categorys/categorys.repository';
import { PostLike } from './entities/post-like.entity';
import { PostsPrismaRepository } from './posts-prisma.repository';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Category, PostLike]),
    CustomTypeOrmModule.forCustomRepository([
      PostsRepository,
      UsersRepository,
      CategorysRepository,
    ]),
    PrismaModule,
  ],
  controllers: [PostsController],
  providers: [Logger, PostsService, PostsPrismaRepository],
})
export class PostsModule {}
