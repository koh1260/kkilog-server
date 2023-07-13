import { Module } from '@nestjs/common';
import { CustomTypeOrmModule } from '../common/custom-repository/custom-typeorm-module';
import { CategorysRepository } from './categorys.repository';

@Module({
  imports: [CustomTypeOrmModule.forCustomRepository([CategorysRepository])],
})
export class CategorysModule {}
