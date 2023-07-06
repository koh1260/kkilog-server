import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';
import generateHashKey from 'src/auth/generate-hash-key';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: UsersRepository,
  ) {}

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

    const key = await generateHashKey();

    return this.usersRepository.save(
      UserEntity.of(email, name, nickname, await bcrypt.hash(password, 10)),
    );
  }

  /**
   *
   * @param email 회원 이메일
   * @returns email로 검색한 회원
   */
  async findOne(email: string): Promise<UserEntity> {
    const foundUser = this.usersRepository.findOneBy({
      email: email,
    });

    if (!foundUser) {
      throw new NotFoundException('존재하지 않는 회원입니다.');
    }

    return foundUser;
  }
}
