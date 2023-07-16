import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, AuthService, UsersRepository, JwtService],
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
    const createUserDto = new CreateUserDto();
    createUserDto.email = 'EMAIL@example.com';
    createUserDto.name = 'NAME';
    createUserDto.nickname = 'NICKNAME';
    createUserDto.password = 'PASSWORD';

    const user = User.create(
      createUserDto.email,
      createUserDto.name,
      createUserDto.nickname,
      createUserDto.password,
    );
    jest.spyOn(usersService, 'createUser').mockResolvedValue(user);

    // when
    const newUser = await usersController.createUser(createUserDto);

    // then
    expect(usersService.createUser).toHaveBeenCalledWith(createUserDto);
    expect(newUser.email).toEqual(createUserDto.email);
  });

  it('login', async () => {
    // given
    const request = {
      user: {
        email: 'EMAIL@example.com',
        name: 'NAME',
        nickname: 'NICKNAME',
      },
    };
    const token = {
      accessToken: 'TOKEN',
    };
    jest.spyOn(authService, 'login').mockResolvedValue(token);

    // when
    const tokenObj = await usersController.login(request);

    // then
    expect(authService.login).toHaveBeenCalledWith(request.user);
    expect(tokenObj.accessToken).toEqual(token.accessToken);
  });
});
