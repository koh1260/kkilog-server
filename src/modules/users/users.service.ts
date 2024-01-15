import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from '../../utils/password';
import { ConflictNicknameException } from './exception/conflictNickname.exception';
import { ConflictEmailException } from './exception/conflictEmail.exception';
import { UsersRepository } from './users.repository';
import { CreateUserData, Profile } from './type';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(dto: CreateUserDto): Promise<void> {
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

    const userData: CreateUserData = {
      email,
      nickname,
      password: await hashPassword(password),
    };

    await this.usersRepository.create(userData);
  }

  async getProfile(userId: number) {
    const user = await this.usersRepository.findOneById(userId);
    if (!user) throw new BadRequestException('존재하지 않는 회원입니다.');

    const profile: Profile = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      profileImage: user.profileImage,
      role: user.role,
      createAt: user.createAt,
    };

    return profile;
  }
}
