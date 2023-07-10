import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { CustomTypeOrmModule } from '../common/custom-typeorm-module';
import { PostsRepository } from './posts.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CustomTypeOrmModule.forCustomRepository([PostsRepository]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
