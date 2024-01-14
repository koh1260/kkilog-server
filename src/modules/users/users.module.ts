import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersTypeormRepository } from './users-typeorm.repository';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from '../../auth/auth.module';
import { CustomTypeOrmModule } from '../../config/typeorm/custom-typeorm-module';
import { UsersRepository } from './users.repository';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CustomTypeOrmModule.forCustomRepository([UsersTypeormRepository]),
    AuthModule,
    PrismaModule,
  ],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
