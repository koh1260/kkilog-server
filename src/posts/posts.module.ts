import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { UsersRepository } from '../users/users.repository';
import { CustomTypeOrmModule } from '../common/custom-typeorm-module';

@Module({
  imports: [CustomTypeOrmModule.forCustomRepository([UsersRepository])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
