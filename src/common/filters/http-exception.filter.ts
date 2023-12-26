import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER, WinstonLogger } from 'nest-winston';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
  ) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req: Request = ctx.getRequest();
    const res: Response = ctx.getResponse();

    const log = {
      timestamp: new Date(),
      path: req.url,
      name: exception.name,
      message: exception.message,
    };

    if (exception instanceof HttpException) {
      this.logger.warn({ ...log });
    } else {
      this.logger.error({ ...log, stack: exception.stack });
      exception = new InternalServerErrorException();
    }

    const response = (exception as HttpException).getResponse();

    res.status((exception as HttpException).getStatus()).json(response);
  }
}
