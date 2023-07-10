import { Logger, Module } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

@Module({
  providers: [Logger, { provide: 'APP_FILTER', useClass: HttpExceptionFilter }],
})
export class ExceptionModule {}
