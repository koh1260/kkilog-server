import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtConfig from 'src/config/jwtConfig';

export interface UserInfo {
  email: string;
  name: string;
  nickname: string;
}

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY) private config: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwtSecretKey,
    });
  }

  async validate(payload: any): Promise<UserInfo> {
    // 반환 값을 Request 객체의 user에 넣어줌.
    return {
      email: payload.email,
      name: payload.name,
      nickname: payload.nickname,
    };
  }
}
