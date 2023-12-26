import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req: Request = ctx.getRequest();
    const res: Response = ctx.getResponse();

    const originException = exception;

    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException();
    }

    const response = (exception as HttpException).getResponse();

    const log = {
      timestamp: new Date(),
      path: req.url,
      name: originException.name,
      message: originException.message,
      stack: originException.stack,
    };
    this.logger.warn({ ...log });

    res.status((exception as HttpException).getStatus()).json(response);
  }
}
