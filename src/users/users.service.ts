import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { hashPassword } from '../utils/password';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const { email, nickname, password } = dto;
    const findUser = await this.usersRepository.findOneByEmail(email);

    if (findUser) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }
    const user = User.of(email, nickname, await hashPassword(password));

    return this.usersRepository.save(user);
  }

  async getProfile(userId: number): Promise<Partial<User>> {
    const user = this.existUser(await this.usersRepository.findOneById(userId));
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

  private existUser(user: User | null): User {
    if (!user) throw new NotFoundException('존재하지 않는 회원입니다.');
    return user;
  }
}
