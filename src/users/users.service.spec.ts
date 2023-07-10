import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { BadRequestException } from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, UsersRepository],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  it('회원가입 성공', async () => {
    // given
    const dto = new CreateUserDto();
    dto.email = 'test@eaxmple.com';
    dto.name = 'NAME';
    dto.nickname = 'NICKNAME';
    dto.password = 'PASSWORD';
    const findUser = User.create(
      dto.email,
      dto.name,
      dto.nickname,
      dto.password,
    );
    jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(null);
    jest.spyOn(usersRepository, 'save').mockResolvedValue(findUser);

    // when
    const user = await usersService.createUser(dto);

    // then
    expect(user.name).toEqual('NAME');
  });

  it('회원가입 이메일 중복', async () => {
    // given
    const dto = new CreateUserDto();
    dto.email = 'test@eaxmple.com';
    dto.name = 'NAME';
    dto.nickname = 'NICKNAME';
    dto.password = 'PASSWORD';
    const findUser = User.create(
      dto.email,
      dto.name,
      dto.nickname,
      dto.password,
    );
    jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(findUser);
    jest.spyOn(usersRepository, 'save').mockResolvedValue(findUser);

    // when
    await expect(async () => {
      await usersService.createUser(dto);
    }).rejects.toThrowError(
      new BadRequestException('이미 존재하는 이메일입니다.'),
    );
  });
});
