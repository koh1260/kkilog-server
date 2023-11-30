import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../modules/users/users.service';
import { UsersRepository } from '../../modules/users/users.repository';
import { CreateUserDto } from '../../modules/users/dto/create-user.dto';
import { User } from '../../modules/users/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TestTypeOrmModule } from '../db/test-db.module';
import { CustomTypeOrmModule } from '../../config/typeorm/custom-typeorm-module';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestTypeOrmModule,
        CustomTypeOrmModule.forCustomRepository([UsersRepository]),
      ],
      providers: [UsersService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  it('회원 정보 조회', async () => {
    // given
    const user = createUser(52, 'test@test.com', 'nickname');
    await usersRepository.save(user);

    // when
    const foundUser = await usersService.getProfile(user.id);

    // then
    expect(foundUser.id).toEqual(user.id);
    expect(foundUser.email).toEqual(user.email);
  });

  it('존재하지 않는 회원 번호로 회원 정보 조회 시 예외 발생', async () => {
    // given
    const nonExistUserId = 1225;

    await expect(
      // when
      async () => await usersService.getProfile(nonExistUserId),
    ).rejects.toThrowError(new NotFoundException('존재하지 않는 회원입니다.')); // then
  });

  it('회원가입 성공', async () => {
    // given
    const createUserDto = createUserDtoFactory(
      'test@eaxmple.com',
      'NICKNAME',
      'PASSWORD',
    );

    // when
    const user = await usersService.createUser(createUserDto);

    // then
    expect((await usersService.getProfile(user.id)).email).toEqual(
      'test@eaxmple.com',
    );
  });

  it('회원가입 이메일 중복', async () => {
    // given
    const createUserDto = createUserDtoFactory(
      'test@eaxmple.com',
      'NICKNAME',
      'PASSWORD',
    );
    await usersService.createUser(createUserDto);

    // when
    // then
    await expect(
      async () => await usersService.createUser(createUserDto),
    ).rejects.toThrowError(
      new BadRequestException('이미 존재하는 이메일입니다.'),
    );
  });
});

const createUserDtoFactory = (
  email: string,
  nickname: string,
  password: string,
) => {
  const dto = new CreateUserDto();
  dto.email = email;
  dto.nickname = nickname;
  dto.password = password;

  return dto;
};

const createUser = (id: number, email: string, nickname: string) => {
  const user = User.of(email, nickname, 'password');
  user.id = id;

  return user;
};
