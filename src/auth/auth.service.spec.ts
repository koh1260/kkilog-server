import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersRepository } from '../users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from '../utils/password';
import { User } from '../users/user.entity';

jest.mock('../utils/password');

describe('AuthService', () => {
  let authService: AuthService;
  let usersRepository: UsersRepository;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, JwtService, UsersRepository],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('validateUser 인증 완료', async () => {
    // given
    const email = 'EMAIL@example.com';
    const password = 'PASSWORD';
    const findUser = new User();
    findUser.email = email;
    findUser.name = 'NAME';
    findUser.nickname = 'NICKNAME';

    jest.spyOn(usersRepository, 'findOneByEmail').mockResolvedValue(findUser);
    (comparePassword as jest.Mock).mockResolvedValue(true);

    // when
    const logiendUserInfo = await authService.validateUser(email, password);

    // then
    expect(logiendUserInfo.email).toEqual(email);
  });

  it('validateUser 인증 실패', async () => {
    // given
    const email = 'EMAIL@example.com';
    const password = 'PASSWORD';
    jest.spyOn(usersRepository, 'findOneByEmail').mockResolvedValue(null);
    (comparePassword as jest.Mock).mockResolvedValue(false);

    // when
    const logiendUserInfo = await authService.validateUser(email, password);

    // then
    expect(logiendUserInfo).toEqual(null);
  });

  it('login access token 생성', async () => {
    // given
    const user = {
      email: 'email@example.com',
      name: 'NAME',
      nickname: 'NICKNAME',
    };
    const token = 'ACCESSTOKEN';
    jest.spyOn(jwtService, 'sign').mockReturnValue(token);

    // when
    const accessToken = await authService.login(user);

    // then
    expect(accessToken.accessToken).toEqual(token);
    expect(jwtService.sign).toHaveBeenCalledWith(user);
  });
});
