import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request: Request = context.switchToHttp().getRequest();
    const log = {
      method: request.method,
      timestamp: new Date(),
      url: request.url,
      ip: request.ip,
    };

    this.logger.log({ message: 'Request', ...log });
    return next.handle();
  }
}
