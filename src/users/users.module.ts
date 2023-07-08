import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { CustomTypeOrmModule } from 'src/common/custom-typeorm-module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    CustomTypeOrmModule.forCustomRepository([UsersRepository]),
    AuthModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
