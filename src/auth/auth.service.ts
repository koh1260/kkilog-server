import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../users/users.repository';
import { comparePassword } from '../utils/password';
import { UserInfo } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserInfo | null> {
    const user = await this.usersRepository.findOneByEmail(email);

    if (!user) throw new NotFoundException('존재하지 않는 회원입니다.');

    if (user && (await comparePassword(password, user.password))) {
      const userInfo: UserInfo = {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
      };
      return userInfo;
    }
    throw new BadRequestException('비밀번호가 일치하지 않습니다.');
  }
  async generateRefreshToken(user: UserInfo) {
    const payload = { id: user.id };
    return this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
    });
  }

  async generateAccessToken(user: UserInfo) {
    const payload = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
    };

    return this.jwtService.signAsync(payload);
  }

  async login(user: UserInfo) {
    return {
      accessToken: await this.generateAccessToken(user),
      refreshToken: await this.generateRefreshToken(user),
    };
  }
}
