import { Module } from '@nestjs/common';
import { CustomTypeOrmModule } from '../common/custom-repository/custom-typeorm-module';
import { CategorysRepository } from './categorys.repository';
import { CategorysController } from './categorys.controller';
import { CategorysService } from './categorys.service';

@Module({
  imports: [CustomTypeOrmModule.forCustomRepository([CategorysRepository])],
  controllers: [CategorysController],
  providers: [CategorysService],
})
export class CategorysModule {}
