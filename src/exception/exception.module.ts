import { Logger, Module } from '@nestjs/common';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';

@Module({
  providers: [Logger, { provide: 'APP_FILTER', useClass: HttpExceptionFilter }],
})
export class ExceptionModule {}
