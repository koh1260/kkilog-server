import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../users/users.repository';
import { comparePassword } from '../utils/password';
import { UserInfo } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';

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
    return this.jwtService.signAsync(user);
  }

  async regenerateAccessToken(userId: number) {
    const user = this.existUser(await this.usersRepository.findOneById(userId));
    const userInfo: UserInfo = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
    };
    return await this.generateAccessToken(userInfo);
  }

  async setRefreshToken(userId: number, refresh: string) {
    const hashedRefreshToken = await this.gethashedRefreshToken(refresh);
    const refreshTokenExp = await this.getCurrentRefreshTokenExp();
    await this.usersRepository.update(userId, {
      refreshToken: hashedRefreshToken,
      refreshTokenExp: refreshTokenExp,
    });
  }

  async gethashedRefreshToken(refreshToken: string) {
    const saltRound = this.configService.get<number>('JWT_REFRESH_HASH_SALT');
    // Joi로 환경변수 유효성 검사 마쳐야만 서버가 실행되므로 항상 null이 아님.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return await bcrypt.hash(refreshToken, saltRound!);
  }

  async getCurrentRefreshTokenExp(): Promise<Date> {
    const currentDate = new Date();
    const currentRefreshTokenExp = new Date(
      currentDate.getTime() +
        parseInt(
          // Joi로 환경변수 유효성 검사 마쳐야만 서버가 실행되므로 항상 null이 아님.
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME')!,
        ),
    );
    return currentRefreshTokenExp;
  }

  async verifyRefreshToken(refresh: string) {
    const decodedToken = this.jwtService.verify(refresh);
    console.log(decodedToken);
    const user = this.existUser(
      await this.usersRepository.findOneById(decodedToken.id),
    );

    if (!user) throw new NotFoundException('존재하지 않는 회원입니다.');
    if (new Date(decodedToken.exp * 1000) < new Date())
      throw new BadRequestException('만료된 토큰입니다.');
    if (!(await bcrypt.compare(refresh, user.refreshToken!)))
      throw new BadRequestException('유효하지 않은 토큰입니다.');

    return decodedToken;
  }

  existUser(user: User | null): User {
    if (!user) throw new NotFoundException('존재하지 않는 회원입니다.');
    return user;
  }

  async login(user: UserInfo) {
    const access = await this.generateAccessToken(user);
    const refresh = await this.generateRefreshToken(user);
    await this.setRefreshToken(user.id, refresh);

    return {
      accessToken: access,
      refreshToken: refresh,
    };
  }
}
