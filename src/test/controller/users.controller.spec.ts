import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../modules/users/users.controller';
import { UsersService } from '../../modules/users/users.service';
import { UsersRepository } from './users-typeorm.repository';
import { AuthService } from '../../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../../modules/users/dto/request/create-user.dto';
import { User } from '../../modules/users/entities/user.entity';
import { UserInfo } from '../../auth/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        AuthService,
        UsersRepository,
        JwtService,
        ConfigService,
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  it('createUser', async () => {
    // given
    const email = 'EMAIL@example.com';
    const nickname = 'NICKNAME';
    const password = 'PASSWORD';
    const createUserDto = CreateUserDto.create(email, nickname, password);

    const user = new User();
    user.email = createUserDto.email;
    user.nickname = createUserDto.nickname;
    user.password = createUserDto.password;
    jest.spyOn(usersService, 'createUser').mockResolvedValue(user);

    // when
    const newUser = await usersController.createUser(createUserDto);

    // then
    expect(usersService.createUser).toHaveBeenCalledWith(createUserDto);
    expect(newUser.email).toEqual(createUserDto.email);
  });

  it('login', async () => {
    // given
    const logindUser: UserInfo = {
      id: 1,
      email: 'EMAIL@exampl.com',
      nickname: 'NICKNAME',
    };
    const token = {
      accessToken: 'TOKEN',
      refreshToken: 'REFRESH',
    };
    const user = User.create(logindUser.email, logindUser.nickname, 'password');
    jest.spyOn(authService, 'login').mockResolvedValue(token);
    jest.spyOn(usersService, 'getProfile').mockResolvedValue(user);
    // when
    const res = {
      header: jest.fn(),
      cookie: jest.fn(),
      status: jest.fn(() => res),
      send: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;
    const tokenObj = await usersController.login(res, logindUser);

    // then
    // expect(authService.login).toHaveBeenCalled();
  });
});
