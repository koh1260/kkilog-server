import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../auth/auth.service';
import { UsersRepository } from '../../users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../users/user.entity';
import { ConfigService } from '@nestjs/config';
import { TestTypeOrmModule } from '../../common/test-database/test-db.module';
import { CustomTypeOrmModule } from '../../common/custom-repository/custom-typeorm-module';
import * as pwd from '../../utils/password/index';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserInfo } from '../../auth/jwt.strategy';

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
    const user = createUser('test@test.com', 'password', 'nickname');
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
    const user = createUser('test@test.com', 'password', 'nickname');
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
});

const createUser = (email: string, password: string, nickname: string) => {
  return User.of(email, password, nickname);
};

const createUserInfo = (id: number, email: string, nickname: string) => {
  return {
    id,
    email,
    nickname,
  } as UserInfo;
};
