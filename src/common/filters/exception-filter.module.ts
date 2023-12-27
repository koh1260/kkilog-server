import { Module } from '@nestjs/common';
import { GlobalExceptionFilter } from './global-exception.filter';

@Module({
  providers: [{ provide: 'APP_FILTER', useClass: GlobalExceptionFilter }],
})
export class ExceptionModule {}
