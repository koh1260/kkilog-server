import { Test, TestingModule } from '@nestjs/testing';
import { AuthService, DecodedToken } from '../../auth/auth.service';
import { UsersRepository } from '../../modules/users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../modules/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { TestTypeOrmModule } from '../db/test-db.module';
import { CustomTypeOrmModule } from '../../config/typeorm/custom-typeorm-module';
import * as pwd from '../../utils/password/index';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserInfo } from '../../auth/jwt.strategy';
import * as bcrypt from 'bcrypt';
import { TokenExpiredError } from 'jsonwebtoken';

describe('AuthService', () => {
  let authService: AuthService;
  let usersRepository: UsersRepository;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestTypeOrmModule,
        CustomTypeOrmModule.forCustomRepository([UsersRepository]),
      ],
      providers: [AuthService, JwtService, ConfigService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('회원 검증 성공', async () => {
    // given
    const user = createUser(1, 'test@test.com', 'password', 'nickname');
    const savedUser = await usersRepository.save(user);
    jest.spyOn(pwd, 'comparePassword').mockResolvedValue(true);

    // when
    const logiendUserInfo = await authService.validateUser(
      user.email,
      user.password,
    );

    // then
    expect(logiendUserInfo?.id).toEqual(savedUser.id);
    expect(logiendUserInfo?.email).toEqual(savedUser.email);
    expect(logiendUserInfo?.nickname).toEqual(savedUser.nickname);
  });

  it('존재하지 않는 이메일로 회원 검증 시 예외 발생', async () => {
    // given
    const nonExistUserEmail = 'nonexist@test.com';
    const password = 'password';
    jest.spyOn(pwd, 'comparePassword').mockResolvedValue(false);

    // when
    // then
    await expect(
      async () => await authService.validateUser(nonExistUserEmail, password),
    ).rejects.toThrowError(new NotFoundException('존재하지 않는 회원입니다.'));
  });

  it('잘못된 비밀번호로 회원 검증 시 예외 발생', async () => {
    // given
    const user = createUser(1, 'test@test.com', 'password', 'nickname');
    const wrongPassword = 'wrongpassword';
    await usersRepository.save(user);
    jest.spyOn(pwd, 'comparePassword').mockResolvedValue(false);

    // when
    // then
    await expect(
      async () => await authService.validateUser(user.email, wrongPassword),
    ).rejects.toThrowError(
      new BadRequestException('비밀번호가 일치하지 않습니다.'),
    );
  });

  it('Access Token 생성', async () => {
    // given
    const userInfo = createUserInfo(1, 'test@test.com', 'nickname');
    const token = 'ACCESSTOKEN';
    jest.spyOn(jwtService, 'signAsync').mockResolvedValue(token);

    // when
    const accessToken = await authService.generateAccessToken(userInfo);

    // then
    expect(accessToken).toEqual(token);
  });

  it('Refresh Token 생성', async () => {
    // given
    const userInfo = createUserInfo(1, 'test@test.com', 'nickname');
    const token = 'REFRESHTOKEN';
    jest.spyOn(jwtService, 'signAsync').mockResolvedValue(token);

    // when
    const refreshToken = await authService.generateRefreshToken(userInfo);

    // then
    expect(refreshToken).toEqual(token);
  });

  it('Access Token 재생성', async () => {
    // given
    const user = createUser(1, 'test@test.com', 'password', 'nickname');
    const mockToken = 'AccessToken';
    await usersRepository.save(user);
    jest
      .spyOn(authService, 'generateAccessToken')
      .mockImplementation(async () => mockToken);

    // when
    const token = await authService.regenerateAccessToken(user.id);

    // then
    expect(authService.generateAccessToken).toHaveBeenCalled();
    expect(token).toEqual(mockToken);
  });

  it('존재하지 않는 회원 정보로 Access Token 재생성 시 예외 발생', async () => {
    // given
    const nonExistUserId = 231;
    const mockToken = 'AccessToken';
    jest
      .spyOn(authService, 'generateAccessToken')
      .mockImplementation(async () => mockToken);

    // when
    // then
    await expect(
      async () => await authService.regenerateAccessToken(nonExistUserId),
    ).rejects.toThrowError(new NotFoundException('존재하지 않는 회원입니다.'));
  });

  it('Refresh Token DB에 저장', async () => {
    // given
    const user = createUser(1, 'test@test.com', 'password', 'nickname');
    await usersRepository.save(user);
    const mockRefreshToken = 'RefreshToken';
    jest
      .spyOn(authService, 'gethashedRefreshToken')
      .mockResolvedValue(`Hashed${mockRefreshToken}`);

    // when
    await authService.setRefreshToken(user.id, mockRefreshToken);
    const token = (await usersRepository.findOneById(user.id))?.refreshToken;

    // then
    expect(token).toEqual(`Hashed${mockRefreshToken}`);
  });

  it('Refresh Token 해싱', async () => {
    // given
    const mockRefreshToken = 'RefreshToken';
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation(() => `Hashed${mockRefreshToken}`);

    // when
    const hashedToken = await authService.gethashedRefreshToken(
      mockRefreshToken,
    );

    // then
    expect(bcrypt.hash).toHaveBeenCalled();
    expect(hashedToken).toEqual(`Hashed${mockRefreshToken}`);
  });

  it('Refresh Token 검증', async () => {
    // given
    const mockRefreshToken = 'RefreshToken';
    const user = createUser(1, 'test@test.com', 'password', 'nickname');
    user.refreshToken = mockRefreshToken;
    await usersRepository.save(user);
    const mockDecodedToken: DecodedToken = {
      id: user.id,
      iat: 123123,
      exp: 999999999,
    };
    jest.spyOn(jwtService, 'verify').mockReturnValue(mockDecodedToken);
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);

    // when
    const decodedToken = await authService.verifyRefreshToken(mockRefreshToken);

    // then
    expect(decodedToken).toEqual(mockDecodedToken);
    expect(jwtService.verify).toHaveBeenCalled();
    expect(bcrypt.compare).toHaveBeenCalled();
  });

  it('만료된 Refresh Token으로 검증 시 예외 발생', async () => {
    // given
    const ExpiredRefreshToken = 'ExpiredRefreshToken';
    jest.spyOn(jwtService, 'verify').mockImplementation(() => {
      throw new TokenExpiredError('message', new Date());
    });

    // when
    // then
    await expect(
      async () => await authService.verifyRefreshToken(ExpiredRefreshToken),
    ).rejects.toThrowError(new UnauthorizedException('만료된 토큰입니다.'));
  });

  it('존재하지 않는 회원의 Refresh Token 검증 시 예외 발생', async () => {
    // given
    const mockRefreshToken = 'RefreshToken';
    const nonExistUserId = 3123;
    const mockDecodedToken: DecodedToken = {
      id: nonExistUserId,
      iat: 123123,
      exp: 999999999,
    };
    jest.spyOn(jwtService, 'verify').mockReturnValue(mockDecodedToken);

    // when
    // then
    await expect(
      async () => await authService.verifyRefreshToken(mockRefreshToken),
    ).rejects.toThrowError(new NotFoundException('존재하지 않는 회원입니다.'));
  });

  it('Refresh Token 검증 시 해당 회원이 토큰을 가지고 있지 않을 경우 예외 발생', async () => {
    // given
    const mockRefreshToken = 'RefreshToken';
    const user = createUser(1, 'test@test.com', 'password', 'nickname');
    await usersRepository.save(user);
    const mockDecodedToken: DecodedToken = {
      id: user.id,
      iat: 123123,
      exp: 999999999,
    };
    jest.spyOn(jwtService, 'verify').mockReturnValue(mockDecodedToken);

    // when
    // then
    await expect(
      async () => await authService.verifyRefreshToken(mockRefreshToken),
    ).rejects.toThrowError(
      new NotFoundException('발급한 토큰이 존재하지 않습니다.'),
    );
  });

  it('Refresh Token 검증 시 회원이 가지고 있는 토큰과 일치하지 않을 경우 예외 발생', async () => {
    // given
    const mockRefreshToken = 'RefreshToken';
    const usersToken = 'UsersToken';
    const user = createUser(1, 'test@test.com', 'password', 'nickname');
    user.refreshToken = usersToken;
    await usersRepository.save(user);
    const mockDecodedToken: DecodedToken = {
      id: user.id,
      iat: 123123,
      exp: 999999999,
    };
    jest.spyOn(jwtService, 'verify').mockReturnValue(mockDecodedToken);
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => false);

    // when
    // then
    await expect(
      async () => await authService.verifyRefreshToken(mockRefreshToken),
    ).rejects.toThrowError(
      new UnauthorizedException('토큰이 일치하지 않습니다.'),
    );
  });
});

const createUser = (
  id: number,
  email: string,
  password: string,
  nickname: string,
) => {
  const user = User.create(email, password, nickname);
  user.id = id;

  return user;
};

const createUserInfo = (id: number, email: string, nickname: string) => {
  return {
    id,
    email,
    nickname,
  } as UserInfo;
};
