import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserData } from './type';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserData) {
    return await this.prisma.user.create({
      data,
    });
  }

  async findOneById(id: number) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findOneByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * TODO
   * nickname 컬럼 unique로 변경, findFirst -> findUnique
   */
  async findOneByNickname(nickname: string) {
    return await this.prisma.user.findFirst({
      where: { nickname },
    });
  }
}
