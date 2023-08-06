import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';

const mockUsersRepository = {
  findOneByEmail: jest.fn(),
  save: jest.fn((value) => value),
};

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: mockUsersRepository },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  it('회원가입 성공', async () => {
    // given
    const createUserDto = createUserDtoFactory.create(
      'test@eaxmple.com',
      'NAME',
      'NICKNAME',
      'PASSWORD',
    );
    jest.spyOn(usersRepository, 'findOneByEmail').mockResolvedValue(null);

    // when
    const user = await usersService.createUser(createUserDto);

    // then
    expect(user.email).toEqual('test@eaxmple.com');
  });

  it('회원가입 이메일 중복', async () => {
    // given
    const createUserDto = createUserDtoFactory.create(
      'test@eaxmple.com',
      'NAME',
      'NICKNAME',
      'PASSWORD',
    );
    const user = new User();
    user.email = createUserDto.email;
    user.nickname = createUserDto.nickname;
    user.password = createUserDto.password;
    jest.spyOn(usersRepository, 'findOneByEmail').mockResolvedValue(user);

    // when
    await expect(async () => {
      await usersService.createUser(createUserDto);
    }).rejects.toThrowError(
      new BadRequestException('이미 존재하는 이메일입니다.'),
    );
  });
});

class createUserDtoFactory {
  static create(
    email: string,
    name: string,
    nickname: string,
    password: string,
  ) {
    const dto = new CreateUserDto();
    dto.email = email;
    dto.nickname = nickname;
    dto.password = password;

    return dto;
  }
}
