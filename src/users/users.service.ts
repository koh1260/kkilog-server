import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { hashPassword } from '../utils/password';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  /**
   *
   * @param dto 회원 생성 dto
   * @returns 생성된 회원 정보
   */
  async createUser(dto: CreateUserDto): Promise<User> {
    const { email, name, nickname, password } = dto;

    const findUser = await this.usersRepository.findOneByEmail(email);

    if (findUser) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    return this.usersRepository.save(
      User.create(email, name, nickname, await hashPassword(password)),
    );
  }
}
