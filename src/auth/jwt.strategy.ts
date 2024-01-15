import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtConfig from '../config/jwtConfig';
import { User } from '@prisma/client';

export type UserInfo = Pick<User, 'id' | 'email' | 'nickname'>;

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY) private config: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req.cookies['access_token'];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: config.jwtSecretKey,
    });
  }

  async validate(payload: any): Promise<UserInfo> {
    // 반환 값을 Request 객체의 user에 넣어줌.
    return {
      id: payload.id,
      email: payload.email,
      nickname: payload.nickname,
    };
  }
}
