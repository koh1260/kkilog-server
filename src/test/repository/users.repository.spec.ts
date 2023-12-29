import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../modules/users/entities/user.entity';
import { UsersRepository } from '../../modules/users/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomTypeOrmModule } from '../../config/typeorm/custom-typeorm-module';
import { Post } from '../../modules/posts/entities/post.entity';
import { TestTypeOrmModule } from '../db/test-db.module';

describe('UsersRepository', () => {
  let repository: UsersRepository;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        TestTypeOrmModule,
        TypeOrmModule.forFeature([User, Post]),
        CustomTypeOrmModule.forCustomRepository([UsersRepository]),
      ],
    }).compile();

    repository = module.get<UsersRepository>(UsersRepository);
  });

  it('이메일로 검색', async () => {
    // given
    const user = createUser(1);
    await repository.save(user);

    // when
    const foundUser = await repository.findOneByEmail(user.email);

    // then
    expect(foundUser?.email).toEqual(user.email);
  });

  it('존재하지 않는 이메일로 검색', async () => {
    // given
    const email = 'test@test.com';

    // when
    const expectNull = await repository.findOneByEmail(email);

    // then
    expect(expectNull).toBeNull();
  });

  it('회원 번호로 검색', async () => {
    // given
    const user = createUser(1);
    await repository.save(user);

    // when
    const foundUser = await repository.findOneById(user.id);

    // then
    expect(foundUser?.id).toBeDefined();
  });

  it('존재하지 않는 회원 번호로 검색', async () => {
    // given
    const id = 1;

    // when
    const expectNull = await repository.findOneById(id);

    // then
    expect(expectNull).toBeNull();
  });
});

const createUser = (id: number) => {
  const user = new User();
  user.id = id;
  user.email = 'test@test.com';
  user.nickname = 'nickname';
  user.password = 'password';

  return user;
};
