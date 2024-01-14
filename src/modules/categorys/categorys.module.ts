import { Module } from '@nestjs/common';
import { CustomTypeOrmModule } from '../../config/typeorm/custom-typeorm-module';
import { CategorysRepository } from './categorys-typeorm.repository';
import { CategorysController } from './categorys.controller';
import { CategorysService } from './categorys.service';

@Module({
  imports: [CustomTypeOrmModule.forCustomRepository([CategorysRepository])],
  controllers: [CategorysController],
  providers: [CategorysService],
})
export class CategorysModule {}
