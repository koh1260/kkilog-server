import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { hashPassword } from '../../utils/password';
import { ConflictNicknameException } from './exception/conflictNickname.exception';
import { ConflictEmailException } from './exception/conflictEmail.exception';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const { email, nickname, password } = dto;

    const findUserByEmail = await this.usersRepository.findOneByEmail(email);
    if (findUserByEmail) {
      throw new ConflictEmailException();
    }

    const findUserByNickname = await this.usersRepository.findOneByNickname(
      nickname,
    );
    if (findUserByNickname) {
      throw new ConflictNicknameException();
    }

    const user = User.create(email, nickname, await hashPassword(password));

    return this.usersRepository.save(user);
  }

  async getProfile(userId: number): Promise<Partial<User>> {
    const user = await this.usersRepository.findOneById(userId);
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
