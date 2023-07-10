import { Module } from '@nestjs/common';
import { PostsServiceImp } from './posts-impl.service';
import { PostsController } from './posts.controller';
import { CustomTypeOrmModule } from '../common/custom-typeorm-module';
import { PostsRepository } from './posts.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { PostsService } from './posts.service';
import { Category } from '../categorys/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Category]),
    CustomTypeOrmModule.forCustomRepository([PostsRepository]),
  ],
  controllers: [PostsController],
  providers: [
    {
      provide: PostsService,
      useClass: PostsServiceImp,
    },
  ],
})
export class PostsModule {}
