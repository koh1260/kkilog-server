import { Module } from '@nestjs/common';
import { CategorysController } from './categorys.controller';
import { CategorysService } from './categorys.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { CategorysRepository } from './categorys.repository';

@Module({
  imports: [PrismaModule],
  controllers: [CategorysController],
  providers: [CategorysService, CategorysRepository],
})
export class CategorysModule {}
