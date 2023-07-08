import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';
import { hashPassword } from '../util/password';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  /**
   *
   * @param dto 회원 생성 dto
   * @returns 생성된 회원 정보
   */
  async createUser(dto: CreateUserDto): Promise<UserEntity> {
    const { email, name, nickname, password } = dto;

    const findUser = await this.usersRepository.findOneBy({
      email: email,
    });

    if (findUser) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    return this.usersRepository.save(
      UserEntity.of(email, name, nickname, await hashPassword(password)),
    );
  }
}
