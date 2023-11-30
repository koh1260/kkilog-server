import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class CacheControlIntercepter implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const respons: Response = context.switchToHttp().getResponse();

    respons.setHeader('Cache-Control', 'no-cache');

    return next.handle();
  }
}
