import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersTypeormRepository } from './users-typeorm.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { hashPassword } from '../../utils/password';
import { ConflictNicknameException } from './exception/conflictNickname.exception';
import { ConflictEmailException } from './exception/conflictEmail.exception';

@Injectable()
export class UsersService {
  constructor(
    private readonly UsersTypeormRepository: UsersTypeormRepository,
  ) {}

  async createUser(dto: CreateUserDto): Promise<void> {
    const { email, nickname, password } = dto;

    const findUserByEmail = await this.UsersTypeormRepository.findOneByEmail(
      email,
    );
    if (findUserByEmail) {
      throw new ConflictEmailException();
    }

    const findUserByNickname =
      await this.UsersTypeormRepository.findOneByNickname(nickname);
    if (findUserByNickname) {
      throw new ConflictNicknameException();
    }

    const user = User.create(email, nickname, await hashPassword(password));

    await this.UsersTypeormRepository.save(user);
  }

  async getProfile(userId: number): Promise<Partial<User>> {
    // userId가 undefined면 다른 데이터를 가져옴 (typeorm)
    const user = await this.UsersTypeormRepository.findOneById(userId);
    this.existUser(user);
    const profile: Partial<User> = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      profileImage: user.profileImage,
      role: user.role,
      createAt: user.createAt,
    };

    return profile;
  }

  private existUser(user: User | null): asserts user is User {
    if (!user) throw new NotFoundException('존재하지 않는 회원입니다.');
  }
}
