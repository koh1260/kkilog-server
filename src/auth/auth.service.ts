import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from '../utils/password';
import { UserInfo } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../modules/users/users.repository';
import { User } from '@prisma/client';

export interface DecodedToken {
  id: number;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 회원 검증.
   * @param email 이메일
   * @param password 비밀번호
   * @returns request에 삽입될 회원 정보
   */
  async validateUser(
    email: string,
    password: string,
  ): Promise<UserInfo | null> {
    const user = await this.usersRepository.findOneByEmail(email);
    if (!user) throw new BadRequestException('존재하지 않는 회원입니다.');
    if (!(user && (await comparePassword(password, user.password))))
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');

    const userInfo: UserInfo = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
    };
    return userInfo;
  }

  /**
   * Refresh Token 생성.
   * @param user request에 담겨 있는 회원 정보
   * @returns Refresh Token
   */
  async generateRefreshToken(user: UserInfo) {
    const payload = { id: user.id };
    return this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<number>('JWT_REFRESH_EXPIRATION_TIME'),
    });
  }

  /**
   * Access Token 생성.
   * @param user request에 담겨 있는 회원 정보
   * @returns Access Token
   */
  async generateAccessToken(user: UserInfo) {
    return this.jwtService.signAsync(user, {
      expiresIn: this.configService.get<number>('JWT_ACCESS_EXPIRATION_TIME'),
    });
  }

  /**
   * Access Token 재생성
   * @param userId 회원 번호
   * @returns Access Token
   */
  async regenerateAccessToken(userId: number) {
    const user = await this.usersRepository.findOneById(userId);
    if (!user) throw new BadRequestException('존재하지 않는 회원입니다.');

    const userInfo: UserInfo = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
    };

    return await this.generateAccessToken(userInfo);
  }
  // TODO
  /**
   * Refresh Token을 DB에 저장.
   * @param userId 회원 번호
   * @param refresh Refresh Token
   */
  async setRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.gethashedRefreshToken(refreshToken);

    await this.usersRepository.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  /**
   * Refresh Token을 해싱.
   * @param refreshToken Refresh Token
   * @returns 해싱된 Refresh Token
   */
  async gethashedRefreshToken(refreshToken: string) {
    const saltRound = this.configService.get<number>('JWT_REFRESH_HASH_SALT');
    // Joi로 환경변수 유효성 검사 마쳐야만 서버가 실행되므로 항상 null이 아님.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return await bcrypt.hash(refreshToken, saltRound!);
  }

  /**
   * Refresh Token 검증.
   * @param refreshToken Refresh Token
   * @returns 디코딩된 Refresh Token
   */
  async verifyRefreshToken(refreshToken: string) {
    try {
      const decodedToken = this.jwtService.verify<DecodedToken>(refreshToken);
      const user = await this.usersRepository.findOneById(decodedToken.id);
      if (!user) throw new BadRequestException('존재하지 않는 회원입니다.');

      await this.valideteRefreshToken(user.refreshToken, refreshToken);

      return decodedToken;
    } catch (e: any) {
      if (e instanceof Error && e.name === 'TokenExpiredError')
        throw new UnauthorizedException('만료된 토큰입니다.');
      if (e instanceof Error && e.name === 'JsonWebTokenError')
        throw new UnauthorizedException('유효하지 않은 토큰입니다.');
      throw e;
    }
  }

  private async valideteRefreshToken(
    usersRefresh: string | null,
    refresh: string,
  ) {
    if (!usersRefresh)
      throw new NotFoundException('발급한 토큰이 존재하지 않습니다.');
    if (!(await bcrypt.compare(refresh, usersRefresh)))
      throw new UnauthorizedException('토큰이 일치하지 않습니다.');
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

  async validateEmail(email: string): Promise<Partial<User>> {
    const user = await this.usersRepository.findOneByEmail(email);
    if (!user) throw new BadRequestException('존재하지 않는 회원입니다.');

    const se: Partial<User> = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return se;
  }
}
