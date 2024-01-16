import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PostsLikeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: PostLikeEntity) {
    await this.prisma.postLike.create({
      data: data,
    });
  }

  async findOne(postId: number, userId: number) {
    return await this.prisma.postLike.findFirst({
      where: { postId, userId },
    });
  }

  async count(postId: number) {
    return await this.prisma.postLike.count({
      where: { postId },
    });
  }
}
