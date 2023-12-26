import { Module } from '@nestjs/common';
import { GlobalExceptionFilter } from '../common/filters/http-exception.filter';

@Module({
  providers: [{ provide: 'APP_FILTER', useClass: GlobalExceptionFilter }],
})
export class ExceptionModule {}
