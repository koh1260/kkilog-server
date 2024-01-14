import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersTypeormRepository } from './users-typeorm.repository';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from '../../auth/auth.module';
import { CustomTypeOrmModule } from '../../config/typeorm/custom-typeorm-module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CustomTypeOrmModule.forCustomRepository([UsersTypeormRepository]),
    AuthModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
