import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserInfo } from '../../auth/jwt.strategy';

export const LoginedUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserInfo => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
