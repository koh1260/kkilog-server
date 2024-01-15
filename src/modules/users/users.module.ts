import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from '../../auth/auth.module';
import { UsersRepository } from './users.repository';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule, PrismaModule],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
